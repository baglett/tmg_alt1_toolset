/**
 * Hybrid Window System
 *
 * Combines Alt1 overlays for positioning with DOM elements for interactivity.
 * This allows windows to be positioned anywhere on the RuneScape window while
 * maintaining full interactive capabilities within content areas.
 */

import * as a1lib from 'alt1';
import { Point, Size, Rect, InteractiveWindowConfig, WindowState, WindowEventType } from './types';

export interface HybridWindowConfig extends InteractiveWindowConfig {
    // Alt1-specific positioning (in RS coordinates)
    rsX?: number;
    rsY?: number;

    // Whether to use Alt1 overlays for chrome
    useOverlayChrome?: boolean;

    // Overlay styling options
    overlayColor?: number;
    overlayLineWidth?: number;
    overlayDuration?: number; // milliseconds
}

export class HybridWindow {
    private _id: string;
    private _config: HybridWindowConfig;
    private _state: WindowState;
    private _domElement!: HTMLElement;
    private _contentElement!: HTMLElement;
    private _overlayUpdateInterval: number | null = null;
    private _eventHandlers: Map<WindowEventType, Function[]> = new Map();

    constructor(config: HybridWindowConfig) {
        this._id = this.generateId();
        this._config = {
            useOverlayChrome: true,
            overlayColor: a1lib.mixColor(100, 100, 100, 255),
            overlayLineWidth: 2,
            overlayDuration: 100, // Short duration, updated frequently
            ...config
        };

        // Initialize state with RS coordinates if provided
        this._state = {
            id: this._id,
            position: {
                x: config.rsX ?? 100,
                y: config.rsY ?? 100
            },
            size: { width: config.width, height: config.height },
            visible: false,
            focused: false,
            minimized: false,
            maximized: false,
            dragging: false,
            resizing: false
        };

        this.createElement();
        this.setupEventHandlers();
    }

    // Public API
    get id(): string { return this._id; }
    get state(): WindowState { return { ...this._state }; }
    get element(): HTMLElement { return this._domElement; }

    show(): void {
        this._state.visible = true;
        this._domElement.style.display = 'block';
        this.updateDOMPosition();
        this.startOverlayUpdates();
        this.emit('window-shown');
    }

    hide(): void {
        this._state.visible = false;
        this._domElement.style.display = 'none';
        this.stopOverlayUpdates();
        this.emit('window-hidden');
    }

    close(): void {
        this.hide();
        this.cleanup();
        this.emit('window-closed');
    }

    focus(): void {
        this._state.focused = true;
        this._domElement.style.zIndex = '10000';
        this.emit('window-focused');
    }

    blur(): void {
        this._state.focused = false;
        this._domElement.style.zIndex = '9000';
        this.emit('window-blurred');
    }

    // Position methods (using RS coordinates)
    setRSPosition(rsX: number, rsY: number): void {
        this._state.position.x = rsX;
        this._state.position.y = rsY;
        this.updateDOMPosition();
        this.emit('window-moved', { rsX, rsY });
    }

    setSize(width: number, height: number): void {
        this._state.size.width = width;
        this._state.size.height = height;
        this.updateDOMPosition();
        this.emit('window-resized', { width, height });
    }

    setContent(content: string | HTMLElement): void {
        if (typeof content === 'string') {
            this._contentElement.innerHTML = content;
        } else {
            this._contentElement.innerHTML = '';
            this._contentElement.appendChild(content);
        }
    }

