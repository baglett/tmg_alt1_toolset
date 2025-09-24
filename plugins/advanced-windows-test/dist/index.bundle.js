(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return require("sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("electron/common"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["sharp", "canvas", "electron/common"], factory);
	else if(typeof exports === 'object')
		exports["AdvancedWindowsTest"] = factory((function webpackLoadOptionalExternalModule() { try { return require("sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("electron/common"); } catch(e) {} }()));
	else
		root["AdvancedWindowsTest"] = factory(root["sharp"], root["canvas"], root["electron/common"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_sharp__, __WEBPACK_EXTERNAL_MODULE_canvas__, __WEBPACK_EXTERNAL_MODULE_electron_common__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../../components/advanced-overlay-windows/dist/index.js":
/*!******************************************************************!*\
  !*** ../../../components/advanced-overlay-windows/dist/index.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(/*! alt1 */ "../../../node_modules/alt1/dist/base/index.js"));
	else // removed by dead control flow
{}
})(this, (__WEBPACK_EXTERNAL_MODULE_alt1__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./InteractionDetector.ts":
/*!********************************!*\
  !*** ./InteractionDetector.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_775__) => {

__nested_webpack_require_775__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_775__.d(__nested_webpack_exports__, {
/* harmony export */   InteractionDetector: () => (/* binding */ InteractionDetector)
/* harmony export */ });
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_775__(/*! alt1 */ "alt1");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_775__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Advanced interaction detection system using computer vision and mouse tracking
 * for detecting user interactions with overlay windows
 */
class InteractionDetector {
    constructor() {
        this.mouseTrackingInterval = null;
        this.lastMousePosition = { x: 0, y: 0 };
        this.clickDetectionRegions = new Map();
        this.eventCallbacks = new Map();
        this.isTracking = false;
        // Click detection settings
        this.clickDetectionSensitivity = 15; // pixels
        this.doubleClickThreshold = 300; // milliseconds
        this.lastClickTime = 0;
        this.lastClickPosition = { x: 0, y: 0 };
        this.setupMouseTracking();
    }
    /**
     * Start tracking interactions
     */
    startTracking() {
        if (this.isTracking)
            return;
        this.isTracking = true;
        this.setupMouseTracking();
        // Set up Alt1 event listeners for additional interaction detection
        if (typeof alt1__WEBPACK_IMPORTED_MODULE_0__.on === 'function') {
            alt1__WEBPACK_IMPORTED_MODULE_0__.on('alt1pressed', this.handleAlt1Pressed.bind(this));
        }
    }
    /**
     * Stop tracking interactions
     */
    stopTracking() {
        if (!this.isTracking)
            return;
        this.isTracking = false;
        if (this.mouseTrackingInterval) {
            clearInterval(this.mouseTrackingInterval);
            this.mouseTrackingInterval = null;
        }
    }
    /**
     * Register a window's interaction regions for click detection
     */
    registerWindow(windowId, regions) {
        this.clickDetectionRegions.set(windowId, regions);
    }
    /**
     * Unregister a window from interaction detection
     */
    unregisterWindow(windowId) {
        this.clickDetectionRegions.delete(windowId);
        this.eventCallbacks.delete(windowId);
    }
    /**
     * Set callback for window interaction events
     */
    onInteraction(windowId, callback) {
        this.eventCallbacks.set(windowId, callback);
    }
    /**
     * Setup mouse position tracking
     */
    setupMouseTracking() {
        if (this.mouseTrackingInterval) {
            clearInterval(this.mouseTrackingInterval);
        }
        // Track mouse position at 60fps for smooth interaction detection
        this.mouseTrackingInterval = window.setInterval(() => {
            if (!this.isTracking)
                return;
            const mousePos = this.getMousePosition();
            if (mousePos) {
                this.handleMouseMovement(mousePos);
            }
        }, 16); // ~60fps
    }
    /**
     * Get current mouse position from Alt1
     */
    getMousePosition() {
        if (!window.alt1)
            return null;
        const pos = window.alt1.mousePosition;
        if (!pos)
            return null;
        return {
            x: pos.x,
            y: pos.y
        };
    }
    /**
     * Handle mouse movement and detect interactions
     */
    handleMouseMovement(mousePos) {
        const previousPos = this.lastMousePosition;
        this.lastMousePosition = mousePos;
        // Detect rapid mouse movement that might indicate a click
        const movement = this.calculateDistance(previousPos, mousePos);
        // If mouse moved significantly and then stopped, might be a click
        if (movement > this.clickDetectionSensitivity) {
            this.checkForClicks(mousePos);
        }
        // Check for hover events
        this.checkForHovers(mousePos);
    }
    /**
     * Calculate distance between two points
     */
    calculateDistance(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Check if mouse position indicates a click on any registered window
     */
    checkForClicks(mousePos) {
        for (const [windowId, regions] of this.clickDetectionRegions) {
            for (const region of regions) {
                if (this.isPointInRect(mousePos, region)) {
                    this.handlePotentialClick(windowId, mousePos);
                    break;
                }
            }
        }
    }
    /**
     * Check for hover events on registered windows
     */
    checkForHovers(mousePos) {
        for (const [windowId, regions] of this.clickDetectionRegions) {
            let isHovering = false;
            for (const region of regions) {
                if (this.isPointInRect(mousePos, region)) {
                    isHovering = true;
                    this.emitInteractionEvent(windowId, {
                        type: 'hover',
                        position: mousePos,
                        windowId,
                        timestamp: Date.now()
                    });
                    break;
                }
            }
        }
    }
    /**
     * Handle potential click detection with debouncing
     */
    handlePotentialClick(windowId, position) {
        const now = Date.now();
        const timeSinceLastClick = now - this.lastClickTime;
        const distanceFromLastClick = this.calculateDistance(position, this.lastClickPosition);
        // Detect if this is likely a click (quick movement followed by stillness)
        if (timeSinceLastClick > 50 && distanceFromLastClick < this.clickDetectionSensitivity) {
            this.emitInteractionEvent(windowId, {
                type: 'click',
                position,
                windowId,
                timestamp: now
            });
            this.lastClickTime = now;
            this.lastClickPosition = position;
        }
    }
    /**
     * Handle Alt1 key press events
     */
    handleAlt1Pressed(event) {
        if (event.mouseRs) {
            const mousePos = { x: event.mouseRs.x, y: event.mouseRs.y };
            // Check if Alt1 key was pressed over any of our windows
            for (const [windowId, regions] of this.clickDetectionRegions) {
                for (const region of regions) {
                    if (this.isPointInRect(mousePos, region)) {
                        this.emitInteractionEvent(windowId, {
                            type: 'click',
                            position: mousePos,
                            windowId,
                            timestamp: Date.now()
                        });
                        return;
                    }
                }
            }
        }
    }
    /**
     * Check if a point is within a rectangle
     */
    isPointInRect(point, rect) {
        return point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height;
    }
    /**
     * Emit an interaction event to the appropriate window
     */
    emitInteractionEvent(windowId, event) {
        const callback = this.eventCallbacks.get(windowId);
        if (callback) {
            callback(event);
        }
    }
    /**
     * Add interaction region for a specific window
     */
    addInteractionRegion(windowId, region) {
        const existing = this.clickDetectionRegions.get(windowId) || [];
        existing.push(region);
        this.clickDetectionRegions.set(windowId, existing);
    }
    /**
     * Remove interaction region for a specific window
     */
    removeInteractionRegion(windowId, region) {
        const existing = this.clickDetectionRegions.get(windowId) || [];
        const filtered = existing.filter(r => !(r.x === region.x && r.y === region.y &&
            r.width === region.width && r.height === region.height));
        this.clickDetectionRegions.set(windowId, filtered);
    }
    /**
     * Get current mouse position (public interface)
     */
    getCurrentMousePosition() {
        return this.getMousePosition();
    }
    /**
     * Check if currently tracking
     */
    isCurrentlyTracking() {
        return this.isTracking;
    }
}


/***/ }),

/***/ "./OverlayWindow.ts":
/*!**************************!*\
  !*** ./OverlayWindow.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_9306__) => {

__nested_webpack_require_9306__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_9306__.d(__nested_webpack_exports__, {
/* harmony export */   OverlayWindow: () => (/* binding */ OverlayWindow)
/* harmony export */ });
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_9306__(/*! alt1 */ "alt1");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_9306__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Individual overlay window with advanced rendering and interaction capabilities
 *
 * IMPORTANT: Alt1 overlay limitations:
 * - Overlays are purely visual and cannot receive mouse events directly
 * - Interactions must be handled by the main Alt1 application window
 * - Drag, resize, and click functionality requires workarounds using:
 *   1. Main window buttons to control overlay windows
 *   2. Keyboard shortcuts for window management
 *   3. Context menus in the main Alt1 app window
 *
 * This implementation provides the visual rendering and state management,
 * but actual interaction must be triggered from the main application.
 */
class OverlayWindow {
    // Default theme - lazy initialization to avoid alt1lib import issues
    static getDefaultTheme() {
        return {
            titleBarColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(88, 101, 242, 255), // Discord purple (full opacity)
            titleBarTextColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(255, 255, 255, 255), // White text
            borderColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(88, 101, 242, 255), // Purple border
            backgroundColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(54, 57, 63, 255), // Dark background (full opacity for visibility)
            shadowColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(0, 0, 0, 128), // Dark shadow
            accentColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(114, 137, 218, 255) // Light purple accent
        };
    }
    constructor(config) {
        this.interactionRegions = [];
        this.contentRenderer = null;
        this.eventHandlers = new Map();
        // Interaction state
        this.dragStartPosition = null;
        this.resizeStartPosition = null;
        this.resizeStartSize = null;
        // Rendering constants
        this.titleBarHeight = 30;
        this.borderWidth = 2;
        this.shadowOffset = 3;
        this.shadowBlur = 5;
        this.state = {
            id: config.id || this.generateId(),
            config: { ...config },
            position: { x: config.x, y: config.y },
            size: { width: config.width, height: config.height },
            isVisible: true,
            isMinimized: false,
            isMaximized: false,
            isFocused: false,
            isDragging: false,
            isResizing: false,
            zIndex: config.zIndex || 1000,
            overlayGroup: `window_${config.id || this.generateId()}`,
            lastInteraction: Date.now()
        };
        this.theme = config.theme || OverlayWindow.getDefaultTheme();
        this.setupInteractionRegions();
    }
    /**
     * Get window ID
     */
    get id() {
        return this.state.id;
    }
    /**
     * Get window position
     */
    get position() {
        return { ...this.state.position };
    }
    /**
     * Get window size
     */
    get size() {
        return { ...this.state.size };
    }
    /**
     * Get window visibility
     */
    get isVisible() {
        return this.state.isVisible;
    }
    /**
     * Get window overlay group
     */
    get overlayGroup() {
        return this.state.overlayGroup;
    }
    /**
     * Set window position
     */
    setPosition(x, y) {
        this.state.position = { x: Math.round(x), y: Math.round(y) };
        this.setupInteractionRegions();
        this.emit('moved', this.state.position);
    }
    /**
     * Set window size
     */
    setSize(width, height) {
        this.state.size = { width: Math.round(width), height: Math.round(height) };
        this.setupInteractionRegions();
        this.emit('resized', this.state.size);
    }
    /**
     * Show window
     */
    show() {
        this.state.isVisible = true;
        this.render();
        this.emit('shown');
    }
    /**
     * Hide window
     */
    hide() {
        this.state.isVisible = false;
        this.clearOverlays();
        this.emit('hidden');
    }
    /**
     * Focus window
     */
    focus() {
        this.state.isFocused = true;
        this.state.lastInteraction = Date.now();
        this.render(); // Re-render with focus styling
        this.emit('focused');
    }
    /**
     * Blur window
     */
    blur() {
        this.state.isFocused = false;
        this.render(); // Re-render without focus styling
        this.emit('blurred');
    }
    /**
     * Minimize window
     */
    minimize() {
        this.state.isMinimized = true;
        this.state.isVisible = false;
        this.clearOverlays();
        this.emit('minimized');
    }
    /**
     * Restore window from minimized state
     */
    restore() {
        this.state.isMinimized = false;
        this.state.isMaximized = false;
        this.state.isVisible = true;
        this.render();
        this.emit('restored');
    }
    /**
     * Close window
     */
    close() {
        this.clearOverlays();
        this.emit('closed');
    }
    /**
     * Set content renderer function
     */
    setContentRenderer(renderer) {
        this.contentRenderer = renderer;
    }
    /**
     * Main render method
     */
    render() {
        if (!this.state.isVisible || !window.alt1)
            return;
        try {
            // Set overlay group
            window.alt1.overLaySetGroup(this.state.overlayGroup);
            // Clear previous overlays
            window.alt1.overLayClearGroup(this.state.overlayGroup);
            // Freeze group for smooth rendering
            window.alt1.overLayFreezeGroup(this.state.overlayGroup);
            // Render window components
            this.renderShadow();
            this.renderFrame();
            this.renderTitleBar();
            this.renderContent();
            this.renderControlButtons();
            // Unfreeze group to display overlays
            window.alt1.overLayContinueGroup(this.state.overlayGroup);
        }
        catch (error) {
            console.error('Error rendering overlay window:', error);
        }
    }
    /**
     * Handle interaction events
     */
    handleInteraction(event) {
        this.state.lastInteraction = Date.now();
        switch (event.type) {
            case 'click':
                this.handleClick(event.position);
                break;
            case 'drag':
                this.handleDrag(event.position);
                break;
            case 'hover':
                this.handleHover(event.position);
                break;
        }
    }
    /**
     * Add event listener
     */
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }
    /**
     * Remove event listener
     */
    off(event, handler) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    /**
     * Get interaction regions for this window
     */
    getInteractionRegions() {
        return this.interactionRegions.map(region => region.rect);
    }
    // Private methods
    generateId() {
        return 'overlay_window_' + Math.random().toString(36).substr(2, 9);
    }
    setupInteractionRegions() {
        const { x, y } = this.state.position;
        const { width, height } = this.state.size;
        this.interactionRegions = [
            // Title bar (for dragging)
            {
                rect: { x, y, width, height: this.titleBarHeight },
                type: 'titlebar',
                cursor: 'move'
            },
            // Content area
            {
                rect: { x, y: y + this.titleBarHeight, width, height: height - this.titleBarHeight },
                type: 'content',
                cursor: 'default'
            },
            // Resize handle (bottom-right corner)
            {
                rect: { x: x + width - 15, y: y + height - 15, width: 15, height: 15 },
                type: 'resize-handle',
                cursor: 'nw-resize'
            },
            // Close button
            {
                rect: { x: x + width - 25, y: y + 5, width: 20, height: 20 },
                type: 'close-button',
                cursor: 'pointer'
            }
        ];
    }
    renderShadow() {
        if (!window.alt1)
            return;
        const { x, y } = this.state.position;
        const { width, height } = this.state.size;
        // Multi-layer shadow for depth effect
        for (let i = 1; i <= this.shadowBlur; i++) {
            const alpha = Math.max(10, 40 - (i * 8));
            const shadowColor = alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(0, 0, 0, alpha);
            const offset = this.shadowOffset + i;
            alt1.overLayRect(shadowColor, x + offset, y + offset, width, height, 60000, 0);
        }
    }
    renderFrame() {
        if (!window.alt1)
            return;
        const { x, y } = this.state.position;
        const { width, height } = this.state.size;
        // Main window background - render twice for better opacity
        // First pass: solid background
        window.alt1.overLayRect(this.theme.backgroundColor, x, y, width, height, 60000, 0 // filled rectangle
        );
        // Border with focus highlight
        const borderColor = this.state.isFocused
            ? this.theme.accentColor
            : this.theme.borderColor;
        // Draw border as four separate rectangles for better visibility
        // Top border
        window.alt1.overLayRect(borderColor, x - this.borderWidth, y - this.borderWidth, width + (this.borderWidth * 2), this.borderWidth, 60000, 0);
        // Bottom border
        window.alt1.overLayRect(borderColor, x - this.borderWidth, y + height, width + (this.borderWidth * 2), this.borderWidth, 60000, 0);
        // Left border
        window.alt1.overLayRect(borderColor, x - this.borderWidth, y, this.borderWidth, height, 60000, 0);
        // Right border
        window.alt1.overLayRect(borderColor, x + width, y, this.borderWidth, height, 60000, 0);
    }
    renderTitleBar() {
        if (!window.alt1)
            return;
        const { x, y } = this.state.position;
        const { width } = this.state.size;
        // Title bar background
        window.alt1.overLayRect(this.theme.titleBarColor, x, y, width, this.titleBarHeight, 60000, 0);
        // Title text
        window.alt1.overLayText(this.state.config.title, this.theme.titleBarTextColor, 14, x + 10, y + 20, 60000);
    }
    renderContent() {
        if (this.contentRenderer) {
            this.contentRenderer(this);
        }
        else {
            this.renderDefaultContent();
        }
    }
    renderDefaultContent() {
        if (!window.alt1)
            return;
        const { x, y } = this.state.position;
        // Default content message
        window.alt1.overLayText(`Window Content (${this.state.config.contentType || 'default'})`, this.theme.titleBarTextColor, 12, x + 10, y + this.titleBarHeight + 20, 60000);
    }
    renderControlButtons() {
        if (!window.alt1)
            return;
        const { x, y } = this.state.position;
        const { width } = this.state.size;
        // Close button
        if (this.state.config.closable !== false) {
            const closeX = x + width - 25;
            const closeY = y + 5;
            // Close button background - full opacity for visibility
            window.alt1.overLayRect(alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(220, 53, 69, 255), // Red background with full opacity
            closeX, closeY, 20, 20, 60000, 0);
            // Close button X
            window.alt1.overLayText('×', alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(255, 255, 255, 255), 16, closeX + 6, closeY + 15, 60000);
        }
    }
    handleClick(position) {
        const region = this.getRegionAtPosition(position);
        switch (region?.type) {
            case 'titlebar':
                this.startDrag(position);
                break;
            case 'resize-handle':
                this.startResize(position);
                break;
            case 'close-button':
                this.close();
                break;
            case 'content':
                this.focus();
                break;
        }
    }
    handleDrag(position) {
        if (this.state.isDragging && this.dragStartPosition) {
            const deltaX = position.x - this.dragStartPosition.x;
            const deltaY = position.y - this.dragStartPosition.y;
            this.setPosition(this.state.position.x + deltaX, this.state.position.y + deltaY);
            this.dragStartPosition = position;
            this.render();
        }
        if (this.state.isResizing && this.resizeStartPosition && this.resizeStartSize) {
            const deltaX = position.x - this.resizeStartPosition.x;
            const deltaY = position.y - this.resizeStartPosition.y;
            const newWidth = Math.max(200, this.resizeStartSize.width + deltaX);
            const newHeight = Math.max(100, this.resizeStartSize.height + deltaY);
            this.setSize(newWidth, newHeight);
            this.render();
        }
    }
    handleHover(position) {
        // Could implement hover effects here
        // For now, just update last interaction time
        this.state.lastInteraction = Date.now();
    }
    startDrag(position) {
        if (!this.state.config.draggable)
            return;
        this.state.isDragging = true;
        this.dragStartPosition = position;
        this.focus();
    }
    startResize(position) {
        if (!this.state.config.resizable)
            return;
        this.state.isResizing = true;
        this.resizeStartPosition = position;
        this.resizeStartSize = { ...this.state.size };
        this.focus();
    }
    getRegionAtPosition(position) {
        for (const region of this.interactionRegions) {
            if (this.isPointInRect(position, region.rect)) {
                return region;
            }
        }
        return null;
    }
    isPointInRect(point, rect) {
        return point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height;
    }
    clearOverlays() {
        if (window.alt1) {
            window.alt1.overLayClearGroup(this.state.overlayGroup);
        }
    }
    emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                }
                catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
}


