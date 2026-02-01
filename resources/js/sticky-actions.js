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
    setTimeout(initStickyActions, 50);
});

function initStickyActions() {
    const tables = document.querySelectorAll('.fi-ta[data-sticky-actions]');

    tables.forEach(function(table) {
        const container = table.querySelector('.fi-ta-ctn');
        if (!container) return;

        // Detect and set background colors
        detectColors(table, container);

        // Setup scroll shadow
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

function getBackgroundColor(element) {
    if (!element) return null;

    let current = element;
    while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const bg = style.backgroundColor;

        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            // Check if it's not semi-transparent
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
                const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1;
                if (alpha >= 0.9) {
                    return bg;
                }
            } else {
                return bg;
            }
        }
        current = current.parentElement;
    }
    return null;
}

function detectColors(table, container) {
    // Get container background
    const containerBg = getBackgroundColor(container);
    if (containerBg) {
        table.style.setProperty('--fi-ta-bg', containerBg);
    }

    // Get striped row background - find a striped row and get its computed color
    const stripedRow = table.querySelector('.fi-ta-row.fi-striped');
    if (stripedRow) {
        // For striped, we need to get the actual rendered color
        // Create a temp element to compute the mixed color
        const stripedBg = getBackgroundColor(stripedRow);
        if (stripedBg) {
            table.style.setProperty('--fi-ta-bg-striped', stripedBg);
        } else if (containerBg) {
            // If striped row has semi-transparent bg, mix with container
            table.style.setProperty('--fi-ta-bg-striped', containerBg);
        }
    }
}
