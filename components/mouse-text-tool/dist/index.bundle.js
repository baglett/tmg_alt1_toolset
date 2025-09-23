(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return require("sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("electron/common"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["sharp", "canvas", "electron/common"], factory);
	else if(typeof exports === 'object')
		exports["DoorTextReader"] = factory((function webpackLoadOptionalExternalModule() { try { return require("sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("electron/common"); } catch(e) {} }()));
	else
		root["DoorTextReader"] = factory(root["sharp"], root["canvas"], root["electron/common"]);
})(self, (__WEBPACK_EXTERNAL_MODULE_sharp__, __WEBPACK_EXTERNAL_MODULE_canvas__, __WEBPACK_EXTERNAL_MODULE_electron_common__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt1 */ "../../../node_modules/alt1/dist/base/index.js");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tesseract_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tesseract.js */ "../../../node_modules/tesseract.js/src/index.js");
/* harmony import */ var tesseract_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tesseract_js__WEBPACK_IMPORTED_MODULE_1__);
// Import required libraries


// Helper function to get mouse position from Alt1
function getAlt1MousePosition() {
    if (!window.alt1)
        return null;
    const pos = window.alt1.mousePosition;
    if (pos === -1)
        return null;
    return {
        x: pos >>> 16,
        y: pos & 0xFFFF
    };
}
class DoorTextReader {
    constructor() {
        this.isReading = false;
        this.worker = null;
        this.lastMousePosition = { x: 0, y: 0 };
        this.showPreviewBox = true;
        this.mouseTrackingInterval = null;
        this.overlayGroup = 'door_text_reader_overlay';
        this.lastCaptureTime = 0;
        this.captureUpdateInterval = 250; // Milliseconds between capture updates
        // Add a property to store the last recognized text
        this.lastRecognizedText = '';
        // Text box detection settings
        this.enableTextBoxDetection = true;
        this.borderColorThreshold = 20;
        this.cropMargin = 2;
        this.showDebugOverlay = false;
        // Capture dimensions
        this.captureWidth = 250;
        this.captureHeight = 35;
        this.captureYOffset = 30;
        // Initialize viewport canvas
        this.viewportCanvas = document.getElementById('previewCanvas');
        if (!this.viewportCanvas) {
            throw new Error('Preview canvas not found');
        }
        this.viewportCtx = this.viewportCanvas.getContext('2d');
        this.viewportCtx.imageSmoothingEnabled = false;
        // Initialize cropped canvas
        this.croppedCanvas = document.getElementById('croppedCanvas');
        if (!this.croppedCanvas) {
            throw new Error('Cropped canvas not found');
        }
        this.croppedCtx = this.croppedCanvas.getContext('2d');
        this.croppedCtx.imageSmoothingEnabled = false;
        // Initialize checkbox state
        const showPreviewCheckbox = document.getElementById('showPreviewBox');
        this.showPreviewBox = showPreviewCheckbox.checked;
        showPreviewCheckbox.addEventListener('change', (e) => {
            this.showPreviewBox = e.target.checked;
            if (this.showPreviewBox) {
                this.drawPreviewRect();
                // Also update the overlay in the game
                if (window.alt1) {
                    try {
                        this.updateGameOverlay();
                    }
                    catch (error) {
                        console.warn('Failed to update game overlay:', error);
                    }
                }
            }
            else {
                this.viewportCtx.clearRect(0, 0, this.viewportCanvas.width, this.viewportCanvas.height);
                // Clear the overlay in the game
                if (window.alt1) {
                    try {
                        window.alt1.overLayClearGroup(this.overlayGroup);
                    }
                    catch (error) {
                        console.warn('Failed to clear overlay group:', error);
                    }
                }
            }
        });
        // Sync the other checkbox
        const enablePreviewCheckbox = document.getElementById('enablePreviewBox');
        if (enablePreviewCheckbox) {
            enablePreviewCheckbox.checked = this.showPreviewBox;
            enablePreviewCheckbox.addEventListener('change', (e) => {
                this.showPreviewBox = e.target.checked;
                showPreviewCheckbox.checked = this.showPreviewBox;
                // Trigger the same behavior as the main checkbox
                if (this.showPreviewBox) {
                    this.drawPreviewRect();
                    if (window.alt1) {
                        try {
                            this.updateGameOverlay();
                        }
                        catch (error) {
                            console.warn('Failed to update game overlay:', error);
                        }
                    }
                }
                else {
                    this.viewportCtx.clearRect(0, 0, this.viewportCanvas.width, this.viewportCanvas.height);
                    if (window.alt1) {
                        try {
                            window.alt1.overLayClearGroup(this.overlayGroup);
                        }
                        catch (error) {
                            console.warn('Failed to clear overlay group:', error);
                        }
                    }
                }
            });
        }
        // Initialize text box detection settings
        const enableTextBoxDetectionCheckbox = document.getElementById('enableTextBoxDetection');
        this.enableTextBoxDetection = enableTextBoxDetectionCheckbox.checked;
        enableTextBoxDetectionCheckbox.addEventListener('change', (e) => {
            this.enableTextBoxDetection = e.target.checked;
        });
        const borderColorThresholdSlider = document.getElementById('borderColorThreshold');
        this.borderColorThreshold = parseInt(borderColorThresholdSlider.value);
        borderColorThresholdSlider.addEventListener('input', (e) => {
            this.borderColorThreshold = parseInt(e.target.value);
            const valueDisplay = document.getElementById('borderColorThresholdValue');
            if (valueDisplay) {
                valueDisplay.textContent = this.borderColorThreshold.toString();
            }
        });
        const cropMarginSlider = document.getElementById('cropMargin');
        this.cropMargin = parseInt(cropMarginSlider.value);
        cropMarginSlider.addEventListener('input', (e) => {
            this.cropMargin = parseInt(e.target.value);
            const valueDisplay = document.getElementById('cropMarginValue');
            if (valueDisplay) {
                valueDisplay.textContent = this.cropMargin.toString();
            }
        });
        const showDebugOverlayCheckbox = document.getElementById('showDebugOverlay');
        this.showDebugOverlay = showDebugOverlayCheckbox.checked;
        showDebugOverlayCheckbox.addEventListener('change', (e) => {
            this.showDebugOverlay = e.target.checked;
        });
        // Initialize Tesseract worker
        this.initWorker();
        // Start tracking mouse position in the RuneScape window
        this.startMouseTracking();
    }
    startMouseTracking() {
        const mousePositionElement = document.getElementById('mousePosition');
        const captureRegionElement = document.getElementById('captureRegion');
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
                    }
                    catch (error) {
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
    updateGameOverlay() {
        if (!window.alt1 || !this.showPreviewBox)
            return;
        try {
            // Only show overlay when RS is active
            if (!window.alt1.rsActive) {
                try {
                    window.alt1.overLayClearGroup(this.overlayGroup);
                }
                catch (error) {
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
            const greenColor = alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(0, 255, 0, 255); // Bright green
            // Draw the rectangle with a 2px border
            // Note: The duration is set to 2000ms (2 seconds) to ensure it stays visible
            // between updates which happen every captureUpdateInterval ms
            const success = window.alt1.overLayRect(greenColor, region.x, region.y, region.width, region.height, 2000, // Duration in ms (2 seconds)
            2 // Thickness in pixels
            );
            // Force refresh the overlay group
            window.alt1.overLayRefreshGroup(this.overlayGroup);
            if (!success) {
                console.warn('Failed to draw overlay rectangle');
            }
        }
        catch (error) {
            console.warn('Overlay permission not available:', error);
            // We'll just continue without the overlay
        }
    }
    // Calculate the capture region based on mouse position
    getCaptureRegion() {
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
    drawPreviewRect() {
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
    async initWorker() {
        try {
            this.worker = await (0,tesseract_js__WEBPACK_IMPORTED_MODULE_1__.createWorker)({
                workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/worker.min.js',
                langPath: 'https://tessdata.projectnaptha.com/4.0.0',
                logger: m => console.debug('Tesseract:', m),
                errorHandler: err => console.error('Tesseract Error:', err)
            });
            await this.worker.loadLanguage('eng');
            await this.worker.initialize('eng');
            // Set basic parameters using the typed interface
            // Keep it simple - just set the page segmentation mode and character whitelist
            await this.worker.setParameters({
                tessedit_pageseg_mode: tesseract_js__WEBPACK_IMPORTED_MODULE_1__.PSM.SINGLE_LINE, // Explicitly set to SINGLE_LINE mode for game UI text
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 \'"-:,.!?()[]{}', // Special characters for game text
            });
            console.log('Tesseract worker initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize Tesseract worker:', error);
        }
    }
    async readText() {
        if (!this.isReading || !this.worker || !window.alt1)
            return;
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
            let imgData = null;
            try {
                // Use a1lib.captureHoldFullRs which is the recommended method
                const img = alt1__WEBPACK_IMPORTED_MODULE_0__.captureHoldFullRs();
                if (img) {
                    imgData = img.toData(region.x, region.y, region.width, region.height);
                }
            }
            catch (error) {
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
            const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false });
            // Draw the image data to the offscreen canvas
            offscreenCtx.putImageData(imgData, 0, 0);
            // Update the original capture canvas
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
                // Draw a green border around the original capture
                this.viewportCtx.strokeStyle = '#00FF00';
                this.viewportCtx.lineWidth = 2;
                this.viewportCtx.strokeRect(0, 0, this.viewportCanvas.width, this.viewportCanvas.height);
            });
            // Detect and crop to the text box
            const croppedCanvas = this.detectAndCropTextBox(offscreenCanvas);
            // Update the cropped canvas
            // Only update the cropped canvas dimensions if they've changed
            if (this.croppedCanvas.width !== croppedCanvas.width || this.croppedCanvas.height !== croppedCanvas.height) {
                this.croppedCanvas.width = croppedCanvas.width;
                this.croppedCanvas.height = croppedCanvas.height;
            }
            // Use requestAnimationFrame for smoother visual updates
            requestAnimationFrame(() => {
                // Clear and draw the image from the cropped canvas to the cropped canvas display
                this.croppedCtx.clearRect(0, 0, this.croppedCanvas.width, this.croppedCanvas.height);
                this.croppedCtx.drawImage(croppedCanvas, 0, 0);
            });
            // Perform OCR on the cropped canvas to avoid any visual artifacts
            const result = await this.worker.recognize(croppedCanvas);
            const recognizedText = result.data.text.trim();
            // Store the recognized text
            this.lastRecognizedText = recognizedText;
            // Update the output with the recognized text
            this.callback?.(recognizedText);
            // Update the overlay in the game
            if (this.showPreviewBox) {
                try {
                    this.updateGameOverlay();
                }
                catch (error) {
                    console.warn('Failed to update game overlay:', error);
                }
            }
        }
        catch (error) {
            console.error('Error reading text:', error);
            this.callback?.('Error reading text');
        }
        if (this.isReading) {
            // Use setTimeout with a consistent interval for smoother updates
            setTimeout(() => this.readText(), this.captureUpdateInterval);
        }
    }
    // Detect and crop to the black box border around RuneScape hover text
    detectAndCropTextBox(sourceCanvas) {
        // If text box detection is disabled, return the original canvas
        if (!this.enableTextBoxDetection) {
            return sourceCanvas;
        }
        const ctx = sourceCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        const data = imageData.data;
        // Find the bounding box of the black border
        let left = sourceCanvas.width;
        let right = 0;
        let top = sourceCanvas.height;
        let bottom = 0;
        let foundBorder = false;
        // Create a debug canvas if debug overlay is enabled
        let debugCanvas = document.createElement('canvas');
        let debugCtx = null;
        if (this.showDebugOverlay) {
            debugCanvas.width = sourceCanvas.width;
            debugCanvas.height = sourceCanvas.height;
            debugCtx = debugCanvas.getContext('2d');
            debugCtx.drawImage(sourceCanvas, 0, 0);
        }
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
                    // Mark dark pixels in debug view only
                    if (this.showDebugOverlay && debugCtx) {
                        debugCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                        debugCtx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }
        // Visualize row and column counts in debug view only
        if (this.showDebugOverlay && debugCtx) {
            this.visualizePixelCounts(debugCtx, rowCounts, colCounts, sourceCanvas.width, sourceCanvas.height);
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
            console.log(`Border detected: (${left},${top}) to (${right},${bottom}), size: ${right - left + 1}x${bottom - top + 1}`);
            // Create a new canvas for the cropped image
            const croppedCanvas = document.createElement('canvas');
            const width = right - left + 1 + (this.cropMargin * 2);
            const height = bottom - top + 1 + (this.cropMargin * 2);
            croppedCanvas.width = width;
            croppedCanvas.height = height;
            const croppedCtx = croppedCanvas.getContext('2d');
            // Draw the cropped region from the original source canvas (no color manipulation)
            croppedCtx.drawImage(sourceCanvas, // Always use the original source canvas
            Math.max(0, left - this.cropMargin), Math.max(0, top - this.cropMargin), Math.min(sourceCanvas.width - left + this.cropMargin, width), Math.min(sourceCanvas.height - top + this.cropMargin, height), 0, 0, width, height);
            // Draw debug overlay if enabled (only on debug canvas)
            if (this.showDebugOverlay) {
                // Draw a red border around the detected text box
                croppedCtx.strokeStyle = '#FF0000';
                croppedCtx.lineWidth = 1;
                croppedCtx.strokeRect(this.cropMargin, this.cropMargin, right - left + 1, bottom - top + 1);
                // Add text showing the dimensions
                croppedCtx.fillStyle = '#FFFFFF';
                croppedCtx.font = '10px Arial';
                croppedCtx.fillText(`${right - left + 1}x${bottom - top + 1}`, this.cropMargin, this.cropMargin - 2);
            }
            return croppedCanvas;
        }
        else {
            console.log('No border detected or invalid border dimensions');
            // If no border was found but debug is enabled, return the debug canvas
            if (this.showDebugOverlay && debugCtx) {
                // Add text showing no border was found
                debugCtx.fillStyle = '#FF0000';
                debugCtx.font = '14px Arial';
                debugCtx.fillText('No border detected', 10, 20);
                return debugCanvas;
            }
            // If no border was found, return the original canvas
            return sourceCanvas;
        }
    }
    // Helper method to visualize pixel counts for debugging
    visualizePixelCounts(ctx, rowCounts, colCounts, width, height) {
        const maxRowCount = Math.max(...rowCounts);
        const maxColCount = Math.max(...colCounts);
        // Draw row counts on the right side
        if (maxRowCount > 0) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            for (let y = 0; y < height; y++) {
                const barWidth = (rowCounts[y] / maxRowCount) * 20; // Max bar width of 20px
                if (barWidth > 0) {
                    ctx.fillRect(width - barWidth, y, barWidth, 1);
                }
            }
        }
        // Draw column counts at the bottom
        if (maxColCount > 0) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            for (let x = 0; x < width; x++) {
                const barHeight = (colCounts[x] / maxColCount) * 20; // Max bar height of 20px
                if (barHeight > 0) {
                    ctx.fillRect(x, height - barHeight, 1, barHeight);
                }
            }
        }
    }
    startReading(callback) {
        this.callback = callback;
        this.isReading = true;
        this.readText();
    }
    stopReading() {
        this.isReading = false;
        this.drawPreviewRect(); // Restore the preview rectangle
        // Clear the overlay in the game
        if (window.alt1) {
            try {
                window.alt1.overLayClearGroup(this.overlayGroup);
            }
            catch (error) {
                console.warn('Failed to clear overlay group:', error);
            }
        }
    }
    async terminate() {
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
            }
            catch (error) {
                console.warn('Failed to clear overlay group:', error);
            }
        }
    }
    // Add a method to get the last recognized text
    getLastText() {
        return this.lastRecognizedText;
    }
}
// Initialize the app
async function initializeApp() {
    try {
        const output = document.getElementById('output');
        const toggleBtn = document.getElementById('toggleScan');
        const checkbox = document.getElementById('showPreviewBox');
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
        }
        else {
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
            }
            else {
                // Start scanning
                reader.startReading((text) => {
                    output.textContent = text || "No text detected";
                });
                toggleBtn.textContent = "Stop Scanning";
                toggleBtn.classList.add("scanning");
            }
        });
        console.log("App initialized"); // Debug log
    }
    catch (error) {
        console.error('Failed to initialize app:', error);
    }
}
// Initialize when the document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    initializeApp();
}
// Export for global use
if (typeof window !== 'undefined') {
    window.DoorTextReader = DoorTextReader;
}


/***/ }),

/***/ "canvas":
/*!*************************!*\
  !*** external "canvas" ***!
  \*************************/
/***/ ((module) => {

if(typeof __WEBPACK_EXTERNAL_MODULE_canvas__ === 'undefined') { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_canvas__;

/***/ }),

/***/ "electron/common":
/*!**********************************!*\
  !*** external "electron/common" ***!
  \**********************************/
/***/ ((module) => {

if(typeof __WEBPACK_EXTERNAL_MODULE_electron_common__ === 'undefined') { var e = new Error("Cannot find module 'electron/common'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_electron_common__;

/***/ }),

/***/ "sharp":
/*!************************!*\
  !*** external "sharp" ***!
  \************************/
/***/ ((module) => {

if(typeof __WEBPACK_EXTERNAL_MODULE_sharp__ === 'undefined') { var e = new Error("Cannot find module 'sharp'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_sharp__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkDoorTextReader"] = self["webpackChunkDoorTextReader"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_tesseract_js_src_index_js-node_modules_alt1_dist_base_index_js"], () => (__webpack_require__("./index.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});