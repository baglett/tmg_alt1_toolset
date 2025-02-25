// Type declarations
declare global {
    interface Window {
        alt1: {
            mousePosition: number;
            identifyAppUrl: (url: string) => void;
            rsActive: boolean;
            permissionPixel: boolean;
            overLayRect(color: number, x: number, y: number, width: number, height: number, duration: number, thickness?: number): boolean;
            overLaySetGroup(group: string): any;
            overLayClearGroup(group: string): any;
            overLayRefreshGroup(group: string): any;
        } | null;
        A1lib: typeof import("alt1/base");
        DoorTextReader: typeof DoorTextReader;
        reader: DoorTextReader;
    }
}

// Import required libraries
import * as a1lib from "alt1";
import { createWorker, PSM } from 'tesseract.js';
import type { Worker } from 'tesseract.js';

interface MousePosition {
    x: number;
    y: number;
}

// Helper function to get mouse position from Alt1
function getAlt1MousePosition(): MousePosition | null {
    if (!window.alt1) return null;
    
    const pos = window.alt1.mousePosition;
    if (pos === -1) return null;
    
    return {
        x: pos >>> 16,
        y: pos & 0xFFFF
    };
}

class DoorTextReader {
    private isReading: boolean = false;
    private worker: Worker | null = null;
    private lastMousePosition: { x: number, y: number } = { x: 0, y: 0 };
    private viewportCanvas: HTMLCanvasElement;
    private viewportCtx: CanvasRenderingContext2D;
    private callback?: (text: string) => void;
    private showPreviewBox: boolean = true;
    private mouseTrackingInterval: number | null = null;
    private overlayGroup: string = 'door_text_reader_overlay';
    private lastCaptureTime: number = 0;
    private captureUpdateInterval: number = 250; // Milliseconds between capture updates
    
    // Capture dimensions
    private readonly captureWidth = 250;
    private readonly captureHeight = 35;
    private readonly captureYOffset = 30;

    constructor() {
        // Initialize viewport canvas
        this.viewportCanvas = document.getElementById('previewCanvas') as HTMLCanvasElement;
        if (!this.viewportCanvas) {
            throw new Error('Preview canvas not found');
        }
        this.viewportCtx = this.viewportCanvas.getContext('2d')!;
        this.viewportCtx.imageSmoothingEnabled = false;

        // Initialize checkbox state
        const checkbox = document.getElementById('showPreviewBox') as HTMLInputElement;
        this.showPreviewBox = checkbox.checked;
        checkbox.addEventListener('change', (e) => {
            this.showPreviewBox = (e.target as HTMLInputElement).checked;
            if (this.showPreviewBox) {
                this.drawPreviewRect();
                // Also update the overlay in the game
                if (window.alt1) {
                    try {
                        this.updateGameOverlay();
                    } catch (error) {
                        console.warn('Failed to update game overlay:', error);
                    }
                }
            } else {
                this.viewportCtx.clearRect(0, 0, this.viewportCanvas.width, this.viewportCanvas.height);
                // Clear the overlay in the game
                if (window.alt1) {
                    try {
                        window.alt1.overLayClearGroup(this.overlayGroup);
                    } catch (error) {
                        console.warn('Failed to clear overlay group:', error);
                    }
                }
            }
        });

        // Initialize Tesseract worker
        this.initWorker();

        // Start tracking mouse position in the RuneScape window
        this.startMouseTracking();
    }

    private startMouseTracking() {
        const mousePositionElement = document.getElementById('mousePosition')!;
        const captureRegionElement = document.getElementById('captureRegion')!;
        
        // Clear any existing interval
        if (this.mouseTrackingInterval) {
            clearInterval(this.mouseTrackingInterval);
        }
        
        // Poll for mouse position every 100ms
        this.mouseTrackingInterval = window.setInterval(() => {
            const pos = getAlt1MousePosition();
            if (pos) {
                this.lastMousePosition = pos;
                mousePositionElement.textContent = `Mouse Position: (${pos.x}, ${pos.y})`;
                
                // Update capture region info
                const region = this.getCaptureRegion();
                captureRegionElement.textContent = `Capture Region: (${region.x}, ${region.y}) ${region.width}x${region.height}`;
                
                // Only update the game overlay, don't redraw the preview box on every mouse move
                if (this.showPreviewBox && window.alt1) {
                    try {
                        this.updateGameOverlay();
                    } catch (error) {
                        console.warn('Failed to update game overlay:', error);
                    }
                }
            }
        }, 100);
        
        // Draw the initial preview rectangle
        if (this.showPreviewBox) {
            this.drawPreviewRect();
        }
    }