/***/ }),

/***/ "./OverlayWindowManager.ts":
/*!*********************************!*\
  !*** ./OverlayWindowManager.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_24783__) => {

__nested_webpack_require_24783__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_24783__.d(__nested_webpack_exports__, {
/* harmony export */   OverlayWindowManager: () => (/* binding */ OverlayWindowManager)
/* harmony export */ });
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_24783__(/*! alt1 */ "alt1");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_24783__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _OverlayWindow__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_24783__(/*! ./OverlayWindow */ "./OverlayWindow.ts");
/* harmony import */ var _InteractionDetector__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_24783__(/*! ./InteractionDetector */ "./InteractionDetector.ts");



/**
 * Advanced overlay window manager with computer vision interaction detection
 * and sophisticated window management capabilities for Alt1 applications
 */
class OverlayWindowManager {
    constructor() {
        this.windows = new Map();
        this.focusedWindowId = null;
        this.zIndexCounter = 1000;
        this.eventHandlers = {};
        this.globalEventHandlers = new Map();
        // Manager state
        this.isInitialized = false;
        this.updateInterval = null;
        this.updateFrequency = 16; // ~60fps updates
        this.interactionDetector = new _InteractionDetector__WEBPACK_IMPORTED_MODULE_2__.InteractionDetector();
        this.initialize();
    }
    /**
     * Initialize the window manager
     */
    initialize() {
        if (this.isInitialized)
            return;
        // Check Alt1 availability
        if (!window.alt1) {
            console.warn('Alt1 API not available - overlay windows will not function');
            return;
        }
        // Start interaction detection
        this.interactionDetector.startTracking();
        // Start update loop for smooth interactions
        this.startUpdateLoop();
        // Set up Alt1 event listeners
        this.setupAlt1Events();
        this.isInitialized = true;
        this.emit('manager-initialized');
        console.log('Advanced Overlay Window Manager initialized successfully');
    }
    /**
     * Create a new overlay window
     */
    createWindow(config) {
        // Generate ID if not provided
        if (!config.id) {
            config.id = this.generateWindowId();
        }
        // Assign z-index if not provided
        if (!config.zIndex) {
            config.zIndex = ++this.zIndexCounter;
        }
        // Set default values
        const windowConfig = {
            resizable: true,
            draggable: true,
            closable: true,
            ...config
        };
        // Create the window
        const window = new _OverlayWindow__WEBPACK_IMPORTED_MODULE_1__.OverlayWindow(windowConfig);
        // Register with manager
        this.windows.set(window.id, window);
        // Set up interaction detection for this window
        this.interactionDetector.registerWindow(window.id, window.getInteractionRegions());
        this.interactionDetector.onInteraction(window.id, (event) => {
            this.handleWindowInteraction(window.id, event);
        });
        // Set up window event handlers
        this.setupWindowEventHandlers(window);
        // Focus the new window
        this.focusWindow(window.id);
        // Render the window
        window.render();
        this.emit('window-created', { windowId: window.id, config: windowConfig });
        return window;
    }
    /**
     * Get a window by ID
     */
    getWindow(windowId) {
        return this.windows.get(windowId) || null;
    }
    /**
     * Get all windows
     */
    getAllWindows() {
        return Array.from(this.windows.values());
    }
    /**
     * Get focused window
     */
    getFocusedWindow() {
        return this.focusedWindowId ? this.getWindow(this.focusedWindowId) : null;
    }
    /**
     * Focus a specific window
     */
    focusWindow(windowId) {
        const window = this.getWindow(windowId);
        if (!window)
            return false;
        // Blur previously focused window
        if (this.focusedWindowId && this.focusedWindowId !== windowId) {
            const previousWindow = this.getWindow(this.focusedWindowId);
            if (previousWindow) {
                previousWindow.blur();
            }
        }
        // Focus the new window
        this.focusedWindowId = windowId;
        window.focus();
        // Bring to front
        this.bringToFront(windowId);
        this.emit('window-focused', { windowId });
        return true;
    }
    /**
     * Bring a window to the front
     */
    bringToFront(windowId) {
        const window = this.getWindow(windowId);
        if (!window)
            return false;
        // Assign highest z-index
        window['state'].zIndex = ++this.zIndexCounter;
        // Re-render to apply new z-index
        window.render();
        return true;
    }
    /**
     * Close a window
     */
    closeWindow(windowId) {
        const window = this.getWindow(windowId);
        if (!window)
            return false;
        // Clean up interaction detection
        this.interactionDetector.unregisterWindow(windowId);
        // Remove from manager
        this.windows.delete(windowId);
        // Clear focus if this was the focused window
        if (this.focusedWindowId === windowId) {
            this.focusedWindowId = null;
            // Focus another window if available
            const remainingWindows = Array.from(this.windows.values());
            if (remainingWindows.length > 0) {
                this.focusWindow(remainingWindows[0].id);
            }
        }
        // Close the window
        window.close();
        this.emit('window-closed', { windowId });
        return true;
    }
    /**
     * Close all windows
     */
    closeAllWindows() {
        const windowIds = Array.from(this.windows.keys());
        windowIds.forEach(id => this.closeWindow(id));
    }
    /**
     * Minimize a window
     */
    minimizeWindow(windowId) {
        const window = this.getWindow(windowId);
        if (!window)
            return false;
        window.minimize();
        this.emit('window-minimized', { windowId });
        return true;
    }
    /**
     * Restore a window
     */
    restoreWindow(windowId) {
        const window = this.getWindow(windowId);
        if (!window)
            return false;
        window.restore();
        this.focusWindow(windowId);
        this.emit('window-restored', { windowId });
        return true;
    }
    /**
     * Set global event handlers
     */
    setEventHandlers(handlers) {
        this.eventHandlers = { ...handlers };
    }
    /**
     * Add global event listener
     */
    on(event, handler) {
        if (!this.globalEventHandlers.has(event)) {
            this.globalEventHandlers.set(event, []);
        }
        this.globalEventHandlers.get(event).push(handler);
    }
    /**
     * Remove global event listener
     */
    off(event, handler) {
        const handlers = this.globalEventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    /**
     * Get current mouse position
     */
    getMousePosition() {
        return this.interactionDetector.getCurrentMousePosition();
    }
    /**
     * Destroy the window manager and clean up resources
     */
    destroy() {
        // Close all windows
        this.closeAllWindows();
        // Stop interaction detection
        this.interactionDetector.stopTracking();
        // Stop update loop
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isInitialized = false;
        this.emit('manager-destroyed');
        console.log('Advanced Overlay Window Manager destroyed');
    }
    // Private methods
    generateWindowId() {
        return 'window_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    }
    setupWindowEventHandlers(window) {
        // Set up event forwarding from window to manager
        window.on('moved', (position) => {
            // Update interaction regions when window moves
            this.interactionDetector.registerWindow(window.id, window.getInteractionRegions());
            if (this.eventHandlers.onMove) {
                this.eventHandlers.onMove(window.id, position);
            }
            this.emit('window-moved', { windowId: window.id, position });
        });
        window.on('resized', (size) => {
            // Update interaction regions when window resizes
            this.interactionDetector.registerWindow(window.id, window.getInteractionRegions());
            if (this.eventHandlers.onResize) {
                this.eventHandlers.onResize(window.id, size);
            }
            this.emit('window-resized', { windowId: window.id, size });
        });
        window.on('focused', () => {
            if (this.eventHandlers.onFocus) {
                this.eventHandlers.onFocus(window.id);
            }
        });
        window.on('blurred', () => {
            if (this.eventHandlers.onBlur) {
                this.eventHandlers.onBlur(window.id);
            }
        });
        window.on('closed', () => {
            if (this.eventHandlers.onClose) {
                this.eventHandlers.onClose(window.id);
            }
        });
        window.on('minimized', () => {
            if (this.eventHandlers.onMinimize) {
                this.eventHandlers.onMinimize(window.id);
            }
        });
    }
    handleWindowInteraction(windowId, event) {
        const window = this.getWindow(windowId);
        if (!window)
            return;
        // Focus window on any interaction
        if (this.focusedWindowId !== windowId) {
            this.focusWindow(windowId);
        }
        // Forward interaction to window
        window.handleInteraction(event);
    }
    startUpdateLoop() {
        if (this.updateInterval)
            return;
        this.updateInterval = window.setInterval(() => {
            this.update();
        }, this.updateFrequency);
    }
    update() {
        // Update logic for smooth interactions
        // Could include animations, state updates, etc.
        // For now, just ensure all windows are properly rendered
        for (const window of this.windows.values()) {
            if (window.isVisible) {
                // Could add smooth animations or state updates here
            }
        }
    }
    setupAlt1Events() {
        // Set up Alt1-specific event handlers if available
        if (typeof alt1__WEBPACK_IMPORTED_MODULE_0__.on === 'function') {
            alt1__WEBPACK_IMPORTED_MODULE_0__.on('rslinked', () => {
                this.emit('alt1-rs-linked');
            });
            alt1__WEBPACK_IMPORTED_MODULE_0__.on('rsunlinked', () => {
                this.emit('alt1-rs-unlinked');
            });
            alt1__WEBPACK_IMPORTED_MODULE_0__.on('rsfocus', () => {
                this.emit('alt1-rs-focus');
            });
            alt1__WEBPACK_IMPORTED_MODULE_0__.on('rsblur', () => {
                this.emit('alt1-rs-blur');
            });
        }
    }
    emit(event, data) {
        const handlers = this.globalEventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                }
                catch (error) {
                    console.error(`Error in global event handler for ${event}:`, error);
                }
            });
        }
    }
}


