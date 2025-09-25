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

                // Check if resize was successful
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

            // All methods failed
            return {
                success: false,
                method: this.name,
                previousSize,
                newSize: {
                    width: window.outerWidth,
                    height: window.outerHeight
                },
                error: 'Web APIs available but resize was blocked or ineffective',
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