    // Update the overlay rectangle in the game window
    private updateGameOverlay() {
        if (!window.alt1 || !this.showPreviewBox) return;
        
        try {
            // Only show overlay when RS is active
            if (!window.alt1.rsActive) {
                try {
                    window.alt1.overLayClearGroup(this.overlayGroup);
                } catch (error) {
                    console.warn('Failed to clear overlay group:', error);
                }
                return;
            }
            
            const region = this.getCaptureRegion();
            
            // Set the overlay group
            window.alt1.overLaySetGroup(this.overlayGroup);
            
            // Clear previous overlay
            window.alt1.overLayClearGroup(this.overlayGroup);
            
            // Draw a green rectangle
            // Use a1lib.mixColor to create the color (RGBA)
            const greenColor = a1lib.mixColor(0, 255, 0, 255); // Bright green
            
            // Draw the rectangle with a 2px border
            window.alt1.overLayRect(
                greenColor,
                region.x,
                region.y,
                region.width,
                region.height,
                1000, // Duration in ms (1 second)
                2     // Thickness in pixels
            );
        } catch (error) {
            console.warn('Overlay permission not available:', error);
            // We'll just continue without the overlay
        }
    }

    // Calculate the capture region based on mouse position
    private getCaptureRegion(): { x: number, y: number, width: number, height: number } {
        const { x, y } = this.lastMousePosition;
        
        // Center the box horizontally with the mouse at the top center
        const captureX = Math.round(x - (this.captureWidth / 2));
        const captureY = y + this.captureYOffset; // Mouse position plus offset
        
        return {
            x: captureX,
            y: captureY,
            width: this.captureWidth,
            height: this.captureHeight
        };
    }

    // Draw a rectangle on our preview canvas to show where we'll capture
    private drawPreviewRect() {
        // Only update canvas size once at initialization
        if (this.viewportCanvas.width !== this.captureWidth || this.viewportCanvas.height !== this.captureHeight) {
            this.viewportCanvas.width = this.captureWidth;
            this.viewportCanvas.height = this.captureHeight;
        }
        
        // Use requestAnimationFrame for smoother visual updates
        requestAnimationFrame(() => {
            // Clear the canvas
            this.viewportCtx.clearRect(0, 0, this.viewportCanvas.width, this.viewportCanvas.height);
            
            // Draw a green rectangle border
            this.viewportCtx.strokeStyle = '#00FF00';
            this.viewportCtx.lineWidth = 2;
            this.viewportCtx.strokeRect(0, 0, this.captureWidth, this.captureHeight);
        });
    }

    private async initWorker() {
        try {
            this.worker = await createWorker({
                workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/worker.min.js',
                langPath: 'https://tessdata.projectnaptha.com/4.0.0',
                logger: m => console.debug('Tesseract:', m),
                errorHandler: err => console.error('Tesseract Error:', err)
            });
            
            await this.worker.loadLanguage('eng');
            await this.worker.initialize('eng');
            await this.worker.setParameters({
                tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ',
            });
            console.log('Tesseract worker initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Tesseract worker:', error);
        }
    }

    private async readText() {
        if (!this.isReading || !this.worker || !window.alt1) return;

        try {
            // Check for pixel permission
            if (!window.alt1.permissionPixel) {
                console.error('Pixel permission not enabled');
                this.callback?.('Pixel permission not enabled. Please enable it in Alt1 settings.');
                return;
            }

            // Throttle capture updates to reduce flashing
            const now = Date.now();
            if (now - this.lastCaptureTime < this.captureUpdateInterval) {
                // Schedule next check
                setTimeout(() => this.readText(), 50);
                return;
            }
            this.lastCaptureTime = now;

            // Get the capture region
            const region = this.getCaptureRegion();
            
            // Capture the screen region
            let imgData: ImageData | null = null;
            
            try {
                // Use a1lib.captureHoldFullRs which is the recommended method
                const img = a1lib.captureHoldFullRs();
                if (img) {
                    imgData = img.toData(region.x, region.y, region.width, region.height);
                }
            } catch (error) {
                console.error('Failed to capture screen:', error);
                this.callback?.('Failed to capture screen');
                return;
            }
            
            if (!imgData) {
                console.error('Failed to capture screen region');
                this.callback?.('Failed to capture screen');
                return;
            }

            // Create an off-screen canvas for double buffering to reduce flicker
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = region.width;
            offscreenCanvas.height = region.height;
            const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false })!;
            
