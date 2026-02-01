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

        // Detect container background color
        const containerBg = getBackgroundColor(container);
        if (containerBg) {
            table.style.setProperty('--fi-ta-bg', containerBg);
        }

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
            return bg;
        }
        current = current.parentElement;
    }
    return null;
}
