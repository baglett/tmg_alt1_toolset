import { OverlayWindow } from './OverlayWindow';
import { WindowConfig, WindowEventHandlers, Point } from './types';
/**
 * Advanced overlay window manager with computer vision interaction detection
 * and sophisticated window management capabilities for Alt1 applications
 */
export declare class OverlayWindowManager {
    private windows;
    private interactionDetector;
    private focusedWindowId;
    private zIndexCounter;
    private eventHandlers;
    private globalEventHandlers;
    private isInitialized;
    private updateInterval;
    private readonly updateFrequency;
    constructor();
    /**
     * Initialize the window manager
     */
    private initialize;
    /**
     * Create a new overlay window
     */
    createWindow(config: WindowConfig): OverlayWindow;
    /**
     * Get a window by ID
     */
    getWindow(windowId: string): OverlayWindow | null;
    /**
     * Get all windows
     */
    getAllWindows(): OverlayWindow[];
    /**
     * Get focused window
     */
    getFocusedWindow(): OverlayWindow | null;
    /**
     * Focus a specific window
     */
    focusWindow(windowId: string): boolean;
    /**
     * Bring a window to the front
     */
    bringToFront(windowId: string): boolean;
    /**
     * Close a window
     */
    closeWindow(windowId: string): boolean;
    /**
     * Close all windows
     */
    closeAllWindows(): void;
    /**
     * Minimize a window
     */
    minimizeWindow(windowId: string): boolean;
    /**
     * Restore a window
     */
    restoreWindow(windowId: string): boolean;
    /**
     * Set global event handlers
     */
    setEventHandlers(handlers: WindowEventHandlers): void;
    /**
     * Add global event listener
     */
    on(event: string, handler: Function): void;
    /**
     * Remove global event listener
     */
    off(event: string, handler: Function): void;
    /**
     * Get current mouse position
     */
    getMousePosition(): Point | null;
    /**
     * Destroy the window manager and clean up resources
     */
    destroy(): void;
    private generateWindowId;
    private setupWindowEventHandlers;
    private handleWindowInteraction;
    private startUpdateLoop;
    private update;
    private setupAlt1Events;
    private emit;
}
//# sourceMappingURL=OverlayWindowManager.d.ts.map