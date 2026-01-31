/**
 * Filament Sticky Actions - Scroll Shadow Handler & Color Detection
 */
document.addEventListener('DOMContentLoaded', function() {
    initStickyActions();
});

// Re-init on Livewire navigation (for SPA-like behavior)
document.addEventListener('livewire:navigated', function() {
    initStickyActions();
});

// Re-init after Livewire updates
document.addEventListener('livewire:updated', function() {
    initStickyActions();
});

function initStickyActions() {
    const tables = document.querySelectorAll('.fi-ta[data-sticky-actions]');

    tables.forEach(function(table) {
        const container = table.querySelector('.fi-ta-ctn');
        if (!container) return;

        // Detect background colors from the container
        detectAndSetColors(table, container);

        // Find the actual scrollable element (the table wrapper)
        const tableWrapper = container.querySelector('table')?.parentElement;
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
    });
}

function detectAndSetColors(table, container) {
    // Get computed background color of the container
    const containerStyle = window.getComputedStyle(container);
    const bgColor = containerStyle.backgroundColor;

    // Set the CSS variable on the table
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        table.style.setProperty('--sticky-actions-bg', bgColor);
    }

    // Try to detect striped row color by finding a striped row
    const stripedRow = table.querySelector('.fi-ta-row.fi-striped > td');
    if (stripedRow) {
        const stripedStyle = window.getComputedStyle(stripedRow);
        const stripedBg = stripedStyle.backgroundColor;
        if (stripedBg && stripedBg !== 'rgba(0, 0, 0, 0)' && stripedBg !== 'transparent') {
            table.style.setProperty('--sticky-actions-bg-striped', stripedBg);
        }
    }
}
