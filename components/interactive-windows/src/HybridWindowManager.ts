/**
 * Hybrid Window Manager
 *
 * Manages multiple hybrid windows that can be positioned anywhere on the RuneScape
 * window while maintaining interactive content areas using DOM elements.
 */

import * as a1lib from 'alt1';
import { HybridWindow, HybridWindowConfig } from './HybridWindow';
import { WindowThemes } from './types';
import { createSettingsTemplate } from './index';

export class HybridWindowManager {
    private _windows: Map<string, HybridWindow> = new Map();
    private _activeWindow: HybridWindow | null = null;
    private _isInitialized = false;

    constructor() {
        this.initialize();
    }

    // Public API
    createWindow(config: HybridWindowConfig): HybridWindow {
        const window = new HybridWindow(config);
        this._windows.set(window.id, window);

        // Set up window event handlers
        window.on('window-shown', () => this.handleWindowShown(window));
        window.on('window-focused', () => this.handleWindowFocused(window));
        window.on('window-closed', () => this.handleWindowClosed(window));

        return window;
    }

    createModal(config: HybridWindowConfig): HybridWindow {
        // Center the modal on the RuneScape window
        const rsWidth = window.alt1?.rsWidth || 800;
        const rsHeight = window.alt1?.rsHeight || 600;

        const modalConfig: HybridWindowConfig = {
            ...config,
            rsX: config.rsX ?? Math.max(0, (rsWidth - config.width) / 2),
            rsY: config.rsY ?? Math.max(0, (rsHeight - config.height) / 2),
            draggable: config.draggable ?? true,
            closable: config.closable ?? true,
            resizable: config.resizable ?? false
        };

        const modal = this.createWindow(modalConfig);
        modal.show();
        modal.focus();

        return modal;
    }

    createSettingsModal(title: string, settingsElement: HTMLElement): HybridWindow {
        return this.createModal({
            title,
            width: 500,
            height: 400,
            content: settingsElement,
            theme: WindowThemes.MODERN_DARK,
            draggable: true,
            resizable: true,
            closable: true
        });
    }

    // Dialog methods with Alt1 coordinate positioning
    async alert(title: string, message: string, rsX?: number, rsY?: number): Promise<void> {
        return new Promise((resolve) => {
            const alertContent = `
                <div style="padding: 20px; text-align: center; font-family: 'Segoe UI', sans-serif;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">${title}</h3>
                    <p style="margin: 0 0 20px 0; line-height: 1.5; color: #666;">${message}</p>
                    <button id="alert-ok-btn" style="background: #007ACC; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                        OK
                    </button>
                </div>
            `;

            const modal = this.createModal({
                title: '📢 Alert',
                width: 400,
                height: 200,
                content: alertContent,
                rsX,
                rsY,
                closable: true
            });

            // Handle OK button click
            const handleOK = () => {
                modal.close();
                resolve();
            };

            // Set up event handlers after content is rendered
            setTimeout(() => {
                const okBtn = modal.element.querySelector('#alert-ok-btn') as HTMLButtonElement;
                if (okBtn) {
                    okBtn.addEventListener('click', handleOK);
                }
            }, 10);

            // Handle window close
            modal.on('window-closed', () => resolve());
        });
    }

    async confirm(title: string, message: string, rsX?: number, rsY?: number): Promise<boolean> {
        return new Promise((resolve) => {
            const confirmContent = `
                <div style="padding: 20px; text-align: center; font-family: 'Segoe UI', sans-serif;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">${title}</h3>
                    <p style="margin: 0 0 20px 0; line-height: 1.5; color: #666;">${message}</p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="confirm-yes-btn" style="background: #28A745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                            Yes
                        </button>
                        <button id="confirm-no-btn" style="background: #DC3545; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                            No
                        </button>
                    </div>
                </div>
            `;

            const modal = this.createModal({
                title: '❓ Confirm',
                width: 400,
                height: 200,
                content: confirmContent,
                rsX,
                rsY,
                closable: true
            });

            const handleYes = () => {
                modal.close();
                resolve(true);
            };

            const handleNo = () => {
                modal.close();
                resolve(false);
            };

            // Set up event handlers after content is rendered
            setTimeout(() => {
                const yesBtn = modal.element.querySelector('#confirm-yes-btn') as HTMLButtonElement;
                const noBtn = modal.element.querySelector('#confirm-no-btn') as HTMLButtonElement;

                if (yesBtn) yesBtn.addEventListener('click', handleYes);
                if (noBtn) noBtn.addEventListener('click', handleNo);
            }, 10);

            // Handle window close (default to No)
            modal.on('window-closed', () => resolve(false));
        });
    }

