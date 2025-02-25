// Import Alt1 API
import * as a1lib from "@alt1/base";
import { createWorker, PSM } from 'tesseract.js';
import type { Worker } from 'tesseract.js';

// Set up Alt1 detection
let appColor = a1lib.mixColor(255, 144, 0);

// Define global types
declare global {
    interface Window {
        alt1: any;
        DungeoneeringGateEngine: any;
    }
}

// Mouse position interface
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

// DoorTextReader class - incorporated from mouse_text_tool
class DoorTextReader {
    private isReading: boolean = false;
    private worker: Worker | null = null;
    private lastMousePosition: { x: number, y: number } = { x: 0, y: 0 };
    private callback?: (text: string) => void;
    private lastCaptureTime: number = 0;
    private captureUpdateInterval: number = 250; // Milliseconds between capture updates
    private mouseTrackingInterval: number | null = null;
    private isInitialized: boolean = false;
    private initializationPromise: Promise<void> | null = null;
    
    // Add a property to store the last recognized text
    private lastRecognizedText: string = '';
    
    // Text box detection settings
    private enableTextBoxDetection: boolean = true;
    private borderColorThreshold: number = 20;
    private cropMargin: number = 2;
    
    // Capture dimensions
    private readonly captureWidth = 250;
    private readonly captureHeight = 35;
    private readonly captureYOffset = 30;

    constructor() {
        // Start tracking mouse position in the RuneScape window
        this.startMouseTracking();
        
        // Initialize Tesseract worker
        this.initializationPromise = this.initWorker();
    }

