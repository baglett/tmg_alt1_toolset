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
                // Use a1lib.capture instead of window.alt1.capture
                let captureResult = a1lib.capture(region.x, region.y, region.width, region.height);
                
                // If direct capture fails, try using captureHoldFullRs as a fallback
                if (!captureResult) {
                    console.log('Direct capture failed, trying captureHoldFullRs as fallback');
                    const fullCapture = a1lib.captureHoldFullRs();
                    if (fullCapture) {
                        try {
                            // Extract the region we need from the full capture
                            captureResult = fullCapture.toData(region.x, region.y, region.width, region.height);
                        } catch (e) {
                            console.error('Failed to extract region from full capture:', e);
                        }
                    }
                }
                
                if (captureResult) {
                    imgData = captureResult;
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
    private xOffset: number = 6;
    private yOffset: number = -12;
    private outlineWidth: number = -5; // Width adjustment for the outer outline
    private outlineHeight: number = 0; // Height adjustment for the outer outline
    private mapTrackingInterval: number | null = null;
    private clickCaptureOverlay: HTMLDivElement | null = null;
    
    // Grid interaction properties
    private gridSquares: { row: number, col: number, icon: string | null, keyColor?: string, keyShape?: string }[][] = [];
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
    
    // Map preview properties
    private mapPreviewCanvas: HTMLCanvasElement | null = null;
    private mapPreviewContext: CanvasRenderingContext2D | null = null;
    private mapPreviewInterval: number | null = null;

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
        
        // Set up the map preview canvas
        this.setupMapPreviewCanvas();
        
        // Set up message listener for helper window communication
        window.addEventListener('message', this.handleHelperMessage.bind(this));
        
        // Make the engine available globally
        window.DungeoneeringGateEngine = this;
        
        // Add event listener for window unload
        window.addEventListener('beforeunload', () => {
            if (typeof this.cleanup === 'function') {
                this.cleanup();
            }
        });
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
                }
                break;
                
            case 'grid-update':
                if (typeof event.data.row === 'number' && 
                    typeof event.data.col === 'number' && 
                    this.gridSquares[event.data.row] && 
                    this.gridSquares[event.data.row][event.data.col]) {
                    
                    // Handle key color and shape updates
                    if (event.data.keyColor !== undefined && event.data.keyShape !== undefined) {
                        console.log(`Key update from helper: (${event.data.col},${event.data.row}) = ${event.data.keyColor} ${event.data.keyShape}`);
                        this.gridSquares[event.data.row][event.data.col].keyColor = event.data.keyColor;
                        this.gridSquares[event.data.row][event.data.col].keyShape = event.data.keyShape;
                    }
                }
                break;
            
            case 'request-anchor':
                console.log('Helper window requested anchor point');
                // Send the current anchor point if available
                if (this.markerLocation && event.source) {
                    const message = {
                        type: 'anchor-update',
                        x: this.markerLocation.x,
                        y: this.markerLocation.y,
                        xOffset: this.xOffset,
                        yOffset: this.yOffset,
                        outlineWidth: this.outlineWidth,
                        outlineHeight: this.outlineHeight
                    };
                    
                    try {
                        (event.source as Window).postMessage(message, '*');
                        console.log(`Sent anchor point to helper: (${this.markerLocation.x}, ${this.markerLocation.y})`);
                    } catch (e) {
                        console.error('Failed to send anchor point to helper:', e);
                    }
                }
                break;
            
            case 'request-grid':
                console.log('Helper window requested grid state');
                // Send the current grid state if available
                if (event.source) {
                    try {
                        // Send map size first
                        (event.source as Window).postMessage({
                            type: 'map-size',
                            size: this.mapSize
                        }, '*');
                        
                        // Then send grid state
                        (event.source as Window).postMessage({
                            type: 'grid-sync',
                            gridSquares: this.gridSquares
                        }, '*');
                        
                        console.log('Sent grid state to helper');
                    } catch (e) {
                        console.error('Failed to send grid state to helper:', e);
                    }
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
        
        // Create a new grid squares array
        this.gridSquares = [];
        
        // Initialize each grid square
        for (let r = 0; r < rows; r++) {
            this.gridSquares[r] = [];
            for (let c = 0; c < cols; c++) {
                this.gridSquares[r][c] = { 
                    row: r, 
                    col: c, 
                    icon: null,
                    keyColor: null,
                    keyShape: null
                };
            }
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
                // Update the preview canvas size
                this.updateMapPreviewCanvasSize();
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                    // Update the map preview
                    this.updateMapPreview();
                    // Update helper windows
                    this.updateHelperWindows();
                }
            });
        });
        
        // Add event listeners for offset inputs
        if (xOffsetInput) {
            xOffsetInput.addEventListener('change', () => {
                this.xOffset = parseInt(xOffsetInput.value, 10) || 0;
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                    // Update the map preview
                    this.updateMapPreview();
                    // Update helper windows
                    this.updateHelperWindows();
                }
            });
        }
        
        if (yOffsetInput) {
            yOffsetInput.addEventListener('change', () => {
                this.yOffset = parseInt(yOffsetInput.value, 10) || 0;
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                    // Update the map preview
                    this.updateMapPreview();
                    // Update helper windows
                    this.updateHelperWindows();
                }
            });
        }
        
        // Add event listeners for outline width/height
        if (outlineWidthInput) {
            outlineWidthInput.addEventListener('change', () => {
                this.outlineWidth = parseInt(outlineWidthInput.value, 10) || 0;
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                    // Update the map preview
                    this.updateMapPreview();
                    // Update helper windows
                    this.updateHelperWindows();
                }
            });
        }
        
        if (outlineHeightInput) {
            outlineHeightInput.addEventListener('change', () => {
                this.outlineHeight = parseInt(outlineHeightInput.value, 10) || 0;
                if (this.mapTrackingEnabled) {
                    this.drawMapOutline();
                    // Update the map preview
                    this.updateMapPreview();
                    // Update helper windows
                    this.updateHelperWindows();
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

        // Set up event listeners for UI elements
        const openHelperButton = document.getElementById('open-helper-button');
        if (openHelperButton) {
            openHelperButton.addEventListener('click', () => this.openHelperWindow());
        }
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
        // Store the marker location
        this.markerLocation = { x, y };
        
        // Update the UI to show we're waiting for confirmation
        const statusElement = document.getElementById('marker-status');
        if (statusElement) {
            statusElement.textContent = `Marker anchored at (${x}, ${y}). Press the button to confirm or ESC to cancel.`;
        }
        
        // Draw the crosshair at the anchored position
        this.drawCrosshair(x, y, true);
        
        // Update the map preview if tracking is enabled
        if (this.mapTrackingEnabled) {
            this.updateMapPreview();
            // Update helper windows
            this.updateHelperWindows();
        }
    }

    private confirmMarkerPlacement(): void {
        if (!this.markerLocation) {
            alert('No marker has been placed yet.');
            return;
        }
        
        // Update the UI to show the marker is confirmed
            const statusElement = document.getElementById('marker-status');
            if (statusElement) {
            statusElement.textContent = `Marker confirmed at (${this.markerLocation.x}, ${this.markerLocation.y}).`;
        }
        
        // Stop the drag tracking
        this.stopDragTracking();
        
        // Enable map tracking
        if (!this.mapTrackingEnabled) {
            this.updateMapTracking();
        }
    }

    private updateMarkerStatus(): void {
        // Update the UI to show the marker status
        const statusElement = document.getElementById('marker-status');
        if (statusElement && this.markerLocation) {
            statusElement.textContent = `Marker anchored at (${this.markerLocation.x}, ${this.markerLocation.y}). Press the button to confirm or ESC to cancel.`;
        }
    }

    private stopDragTracking(): void {
        // Clear the drag interval
        if (this.dragInterval) {
            clearInterval(this.dragInterval);
            this.dragInterval = null;
        }
        
        // Reset the dragging state
        this.isDraggingMarker = false;
        
        // Update the UI
        const placeMarkerButton = document.getElementById('place-marker-button');
        if (placeMarkerButton) {
            placeMarkerButton.textContent = 'Place Marker';
            placeMarkerButton.classList.remove('active');
        }
    }

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
            
            // Update helper windows with the anchor point
            this.updateHelperWindows();
            
            // Start the map preview update interval
            this.startMapPreviewInterval();
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
            
            // Stop the map preview update interval
            this.stopMapPreviewInterval();
        }
    }

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
        const gridMessage = {
            type: 'grid-sync',
            gridSquares: this.gridSquares
        };
        
        // Send map size to all potential helper windows
        const sizeMessage = {
            type: 'map-size',
            size: this.mapSize
        };
        
        windows.forEach(w => {
            try {
                // Send map size first so the helper window can resize properly
                w.postMessage(sizeMessage, '*');
                
                // Then send grid state
                w.postMessage(gridMessage, '*');
                
                // Also send the anchor point if available
                if (this.markerLocation) {
                    w.postMessage({
                        type: 'anchor-update',
                        x: this.markerLocation.x,
                        y: this.markerLocation.y,
                        xOffset: this.xOffset,
                        yOffset: this.yOffset,
                        outlineWidth: this.outlineWidth,
                        outlineHeight: this.outlineHeight
                    }, '*');
                }
            } catch (e) {
                console.warn('Failed to send grid state to helper window:', e);
            }
        });
        
        // Also broadcast to any opener windows
        if (window.opener) {
            try {
                // Send map size first
                window.opener.postMessage(sizeMessage, '*');
                
                // Then send grid state
                window.opener.postMessage(gridMessage, '*');
                
                // Also send the anchor point if available
                if (this.markerLocation) {
                    window.opener.postMessage({
                        type: 'anchor-update',
                        x: this.markerLocation.x,
                        y: this.markerLocation.y,
                        xOffset: this.xOffset,
                        yOffset: this.yOffset,
                        outlineWidth: this.outlineWidth,
                        outlineHeight: this.outlineHeight
                    }, '*');
                }
            } catch (e) {
                // Ignore cross-origin errors
            }
        }
    }

    private openHelperWindow(): void {
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
                    
                    console.log('Opened helper window using Alt1 protocol');
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
                            console.log('Opened helper window using regular window.open as last resort');
                            
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
                console.log('Opened helper window using regular window.open (Alt1 not detected)');
                
                // Send current grid state to the helper window
                setTimeout(() => {
                    this.syncGridWithHelper();
                }, 1000);
            }
            
            // Set up a listener for messages from the helper window
            window.addEventListener('message', this.handleHelperMessage.bind(this));
            
        } catch (error) {
            console.error('Error opening helper window:', error);
            alert('Failed to open helper window. Please check the console for details.');
        }
    }

    // Methods referenced in linter errors
    private preloadKeyImages(): void {}
    private createGridClickInfoElement(): HTMLElement { return document.createElement('div'); }
    private createMapTabInterface(): void {}
    private setupMapCanvas(): void {}
    private startTextScanning(): void {}
    private stopTextScanning(): void {}
    private drawMapOutline(): void {}
    private updateMapCanvas(): void {}
    private cancelMarkerPlacement(): void {}
    private hideIconDropdown(): void {}

    private setupMapPreviewCanvas(): void {
        // Get the map preview canvas
        this.mapPreviewCanvas = document.getElementById('map-preview-canvas') as HTMLCanvasElement;
        
        if (this.mapPreviewCanvas) {
            this.mapPreviewContext = this.mapPreviewCanvas.getContext('2d');
            
            // Set initial size based on map size
            this.updateMapPreviewCanvasSize();
        }
    }
    
    private updateMapPreviewCanvasSize(): void {
        if (!this.mapPreviewCanvas) return;
        
        // Get the map size
        const mapSize = MAP_SIZES[this.mapSize];
        
        // Update canvas dimensions
        this.mapPreviewCanvas.width = mapSize.width;
        this.mapPreviewCanvas.height = mapSize.height;
        
        // Clear the canvas
        if (this.mapPreviewContext) {
            this.mapPreviewContext.clearRect(0, 0, this.mapPreviewCanvas.width, this.mapPreviewCanvas.height);
            this.mapPreviewContext.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.mapPreviewContext.fillRect(0, 0, this.mapPreviewCanvas.width, this.mapPreviewCanvas.height);
            
            // Draw text indicating no preview is available
            this.mapPreviewContext.fillStyle = 'white';
            this.mapPreviewContext.font = '12px Arial';
            this.mapPreviewContext.textAlign = 'center';
            this.mapPreviewContext.fillText('No preview available', this.mapPreviewCanvas.width / 2, this.mapPreviewCanvas.height / 2);
        }
    }

    private updateMapPreview(): void {
        if (!this.mapPreviewCanvas || !this.mapPreviewContext || !this.markerLocation) {
            return;
        }
        
        // Check if Alt1 is available
        if (!window.alt1) {
            if (typeof this.drawFallbackPreview === 'function') {
                this.drawFallbackPreview('Alt1 not available');
            } else {
                console.error('Alt1 not available and drawFallbackPreview method not found');
            }
            return;
        }
        
        // Get the map size
        const mapSize = MAP_SIZES[this.mapSize];
        
        // Calculate the capture area based on marker location and offsets
        // Adjust to capture to the left and below the anchor point
        const captureWidth = mapSize.width + this.outlineWidth;
        const captureHeight = mapSize.height + this.outlineHeight;
        
        // Calculate the top-left corner of the capture area
        // Subtract the width from the x-coordinate to capture to the left
        const captureX = this.markerLocation.x - captureWidth + this.xOffset;
        const captureY = this.markerLocation.y + this.yOffset;
        
        // Ensure capture dimensions are valid
        if (captureWidth <= 0 || captureHeight <= 0) {
            if (typeof this.drawFallbackPreview === 'function') {
                this.drawFallbackPreview('Invalid capture dimensions');
            } else {
                console.error('Invalid capture dimensions and drawFallbackPreview method not found');
            }
            return;
        }
        
        try {
            // Use captureHoldFullRs which is the recommended method
            const fullCapture = a1lib.captureHoldFullRs();
            
            if (fullCapture) {
                try {
                    // Extract the region we need from the full capture
                    const captureResult = fullCapture.toData(captureX, captureY, captureWidth, captureHeight);
                    
                    if (captureResult) {
                        // Clear the canvas
                        this.mapPreviewContext.clearRect(0, 0, this.mapPreviewCanvas.width, this.mapPreviewCanvas.height);
                        
                        // Draw the captured image directly to the canvas
                        this.mapPreviewContext.putImageData(captureResult, 0, 0);
                        
                        // Draw grid lines
                        if (typeof this.drawGridOnPreview === 'function') {
                            this.drawGridOnPreview();
                        }
                        
                        // Draw capture info for debugging
                        this.mapPreviewContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
                        this.mapPreviewContext.fillRect(0, this.mapPreviewCanvas.height - 40, this.mapPreviewCanvas.width, 40);
                        this.mapPreviewContext.fillStyle = 'white';
                        this.mapPreviewContext.font = '10px Arial';
                        this.mapPreviewContext.textAlign = 'left';
                        this.mapPreviewContext.fillText(`Capture: (${captureX}, ${captureY}, ${captureWidth}x${captureHeight})`, 5, this.mapPreviewCanvas.height - 25);
                        this.mapPreviewContext.fillText(`Anchor: (${this.markerLocation.x}, ${this.markerLocation.y}) [Left & Below]`, 5, this.mapPreviewCanvas.height - 10);
                    } else {
                        // Draw fallback message if capture failed
                        if (typeof this.drawFallbackPreview === 'function') {
                            this.drawFallbackPreview('Failed to extract map area from capture');
                        } else {
                            console.error('Failed to extract map area from capture and drawFallbackPreview method not found');
                        }
                    }
                } catch (e) {
                    console.error('Error extracting region from full capture:', e);
                    if (typeof this.drawFallbackPreview === 'function') {
                        this.drawFallbackPreview('Error extracting map area');
                    } else {
                        console.error('Error extracting map area and drawFallbackPreview method not found');
                    }
                }
            } else {
                // Draw fallback message if capture failed
                if (typeof this.drawFallbackPreview === 'function') {
                    this.drawFallbackPreview('Failed to capture game screen');
                } else {
                    console.error('Failed to capture game screen and drawFallbackPreview method not found');
                }
            }
        } catch (e) {
            console.error('Failed to capture map preview:', e);
            if (typeof this.drawFallbackPreview === 'function') {
                this.drawFallbackPreview('Error capturing map area');
            } else {
                console.error('Error capturing map area and drawFallbackPreview method not found');
            }
        }
    }
    
    private drawGridOnPreview(): void {
        if (!this.mapPreviewCanvas || !this.mapPreviewContext) return;
        
        const width = this.mapPreviewCanvas.width;
        const height = this.mapPreviewCanvas.height;
        
        // Get grid dimensions
        const gridCols = this.mapSize === 'small' ? 4 : 8;
        const gridRows = this.mapSize === 'small' ? 4 : (this.mapSize === 'medium' ? 8 : 8);
        
        const cellWidth = width / gridCols;
        const cellHeight = height / gridRows;
        
        // Draw grid lines
        this.mapPreviewContext.strokeStyle = 'rgba(200, 200, 50, 0.8)';
        this.mapPreviewContext.lineWidth = 1;
        
        // Draw vertical grid lines
        for (let i = 1; i < gridCols; i++) {
            const lineX = Math.floor(cellWidth * i);
            this.mapPreviewContext.beginPath();
            this.mapPreviewContext.moveTo(lineX, 0);
            this.mapPreviewContext.lineTo(lineX, height);
            this.mapPreviewContext.stroke();
        }
        
        // Draw horizontal grid lines
        for (let i = 1; i < gridRows; i++) {
            const lineY = Math.floor(cellHeight * i);
            this.mapPreviewContext.beginPath();
            this.mapPreviewContext.moveTo(0, lineY);
            this.mapPreviewContext.lineTo(width, lineY);
            this.mapPreviewContext.stroke();
        }
        
        // Draw the map outline
        this.mapPreviewContext.strokeStyle = 'white';
        this.mapPreviewContext.lineWidth = 1;
        this.mapPreviewContext.strokeRect(0, 0, width, height);
        
        // Draw map size info
        this.mapPreviewContext.fillStyle = 'white';
        this.mapPreviewContext.font = '10px Arial';
        this.mapPreviewContext.textAlign = 'left';
        this.mapPreviewContext.fillText(`${this.mapSize.toUpperCase()} MAP (${width}x${height})`, 5, 10);
    }
    
    private drawFallbackPreview(message: string): void {
        if (!this.mapPreviewCanvas || !this.mapPreviewContext) return;
        
        // Clear the canvas
        this.mapPreviewContext.clearRect(0, 0, this.mapPreviewCanvas.width, this.mapPreviewCanvas.height);
        this.mapPreviewContext.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.mapPreviewContext.fillRect(0, 0, this.mapPreviewCanvas.width, this.mapPreviewCanvas.height);
        
        // Draw text indicating no preview is available
        this.mapPreviewContext.fillStyle = 'white';
        this.mapPreviewContext.font = '12px Arial';
        this.mapPreviewContext.textAlign = 'center';
        this.mapPreviewContext.fillText(message, this.mapPreviewCanvas.width / 2, this.mapPreviewCanvas.height / 2);
    }
    
    private startMapPreviewInterval(): void {
        // Stop any existing interval
        this.stopMapPreviewInterval();
        
        // Update the preview immediately
        this.updateMapPreview();
        
        // Start a new interval to update the preview
        this.mapPreviewInterval = window.setInterval(() => {
            this.updateMapPreview();
        }, 500); // Update every 500ms
    }
    
    private stopMapPreviewInterval(): void {
        if (this.mapPreviewInterval) {
            window.clearInterval(this.mapPreviewInterval);
            this.mapPreviewInterval = null;
        }
    }
    
    // Cleanup method to be called when the application is closed
    public cleanup(): void {
        // Stop the text scanning
        this.stopTextScanning();
        
        // Stop the map preview interval
        this.stopMapPreviewInterval();
        
        // Stop the map tracking interval if it exists
        if (this.mapTrackingInterval) {
            window.clearInterval(this.mapTrackingInterval);
            this.mapTrackingInterval = null;
        }
        
        // Stop the drag tracking interval
        this.stopDragTracking();
        
        // Terminate the door text reader
        this.doorTextReader.terminate();
        
        console.log('DungeoneeringGateEngine cleaned up');
    }

    private updateHelperWindows(): void {
        if (!this.markerLocation) return;
        
        // Create the messages
        const sizeMessage = {
            type: 'map-size',
            size: this.mapSize
        };
        
        const anchorMessage = {
            type: 'anchor-update',
            x: this.markerLocation.x,
            y: this.markerLocation.y,
            xOffset: this.xOffset,
            yOffset: this.yOffset,
            outlineWidth: this.outlineWidth,
            outlineHeight: this.outlineHeight
        };
        
        // Note: Since we're only opening helper windows in Alt1 now,
        // this broadcast mechanism is mainly for backward compatibility
        // and to ensure messages reach the helper window regardless of how it was opened.
        
        // Broadcast to all potential helper windows
        for (let i = 0; i < window.frames.length; i++) {
            try {
                if (window.frames[i].location.href.includes('helper.html')) {
                    // Send map size first
                    window.frames[i].postMessage(sizeMessage, '*');
                    
                    // Then send anchor update
                    window.frames[i].postMessage(anchorMessage, '*');
                }
            } catch (e) {
                // Ignore cross-origin errors
            }
        }
        
        // Also broadcast to any opener windows
        if (window.opener) {
            try {
                // Send map size first
                window.opener.postMessage(sizeMessage, '*');
                
                // Then send anchor update
                window.opener.postMessage(anchorMessage, '*');
            } catch (e) {
                // Ignore cross-origin errors
            }
        }
        
        // Log that we've updated the helper windows
        console.log('Updated helper windows with new anchor point:', this.markerLocation);
    }
}

// Create and export the app instance
const app = new DungeoneeringGateEngine();
export default app;

// Make it available globally
if (typeof window !== 'undefined') {
    window.DungeoneeringGateEngine = app;
} 