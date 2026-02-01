/**
 * Filament Sticky Actions - Scroll Shadow Handler & Color Detection
 */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Run immediately
    initStickyActions();

    // Also run after a short delay (for Livewire initial render)
    setTimeout(initStickyActions, 100);
    setTimeout(initStickyActions, 500);

    // Watch for new tables being added to the DOM
    const bodyObserver = new MutationObserver(function(mutations) {
        let shouldInit = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        if (node.matches?.('[data-sticky-actions]') ||
                            node.querySelector?.('[data-sticky-actions]')) {
                            shouldInit = true;
                        }
                    }
                });
            }
        });
        if (shouldInit) {
            initStickyActions();
        }
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Watch for theme changes (dark/light mode)
    const themeObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                initStickyActions();
            }
        });
    });

    themeObserver.observe(document.documentElement, { attributes: true });
}

// Re-init on Livewire events
document.addEventListener('livewire:navigated', initStickyActions);
document.addEventListener('livewire:init', function() {
    setTimeout(initStickyActions, 100);
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

        // Detect striped row background - blend with container if semi-transparent
        const stripedRow = table.querySelector('.fi-ta-row.fi-striped');
        if (stripedRow && containerBg) {
            const stripedBg = getStripedBackgroundColor(stripedRow, containerBg);
            if (stripedBg) {
                table.style.setProperty('--fi-ta-bg-striped', stripedBg);
            }
        }

        // Setup scroll shadow (only once per table)
        if (!table.dataset.shadowInitialized) {
            setupScrollShadow(table, container);
            table.dataset.shadowInitialized = 'true';
        }
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

function parseColor(colorStr) {
    if (!colorStr) return null;

    // Handle rgba/rgb format: rgb(r, g, b) or rgba(r, g, b, a)
    let match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
        return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3]),
            a: match[4] !== undefined ? parseFloat(match[4]) : 1
        };
    }

    // Handle color(srgb r g b / a) format
    match = colorStr.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
    if (match) {
        return {
            r: Math.round(parseFloat(match[1]) * 255),
            g: Math.round(parseFloat(match[2]) * 255),
            b: Math.round(parseFloat(match[3]) * 255),
            a: match[4] !== undefined ? parseFloat(match[4]) : 1
        };
    }

    return null;
}

function getStripedBackgroundColor(stripedRow, containerBg) {
    const style = window.getComputedStyle(stripedRow);
    const bg = style.backgroundColor;

    if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        return containerBg;
    }

    const stripedColor = parseColor(bg);
    if (!stripedColor) return bg;

    // If fully opaque, return as-is
    if (stripedColor.a >= 0.99) return bg;

    // Blend with container background
    const containerColor = parseColor(containerBg);
    if (!containerColor) return bg;

    // Alpha blending
    const blendedR = Math.round(stripedColor.r * stripedColor.a + containerColor.r * (1 - stripedColor.a));
    const blendedG = Math.round(stripedColor.g * stripedColor.a + containerColor.g * (1 - stripedColor.a));
    const blendedB = Math.round(stripedColor.b * stripedColor.a + containerColor.b * (1 - stripedColor.a));

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
