import * as alt1lib from 'alt1';
import { OverlayWindow } from './OverlayWindow';
import { InteractionDetector } from './InteractionDetector';
import { WindowConfig, WindowEventHandlers, Point, WindowEvent, InteractionEvent } from './types';

/**
 * Advanced overlay window manager with computer vision interaction detection
 * and sophisticated window management capabilities for Alt1 applications
 */
export class OverlayWindowManager {
    private windows: Map<string, OverlayWindow> = new Map();
    private interactionDetector: InteractionDetector;
    private focusedWindowId: string | null = null;
    private zIndexCounter: number = 1000;
    private eventHandlers: WindowEventHandlers = {};
    private globalEventHandlers: Map<string, Function[]> = new Map();

    // Manager state
    private isInitialized: boolean = false;
    private updateInterval: number | null = null;
    private readonly updateFrequency = 16; // ~60fps updates

    constructor() {
        this.interactionDetector = new InteractionDetector();
        this.initialize();
    }

    /**
     * Initialize the window manager
     */
    private initialize(): void {
        if (this.isInitialized) return;

        // Check Alt1 availability
        if (!window.alt1) {
            console.warn('Alt1 API not available - overlay windows will not function');
            return;
        }

        // Start interaction detection
        this.interactionDetector.startTracking();

        // Start update loop for smooth interactions
        this.startUpdateLoop();

        // Set up Alt1 event listeners
        this.setupAlt1Events();

        this.isInitialized = true;
        this.emit('manager-initialized');

        console.log('Advanced Overlay Window Manager initialized successfully');
    }

    /**
     * Create a new overlay window
     */
    createWindow(config: WindowConfig): OverlayWindow {
        // Generate ID if not provided
        if (!config.id) {
            config.id = this.generateWindowId();
        }

        // Assign z-index if not provided
        if (!config.zIndex) {
            config.zIndex = ++this.zIndexCounter;
        }

        // Set default values
        const windowConfig: WindowConfig = {
            resizable: true,
            draggable: true,
            closable: true,
            ...config
        };

        // Create the window
        const window = new OverlayWindow(windowConfig);

        // Register with manager
        this.windows.set(window.id, window);

        // Set up interaction detection for this window
        this.interactionDetector.registerWindow(window.id, window.getInteractionRegions());
        this.interactionDetector.onInteraction(window.id, (event: InteractionEvent) => {
            this.handleWindowInteraction(window.id, event);
        });

        // Set up window event handlers
        this.setupWindowEventHandlers(window);

        // Focus the new window
        this.focusWindow(window.id);

        // Render the window
        window.render();

        this.emit('window-created', { windowId: window.id, config: windowConfig });

        return window;
    }

    /**
     * Get a window by ID
     */
    getWindow(windowId: string): OverlayWindow | null {
        return this.windows.get(windowId) || null;
    }

    /**
     * Get all windows
     */
    getAllWindows(): OverlayWindow[] {
        return Array.from(this.windows.values());
    }

    /**
     * Get focused window
     */
    getFocusedWindow(): OverlayWindow | null {
        return this.focusedWindowId ? this.getWindow(this.focusedWindowId) : null;
    }

    /**
     * Focus a specific window
     */
    focusWindow(windowId: string): boolean {
        const window = this.getWindow(windowId);
        if (!window) return false;

        // Blur previously focused window
        if (this.focusedWindowId && this.focusedWindowId !== windowId) {
            const previousWindow = this.getWindow(this.focusedWindowId);
            if (previousWindow) {
                previousWindow.blur();
            }
        }

        // Focus the new window
        this.focusedWindowId = windowId;
        window.focus();

        // Bring to front
        this.bringToFront(windowId);

        this.emit('window-focused', { windowId });

        return true;
    }

    /**
     * Bring a window to the front
     */
    bringToFront(windowId: string): boolean {
        const window = this.getWindow(windowId);
        if (!window) return false;

        // Assign highest z-index
        window['state'].zIndex = ++this.zIndexCounter;

        // Re-render to apply new z-index
        window.render();

        return true;
    }

    /**
     * Close a window
     */
    closeWindow(windowId: string): boolean {
        const window = this.getWindow(windowId);
        if (!window) return false;

        // Clean up interaction detection
        this.interactionDetector.unregisterWindow(windowId);

        // Remove from manager
        this.windows.delete(windowId);

        // Clear focus if this was the focused window
        if (this.focusedWindowId === windowId) {
            this.focusedWindowId = null;

            // Focus another window if available
            const remainingWindows = Array.from(this.windows.values());
            if (remainingWindows.length > 0) {
                this.focusWindow(remainingWindows[0].id);
            }
        }

        // Close the window
        window.close();

        this.emit('window-closed', { windowId });

        return true;
    }