            // Draw the image data to the offscreen canvas
            offscreenCtx.putImageData(imgData, 0, 0);
            
            // Only update the main canvas dimensions if they've changed
            if (this.viewportCanvas.width !== region.width || this.viewportCanvas.height !== region.height) {
                this.viewportCanvas.width = region.width;
                this.viewportCanvas.height = region.height;
            }
            
            // Use requestAnimationFrame for smoother visual updates
            requestAnimationFrame(() => {
                // Clear and draw the image from the offscreen canvas to the main canvas
                this.viewportCtx.clearRect(0, 0, this.viewportCanvas.width, this.viewportCanvas.height);
                this.viewportCtx.drawImage(offscreenCanvas, 0, 0);
            });
            
            // Perform OCR on the offscreen canvas to avoid any visual artifacts
            const result = await this.worker.recognize(offscreenCanvas);
            const recognizedText = result.data.text.trim();
            
            // Update the output with the recognized text
            this.callback?.(recognizedText);
            
            // Update the overlay in the game
            if (this.showPreviewBox) {
                try {
                    this.updateGameOverlay();
                } catch (error) {
                    console.warn('Failed to update game overlay:', error);
                }
            }
        } catch (error) {
            console.error('Error reading text:', error);
            this.callback?.('Error reading text');
        }

        if (this.isReading) {
            // Use setTimeout with a consistent interval for smoother updates
            setTimeout(() => this.readText(), this.captureUpdateInterval);
        }
    }

    public startReading(callback: (text: string) => void) {
        this.callback = callback;
        this.isReading = true;
        this.readText();
    }

    public stopReading() {
        this.isReading = false;
        this.drawPreviewRect(); // Restore the preview rectangle
        
        // Clear the overlay in the game
        if (window.alt1) {
            try {
                window.alt1.overLayClearGroup(this.overlayGroup);
            } catch (error) {
                console.warn('Failed to clear overlay group:', error);
            }
        }
    }

    public async terminate() {
        this.stopReading();
        if (this.mouseTrackingInterval) {
            clearInterval(this.mouseTrackingInterval);
            this.mouseTrackingInterval = null;
        }
        if (this.worker) {
            await this.worker.terminate();
            this.worker = null;
        }
        
        // Clear the overlay in the game
        if (window.alt1) {
            try {
                window.alt1.overLayClearGroup(this.overlayGroup);
            } catch (error) {
                console.warn('Failed to clear overlay group:', error);
            }
        }
    }
}

// Initialize the app
async function initializeApp() {
    try {
        const output = document.getElementById('output')!;
        const toggleBtn = document.getElementById('toggleScan')!;
        const checkbox = document.getElementById('showPreviewBox') as HTMLInputElement;

        // Check if we are running inside alt1 by checking if the alt1 global exists
        if (window.alt1) {
            // Tell alt1 about the app
            alt1.identifyAppUrl("./appconfig.json");
            
            // Check for pixel permission
            if (!alt1.permissionPixel) {
                output.textContent = "Pixel permission not enabled. Please enable it in Alt1 settings.";
                toggleBtn.style.display = "none";
                checkbox.disabled = true;
                return;
            }
            
            output.textContent = "Ready to start";
            toggleBtn.style.display = "block";
            checkbox.disabled = false;
        } else {
            let addappurl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
            output.innerHTML = `Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1`;
            toggleBtn.style.display = "none";
            checkbox.disabled = true;
            return;
        }

        const reader = new DoorTextReader();
        window.reader = reader;

        // Button click handler
        toggleBtn.addEventListener("click", () => {
            if (toggleBtn.classList.contains('scanning')) {
                // Stop scanning
                reader.stopReading();
                toggleBtn.textContent = "Start Scanning";
                toggleBtn.classList.remove("scanning");
                output.textContent = "Scanning stopped";
            } else {
                // Start scanning
                reader.startReading((text) => {
                    output.textContent = text || "No text detected";
                });
                toggleBtn.textContent = "Stop Scanning";
                toggleBtn.classList.add("scanning");
            }
        });

        console.log("App initialized"); // Debug log
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// Initialize when the document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for global use
if (typeof window !== 'undefined') {
    window.DoorTextReader = DoorTextReader;
} 