// Advanced Windows Test Plugin
// Demonstrates the capabilities of the @tmg-alt1/advanced-overlay-windows component

import * as a1lib from 'alt1';
import { OverlayWindowManager, WindowThemes, OverlayWindow } from '../../../components/advanced-overlay-windows/dist/index';
import { Alt1Logger, LogLevel } from './logger';

/**
 * Main test application class demonstrating advanced overlay windows
 */
class AdvancedWindowsTestApp {
    private windowManager: OverlayWindowManager | null = null;
    private exampleWindow: OverlayWindow | null = null;
    private additionalWindows: OverlayWindow[] = [];
    private isInitialized = false;
    private logger: Alt1Logger;

    // UI Elements
    private elements = {
        alt1Status: null as HTMLElement | null,
        alt1StatusText: null as HTMLElement | null,
        alt1InstallLink: null as HTMLAnchorElement | null,
        openExampleWindow: null as HTMLButtonElement | null,
        closeExampleWindow: null as HTMLButtonElement | null,
        openMultipleWindows: null as HTMLButtonElement | null,
        closeAllWindows: null as HTMLButtonElement | null,
        managerStatus: null as HTMLElement | null,
        windowCount: null as HTMLElement | null,
        focusedWindow: null as HTMLElement | null,
        interactionStatus: null as HTMLElement | null,
        // Position controls
        moveWindowLeft: null as HTMLButtonElement | null,
        moveWindowRight: null as HTMLButtonElement | null,
        moveWindowUp: null as HTMLButtonElement | null,
        moveWindowDown: null as HTMLButtonElement | null,
        // Size controls
        increaseWidth: null as HTMLButtonElement | null,
        decreaseWidth: null as HTMLButtonElement | null,
        increaseHeight: null as HTMLButtonElement | null,
        decreaseHeight: null as HTMLButtonElement | null
    };

    constructor() {
        // Initialize logger first
        this.logger = new Alt1Logger('AdvancedWindowsTest', LogLevel.DEBUG);
        this.logger.init('Initializing Advanced Windows Test App...');
        this.initialize();
    }

    /**
     * Initialize the test application
     */
    private async initialize(): Promise<void> {
        this.logger.group('Initialization');

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Get UI elements
        this.getUIElements();

        // Check Alt1 availability
        this.checkAlt1Status();

        // Set up event handlers
        this.setupEventHandlers();

        // Initialize window manager if Alt1 is available
        if (window.alt1) {
            this.initializeWindowManager();
        }

        this.isInitialized = true;
        console.log('✅ Advanced Windows Test App initialized successfully');
    }

    /**
     * Get references to UI elements
     */
    private getUIElements(): void {
        this.elements.alt1Status = document.getElementById('alt1Status');
        this.elements.alt1StatusText = document.getElementById('alt1StatusText');
        this.elements.alt1InstallLink = document.getElementById('alt1InstallLink') as HTMLAnchorElement;
        this.elements.openExampleWindow = document.getElementById('openExampleWindow') as HTMLButtonElement;
        this.elements.closeExampleWindow = document.getElementById('closeExampleWindow') as HTMLButtonElement;
        this.elements.openMultipleWindows = document.getElementById('openMultipleWindows') as HTMLButtonElement;
        this.elements.closeAllWindows = document.getElementById('closeAllWindows') as HTMLButtonElement;
        this.elements.managerStatus = document.getElementById('managerStatus');
        this.elements.windowCount = document.getElementById('windowCount');
        this.elements.focusedWindow = document.getElementById('focusedWindow');
        this.elements.interactionStatus = document.getElementById('interactionStatus');
        // Position controls
        this.elements.moveWindowLeft = document.getElementById('moveWindowLeft') as HTMLButtonElement;
        this.elements.moveWindowRight = document.getElementById('moveWindowRight') as HTMLButtonElement;
        this.elements.moveWindowUp = document.getElementById('moveWindowUp') as HTMLButtonElement;
        this.elements.moveWindowDown = document.getElementById('moveWindowDown') as HTMLButtonElement;
        // Size controls
        this.elements.increaseWidth = document.getElementById('increaseWidth') as HTMLButtonElement;
        this.elements.decreaseWidth = document.getElementById('decreaseWidth') as HTMLButtonElement;
        this.elements.increaseHeight = document.getElementById('increaseHeight') as HTMLButtonElement;
        this.elements.decreaseHeight = document.getElementById('decreaseHeight') as HTMLButtonElement;
    }

