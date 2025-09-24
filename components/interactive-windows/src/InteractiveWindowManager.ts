/**
 * Interactive Window Manager
 *
 * Manages multiple interactive windows with focus handling, layout management,
 * and global event coordination.
 */

import { InteractiveWindow } from './InteractiveWindow';
import {
    InteractiveWindowManagerInterface,
    InteractiveWindowConfig,
    WindowEvent,
    WindowEventType,
    Point,
    Size
} from './types';

export class InteractiveWindowManager implements InteractiveWindowManagerInterface {
    private _windows: Map<string, InteractiveWindow> = new Map();
    private _focusedWindow: InteractiveWindow | null = null;
    private _eventHandlers: Map<WindowEventType, ((event: WindowEvent) => void)[]> = new Map();
    private _nextZIndex = 1000;
    private _cascadeOffset = { x: 30, y: 30 };

    // Getters
    get windows(): Map<string, InteractiveWindow> {
        return new Map(this._windows);
    }

    get focusedWindow(): InteractiveWindow | null {
        return this._focusedWindow;
    }

    constructor() {
        this.setupGlobalEventHandlers();
    }

    // Window management methods
    createWindow(config: InteractiveWindowConfig): InteractiveWindow {
        const window = new InteractiveWindow(config);

        this._windows.set(window.id, window);

        // Set up window event forwarding
        this.setupWindowEventForwarding(window);

        // Auto-show if not specified otherwise
        if (config.modal !== false) {
            window.show();
        }

        this.emit('create', { window });
        return window;
    }

    getWindow(id: string): InteractiveWindow | null {
        return this._windows.get(id) || null;
    }

    closeWindow(id: string): boolean {
        const window = this._windows.get(id);
        if (!window) return false;

        window.close();
        this._windows.delete(id);

        // Update focused window
        if (this._focusedWindow === window) {
            this._focusedWindow = this.getTopMostWindow();
            if (this._focusedWindow) {
                this._focusedWindow.focus();
            }
        }

        this.emit('close', { window });
        return true;
    }

    closeAllWindows(): void {
        const windowIds = Array.from(this._windows.keys());
        windowIds.forEach(id => this.closeWindow(id));
    }

    // Focus management
    focusWindow(id: string): boolean {
        const window = this._windows.get(id);
        if (!window || !window.isVisible()) return false;

        // Blur current focused window
        if (this._focusedWindow && this._focusedWindow !== window) {
            this._focusedWindow.blur();
        }

        this._focusedWindow = window;
        window.focus();
        return true;
    }

    getNextWindow(): InteractiveWindow | null {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0) return null;

        const currentIndex = this._focusedWindow ?
            visibleWindows.indexOf(this._focusedWindow) : -1;

