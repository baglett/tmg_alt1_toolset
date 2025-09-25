/**
 * Alt1 Window Resizer
 *
 * Universal Alt1 plugin window resizer with multiple fallback strategies
 */

import {
    ResizeResult,
    ResizeStrategy,
    WindowCapabilities,
    ResizeOptions,
    ResizeEvent,
    ResizeEventListener,
    WindowResizerConfig,
    WindowSize
} from './types';

import { WebAPIStrategy } from './strategies/WebAPIStrategy';
import { Alt1NativeStrategy } from './strategies/Alt1NativeStrategy';
import { ContentExpansionStrategy } from './strategies/ContentExpansionStrategy';

export class WindowResizer {
    private strategies: ResizeStrategy[] = [];
    private capabilities: WindowCapabilities | null = null;
    private eventListeners: Map<string, ResizeEventListener[]> = new Map();
    private config: Required<WindowResizerConfig>;

    constructor(config: WindowResizerConfig = {}) {
        this.config = {
            enableFallbacks: true,
            maxFallbackAttempts: 3,
            animateResize: false,
            resizeAnimationDuration: 300,
            detectCapabilitiesOnInit: true,
            logLevel: 'warn',
            customStrategies: [],
            ...config
        };

        this.initializeStrategies();

        if (this.config.detectCapabilitiesOnInit) {
            this.detectCapabilities();
        }
    }

    /**
     * Resize window to specific dimensions
     */
    async resizeWindow(width: number, height: number, options: ResizeOptions = {}): Promise<ResizeResult> {
        const startTime = performance.now();

        this.log('info', `Starting window resize to ${width}x${height}`);
        this.emit('resize-start', { width, height });

        const mergedOptions = {
            maxAttempts: this.config.maxFallbackAttempts,
            fallbackToContentExpansion: this.config.enableFallbacks,
            ...options
        };

        // Validate dimensions
        if (width < 100 || height < 100) {
            const result: ResizeResult = {
                success: false,
                method: 'failed',
                error: 'Invalid dimensions: minimum size is 100x100',
                executionTime: performance.now() - startTime
            };
            this.emit('resize-error', { width, height }, undefined, result.error!);
            return result;
        }

        // Try each strategy in priority order
        const availableStrategies = this.getAvailableStrategies();
        let lastError = '';
        let fallbacksAttempted = 0;

        for (const strategy of availableStrategies) {
            if (fallbacksAttempted >= mergedOptions.maxAttempts!) {
                break;
            }

            try {
                this.log('debug', `Attempting resize with strategy: ${strategy.name}`);

                const result = await strategy.resize(width, height);
                result.fallbacksAttempted = fallbacksAttempted;

                if (result.success) {
                    this.log('info', `Resize successful with strategy: ${strategy.name}`);
                    this.emit('resize-complete', { width, height }, result.newSize);
                    return result;
                }

                lastError = result.error || `Strategy ${strategy.name} failed`;
                this.log('warn', `Strategy ${strategy.name} failed: ${lastError}`);

                fallbacksAttempted++;

                // Progress callback
                if (mergedOptions.onProgress) {
                    mergedOptions.onProgress(result);
                }

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                lastError = `Strategy ${strategy.name} threw error: ${errorMessage}`;
                this.log('error', lastError);

                fallbacksAttempted++;

                if (mergedOptions.onError) {
                    mergedOptions.onError(errorMessage, strategy.name);
                }
            }

            // Small delay between attempts
            await this.delay(50);
        }

        // All strategies failed
        const finalResult: ResizeResult = {
            success: false,
            method: 'failed',
            error: `All resize strategies failed. Last error: ${lastError}`,
            fallbacksAttempted,
            executionTime: performance.now() - startTime
        };

        this.emit('resize-error', { width, height }, undefined, finalResult.error);
        return finalResult;
    }

    /**
     * Get current window size
     */
    getCurrentSize(): WindowSize {
        return {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };
    }

    /**
     * Detect available resize capabilities
     */
    detectCapabilities(): WindowCapabilities {
        const capabilities: WindowCapabilities = {
            webAPIs: WebAPIStrategy.detectCapabilities(),
            alt1APIs: {
                userResize: Alt1NativeStrategy.detectCapabilities().userResize || false,
                updateConfig: Alt1NativeStrategy.detectCapabilities().updateConfig || false,
                windowControl: Alt1NativeStrategy.detectCapabilities().windowControl || false
            },
            contentExpansion: ContentExpansionStrategy.detectCapabilities(),
            externalControl: false, // TODO: Implement external control detection
            detectedVersion: this.detectAlt1Version(),
            limitations: []
        };

        // Add limitations based on detected environment
        if (!capabilities.webAPIs.resizeTo && !capabilities.webAPIs.resizeBy) {
            capabilities.limitations!.push('Standard web resize APIs blocked');
        }

        if (!capabilities.alt1APIs.userResize) {
            capabilities.limitations!.push('Alt1 userResize API not available');
        }

        if (window.location.protocol === 'file:') {
            capabilities.limitations!.push('File protocol may limit resize capabilities');
        }

        this.capabilities = capabilities;
        this.log('info', 'Capabilities detected:', capabilities);

        return capabilities;
    }

    /**
     * Get available strategies based on current capabilities
     */
    getAvailableStrategies(): ResizeStrategy[] {
        if (!this.capabilities) {
            this.detectCapabilities();
        }

        return this.strategies
            .filter(strategy => strategy.isAvailable())
            .filter(strategy => !strategy.validate || strategy.validate(this.capabilities!))
            .sort((a, b) => a.priority - b.priority);
    }

    /**
     * Add event listener
     */
    addEventListener(event: 'resize-start' | 'resize-progress' | 'resize-complete' | 'resize-error', listener: ResizeEventListener): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(listener);
    }

    /**
     * Remove event listener
     */
    removeEventListener(event: 'resize-start' | 'resize-progress' | 'resize-complete' | 'resize-error', listener: ResizeEventListener): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Cleanup resources
     */
    cleanup(): void {
        // Clean up content expansion strategy
        const contentExpansion = this.strategies.find(s => s.name === 'content-expansion') as ContentExpansionStrategy;
        if (contentExpansion) {
            contentExpansion.cleanup();
        }

        this.eventListeners.clear();
    }

    // Private methods
    private initializeStrategies(): void {
        this.strategies = [
            new WebAPIStrategy(),
            new Alt1NativeStrategy(),
            new ContentExpansionStrategy(),
            ...this.config.customStrategies
        ];

        this.log('debug', `Initialized ${this.strategies.length} resize strategies`);
    }

    private detectAlt1Version(): string {
        if (window.alt1) {
            return window.alt1.version || 'unknown';
        }
        return 'not-detected';
    }

    private emit(type: ResizeEvent['type'], target: WindowSize, current?: WindowSize, error?: string): void {
        const event: ResizeEvent = {
            type,
            target,
            current,
            error,
            timestamp: Date.now()
        };

        const listeners = this.eventListeners.get(type);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(event);
                } catch (error) {
                    this.log('error', 'Error in event listener:', error);
                }
            });
        }
    }

    private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
        const logLevels = ['none', 'error', 'warn', 'info', 'debug'];
        const currentLevelIndex = logLevels.indexOf(this.config.logLevel);
        const messageLevelIndex = logLevels.indexOf(level);

        if (currentLevelIndex >= messageLevelIndex) {
            const prefix = '[Alt1WindowResizer]';
            if (data !== undefined) {
                console[level](`${prefix} ${message}`, data);
            } else {
                console[level](`${prefix} ${message}`);
            }
        }
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}