/***/ }),

/***/ "alt1":
/*!***********************!*\
  !*** external "alt1" ***!
  \***********************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_alt1__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_36969__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_36969__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nested_webpack_require_36969__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nested_webpack_require_36969__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_36969__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_36969__.o(definition, key) && !__nested_webpack_require_36969__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_36969__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_36969__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__nested_webpack_require_36969__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_36969__.d(__nested_webpack_exports__, {
/* harmony export */   InteractionDetector: () => (/* reexport safe */ _InteractionDetector__WEBPACK_IMPORTED_MODULE_2__.InteractionDetector),
/* harmony export */   OverlayWindow: () => (/* reexport safe */ _OverlayWindow__WEBPACK_IMPORTED_MODULE_1__.OverlayWindow),
/* harmony export */   OverlayWindowManager: () => (/* reexport safe */ _OverlayWindowManager__WEBPACK_IMPORTED_MODULE_0__.OverlayWindowManager),
/* harmony export */   WindowThemes: () => (/* binding */ WindowThemes),
/* harmony export */   createWindowManager: () => (/* binding */ createWindowManager),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _OverlayWindowManager__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_36969__(/*! ./OverlayWindowManager */ "./OverlayWindowManager.ts");
/* harmony import */ var _OverlayWindow__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_36969__(/*! ./OverlayWindow */ "./OverlayWindow.ts");
/* harmony import */ var _InteractionDetector__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_36969__(/*! ./InteractionDetector */ "./InteractionDetector.ts");
// Advanced Overlay Windows - Main Export
//
// This component provides sophisticated window management for Alt1 applications
// using overlay-based virtual windows with computer vision interaction detection.




// Default export for easier consumption
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_OverlayWindowManager__WEBPACK_IMPORTED_MODULE_0__.OverlayWindowManager);
// Convenience factory function
function createWindowManager() {
    return new _OverlayWindowManager__WEBPACK_IMPORTED_MODULE_0__.OverlayWindowManager();
}
// Pre-configured themes
const WindowThemes = {
    DISCORD: {
        titleBarColor: 0x5865F2F0, // Discord purple with transparency
        titleBarTextColor: 0xFFFFFFFF, // White text
        borderColor: 0x5865F2FF, // Purple border
        backgroundColor: 0x2F3136F0, // Dark background with transparency
        shadowColor: 0x00000050, // Dark shadow
        accentColor: 0x7289DAFF // Light purple accent
    },
    RUNESCAPE: {
        titleBarColor: 0x5A4B2AF0, // RuneScape brown
        titleBarTextColor: 0xFFD700FF, // Gold text
        borderColor: 0x8B7355FF, // Light brown border
        backgroundColor: 0x3E3424F0, // Dark brown background
        shadowColor: 0x00000060, // Darker shadow
        accentColor: 0xFFD700FF // Gold accent
    },
    DARK: {
        titleBarColor: 0x1E1E1EF0, // Dark gray
        titleBarTextColor: 0xFFFFFFFF, // White text
        borderColor: 0x404040FF, // Medium gray border
        backgroundColor: 0x2D2D30F0, // Dark background
        shadowColor: 0x00000080, // Strong shadow
        accentColor: 0x007ACCFF // Blue accent
    },
    LIGHT: {
        titleBarColor: 0xF0F0F0F0, // Light gray
        titleBarTextColor: 0x000000FF, // Black text
        borderColor: 0xCCCCCCFF, // Light border
        backgroundColor: 0xFFFFFFE0, // White background with slight transparency
        shadowColor: 0x00000040, // Light shadow
        accentColor: 0x0078D4FF // Blue accent
    }
};

})();

/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../components/interactive-windows/dist/index.js":
/*!*************************************************************!*\
  !*** ../../../components/interactive-windows/dist/index.js ***!
  \*************************************************************/
