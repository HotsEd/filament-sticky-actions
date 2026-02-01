/**
 * Filament Sticky Actions - Scroll Shadow Handler & Color Detection
 */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyActions);
} else {
    initStickyActions();
}

// Re-init on Livewire events
document.addEventListener('livewire:navigated', initStickyActions);
document.addEventListener('livewire:updated', function() {
    setTimeout(initStickyActions, 50);
});

// Watch for theme changes (dark/light mode)
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
            initStickyActions();
        }
    });
});

observer.observe(document.documentElement, { attributes: true });

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

        // Detect striped row background - blend with container if semi-transparent
        const stripedRow = table.querySelector('.fi-ta-row.fi-striped');
        if (stripedRow && containerBg) {
            const stripedBg = getStripedBackgroundColor(stripedRow, containerBg);
            if (stripedBg) {
                table.style.setProperty('--fi-ta-bg-striped', stripedBg);
            }
        }

        // Setup scroll shadow
        setupScrollShadow(table, container);
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

function getStripedBackgroundColor(stripedRow, containerBg) {
    const style = window.getComputedStyle(stripedRow);
    const bg = style.backgroundColor;

    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        return containerBg;
    }

    // Parse the background color
    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return bg;

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

    // If fully opaque, return as-is
    if (a >= 0.99) return bg;

    // Blend with container background
    const containerMatch = containerBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!containerMatch) return bg;

    const cr = parseInt(containerMatch[1]);
    const cg = parseInt(containerMatch[2]);
    const cb = parseInt(containerMatch[3]);

    // Alpha blending
    const blendedR = Math.round(r * a + cr * (1 - a));
    const blendedG = Math.round(g * a + cg * (1 - a));
    const blendedB = Math.round(b * a + cb * (1 - a));

    return `rgb(${blendedR}, ${blendedG}, ${blendedB})`;
}

function setupScrollShadow(table, container) {
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
}