    /**
     * Check Alt1 status and update UI accordingly
     */
    private checkAlt1Status(): void {
        this.logger.alt1('Checking Alt1 status...');

        if (window.alt1) {
            // Alt1 detected
            this.logger.alt1('Alt1 detected');
            if (this.elements.alt1Status) {
                this.elements.alt1Status.className = 'alt1-status detected';
            }
            if (this.elements.alt1StatusText) {
                this.elements.alt1StatusText.textContent = '✅ Alt1 detected! Advanced overlay windows are available.';
            }

            // Tell Alt1 about our app
            this.logger.alt1('Identifying app to Alt1...');
            (window as any).alt1.identifyApp('./appconfig.json');

            // Check permissions
            if (window.alt1.permissionPixel && window.alt1.permissionOverlay) {
                if (this.elements.alt1StatusText) {
                    this.elements.alt1StatusText.textContent = '🎉 Alt1 detected with full permissions! Ready to test advanced windows.';
                }
            } else {
                if (this.elements.alt1StatusText) {
                    this.elements.alt1StatusText.textContent = '⚠️ Alt1 detected but missing permissions. Please enable pixel and overlay permissions.';
                }
            }
        } else {
            // Alt1 not detected
            const addAppUrl = `alt1://addapp/${new URL('./appconfig.json', document.location.href).href}`;
            if (this.elements.alt1InstallLink) {
                this.elements.alt1InstallLink.href = addAppUrl;
            }
        }
    }

    /**
     * Initialize the window manager
     */
    private initializeWindowManager(): void {
        try {
            this.windowManager = new OverlayWindowManager();

            // Set up global event handlers
            this.windowManager.on('window-created', (data: any) => {
                console.log('🪟 Window created:', data.windowId);
                this.updateStatus();
            });

            this.windowManager.on('window-closed', (data: any) => {
                console.log('❌ Window closed:', data.windowId);
                this.updateStatus();

                // Clean up references
                if (this.exampleWindow && this.exampleWindow.id === data.windowId) {
                    this.exampleWindow = null;
                }
                this.additionalWindows = this.additionalWindows.filter(w => w.id !== data.windowId);
            });

            this.windowManager.on('window-focused', (data: any) => {
                console.log('👁️ Window focused:', data.windowId);
                this.updateStatus();
            });

            this.windowManager.on('window-moved', (data: any) => {
                console.log('📍 Window moved:', data.windowId, data.position);
            });

            this.windowManager.on('window-resized', (data: any) => {
                console.log('📏 Window resized:', data.windowId, data.size);
            });

            // Update status
            this.updateStatus();

            console.log('✅ Window manager initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize window manager:', error);
            if (this.elements.managerStatus) {
                this.elements.managerStatus.textContent = 'Error';
                this.elements.managerStatus.style.color = '#ff6b6b';
            }
        }
    }

