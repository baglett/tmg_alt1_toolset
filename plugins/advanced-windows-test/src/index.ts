// Alt1 Window Resize Test - MVP
// Focused testing of Alt1 window resize functionality and current size detection

import * as a1lib from 'alt1';
import {
    WindowResizer,
    type WindowCapabilities,
    type ResizeResult
} from '../../../components/window-resizer/dist/index';
import { Alt1Logger, LogLevel } from './logger';

/**
 * Minimal Alt1 window resize test application
 */
class Alt1WindowResizeTest {
    private windowResizer: WindowResizer | null = null;
    private sizeUpdateInterval: number | null = null;
    private logger: Alt1Logger;

    // UI Elements
    private elements = {
        alt1Status: null as HTMLElement | null,
        alt1StatusText: null as HTMLElement | null,
        alt1InstallLink: null as HTMLAnchorElement | null,
        currentSizeDisplay: null as HTMLElement | null,
        testWindowResize: null as HTMLButtonElement | null,
        testWindowResize2: null as HTMLButtonElement | null,
        refreshSize: null as HTMLButtonElement | null,
        resizerStatus: null as HTMLElement | null,
        currentWindowSize: null as HTMLElement | null,
        userResizeStatus: null as HTMLElement | null,
        webApiStatus: null as HTMLElement | null,
        lastResizeResult: null as HTMLElement | null
    };

    constructor() {
        this.logger = new Alt1Logger('Alt1WindowResizeTest', LogLevel.DEBUG);
        this.logger.init('Initializing Alt1 Window Resize Test...');
        this.initialize();
    }

    /**
     * Initialize the test application
     */
    private async initialize(): Promise<void> {
        this.logger.init('Starting initialization...');

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Wait a bit for Alt1 API to be injected
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get UI elements
        this.getUIElements();

        // Check Alt1 availability
        this.checkAlt1Status();

        // Set up event handlers
        this.setupEventHandlers();

        // Initialize window resizer
        this.initializeWindowResizer();

        // Start real-time size monitoring
        this.startSizeMonitoring();

        this.logger.success('Alt1 Window Resize Test initialized successfully');
    }

    /**
     * Get references to UI elements
     */
    private getUIElements(): void {
        this.elements.alt1Status = document.getElementById('alt1Status');
        this.elements.alt1StatusText = document.getElementById('alt1StatusText');
        this.elements.alt1InstallLink = document.getElementById('alt1InstallLink') as HTMLAnchorElement;
        this.elements.currentSizeDisplay = document.getElementById('currentSizeDisplay');
        this.elements.testWindowResize = document.getElementById('testWindowResize') as HTMLButtonElement;
        this.elements.testWindowResize2 = document.getElementById('testWindowResize2') as HTMLButtonElement;
        this.elements.refreshSize = document.getElementById('refreshSize') as HTMLButtonElement;
        this.elements.resizerStatus = document.getElementById('resizerStatus');
        this.elements.currentWindowSize = document.getElementById('currentWindowSize');
        this.elements.userResizeStatus = document.getElementById('userResizeStatus');
        this.elements.webApiStatus = document.getElementById('webApiStatus');
        this.elements.lastResizeResult = document.getElementById('lastResizeResult');
    }