    /**
     * Close all windows
     */
    closeAllWindows(): void {
        const windowIds = Array.from(this.windows.keys());
        windowIds.forEach(id => this.closeWindow(id));
    }

    /**
     * Minimize a window
     */
    minimizeWindow(windowId: string): boolean {
        const window = this.getWindow(windowId);
        if (!window) return false;

        window.minimize();
        this.emit('window-minimized', { windowId });

        return true;
    }

    /**
     * Restore a window
     */
    restoreWindow(windowId: string): boolean {
        const window = this.getWindow(windowId);
        if (!window) return false;

        window.restore();
        this.focusWindow(windowId);
        this.emit('window-restored', { windowId });

        return true;
    }

    /**
     * Set global event handlers
     */
    setEventHandlers(handlers: WindowEventHandlers): void {
        this.eventHandlers = { ...handlers };
    }

    /**
     * Add global event listener
     */
    on(event: string, handler: Function): void {
        if (!this.globalEventHandlers.has(event)) {
            this.globalEventHandlers.set(event, []);
        }
        this.globalEventHandlers.get(event)!.push(handler);
    }

    /**
     * Remove global event listener
     */
    off(event: string, handler: Function): void {
        const handlers = this.globalEventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    /**
     * Get current mouse position
     */
    getMousePosition(): Point | null {
        return this.interactionDetector.getCurrentMousePosition();
    }

    /**
     * Destroy the window manager and clean up resources
     */
    destroy(): void {
        // Close all windows
        this.closeAllWindows();

        // Stop interaction detection
        this.interactionDetector.stopTracking();

        // Stop update loop
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        this.isInitialized = false;
        this.emit('manager-destroyed');

        console.log('Advanced Overlay Window Manager destroyed');
    }

    // Private methods

    private generateWindowId(): string {
        return 'window_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    }

    private setupWindowEventHandlers(window: OverlayWindow): void {
        // Set up event forwarding from window to manager
        window.on('moved', (position: Point) => {
            // Update interaction regions when window moves
            this.interactionDetector.registerWindow(window.id, window.getInteractionRegions());

            if (this.eventHandlers.onMove) {
                this.eventHandlers.onMove(window.id, position);
            }
            this.emit('window-moved', { windowId: window.id, position });
        });

        window.on('resized', (size: any) => {
            // Update interaction regions when window resizes
            this.interactionDetector.registerWindow(window.id, window.getInteractionRegions());

            if (this.eventHandlers.onResize) {
                this.eventHandlers.onResize(window.id, size);
            }
            this.emit('window-resized', { windowId: window.id, size });
        });

        window.on('focused', () => {
            if (this.eventHandlers.onFocus) {
                this.eventHandlers.onFocus(window.id);
            }
        });

        window.on('blurred', () => {
            if (this.eventHandlers.onBlur) {
                this.eventHandlers.onBlur(window.id);
            }
        });

        window.on('closed', () => {
            if (this.eventHandlers.onClose) {
                this.eventHandlers.onClose(window.id);
            }
        });

        window.on('minimized', () => {
            if (this.eventHandlers.onMinimize) {
                this.eventHandlers.onMinimize(window.id);
            }
        });
    }

    private handleWindowInteraction(windowId: string, event: InteractionEvent): void {
        const window = this.getWindow(windowId);
        if (!window) return;

        // Focus window on any interaction
        if (this.focusedWindowId !== windowId) {
            this.focusWindow(windowId);
        }

        // Forward interaction to window
        window.handleInteraction(event);
    }

    private startUpdateLoop(): void {
        if (this.updateInterval) return;

        this.updateInterval = window.setInterval(() => {
            this.update();
        }, this.updateFrequency);
    }

    private update(): void {
        // Update logic for smooth interactions
        // Could include animations, state updates, etc.

        // For now, just ensure all windows are properly rendered
        for (const window of this.windows.values()) {
            if (window.isVisible) {
                // Could add smooth animations or state updates here
            }
        }
    }

    private setupAlt1Events(): void {
        // Set up Alt1-specific event handlers if available
        if (typeof alt1lib.on === 'function') {
            alt1lib.on('rslinked', () => {
                this.emit('alt1-rs-linked');
            });

            alt1lib.on('rsunlinked', () => {
                this.emit('alt1-rs-unlinked');
            });

            alt1lib.on('rsfocus', () => {
                this.emit('alt1-rs-focus');
            });

            alt1lib.on('rsblur', () => {
                this.emit('alt1-rs-blur');
            });
        }
    }

    private emit(event: string, data?: any): void {
        const handlers = this.globalEventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in global event handler for ${event}:`, error);
                }
            });
        }
    }
}