    // Window management
    getVisibleWindows(): HybridWindow[] {
        return Array.from(this._windows.values()).filter(w => w.state.visible);
    }

    closeAllWindows(): void {
        this._windows.forEach(window => window.close());
    }

    // Layout management for full RS window
    cascadeWindows(): void {
        const visibleWindows = this.getVisibleWindows();
        let offsetX = 50;
        let offsetY = 50;

        visibleWindows.forEach((window, index) => {
            window.setRSPosition(offsetX + (index * 30), offsetY + (index * 30));
        });
    }

    tileWindows(): void {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0) return;

        const rsWidth = window.alt1?.rsWidth || 800;
        const rsHeight = window.alt1?.rsHeight || 600;

        // Calculate grid dimensions
        const cols = Math.ceil(Math.sqrt(visibleWindows.length));
        const rows = Math.ceil(visibleWindows.length / cols);

        const windowWidth = Math.floor(rsWidth / cols) - 20;
        const windowHeight = Math.floor(rsHeight / rows) - 20;

        visibleWindows.forEach((window, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            const x = col * (windowWidth + 20) + 10;
            const y = row * (windowHeight + 20) + 10;

            window.setRSPosition(x, y);
            window.setSize(windowWidth, windowHeight);
        });
    }

    centerWindow(window: HybridWindow): void {
        const rsWidth = (globalThis as any).alt1?.rsWidth || 800;
        const rsHeight = (globalThis as any).alt1?.rsHeight || 600;

        const centerX = Math.max(0, (rsWidth - window.state.size.width) / 2);
        const centerY = Math.max(0, (rsHeight - window.state.size.height) / 2);

        window.setRSPosition(centerX, centerY);
    }

    // Private methods
    private initialize(): void {
        if (this._isInitialized) return;

        // Check Alt1 availability
        if (!window.alt1) {
            console.warn('HybridWindowManager: Alt1 not available, overlay features disabled');
        }

        // Set up global event handlers
        this.setupGlobalEventHandlers();

        this._isInitialized = true;
    }

    private setupGlobalEventHandlers(): void {
        // Handle clicking outside windows to blur focus
        document.addEventListener('mousedown', (e) => {
            let clickedInWindow = false;

            for (const window of this._windows.values()) {
                if (window.element.contains(e.target as Node)) {
                    clickedInWindow = true;
                    break;
                }
            }

            if (!clickedInWindow && this._activeWindow) {
                this._activeWindow.blur();
                this._activeWindow = null;
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt+Tab: cycle through windows
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                this.cycleWindows();
            }

            // Ctrl+W: close active window
            if (e.ctrlKey && e.key === 'w' && this._activeWindow) {
                e.preventDefault();
                this._activeWindow.close();
            }
        });
    }

    private handleWindowShown(window: HybridWindow): void {
        // Bring window to front when shown
        window.focus();
    }

    private handleWindowFocused(window: HybridWindow): void {
        // Blur other windows
        if (this._activeWindow && this._activeWindow !== window) {
            this._activeWindow.blur();
        }
        this._activeWindow = window;
    }

    private handleWindowClosed(window: HybridWindow): void {
        this._windows.delete(window.id);
        if (this._activeWindow === window) {
            this._activeWindow = null;
        }
    }

    private cycleWindows(): void {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0) return;

        const currentIndex = this._activeWindow ?
            visibleWindows.indexOf(this._activeWindow) : -1;

        const nextIndex = (currentIndex + 1) % visibleWindows.length;
        visibleWindows[nextIndex].focus();
    }
}