/***/ ((module) => {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else // removed by dead control flow
{}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/InteractiveWindow.ts":
/*!**********************************!*\
  !*** ./src/InteractiveWindow.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_695__) => {

__nested_webpack_require_695__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_695__.d(__nested_webpack_exports__, {
/* harmony export */   InteractiveWindow: () => (/* binding */ InteractiveWindow)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_695__(/*! ./types */ "./src/types.ts");
/**
 * Interactive Window Implementation
 *
 * Provides a truly interactive DOM-based window with full drag, resize, and event handling.
 * Unlike Alt1 overlays, these windows can receive mouse events and user interactions.
 */

class InteractiveWindow {
    constructor(config) {
        this._resizeHandles = new Map();
        // Event handling
        this._eventHandlers = new Map();
        // Interaction state
        this._dragState = {
            isDragging: false,
            startPosition: { x: 0, y: 0 },
            startWindowPosition: { x: 0, y: 0 },
            offset: { x: 0, y: 0 }
        };
        this._resizeState = {
            isResizing: false,
            handle: null,
            startPosition: { x: 0, y: 0 },
            startSize: { width: 0, height: 0 },
            startWindowPosition: { x: 0, y: 0 }
        };
        this._styleElement = null;
        this._id = config.id || this.generateId();
        this._config = { ...config };
        this._theme = config.theme || _types__WEBPACK_IMPORTED_MODULE_0__.WindowThemes.MODERN_DARK;
        this._state = {
            id: this._id,
            position: {
                x: config.x ?? this.getCenterPosition().x,
                y: config.y ?? this.getCenterPosition().y
            },
            size: { width: config.width, height: config.height },
            visible: false,
            focused: false,
            minimized: false,
            maximized: false,
            zIndex: 1000
        };
        this.createElement();
        this.attachEventListeners();
        this.applyTheme();
    }
    // Public getters
    get id() { return this._id; }
    get state() { return { ...this._state }; }
    get config() { return { ...this._config }; }
    get element() { return this._element; }
    get contentElement() { return this._contentElement; }
    // Window management methods
    show() {
        if (this._state.visible)
            return;
        this._state.visible = true;
        this._element.style.display = 'block';
        // Add to DOM if not already added
        if (!this._element.parentElement) {
            document.body.appendChild(this._element);
        }
        this.emit('create');
        this.focus();
    }
    hide() {
        if (!this._state.visible)
            return;
        this._state.visible = false;
        this._element.style.display = 'none';
        this.emit('close');
    }
    close() {
        // Call onClose handler if provided
        if (this._config.onClose) {
            const shouldClose = this._config.onClose(this);
            if (shouldClose === false)
                return;
        }
        this.emit('beforeClose');
        this.hide();
        // Remove from DOM
        if (this._element.parentElement) {
            this._element.parentElement.removeChild(this._element);
        }
        // Clean up style element
        if (this._styleElement && this._styleElement.parentElement) {
            this._styleElement.parentElement.removeChild(this._styleElement);
        }
    }
    focus() {
        if (this._state.focused)
            return;
        this._state.focused = true;
        this._element.classList.add('iwm-focused');
        this.bringToFront();
        this.emit('focus');
        if (this._config.onFocus) {
            this._config.onFocus(this);
        }
    }
    blur() {
        if (!this._state.focused)
            return;
        this._state.focused = false;
        this._element.classList.remove('iwm-focused');
        this.emit('blur');
        if (this._config.onBlur) {
            this._config.onBlur(this);
        }
    }
    minimize() {
        if (this._state.minimized)
            return;
        this._state.minimized = true;
        this._element.classList.add('iwm-minimized');
        this._element.style.display = 'none';
        this.emit('minimize');
        if (this._config.onMinimize) {
            this._config.onMinimize(this);
        }
    }
    restore() {
        if (!this._state.minimized && !this._state.maximized)
            return;
        this._state.minimized = false;
        this._state.maximized = false;
        this._element.classList.remove('iwm-minimized', 'iwm-maximized');
        this._element.style.display = 'block';
        this.updateElementStyle();
        this.emit('restore');
        if (this._config.onRestore) {
            this._config.onRestore(this);
        }
    }
    maximize() {
        if (this._state.maximized)
            return;
        this._state.maximized = true;
        this._element.classList.add('iwm-maximized');
        // Store current position and size for restore
        this._element.setAttribute('data-restore-x', this._state.position.x.toString());
        this._element.setAttribute('data-restore-y', this._state.position.y.toString());
        this._element.setAttribute('data-restore-width', this._state.size.width.toString());
        this._element.setAttribute('data-restore-height', this._state.size.height.toString());
        // Maximize to full window
        this.setPosition(0, 0);
        this.setSize(window.innerWidth, window.innerHeight);
        this.emit('maximize');
    }
    // Position and size methods
    setPosition(x, y) {
        this._state.position = { x, y };
        this.updateElementStyle();
        this.emit('move');
        if (this._config.onMove) {
            this._config.onMove(this, this._state.position);
        }
    }
    setSize(width, height) {
        // Apply constraints
        const minWidth = this._config.minWidth || 200;
        const minHeight = this._config.minHeight || 100;
        const maxWidth = this._config.maxWidth || window.innerWidth;
        const maxHeight = this._config.maxHeight || window.innerHeight;
        width = Math.max(minWidth, Math.min(maxWidth, width));
        height = Math.max(minHeight, Math.min(maxHeight, height));
        this._state.size = { width, height };
        this.updateElementStyle();
        this.emit('resize');
        if (this._config.onResize) {
            this._config.onResize(this, this._state.size);
        }
    }
    center() {
        const centerPos = this.getCenterPosition();
        this.setPosition(centerPos.x, centerPos.y);
    }
    // Content methods
    setContent(content) {
        this._contentElement.innerHTML = '';
        if (typeof content === 'string') {
            this._contentElement.innerHTML = content;
        }
        else {
            this._contentElement.appendChild(content);
        }
    }
    getContent() {
        return this._contentElement;
    }
    // Event handling
    on(event, handler) {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, []);
        }
        this._eventHandlers.get(event).push(handler);
    }
    off(event, handler) {
        if (!this._eventHandlers.has(event))
            return;
        if (handler) {
            const handlers = this._eventHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
        else {
            this._eventHandlers.set(event, []);
        }
    }
    emit(event, data) {
        const eventObj = {
            type: event,
            window: this,
            data,
            timestamp: Date.now()
        };
        if (this._eventHandlers.has(event)) {
            this._eventHandlers.get(event).forEach(handler => {
                try {
                    handler(eventObj);
                }
                catch (error) {
                    console.error(`Error in window event handler for ${event}:`, error);
                }
            });
        }
    }
    // Utility methods
    bringToFront() {
        // Find the highest z-index among all windows
        let maxZIndex = 1000;
        document.querySelectorAll('.iwm-window').forEach(el => {
            const zIndex = parseInt(el.style.zIndex || '1000');
            maxZIndex = Math.max(maxZIndex, zIndex);
        });
        this._state.zIndex = maxZIndex + 1;
        this._element.style.zIndex = this._state.zIndex.toString();
    }
    sendToBack() {
        this._state.zIndex = 999;
        this._element.style.zIndex = this._state.zIndex.toString();
    }
    isVisible() { return this._state.visible; }
    isFocused() { return this._state.focused; }
    isMinimized() { return this._state.minimized; }
    isMaximized() { return this._state.maximized; }
    // Private methods
    generateId() {
        return `iwm-window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    getCenterPosition() {
        return {
            x: (window.innerWidth - this._state.size.width) / 2,
            y: (window.innerHeight - this._state.size.height) / 2
        };
    }
    createElement() {
        // Main window element
        this._element = document.createElement('div');
        this._element.className = 'iwm-window';
        this._element.style.cssText = `
            position: fixed;
            display: none;
            user-select: none;
            z-index: ${this._state.zIndex};
        `;
        // Title bar
        this._titleBarElement = document.createElement('div');
        this._titleBarElement.className = 'iwm-titlebar';
        this._element.appendChild(this._titleBarElement);
        // Title
        this._titleElement = document.createElement('div');
        this._titleElement.className = 'iwm-title';
        this._titleElement.textContent = this._config.title;
        this._titleBarElement.appendChild(this._titleElement);
        // Window buttons
        this._buttonsElement = document.createElement('div');
        this._buttonsElement.className = 'iwm-buttons';
        this._titleBarElement.appendChild(this._buttonsElement);
        // Create window control buttons
        if (this._config.minimizable !== false) {
            this._minimizeButton = this.createButton('minimize', '−');
            this._buttonsElement.appendChild(this._minimizeButton);
        }
        this._maximizeButton = this.createButton('maximize', '□');
        this._buttonsElement.appendChild(this._maximizeButton);
        if (this._config.closable !== false) {
            this._closeButton = this.createButton('close', '×');
            this._buttonsElement.appendChild(this._closeButton);
        }
        // Content area
        this._contentElement = document.createElement('div');
        this._contentElement.className = 'iwm-content';
        this._element.appendChild(this._contentElement);
        // Create resize handles if resizable
        if (this._config.resizable !== false) {
            this.createResizeHandles();
        }
        // Set initial content
        if (this._config.content) {
            this.setContent(this._config.content);
        }
        this.updateElementStyle();
    }
    createButton(type, symbol) {
        const button = document.createElement('div');
        button.className = `iwm-button iwm-button-${type}`;
        button.textContent = symbol;
        button.style.cssText = `
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        `;
        return button;
    }
    createResizeHandles() {
        const handles = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
        handles.forEach(handle => {
            const element = document.createElement('div');
            element.className = `iwm-resize-handle iwm-resize-${handle}`;
            element.style.cssText = this.getResizeHandleStyle(handle);
            this._element.appendChild(element);
            this._resizeHandles.set(handle, element);
        });
    }
    getResizeHandleStyle(handle) {
        const size = '8px';
        const base = `position: absolute; z-index: 1;`;
        switch (handle) {
            case 'n': return `${base} top: -4px; left: 8px; right: 8px; height: ${size}; cursor: n-resize;`;
            case 'ne': return `${base} top: -4px; right: -4px; width: ${size}; height: ${size}; cursor: ne-resize;`;
            case 'e': return `${base} top: 8px; right: -4px; bottom: 8px; width: ${size}; cursor: e-resize;`;
            case 'se': return `${base} bottom: -4px; right: -4px; width: ${size}; height: ${size}; cursor: se-resize;`;
            case 's': return `${base} bottom: -4px; left: 8px; right: 8px; height: ${size}; cursor: s-resize;`;
            case 'sw': return `${base} bottom: -4px; left: -4px; width: ${size}; height: ${size}; cursor: sw-resize;`;
            case 'w': return `${base} top: 8px; left: -4px; bottom: 8px; width: ${size}; cursor: w-resize;`;
            case 'nw': return `${base} top: -4px; left: -4px; width: ${size}; height: ${size}; cursor: nw-resize;`;
            default: return base;
        }
    }
    attachEventListeners() {
        // Title bar drag
        if (this._config.draggable !== false) {
            this._titleBarElement.addEventListener('mousedown', this.onDragStart.bind(this));
        }
        // Window control buttons
        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => this.close());
        }
        if (this._minimizeButton) {
            this._minimizeButton.addEventListener('click', () => this.minimize());
        }
        this._maximizeButton.addEventListener('click', () => {
            if (this._state.maximized) {
                this.restore();
            }
            else {
                this.maximize();
            }
        });
        // Resize handles
        this._resizeHandles.forEach((element, handle) => {
            element.addEventListener('mousedown', (e) => this.onResizeStart(e, handle));
        });
        // Focus handling
        this._element.addEventListener('mousedown', () => this.focus());
        // Global mouse events (will be bound dynamically during drag/resize)
        // Prevent text selection while dragging
        this._element.addEventListener('selectstart', (e) => {
            if (this._dragState.isDragging || this._resizeState.isResizing) {
                e.preventDefault();
            }
        });
    }
    onDragStart(e) {
        if (e.button !== 0)
            return; // Only left mouse button
        if (e.target.closest('.iwm-button'))
            return; // Don't drag when clicking buttons
        e.preventDefault();
        this._dragState = {
            isDragging: true,
            startPosition: { x: e.clientX, y: e.clientY },
            startWindowPosition: { ...this._state.position },
            offset: {
                x: e.clientX - this._state.position.x,
                y: e.clientY - this._state.position.y
            }
        };
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        document.body.style.cursor = 'move';
    }
    onDragMove(e) {
        if (!this._dragState.isDragging)
            return;
        const newX = e.clientX - this._dragState.offset.x;
        const newY = e.clientY - this._dragState.offset.y;
        this.setPosition(newX, newY);
    }
    onDragEnd() {
        this._dragState.isDragging = false;
        document.removeEventListener('mousemove', this.onDragMove.bind(this));
        document.removeEventListener('mouseup', this.onDragEnd.bind(this));
        document.body.style.cursor = '';
    }
    onResizeStart(e, handle) {
        if (e.button !== 0)
            return;
        e.preventDefault();
        e.stopPropagation();
        this._resizeState = {
            isResizing: true,
            handle,
            startPosition: { x: e.clientX, y: e.clientY },
            startSize: { ...this._state.size },
            startWindowPosition: { ...this._state.position }
        };
        document.addEventListener('mousemove', this.onResizeMove.bind(this));
        document.addEventListener('mouseup', this.onResizeEnd.bind(this));
    }
    onResizeMove(e) {
        if (!this._resizeState.isResizing || !this._resizeState.handle)
            return;
        const deltaX = e.clientX - this._resizeState.startPosition.x;
        const deltaY = e.clientY - this._resizeState.startPosition.y;
        let newWidth = this._resizeState.startSize.width;
        let newHeight = this._resizeState.startSize.height;
        let newX = this._resizeState.startWindowPosition.x;
        let newY = this._resizeState.startWindowPosition.y;
        const handle = this._resizeState.handle;
        // Calculate new dimensions based on resize handle
        if (handle.includes('e'))
            newWidth += deltaX;
        if (handle.includes('w')) {
            newWidth -= deltaX;
            newX += deltaX;
        }
        if (handle.includes('s'))
            newHeight += deltaY;
        if (handle.includes('n')) {
            newHeight -= deltaY;
            newY += deltaY;
        }
        // Apply constraints
        const minWidth = this._config.minWidth || 200;
        const minHeight = this._config.minHeight || 100;
        if (newWidth < minWidth) {
            if (handle.includes('w'))
                newX = this._resizeState.startWindowPosition.x + (this._resizeState.startSize.width - minWidth);
            newWidth = minWidth;
        }
        if (newHeight < minHeight) {
            if (handle.includes('n'))
                newY = this._resizeState.startWindowPosition.y + (this._resizeState.startSize.height - minHeight);
            newHeight = minHeight;
        }
        this.setSize(newWidth, newHeight);
        if (handle.includes('w') || handle.includes('n')) {
            this.setPosition(newX, newY);
        }
    }
    onResizeEnd() {
        this._resizeState.isResizing = false;
        this._resizeState.handle = null;
        document.removeEventListener('mousemove', this.onResizeMove.bind(this));
        document.removeEventListener('mouseup', this.onResizeEnd.bind(this));
    }
    updateElementStyle() {
        this._element.style.left = `${this._state.position.x}px`;
        this._element.style.top = `${this._state.position.y}px`;
        this._element.style.width = `${this._state.size.width}px`;
        this._element.style.height = `${this._state.size.height}px`;
    }
    applyTheme() {
        const theme = this._theme;
        const styleId = `iwm-window-style-${this._id}`;
        // Remove existing style
        if (this._styleElement) {
            this._styleElement.remove();
        }
        // Create new style element
        this._styleElement = document.createElement('style');
        this._styleElement.id = styleId;
        this._styleElement.textContent = `
            .iwm-window[data-id="${this._id}"] {
                background: ${theme.backgroundColor};
                border: ${theme.borderWidth || 1}px solid ${theme.borderColor};
                border-radius: ${theme.borderRadius || 4}px;
                box-shadow: ${theme.shadowOffset?.x || 0}px ${theme.shadowOffset?.y || 4}px ${theme.shadowBlur || 10}px ${theme.shadowColor};
                font-family: ${theme.fontFamily || 'Arial, sans-serif'};
            }

            .iwm-window[data-id="${this._id}"] .iwm-titlebar {
                background: ${theme.titleBarColor};
                color: ${theme.titleBarTextColor};
                height: ${theme.titleBarHeight || 30}px;
                display: flex;
                align-items: center;
                padding: 0 8px;
                border-radius: ${theme.borderRadius || 4}px ${theme.borderRadius || 4}px 0 0;
                cursor: move;
            }

            .iwm-window[data-id="${this._id}"] .iwm-title {
                flex: 1;
                font-size: ${theme.fontSize || 14}px;
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .iwm-window[data-id="${this._id}"] .iwm-buttons {
                display: flex;
                gap: 4px;
            }

            .iwm-window[data-id="${this._id}"] .iwm-button {
                color: ${theme.buttonColor || theme.titleBarTextColor};
                border-radius: 2px;
                transition: background-color 0.2s;
            }

            .iwm-window[data-id="${this._id}"] .iwm-button:hover {
                background-color: ${theme.buttonHoverColor || 'rgba(255, 255, 255, 0.2)'};
            }

            .iwm-window[data-id="${this._id}"] .iwm-button-close:hover {
                background-color: ${theme.buttonHoverColor || '#FF5555'};
            }

            .iwm-window[data-id="${this._id}"] .iwm-content {
                background: ${theme.contentBackgroundColor || theme.backgroundColor};
                height: calc(100% - ${theme.titleBarHeight || 30}px);
                overflow: auto;
                border-radius: 0 0 ${theme.borderRadius || 4}px ${theme.borderRadius || 4}px;
            }

            .iwm-window[data-id="${this._id}"].iwm-focused {
                box-shadow: 0 0 0 2px ${theme.focusColor || theme.borderColor},
                           ${theme.shadowOffset?.x || 0}px ${theme.shadowOffset?.y || 4}px ${theme.shadowBlur || 10}px ${theme.shadowColor};
            }
        `;
        document.head.appendChild(this._styleElement);
        this._element.setAttribute('data-id', this._id);
    }
}


/***/ }),

/***/ "./src/InteractiveWindowManager.ts":
/*!*****************************************!*\
  !*** ./src/InteractiveWindowManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_22911__) => {

__nested_webpack_require_22911__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_22911__.d(__nested_webpack_exports__, {
/* harmony export */   InteractiveWindowManager: () => (/* binding */ InteractiveWindowManager)
/* harmony export */ });
/* harmony import */ var _InteractiveWindow__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_22911__(/*! ./InteractiveWindow */ "./src/InteractiveWindow.ts");
/**
 * Interactive Window Manager
 *
 * Manages multiple interactive windows with focus handling, layout management,
 * and global event coordination.
 */

class InteractiveWindowManager {
    // Getters
    get windows() {
        return new Map(this._windows);
    }
    get focusedWindow() {
        return this._focusedWindow;
    }
    constructor() {
        this._windows = new Map();
        this._focusedWindow = null;
        this._eventHandlers = new Map();
        this._nextZIndex = 1000;
        this._cascadeOffset = { x: 30, y: 30 };
        this.setupGlobalEventHandlers();
    }
    // Window management methods
    createWindow(config) {
        const window = new _InteractiveWindow__WEBPACK_IMPORTED_MODULE_0__.InteractiveWindow(config);
        this._windows.set(window.id, window);
        // Set up window event forwarding
        this.setupWindowEventForwarding(window);
        // Auto-show if not specified otherwise
        if (config.modal !== false) {
            window.show();
        }
        this.emit('create', { window });
        return window;
    }
    getWindow(id) {
        return this._windows.get(id) || null;
    }
    closeWindow(id) {
        const window = this._windows.get(id);
        if (!window)
            return false;
        window.close();
        this._windows.delete(id);
        // Update focused window
        if (this._focusedWindow === window) {
            this._focusedWindow = this.getTopMostWindow();
            if (this._focusedWindow) {
                this._focusedWindow.focus();
            }
        }
        this.emit('close', { window });
        return true;
    }
    closeAllWindows() {
        const windowIds = Array.from(this._windows.keys());
        windowIds.forEach(id => this.closeWindow(id));
    }
    // Focus management
    focusWindow(id) {
        const window = this._windows.get(id);
        if (!window || !window.isVisible())
            return false;
        // Blur current focused window
        if (this._focusedWindow && this._focusedWindow !== window) {
            this._focusedWindow.blur();
        }
        this._focusedWindow = window;
        window.focus();
        return true;
    }
    getNextWindow() {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0)
            return null;
        const currentIndex = this._focusedWindow ?
            visibleWindows.indexOf(this._focusedWindow) : -1;
        const nextIndex = (currentIndex + 1) % visibleWindows.length;
        return visibleWindows[nextIndex];
    }
    getPreviousWindow() {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0)
            return null;
        const currentIndex = this._focusedWindow ?
            visibleWindows.indexOf(this._focusedWindow) : -1;
        const prevIndex = currentIndex === 0 ?
            visibleWindows.length - 1 :
            Math.max(0, currentIndex - 1);
        return visibleWindows[prevIndex];
    }
    // Layout management
    cascadeWindows() {
        const visibleWindows = this.getVisibleWindows();
        let offsetX = 50;
        let offsetY = 50;
        visibleWindows.forEach((window, index) => {
            const x = offsetX + (index * this._cascadeOffset.x);
            const y = offsetY + (index * this._cascadeOffset.y);
            // Wrap around if we exceed screen bounds
            const maxX = globalThis.window.innerWidth - window.state.size.width;
            const maxY = globalThis.window.innerHeight - window.state.size.height;
            window.setPosition(Math.min(x, Math.max(0, maxX)), Math.min(y, Math.max(0, maxY)));
        });
    }
    tileWindows() {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0)
            return;
        const screenWidth = globalThis.window.innerWidth;
        const screenHeight = globalThis.window.innerHeight;
        // Calculate grid dimensions
        const cols = Math.ceil(Math.sqrt(visibleWindows.length));
        const rows = Math.ceil(visibleWindows.length / cols);
        const windowWidth = Math.floor(screenWidth / cols);
        const windowHeight = Math.floor(screenHeight / rows);
        visibleWindows.forEach((win, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            win.setPosition(col * windowWidth, row * windowHeight);
            win.setSize(Math.max(windowWidth - 10, 300), // Minimum width with gap
            Math.max(windowHeight - 10, 200) // Minimum height with gap
            );
        });
    }
    centerAllWindows() {
        this.getVisibleWindows().forEach(window => {
            window.center();
        });
    }
    // Event handling
    on(event, handler) {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, []);
        }
        this._eventHandlers.get(event).push(handler);
    }
    off(event, handler) {
        if (!this._eventHandlers.has(event))
            return;
        if (handler) {
            const handlers = this._eventHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
        else {
            this._eventHandlers.set(event, []);
        }
    }
    // Utility methods
    getVisibleWindows() {
        return Array.from(this._windows.values()).filter(window => window.isVisible() && !window.isMinimized());
    }
    getWindowCount() {
        return this._windows.size;
    }
    destroy() {
        this.closeAllWindows();
        this.removeGlobalEventHandlers();
        this._eventHandlers.clear();
    }
    // Convenience methods for common window types
    createModal(config) {
        return this.createWindow({
            ...config,
            modal: true,
            draggable: config.draggable !== false,
            resizable: config.resizable !== false,
            closable: config.closable !== false
        });
    }
    createDialog(title, content, buttons) {
        const dialogContent = document.createElement('div');
        dialogContent.style.cssText = 'padding: 20px;';
        // Add content
        if (typeof content === 'string') {
            dialogContent.innerHTML = `<div style="margin-bottom: 20px;">${content}</div>`;
        }
        else {
            const contentWrapper = document.createElement('div');
            contentWrapper.style.marginBottom = '20px';
            contentWrapper.appendChild(content);
            dialogContent.appendChild(contentWrapper);
        }
        // Add buttons if provided
        if (buttons && buttons.length > 0) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';
            buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.textContent = buttonConfig.text;
                button.style.cssText = `
                    padding: 8px 16px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: ${buttonConfig.primary ? '#007ACC' : '#f0f0f0'};
                    color: ${buttonConfig.primary ? 'white' : 'black'};
                    cursor: pointer;
                `;
                button.addEventListener('click', buttonConfig.onClick);
                buttonContainer.appendChild(button);
            });
            dialogContent.appendChild(buttonContainer);
        }
        return this.createModal({
            title,
            content: dialogContent,
            width: 400,
            height: 200,
            resizable: false,
            minimizable: false
        });
    }
    createSettingsModal(title, settingsContent) {
        return this.createModal({
            title,
            content: settingsContent,
            width: 600,
            height: 400,
            resizable: true,
            minimizable: false,
            className: 'iwm-settings-modal'
        });
    }
    // Alert and confirmation dialogs
    alert(title, message) {
        return new Promise((resolve) => {
            this.createDialog(title, message, [
                {
                    text: 'OK',
                    primary: true,
                    onClick: () => {
                        resolve();
                    }
                }
            ]);
        });
    }
    confirm(title, message) {
        return new Promise((resolve) => {
            this.createDialog(title, message, [
                {
                    text: 'Cancel',
                    onClick: () => resolve(false)
                },
                {
                    text: 'OK',
                    primary: true,
                    onClick: () => resolve(true)
                }
            ]);
        });
    }
    // Private methods
    emit(event, data) {
        const eventObj = {
            type: event,
            window: data?.window || null,
            data,
            timestamp: Date.now()
        };
        if (this._eventHandlers.has(event)) {
            this._eventHandlers.get(event).forEach(handler => {
                try {
                    handler(eventObj);
                }
                catch (error) {
                    console.error(`Error in window manager event handler for ${event}:`, error);
                }
            });
        }
    }
    setupWindowEventForwarding(window) {
        // Forward all window events to manager listeners
        const eventTypes = [
            'create', 'close', 'resize', 'move', 'focus', 'blur',
            'minimize', 'restore', 'maximize', 'beforeClose'
        ];
        eventTypes.forEach(eventType => {
            window.on(eventType, (event) => {
                if (eventType === 'focus') {
                    this._focusedWindow = window;
                }
                this.emit(eventType, event);
            });
        });
    }
    setupGlobalEventHandlers() {
        // Handle Escape key to close focused modal
        document.addEventListener('keydown', this.onGlobalKeyDown.bind(this));
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        // Handle clicks outside windows to blur focus
        document.addEventListener('click', this.onDocumentClick.bind(this));
    }
    removeGlobalEventHandlers() {
        document.removeEventListener('keydown', this.onGlobalKeyDown.bind(this));
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        document.removeEventListener('click', this.onDocumentClick.bind(this));
    }
    onGlobalKeyDown(e) {
        if (e.key === 'Escape' && this._focusedWindow) {
            // Close modal windows on escape
            if (this._focusedWindow.config.modal) {
                this._focusedWindow.close();
            }
        }
        // Alt+Tab to cycle through windows
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            const nextWindow = e.shiftKey ? this.getPreviousWindow() : this.getNextWindow();
            if (nextWindow) {
                this.focusWindow(nextWindow.id);
            }
        }
    }
    onWindowResize() {
        // Ensure windows stay within screen bounds
        this._windows.forEach(window => {
            if (!window.isVisible())
                return;
            const state = window.state;
            const maxX = globalThis.window.innerWidth - state.size.width;
            const maxY = globalThis.window.innerHeight - state.size.height;
            if (state.position.x > maxX || state.position.y > maxY) {
                window.setPosition(Math.min(state.position.x, Math.max(0, maxX)), Math.min(state.position.y, Math.max(0, maxY)));
            }
        });
    }
    onDocumentClick(e) {
        const target = e.target;
        // Check if click was inside any window
        const clickedWindow = Array.from(this._windows.values()).find(window => window.element.contains(target));
        if (!clickedWindow && this._focusedWindow) {
            this._focusedWindow.blur();
            this._focusedWindow = null;
        }
    }
    getTopMostWindow() {
        let topWindow = null;
        let maxZIndex = -1;
        this._windows.forEach(window => {
            if (window.isVisible() && window.state.zIndex > maxZIndex) {
                maxZIndex = window.state.zIndex;
                topWindow = window;
            }
        });
        return topWindow;
    }
}


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_36171__) => {

__nested_webpack_require_36171__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_36171__.d(__nested_webpack_exports__, {
/* harmony export */   WindowThemes: () => (/* binding */ WindowThemes)
/* harmony export */ });
/**
 * Interactive Windows Component - Type Definitions
 *
 * Provides truly interactive modal window system for Alt1 applications
 * using DOM-based windows with full event handling capabilities.
 */
/**
 * Pre-defined window themes
 */
const WindowThemes = {
    DISCORD: {
        titleBarColor: '#5865F2',
        titleBarTextColor: '#FFFFFF',
        borderColor: '#5865F2',
        backgroundColor: '#36393F',
        contentBackgroundColor: '#40444B',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 4 },
        borderRadius: 8,
        titleBarHeight: 32,
        borderWidth: 1,
        buttonColor: '#FFFFFF',
        buttonHoverColor: '#FF5555',
        buttonActiveColor: '#FF3333',
        focusColor: '#5865F2',
        fontFamily: '"Whitney", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 14
    },
    RUNESCAPE: {
        titleBarColor: '#5A4B2A',
        titleBarTextColor: '#FFD700',
        borderColor: '#8B7355',
        backgroundColor: '#3E3424',
        contentBackgroundColor: '#2D2618',
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowBlur: 12,
        shadowOffset: { x: 0, y: 6 },
        borderRadius: 4,
        titleBarHeight: 28,
        borderWidth: 2,
        buttonColor: '#FFD700',
        buttonHoverColor: '#FF6B6B',
        buttonActiveColor: '#FF4757',
        focusColor: '#FFD700',
        fontFamily: '"Trajan Pro", serif',
        fontSize: 13
    },
    MODERN_DARK: {
        titleBarColor: '#1E1E1E',
        titleBarTextColor: '#FFFFFF',
        borderColor: '#404040',
        backgroundColor: '#2D2D30',
        contentBackgroundColor: '#252526',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 15,
        shadowOffset: { x: 0, y: 8 },
        borderRadius: 6,
        titleBarHeight: 30,
        borderWidth: 1,
        buttonColor: '#FFFFFF',
        buttonHoverColor: '#FF6B6B',
        buttonActiveColor: '#FF4757',
        focusColor: '#007ACC',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        fontSize: 14
    },
    MODERN_LIGHT: {
        titleBarColor: '#F3F3F3',
        titleBarTextColor: '#323130',
        borderColor: '#D1D1D1',
        backgroundColor: '#FFFFFF',
        contentBackgroundColor: '#FAFAFA',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 8,
        shadowOffset: { x: 0, y: 2 },
        borderRadius: 6,
        titleBarHeight: 30,
        borderWidth: 1,
        buttonColor: '#323130',
        buttonHoverColor: '#FF6B6B',
        buttonActiveColor: '#FF4757',
        focusColor: '#0078D4',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        fontSize: 14
    }
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_39359__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_39359__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_39359__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_39359__.o(definition, key) && !__nested_webpack_require_39359__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_39359__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_39359__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__nested_webpack_require_39359__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_39359__.d(__nested_webpack_exports__, {
/* harmony export */   InteractiveWindow: () => (/* reexport safe */ _InteractiveWindow__WEBPACK_IMPORTED_MODULE_1__.InteractiveWindow),
/* harmony export */   InteractiveWindowManager: () => (/* reexport safe */ _InteractiveWindowManager__WEBPACK_IMPORTED_MODULE_0__.InteractiveWindowManager),
/* harmony export */   WindowThemes: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.WindowThemes),
/* harmony export */   alert: () => (/* binding */ alert),
/* harmony export */   confirm: () => (/* binding */ confirm),
/* harmony export */   createDialog: () => (/* binding */ createDialog),
/* harmony export */   createModal: () => (/* binding */ createModal),
/* harmony export */   createSettingsModal: () => (/* binding */ createSettingsModal),
/* harmony export */   createSettingsTemplate: () => (/* binding */ createSettingsTemplate),
/* harmony export */   createWindowManager: () => (/* binding */ createWindowManager),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getGlobalWindowManager: () => (/* binding */ getGlobalWindowManager)
/* harmony export */ });
/* harmony import */ var _InteractiveWindowManager__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_39359__(/*! ./InteractiveWindowManager */ "./src/InteractiveWindowManager.ts");
/* harmony import */ var _InteractiveWindow__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_39359__(/*! ./InteractiveWindow */ "./src/InteractiveWindow.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_39359__(/*! ./types */ "./src/types.ts");
/**
 * Interactive Windows Component - Main Export
 *
 * Provides truly interactive modal window system for Alt1 applications
 * with full drag, resize, close functionality using DOM-based windows.
 */

// Main exports


// Theme exports

// Default export for easier consumption
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_InteractiveWindowManager__WEBPACK_IMPORTED_MODULE_0__.InteractiveWindowManager);
// Convenience factory function
function createWindowManager() {
    return new _InteractiveWindowManager__WEBPACK_IMPORTED_MODULE_0__.InteractiveWindowManager();
}
// Global singleton instance (optional)
let globalManager = null;
function getGlobalWindowManager() {
    if (!globalManager) {
        globalManager = new _InteractiveWindowManager__WEBPACK_IMPORTED_MODULE_0__.InteractiveWindowManager();
    }
    return globalManager;
}
// Quick utility functions for common use cases
function createModal(config) {
    return getGlobalWindowManager().createModal(config);
}
function createDialog(title, content, buttons) {
    return getGlobalWindowManager().createDialog(title, content, buttons);
}
function createSettingsModal(title, settingsContent) {
    return getGlobalWindowManager().createSettingsModal(title, settingsContent);
}
function alert(title, message) {
    return getGlobalWindowManager().alert(title, message);
}
function confirm(title, message) {
    return getGlobalWindowManager().confirm(title, message);
}
// Settings modal template helper
function createSettingsTemplate(settings) {
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    // Content area
    const content = document.createElement('div');
    content.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f8f9fa;
    `;
    const form = document.createElement('form');
    const values = {};
    settings.sections.forEach(section => {
        // Section header
        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = section.title;
        sectionHeader.style.cssText = `
            margin: 0 0 16px 0;
            color: #333;
            font-size: 16px;
            font-weight: 600;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
        `;
        form.appendChild(sectionHeader);
        // Section container
        const sectionContainer = document.createElement('div');
        sectionContainer.style.cssText = `
            margin-bottom: 24px;
            background: white;
            padding: 16px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        `;
        section.fields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.style.cssText = 'margin-bottom: 16px;';
            // Label
            const label = document.createElement('label');
            label.textContent = field.label;
            label.style.cssText = `
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: #555;
            `;
            let input;
            // Create input based on type
            switch (field.type) {
                case 'checkbox':
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = field.value || false;
                    values[field.key] = field.value || false;
                    input.addEventListener('change', (e) => {
                        values[field.key] = e.target.checked;
                    });
                    break;
                case 'select':
                    input = document.createElement('select');
                    field.options?.forEach(option => {
                        const optionEl = document.createElement('option');
                        optionEl.value = option.value;
                        optionEl.textContent = option.label;
                        optionEl.selected = option.value === field.value;
                        input.appendChild(optionEl);
                    });
                    values[field.key] = field.value;
                    input.addEventListener('change', (e) => {
                        values[field.key] = e.target.value;
                    });
                    break;
                case 'textarea':
                    input = document.createElement('textarea');
                    input.value = field.value || '';
                    input.placeholder = field.placeholder || '';
                    values[field.key] = field.value || '';
                    input.addEventListener('input', (e) => {
                        values[field.key] = e.target.value;
                    });
                    break;
                case 'range':
                    input = document.createElement('input');
                    input.type = 'range';
                    input.min = (field.min || 0).toString();
                    input.max = (field.max || 100).toString();
                    input.step = (field.step || 1).toString();
                    input.value = (field.value || field.min || 0).toString();
                    values[field.key] = field.value || field.min || 0;
                    // Add value display
                    const valueDisplay = document.createElement('span');
                    valueDisplay.textContent = values[field.key].toString();
                    valueDisplay.style.cssText = 'margin-left: 8px; color: #666;';
                    input.addEventListener('input', (e) => {
                        const value = parseFloat(e.target.value);
                        values[field.key] = value;
                        valueDisplay.textContent = value.toString();
                    });
                    const rangeContainer = document.createElement('div');
                    rangeContainer.style.cssText = 'display: flex; align-items: center;';
                    rangeContainer.appendChild(input);
                    rangeContainer.appendChild(valueDisplay);
                    input = rangeContainer;
                    break;
                default: // text, number
                    input = document.createElement('input');
                    input.type = field.type;
                    input.value = (field.value || '').toString();
                    input.placeholder = field.placeholder || '';
                    if (field.type === 'number') {
                        if (field.min !== undefined)
                            input.min = field.min.toString();
                        if (field.max !== undefined)
                            input.max = field.max.toString();
                        if (field.step !== undefined)
                            input.step = field.step.toString();
                    }
                    values[field.key] = field.value || (field.type === 'number' ? 0 : '');
                    input.addEventListener('input', (e) => {
                        const target = e.target;
                        values[field.key] = field.type === 'number' ? parseFloat(target.value) || 0 : target.value;
                    });
                    break;
            }
            // Style input
            if (input.tagName !== 'DIV') { // Skip range container
                input.style.cssText = `
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                `;
            }
            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            sectionContainer.appendChild(fieldContainer);
        });
        form.appendChild(sectionContainer);
    });
    content.appendChild(form);
    // Button bar
    const buttonBar = document.createElement('div');
    buttonBar.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding: 16px 20px;
        background: #f0f0f0;
        border-top: 1px solid #ddd;
    `;
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 14px;
    `;
    cancelButton.addEventListener('click', () => {
        settings.onCancel?.();
    });
    // Save button
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Save';
    saveButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #007ACC;
        color: white;
        cursor: pointer;
        font-size: 14px;
    `;
    saveButton.addEventListener('click', () => {
        settings.onSave?.(values);
    });
    buttonBar.appendChild(cancelButton);
    buttonBar.appendChild(saveButton);
    container.appendChild(content);
    container.appendChild(buttonBar);
    return container;
}

})();

/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt1 */ "../../../node_modules/alt1/dist/base/index.js");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_advanced_overlay_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/advanced-overlay-windows/dist/index */ "../../../components/advanced-overlay-windows/dist/index.js");
/* harmony import */ var _components_advanced_overlay_windows_dist_index__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_components_advanced_overlay_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../components/interactive-windows/dist/index */ "../../../components/interactive-windows/dist/index.js");
/* harmony import */ var _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger */ "./logger.ts");
// Advanced Windows Test Plugin
// Demonstrates the capabilities of the @tmg-alt1/advanced-overlay-windows component




/**
 * Main test application class demonstrating advanced overlay windows
 */
class AdvancedWindowsTestApp {
    constructor() {
        this.windowManager = null;
        this.interactiveWindowManager = null;
        this.exampleWindow = null;
        this.additionalWindows = [];
        this.isInitialized = false;
        // UI Elements
        this.elements = {
            alt1Status: null,
            alt1StatusText: null,
            alt1InstallLink: null,
            openExampleWindow: null,
            closeExampleWindow: null,
            openMultipleWindows: null,
            closeAllWindows: null,
            managerStatus: null,
            windowCount: null,
            focusedWindow: null,
            interactionStatus: null,
            // Position controls
            moveWindowLeft: null,
            moveWindowRight: null,
            moveWindowUp: null,
            moveWindowDown: null,
            // Size controls
            increaseWidth: null,
            decreaseWidth: null,
            increaseHeight: null,
            decreaseHeight: null,
            // Interactive windows controls
            openInteractiveModal: null,
            openSettingsModal: null,
            showAlert: null,
            showConfirm: null
        };
        // Initialize logger first
        this.logger = new _logger__WEBPACK_IMPORTED_MODULE_3__.Alt1Logger('AdvancedWindowsTest', _logger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.DEBUG);
        this.logger.init('Initializing Advanced Windows Test App...');
        this.initialize();
    }
    /**
     * Initialize the test application
     */
    async initialize() {
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
    getUIElements() {
        this.elements.alt1Status = document.getElementById('alt1Status');
        this.elements.alt1StatusText = document.getElementById('alt1StatusText');
        this.elements.alt1InstallLink = document.getElementById('alt1InstallLink');
        this.elements.openExampleWindow = document.getElementById('openExampleWindow');
        this.elements.closeExampleWindow = document.getElementById('closeExampleWindow');
        this.elements.openMultipleWindows = document.getElementById('openMultipleWindows');
        this.elements.closeAllWindows = document.getElementById('closeAllWindows');
        this.elements.managerStatus = document.getElementById('managerStatus');
        this.elements.windowCount = document.getElementById('windowCount');
        this.elements.focusedWindow = document.getElementById('focusedWindow');
        this.elements.interactionStatus = document.getElementById('interactionStatus');
        // Position controls
        this.elements.moveWindowLeft = document.getElementById('moveWindowLeft');
        this.elements.moveWindowRight = document.getElementById('moveWindowRight');
        this.elements.moveWindowUp = document.getElementById('moveWindowUp');
        this.elements.moveWindowDown = document.getElementById('moveWindowDown');
        // Size controls
        this.elements.increaseWidth = document.getElementById('increaseWidth');
        this.elements.decreaseWidth = document.getElementById('decreaseWidth');
        this.elements.increaseHeight = document.getElementById('increaseHeight');
        this.elements.decreaseHeight = document.getElementById('decreaseHeight');
    }
    /**
     * Check Alt1 status and update UI accordingly
     */
    checkAlt1Status() {
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
            alt1__WEBPACK_IMPORTED_MODULE_0__.identifyApp('./appconfig.json');
            // Check permissions
            if (window.alt1.permissionPixel && window.alt1.permissionOverlay) {
                if (this.elements.alt1StatusText) {
                    this.elements.alt1StatusText.textContent = '🎉 Alt1 detected with full permissions! Ready to test advanced windows.';
                }
            }
            else {
                if (this.elements.alt1StatusText) {
                    this.elements.alt1StatusText.textContent = '⚠️ Alt1 detected but missing permissions. Please enable pixel and overlay permissions.';
                }
            }
        }
        else {
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
    initializeWindowManager() {
        try {
            this.windowManager = new _components_advanced_overlay_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.OverlayWindowManager();
            this.interactiveWindowManager = new _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_2__.InteractiveWindowManager();
            // Set up global event handlers
            this.windowManager.on('window-created', (data) => {
                console.log('🪟 Window created:', data.windowId);
                this.updateStatus();
            });
            this.windowManager.on('window-closed', (data) => {
                console.log('❌ Window closed:', data.windowId);
                this.updateStatus();
                // Clean up references
                if (this.exampleWindow && this.exampleWindow.id === data.windowId) {
                    this.exampleWindow = null;
                }
                this.additionalWindows = this.additionalWindows.filter(w => w.id !== data.windowId);
            });
            this.windowManager.on('window-focused', (data) => {
                console.log('👁️ Window focused:', data.windowId);
                this.updateStatus();
            });
            this.windowManager.on('window-moved', (data) => {
                console.log('📍 Window moved:', data.windowId, data.position);
            });
            this.windowManager.on('window-resized', (data) => {
                console.log('📏 Window resized:', data.windowId, data.size);
            });
            // Update status
            this.updateStatus();
            console.log('✅ Window manager initialized successfully');
        }
        catch (error) {
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
    setupEventHandlers() {
        this.logger.init('Setting up event handlers...');
        // Open example window
        this.elements.openExampleWindow?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openExampleWindow', {
                disabled: event.target?.disabled,
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
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.moveExampleWindow(-50, 0);
        });
        this.elements.moveWindowRight?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: moveWindowRight', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.moveExampleWindow(50, 0);
        });
        this.elements.moveWindowUp?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: moveWindowUp', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.moveExampleWindow(0, -50);
        });
        this.elements.moveWindowDown?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: moveWindowDown', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.moveExampleWindow(0, 50);
        });
        // Size control handlers
        this.elements.increaseWidth?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: increaseWidth', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.resizeExampleWindow(50, 0);
        });
        this.elements.decreaseWidth?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: decreaseWidth', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.resizeExampleWindow(-50, 0);
        });
        this.elements.increaseHeight?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: increaseHeight', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.resizeExampleWindow(0, 50);
        });
        this.elements.decreaseHeight?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: decreaseHeight', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.resizeExampleWindow(0, -50);
        });
        // Interactive windows handlers
        this.elements.openInteractiveModal?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openInteractiveModal', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.openInteractiveModal();
        });
        this.elements.openSettingsModal?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openSettingsModal', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.openSettingsModal();
        });
        this.elements.showAlert?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: showAlert', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.showAlert();
        });
        this.elements.showConfirm?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: showConfirm', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.showConfirm();
        });
    }
    /**
     * Open an example window with custom content
     */
    openExampleWindow() {
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
                theme: _components_advanced_overlay_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.DISCORD
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
        }
        catch (error) {
            this.logger.error('Failed to create example window:', error);
            alert('Failed to create window: ' + error);
        }
    }
    /**
     * Close the example window
     */
    closeExampleWindow() {
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
        }
        catch (error) {
            this.logger.error('Failed to close example window:', error);
        }
    }
    /**
     * Move the example window by delta x and y
     */
    moveExampleWindow(deltaX, deltaY) {
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
    resizeExampleWindow(deltaWidth, deltaHeight) {
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
    openMultipleWindows() {
        if (!this.windowManager) {
            alert('Window manager not available. Please run in Alt1.');
            return;
        }
        const windowConfigs = [
            {
                title: '🎨 Theme Demo - RuneScape',
                x: 100, y: 200, width: 300, height: 200,
                theme: _components_advanced_overlay_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.RUNESCAPE,
                contentType: 'custom'
            },
            {
                title: '🌙 Theme Demo - Dark',
                x: 450, y: 200, width: 300, height: 200,
                theme: _components_advanced_overlay_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.DARK,
                contentType: 'custom'
            },
            {
                title: '☀️ Theme Demo - Light',
                x: 800, y: 200, width: 300, height: 200,
                theme: _components_advanced_overlay_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.LIGHT,
                contentType: 'custom'
            }
        ];
        try {
            windowConfigs.forEach((config, index) => {
                const window = this.windowManager.createWindow(config);
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
        }
        catch (error) {
            console.error('❌ Failed to create demo windows:', error);
            alert('Failed to create demo windows: ' + error);
        }
    }
    /**
     * Close all windows
     */
    closeAllWindows() {
        if (!this.windowManager)
            return;
        try {
            this.windowManager.closeAllWindows();
            this.exampleWindow = null;
            this.additionalWindows = [];
            console.log('✅ All windows closed');
        }
        catch (error) {
            console.error('❌ Failed to close all windows:', error);
        }
    }
    /**
     * Render content for the example window
     */
    renderExampleWindowContent(window) {
        if (!window.alt1)
            return;
        const { x, y } = window.position;
        const contentY = y + 40; // Below title bar
        // Background for content area
        window.alt1.overLayRect(0x36393FE0, // Slightly transparent dark background
        x + 5, contentY, window.size.width - 10, window.size.height - 50, 60000, 0);
        // Title
        window.alt1.overLayText('Interactive Example Window', 0xFFFFFFFF, 16, x + 15, contentY + 25, 60000);
        // Instructions
        window.alt1.overLayText('• Note: Alt1 overlays are visual only', 0xDCDDDEFF, 12, x + 15, contentY + 50, 60000);
        window.alt1.overLayText('• Use main window buttons to control', 0xDCDDDEFF, 12, x + 15, contentY + 70, 60000);
        window.alt1.overLayText('• Click to focus, use × to close', 0xDCDDDEFF, 12, x + 15, contentY + 90, 60000);
        // Current position display
        window.alt1.overLayText(`Position: (${window.position.x}, ${window.position.y})`, 0x74C0FCFF, 11, x + 15, contentY + 120, 60000);
        window.alt1.overLayText(`Size: ${window.size.width}×${window.size.height}`, 0x74C0FCFF, 11, x + 15, contentY + 140, 60000);
        // Interaction indicator
        const mousePos = this.windowManager?.getMousePosition();
        if (mousePos) {
            window.alt1.overLayText(`Mouse: (${mousePos.x}, ${mousePos.y})`, 0x51CF66FF, 11, x + 15, contentY + 160, 60000);
        }
    }
    /**
     * Render content for theme demo windows
     */
    renderThemeWindowContent(window, windowNumber) {
        if (!window.alt1)
            return;
        const { x, y } = window.position;
        const contentY = y + 40;
        // Theme info
        const themes = ['RuneScape', 'Dark', 'Light'];
        const themeName = themes[windowNumber - 1] || 'Custom';
        window.alt1.overLayText(`${themeName} Theme Demo`, 0xFFFFFFFF, 14, x + 15, contentY + 25, 60000);
        window.alt1.overLayText('This window demonstrates', 0xDCDDDEFF, 11, x + 15, contentY + 50, 60000);
        window.alt1.overLayText(`the ${themeName.toLowerCase()} theme styling`, 0xDCDDDEFF, 11, x + 15, contentY + 70, 60000);
        window.alt1.overLayText('with custom colors and effects.', 0xDCDDDEFF, 11, x + 15, contentY + 90, 60000);
        // Window number indicator
        window.alt1.overLayText(`Window #${windowNumber}`, 0x74C0FCFF, 12, x + 15, contentY + 120, 60000);
    }
    /**
     * Update button states based on current window state
     */
    updateButtonStates() {
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
    updateStatus() {
        if (!this.windowManager)
            return;
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
    /**
     * Interactive Windows Methods
     */
    openInteractiveModal() {
        this.logger.window('openInteractiveModal() called');
        if (!this.interactiveWindowManager) {
            this.logger.error('openInteractiveModal failed: Interactive window manager not available');
            alert('Interactive window manager not available.');
            return;
        }
        try {
            const modal = this.interactiveWindowManager.createModal({
                title: '🎯 Interactive Modal Window',
                width: 500,
                height: 400,
                content: `
                    <div style="padding: 20px; font-family: Arial, sans-serif;">
                        <h2>🎉 This is a Truly Interactive Window!</h2>
                        <p>Unlike Alt1 overlays, this window can:</p>
                        <ul>
                            <li>✅ Be dragged by clicking and dragging the title bar</li>
                            <li>✅ Be resized by dragging the edges and corners</li>
                            <li>✅ Be closed by clicking the X button</li>
                            <li>✅ Receive mouse clicks and keyboard input</li>
                        </ul>
                        <div style="margin: 20px 0; padding: 15px; background: #f0f8ff; border-radius: 5px;">
                            <strong>Try these interactions:</strong>
                            <br><button onclick="alert('Button clicked!')">Click me!</button>
                            <input type="text" placeholder="Type something..." style="margin-left: 10px;">
                        </div>
                        <p style="color: #666; font-size: 12px;">
                            This demonstrates the power of DOM-based windows vs. Alt1 overlays.
                        </p>
                    </div>
                `,
                resizable: true,
                draggable: true,
                closable: true
            });
            this.logger.success('Interactive modal created:', modal.id);
        }
        catch (error) {
            this.logger.error('Failed to create interactive modal:', error);
        }
    }
    openSettingsModal() {
        this.logger.window('openSettingsModal() called');
        if (!this.interactiveWindowManager) {
            this.logger.error('openSettingsModal failed: Interactive window manager not available');
            return;
        }
        try {
            const settingsTemplate = (0,_components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_2__.createSettingsTemplate)({
                title: 'Plugin Settings',
                sections: [
                    {
                        title: 'Display Settings',
                        fields: [
                            { label: 'Window Opacity', type: 'range', key: 'opacity', value: 90, min: 10, max: 100 },
                            { label: 'Show Tooltips', type: 'checkbox', key: 'showTooltips', value: true },
                            { label: 'Theme', type: 'select', key: 'theme', value: 'dark', options: [
                                    { label: 'Dark', value: 'dark' },
                                    { label: 'Light', value: 'light' },
                                    { label: 'RuneScape', value: 'runescape' }
                                ] }
                        ]
                    },
                    {
                        title: 'Performance',
                        fields: [
                            { label: 'Update Interval (ms)', type: 'number', key: 'updateInterval', value: 100, min: 50, max: 1000 },
                            { label: 'Debug Mode', type: 'checkbox', key: 'debugMode', value: false },
                            { label: 'Log Level', type: 'select', key: 'logLevel', value: 'info', options: [
                                    { label: 'Error', value: 'error' },
                                    { label: 'Warning', value: 'warning' },
                                    { label: 'Info', value: 'info' },
                                    { label: 'Debug', value: 'debug' }
                                ] }
                        ]
                    },
                    {
                        title: 'Advanced',
                        fields: [
                            { label: 'Custom CSS', type: 'textarea', key: 'customCss', value: '', placeholder: 'Enter custom CSS...' },
                            { label: 'Max Windows', type: 'number', key: 'maxWindows', value: 5, min: 1, max: 20 }
                        ]
                    }
                ],
                onSave: (values) => {
                    this.logger.success('Settings saved:', values);
                    alert(`Settings saved!\n\n${JSON.stringify(values, null, 2)}`);
                    // Here you would typically save to localStorage or send to server
                },
                onCancel: () => {
                    this.logger.ui('Settings cancelled');
                }
            });
            const modal = this.interactiveWindowManager.createSettingsModal('⚙️ Plugin Settings', settingsTemplate);
            this.logger.success('Settings modal created:', modal.id);
        }
        catch (error) {
            this.logger.error('Failed to create settings modal:', error);
        }
    }
    async showAlert() {
        this.logger.ui('showAlert() called');
        if (!this.interactiveWindowManager) {
            this.logger.error('showAlert failed: Interactive window manager not available');
            return;
        }
        try {
            await this.interactiveWindowManager.alert('📢 Alert Dialog', 'This is an interactive alert dialog!\n\nIt can display multi-line messages and wait for user confirmation.');
            this.logger.success('Alert dialog completed');
        }
        catch (error) {
            this.logger.error('Failed to show alert:', error);
        }
    }
    async showConfirm() {
        this.logger.ui('showConfirm() called');
        if (!this.interactiveWindowManager) {
            this.logger.error('showConfirm failed: Interactive window manager not available');
            return;
        }
        try {
            const result = await this.interactiveWindowManager.confirm('❓ Confirmation Dialog', 'This is an interactive confirmation dialog.\n\nDo you want to proceed with this action?');
            if (result) {
                this.logger.success('User confirmed the action');
                alert('You clicked OK! ✅');
            }
            else {
                this.logger.ui('User cancelled the action');
                alert('You clicked Cancel! ❌');
            }
        }
        catch (error) {
            this.logger.error('Failed to show confirm dialog:', error);
        }
    }
}
// Initialize the app when the script loads
const testApp = new AdvancedWindowsTestApp();
// Export for global access (useful for debugging)
if (typeof window !== 'undefined') {
    window.testApp = testApp;
}
console.log('📦 Advanced Windows Test Plugin loaded successfully');


/***/ }),

