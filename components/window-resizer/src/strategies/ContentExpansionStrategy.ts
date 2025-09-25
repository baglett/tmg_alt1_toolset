/**
 * Content Expansion Strategy
 *
 * Forces window resize by expanding content that requires larger window
 */

import { ResizeStrategy, ResizeResult, WindowCapabilities } from '../types';

export class ContentExpansionStrategy implements ResizeStrategy {
    name = 'content-expansion' as const;
    priority = 3; // Third priority - fallback method

    private expansionElements: HTMLElement[] = [];

    isAvailable(): boolean {
        return typeof document !== 'undefined';
    }

    validate(capabilities: WindowCapabilities): boolean {
        return capabilities.contentExpansion;
    }

    async resize(width: number, height: number): Promise<ResizeResult> {
        const startTime = performance.now();
        const previousSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };

        try {
            // Clean up any existing expansion elements
            this.cleanup();

            // Method 1: Force minimum content size
            const minContentResult = await this.forceMinimumContentSize(width, height);
            if (minContentResult.success) {
                return {
                    ...minContentResult,
                    executionTime: performance.now() - startTime
                };
            }

            // Method 2: Create expanding content that forces window growth
            const expandingContentResult = await this.createExpandingContent(width, height);
            if (expandingContentResult.success) {
                return {
                    ...expandingContentResult,
                    executionTime: performance.now() - startTime
                };
            }

            // Method 3: Scrollable content expansion
            const scrollableResult = await this.createScrollableExpansion(width, height, previousSize);

            return {
                ...scrollableResult,
                executionTime: performance.now() - startTime
            };

        } catch (error) {
            this.cleanup();
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Content expansion failed: ${error instanceof Error ? error.message : String(error)}`,
                executionTime: performance.now() - startTime
            };
        }
    }

    private async forceMinimumContentSize(width: number, height: number): Promise<ResizeResult> {
        const previousSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };

        // Set minimum dimensions on body and html
        const html = document.documentElement;
        const body = document.body;

        const originalBodyStyle = {
            minWidth: body.style.minWidth,
            minHeight: body.style.minHeight,
            width: body.style.width,
            height: body.style.height
        };

        const originalHtmlStyle = {
            minWidth: html.style.minWidth,
            minHeight: html.style.minHeight
        };

        try {
            // Force minimum dimensions
            body.style.minWidth = `${width}px`;
            body.style.minHeight = `${height}px`;
            body.style.width = `${width}px`;
            body.style.height = `${height}px`;

            html.style.minWidth = `${width}px`;
            html.style.minHeight = `${height}px`;

            await this.waitForResize();

            const newSize = {
                width: window.outerWidth || document.body.clientWidth,
                height: window.outerHeight || document.body.clientHeight
            };

            const success = newSize.width >= width * 0.9 && newSize.height >= height * 0.9;

            if (!success) {
                // Restore original styles if resize failed
                body.style.minWidth = originalBodyStyle.minWidth;
                body.style.minHeight = originalBodyStyle.minHeight;
                body.style.width = originalBodyStyle.width;
                body.style.height = originalBodyStyle.height;
                html.style.minWidth = originalHtmlStyle.minWidth;
                html.style.minHeight = originalHtmlStyle.minHeight;
            }

            return {
                success,
                method: this.name,
                previousSize,
                newSize,
                error: success ? undefined : 'Minimum content size was ineffective'
            };

        } catch (error) {
            // Restore original styles on error
            body.style.minWidth = originalBodyStyle.minWidth;
            body.style.minHeight = originalBodyStyle.minHeight;
            body.style.width = originalBodyStyle.width;
            body.style.height = originalBodyStyle.height;
            html.style.minWidth = originalHtmlStyle.minWidth;
            html.style.minHeight = originalHtmlStyle.minHeight;

            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Force minimum size failed: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }

    private async createExpandingContent(width: number, height: number): Promise<ResizeResult> {
        const previousSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };

        // Create a large container that forces window expansion
        const expandingContainer = document.createElement('div');
        expandingContainer.className = 'alt1-resizer-expansion';
        expandingContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${width}px;
            height: ${height}px;
            min-width: ${width}px;
            min-height: ${height}px;
            background: transparent;
            pointer-events: none;
            z-index: -1;
            overflow: visible;
        `;

        // Create inner content that's even larger
        const innerContent = document.createElement('div');
        innerContent.style.cssText = `
            width: ${width + 20}px;
            height: ${height + 20}px;
            min-width: ${width + 20}px;
            min-height: ${height + 20}px;
            background: transparent;
        `;

        expandingContainer.appendChild(innerContent);
        document.body.appendChild(expandingContainer);
        this.expansionElements.push(expandingContainer);

        await this.waitForResize();

        const newSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };

        const success = newSize.width >= width * 0.8 && newSize.height >= height * 0.8;

        return {
            success,
            method: this.name,
            previousSize,
            newSize,
            error: success ? undefined : 'Expanding content was ineffective'
        };
    }

    private async createScrollableExpansion(width: number, height: number, previousSize: { width: number, height: number }): Promise<ResizeResult> {
        // Create a scrollable area that's larger than requested size
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'alt1-resizer-scroll-expansion';
        scrollContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: auto;
            background: rgba(0, 0, 0, 0.01);
            z-index: -2;
        `;

        // Create large content area
        const largeContent = document.createElement('div');
        largeContent.style.cssText = `
            width: ${Math.max(width, previousSize.width + 200)}px;
            height: ${Math.max(height, previousSize.height + 200)}px;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: rgba(100, 100, 100, 0.3);
            font-size: 12px;
        `;

        largeContent.textContent = `Expanded content area: ${width}x${height}`;

        scrollContainer.appendChild(largeContent);
        document.body.appendChild(scrollContainer);
        this.expansionElements.push(scrollContainer);

        await this.waitForResize(200);

        const newSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };

        // For scrollable expansion, we consider it successful if we get scrollbars
        // or if the content area expanded
        const hasScrollbars = scrollContainer.scrollWidth > scrollContainer.clientWidth ||
                             scrollContainer.scrollHeight > scrollContainer.clientHeight;

        const dimensionsImproved = newSize.width > previousSize.width || newSize.height > previousSize.height;

        const success = hasScrollbars || dimensionsImproved;

        return {
            success,
            method: this.name,
            previousSize,
            newSize,
            error: success ? undefined : 'Content expansion created scrollable area but window did not resize'
        };
    }

    private async waitForResize(duration: number = 100): Promise<void> {
        return new Promise(resolve => {
            // Force layout recalculation
            document.body.offsetHeight;
            setTimeout(resolve, duration);
        });
    }

    cleanup(): void {
        this.expansionElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.expansionElements = [];

        // Reset body styles if they were modified
        const body = document.body;
        const html = document.documentElement;

        if (body.style.minWidth && body.style.minWidth.includes('px')) {
            body.style.minWidth = '';
        }
        if (body.style.minHeight && body.style.minHeight.includes('px')) {
            body.style.minHeight = '';
        }
        if (html.style.minWidth && html.style.minWidth.includes('px')) {
            html.style.minWidth = '';
        }
        if (html.style.minHeight && html.style.minHeight.includes('px')) {
            html.style.minHeight = '';
        }
    }

    // Always available - content manipulation is always possible
    static detectCapabilities() {
        return true;
    }
}