// Interactive Windows Test Plugin
// Demonstrates the capabilities of the @tmg-alt1/interactive-windows component

import * as a1lib from 'alt1';
import {
    InteractiveWindowManager,
    HybridWindowManager,
    createSettingsTemplate,
    WindowThemes,
    type HybridWindowConfig
} from '../../../components/interactive-windows/dist/index';
import {
    WindowResizer,
    LayoutManager,
    type WindowCapabilities,
    type ResizeResult,
    LAYOUT_PRESETS
} from '../../../components/window-resizer/dist/index';
import { Alt1Logger, LogLevel } from './logger';

/**
 * Main test application class demonstrating interactive windows
 */
class InteractiveWindowsTestApp {
    private windowManager: InteractiveWindowManager | null = null;
    private hybridWindowManager: HybridWindowManager | null = null;
    private windowResizer: WindowResizer | null = null;
    private layoutManager: LayoutManager | null = null;
    private openWindows: any[] = [];
    private isInitialized = false;
    private logger: Alt1Logger;

    // UI Elements
    private elements = {
        alt1Status: null as HTMLElement | null,
        alt1StatusText: null as HTMLElement | null,
        alt1InstallLink: null as HTMLAnchorElement | null,
        openInteractiveModal: null as HTMLButtonElement | null,
        openSettingsModal: null as HTMLButtonElement | null,
        openMultipleWindows: null as HTMLButtonElement | null,
        openHybridModal: null as HTMLButtonElement | null,
        testWindowResize: null as HTMLButtonElement | null,
        testCompactLayout: null as HTMLButtonElement | null,
        testExpandedLayout: null as HTMLButtonElement | null,
        detectResizeCapabilities: null as HTMLButtonElement | null,
        showAlert: null as HTMLButtonElement | null,
        showConfirm: null as HTMLButtonElement | null,
        closeAllWindows: null as HTMLButtonElement | null,
        managerStatus: null as HTMLElement | null,
        windowCount: null as HTMLElement | null,
        focusedWindow: null as HTMLElement | null,
        resizerStatus: null as HTMLElement | null,
        currentWindowSize: null as HTMLElement | null,
        userResizeStatus: null as HTMLElement | null,
        webApiStatus: null as HTMLElement | null
    };

    constructor() {
        // Initialize logger first
        this.logger = new Alt1Logger('InteractiveWindowsTest', LogLevel.DEBUG);
        this.logger.init('Initializing Interactive Windows Test App...');
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

        // Initialize window managers
        this.initializeInteractiveWindowManager();
        this.initializeHybridWindowManager();
        this.initializeWindowResizer();
        this.initializeLayoutManager();

        this.isInitialized = true;
        console.log('✅ Interactive Windows Test App initialized successfully');
    }

    /**
     * Get references to UI elements
     */
    private getUIElements(): void {
        this.elements.alt1Status = document.getElementById('alt1Status');
        this.elements.alt1StatusText = document.getElementById('alt1StatusText');
        this.elements.alt1InstallLink = document.getElementById('alt1InstallLink') as HTMLAnchorElement;
        this.elements.openInteractiveModal = document.getElementById('openInteractiveModal') as HTMLButtonElement;
        this.elements.openSettingsModal = document.getElementById('openSettingsModal') as HTMLButtonElement;
        this.elements.openMultipleWindows = document.getElementById('openMultipleWindows') as HTMLButtonElement;
        this.elements.openHybridModal = document.getElementById('openHybridModal') as HTMLButtonElement;
        this.elements.testWindowResize = document.getElementById('testWindowResize') as HTMLButtonElement;
        this.elements.testCompactLayout = document.getElementById('testCompactLayout') as HTMLButtonElement;
        this.elements.testExpandedLayout = document.getElementById('testExpandedLayout') as HTMLButtonElement;
        this.elements.detectResizeCapabilities = document.getElementById('detectResizeCapabilities') as HTMLButtonElement;
        this.elements.showAlert = document.getElementById('showAlert') as HTMLButtonElement;
        this.elements.showConfirm = document.getElementById('showConfirm') as HTMLButtonElement;
        this.elements.closeAllWindows = document.getElementById('closeAllWindows') as HTMLButtonElement;
        this.elements.managerStatus = document.getElementById('managerStatus');
        this.elements.windowCount = document.getElementById('windowCount');
        this.elements.focusedWindow = document.getElementById('focusedWindow');
        this.elements.resizerStatus = document.getElementById('resizerStatus');
        this.elements.currentWindowSize = document.getElementById('currentWindowSize');
        this.elements.userResizeStatus = document.getElementById('userResizeStatus');
        this.elements.webApiStatus = document.getElementById('webApiStatus');
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
                this.elements.alt1Status.className = 'header-status detected';
            }
            if (this.elements.alt1StatusText) {
                this.elements.alt1StatusText.textContent = '✅ Alt1 Ready';
            }