/***/ "./logger.ts":
/*!*******************!*\
  !*** ./logger.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alt1Logger: () => (/* binding */ Alt1Logger),
/* harmony export */   LogLevel: () => (/* binding */ LogLevel)
/* harmony export */ });
/**
 * Standard logger implementation for TMG Alt1 Toolset applications
 * Provides consistent, categorized logging with visual indicators
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
class Alt1Logger {
    constructor(appName, logLevel = LogLevel.INFO) {
        this.appName = appName;
        this.logLevel = logLevel;
    }
    // Lifecycle logging
    init(message, ...args) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🚀 [${this.appName}] ${message}`, ...args);
        }
    }
    success(message, ...args) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`✅ [${this.appName}] ${message}`, ...args);
        }
    }
    error(message, error, ...args) {
        if (this.logLevel <= LogLevel.ERROR) {
            console.error(`❌ [${this.appName}] ${message}`, error, ...args);
        }
    }
    warn(message, ...args) {
        if (this.logLevel <= LogLevel.WARN) {
            console.warn(`⚠️ [${this.appName}] ${message}`, ...args);
        }
    }
    debug(message, ...args) {
        if (this.logLevel <= LogLevel.DEBUG) {
            console.log(`🐛 [${this.appName}] ${message}`, ...args);
        }
    }
    // Category-specific methods
    alt1(message, ...args) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🔧 [Alt1] ${message}`, ...args);
        }
    }
    window(message, ...args) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🪟 [Windows] ${message}`, ...args);
        }
    }
    ui(message, ...args) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🎮 [UI] ${message}`, ...args);
        }
    }
    perf(message, ...args) {
        if (this.logLevel <= LogLevel.DEBUG) {
            console.log(`📊 [Perf] ${message}`, ...args);
        }
    }
    ocr(message, ...args) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🔍 [OCR] ${message}`, ...args);
        }
    }
    data(message, ...args) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`💾 [Data] ${message}`, ...args);
        }
    }
    network(message, ...args) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🌐 [Network] ${message}`, ...args);
        }
    }
    // Performance timing helpers
    time(operation) {
        console.time(`⏱️ [Perf] ${operation}`);
    }
    timeEnd(operation) {
        console.timeEnd(`⏱️ [Perf] ${operation}`);
    }
    // Group logging for complex operations
    group(label) {
        console.group(`📁 [${this.appName}] ${label}`);
    }
    groupEnd() {
        console.groupEnd();
    }
}


/***/ }),

/***/ "canvas":
/*!*************************!*\
  !*** external "canvas" ***!
  \*************************/
/***/ ((module) => {

"use strict";
if(typeof __WEBPACK_EXTERNAL_MODULE_canvas__ === 'undefined') { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_canvas__;

/***/ }),

/***/ "electron/common":
/*!**********************************!*\
  !*** external "electron/common" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
if(typeof __WEBPACK_EXTERNAL_MODULE_electron_common__ === 'undefined') { var e = new Error("Cannot find module 'electron/common'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_electron_common__;

/***/ }),

/***/ "sharp":
/*!************************!*\
  !*** external "sharp" ***!
  \************************/
/***/ ((module) => {

"use strict";
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
/******/ 		var chunkLoadingGlobal = this["webpackChunkAdvancedWindowsTest"] = this["webpackChunkAdvancedWindowsTest"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_alt1_dist_base_index_js"], () => (__webpack_require__("./index.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.bundle.js.map