    // Event handling
    on(event: WindowEventType, handler: Function): void {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, []);
        }
        this._eventHandlers.get(event)!.push(handler);
    }

    off(event: WindowEventType, handler?: Function): void {
        if (!this._eventHandlers.has(event)) return;

        if (handler) {
            const handlers = this._eventHandlers.get(event)!;
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        } else {
            this._eventHandlers.delete(event);
        }
    }

    // Private methods
    private generateId(): string {
        return `hybrid-window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private createElement(): void {
        // Create main container (invisible DOM element for positioning)
        this._domElement = document.createElement('div');
        this._domElement.className = 'hybrid-window';
        this._domElement.style.cssText = `
            position: absolute;
            display: none;
            pointer-events: none;
            z-index: 9000;
        `;

        // Create content area (interactive DOM element)
        this._contentElement = document.createElement('div');
        this._contentElement.className = 'hybrid-window-content';
        this._contentElement.style.cssText = `
            position: absolute;
            left: ${this._config.overlayLineWidth || 2}px;
            top: 30px; /* Account for title bar */
            right: ${this._config.overlayLineWidth || 2}px;
            bottom: ${this._config.overlayLineWidth || 2}px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 4px;
            overflow: auto;
            pointer-events: all;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
        `;

        this._domElement.appendChild(this._contentElement);
        document.body.appendChild(this._domElement);

        // Set initial content
        if (this._config.content) {
            if (typeof this._config.content === 'string' || this._config.content instanceof HTMLElement) {
                this.setContent(this._config.content);
            } else {
                // Handle WindowContentConfig case
                this.setContent(this._config.content.source);
            }
        }
    }

    private setupEventHandlers(): void {
        // Handle content area interactions
        this._contentElement.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.focus();
        });

        // Handle close button (if implemented in overlay)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._state.focused && this._config.closable) {
                this.close();
            }
        });
    }

    private updateDOMPosition(): void {
        if (!this._state.visible || !window.alt1) return;

        // Convert RS coordinates to screen coordinates
        const domPosition = this.convertRSToDOMCoordinates(
            this._state.position.x,
            this._state.position.y
        );

        // Update DOM element position
        this._domElement.style.left = `${domPosition.x}px`;
        this._domElement.style.top = `${domPosition.y}px`;
        this._domElement.style.width = `${this._state.size.width}px`;
        this._domElement.style.height = `${this._state.size.height}px`;
    }

    private convertRSToDOMCoordinates(rsX: number, rsY: number): Point {
        // Get the Alt1 plugin's position relative to the RS window
        // This is a simplification - in reality we'd need to account for:
        // 1. RS window position on screen
        // 2. Alt1 plugin position within RS window
        // 3. Coordinate transformations

        // For now, use the plugin window as the coordinate system
        // In a full implementation, we'd need Alt1 APIs to get window positions
        return { x: rsX, y: rsY };
    }

    private startOverlayUpdates(): void {
        if (!this._config.useOverlayChrome || !window.alt1) return;

        this.stopOverlayUpdates(); // Clear any existing interval

        const updateOverlay = () => {
            if (!this._state.visible) return;

            const { x, y } = this._state.position;
            const { width, height } = this._state.size;
            const color = this._config.overlayColor!;
            const lineWidth = this._config.overlayLineWidth!;
            const duration = this._config.overlayDuration!;

            // Draw window chrome using Alt1 overlays
            if (window.alt1) {
                // Main window border
                window.alt1.overLayRect(color, x, y, width, height, duration, lineWidth);

                // Title bar
                const titleBarHeight = 30;
                window.alt1.overLayRect(
                    a1lib.mixColor(80, 80, 80, 255),
                    x, y, width, titleBarHeight,
                    duration, 0
                );

                // Title text
                if (this._config.title) {
                    window.alt1.overLayText(
                        this._config.title,
                        a1lib.mixColor(255, 255, 255, 255),
                        14,
                        x + 10, y + 8,
                        duration
                    );
                }

                // Close button (if closable)
                if (this._config.closable) {
                    const closeX = x + width - 25;
                    const closeY = y + 5;
                    window.alt1.overLayRect(
                        a1lib.mixColor(200, 50, 50, 255),
                        closeX, closeY, 20, 20,
                        duration, 1
                    );
                    window.alt1.overLayText(
                        '×',
                        a1lib.mixColor(255, 255, 255, 255),
                        16,
                        closeX + 7, closeY + 2,
                        duration
                    );
                }
            }
        };

        // Update overlay regularly (slightly less than overlay duration)
        updateOverlay(); // Initial update
        this._overlayUpdateInterval = window.setInterval(updateOverlay, this._config.overlayDuration! - 10);
    }

    private stopOverlayUpdates(): void {
        if (this._overlayUpdateInterval) {
            clearInterval(this._overlayUpdateInterval);
            this._overlayUpdateInterval = null;
        }
    }

    private emit(event: WindowEventType, data?: any): void {
        if (this._eventHandlers.has(event)) {
            this._eventHandlers.get(event)!.forEach(handler => {
                try {
                    handler({ window: this, type: event, data });
                } catch (error) {
                    console.error('Error in window event handler:', error);
                }
            });
        }
    }

    private cleanup(): void {
        this.stopOverlayUpdates();
        this._eventHandlers.clear();

        if (this._domElement && this._domElement.parentNode) {
            this._domElement.parentNode.removeChild(this._domElement);
        }
    }
}