    private startMouseTracking() {
        // Clear any existing interval
        if (this.mouseTrackingInterval) {
            clearInterval(this.mouseTrackingInterval);
        }
        
        // Poll for mouse position every 100ms
        this.mouseTrackingInterval = window.setInterval(() => {
            const pos = getAlt1MousePosition();
            if (pos) {
                this.lastMousePosition = pos;
            }
        }, 100);
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

    private async initWorker(): Promise<void> {
        try {
            // Show loading indicator
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.classList.add('visible');
            }
            
            this.worker = await createWorker({
                workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/worker.min.js',
                langPath: 'https://tessdata.projectnaptha.com/4.0.0',
                logger: m => {
                    console.debug('Tesseract:', m);
                    // Update loading message if needed
                    if (m.status === 'loading tesseract core' || m.status === 'loading language traineddata') {
                        const loadingIndicator = document.getElementById('loading-indicator');
                        if (loadingIndicator) {
                            const messageElement = loadingIndicator.querySelector('div:not(.spinner)');
                            if (messageElement) {
                                messageElement.textContent = `Loading ${m.status}... (${Math.floor(m.progress * 100)}%)`;
                            }
                        }
                    }
                },
                errorHandler: err => console.error('Tesseract Error:', err)
            });
            
            await this.worker.loadLanguage('eng');
            await this.worker.initialize('eng');
            
            // Set basic parameters using the typed interface
            // Keep it simple - just set the page segmentation mode and character whitelist
            await this.worker.setParameters({
                tessedit_pageseg_mode: PSM.SINGLE_LINE, // Explicitly set to SINGLE_LINE mode for game UI text
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 \'"-:,.!?()[]{}', // Special characters for game text
            });
            
            console.log('Tesseract worker initialized successfully');
            this.isInitialized = true;
            
            // Hide loading indicator
            if (loadingIndicator) {
                loadingIndicator.classList.remove('visible');
            }
            
            // Enable buttons if Alt1 is detected
            if (window.alt1) {
                document.getElementById('start-button')?.removeAttribute('disabled');
            }
        } catch (error) {
            console.error('Failed to initialize Tesseract worker:', error);
            
            // Update loading indicator to show error
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                const messageElement = loadingIndicator.querySelector('div:not(.spinner)');
                if (messageElement) {
                    messageElement.textContent = 'Failed to initialize text recognition engine. Please refresh the page.';
                }
                // Remove spinner
                const spinner = loadingIndicator.querySelector('.spinner');
                if (spinner) {
                    spinner.remove();
                }
            }
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

            // Create an off-screen canvas for processing
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = region.width;
            offscreenCanvas.height = region.height;
            const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false })!;
            
            // Draw the image data to the offscreen canvas
            offscreenCtx.putImageData(imgData, 0, 0);
            
            // Detect and crop to the text box
            const croppedCanvas = this.detectAndCropTextBox(offscreenCanvas);
            
            // Perform OCR on the cropped canvas
            const result = await this.worker.recognize(croppedCanvas);
            const recognizedText = result.data.text.trim();
            
            // Store the recognized text
            this.lastRecognizedText = recognizedText;
            
            // Update the output with the recognized text
            this.callback?.(recognizedText);
            
        } catch (error) {
            console.error('Error reading text:', error);
            this.callback?.('Error reading text');
        }

        if (this.isReading) {
            // Use setTimeout with a consistent interval for smoother updates
            setTimeout(() => this.readText(), this.captureUpdateInterval);
        }
    }

    // Detect and crop to the black box border around RuneScape hover text
    private detectAndCropTextBox(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
        // If text box detection is disabled, return the original canvas
        if (!this.enableTextBoxDetection) {
            return sourceCanvas;
        }
        
        const ctx = sourceCanvas.getContext('2d')!;
        const imageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        const data = imageData.data;
        
        // Find the bounding box of the black border
        let left = sourceCanvas.width;
        let right = 0;
        let top = sourceCanvas.height;
        let bottom = 0;
        let foundBorder = false;
        
        // Count of dark pixels in each row and column to help identify the box
        const rowCounts = new Array(sourceCanvas.height).fill(0);
        const colCounts = new Array(sourceCanvas.width).fill(0);
        
        // First pass: count dark pixels in each row and column
        for (let y = 0; y < sourceCanvas.height; y++) {
            for (let x = 0; x < sourceCanvas.width; x++) {
                const idx = (y * sourceCanvas.width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Check if this pixel is dark enough to be part of the border
                if (r <= this.borderColorThreshold && g <= this.borderColorThreshold && b <= this.borderColorThreshold) {
                    rowCounts[y]++;
                    colCounts[x]++;
                }
            }
        }
        
        // Find the edges of the box using the counts
        // We're looking for rows/columns with a significant number of dark pixels
        const threshold = Math.max(3, Math.min(sourceCanvas.width, sourceCanvas.height) * 0.05); // At least 5% of pixels or 3 pixels
        
        // Find top edge
        for (let y = 0; y < sourceCanvas.height; y++) {
            if (rowCounts[y] >= threshold) {
                top = y;
                foundBorder = true;
                break;
            }
        }
        
        // Find bottom edge
        for (let y = sourceCanvas.height - 1; y >= 0; y--) {
            if (rowCounts[y] >= threshold) {
                bottom = y;
                foundBorder = true;
                break;
            }
        }
        
        // Find left edge
        for (let x = 0; x < sourceCanvas.width; x++) {
            if (colCounts[x] >= threshold) {
                left = x;
                foundBorder = true;
                break;
            }
        }
        
        // Find right edge
        for (let x = sourceCanvas.width - 1; x >= 0; x--) {
            if (colCounts[x] >= threshold) {
                right = x;
                foundBorder = true;
                break;
            }
        }
        
        // If we found a border, crop to it with the specified margin
        if (foundBorder && right > left && bottom > top) {
            console.log(`Border detected: (${left},${top}) to (${right},${bottom}), size: ${right-left+1}x${bottom-top+1}`);
            
            // Create a new canvas for the cropped image
            const croppedCanvas = document.createElement('canvas');
            const width = right - left + 1 + (this.cropMargin * 2);
            const height = bottom - top + 1 + (this.cropMargin * 2);
            
            croppedCanvas.width = width;
            croppedCanvas.height = height;
            
            const croppedCtx = croppedCanvas.getContext('2d')!;
            
            // Draw the cropped region from the original source canvas (no color manipulation)
            croppedCtx.drawImage(
                sourceCanvas, // Always use the original source canvas
                Math.max(0, left - this.cropMargin),
                Math.max(0, top - this.cropMargin),
                Math.min(sourceCanvas.width - left + this.cropMargin, width),
                Math.min(sourceCanvas.height - top + this.cropMargin, height),
                0, 0, width, height
            );
            
            return croppedCanvas;
        } else {
            console.log('No border detected or invalid border dimensions');
            
            // If no border was found, return the original canvas
            return sourceCanvas;
        }
    }

    public async startReading(callback: (text: string) => void) {
        // Make sure the worker is initialized before starting
        if (!this.isInitialized && this.initializationPromise) {
            await this.initializationPromise;
        }
        
        this.callback = callback;
        this.isReading = true;
        this.readText();
    }

    public stopReading() {
        this.isReading = false;
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
    }
    
    // Method to get the last recognized text
    public getLastText(): string {
        return this.lastRecognizedText;
    }
    
    // Method to check if the reader is initialized
    public isReady(): boolean {
        return this.isInitialized;
    }
}

