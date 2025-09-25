/**
 * Alt1 Native Resize Strategy
 *
 * Uses Alt1's userResize API and other native Alt1 methods
 */

import { ResizeStrategy, ResizeResult, WindowCapabilities } from '../types';

declare global {
    interface Window {
        alt1?: {
            userResize?: (left: boolean, top: boolean, right: boolean, bottom: boolean) => any;
            [key: string]: any;
        };
    }
}

export class Alt1NativeStrategy implements ResizeStrategy {
    name = 'alt1-native' as const;
    priority = 2; // Second priority - Alt1 specific

    isAvailable(): boolean {
        return typeof window !== 'undefined' &&
               !!window.alt1 &&
               typeof window.alt1.userResize === 'function';
    }

    validate(capabilities: WindowCapabilities): boolean {
        return capabilities.alt1APIs.userResize;
    }

    async resize(width: number, height: number): Promise<ResizeResult> {
        const startTime = performance.now();
        const previousSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };

        try {
            // Method 1: Programmatic userResize simulation
            const result = await this.programmaticUserResize(width, height, previousSize);
            if (result.success) {
                return {
                    ...result,
                    executionTime: performance.now() - startTime
                };
            }

            // Method 2: Force resize through element manipulation + userResize
            const elementResult = await this.elementBasedResize(width, height, previousSize);
            if (elementResult.success) {
                return {
                    ...elementResult,
                    executionTime: performance.now() - startTime
                };
            }

            // Method 3: Try Alt1 config update (if available)
            if (window.alt1?.updateConfig) {
                try {
                    window.alt1!.updateConfig({
                        defaultWidth: width,
                        defaultHeight: height,
                        minWidth: Math.min(width, 300),
                        maxWidth: Math.max(width, 800),
                        minHeight: Math.min(height, 200),
                        maxHeight: Math.max(height, 800)
                    });

                    await this.waitForResize();

                    const newSize = {
                        width: window.outerWidth || document.body.clientWidth,
                        height: window.outerHeight || document.body.clientHeight
                    };

                    if (Math.abs(newSize.width - width) < 20 && Math.abs(newSize.height - height) < 20) {
                        return {
                            success: true,
                            method: this.name,
                            previousSize,
                            newSize,
                            executionTime: performance.now() - startTime
                        };
                    }
                } catch (e) {
                    // Config update failed, continue to failure
                }
            }

            return {
                success: false,
                method: this.name,
                previousSize,
                error: 'Alt1 APIs available but resize was ineffective',
                executionTime: performance.now() - startTime
            };

        } catch (error) {
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Alt1 native resize failed: ${error instanceof Error ? error.message : String(error)}`,
                executionTime: performance.now() - startTime
            };
        }
    }

    private async programmaticUserResize(width: number, height: number, previousSize: { width: number, height: number }): Promise<ResizeResult> {
        try {
            // Calculate which borders need to be adjusted
            const deltaWidth = width - previousSize.width;
            const deltaHeight = height - previousSize.height;

            // Determine resize direction
            const expandRight = deltaWidth > 0;
            const expandBottom = deltaHeight > 0;
            const shrinkLeft = deltaWidth < 0;
            const shrinkTop = deltaHeight < 0;

            // Create a temporary invisible element to trigger userResize
            const resizeElement = document.createElement('div');
            resizeElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 1px;
                height: 1px;
                opacity: 0;
                pointer-events: none;
            `;
            document.body.appendChild(resizeElement);

            // Simulate the resize operation
            const resizePromise = new Promise<boolean>((resolve) => {
                const resizeHandler = () => {
                    if (window.alt1?.userResize) {
                        // Call userResize with appropriate parameters
                        window.alt1.userResize(
                            shrinkLeft,      // left
                            shrinkTop,       // top
                            expandRight,     // right
                            expandBottom     // bottom
                        );
                    }
                    resolve(true);
                };

                // Trigger resize after a short delay
                setTimeout(resizeHandler, 10);
            });

            await resizePromise;
            await this.waitForResize(200); // Give more time for Alt1 to process

            // Clean up
            document.body.removeChild(resizeElement);

            const newSize = {
                width: window.outerWidth || document.body.clientWidth,
                height: window.outerHeight || document.body.clientHeight
            };

            const success = Math.abs(newSize.width - width) < 20 && Math.abs(newSize.height - height) < 20;

            return {
                success,
                method: this.name,
                previousSize,
                newSize,
                error: success ? undefined : 'Programmatic userResize was ineffective'
            };

        } catch (error) {
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Programmatic userResize failed: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }

    private async elementBasedResize(width: number, height: number, previousSize: { width: number, height: number }): Promise<ResizeResult> {
        try {
            // Create resize trigger elements at window edges
            const resizeElements = this.createResizeElements();

            // Simulate dragging from appropriate edges
            const deltaWidth = width - previousSize.width;
            const deltaHeight = height - previousSize.height;

            if (deltaWidth !== 0) {
                // Trigger right edge resize
                const rightElement = resizeElements.right;
                this.simulateMouseResize(rightElement, deltaWidth, 0);
            }

            if (deltaHeight !== 0) {
                // Trigger bottom edge resize
                const bottomElement = resizeElements.bottom;
                this.simulateMouseResize(bottomElement, 0, deltaHeight);
            }

            await this.waitForResize(300);

            // Clean up resize elements
            Object.values(resizeElements).forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });

            const newSize = {
                width: window.outerWidth || document.body.clientWidth,
                height: window.outerHeight || document.body.clientHeight
            };

            const success = Math.abs(newSize.width - width) < 20 && Math.abs(newSize.height - height) < 20;

            return {
                success,
                method: this.name,
                previousSize,
                newSize,
                error: success ? undefined : 'Element-based resize was ineffective'
            };

        } catch (error) {
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Element-based resize failed: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }

    private createResizeElements() {
        const elements = {
            right: document.createElement('div'),
            bottom: document.createElement('div'),
            corner: document.createElement('div')
        };

        // Right edge
        elements.right.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 5px;
            height: 100%;
            cursor: e-resize;
            z-index: 9999;
            background: transparent;
        `;

        // Bottom edge
        elements.bottom.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 5px;
            cursor: s-resize;
            z-index: 9999;
            background: transparent;
        `;

        // Corner
        elements.corner.style.cssText = `
            position: fixed;
            bottom: 0;
            right: 0;
            width: 10px;
            height: 10px;
            cursor: se-resize;
            z-index: 10000;
            background: transparent;
        `;

        // Add Alt1 userResize functionality
        if (window.alt1?.userResize) {
            elements.right.addEventListener('mousedown', () => window.alt1!.userResize!(false, false, true, false));
            elements.bottom.addEventListener('mousedown', () => window.alt1!.userResize!(false, false, false, true));
            elements.corner.addEventListener('mousedown', () => window.alt1!.userResize!(false, false, true, true));
        }

        // Add to DOM
        Object.values(elements).forEach(el => document.body.appendChild(el));

        return elements;
    }

    private simulateMouseResize(element: HTMLElement, deltaX: number, deltaY: number) {
        // Create and dispatch mouse events
        const mouseDown = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: 0,
            clientY: 0
        });

        element.dispatchEvent(mouseDown);

        // Simulate drag
        setTimeout(() => {
            const mouseMove = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: deltaX,
                clientY: deltaY
            });

            document.dispatchEvent(mouseMove);

            setTimeout(() => {
                const mouseUp = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true
                });

                document.dispatchEvent(mouseUp);
            }, 50);
        }, 50);
    }

    private async waitForResize(duration: number = 100): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    // Detect Alt1 API capabilities
    static detectCapabilities() {
        const alt1 = window.alt1;
        return {
            userResize: alt1 && typeof alt1.userResize === 'function',
            updateConfig: alt1 && typeof alt1.updateConfig === 'function',
            windowControl: alt1 && typeof alt1.setWindowBounds === 'function'
        };
    }
}