// Import Alt1 API
import * as a1lib from "@alt1/base";
import { createWorker, PSM } from 'tesseract.js';
import type { Worker } from 'tesseract.js';
import { 
    highlightRedXMarker
} from './imageDetection';

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

// Map size interface
interface MapSize {
    width: number;
    height: number;
}

// Map sizes for different dungeon types
const MAP_SIZES: Record<string, MapSize> = {
    small: { width: 140, height: 140 },
    medium: { width: 140, height: 280 },
    large: { width: 280, height: 280 }
};

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
export class DungeoneeringGateEngine {
    private doorTextReader: DoorTextReader;
    private isRunning: boolean = false;
    private textInterval: number | null = null;
    private markerLocation: { x: number, y: number } | null = null;
    private isDraggingMarker: boolean = false;
    private dragInterval: number | null = null;
    private lastDrawnPosition: { x: number, y: number } | null = null;
    
    // Map tracking properties
    private mapTrackingEnabled: boolean = false;
    private mapOutlineVisible: boolean = true;
    private mapSize: string = 'small';
    private xOffset: number = 8;
    private yOffset: number = -6;
    private mapTrackingInterval: number | null = null;

    constructor() {
        this.doorTextReader = new DoorTextReader();
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Set up event listeners for the buttons
        const startButton = document.getElementById('start-button');
        const stopButton = document.getElementById('stop-button');
        const placeMarkerButton = document.getElementById('place-marker-button');
        const updateMapButton = document.getElementById('update-map-button');
        const showMapOutlineCheckbox = document.getElementById('show-map-outline') as HTMLInputElement;
        const mapSizeRadios = document.querySelectorAll('input[name="map-size"]');
        const xOffsetInput = document.getElementById('x-offset') as HTMLInputElement;
        const yOffsetInput = document.getElementById('y-offset') as HTMLInputElement;
        
        if (startButton) {
            startButton.addEventListener('click', () => this.startTextScanning());
        }
        
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopTextScanning());
        }
        
        if (placeMarkerButton) {
            placeMarkerButton.addEventListener('click', () => this.toggleMarkerPlacement());
        }
        
        if (updateMapButton) {
            updateMapButton.addEventListener('click', () => this.updateMapTracking());
        }
        
        if (showMapOutlineCheckbox) {
            showMapOutlineCheckbox.addEventListener('change', () => {
                this.mapOutlineVisible = showMapOutlineCheckbox.checked;
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                }
            });
        }
        
        // Add event listeners for map size radio buttons
        mapSizeRadios.forEach((radio) => {
            radio.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                this.mapSize = target.value;
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                }
            });
        });
        
        // Add event listeners for offset inputs
        if (xOffsetInput) {
            xOffsetInput.addEventListener('change', () => {
                this.xOffset = parseInt(xOffsetInput.value, 10) || 0;
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                }
            });
        }
        
        if (yOffsetInput) {
            yOffsetInput.addEventListener('change', () => {
                this.yOffset = parseInt(yOffsetInput.value, 10) || 0;
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                }
            });
        }
        
        // Add global key listener for Escape to cancel marker placement
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isDraggingMarker) {
                this.cancelMarkerPlacement();
            }
        });
    }

    private toggleMarkerPlacement(): void {
        if (this.isDraggingMarker) {
            this.confirmMarkerPlacement();
        } else {
            this.startMarkerPlacement();
        }
    }
    
    private startMarkerPlacement(): void {
        if (!window.alt1) {
            alert('Alt1 is required for marker placement');
            return;
        }
        
        this.isDraggingMarker = true;
        this.markerLocation = null; // Reset marker location
        
        const placeMarkerButton = document.getElementById('place-marker-button');
        const statusElement = document.getElementById('marker-status');
        
        if (placeMarkerButton) {
            placeMarkerButton.textContent = 'Confirm Marker Position';
            placeMarkerButton.classList.add('active');
        }
        
        if (statusElement) {
            statusElement.textContent = 'Move cursor to X marker and press SPACE to anchor, then confirm with button';
        }
        
        // Start tracking mouse position for the marker
        this.startDragTracking();
        
        // Add a keyboard listener for SPACE to anchor the marker
        const keyHandler = (e: KeyboardEvent) => {
            if (e.code === 'Space' && this.isDraggingMarker && !this.markerLocation) {
                e.preventDefault();
                
                // Get current mouse position
                const mousePos = getAlt1MousePosition();
                if (mousePos) {
                    // Remove the event listener
                    document.removeEventListener('keydown', keyHandler);
                    
                    // Anchor the marker at the current mouse position
                    this.anchorMarkerAt(mousePos.x, mousePos.y);
                }
            }
        };
        
        // Add the keyboard listener
        document.addEventListener('keydown', keyHandler);
    }
    
    private startDragTracking(): void {
        // Clear any existing interval
        if (this.dragInterval) {
            clearInterval(this.dragInterval);
        }
        
        // Start a new interval to track mouse position
        this.dragInterval = window.setInterval(() => {
            const mousePos = getAlt1MousePosition();
            if (mousePos && this.isDraggingMarker) {
                if (!this.markerLocation) {
                    // If no marker is anchored, draw at mouse position
                    this.drawCrosshair(mousePos.x, mousePos.y, false);
                } else {
                    // If marker is anchored, keep drawing it
                    this.drawCrosshair(this.markerLocation.x, this.markerLocation.y, true);
                }
            }
        }, 50);
    }
    
    private drawCrosshair(x: number, y: number, isAnchored: boolean): void {
        if (!window.alt1) return;
        
        // Check if we have overlay permission
        if (window.alt1.permissionOverlay) {
            try {
                // Draw a simple crosshair
                const size = 15;
                const duration = isAnchored ? 2000 : 100; // Longer duration if anchored
                
                // Create white color
                const whiteColor = a1lib.mixColor(255, 255, 255);
                const redColor = a1lib.mixColor(255, 0, 0);
                
                // Horizontal line
                window.alt1.overLayLine(whiteColor, 2, x - size, y, x + size, y, duration);
                
                // Vertical line
                window.alt1.overLayLine(whiteColor, 2, x, y - size, x, y + size, duration);
                
                // Draw a small red dot in the center if anchored
                if (isAnchored) {
                    window.alt1.overLayRect(redColor, x - 2, y - 2, 4, 4, duration, 1);
                    window.alt1.overLayText("Marker anchored", whiteColor, 12, x + 15, y, duration);
                }
            } catch (error) {
                console.error("Error drawing crosshair:", error);
                console.error(error);
            }
        } else {
            console.error("Overlay permission not granted");
            const statusElement = document.getElementById('marker-status');
            if (statusElement) {
                statusElement.textContent = 'Overlay permission not granted. Please enable in Alt1 settings.';
            }
            this.cancelMarkerPlacement();
        }
    }
    
    private anchorMarkerAt(x: number, y: number): void {
        // Store the position
        this.markerLocation = { x, y };
        
        // Update the UI to show we're waiting for confirmation
        const statusElement = document.getElementById('marker-status');
        if (statusElement) {
            statusElement.textContent = `Marker anchored at (${x}, ${y}). Press the button to confirm or ESC to cancel.`;
        }
        
        // Draw the anchored marker
        this.drawCrosshair(x, y, true);
    }
    
    private confirmMarkerPlacement(): void {
        this.isDraggingMarker = false;
        
        // Stop tracking
        if (this.dragInterval) {
            clearInterval(this.dragInterval);
            this.dragInterval = null;
        }
        
        // Update UI
        const placeMarkerButton = document.getElementById('place-marker-button');
        if (placeMarkerButton) {
            placeMarkerButton.textContent = 'Place Marker on X';
            placeMarkerButton.classList.remove('active');
        }
        
        // If we have a marker location, use it
        if (this.markerLocation) {
            // Update status
            this.updateMarkerStatus();
            
            // Highlight the marker
            highlightRedXMarker(this.markerLocation.x, this.markerLocation.y);
        } else {
            const statusElement = document.getElementById('marker-status');
            if (statusElement) {
                statusElement.textContent = 'No marker was anchored. Press the button to try again.';
            }
        }
    }

    private updateMarkerStatus(): void {
        const statusElement = document.getElementById('marker-status');
        const mapStatusElement = document.getElementById('map-status');
        
        if (statusElement) {
            if (this.markerLocation) {
                statusElement.textContent = `X marker set at (${this.markerLocation.x}, ${this.markerLocation.y})`;
                statusElement.classList.add('success');
                
                // Update map status
                if (mapStatusElement) {
                    mapStatusElement.textContent = 'Marker set. Click "Update Map Tracking" to enable map outline.';
                }
            } else {
                statusElement.textContent = 'No X marker set. Click "Place Marker on X" to set it.';
                statusElement.classList.remove('success');
                
                // Update map status
                if (mapStatusElement) {
                    mapStatusElement.textContent = 'Set a marker position first to enable map tracking.';
                }
            }
        }
    }

    private cancelMarkerPlacement(): void {
        this.isDraggingMarker = false;
        
        // Stop tracking
        if (this.dragInterval) {
            clearInterval(this.dragInterval);
            this.dragInterval = null;
        }
        
        // Update UI
        const placeMarkerButton = document.getElementById('place-marker-button');
        if (placeMarkerButton) {
            placeMarkerButton.textContent = 'Place Marker on X';
            placeMarkerButton.classList.remove('active');
        }
        
        const statusElement = document.getElementById('marker-status');
        if (statusElement) {
            statusElement.textContent = 'Marker placement cancelled. Press the button to try again.';
        }
        
        // Reset last drawn position
        this.lastDrawnPosition = null;
    }

    // Start text scanning functionality
    private startTextScanning(): void {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        const startButton = document.getElementById('start-button');
        const stopButton = document.getElementById('stop-button');
        const textOutput = document.getElementById('text-output');
        
        if (startButton) {
            startButton.setAttribute('disabled', 'true');
        }
        
        if (stopButton) {
            stopButton.removeAttribute('disabled');
        }
        
        if (textOutput) {
            textOutput.textContent = 'Scanning for text...';
        }
        
        // Start reading text
        this.doorTextReader.startReading((text) => {
            if (textOutput) {
                textOutput.textContent = text || 'No text detected';
            }
        });
    }
    
    // Stop text scanning functionality
    private stopTextScanning(): void {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        
        const startButton = document.getElementById('start-button');
        const stopButton = document.getElementById('stop-button');
        const textOutput = document.getElementById('text-output');
        
        if (stopButton) {
            stopButton.setAttribute('disabled', 'true');
        }
        
        if (startButton) {
            startButton.removeAttribute('disabled');
        }
        
        if (textOutput) {
            textOutput.textContent = 'Stopped scanning.';
        }
        
        // Stop reading text
        this.doorTextReader.stopReading();
    }

    // Map tracking methods
    private updateMapTracking(): void {
        if (!this.markerLocation) {
            alert('Please set a marker position first.');
            return;
        }
        
        // Toggle map tracking
        this.mapTrackingEnabled = !this.mapTrackingEnabled;
        
        const updateMapButton = document.getElementById('update-map-button');
        const mapStatusElement = document.getElementById('map-status');
        
        if (this.mapTrackingEnabled) {
            // Start map tracking
            if (updateMapButton) {
                updateMapButton.textContent = 'Stop Map Tracking';
                updateMapButton.classList.add('active');
            }
            
            if (mapStatusElement) {
                mapStatusElement.textContent = `Map tracking enabled (${this.mapSize} dungeon)`;
                mapStatusElement.classList.add('active');
            }
            
            // Start the map tracking interval
            this.startMapTracking();
        } else {
            // Stop map tracking
            if (updateMapButton) {
                updateMapButton.textContent = 'Update Map Tracking';
                updateMapButton.classList.remove('active');
            }
            
            if (mapStatusElement) {
                mapStatusElement.textContent = 'Map tracking disabled. Click "Update Map Tracking" to enable.';
                mapStatusElement.classList.remove('active');
            }
            
            // Stop the map tracking interval
            this.stopMapTracking();
        }
    }
    
    private startMapTracking(): void {
        // Clear any existing interval
        if (this.mapTrackingInterval) {
            clearInterval(this.mapTrackingInterval);
        }
        
        // Draw the initial map outline
        this.drawMapOutline();
        
        // Set up an interval to redraw the map outline
        this.mapTrackingInterval = window.setInterval(() => {
            this.drawMapOutline();
        }, 1000); // Redraw every second
    }
    
    private stopMapTracking(): void {
        // Clear the interval
        if (this.mapTrackingInterval) {
            clearInterval(this.mapTrackingInterval);
            this.mapTrackingInterval = null;
        }
    }
    
    private drawMapOutline(): void {
        if (!window.alt1 || !this.markerLocation || !this.mapOutlineVisible) return;
        
        // Check if we have overlay permission
        if (window.alt1.permissionOverlay) {
            try {
                // Get the map size based on the selected dungeon size
                const size = MAP_SIZES[this.mapSize];
                
                // Calculate the map outline coordinates
                // The marker is at the top-right corner of the map
                const x = this.markerLocation.x - size.width + this.xOffset;
                const y = this.markerLocation.y + this.yOffset;
                
                // Create white color for the outline
                const whiteColor = a1lib.mixColor(255, 255, 255);
                
                // Draw the map outline (rectangle)
                // Top line
                window.alt1.overLayLine(whiteColor, 2, x, y, x + size.width, y, 2000);
                
                // Right line
                window.alt1.overLayLine(whiteColor, 2, x + size.width, y, x + size.width, y + size.height, 2000);
                
                // Bottom line
                window.alt1.overLayLine(whiteColor, 2, x, y + size.height, x + size.width, y + size.height, 2000);
                
                // Left line
                window.alt1.overLayLine(whiteColor, 2, x, y, x, y + size.height, 2000);
                
                // Draw map size text
                window.alt1.overLayText(`${this.mapSize.toUpperCase()} MAP (${size.width}x${size.height})`, whiteColor, 10, x, y - 15, 2000);
                
            } catch (error) {
                console.error("Error drawing map outline:", error);
            }
        } else {
            console.error("Overlay permission not granted");
            const mapStatusElement = document.getElementById('map-status');
            if (mapStatusElement) {
                mapStatusElement.textContent = 'Overlay permission not granted. Please enable in Alt1 settings.';
            }
            this.stopMapTracking();
        }
    }
}

// Create and export the app instance
const app = new DungeoneeringGateEngine();
export default app;

// Make it available globally
if (typeof window !== 'undefined') {
    window.DungeoneeringGateEngine = app;
} 