    /**
     * Check Alt1 status and update UI accordingly
     */
    private checkAlt1Status(): void {
        this.logger.alt1('Checking Alt1 status...');

        // Check both window.alt1 and global alt1
        const hasWindowAlt1 = !!(window as any).alt1;
        const hasGlobalAlt1 = typeof alt1 !== 'undefined';
        const isAlt1Available = hasWindowAlt1 || hasGlobalAlt1;

        this.logger.alt1('Alt1 detection results:', {
            hasWindowAlt1,
            hasGlobalAlt1,
            isAlt1Available
        });

        if (isAlt1Available) {
            this.logger.alt1('Alt1 detected');
            if (this.elements.alt1Status) {
                this.elements.alt1Status.className = 'header-status detected';
            }
            if (this.elements.alt1StatusText) {
                this.elements.alt1StatusText.textContent = ' Alt1 Ready';
            }

            this.logger.alt1('Identifying app to Alt1...');
            try {
                a1lib.identifyApp('./appconfig.json');
                this.logger.alt1('App identified successfully');
            } catch (error) {
                this.logger.error('Failed to identify app:', error);
            }

            const statusIcon = this.elements.alt1Status?.querySelector('.status-icon');
            if (statusIcon) {
                statusIcon.textContent = '';
            }
        } else {
            this.logger.alt1('Alt1 not detected - running in browser mode');
            const addAppUrl = `alt1://addapp/${new URL('./appconfig.json', document.location.href).href}`;
            if (this.elements.alt1InstallLink) {
                this.elements.alt1InstallLink.href = addAppUrl;
                this.elements.alt1InstallLink.style.display = 'inline';
            }

            if (this.elements.alt1StatusText) {
                this.elements.alt1StatusText.textContent = 'L Alt1 not detected';
            }

            const statusIcon = this.elements.alt1Status?.querySelector('.status-icon');
            if (statusIcon) {
                statusIcon.textContent = 'L';
            }
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
            this.setStatusValue('resizerStatus', 'Error', 'error');
        }
    }

