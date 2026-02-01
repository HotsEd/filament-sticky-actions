/**
 * Filament Sticky Actions - Scroll Shadow Handler & Color Detection
 */

(function() {
    'use strict';

    let initialized = false;

    function init() {
        if (initialized) return;
        initialized = true;

        // Run with delays to catch Livewire/Filament rendering
        detectColors();
        setTimeout(detectColors, 100);
        setTimeout(detectColors, 300);
        setTimeout(detectColors, 600);

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
                detectColors();
            }
        });

        bodyObserver.observe(document.body, { childList: true, subtree: true });

        // Watch for theme changes (dark/light mode)
        const themeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    // Clear colors and re-detect after a delay for CSS to apply
                    clearColors();
                    setTimeout(detectColors, 50);
                    setTimeout(detectColors, 150);
                }
            });
        });

        themeObserver.observe(document.documentElement, { attributes: true });
    }

    // Multiple initialization strategies for Filament/Livewire
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Filament/Livewire specific events
    document.addEventListener('livewire:navigated', function() {
        detectColors();
        setTimeout(detectColors, 100);
    });

    document.addEventListener('livewire:init', function() {
        init();
        setTimeout(detectColors, 100);
        setTimeout(detectColors, 300);
    });

    document.addEventListener('livewire:updated', function() {
        setTimeout(detectColors, 50);
    });

    // Also try on window load as fallback
    window.addEventListener('load', function() {
        init();
        detectColors();
        setTimeout(detectColors, 200);
    });

    function clearColors() {
        const tables = document.querySelectorAll('.fi-ta[data-sticky-actions]');
        tables.forEach(function(table) {
            table.style.removeProperty('--fi-ta-bg');
            table.style.removeProperty('--fi-ta-bg-striped');
        });
    }

    function detectColors() {
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

    /**
     * Convert any CSS color to RGB using a temporary canvas
     */
    function colorToRgb(colorStr) {
        if (!colorStr) return null;

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = colorStr;
        ctx.fillRect(0, 0, 1, 1);

        const data = ctx.getImageData(0, 0, 1, 1).data;
        return {
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3] / 255
        };
    }

    /**
     * Parse color string to get alpha value
     */
    function getAlpha(colorStr) {
        if (!colorStr) return 1;

        // Check for rgba
        let match = colorStr.match(/rgba?\([^)]+,\s*([\d.]+)\s*\)/);
        if (match) return parseFloat(match[1]);

        // Check for color(srgb ... / alpha)
        match = colorStr.match(/\/\s*([\d.]+)\s*\)/);
        if (match) return parseFloat(match[1]);

        // Check for oklch with alpha
        match = colorStr.match(/oklch\([^)]+\/\s*([\d.]+)\s*\)/);
        if (match) return parseFloat(match[1]);

        return 1;
    }

    function getStripedBackgroundColor(stripedRow, containerBg) {
        const style = window.getComputedStyle(stripedRow);
        const bg = style.backgroundColor;

        if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
            return containerBg;
        }

        // Get alpha from the original color string
        const alpha = getAlpha(bg);

        // If fully opaque, convert and return
        if (alpha >= 0.99) {
            const rgb = colorToRgb(bg);
            if (rgb) {
                return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            }
            return bg;
        }

        // Blend with container background
        const stripedRgb = colorToRgb(bg);
        const containerRgb = colorToRgb(containerBg);

        if (!stripedRgb || !containerRgb) return bg;

        // Blend using the alpha we extracted
        const blendedR = Math.round(stripedRgb.r * alpha + containerRgb.r * (1 - alpha));
        const blendedG = Math.round(stripedRgb.g * alpha + containerRgb.g * (1 - alpha));
        const blendedB = Math.round(stripedRgb.b * alpha + containerRgb.b * (1 - alpha));

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

})();
