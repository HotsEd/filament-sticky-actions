/**
 * Filament Sticky Actions - Scroll Shadow Handler
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