    /**
     * Set up event handlers for UI buttons
     */
    private setupEventHandlers(): void {
        this.logger.init('Setting up event handlers...');

        // Resize to 500x650 (within appconfig.json bounds: 400-600×500-800)
        this.elements.testWindowResize?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testWindowResize', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.testWindowResize(500, 650);
        });

        // Resize to 550x700 (within appconfig.json bounds: 400-600×500-800)
        this.elements.testWindowResize2?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testWindowResize2', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.testWindowResize(550, 700);
        });

        // Refresh size
        this.elements.refreshSize?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: refreshSize', {
                disabled: (event.target as HTMLButtonElement)?.disabled,
                timestamp: Date.now()
            });
            this.updateCurrentSize();
        });
    }

    /**
     * Start real-time size monitoring
     */
    private startSizeMonitoring(): void {
        this.logger.init('Starting real-time size monitoring...');

        // Update size immediately
        this.updateCurrentSize();

        // Update size every 1 second
        this.sizeUpdateInterval = window.setInterval(() => {
            this.updateCurrentSize();
        }, 1000);

        this.logger.success('Size monitoring started');
    }

    /**
     * Update current window size display
     */
    private updateCurrentSize(): void {
        if (!this.windowResizer) {
            this.setCurrentSizeDisplay('WindowResizer not available', 'error');
            return;
        }

        try {
            const size = this.windowResizer.getCurrentSize();
            const sizeText = `${size.width} � ${size.height}`;

            this.setCurrentSizeDisplay(sizeText, 'success');
            this.setStatusValue('currentWindowSize', sizeText, 'success');

            this.logger.data('Current window size:', size);
        } catch (error) {
            this.logger.error('Failed to get current size:', error);
            this.setCurrentSizeDisplay('Size detection error', 'error');
            this.setStatusValue('currentWindowSize', 'Error', 'error');
        }
    }

    /**
     * Update resize status display
     */
    private updateResizeStatus(): void {
        if (!this.windowResizer) {
            this.setStatusValue('resizerStatus', 'Not Available', 'error');
            return;
        }

        this.setStatusValue('resizerStatus', 'Ready', 'success');

        try {
            const capabilities = this.windowResizer.detectCapabilities();

            // Update Alt1 userResize status
            const userResizeAvailable = capabilities.alt1APIs.userResize;
            this.setStatusValue('userResizeStatus',
                userResizeAvailable ? 'Available' : 'Not Available',
                userResizeAvailable ? 'success' : 'error'
            );

            // Update Web APIs status
            const hasWebAPIs = capabilities.webAPIs.resizeTo || capabilities.webAPIs.resizeBy;
            this.setStatusValue('webApiStatus',
                hasWebAPIs ? 'Available' : 'Blocked',
                hasWebAPIs ? 'success' : 'error'
            );

            this.logger.data('Resize capabilities:', capabilities);
        } catch (error) {
            this.logger.error('Failed to detect capabilities:', error);
            this.setStatusValue('userResizeStatus', 'Error', 'error');
            this.setStatusValue('webApiStatus', 'Error', 'error');
        }
    }

    /**
     * Test Alt1 window resize functionality
     */
    private async testWindowResize(width: number, height: number): Promise<void> {
        this.logger.window(`testWindowResize(${width}, ${height}) called`);

        if (!this.windowResizer) {
            this.logger.error('testWindowResize failed: Window resizer not available');
            alert('L Window resizer not initialized!');
            return;
        }

        try {
            this.setStatusValue('lastResizeResult', 'Attempting...', 'updating');
            this.logger.window(`Attempting to resize window to ${width}x${height}...`);

            const result: ResizeResult = await this.windowResizer.resizeWindow(width, height, {
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

            // Update size immediately after resize attempt
            setTimeout(() => this.updateCurrentSize(), 500);

            if (result.success) {
                this.logger.success('Window resize succeeded:', result);
                this.setStatusValue('lastResizeResult',
                    ` ${result.method} (${result.executionTime?.toFixed(0)}ms)`,
                    'success'
                );
                alert(` Resize successful!\n\nMethod: ${result.method}\nNew size: ${result.newSize?.width}�${result.newSize?.height}\nTime: ${result.executionTime?.toFixed(2)}ms`);
            } else {
                this.logger.error('Window resize failed:', result);
                this.setStatusValue('lastResizeResult',
                    `L Failed: ${result.error}`,
                    'error'
                );
                alert(`L Resize failed!\n\nError: ${result.error}\nMethod attempted: ${result.method}\nTime: ${result.executionTime?.toFixed(2)}ms`);
            }

        } catch (error) {
            this.logger.error('Failed to test window resize:', error);
            this.setStatusValue('lastResizeResult', 'L Exception', 'error');
            alert(`L Resize test failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Set current size display with status styling
     */
    private setCurrentSizeDisplay(text: string, status: 'success' | 'error' | 'updating'): void {
        if (!this.elements.currentSizeDisplay) return;

        this.elements.currentSizeDisplay.textContent = text;

        // Reset classes
        this.elements.currentSizeDisplay.className = 'size-display';

        // Add status-specific styling
        if (status === 'error') {
            this.elements.currentSizeDisplay.style.color = '#ff6b6b';
            this.elements.currentSizeDisplay.style.borderColor = '#ff6b6b';
        } else if (status === 'updating') {
            this.elements.currentSizeDisplay.style.color = '#ffd43b';
            this.elements.currentSizeDisplay.style.borderColor = '#ffd43b';
        } else {
            this.elements.currentSizeDisplay.style.color = '#51cf66';
            this.elements.currentSizeDisplay.style.borderColor = '#51cf66';
        }
    }

    /**
     * Set status value with appropriate styling
     */
    private setStatusValue(elementId: string, text: string, status: 'success' | 'error' | 'updating'): void {
        const element = this.elements[elementId as keyof typeof this.elements] as HTMLElement;
        if (!element) return;

        element.textContent = text;

        // Reset classes
        element.className = 'status-value';

        // Add status class
        if (status !== 'success') {
            element.classList.add(status);
        }
    }

    /**
     * Cleanup when page unloads
     */
    private cleanup(): void {
        if (this.sizeUpdateInterval) {
            clearInterval(this.sizeUpdateInterval);
        }
    }
}

// Initialize the app when the page loads
const app = new Alt1WindowResizeTest();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        (app as any).cleanup();
    }
});