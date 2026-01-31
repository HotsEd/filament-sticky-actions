/**
 * Filament Sticky Actions - Scroll Shadow Handler
 *
 * Adds/removes shadow based on horizontal scroll position
 */
document.addEventListener('DOMContentLoaded', function() {
    initStickyActions();
});

// Re-init on Livewire navigation (for SPA-like behavior)
document.addEventListener('livewire:navigated', function() {
    initStickyActions();
});

function initStickyActions() {
    const tables = document.querySelectorAll('.fi-ta[data-sticky-actions]');

    tables.forEach(function(table) {
        const scrollContainer = table.querySelector('.fi-ta-ctn');
        if (!scrollContainer) return;

        // Find the actual scrollable element (the table wrapper)
        const tableWrapper = scrollContainer.querySelector('table')?.parentElement;
        if (!tableWrapper) return;

        // Check scroll and update shadow
        function updateShadow() {
            const scrollLeft = tableWrapper.scrollLeft;
            const scrollWidth = tableWrapper.scrollWidth;
            const clientWidth = tableWrapper.clientWidth;

            // Show shadow if there's content scrolled to the left (not at the end)
            const hasScroll = scrollWidth > clientWidth;
            const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1; // 1px tolerance

            if (hasScroll && !isAtEnd) {
                table.setAttribute('data-sticky-shadow', '');
            } else {
                table.removeAttribute('data-sticky-shadow');
            }
        }

        // Initial check
        updateShadow();

        // Listen for scroll
        tableWrapper.addEventListener('scroll', updateShadow, { passive: true });

        // Listen for resize
        window.addEventListener('resize', updateShadow, { passive: true });

        // Re-check after Livewire updates
        document.addEventListener('livewire:updated', updateShadow);
    });
}