    /**
     * Set up event handlers for UI buttons
     */
    private setupEventHandlers(): void {
        this.logger.init('Setting up event handlers...');

        // Open example window
        this.elements.openExampleWindow?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openExampleWindow', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.openExampleWindow();
        });

        // Close example window
        this.elements.closeExampleWindow?.addEventListener('click', () => {
            this.closeExampleWindow();
        });

        // Open multiple windows
        this.elements.openMultipleWindows?.addEventListener('click', () => {
            this.openMultipleWindows();
        });

        // Close all windows
        this.elements.closeAllWindows?.addEventListener('click', () => {
            this.closeAllWindows();
        });

        // Position control handlers
        this.elements.moveWindowLeft?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: moveWindowLeft', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.moveExampleWindow(-50, 0);
        });
        this.elements.moveWindowRight?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: moveWindowRight', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.moveExampleWindow(50, 0);
        });
        this.elements.moveWindowUp?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: moveWindowUp', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.moveExampleWindow(0, -50);
        });
        this.elements.moveWindowDown?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: moveWindowDown', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.moveExampleWindow(0, 50);
        });

        // Size control handlers
        this.elements.increaseWidth?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: increaseWidth', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.resizeExampleWindow(50, 0);
        });
        this.elements.decreaseWidth?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: decreaseWidth', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.resizeExampleWindow(-50, 0);
        });
        this.elements.increaseHeight?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: increaseHeight', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.resizeExampleWindow(0, 50);
        });
        this.elements.decreaseHeight?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: decreaseHeight', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.resizeExampleWindow(0, -50);
        });
    }

    /**
     * Open an example window with custom content
     */
    private openExampleWindow(): void {
        this.logger.window('openExampleWindow() called');

        if (!this.windowManager) {
            this.logger.error('openExampleWindow failed: Window manager not available');
            alert('Window manager not available. Please run in Alt1.');
            return;
        }

        if (this.exampleWindow) {
            // Window already exists, just focus it
            this.logger.window('Example window already exists, focusing:', this.exampleWindow.id);
            this.windowManager.focusWindow(this.exampleWindow.id);
            return;
        }

        try {
            this.exampleWindow = this.windowManager.createWindow({
                title: '🎯 Example Overlay Window',
                x: 200,
                y: 150,
                width: 350,
                height: 250,
                resizable: true,
                draggable: true,
                closable: true,
                contentType: 'custom',
                theme: WindowThemes.DISCORD
            });

            // Set custom content renderer
            this.exampleWindow.setContentRenderer((window) => {
                this.renderExampleWindowContent(window);
            });

            // Set up window-specific event handlers
            this.exampleWindow.on('closed', () => {
                this.logger.window('Example window closed event received');
                this.exampleWindow = null;
                this.updateButtonStates();
            });

            this.exampleWindow.on('focused', () => {
                this.logger.window('Example window gained focus');
            });

            this.updateButtonStates();
            this.logger.success('Example window created successfully:', this.exampleWindow.id);

        } catch (error) {
            this.logger.error('Failed to create example window:', error);
            alert('Failed to create window: ' + error);
        }
    }

    /**
     * Close the example window
     */
    private closeExampleWindow(): void {
        this.logger.window('closeExampleWindow() called');

        if (!this.exampleWindow) {
            this.logger.error('closeExampleWindow failed: Example window not available');
            return;
        }

        if (!this.windowManager) {
            this.logger.error('closeExampleWindow failed: Window manager not available');
            return;
        }

        const windowId = this.exampleWindow.id;
        this.logger.window(`Closing window: ${windowId}`);

        try {
            this.windowManager.closeWindow(windowId);
            this.exampleWindow = null;
            this.updateButtonStates();
            this.logger.success(`Example window closed: ${windowId}`);
        } catch (error) {
            this.logger.error('Failed to close example window:', error);
        }
    }

    /**
     * Move the example window by delta x and y
     */
    private moveExampleWindow(deltaX: number, deltaY: number): void {
        this.logger.window(`moveExampleWindow(${deltaX}, ${deltaY}) called`);

        if (!this.exampleWindow) {
            this.logger.error('moveExampleWindow failed: Example window not available');
            return;
        }

        const currentPos = this.exampleWindow.position;
        const newX = Math.max(0, currentPos.x + deltaX);
        const newY = Math.max(0, currentPos.y + deltaY);

        this.exampleWindow.setPosition(newX, newY);
        this.exampleWindow.render();

        this.logger.success(`Example window moved to (${newX}, ${newY})`);
    }

    /**
     * Resize the example window by delta width and height
     */
    private resizeExampleWindow(deltaWidth: number, deltaHeight: number): void {
        this.logger.window(`resizeExampleWindow(${deltaWidth}, ${deltaHeight}) called`);

        if (!this.exampleWindow) {
            this.logger.error('resizeExampleWindow failed: Example window not available');
            return;
        }

        const currentSize = this.exampleWindow.size;
        const newWidth = Math.max(200, currentSize.width + deltaWidth);
        const newHeight = Math.max(100, currentSize.height + deltaHeight);

        this.exampleWindow.setSize(newWidth, newHeight);
        this.exampleWindow.render();

        this.logger.success(`Example window resized to ${newWidth}x${newHeight}`);
    }

    /**
     * Open multiple windows for testing
     */
    private openMultipleWindows(): void {
        if (!this.windowManager) {
            alert('Window manager not available. Please run in Alt1.');
            return;
        }

        const windowConfigs = [
            {
                title: '🎨 Theme Demo - RuneScape',
                x: 100, y: 200, width: 300, height: 200,
                theme: WindowThemes.RUNESCAPE,
                contentType: 'custom' as const
            },
            {
                title: '🌙 Theme Demo - Dark',
                x: 450, y: 200, width: 300, height: 200,
                theme: WindowThemes.DARK,
                contentType: 'custom' as const
            },
            {
                title: '☀️ Theme Demo - Light',
                x: 800, y: 200, width: 300, height: 200,
                theme: WindowThemes.LIGHT,
                contentType: 'custom' as const
            }
        ];

        try {
            windowConfigs.forEach((config, index) => {
                const window = this.windowManager!.createWindow(config);

                // Set custom content for each window
                window.setContentRenderer((win) => {
                    this.renderThemeWindowContent(win, index + 1);
                });

                // Handle window close
                window.on('closed', () => {
                    this.additionalWindows = this.additionalWindows.filter(w => w.id !== window.id);
                    this.updateStatus();
                });

                this.additionalWindows.push(window);
            });

            console.log(`✅ Created ${windowConfigs.length} demo windows`);

        } catch (error) {
            console.error('❌ Failed to create demo windows:', error);
            alert('Failed to create demo windows: ' + error);
        }
    }

    /**
     * Close all windows
     */
    private closeAllWindows(): void {
        if (!this.windowManager) return;

        try {
            this.windowManager.closeAllWindows();
            this.exampleWindow = null;
            this.additionalWindows = [];
            console.log('✅ All windows closed');

        } catch (error) {
            console.error('❌ Failed to close all windows:', error);
        }
    }

    /**
     * Render content for the example window
     */
    private renderExampleWindowContent(window: OverlayWindow): void {
        if (!(window as any).alt1) return;

        const { x, y } = window.position;
        const contentY = y + 40; // Below title bar

        // Background for content area
        (window as any).alt1.overLayRect(
            0x36393FE0, // Slightly transparent dark background
            x + 5,
            contentY,
            window.size.width - 10,
            window.size.height - 50,
            60000,
            0
        );

        // Title
        (window as any).alt1.overLayText(
            'Interactive Example Window',
            0xFFFFFFFF,
            16,
            x + 15,
            contentY + 25,
            60000
        );

        // Instructions
        (window as any).alt1.overLayText(
            '• Note: Alt1 overlays are visual only',
            0xDCDDDEFF,
            12,
            x + 15,
            contentY + 50,
            60000
        );

        (window as any).alt1.overLayText(
            '• Use main window buttons to control',
            0xDCDDDEFF,
            12,
            x + 15,
            contentY + 70,
            60000
        );

        (window as any).alt1.overLayText(
            '• Click to focus, use × to close',
            0xDCDDDEFF,
            12,
            x + 15,
            contentY + 90,
            60000
        );

        // Current position display
        (window as any).alt1.overLayText(
            `Position: (${window.position.x}, ${window.position.y})`,
            0x74C0FCFF,
            11,
            x + 15,
            contentY + 120,
            60000
        );

        (window as any).alt1.overLayText(
            `Size: ${window.size.width}×${window.size.height}`,
            0x74C0FCFF,
            11,
            x + 15,
            contentY + 140,
            60000
        );

        // Interaction indicator
        const mousePos = this.windowManager?.getMousePosition();
        if (mousePos) {
            (window as any).alt1.overLayText(
                `Mouse: (${mousePos.x}, ${mousePos.y})`,
                0x51CF66FF,
                11,
                x + 15,
                contentY + 160,
                60000
            );
        }
    }

    /**
     * Render content for theme demo windows
     */
    private renderThemeWindowContent(window: OverlayWindow, windowNumber: number): void {
        if (!(window as any).alt1) return;

        const { x, y } = window.position;
        const contentY = y + 40;

        // Theme info
        const themes = ['RuneScape', 'Dark', 'Light'];
        const themeName = themes[windowNumber - 1] || 'Custom';

        (window as any).alt1.overLayText(
            `${themeName} Theme Demo`,
            0xFFFFFFFF,
            14,
            x + 15,
            contentY + 25,
            60000
        );

        (window as any).alt1.overLayText(
            'This window demonstrates',
            0xDCDDDEFF,
            11,
            x + 15,
            contentY + 50,
            60000
        );

        (window as any).alt1.overLayText(
            `the ${themeName.toLowerCase()} theme styling`,
            0xDCDDDEFF,
            11,
            x + 15,
            contentY + 70,
            60000
        );

        (window as any).alt1.overLayText(
            'with custom colors and effects.',
            0xDCDDDEFF,
            11,
            x + 15,
            contentY + 90,
            60000
        );

        // Window number indicator
        (window as any).alt1.overLayText(
            `Window #${windowNumber}`,
            0x74C0FCFF,
            12,
            x + 15,
            contentY + 120,
            60000
        );
    }

    /**
     * Update button states based on current window state
     */
    private updateButtonStates(): void {
        const hasExampleWindow = !!this.exampleWindow;

        if (this.elements.closeExampleWindow) {
            this.elements.closeExampleWindow.disabled = !hasExampleWindow;
        }

        // Enable/disable position controls
        if (this.elements.moveWindowLeft) {
            this.elements.moveWindowLeft.disabled = !hasExampleWindow;
        }
        if (this.elements.moveWindowRight) {
            this.elements.moveWindowRight.disabled = !hasExampleWindow;
        }
        if (this.elements.moveWindowUp) {
            this.elements.moveWindowUp.disabled = !hasExampleWindow;
        }
        if (this.elements.moveWindowDown) {
            this.elements.moveWindowDown.disabled = !hasExampleWindow;
        }

        // Enable/disable size controls
        if (this.elements.increaseWidth) {
            this.elements.increaseWidth.disabled = !hasExampleWindow;
        }
        if (this.elements.decreaseWidth) {
            this.elements.decreaseWidth.disabled = !hasExampleWindow;
        }
        if (this.elements.increaseHeight) {
            this.elements.increaseHeight.disabled = !hasExampleWindow;
        }
        if (this.elements.decreaseHeight) {
            this.elements.decreaseHeight.disabled = !hasExampleWindow;
        }
    }

    /**
     * Update status display
     */
    private updateStatus(): void {
        if (!this.windowManager) return;

        // Manager status
        if (this.elements.managerStatus) {
            this.elements.managerStatus.textContent = 'Initialized';
            this.elements.managerStatus.style.color = '#51cf66';
        }

        // Window count
        const totalWindows = this.windowManager.getAllWindows().length;
        if (this.elements.windowCount) {
            this.elements.windowCount.textContent = totalWindows.toString();
        }

        // Focused window
        const focusedWindow = this.windowManager.getFocusedWindow();
        if (this.elements.focusedWindow) {
            this.elements.focusedWindow.textContent = focusedWindow
                ? focusedWindow['state'].config.title
                : 'None';
        }

        // Interaction status
        if (this.elements.interactionStatus) {
            this.elements.interactionStatus.textContent = 'Active';
            this.elements.interactionStatus.style.color = '#51cf66';
        }

        // Update button states
        this.updateButtonStates();
    }
}

// Initialize the app when the script loads
const testApp = new AdvancedWindowsTestApp();

// Export for global access (useful for debugging)
if (typeof window !== 'undefined') {
    (window as any).testApp = testApp;
}

console.log('📦 Advanced Windows Test Plugin loaded successfully');