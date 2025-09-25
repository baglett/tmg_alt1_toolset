/**
 * Alt1 Window Resizer
 *
 * Universal Alt1 plugin window resizer with multiple fallback strategies
 */
import { ResizeResult, ResizeStrategy, WindowCapabilities, ResizeOptions, ResizeEventListener, WindowResizerConfig, WindowSize } from './types';
export declare class WindowResizer {
    private strategies;
    private capabilities;
    private eventListeners;
    private config;
    constructor(config?: WindowResizerConfig);
    /**
     * Resize window to specific dimensions
     */
    resizeWindow(width: number, height: number, options?: ResizeOptions): Promise<ResizeResult>;
    /**
     * Get current window size
     */
    getCurrentSize(): WindowSize;
    /**
     * Detect available resize capabilities
     */
    detectCapabilities(): WindowCapabilities;
    /**
     * Get available strategies based on current capabilities
     */
    getAvailableStrategies(): ResizeStrategy[];
    /**
     * Add event listener
     */
    addEventListener(event: 'resize-start' | 'resize-progress' | 'resize-complete' | 'resize-error', listener: ResizeEventListener): void;
    /**
     * Remove event listener
     */
    removeEventListener(event: 'resize-start' | 'resize-progress' | 'resize-complete' | 'resize-error', listener: ResizeEventListener): void;
    /**
     * Cleanup resources
     */
    cleanup(): void;
    private initializeStrategies;
    private detectAlt1Version;
    private emit;
    private log;
    private delay;
}
//# sourceMappingURL=WindowResizer.d.ts.map