/**
 * Filament Sticky Actions - Scroll Shadow Handler & Color Detection
 */
document.addEventListener('DOMContentLoaded', function() {
    initStickyActions();
});

document.addEventListener('livewire:navigated', function() {
    initStickyActions();
});

document.addEventListener('livewire:updated', function() {
    initStickyActions();
});

function initStickyActions() {
    const tables = document.querySelectorAll('.fi-ta[data-sticky-actions]');

    tables.forEach(function(table) {
        const container = table.querySelector('.fi-ta-ctn');
        if (!container) return;

        // Detect background colors
        detectAndSetColors(table);

        // Find the scrollable element
        const tableWrapper = container.querySelector('table')?.parentElement;
        if (!tableWrapper) return;

        function updateShadow() {
            const scrollLeft = tableWrapper.scrollLeft;
            const scrollWidth = tableWrapper.scrollWidth;
            const clientWidth = tableWrapper.clientWidth;

            const hasScroll = scrollWidth > clientWidth;
            const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

            if (hasScroll && !isAtEnd) {
                table.setAttribute('data-sticky-shadow', '');
            } else {
                table.removeAttribute('data-sticky-shadow');
            }
        }

        updateShadow();
        tableWrapper.addEventListener('scroll', updateShadow, { passive: true });
        window.addEventListener('resize', updateShadow, { passive: true });
    });
}

/**
 * Get the actual background color by traversing up the DOM tree
 */
function getEffectiveBackgroundColor(element) {
    let current = element;

    while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const bg = style.backgroundColor;

        // Check if it's a real color (not transparent)
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            return bg;
        }

        current = current.parentElement;
    }

    return null;
}

function detectAndSetColors(table) {
    // 1. Detect header color - look at thead, then tr, then th
    const thead = table.querySelector('thead');
    const theadRow = table.querySelector('thead tr');
    const theadCell = table.querySelector('thead th');

    let headerBg = null;
    if (thead) headerBg = getEffectiveBackgroundColor(thead);
    if (!headerBg && theadRow) headerBg = getEffectiveBackgroundColor(theadRow);
    if (!headerBg && theadCell) headerBg = getEffectiveBackgroundColor(theadCell);

    if (headerBg) {
        table.style.setProperty('--sticky-actions-bg-header', headerBg);
    }

    // 2. Detect regular row color - from container or non-striped row
    const container = table.querySelector('.fi-ta-ctn');
    const regularRow = table.querySelector('.fi-ta-row:not(.fi-striped)');
    const regularCell = table.querySelector('.fi-ta-row:not(.fi-striped) > td');

    let regularBg = null;
    if (regularCell) regularBg = getEffectiveBackgroundColor(regularCell);
    if (!regularBg && regularRow) regularBg = getEffectiveBackgroundColor(regularRow);
    if (!regularBg && container) regularBg = getEffectiveBackgroundColor(container);

    if (regularBg) {
        table.style.setProperty('--sticky-actions-bg', regularBg);
    }

    // 3. Detect striped row color
    const stripedRow = table.querySelector('.fi-ta-row.fi-striped');
    const stripedCell = table.querySelector('.fi-ta-row.fi-striped > td');

    let stripedBg = null;
    if (stripedCell) stripedBg = getEffectiveBackgroundColor(stripedCell);
    if (!stripedBg && stripedRow) stripedBg = getEffectiveBackgroundColor(stripedRow);

    if (stripedBg) {
        table.style.setProperty('--sticky-actions-bg-striped', stripedBg);
    }
}
