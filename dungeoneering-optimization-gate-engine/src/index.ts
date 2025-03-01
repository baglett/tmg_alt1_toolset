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
    private xOffset: number = 15;
    private yOffset: number = 0;
    private outlineWidth: number = -15; // Width adjustment for the outer outline
    private outlineHeight: number = -12; // Height adjustment for the outer outline
    private mapTrackingInterval: number | null = null;
    private clickCaptureOverlay: HTMLDivElement | null = null;
    
    // Grid interaction properties
    private gridSquares: { row: number, col: number, icon: string | null }[][] = [];
    private isListeningForGridClicks: boolean = false;
    private clickListenerInterval: number | null = null;
    private activeDropdown: { x: number, y: number, row: number, col: number } | null = null;
    private keyImages: Map<string, HTMLImageElement> = new Map();
    // Add a property to track the last clicked grid square
    private lastClickedSquare: { row: number, col: number } | null = null;
    
    // Map window properties
    private mapCanvas: HTMLCanvasElement | null = null;
    private mapContext: CanvasRenderingContext2D | null = null;
    private mapTabActive: boolean = false;
    private mapTabInterval: number | null = null;

    constructor() {
        // Initialize the door text reader
        this.doorTextReader = new DoorTextReader();
        
        // Initialize grid squares
        this.initializeGridSquares();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Preload key images
        this.preloadKeyImages();
        
        // Create the grid click info element
        this.createGridClickInfoElement();
        
        // Create the map tab interface
        this.createMapTabInterface();
        
        // Set up the map canvas
        this.setupMapCanvas();
        
        // Set up message listener for helper window communication
        window.addEventListener('message', this.handleHelperMessage.bind(this));
        
        // Make the engine available globally
        window.DungeoneeringGateEngine = this;
    }
    
    // Handle messages from the helper window
    private handleHelperMessage(event: MessageEvent): void {
        if (!event.data || !event.data.type) return;
        
        switch (event.data.type) {
            case 'helper-loaded':
                console.log('Helper window loaded, syncing grid state');
                this.syncGridWithHelper();
                break;
                
            case 'grid-click':
                if (typeof event.data.row === 'number' && typeof event.data.col === 'number') {
                    console.log(`Grid click from helper: (${event.data.col},${event.data.row})`);
                    this.lastClickedSquare = { row: event.data.row, col: event.data.col };
                    this.updateGridClickInfo(event.data.row, event.data.col);
                    if (this.mapCanvas) {
                        this.updateMapCanvas();
                    }
                }
                break;
                
            case 'grid-update':
                if (typeof event.data.row === 'number' && 
                    typeof event.data.col === 'number' && 
                    this.gridSquares[event.data.row] && 
                    this.gridSquares[event.data.row][event.data.col]) {
                    
                    console.log(`Grid update from helper: (${event.data.col},${event.data.row}) = ${event.data.icon}`);
                    this.gridSquares[event.data.row][event.data.col].icon = event.data.icon;
                    
                    if (this.mapCanvas) {
                        this.updateMapCanvas();
                    }
                }
                break;
                
            case 'grid-clear':
                console.log('Grid clear from helper');
                this.initializeGridSquares();
                this.lastClickedSquare = null;
                if (this.mapCanvas) {
                    this.updateMapCanvas();
                }
                break;
        }
    }
    
    // Initialize the grid squares array based on dungeon size
    private initializeGridSquares(): void {
        // Default to small dungeon (4x4)
        let rows = 4;
        let cols = 4;
        
        if (this.mapSize === 'medium') {
            rows = 8;
            cols = 4;
        } else if (this.mapSize === 'large') {
            rows = 8;
            cols = 8;
        }
        
        // Create a 2D array to track grid squares
        this.gridSquares = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < cols; c++) {
                row.push({ row: r, col: c, icon: null });
            }
            this.gridSquares.push(row);
        }
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
        const outlineWidthInput = document.getElementById('outline-width') as HTMLInputElement;
        const outlineHeightInput = document.getElementById('outline-height') as HTMLInputElement;
        
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
                // Reinitialize grid squares when map size changes
                this.initializeGridSquares();
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
        
        // Add event listeners for outline width/height
        if (outlineWidthInput) {
            outlineWidthInput.addEventListener('change', () => {
                this.outlineWidth = parseInt(outlineWidthInput.value, 10) || 0;
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                }
            });
        }
        
        if (outlineHeightInput) {
            outlineHeightInput.addEventListener('change', () => {
                this.outlineHeight = parseInt(outlineHeightInput.value, 10) || 0;
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
        
        // Add global click listener for grid interaction
        document.addEventListener('click', (e) => {
            // If we have an active dropdown, check if the click is outside of it
            if (this.activeDropdown) {
                const dropdown = document.getElementById('grid-icon-dropdown');
                if (dropdown && !dropdown.contains(e.target as Node)) {
                    this.hideIconDropdown();
                }
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
        const gridClickInfo = document.getElementById('grid-click-info');
        
        if (this.mapTrackingEnabled) {
            // Start map tracking
            if (updateMapButton) {
                updateMapButton.textContent = 'Stop Map Tracking';
                updateMapButton.classList.add('active');
            }
            
            if (mapStatusElement) {
                mapStatusElement.textContent = `Map tracking enabled with interactive tab (${this.mapSize} dungeon)`;
                mapStatusElement.classList.add('active');
            }
            
            // Show the grid click info
            if (gridClickInfo) {
                gridClickInfo.style.display = 'block';
            }
            
            // Start the map tracking interval
            this.startMapTracking();
            
            // Switch to the map tab
            this.switchToTab('map');
            
            // Remove any existing DOM overlay
            this.removeClickCaptureOverlay();
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
            
            // Hide the grid click info
            if (gridClickInfo) {
                gridClickInfo.style.display = 'none';
            }
            
            // Stop the map tracking interval
            this.stopMapTracking();
            
            // Switch back to the main tab
            this.switchToTab('main');
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
                
                // Calculate the map outline coordinates with width/height adjustments
                // The marker is at the top-right corner of the map
                const x = Math.floor(this.markerLocation.x - size.width + this.xOffset);
                const y = Math.floor(this.markerLocation.y + this.yOffset);
                const outlineWidth = Math.floor(size.width + this.outlineWidth);
                const outlineHeight = Math.floor(size.height + this.outlineHeight);
                
                // Create colors for the outline and grid
                const whiteColor = a1lib.mixColor(255, 255, 255); // White for outline
                const gridColor = a1lib.mixColor(200, 200, 50); // Bright yellow-ish for grid
                const blackColor = a1lib.mixColor(0, 0, 0); // Black for background
                
                // Draw a semi-transparent black background for the grid area
                // Alt1 API expects integers for coordinates and dimensions, and opacity as an integer percentage
                window.alt1.overLayRect(blackColor, x, y, outlineWidth, outlineHeight, 2000, 30); // 30% opacity (as integer)
                
                // Draw grid based on dungeon size
                let gridCols = 4; // Default for small
                let gridRows = 4; // Default for small
                
                if (this.mapSize === 'medium') {
                    gridCols = 4;
                    gridRows = 8;
                } else if (this.mapSize === 'large') {
                    gridCols = 8;
                    gridRows = 8;
                }
                
                const cellWidth = outlineWidth / gridCols;
                const cellHeight = outlineHeight / gridRows;
                
                // Draw vertical grid lines (draw these first so they appear behind the outline)
                for (let i = 1; i < gridCols; i++) {
                    const lineX = Math.floor(x + (cellWidth * i));
                    window.alt1.overLayLine(gridColor, 2, lineX, y, lineX, y + outlineHeight, 2000);
                }
                
                // Draw horizontal grid lines
                for (let i = 1; i < gridRows; i++) {
                    const lineY = Math.floor(y + (cellHeight * i));
                    window.alt1.overLayLine(gridColor, 2, x, lineY, x + outlineWidth, lineY, 2000);
                }
                
                // Draw the map outline (rectangle) - draw this last so it appears on top
                // Top line
                window.alt1.overLayLine(whiteColor, 2, x, y, x + outlineWidth, y, 2000);
                
                // Right line
                window.alt1.overLayLine(whiteColor, 2, x + outlineWidth, y, x + outlineWidth, y + outlineHeight, 2000);
                
                // Bottom line
                window.alt1.overLayLine(whiteColor, 2, x, y + outlineHeight, x + outlineWidth, y + outlineHeight, 2000);
                
                // Left line
                window.alt1.overLayLine(whiteColor, 2, x, y, x, y + outlineHeight, 2000);
                
                // Draw map size text
                window.alt1.overLayText(`${this.mapSize.toUpperCase()} MAP (${outlineWidth}x${outlineHeight})`, whiteColor, 10, x, y - 15, 2000);
                
                // Draw coordinate labels for the corners (0,0 at bottom left)
                window.alt1.overLayText("(0,0)", whiteColor, 10, x + 5, y + outlineHeight - 15, 2000);
                window.alt1.overLayText(`(${gridCols-1},0)`, whiteColor, 10, x + outlineWidth - 30, y + outlineHeight - 15, 2000);
                window.alt1.overLayText(`(0,${gridRows-1})`, whiteColor, 10, x + 5, y + 15, 2000);
                window.alt1.overLayText(`(${gridCols-1},${gridRows-1})`, whiteColor, 10, x + outlineWidth - 30, y + 15, 2000);
                
                // Draw icons on grid squares
                this.drawGridIcons(x, y, cellWidth, cellHeight, gridRows, gridCols);
                
                // Update debug info with grid dimensions
                this.updateDebugInfo(`Grid: ${gridCols}x${gridRows}, Cell size: ${Math.floor(cellWidth)}x${Math.floor(cellHeight)}`);
                
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
    
    // Draw icons on grid squares
    private drawGridIcons(gridX: number, gridY: number, cellWidth: number, cellHeight: number, rows: number, cols: number): void {
        if (!window.alt1) return;
        
        // Loop through all grid squares
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Check if this square has an icon
                if (this.gridSquares[r] && this.gridSquares[r][c] && this.gridSquares[r][c].icon) {
                    const icon = this.gridSquares[r][c].icon;
                    if (icon) {
                        // Calculate the center position of this grid square
                        const centerX = Math.floor(gridX + (c * cellWidth) + (cellWidth / 2));
                        const centerY = Math.floor(gridY + (r * cellHeight) + (cellHeight / 2));
                        
                        // Get the image for this icon
                        const img = this.keyImages.get(icon);
                        
                        if (img && img.complete) {
                            // Draw the image on the overlay
                            try {
                                // Create a temporary canvas to draw the image
                                const tempCanvas = document.createElement('canvas');
                                const iconSize = Math.min(cellWidth, cellHeight) * 0.7; // 70% of cell size
                                tempCanvas.width = iconSize;
                                tempCanvas.height = iconSize;
                                
                                const ctx = tempCanvas.getContext('2d');
                                if (ctx) {
                                    // Draw the image on the temporary canvas
                                    ctx.drawImage(img, 0, 0, iconSize, iconSize);
                                    
                                    // Get the image data
                                    const imgData = ctx.getImageData(0, 0, iconSize, iconSize);
                                    
                                    // Draw the image on the Alt1 overlay
                                    window.alt1.overLayImage(
                                        Math.floor(centerX - iconSize / 2), 
                                        Math.floor(centerY - iconSize / 2), 
                                        imgData.data, 
                                        imgData.width, 
                                        imgData.height, 
                                        2000
                                    );
                                }
                            } catch (error) {
                                console.error("Error drawing icon image:", error);
                                
                                // Fallback to text if image drawing fails
                                const whiteColor = a1lib.mixColor(255, 255, 255);
                                window.alt1.overLayText(icon, whiteColor, 12, centerX - 10, centerY, 2000);
                            }
                        } else {
                            // Fallback to text if image is not loaded
                            const whiteColor = a1lib.mixColor(255, 255, 255);
                            window.alt1.overLayText(icon, whiteColor, 12, centerX - 10, centerY, 2000);
                        }
                    }
                }
            }
        }
    }
    
    // Grid click handling
    private startGridClickListener(): void {
        if (!window.alt1) return;
        
        this.isListeningForGridClicks = true;
        
        // Set up a global click listener that checks if the click is within our grid area
        if (this.clickListenerInterval) {
            clearInterval(this.clickListenerInterval);
        }
        
        // Add debug message to UI
        const gridClickInfo = document.getElementById('grid-click-info');
        if (gridClickInfo) {
            const debugMsg = document.createElement('div');
            debugMsg.id = 'grid-click-debug';
            debugMsg.textContent = 'Grid click listener started';
            debugMsg.style.color = '#ffcc00';
            debugMsg.style.fontSize = '12px';
            debugMsg.style.marginTop = '5px';
            gridClickInfo.appendChild(debugMsg);
        }
        
        // Use an interval to check for clicks
        this.clickListenerInterval = window.setInterval(() => {
            // Check if Alt1 has detected a click
            if (window.alt1.lastLeftClick) {
                const clickX = window.alt1.lastLeftClick.x;
                const clickY = window.alt1.lastLeftClick.y;
                
                // Update debug info
                this.updateDebugInfo(`Click detected at (${clickX}, ${clickY})`);
                
                // Reset Alt1's click state
                window.alt1.lastLeftClick = null;
                
                // Check if the click is within our grid area
                if (this.markerLocation && this.isListeningForGridClicks) {
                    // Get the map size based on the selected dungeon size
                    const size = MAP_SIZES[this.mapSize];
                    
                    // Calculate the map outline coordinates
                    const x = Math.floor(this.markerLocation.x - size.width + this.xOffset);
                    const y = Math.floor(this.markerLocation.y + this.yOffset);
                    const outlineWidth = Math.floor(size.width + this.outlineWidth);
                    const outlineHeight = Math.floor(size.height + this.outlineHeight);
                    
                    // Update debug info with grid boundaries
                    this.updateDebugInfo(`Grid area: (${x}, ${y}) to (${x + outlineWidth}, ${y + outlineHeight})`);
                    
                    // Check if the click is within the grid area
                    if (clickX >= x && clickX <= x + outlineWidth && 
                        clickY >= y && clickY <= y + outlineHeight) {
                        
                        // Calculate which grid square was clicked
                        const relX = clickX - x;
                        const relY = clickY - y;
                        
                        // Update debug info
                        this.updateDebugInfo(`Click inside grid at relative position (${relX}, ${relY})`);
                        
                        // Handle the grid click
                        this.handleGridClick(relX, relY, x, y, outlineWidth, outlineHeight);
                        
                        // Prevent further processing of this click
                        return;
                    } else {
                        // Update debug info
                        this.updateDebugInfo(`Click outside grid area`);
                    }
                }
            }
        }, 50); // Check frequently
    }
    
    private stopGridClickListener(): void {
        this.isListeningForGridClicks = false;
        
        // Hide any active dropdown
        this.hideIconDropdown();
        
        // Clear the interval
        if (this.clickListenerInterval) {
            clearInterval(this.clickListenerInterval);
            this.clickListenerInterval = null;
        }
    }

    // Updated method to handle grid clicks
    private handleGridClick(relX: number, relY: number, gridX: number, gridY: number, outlineWidth: number, outlineHeight: number): void {
        // Determine which grid square was clicked
        let gridCols = 4; // Default for small
        let gridRows = 4; // Default for small
        
        if (this.mapSize === 'medium') {
            gridCols = 4;
            gridRows = 8;
        } else if (this.mapSize === 'large') {
            gridCols = 8;
            gridRows = 8;
        }
        
        const cellWidth = outlineWidth / gridCols;
        const cellHeight = outlineHeight / gridRows;
        
        const col = Math.floor(relX / cellWidth);
        const row = gridRows - 1 - Math.floor(relY / cellHeight); // Invert row to match bottom-left = 0,0
        
        // Log the click for debugging
        console.log(`Grid click at relative position (${relX},${relY}), grid square (${col},${row})`);
        
        // Update the grid click info in the UI
        this.updateGridClickInfo(row, col);
        
        // Ensure the row and column are valid
        if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
            // Calculate the center position of this grid square for the dropdown
            const centerX = Math.floor(gridX + (col * cellWidth) + (cellWidth / 2));
            const centerY = Math.floor(gridY + ((gridRows - 1 - row) * cellHeight) + (cellHeight / 2));
            
            // Show the icon dropdown at this position
            this.showIconDropdown(centerX, centerY, row, col);
            
            // Highlight the clicked square temporarily
            if (window.alt1 && window.alt1.permissionOverlay) {
                const highlightColor = a1lib.mixColor(255, 255, 0); // Yellow highlight
                window.alt1.overLayRect(highlightColor, 
                    Math.floor(gridX + (col * cellWidth)), 
                    Math.floor(gridY + ((gridRows - 1 - row) * cellHeight)), 
                    Math.floor(cellWidth), 
                    Math.floor(cellHeight), 
                    1000, 50); // 50% opacity, 1000ms duration for better visibility
            }
        }
    }

    // Remove the DOM-based click capture overlay methods
    private removeClickCaptureOverlay(): void {
        if (this.clickCaptureOverlay) {
            if (this.clickCaptureOverlay.parentNode) {
                this.clickCaptureOverlay.parentNode.removeChild(this.clickCaptureOverlay);
            }
            this.clickCaptureOverlay = null;
        }
    }

    private showIconDropdown(x: number, y: number, row: number, col: number): void {
        // Hide any existing dropdown
        this.hideIconDropdown();
        
        // Store the active dropdown position and grid coordinates
        this.activeDropdown = { x, y, row, col };
        
        // Create the dropdown element if it doesn't exist
        let dropdown = document.getElementById('grid-icon-dropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.id = 'grid-icon-dropdown';
            dropdown.className = 'grid-icon-dropdown';
            document.body.appendChild(dropdown);
            
            // Style the dropdown
            dropdown.style.position = 'absolute';
            dropdown.style.backgroundColor = '#333';
            dropdown.style.border = '1px solid #555';
            dropdown.style.borderRadius = '4px';
            dropdown.style.padding = '5px';
            dropdown.style.zIndex = '1000';
            dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        }
        
        // Position the dropdown
        dropdown.style.left = `${x}px`;
        dropdown.style.top = `${y}px`;
        
        // Clear any existing content
        dropdown.innerHTML = '';
        
        // Add dropdown title
        const title = document.createElement('div');
        title.textContent = `Add key to square (${row},${col})`;
        title.style.color = 'white';
        title.style.marginBottom = '5px';
        title.style.fontSize = '12px';
        dropdown.appendChild(title);
        
        // Add blue corner key option
        const blueKeyOption = document.createElement('div');
        blueKeyOption.textContent = 'Blue Corner Key';
        blueKeyOption.style.color = 'lightblue';
        blueKeyOption.style.padding = '3px';
        blueKeyOption.style.cursor = 'pointer';
        blueKeyOption.style.borderRadius = '2px';
        blueKeyOption.style.marginBottom = '2px';
        
        // Highlight on hover
        blueKeyOption.addEventListener('mouseover', () => {
            blueKeyOption.style.backgroundColor = '#444';
        });
        
        blueKeyOption.addEventListener('mouseout', () => {
            blueKeyOption.style.backgroundColor = 'transparent';
        });
        
        // Add click handler
        blueKeyOption.addEventListener('click', () => {
            this.addIconToGrid(row, col, 'Blue');
            this.hideIconDropdown();
        });
        
        dropdown.appendChild(blueKeyOption);
        
        // Add clear option if there's already an icon
        if (this.gridSquares[row] && this.gridSquares[row][col] && this.gridSquares[row][col].icon) {
            const clearOption = document.createElement('div');
            clearOption.textContent = 'Clear';
            clearOption.style.color = 'salmon';
            clearOption.style.padding = '3px';
            clearOption.style.cursor = 'pointer';
            clearOption.style.borderRadius = '2px';
            
            // Highlight on hover
            clearOption.addEventListener('mouseover', () => {
                clearOption.style.backgroundColor = '#444';
            });
            
            clearOption.addEventListener('mouseout', () => {
                clearOption.style.backgroundColor = 'transparent';
            });
            
            // Add click handler
            clearOption.addEventListener('click', () => {
                this.addIconToGrid(row, col, null);
                this.hideIconDropdown();
            });
            
            dropdown.appendChild(clearOption);
        }
        
        // Show the dropdown
        dropdown.style.display = 'block';
    }
    
    private hideIconDropdown(): void {
        const dropdown = document.getElementById('grid-icon-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        this.activeDropdown = null;
    }
    
    private addIconToGrid(row: number, col: number, icon: string | null): void {
        // Ensure the grid square exists
        if (this.gridSquares[row] && this.gridSquares[row][col]) {
            this.gridSquares[row][col].icon = icon;
            
            // Redraw the map to show the updated icon
            this.drawMapOutline();
        }
    }

    // Preload key images with better error handling
    private preloadKeyImages(): void {
        // Preload the blue corner key image with multiple fallback paths
        const blueKeyImg = new Image();
        
        // Define all possible paths to try
        const paths = [
            'assets/Blue_corner_key.png',
            'Blue_corner_key.png',
            '../assets/Blue_corner_key.png',
            './assets/Blue_corner_key.png',
            '/assets/Blue_corner_key.png'
        ];
        
        let pathIndex = 0;
        
        // Function to try loading the image from the next path
        const tryNextPath = () => {
            if (pathIndex < paths.length) {
                console.log(`Trying to load blue key image from: ${paths[pathIndex]}`);
                blueKeyImg.src = paths[pathIndex];
                pathIndex++;
            } else {
                console.error('Failed to load blue corner key image from all paths');
                // Create a fallback colored square as the image
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 32;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(0, 0, 32, 32);
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(1, 1, 30, 30);
                    
                    // Convert canvas to image
                    const fallbackImg = new Image();
                    fallbackImg.src = canvas.toDataURL();
                    fallbackImg.onload = () => {
                        console.log('Using fallback blue key image');
                        this.keyImages.set('Blue', fallbackImg);
                    };
                }
            }
        };
        
        // Set up event handlers
        blueKeyImg.onload = () => {
            console.log(`Blue corner key image loaded successfully from ${paths[pathIndex-1]}`);
            this.keyImages.set('Blue', blueKeyImg);
        };
        
        blueKeyImg.onerror = () => {
            console.error(`Failed to load blue corner key image from ${paths[pathIndex-1]}`);
            tryNextPath();
        };
        
        // Start the loading process
        tryNextPath();
    }

    // Create a UI element to display grid click information
    private createGridClickInfoElement(): void {
        // Check if the element already exists
        if (document.getElementById('grid-click-info')) {
            return;
        }
        
        // Create a container for the grid click info
        const gridClickInfo = document.createElement('div');
        gridClickInfo.id = 'grid-click-info';
        gridClickInfo.style.marginTop = '10px';
        gridClickInfo.style.padding = '10px';
        gridClickInfo.style.backgroundColor = '#222';
        gridClickInfo.style.border = '1px solid #444';
        gridClickInfo.style.borderRadius = '4px';
        gridClickInfo.style.display = 'none'; // Hidden by default
        
        // Add a title
        const title = document.createElement('h3');
        title.textContent = 'Grid Click Information';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '14px';
        title.style.color = '#fff';
        gridClickInfo.appendChild(title);
        
        // Add content for coordinates
        const coordinates = document.createElement('div');
        coordinates.id = 'grid-coordinates';
        coordinates.textContent = 'No square clicked yet';
        coordinates.style.fontSize = '13px';
        coordinates.style.color = '#ddd';
        gridClickInfo.appendChild(coordinates);
        
        // Add the grid click info to the page
        // Find a good place to add it - look for map-status or create a new container
        const mapStatus = document.getElementById('map-status');
        if (mapStatus && mapStatus.parentNode) {
            mapStatus.parentNode.insertBefore(gridClickInfo, mapStatus.nextSibling);
        } else {
            // If map-status doesn't exist, add it to the body
            document.body.appendChild(gridClickInfo);
        }
    }
    
    // Update the grid click info display
    private updateGridClickInfo(row: number, col: number): void {
        const gridClickInfo = document.getElementById('grid-click-info');
        const coordinates = document.getElementById('grid-coordinates');
        
        if (gridClickInfo && coordinates) {
            // Show the grid click info
            gridClickInfo.style.display = 'block';
            
            // Update the coordinates
            coordinates.textContent = `Last clicked square: (${col}, ${row})`;
            coordinates.style.color = '#7cfc00'; // Bright green for visibility
            coordinates.style.fontWeight = 'bold';
            coordinates.style.fontSize = '16px'; // Make it larger
            
            // Store the last clicked square
            this.lastClickedSquare = { row, col };
            
            // Add a timestamp
            const timestamp = new Date().toLocaleTimeString();
            const timeElement = document.createElement('div');
            timeElement.textContent = `Time: ${timestamp}`;
            timeElement.style.fontSize = '11px';
            timeElement.style.color = '#999';
            timeElement.style.marginTop = '5px';
            
            // Remove any existing timestamp
            const existingTime = coordinates.nextSibling;
            if (existingTime && existingTime instanceof Element && existingTime.id !== 'grid-click-debug') {
                coordinates.parentNode?.removeChild(existingTime);
            }
            
            // Add the new timestamp
            coordinates.parentNode?.insertBefore(timeElement, document.getElementById('grid-click-debug'));
            
            // Flash the coordinates to make them noticeable
            coordinates.style.backgroundColor = '#333';
            setTimeout(() => {
                if (coordinates) {
                    coordinates.style.backgroundColor = 'transparent';
                }
            }, 300);
        }
    }

    // Helper method to update debug info
    private updateDebugInfo(message: string): void {
        const debugElement = document.getElementById('grid-click-debug');
        if (debugElement) {
            debugElement.textContent = message;
            
            // Flash the debug message to make it noticeable
            debugElement.style.backgroundColor = '#444';
            setTimeout(() => {
                if (debugElement) {
                    debugElement.style.backgroundColor = 'transparent';
                }
            }, 300);
        }
    }

    // Create the tab interface for map interaction
    private createMapTabInterface(): void {
        // Create the tab container if it doesn't exist
        let tabContainer = document.getElementById('app-tabs');
        if (!tabContainer) {
            tabContainer = document.createElement('div');
            tabContainer.id = 'app-tabs';
            tabContainer.className = 'tab-container';
            
            // Style the tab container
            tabContainer.style.display = 'flex';
            tabContainer.style.marginBottom = '10px';
            tabContainer.style.borderBottom = '1px solid #444';
            
            // Add it to the top of the app
            const appContainer = document.querySelector('.app-container') || document.body;
            const firstChild = appContainer.firstChild;
            if (firstChild) {
                appContainer.insertBefore(tabContainer, firstChild);
            } else {
                appContainer.appendChild(tabContainer);
            }
        }
        
        // Create the main tab
        const mainTab = document.createElement('div');
        mainTab.id = 'main-tab';
        mainTab.className = 'tab active';
        mainTab.textContent = 'Main';
        mainTab.style.padding = '8px 15px';
        mainTab.style.cursor = 'pointer';
        mainTab.style.backgroundColor = '#333';
        mainTab.style.color = '#fff';
        mainTab.style.borderTopLeftRadius = '4px';
        mainTab.style.borderTopRightRadius = '4px';
        mainTab.style.marginRight = '5px';
        mainTab.style.border = '1px solid #444';
        mainTab.style.borderBottom = 'none';
        
        // Create the map tab
        const mapTab = document.createElement('div');
        mapTab.id = 'map-tab';
        mapTab.className = 'tab';
        mapTab.textContent = 'Map Interaction';
        mapTab.style.padding = '8px 15px';
        mapTab.style.cursor = 'pointer';
        mapTab.style.backgroundColor = '#222';
        mapTab.style.color = '#ccc';
        mapTab.style.borderTopLeftRadius = '4px';
        mapTab.style.borderTopRightRadius = '4px';
        mapTab.style.border = '1px solid #444';
        mapTab.style.borderBottom = 'none';
        
        // Add tabs to container
        tabContainer.appendChild(mainTab);
        tabContainer.appendChild(mapTab);
        
        // Create content containers
        const mainContent = document.createElement('div');
        mainContent.id = 'main-content';
        mainContent.className = 'tab-content active';
        
        const mapContent = document.createElement('div');
        mapContent.id = 'map-content';
        mapContent.className = 'tab-content';
        mapContent.style.display = 'none';
        
        // Move existing content to main content
        const existingContent = Array.from(document.body.children).filter(el => 
            el.id !== 'app-tabs' && 
            el.id !== 'main-content' && 
            el.id !== 'map-content' &&
            el.id !== 'grid-icon-dropdown'
        );
        
        existingContent.forEach(el => {
            mainContent.appendChild(el);
        });
        
        // Create map interaction content
        mapContent.innerHTML = `
            <h2 style="margin-top: 0; font-size: 16px; color: #ffcc00;">Dungeoneering Map Interaction</h2>
            <div style="font-size: 12px; color: #ccc; margin-bottom: 10px;">
                Click on a grid square to add a key or other marker.
                <br>Bottom left is (0,0), top right is (${this.getGridCols()-1},${this.getGridRows()-1}).
            </div>
            <div style="position: relative; margin-top: 10px; border: 2px solid #444; background-color: #333;">
                <canvas id="mapCanvas"></canvas>
                <div id="mapDropdown" style="position: absolute; background-color: #333; border: 1px solid #555; border-radius: 4px; padding: 5px; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: none;">
                    <div style="color: white; margin-bottom: 5px; font-size: 12px;">Add key to square</div>
                    <div id="mapBlueKeyOption" style="color: lightblue; padding: 3px; cursor: pointer; border-radius: 2px; margin-bottom: 2px;">Blue Corner Key</div>
                    <div id="mapClearOption" style="color: salmon; padding: 3px; cursor: pointer; border-radius: 2px; display: none;">Clear</div>
                </div>
            </div>
            <div style="margin-top: 10px; padding: 10px; background-color: #333; border: 1px solid #444; border-radius: 4px;">
                <div id="mapCoordinates" style="font-size: 16px; font-weight: bold; color: #7cfc00; margin-bottom: 5px;">No square clicked yet</div>
                <div id="mapTimestamp" style="font-size: 11px; color: #999;"></div>
            </div>
            <div style="margin-top: 10px; padding: 10px; background-color: #333; border: 1px solid #444; border-radius: 4px;">
                <button id="openAlt1Popup" style="background-color: #4CAF50; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Open Helper Window</button>
            </div>
        `;
        
        // Add content containers to document
        document.body.appendChild(mainContent);
        document.body.appendChild(mapContent);
        
        // Add tab click handlers
        mainTab.addEventListener('click', () => {
            this.switchToTab('main');
        });
        
        mapTab.addEventListener('click', () => {
            this.switchToTab('map');
        });
        
        // Set up the map canvas when the tab is first created
        this.setupMapCanvas();
        
        // Add event listener for the Alt1 popup button
        setTimeout(() => {
            const openAlt1PopupButton = document.getElementById('openAlt1Popup');
            if (openAlt1PopupButton) {
                openAlt1PopupButton.addEventListener('click', () => {
                    this.openAlt1Popup();
                });
            }
        }, 100);
    }

    // Switch between tabs
    private switchToTab(tabName: string): void {
        const mainTab = document.getElementById('main-tab');
        const mapTab = document.getElementById('map-tab');
        const mainContent = document.getElementById('main-content');
        const mapContent = document.getElementById('map-content');
        
        if (!mainTab || !mapTab || !mainContent || !mapContent) return;
        
        if (tabName === 'main') {
            // Activate main tab
            mainTab.className = 'tab active';
            mainTab.style.backgroundColor = '#333';
            mainTab.style.color = '#fff';
            
            mapTab.className = 'tab';
            mapTab.style.backgroundColor = '#222';
            mapTab.style.color = '#ccc';
            
            mainContent.style.display = 'block';
            mapContent.style.display = 'none';
            
            this.mapTabActive = false;
            
            // Stop map tab updates
            if (this.mapTabInterval) {
                clearInterval(this.mapTabInterval);
                this.mapTabInterval = null;
            }
        } else if (tabName === 'map') {
            // Activate map tab
            mapTab.className = 'tab active';
            mapTab.style.backgroundColor = '#333';
            mapTab.style.color = '#fff';
            
            mainTab.className = 'tab';
            mainTab.style.backgroundColor = '#222';
            mainTab.style.color = '#ccc';
            
            mainContent.style.display = 'none';
            mapContent.style.display = 'block';
            
            this.mapTabActive = true;
            
            // Resize the canvas to fit the container
            this.resizeMapCanvas();
            
            // Start map tab updates
            this.startMapTabUpdates();
        }
    }

    // Set up the map canvas
    private setupMapCanvas(): void {
        // Get the canvas element
        this.mapCanvas = document.getElementById('mapCanvas') as HTMLCanvasElement;
        if (this.mapCanvas) {
            this.mapContext = this.mapCanvas.getContext('2d');
            
            // Add click event listener to the canvas
            this.mapCanvas.addEventListener('click', (e) => this.handleMapCanvasClick(e));
            
            // Set up dropdown event listeners
            const blueKeyOption = document.getElementById('mapBlueKeyOption');
            const clearOption = document.getElementById('mapClearOption');
            
            if (blueKeyOption) {
                blueKeyOption.addEventListener('click', () => {
                    if (this.activeDropdown) {
                        this.addIconToGrid(this.activeDropdown.row, this.activeDropdown.col, 'Blue');
                        this.hideMapDropdown();
                        this.updateMapCanvas();
                    }
                });
            }
            
            if (clearOption) {
                clearOption.addEventListener('click', () => {
                    if (this.activeDropdown) {
                        this.addIconToGrid(this.activeDropdown.row, this.activeDropdown.col, null);
                        this.hideMapDropdown();
                        this.updateMapCanvas();
                    }
                });
            }
            
            // Add click listener to hide dropdown when clicking outside
            document.addEventListener('click', (e) => {
                const dropdown = document.getElementById('mapDropdown');
                if (dropdown && e.target !== dropdown && !dropdown.contains(e.target as Node)) {
                    this.hideMapDropdown();
                }
            });
        }
    }

    // Resize the map canvas to fit its container
    private resizeMapCanvas(): void {
        if (!this.mapCanvas) return;
        
        // Get the map size based on the selected dungeon size
        const size = MAP_SIZES[this.mapSize];
        const outlineWidth = Math.floor(size.width + this.outlineWidth);
        const outlineHeight = Math.floor(size.height + this.outlineHeight);
        
        // Set the canvas dimensions
        this.mapCanvas.width = outlineWidth;
        this.mapCanvas.height = outlineHeight;
        
        // Update the canvas
        this.updateMapCanvas();
    }

    // Start the interval to update the map canvas
    private startMapTabUpdates(): void {
        if (this.mapTabInterval) {
            clearInterval(this.mapTabInterval);
        }
        
        // Update the map canvas immediately
        this.updateMapCanvas();
        
        // Set up an interval to update the map canvas
        this.mapTabInterval = window.setInterval(() => {
            if (this.mapTabActive) {
                this.updateMapCanvas();
            }
        }, 1000); // Update every second
    }

    // Update the map canvas
    private updateMapCanvas(): void {
        if (!this.mapCanvas || !this.mapContext || !this.markerLocation) return;
        
        // Get the map size based on the selected dungeon size
        const size = MAP_SIZES[this.mapSize];
        const outlineWidth = Math.floor(size.width + this.outlineWidth);
        const outlineHeight = Math.floor(size.height + this.outlineHeight);
        
        // Clear the canvas
        this.mapContext.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
        
        // Draw a background
        this.mapContext.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.mapContext.fillRect(0, 0, outlineWidth, outlineHeight);
        
        // Draw grid based on dungeon size
        let gridCols = this.getGridCols();
        let gridRows = this.getGridRows();
        
        const cellWidth = outlineWidth / gridCols;
        const cellHeight = outlineHeight / gridRows;
        
        // Draw grid lines
        this.mapContext.strokeStyle = 'rgba(200, 200, 50, 0.8)';
        this.mapContext.lineWidth = 2;
        
        // Draw vertical grid lines
        for (let i = 1; i < gridCols; i++) {
            const lineX = Math.floor(cellWidth * i);
            this.mapContext.beginPath();
            this.mapContext.moveTo(lineX, 0);
            this.mapContext.lineTo(lineX, outlineHeight);
            this.mapContext.stroke();
        }
        
        // Draw horizontal grid lines
        for (let i = 1; i < gridRows; i++) {
            const lineY = Math.floor(cellHeight * i);
            this.mapContext.beginPath();
            this.mapContext.moveTo(0, lineY);
            this.mapContext.lineTo(outlineWidth, lineY);
            this.mapContext.stroke();
        }
        
        // Draw the map outline
        this.mapContext.strokeStyle = 'white';
        this.mapContext.lineWidth = 2;
        this.mapContext.strokeRect(0, 0, outlineWidth, outlineHeight);
        
        // Draw coordinate labels for the corners
        this.mapContext.fillStyle = 'white';
        this.mapContext.font = '10px Arial';
        this.mapContext.fillText("(0,0)", 5, outlineHeight - 5);
        this.mapContext.fillText(`(${gridCols-1},0)`, outlineWidth - 30, outlineHeight - 5);
        this.mapContext.fillText(`(0,${gridRows-1})`, 5, 15);
        this.mapContext.fillText(`(${gridCols-1},${gridRows-1})`, outlineWidth - 30, 15);
        
        // Draw icons on grid squares
        this.drawMapCanvasIcons(cellWidth, cellHeight, gridRows, gridCols);
        
        // If we have a last clicked square, highlight it
        if (this.lastClickedSquare) {
            const row = this.lastClickedSquare.row;
            const col = this.lastClickedSquare.col;
            
            // Make sure the row and column are valid
            if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
                // Calculate the position of the grid square
                const squareX = Math.floor(col * cellWidth);
                const squareY = Math.floor((gridRows - 1 - row) * cellHeight); // Invert row to match bottom-left = 0,0
                
                // Draw a highlight around the square
                this.mapContext.strokeStyle = 'rgba(255, 255, 0, 0.8)';
                this.mapContext.lineWidth = 3;
                this.mapContext.strokeRect(squareX + 2, squareY + 2, cellWidth - 4, cellHeight - 4);
            }
        }
    }

    // Draw icons on the map canvas
    private drawMapCanvasIcons(cellWidth: number, cellHeight: number, rows: number, cols: number): void {
        if (!this.mapContext) return;
        
        // Loop through all grid squares
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Check if this square has an icon
                if (this.gridSquares[r] && this.gridSquares[r][c] && this.gridSquares[r][c].icon) {
                    const icon = this.gridSquares[r][c].icon;
                    if (icon) {
                        // Calculate the center position of this grid square
                        const centerX = Math.floor((c * cellWidth) + (cellWidth / 2));
                        const centerY = Math.floor(((rows - 1 - r) * cellHeight) + (cellHeight / 2)); // Invert row to match bottom-left = 0,0
                        
                        // Get the image for this icon
                        const img = this.keyImages.get(icon);
                        
                        if (img && img.complete) {
                            // Draw the image on the canvas
                            try {
                                const iconSize = Math.min(cellWidth, cellHeight) * 0.7; // 70% of cell size
                                this.mapContext.drawImage(
                                    img, 
                                    centerX - iconSize / 2, 
                                    centerY - iconSize / 2, 
                                    iconSize, 
                                    iconSize
                                );
                            } catch (error) {
                                console.error("Error drawing icon image on canvas:", error);
                                
                                // Fallback to text if image drawing fails
                                this.mapContext.fillStyle = 'white';
                                this.mapContext.font = '12px Arial';
                                this.mapContext.fillText(icon, centerX - 10, centerY);
                            }
                        } else {
                            // Fallback to text if image is not loaded
                            this.mapContext.fillStyle = 'white';
                            this.mapContext.font = '12px Arial';
                            this.mapContext.fillText(icon, centerX - 10, centerY);
                        }
                    }
                }
            }
        }
    }

    // Handle clicks on the map canvas
    private handleMapCanvasClick(e: MouseEvent): void {
        if (!this.mapCanvas || !this.mapContext) return;
        
        // Get the click position relative to the canvas
        const rect = this.mapCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Get the grid dimensions
        const gridCols = this.getGridCols();
        const gridRows = this.getGridRows();
        
        const cellWidth = this.mapCanvas.width / gridCols;
        const cellHeight = this.mapCanvas.height / gridRows;
        
        // Calculate which grid square was clicked
        const col = Math.floor(clickX / cellWidth);
        const row = gridRows - 1 - Math.floor(clickY / cellHeight); // Invert row to match bottom-left = 0,0
        
        // Log the click for debugging
        console.log(`Map canvas click at (${clickX},${clickY}), grid square (${col},${row})`);
        
        // Update the coordinates display
        this.updateMapCoordinates(row, col);
        
        // Ensure the row and column are valid
        if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
            // Store the last clicked square
            this.lastClickedSquare = { row, col };
            
            // Show the dropdown at this position
            this.showMapDropdown(e.clientX, e.clientY, row, col);
            
            // Update the canvas to show the highlight
            this.updateMapCanvas();
        }
    }

    // Show the dropdown for the map canvas
    private showMapDropdown(x: number, y: number, row: number, col: number): void {
        // Hide any existing dropdown
        this.hideMapDropdown();
        
        // Store the active dropdown position and grid coordinates
        this.activeDropdown = { x, y, row, col };
        
        // Get the dropdown element
        const dropdown = document.getElementById('mapDropdown');
        if (!dropdown) return;
        
        // Update the dropdown title
        const title = dropdown.querySelector('div:first-child');
        if (title) {
            title.textContent = `Add key to square (${col},${row})`;
        }
        
        // Show or hide the clear option based on whether there's an icon
        const clearOption = document.getElementById('mapClearOption');
        if (clearOption) {
            if (this.gridSquares[row] && this.gridSquares[row][col] && this.gridSquares[row][col].icon) {
                clearOption.style.display = 'block';
            } else {
                clearOption.style.display = 'none';
            }
        }
        
        // Position the dropdown
        dropdown.style.left = `${x}px`;
        dropdown.style.top = `${y}px`;
        
        // Show the dropdown
        dropdown.style.display = 'block';
    }

    // Hide the dropdown for the map canvas
    private hideMapDropdown(): void {
        const dropdown = document.getElementById('mapDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        
        this.activeDropdown = null;
    }

    // Update the coordinates display for the map canvas
    private updateMapCoordinates(row: number, col: number): void {
        const coordinates = document.getElementById('mapCoordinates');
        const timestamp = document.getElementById('mapTimestamp');
        
        if (coordinates) {
            coordinates.textContent = `Last clicked square: (${col}, ${row})`;
            
            // Flash the coordinates to make them noticeable
            coordinates.style.backgroundColor = '#333';
            setTimeout(() => {
                if (coordinates) {
                    coordinates.style.backgroundColor = 'transparent';
                }
            }, 300);
        }
        
        if (timestamp) {
            timestamp.textContent = `Time: ${new Date().toLocaleTimeString()}`;
        }
    }

    // Helper method to get the number of grid columns based on dungeon size
    private getGridCols(): number {
        if (this.mapSize === 'large') {
            return 8;
        }
        return 4; // Small and medium dungeons have 4 columns
    }

    // Helper method to get the number of grid rows based on dungeon size
    private getGridRows(): number {
        if (this.mapSize === 'small') {
            return 4;
        }
        return 8; // Medium and large dungeons have 8 rows
    }

    // Open the Alt1 popup window with the map grid
    private openAlt1Popup(): void {
        try {
            // Get the current URL
            const currentUrl = window.location.href;
            
            // Extract the base URL (up to the last directory)
            const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
            
            // Create the URL for the helper page
            const helperUrl = `${baseUrl}helper.html`;
            
            // Log the URL for debugging
            console.log('Opening Alt1 popup with URL:', helperUrl);
            
            // Flag to track if a window has been successfully opened
            let windowOpened = false;
            
            // Try different methods to open the Alt1 browser window
            if (a1lib.hasAlt1) {
                // Method 1: Use the Alt1 protocol directly
                const alt1Url = `alt1://browser/${helperUrl}`;
                console.log('Using Alt1 protocol URL:', alt1Url);
                
                try {
                    // Create and click an anchor tag to open the Alt1 browser
                    const anchor = document.createElement("a");
                    anchor.href = alt1Url;
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                    
                    console.log('Opened map grid window using Alt1 protocol');
                    windowOpened = true;
                    
                    // Send current grid state to the helper window after a short delay
                    setTimeout(() => {
                        this.syncGridWithHelper();
                    }, 1000);
                } catch (e) {
                    console.warn('Failed to open using anchor method:', e);
                    windowOpened = false;
                }
                
                // Only try the fallback methods if the first method failed
                if (!windowOpened) {
                    try {
                        // Method 2: Try using window.location in an iframe to avoid navigating away
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        document.body.appendChild(iframe);
                        
                        if (iframe.contentWindow) {
                            // Use setTimeout to give time for the iframe to load
                            setTimeout(() => {
                                try {
                                    iframe.contentWindow!.location.href = alt1Url;
                                    console.log('Tried opening with iframe method');
                                    // Remove the iframe after a short delay
                                    setTimeout(() => {
                                        document.body.removeChild(iframe);
                                        
                                        // Send current grid state to the helper window
                                        this.syncGridWithHelper();
                                    }, 1000);
                                } catch (e) {
                                    console.warn('Failed to use iframe method:', e);
                                    document.body.removeChild(iframe);
                                }
                            }, 100);
                        }
                    } catch (e) {
                        console.warn('Failed to create iframe:', e);
                    }
                    
                    // Method 3: Fallback to Alt1 API if the protocol methods fail
                    // This is set on a timeout to give the protocol methods a chance to work first
                    setTimeout(() => {
                        if (!windowOpened && window.alt1 && typeof window.alt1.openBrowser === 'function') {
                            try {
                                console.log('Trying Alt1 API directly as fallback');
                                window.alt1.openBrowser(helperUrl);
                                windowOpened = true;
                                
                                // Send current grid state to the helper window
                                setTimeout(() => {
                                    this.syncGridWithHelper();
                                }, 1000);
                            } catch (e) {
                                console.warn('Failed to use Alt1 API directly:', e);
                            }
                        }
                        
                        // Final fallback - only if all Alt1 methods failed and we haven't opened a window yet
                        if (!windowOpened) {
                            window.open(helperUrl, '_blank');
                            console.log('Opened map grid window using regular window.open as last resort');
                            
                            // Send current grid state to the helper window
                            setTimeout(() => {
                                this.syncGridWithHelper();
                            }, 1000);
                        }
                    }, 500);
                }
            } else {
                // Fallback to regular window.open for testing outside Alt1
                window.open(helperUrl, '_blank');
                console.log('Opened map grid window using regular window.open (Alt1 not detected)');
                
                // Send current grid state to the helper window
                setTimeout(() => {
                    this.syncGridWithHelper();
                }, 1000);
            }
        } catch (error) {
            console.error('Error opening Alt1 popup:', error);
            alert('Failed to open Alt1 popup. Please check the console for details.');
        }
    }
    
    // Sync grid state with the helper window
    private syncGridWithHelper(): void {
        // Find all windows that might be our helper
        const windows = [];
        for (let i = 0; i < window.frames.length; i++) {
            try {
                if (window.frames[i].location.href.includes('helper.html')) {
                    windows.push(window.frames[i]);
                }
            } catch (e) {
                // Ignore cross-origin errors
            }
        }
        
        // Send grid state to all potential helper windows
        const message = {
            type: 'grid-sync',
            gridSquares: this.gridSquares,
            mapSize: this.mapSize
        };
        
        windows.forEach(w => {
            try {
                w.postMessage(message, '*');
            } catch (e) {
                console.warn('Failed to send grid state to helper window:', e);
            }
        });
        
        // Also broadcast to any opener windows
        if (window.opener) {
            try {
                window.opener.postMessage(message, '*');
            } catch (e) {
                // Ignore cross-origin errors
            }
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