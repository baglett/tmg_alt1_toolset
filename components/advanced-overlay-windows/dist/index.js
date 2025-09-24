(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("alt1"));
	else if(typeof define === 'function' && define.amd)
		define(["alt1"], factory);
	else if(typeof exports === 'object')
		exports["AdvancedOverlayWindows"] = factory(require("alt1"));
	else
		root["AdvancedOverlayWindows"] = factory(root["alt1"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_alt1__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./InteractionDetector.ts":
/*!********************************!*\
  !*** ./InteractionDetector.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InteractionDetector: () => (/* binding */ InteractionDetector)
/* harmony export */ });
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt1 */ "alt1");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OverlayWindow: () => (/* binding */ OverlayWindow)
/* harmony export */ });
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt1 */ "alt1");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Individual overlay window with advanced rendering and interaction capabilities
 */
class OverlayWindow {
    // Default theme - lazy initialization to avoid alt1lib import issues
    static getDefaultTheme() {
        return {
            titleBarColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(88, 101, 242, 240), // Discord purple
            titleBarTextColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(255, 255, 255, 255), // White text
            borderColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(88, 101, 242, 255), // Purple border
            backgroundColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(47, 49, 54, 240), // Dark background
            shadowColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(0, 0, 0, 80), // Dark shadow
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
            window.alt1.overLayFreezeGroup(this.state.overlayGroup, true);
            // Render window components
            this.renderShadow();
            this.renderFrame();
            this.renderTitleBar();
            this.renderContent();
            this.renderControlButtons();
            // Unfreeze group to display overlays
            window.alt1.overLayFreezeGroup(this.state.overlayGroup, false);
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
        // Main window background
        window.alt1.overLayRect(this.theme.backgroundColor, x, y, width, height, 60000, 0);
        // Border with focus highlight
        const borderColor = this.state.isFocused
            ? this.theme.accentColor
            : this.theme.borderColor;
        window.alt1.overLayRect(borderColor, x - this.borderWidth, y - this.borderWidth, width + (this.borderWidth * 2), height + (this.borderWidth * 2), 60000, this.borderWidth);
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
            // Close button background
            window.alt1.overLayRect(alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(220, 53, 69, 200), // Red background
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OverlayWindowManager: () => (/* binding */ OverlayWindowManager)
/* harmony export */ });
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt1 */ "alt1");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _OverlayWindow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OverlayWindow */ "./OverlayWindow.ts");
/* harmony import */ var _InteractionDetector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InteractionDetector */ "./InteractionDetector.ts");



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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InteractionDetector: () => (/* reexport safe */ _InteractionDetector__WEBPACK_IMPORTED_MODULE_2__.InteractionDetector),
/* harmony export */   OverlayWindow: () => (/* reexport safe */ _OverlayWindow__WEBPACK_IMPORTED_MODULE_1__.OverlayWindow),
/* harmony export */   OverlayWindowManager: () => (/* reexport safe */ _OverlayWindowManager__WEBPACK_IMPORTED_MODULE_0__.OverlayWindowManager),
/* harmony export */   WindowThemes: () => (/* binding */ WindowThemes),
/* harmony export */   createWindowManager: () => (/* binding */ createWindowManager),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _OverlayWindowManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OverlayWindowManager */ "./OverlayWindowManager.ts");
/* harmony import */ var _OverlayWindow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OverlayWindow */ "./OverlayWindow.ts");
/* harmony import */ var _InteractionDetector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InteractionDetector */ "./InteractionDetector.ts");
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

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map