        const nextIndex = (currentIndex + 1) % visibleWindows.length;
        return visibleWindows[nextIndex];
    }

    getPreviousWindow(): InteractiveWindow | null {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0) return null;

        const currentIndex = this._focusedWindow ?
            visibleWindows.indexOf(this._focusedWindow) : -1;

        const prevIndex = currentIndex === 0 ?
            visibleWindows.length - 1 :
            Math.max(0, currentIndex - 1);

        return visibleWindows[prevIndex];
    }

    // Layout management
    cascadeWindows(): void {
        const visibleWindows = this.getVisibleWindows();
        let offsetX = 50;
        let offsetY = 50;

        visibleWindows.forEach((window, index) => {
            const x = offsetX + (index * this._cascadeOffset.x);
            const y = offsetY + (index * this._cascadeOffset.y);

            // Wrap around if we exceed screen bounds
            const maxX = globalThis.window.innerWidth - window.state.size.width;
            const maxY = globalThis.window.innerHeight - window.state.size.height;

            window.setPosition(
                Math.min(x, Math.max(0, maxX)),
                Math.min(y, Math.max(0, maxY))
            );
        });
    }

    tileWindows(): void {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0) return;

        const screenWidth = globalThis.window.innerWidth;
        const screenHeight = globalThis.window.innerHeight;

        // Calculate grid dimensions
        const cols = Math.ceil(Math.sqrt(visibleWindows.length));
        const rows = Math.ceil(visibleWindows.length / cols);

        const windowWidth = Math.floor(screenWidth / cols);
        const windowHeight = Math.floor(screenHeight / rows);

        visibleWindows.forEach((win, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            win.setPosition(col * windowWidth, row * windowHeight);
            win.setSize(
                Math.max(windowWidth - 10, 300), // Minimum width with gap
                Math.max(windowHeight - 10, 200) // Minimum height with gap
            );
        });
    }

    centerAllWindows(): void {
        this.getVisibleWindows().forEach(window => {
            window.center();
        });
    }

    // Event handling
    on(event: WindowEventType, handler: (event: WindowEvent) => void): void {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, []);
        }
        this._eventHandlers.get(event)!.push(handler);
    }

    off(event: WindowEventType, handler?: (event: WindowEvent) => void): void {
        if (!this._eventHandlers.has(event)) return;

        if (handler) {
            const handlers = this._eventHandlers.get(event)!;
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        } else {
            this._eventHandlers.set(event, []);
        }
    }

    // Utility methods
    getVisibleWindows(): InteractiveWindow[] {
        return Array.from(this._windows.values()).filter(window =>
            window.isVisible() && !window.isMinimized()
        );
    }

    getWindowCount(): number {
        return this._windows.size;
    }

    destroy(): void {
        this.closeAllWindows();
        this.removeGlobalEventHandlers();
        this._eventHandlers.clear();
    }

    // Convenience methods for common window types
    createModal(config: Omit<InteractiveWindowConfig, 'modal'> & { modal?: boolean }): InteractiveWindow {
        return this.createWindow({
            ...config,
            modal: true,
            draggable: config.draggable !== false,
            resizable: config.resizable !== false,
            closable: config.closable !== false
        });
    }

    createDialog(title: string, content: string | HTMLElement, buttons?: { text: string; onClick: () => void; primary?: boolean }[]): InteractiveWindow {
        const dialogContent = document.createElement('div');
        dialogContent.style.cssText = 'padding: 20px;';

        // Add content
        if (typeof content === 'string') {
            dialogContent.innerHTML = `<div style="margin-bottom: 20px;">${content}</div>`;
        } else {
            const contentWrapper = document.createElement('div');
            contentWrapper.style.marginBottom = '20px';
            contentWrapper.appendChild(content);
            dialogContent.appendChild(contentWrapper);
        }

        // Add buttons if provided
        if (buttons && buttons.length > 0) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

            buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.textContent = buttonConfig.text;
                button.style.cssText = `
                    padding: 8px 16px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: ${buttonConfig.primary ? '#007ACC' : '#f0f0f0'};
                    color: ${buttonConfig.primary ? 'white' : 'black'};
                    cursor: pointer;
                `;

                button.addEventListener('click', buttonConfig.onClick);
                buttonContainer.appendChild(button);
            });

            dialogContent.appendChild(buttonContainer);
        }

        return this.createModal({
            title,
            content: dialogContent,
            width: 400,
            height: 200,
            resizable: false,
            minimizable: false
        });
    }

    createSettingsModal(title: string, settingsContent: HTMLElement): InteractiveWindow {
        return this.createModal({
            title,
            content: settingsContent,
            width: 600,
            height: 400,
            resizable: true,
            minimizable: false,
            className: 'iwm-settings-modal'
        });
    }

    // Alert and confirmation dialogs
    alert(title: string, message: string): Promise<void> {
        return new Promise((resolve) => {
            this.createDialog(title, message, [
                {
                    text: 'OK',
                    primary: true,
                    onClick: () => {
                        resolve();
                    }
                }
            ]);
        });
    }

    confirm(title: string, message: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.createDialog(title, message, [
                {
                    text: 'Cancel',
                    onClick: () => resolve(false)
                },
                {
                    text: 'OK',
                    primary: true,
                    onClick: () => resolve(true)
                }
            ]);
        });
    }

    // Private methods
    private emit(event: WindowEventType, data?: any): void {
        const eventObj: WindowEvent = {
            type: event,
            window: data?.window || null,
            data,
            timestamp: Date.now()
        };

        if (this._eventHandlers.has(event)) {
            this._eventHandlers.get(event)!.forEach(handler => {
                try {
                    handler(eventObj);
                } catch (error) {
                    console.error(`Error in window manager event handler for ${event}:`, error);
                }
            });
        }
    }

    private setupWindowEventForwarding(window: InteractiveWindow): void {
        // Forward all window events to manager listeners
        const eventTypes: WindowEventType[] = [
            'create', 'close', 'resize', 'move', 'focus', 'blur',
            'minimize', 'restore', 'maximize', 'beforeClose'
        ];

        eventTypes.forEach(eventType => {
            window.on(eventType, (event) => {
                if (eventType === 'focus') {
                    this._focusedWindow = window;
                }
                this.emit(eventType, event);
            });
        });
    }

    private setupGlobalEventHandlers(): void {
        // Handle Escape key to close focused modal
        document.addEventListener('keydown', this.onGlobalKeyDown.bind(this));

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Handle clicks outside windows to blur focus
        document.addEventListener('click', this.onDocumentClick.bind(this));
    }

    private removeGlobalEventHandlers(): void {
        document.removeEventListener('keydown', this.onGlobalKeyDown.bind(this));
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        document.removeEventListener('click', this.onDocumentClick.bind(this));
    }

    private onGlobalKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape' && this._focusedWindow) {
            // Close modal windows on escape
            if (this._focusedWindow.config.modal) {
                this._focusedWindow.close();
            }
        }

        // Alt+Tab to cycle through windows
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            const nextWindow = e.shiftKey ? this.getPreviousWindow() : this.getNextWindow();
            if (nextWindow) {
                this.focusWindow(nextWindow.id);
            }
        }
    }

    private onWindowResize(): void {
        // Ensure windows stay within screen bounds
        this._windows.forEach(window => {
            if (!window.isVisible()) return;

            const state = window.state;
            const maxX = globalThis.window.innerWidth - state.size.width;
            const maxY = globalThis.window.innerHeight - state.size.height;

            if (state.position.x > maxX || state.position.y > maxY) {
                window.setPosition(
                    Math.min(state.position.x, Math.max(0, maxX)),
                    Math.min(state.position.y, Math.max(0, maxY))
                );
            }
        });
    }

    private onDocumentClick(e: Event): void {
        const target = e.target as HTMLElement;

        // Check if click was inside any window
        const clickedWindow = Array.from(this._windows.values()).find(window =>
            window.element.contains(target)
        );

        if (!clickedWindow && this._focusedWindow) {
            this._focusedWindow.blur();
            this._focusedWindow = null;
        }
    }

    private getTopMostWindow(): InteractiveWindow | null {
        let topWindow: InteractiveWindow | null = null;
        let maxZIndex = -1;

        this._windows.forEach(window => {
            if (window.isVisible() && window.state.zIndex > maxZIndex) {
                maxZIndex = window.state.zIndex;
                topWindow = window;
            }
        });

        return topWindow;
    }
}