            // Tell Alt1 about our app
            this.logger.alt1('Identifying app to Alt1...');
            a1lib.identifyApp('./appconfig.json');

            // Update status icon
            const statusIcon = this.elements.alt1Status?.querySelector('.status-icon');
            if (statusIcon) {
                statusIcon.textContent = '✅';
            }
        } else {
            // Alt1 not detected
            const addAppUrl = `alt1://addapp/${new URL('./appconfig.json', document.location.href).href}`;
            if (this.elements.alt1InstallLink) {
                this.elements.alt1InstallLink.href = addAppUrl;
                this.elements.alt1InstallLink.style.display = 'inline';
            }

            if (this.elements.alt1StatusText) {
                this.elements.alt1StatusText.textContent = '❌ Alt1 not detected';
            }

            // Update status icon
            const statusIcon = this.elements.alt1Status?.querySelector('.status-icon');
            if (statusIcon) {
                statusIcon.textContent = '❌';
            }
        }
    }

    /**
     * Initialize the interactive window manager
     */
    private initializeInteractiveWindowManager(): void {
        try {
            this.logger.init('Initializing InteractiveWindowManager...');

            this.windowManager = new InteractiveWindowManager();
            this.logger.success('InteractiveWindowManager initialized successfully');

            // Set up event listeners for window events
            this.setupWindowEventListeners();

            // Update status
            this.updateStatus();
            this.updateResizeStatus();

        } catch (error) {
            this.logger.error('Failed to initialize InteractiveWindowManager:', error);
            if (this.elements.managerStatus) {
                this.elements.managerStatus.textContent = 'Error';
                this.elements.managerStatus.style.color = '#ff6b6b';
            }
        }
    }

    /**
     * Initialize the hybrid window manager
     */
    private initializeHybridWindowManager(): void {
        try {
            this.logger.init('Initializing HybridWindowManager...');

            this.hybridWindowManager = new HybridWindowManager();
            this.logger.success('HybridWindowManager initialized successfully');

        } catch (error) {
            this.logger.error('Failed to initialize HybridWindowManager:', error);
        }
    }

    /**
     * Initialize the window resizer component
     */
    private initializeWindowResizer(): void {
        try {
            this.logger.init('Initializing WindowResizer...');

            this.windowResizer = new WindowResizer({
                enableFallbacks: true,
                maxFallbackAttempts: 3,
                detectCapabilitiesOnInit: true,
                logLevel: 'debug'
            });

            this.logger.success('WindowResizer initialized successfully');
            this.updateResizeStatus();

        } catch (error) {
            this.logger.error('Failed to initialize WindowResizer:', error);
            if (this.elements.resizerStatus) {
                this.elements.resizerStatus.textContent = 'Error';
                this.elements.resizerStatus.style.color = '#ff6b6b';
            }
        }
    }

    /**
     * Initialize the layout manager
     */
    private initializeLayoutManager(): void {
        try {
            this.logger.init('Initializing LayoutManager...');

            if (!this.windowResizer) {
                this.logger.error('Cannot initialize LayoutManager: WindowResizer not available');
                return;
            }

            this.layoutManager = new LayoutManager(this.windowResizer);

            // Add some preset layouts for testing
            this.layoutManager.addLayout({
                name: 'test-compact',
                displayName: 'Test Compact',
                width: 400,
                height: 300,
                description: 'Compact layout for testing',
                responsive: true
            });

            this.layoutManager.addLayout({
                name: 'test-expanded',
                displayName: 'Test Expanded',
                width: 800,
                height: 600,
                description: 'Expanded layout for testing',
                responsive: true
            });

            this.logger.success('LayoutManager initialized successfully');

        } catch (error) {
            this.logger.error('Failed to initialize LayoutManager:', error);
        }
    }

    /**
     * Set up event listeners for window events
     */
    private setupWindowEventListeners(): void {
        // Window event handling would be implemented here
        // The InteractiveWindowManager handles its own events internally
    }

    /**
     * Set up event handlers for UI buttons
     */
    private setupEventHandlers(): void {
        this.logger.init('Setting up event handlers...');

        // Open interactive modal
        this.elements.openInteractiveModal?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openInteractiveModal', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.openInteractiveModal();
        });

        // Open settings modal
        this.elements.openSettingsModal?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openSettingsModal', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.openSettingsModal();
        });

        // Open multiple windows
        this.elements.openMultipleWindows?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openMultipleWindows', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.openMultipleWindows();
        });

        // Open hybrid modal (full screen positioning)
        this.elements.openHybridModal?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openHybridModal', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.openHybridModal();
        });

        // Test window resize functionality
        this.elements.testWindowResize?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testWindowResize', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.testWindowResize();
        });

        // Test compact layout
        this.elements.testCompactLayout?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testCompactLayout', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.testCompactLayout();
        });

        // Test expanded layout
        this.elements.testExpandedLayout?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testExpandedLayout', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.testExpandedLayout();
        });

        // Detect resize capabilities
        this.elements.detectResizeCapabilities?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: detectResizeCapabilities', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.detectResizeCapabilities();
        });

        // Show alert
        this.elements.showAlert?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: showAlert', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.showAlert();
        });

        // Show confirm dialog
        this.elements.showConfirm?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: showConfirm', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.showConfirm();
        });

        // Close all windows
        this.elements.closeAllWindows?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: closeAllWindows', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.closeAllWindows();
        });
    }

    /**
     * Open an interactive modal window
     */
    private openInteractiveModal(): void {
        this.logger.window('openInteractiveModal() called');

        if (!this.windowManager) {
            this.logger.error('openInteractiveModal failed: Window manager not available');
            return;
        }

        try {
            const modal = this.windowManager.createModal({
                title: '🎯 Interactive Modal Test',
                width: 500,
                height: 400,
                content: `
                    <div style="padding: 20px; font-family: 'Segoe UI', sans-serif;">
                        <h2 style="margin: 0 0 20px 0; color: #333;">🎉 This window is fully interactive!</h2>

                        <div style="margin: 20px 0;">
                            <h3 style="color: #007ACC;">✨ Try these interactions:</h3>
                            <ul style="line-height: 1.6;">
                                <li><strong>🖱️ Drag:</strong> Click and drag the title bar</li>
                                <li><strong>📏 Resize:</strong> Drag the corners or edges</li>
                                <li><strong>❌ Close:</strong> Click the X button</li>
                                <li><strong>⌨️ Type:</strong> Use the input field below</li>
                            </ul>
                        </div>

                        <div style="margin: 20px 0;">
                            <label style="display: block; margin-bottom: 10px; color: #555;">
                                <strong>Test Input Field:</strong>
                            </label>
                            <input type="text" placeholder="Type something here..."
                                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>

                        <div style="margin: 20px 0;">
                            <button onclick="alert('Button clicked! This proves mouse events work!')"
                                    style="background: #007ACC; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                                🎯 Click Me!
                            </button>
                            <button onclick="this.closest('.interactive-window').querySelector('.close-button').click()"
                                    style="background: #ff6b6b; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; margin-left: 10px;">
                                🔴 Close Window
                            </button>
                        </div>

                        <div style="padding: 15px; background: #f0f8ff; border-radius: 6px; border-left: 4px solid #007ACC;">
                            <p style="margin: 0; color: #0066cc; font-size: 13px;">
                                <strong>💡 Notice:</strong> Unlike Alt1 overlays, this window responds to all mouse and keyboard events!
                            </p>
                        </div>
                    </div>
                `,
                theme: WindowThemes.DISCORD,
                resizable: true,
                draggable: true,
                closable: true
            });

            this.openWindows.push(modal);
            this.updateStatus();
            this.logger.success('Interactive modal created:', modal.id);

        } catch (error) {
            this.logger.error('Failed to create interactive modal:', error);
        }
    }

    /**
     * Open settings modal
     */
    private openSettingsModal(): void {
        this.logger.window('openSettingsModal() called');

        if (!this.windowManager) {
            this.logger.error('openSettingsModal failed: Window manager not available');
            return;
        }

        try {
            const settingsTemplate = createSettingsTemplate({
                title: 'Interactive Windows Settings',
                sections: [
                    {
                        title: 'Display Options',
                        fields: [
                            {
                                label: 'Window Opacity',
                                type: 'range',
                                key: 'opacity',
                                value: 90,
                                min: 10,
                                max: 100
                            },
                            {
                                label: 'Show Window Animations',
                                type: 'checkbox',
                                key: 'showAnimations',
                                value: true
                            },
                            {
                                label: 'Default Theme',
                                type: 'select',
                                key: 'theme',
                                value: 'discord',
                                options: [
                                    { label: 'Discord', value: 'discord' },
                                    { label: 'RuneScape', value: 'runescape' },
                                    { label: 'Modern Dark', value: 'modern-dark' },
                                    { label: 'Modern Light', value: 'modern-light' }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Interaction Settings',
                        fields: [
                            {
                                label: 'Enable Drag and Drop',
                                type: 'checkbox',
                                key: 'enableDragDrop',
                                value: true
                            },
                            {
                                label: 'Enable Resize Handles',
                                type: 'checkbox',
                                key: 'enableResize',
                                value: true
                            },
                            {
                                label: 'Max Open Windows',
                                type: 'number',
                                key: 'maxWindows',
                                value: 5,
                                min: 1,
                                max: 20
                            }
                        ]
                    }
                ],
                onSave: (values) => {
                    this.logger.data('Settings saved:', values);
                    alert(`Settings saved! Values: ${JSON.stringify(values, null, 2)}`);
                },
                onCancel: () => {
                    this.logger.ui('Settings cancelled');
                    console.log('Settings cancelled');
                }
            });

            const settingsModal = this.windowManager.createSettingsModal('⚙️ Settings', settingsTemplate);
            this.openWindows.push(settingsModal);
            this.updateStatus();
            this.logger.success('Settings modal created:', settingsModal.id);

        } catch (error) {
            this.logger.error('Failed to create settings modal:', error);
        }
    }

    /**
     * Open multiple test windows
     */
    private openMultipleWindows(): void {
        this.logger.window('openMultipleWindows() called');

        if (!this.windowManager) {
            this.logger.error('openMultipleWindows failed: Window manager not available');
            return;
        }

        const themes = [WindowThemes.DISCORD, WindowThemes.RUNESCAPE, WindowThemes.MODERN_DARK];
        const colors = ['#007ACC', '#28A745', '#FF6B6B'];

        for (let i = 0; i < 3; i++) {
            try {
                const window = this.windowManager.createModal({
                    title: `🪟 Test Window ${i + 1}`,
                    width: 300,
                    height: 250,
                    content: `
                        <div style="padding: 20px; text-align: center;">
                            <h3 style="color: ${colors[i]};">Window ${i + 1}</h3>
                            <p>This is test window number ${i + 1}.</p>
                            <p>Try dragging this window around!</p>
                            <button onclick="alert('Window ${i + 1} button clicked!')"
                                    style="background: ${colors[i]}; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                                Click Me!
                            </button>
                        </div>
                    `,
                    theme: themes[i],
                    resizable: true,
                    draggable: true,
                    closable: true
                });

                // Position windows in a cascade
                window.setPosition(100 + (i * 50), 100 + (i * 50));

                this.openWindows.push(window);
                this.logger.success(`Test window ${i + 1} created:`, window.id);

            } catch (error) {
                this.logger.error(`Failed to create test window ${i + 1}:`, error);
            }
        }

        this.updateStatus();
    }

    /**
     * Open hybrid modal with full RuneScape window positioning
     */
    private openHybridModal(): void {
        this.logger.window('openHybridModal() called');

        if (!this.hybridWindowManager) {
            this.logger.error('openHybridModal failed: Hybrid window manager not available');
            return;
        }

        try {
            // Position the modal at specific RS coordinates (not constrained to plugin window)
            const rsX = 200; // RS coordinate X
            const rsY = 150; // RS coordinate Y

            const hybridConfig: HybridWindowConfig = {
                title: '🌟 Hybrid Window - Full Screen Positioning!',
                width: 500,
                height: 400,
                rsX,
                rsY,
                content: `
                    <div style="padding: 20px; font-family: 'Segoe UI', sans-serif;">
                        <h2 style="margin: 0 0 20px 0; color: #007ACC;">🚀 Breakthrough Achieved!</h2>

                        <div style="padding: 15px; background: #e8f5e8; border-radius: 6px; border-left: 4px solid #28A745; margin-bottom: 20px;">
                            <p style="margin: 0; color: #155724; font-weight: 500;">
                                ✅ This window can be positioned anywhere on the RuneScape window!
                            </p>
                        </div>

                        <div style="margin: 20px 0;">
                            <h3 style="color: #333; margin-bottom: 10px;">🎯 Hybrid Window Features:</h3>
                            <ul style="line-height: 1.8; color: #555;">
                                <li><strong>🗺️ Full Screen Positioning:</strong> Uses Alt1 overlays for chrome</li>
                                <li><strong>🎮 Interactive Content:</strong> DOM elements for full interactivity</li>
                                <li><strong>📍 RS Coordinates:</strong> Positioned at RS coords (${rsX}, ${rsY})</li>
                                <li><strong>🖱️ Click & Type:</strong> All interactions work normally</li>
                                <li><strong>🎨 Overlay Chrome:</strong> Title bar drawn with Alt1 overlays</li>
                            </ul>
                        </div>

                        <div style="margin: 20px 0;">
                            <label style="display: block; margin-bottom: 10px; color: #333; font-weight: 500;">
                                Test Interactive Input:
                            </label>
                            <input type="text" placeholder="Type to test keyboard input..."
                                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>

                        <div style="margin: 20px 0;">
                            <button onclick="alert('Interactive button works! 🎉')"
                                    style="background: #28A745; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 10px;">
                                🎯 Test Interaction
                            </button>
                            <button onclick="console.log('Console output from hybrid window')"
                                    style="background: #007ACC; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                                📊 Console Log
                            </button>
                        </div>

                        <div style="padding: 15px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;">
                            <p style="margin: 0; color: #856404; font-size: 13px;">
                                <strong>💡 Technical Note:</strong> The window chrome (title bar, border) is drawn using Alt1 overlays,
                                while the content area uses DOM elements for full interactivity!
                            </p>
                        </div>
                    </div>
                `,
                theme: WindowThemes.DISCORD,
                useOverlayChrome: true,
                overlayColor: a1lib.mixColor(100, 100, 150, 200),
                overlayLineWidth: 3,
                overlayDuration: 150,
                draggable: true,
                resizable: false,
                closable: true
            };

            const modal = this.hybridWindowManager.createModal(hybridConfig);
            this.openWindows.push(modal);
            this.updateStatus();
            this.logger.success('Hybrid modal created with RS positioning:', { rsX, rsY });

        } catch (error) {
            this.logger.error('Failed to create hybrid modal:', error);
        }
    }

    /**
     * Show alert dialog
     */
    private async showAlert(): Promise<void> {
        this.logger.window('showAlert() called');

        if (!this.windowManager) {
            this.logger.error('showAlert failed: Window manager not available');
            return;
        }

        try {
            await this.windowManager.alert(
                '📢 Alert Dialog Test',
                'This is an interactive alert dialog! Unlike Alt1 overlays, this dialog can be clicked, dragged, and properly focused.'
            );
            this.logger.success('Alert dialog completed');
        } catch (error) {
            this.logger.error('Failed to show alert:', error);
        }
    }

    /**
     * Show confirmation dialog
     */
    private async showConfirm(): Promise<void> {
        this.logger.window('showConfirm() called');

        if (!this.windowManager) {
            this.logger.error('showConfirm failed: Window manager not available');
            return;
        }

        try {
            const confirmed = await this.windowManager.confirm(
                '❓ Confirmation Dialog Test',
                'Do you want to test the confirmation dialog? This demonstrates async/await support with interactive buttons.'
            );

            if (confirmed) {
                this.logger.success('User confirmed dialog');
                alert('You clicked Yes! ✅');
            } else {
                this.logger.ui('User cancelled dialog');
                alert('You clicked No! ❌');
            }
        } catch (error) {
            this.logger.error('Failed to show confirmation:', error);
        }
    }

    /**
     * Close all open windows
     */
    private closeAllWindows(): void {
        this.logger.window('closeAllWindows() called');

        if (!this.windowManager) {
            this.logger.error('closeAllWindows failed: Window manager not available');
            return;
        }

        try {
            this.windowManager.closeAllWindows();
            this.openWindows = [];
            this.updateStatus();
            this.logger.success('All windows closed');
        } catch (error) {
            this.logger.error('Failed to close all windows:', error);
        }
    }

    /**
     * Update status display
     */
    private updateStatus(): void {
        if (this.elements.managerStatus) {
            this.elements.managerStatus.textContent = this.windowManager ? 'Ready' : 'Not Available';
            this.elements.managerStatus.style.color = this.windowManager ? '#51cf66' : '#ff6b6b';
        }

        if (this.elements.windowCount) {
            const count = this.windowManager ? this.windowManager.getVisibleWindows().length : 0;
            this.elements.windowCount.textContent = count.toString();
        }

        if (this.elements.focusedWindow) {
            const visibleWindows = this.windowManager ? this.windowManager.getVisibleWindows() : [];
            const focusedWindow = visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1] : null;
            this.elements.focusedWindow.textContent = focusedWindow ? focusedWindow.id : 'None';
        }
    }

    /**
     * Update resize status display
     */
    private updateResizeStatus(): void {
        if (this.elements.resizerStatus) {
            this.elements.resizerStatus.textContent = this.windowResizer ? 'Ready' : 'Not Available';
            this.elements.resizerStatus.style.color = this.windowResizer ? '#51cf66' : '#ff6b6b';
        }

        if (this.elements.currentWindowSize && this.windowResizer) {
            const size = this.windowResizer.getCurrentSize();
            this.elements.currentWindowSize.textContent = `${size.width}x${size.height}`;
        }

        if (this.windowResizer) {
            const capabilities = this.windowResizer.detectCapabilities();

            if (this.elements.userResizeStatus) {
                this.elements.userResizeStatus.textContent = capabilities.alt1APIs.userResize ? 'Available' : 'Not Available';
                this.elements.userResizeStatus.style.color = capabilities.alt1APIs.userResize ? '#51cf66' : '#ff6b6b';
            }

            if (this.elements.webApiStatus) {
                const hasWebAPIs = capabilities.webAPIs.resizeTo || capabilities.webAPIs.resizeBy;
                this.elements.webApiStatus.textContent = hasWebAPIs ? 'Available' : 'Blocked';
                this.elements.webApiStatus.style.color = hasWebAPIs ? '#51cf66' : '#ff6b6b';
            }
        }
    }

    /**
     * Test Alt1 window resize functionality
     */
    private async testWindowResize(): Promise<void> {
        this.logger.window('testWindowResize() called');

        if (!this.windowResizer) {
            this.logger.error('testWindowResize failed: Window resizer not available');
            alert('❌ Window resizer not initialized!');
            return;
        }

        try {
            this.logger.window('Attempting to resize window to 800x600...');

            const result: ResizeResult = await this.windowResizer.resizeWindow(800, 600, {
                animated: true,
                duration: 300,
                maxAttempts: 3,
                fallbackToContentExpansion: true,
                onProgress: (progressResult) => {
                    this.logger.window('Resize progress:', progressResult);
                },
                onError: (error, method) => {
                    this.logger.error(`Resize error with ${method}:`, error);
                }
            });

            this.updateResizeStatus();

            if (result.success) {
                this.logger.success('Window resize succeeded:', result);
                alert(`✅ Window resize successful!\n\nMethod: ${result.method}\nNew size: ${result.newSize?.width}x${result.newSize?.height}\nExecution time: ${result.executionTime?.toFixed(2)}ms`);
            } else {
                this.logger.error('Window resize failed:', result);
                alert(`❌ Window resize failed!\n\nError: ${result.error}\nFallbacks attempted: ${result.fallbacksAttempted}\nExecution time: ${result.executionTime?.toFixed(2)}ms\n\nThis demonstrates Alt1's window resize limitations.`);
            }

        } catch (error) {
            this.logger.error('Failed to test window resize:', error);
            alert(`❌ Window resize test failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Test compact layout switching
     */
    private async testCompactLayout(): Promise<void> {
        this.logger.window('testCompactLayout() called');

        if (!this.layoutManager) {
            this.logger.error('testCompactLayout failed: Layout manager not available');
            alert('❌ Layout manager not initialized!');
            return;
        }

        try {
            this.logger.window('Switching to compact layout...');

            const result = await this.layoutManager.switchLayout('test-compact', {
                animated: true,
                duration: 300,
                onProgress: (progressResult) => {
                    this.logger.window('Layout switch progress:', progressResult);
                }
            });

            if (result.success) {
                this.logger.success('Compact layout applied:', result);
                alert(`📱 Compact Layout Applied!\n\nSize: 400x300\nMethod: ${result.method}\n\nNote: This is content-based resizing since Alt1 blocks true window resizing.`);
            } else {
                this.logger.error('Compact layout failed:', result);
                alert(`❌ Compact layout failed: ${result.error}`);
            }

            this.updateResizeStatus();

        } catch (error) {
            this.logger.error('Failed to test compact layout:', error);
            alert(`❌ Compact layout test failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Test expanded layout switching
     */
    private async testExpandedLayout(): Promise<void> {
        this.logger.window('testExpandedLayout() called');

        if (!this.layoutManager) {
            this.logger.error('testExpandedLayout failed: Layout manager not available');
            alert('❌ Layout manager not initialized!');
            return;
        }

        try {
            this.logger.window('Switching to expanded layout...');

            const result = await this.layoutManager.switchLayout('test-expanded', {
                animated: true,
                duration: 300,
                onProgress: (progressResult) => {
                    this.logger.window('Layout switch progress:', progressResult);
                }
            });

            if (result.success) {
                this.logger.success('Expanded layout applied:', result);
                alert(`📊 Expanded Layout Applied!\n\nSize: 800x600\nMethod: ${result.method}\n\nNote: This demonstrates content-based adaptive layouts.`);
            } else {
                this.logger.error('Expanded layout failed:', result);
                alert(`❌ Expanded layout failed: ${result.error}`);
            }

            this.updateResizeStatus();

        } catch (error) {
            this.logger.error('Failed to test expanded layout:', error);
            alert(`❌ Expanded layout test failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Detect and display resize capabilities
     */
    private detectResizeCapabilities(): void {
        this.logger.window('detectResizeCapabilities() called');

        if (!this.windowResizer) {
            this.logger.error('detectResizeCapabilities failed: Window resizer not available');
            alert('❌ Window resizer not initialized!');
            return;
        }

        try {
            const capabilities: WindowCapabilities = this.windowResizer.detectCapabilities();
            const availableStrategies = this.windowResizer.getAvailableStrategies();

            this.logger.window('Detected capabilities:', capabilities);
            this.logger.window('Available strategies:', availableStrategies.map(s => s.name));

            this.updateResizeStatus();

            // Build detailed capability report
            let report = '🔍 Alt1 Window Resize Capabilities\n\n';

            report += '📊 Web APIs:\n';
            report += `  • resizeTo(): ${capabilities.webAPIs.resizeTo ? '✅ Available' : '❌ Blocked'}\n`;
            report += `  • resizeBy(): ${capabilities.webAPIs.resizeBy ? '✅ Available' : '❌ Blocked'}\n`;
            report += `  • outerWidth: ${capabilities.webAPIs.outerWidth ? '✅ Available' : '❌ Blocked'}\n`;
            report += `  • outerHeight: ${capabilities.webAPIs.outerHeight ? '✅ Available' : '❌ Blocked'}\n\n`;

            report += '🎮 Alt1 APIs:\n';
            report += `  • userResize(): ${capabilities.alt1APIs.userResize ? '✅ Available' : '❌ Not Available'}\n`;
            report += `  • updateConfig(): ${capabilities.alt1APIs.updateConfig ? '✅ Available' : '❌ Not Available'}\n`;
            report += `  • windowControl(): ${capabilities.alt1APIs.windowControl ? '✅ Available' : '❌ Not Available'}\n\n`;

            report += '🔧 Alternative Methods:\n';
            report += `  • Content Expansion: ${capabilities.contentExpansion ? '✅ Available' : '❌ Not Available'}\n`;
            report += `  • External Control: ${capabilities.externalControl ? '✅ Available' : '❌ Not Available'}\n\n`;

            report += `🏷️ Alt1 Version: ${capabilities.detectedVersion || 'Unknown'}\n\n`;

            report += '⚡ Available Strategies:\n';
            availableStrategies.forEach((strategy, index) => {
                report += `  ${index + 1}. ${strategy.name} (priority: ${strategy.priority})\n`;
            });

            if (capabilities.limitations && capabilities.limitations.length > 0) {
                report += '\n⚠️ Detected Limitations:\n';
                capabilities.limitations.forEach(limitation => {
                    report += `  • ${limitation}\n`;
                });
            }

            report += '\n💡 Conclusion:\n';
            if (capabilities.alt1APIs.userResize) {
                report += 'Alt1 userResize API is available but designed for user interaction, not programmatic control.';
            } else {
                report += 'Alt1 blocks programmatic window resizing. Content-based adaptive layouts are the recommended alternative.';
            }

            alert(report);

        } catch (error) {
            this.logger.error('Failed to detect resize capabilities:', error);
            alert(`❌ Capability detection failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

// Initialize the app when the page loads
const app = new InteractiveWindowsTestApp();