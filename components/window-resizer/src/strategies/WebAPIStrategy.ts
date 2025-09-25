/**
 * Web API Resize Strategy
 *
 * Uses standard browser window resize APIs
 */

import { ResizeStrategy, ResizeResult, WindowCapabilities } from '../types';

export class WebAPIStrategy implements ResizeStrategy {
    name = 'webapi' as const;
    priority = 1; // Highest priority - try first

    isAvailable(): boolean {
        return typeof window !== 'undefined' &&
               (typeof window.resizeTo === 'function' ||
                typeof window.resizeBy === 'function');
    }

    validate(capabilities: WindowCapabilities): boolean {
        return capabilities.webAPIs.resizeTo ||
               capabilities.webAPIs.resizeBy ||
               capabilities.webAPIs.outerWidth ||
               capabilities.webAPIs.outerHeight;
    }

    async resize(width: number, height: number): Promise<ResizeResult> {
        const startTime = performance.now();
        const previousSize = {
            width: window.outerWidth,
            height: window.outerHeight
        };

        try {
            // Method 1: Direct resizeTo (most reliable)
            if (window.resizeTo) {
                window.resizeTo(width, height);

                // Give browser time to process resize
                await this.waitForResize();

                const newSize = {
                    width: window.outerWidth,
                    height: window.outerHeight
                };

                // Check if resize was successful with stricter verification for Alt1
                const widthDiff = Math.abs(newSize.width - width);
                const heightDiff = Math.abs(newSize.height - height);
                const actuallyResized = widthDiff < 10 && heightDiff < 10;

                // Additional Alt1-specific check: verify the resize actually took visual effect
                const alt1SilentIgnore = this.detectAlt1SilentIgnore(previousSize, newSize, width, height);

                if (actuallyResized && !alt1SilentIgnore) {
                    return {
                        success: true,
                        method: this.name,
                        previousSize,
                        newSize,
                        executionTime: performance.now() - startTime
                    };
                } else {
                    // Method 1 failed - provide specific feedback
                    let errorMessage = 'resizeTo() call did not achieve target dimensions';

                    if (alt1SilentIgnore) {
                        errorMessage = 'Alt1 Toolkit silently ignored resizeTo() command - expected behavior for security';
                    } else if (!actuallyResized) {
                        errorMessage = `resizeTo() failed - target: ${width}x${height}, actual: ${newSize.width}x${newSize.height} (diff: ${widthDiff}x${heightDiff})`;
                    }

                    // Continue to try other methods, but store this error for potential use
                    // Fall through to method 2
                }
            }

            // Method 2: Calculate delta and use resizeBy
            if (window.resizeBy) {
                const deltaWidth = width - previousSize.width;
                const deltaHeight = height - previousSize.height;

                window.resizeBy(deltaWidth, deltaHeight);

                await this.waitForResize();

                const newSize = {
                    width: window.outerWidth,
                    height: window.outerHeight
                };

                if (Math.abs(newSize.width - width) < 10 && Math.abs(newSize.height - height) < 10) {
                    return {
                        success: true,
                        method: this.name,
                        previousSize,
                        newSize,
                        executionTime: performance.now() - startTime
                    };
                }
            }

            // Method 3: Direct property assignment (less reliable)
            try {
                (window as any).outerWidth = width;
                (window as any).outerHeight = height;

                await this.waitForResize();

                const newSize = {
                    width: window.outerWidth,
                    height: window.outerHeight
                };

                if (Math.abs(newSize.width - width) < 10 && Math.abs(newSize.height - height) < 10) {
                    return {
                        success: true,
                        method: this.name,
                        previousSize,
                        newSize,
                        executionTime: performance.now() - startTime
                    };
                }
            } catch (e) {
                // Property assignment failed, continue to failure
            }

            // All methods failed - determine why
            const finalSize = {
                width: window.outerWidth,
                height: window.outerHeight
            };

            // Check if Alt1 is silently ignoring commands
            const alt1Detected = typeof (window as any).alt1 !== 'undefined';
            let errorMessage = 'Web APIs available but resize was blocked or ineffective';

            if (alt1Detected) {
                if (previousSize.width === finalSize.width && previousSize.height === finalSize.height) {
                    errorMessage = 'Alt1 Toolkit silently ignored window resize commands - this is expected behavior for security';
                } else {
                    errorMessage = `Alt1 Toolkit partially processed resize (${previousSize.width}x${previousSize.height} → ${finalSize.width}x${finalSize.height}) but blocked target size (${width}x${height})`;
                }
            }

            return {
                success: false,
                method: this.name,
                previousSize,
                newSize: finalSize,
                error: errorMessage,
                executionTime: performance.now() - startTime
            };

        } catch (error) {
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Web API resize failed: ${error instanceof Error ? error.message : String(error)}`,
                executionTime: performance.now() - startTime
            };
        }
    }

    private async waitForResize(): Promise<void> {
        return new Promise(resolve => {
            // Give browser time to process resize
            setTimeout(resolve, 50);
        });
    }

    /**
     * Detect if Alt1 is silently ignoring resize commands
     * This happens when window.resizeTo() executes but has no visual effect
     */
    private detectAlt1SilentIgnore(previousSize: {width: number, height: number},
                                   newSize: {width: number, height: number},
                                   targetWidth: number,
                                   targetHeight: number): boolean {

        // Check if we're in Alt1 environment
        const isAlt1 = typeof (window as any).alt1 !== 'undefined';
        if (!isAlt1) return false;

        // If window dimensions didn't change at all despite resize command
        const noVisualChange = previousSize.width === newSize.width &&
                              previousSize.height === newSize.height;

        // If outerWidth/outerHeight report the target size but visually nothing changed
        const reportsFakeSuccess = (Math.abs(newSize.width - targetWidth) < 10 &&
                                   Math.abs(newSize.height - targetHeight) < 10) && noVisualChange;

        return noVisualChange || reportsFakeSuccess;
    }

    // Detect available Web API capabilities
    static detectCapabilities() {
        return {
            resizeTo: typeof window.resizeTo === 'function',
            resizeBy: typeof window.resizeBy === 'function',
            outerWidth: 'outerWidth' in window,
            outerHeight: 'outerHeight' in window
        };
    }
}