// Main application class
class DungeoneeringGateEngine {
    private doorTextReader: DoorTextReader | null = null;
    private isListening: boolean = false;
    
    constructor() {
        // Initialize the app when the DOM is ready
        document.addEventListener("DOMContentLoaded", this.initialize.bind(this));
    }
    
    private initialize() {
        // Set version in UI
        const version = "1.0.0";
        document.getElementById("version")!.textContent = `v${version}`;
        document.getElementById("footer-version")!.textContent = version;

        // Check if Alt1 is available
        if (window.alt1) {
            document.getElementById("alt1-status")!.classList.add("detected");
            document.getElementById("alt1-status-text")!.textContent = "Alt1 detected";
            
            // Buttons will be enabled after Tesseract is initialized
            
            // Hide the add app container
            document.getElementById("add-app-container")!.style.display = "none";
            
            // Tell Alt1 about the app
            window.alt1.identifyAppUrl("./appconfig.json");
        } else {
            document.getElementById("alt1-status")!.classList.add("not-detected");
            document.getElementById("alt1-status-text")!.textContent = "Alt1 not detected";
            
            // Show the add app container
            document.getElementById("add-app-container")!.style.display = "block";
            
            // Set up the add app link
            const addAppLink = document.getElementById("add-app-link") as HTMLAnchorElement;
            const appConfigUrl = new URL("./appconfig.json", window.location.href).href;
            addAppLink.href = `alt1://addapp/${appConfigUrl}`;
        }

        // Set up event listeners for buttons
        document.getElementById("start-button")!.addEventListener("click", this.startListening.bind(this));
        document.getElementById("stop-button")!.addEventListener("click", this.stopListening.bind(this));

        // Set up Alt1 status click handler for installation instructions
        document.getElementById("alt1-status")!.addEventListener("click", () => {
            if (!window.alt1) {
                window.open("https://runeapps.org/alt1", "_blank");
            }
        });
        
        // Initialize the DoorTextReader
        this.doorTextReader = new DoorTextReader();
    }
    
    // Function to start listening for text
    private async startListening() {
        if (this.isListening || !this.doorTextReader) return;
        
        this.isListening = true;
        document.getElementById("start-button")!.setAttribute("disabled", "true");
        document.getElementById("stop-button")!.removeAttribute("disabled");
        document.getElementById("text-output")!.textContent = "Scanning for text...";
        
        // Start reading text
        await this.doorTextReader.startReading((text) => {
            document.getElementById("text-output")!.textContent = text || "No text detected";
        });
    }

    // Function to stop listening for text
    private stopListening() {
        if (!this.isListening || !this.doorTextReader) return;
        
        this.isListening = false;
        document.getElementById("stop-button")!.setAttribute("disabled", "true");
        document.getElementById("start-button")!.removeAttribute("disabled");
        document.getElementById("text-output")!.textContent = "Stopped scanning.";
        
        // Stop reading text
        this.doorTextReader.stopReading();
    }
    
    // Method to get the last recognized text
    public getLastText(): string {
        return this.doorTextReader?.getLastText() || "";
    }
}

// Create and export the app instance
const app = new DungeoneeringGateEngine();
export default app;

// Make it available globally
if (typeof window !== 'undefined') {
    window.DungeoneeringGateEngine = app;
} 