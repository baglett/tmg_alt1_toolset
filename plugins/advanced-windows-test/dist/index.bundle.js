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

/***/ "../../../components/interactive-windows/dist/index.js":
/*!*************************************************************!*\
  !*** ../../../components/interactive-windows/dist/index.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(/*! alt1 */ "../../../node_modules/alt1/dist/base/index.js"));
	else // removed by dead control flow
{}
})(self, (__WEBPACK_EXTERNAL_MODULE_alt1__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/HybridWindow.ts":
/*!*****************************!*\
  !*** ./src/HybridWindow.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_755__) => {

__nested_webpack_require_755__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_755__.d(__nested_webpack_exports__, {
/* harmony export */   HybridWindow: () => (/* binding */ HybridWindow)
/* harmony export */ });
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_755__(/*! alt1 */ "alt1");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_755__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Hybrid Window System
 *
 * Combines Alt1 overlays for positioning with DOM elements for interactivity.
 * This allows windows to be positioned anywhere on the RuneScape window while
 * maintaining full interactive capabilities within content areas.
 */

class HybridWindow {
    constructor(config) {
        this._overlayUpdateInterval = null;
        this._eventHandlers = new Map();
        this._id = this.generateId();
        this._config = {
            useOverlayChrome: true,
            overlayColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(100, 100, 100, 255),
            overlayLineWidth: 2,
            overlayDuration: 100, // Short duration, updated frequently
            ...config
        };
        // Initialize state with RS coordinates if provided
        this._state = {
            id: this._id,
            position: {
                x: config.rsX ?? 100,
                y: config.rsY ?? 100
            },
            size: { width: config.width, height: config.height },
            visible: false,
            focused: false,
            minimized: false,
            maximized: false,
            dragging: false,
            resizing: false
        };
        this.createElement();
        this.setupEventHandlers();
    }
    // Public API
    get id() { return this._id; }
    get state() { return { ...this._state }; }
    get element() { return this._domElement; }
    show() {
        this._state.visible = true;
        this._domElement.style.display = 'block';
        this.updateDOMPosition();
        this.startOverlayUpdates();
        this.emit('window-shown');
    }
    hide() {
        this._state.visible = false;
        this._domElement.style.display = 'none';
        this.stopOverlayUpdates();
        this.emit('window-hidden');
    }
    close() {
        this.hide();
        this.cleanup();
        this.emit('window-closed');
    }
    focus() {
        this._state.focused = true;
        this._domElement.style.zIndex = '10000';
        this.emit('window-focused');
    }
    blur() {
        this._state.focused = false;
        this._domElement.style.zIndex = '9000';
        this.emit('window-blurred');
    }
    // Position methods (using RS coordinates)
    setRSPosition(rsX, rsY) {
        this._state.position.x = rsX;
        this._state.position.y = rsY;
        this.updateDOMPosition();
        this.emit('window-moved', { rsX, rsY });
    }
    setSize(width, height) {
        this._state.size.width = width;
        this._state.size.height = height;
        this.updateDOMPosition();
        this.emit('window-resized', { width, height });
    }
    setContent(content) {
        if (typeof content === 'string') {
            this._contentElement.innerHTML = content;
        }
        else {
            this._contentElement.innerHTML = '';
            this._contentElement.appendChild(content);
        }
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
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
        else {
            this._eventHandlers.delete(event);
        }
    }
    // Private methods
    generateId() {
        return `hybrid-window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    createElement() {
        // Create main container (invisible DOM element for positioning)
        this._domElement = document.createElement('div');
        this._domElement.className = 'hybrid-window';
        this._domElement.style.cssText = `
            position: absolute;
            display: none;
            pointer-events: none;
            z-index: 9000;
        `;
        // Create content area (interactive DOM element)
        this._contentElement = document.createElement('div');
        this._contentElement.className = 'hybrid-window-content';
        this._contentElement.style.cssText = `
            position: absolute;
            left: ${this._config.overlayLineWidth || 2}px;
            top: 30px; /* Account for title bar */
            right: ${this._config.overlayLineWidth || 2}px;
            bottom: ${this._config.overlayLineWidth || 2}px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 4px;
            overflow: auto;
            pointer-events: all;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
        `;
        this._domElement.appendChild(this._contentElement);
        document.body.appendChild(this._domElement);
        // Set initial content
        if (this._config.content) {
            if (typeof this._config.content === 'string' || this._config.content instanceof HTMLElement) {
                this.setContent(this._config.content);
            }
            else {
                // Handle WindowContentConfig case
                this.setContent(this._config.content.source);
            }
        }
    }
    setupEventHandlers() {
        // Handle content area interactions
        this._contentElement.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.focus();
        });
        // Handle close button (if implemented in overlay)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._state.focused && this._config.closable) {
                this.close();
            }
        });
    }
    updateDOMPosition() {
        if (!this._state.visible || !window.alt1)
            return;
        // Convert RS coordinates to screen coordinates
        const domPosition = this.convertRSToDOMCoordinates(this._state.position.x, this._state.position.y);
        // Update DOM element position
        this._domElement.style.left = `${domPosition.x}px`;
        this._domElement.style.top = `${domPosition.y}px`;
        this._domElement.style.width = `${this._state.size.width}px`;
        this._domElement.style.height = `${this._state.size.height}px`;
    }
    convertRSToDOMCoordinates(rsX, rsY) {
        // Get the Alt1 plugin's position relative to the RS window
        // This is a simplification - in reality we'd need to account for:
        // 1. RS window position on screen
        // 2. Alt1 plugin position within RS window
        // 3. Coordinate transformations
        // For now, use the plugin window as the coordinate system
        // In a full implementation, we'd need Alt1 APIs to get window positions
        return { x: rsX, y: rsY };
    }
    startOverlayUpdates() {
        if (!this._config.useOverlayChrome || !window.alt1)
            return;
        this.stopOverlayUpdates(); // Clear any existing interval
        const updateOverlay = () => {
            if (!this._state.visible)
                return;
            const { x, y } = this._state.position;
            const { width, height } = this._state.size;
            const color = this._config.overlayColor;
            const lineWidth = this._config.overlayLineWidth;
            const duration = this._config.overlayDuration;
            // Draw window chrome using Alt1 overlays
            if (window.alt1) {
                // Main window border
                window.alt1.overLayRect(color, x, y, width, height, duration, lineWidth);
                // Title bar
                const titleBarHeight = 30;
                window.alt1.overLayRect(alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(80, 80, 80, 255), x, y, width, titleBarHeight, duration, 0);
                // Title text
                if (this._config.title) {
                    window.alt1.overLayText(this._config.title, alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(255, 255, 255, 255), 14, x + 10, y + 8, duration);
                }
                // Close button (if closable)
                if (this._config.closable) {
                    const closeX = x + width - 25;
                    const closeY = y + 5;
                    window.alt1.overLayRect(alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(200, 50, 50, 255), closeX, closeY, 20, 20, duration, 1);
                    window.alt1.overLayText('×', alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(255, 255, 255, 255), 16, closeX + 7, closeY + 2, duration);
                }
            }
        };
        // Update overlay regularly (slightly less than overlay duration)
        updateOverlay(); // Initial update
        this._overlayUpdateInterval = window.setInterval(updateOverlay, this._config.overlayDuration - 10);
    }
    stopOverlayUpdates() {
        if (this._overlayUpdateInterval) {
            clearInterval(this._overlayUpdateInterval);
            this._overlayUpdateInterval = null;
        }
    }
    emit(event, data) {
        if (this._eventHandlers.has(event)) {
            this._eventHandlers.get(event).forEach(handler => {
                try {
                    handler({ window: this, type: event, data });
                }
                catch (error) {
                    console.error('Error in window event handler:', error);
                }
            });
        }
    }
    cleanup() {
        this.stopOverlayUpdates();
        this._eventHandlers.clear();
        if (this._domElement && this._domElement.parentNode) {
            this._domElement.parentNode.removeChild(this._domElement);
        }
    }
}


/***/ }),

/***/ "./src/HybridWindowManager.ts":
/*!************************************!*\
  !*** ./src/HybridWindowManager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_11095__) => {

__nested_webpack_require_11095__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_11095__.d(__nested_webpack_exports__, {
/* harmony export */   HybridWindowManager: () => (/* binding */ HybridWindowManager)
/* harmony export */ });
/* harmony import */ var _HybridWindow__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_11095__(/*! ./HybridWindow */ "./src/HybridWindow.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_11095__(/*! ./types */ "./src/types.ts");
/**
 * Hybrid Window Manager
 *
 * Manages multiple hybrid windows that can be positioned anywhere on the RuneScape
 * window while maintaining interactive content areas using DOM elements.
 */


class HybridWindowManager {
    constructor() {
        this._windows = new Map();
        this._activeWindow = null;
        this._isInitialized = false;
        this.initialize();
    }
    // Public API
    createWindow(config) {
        const window = new _HybridWindow__WEBPACK_IMPORTED_MODULE_0__.HybridWindow(config);
        this._windows.set(window.id, window);
        // Set up window event handlers
        window.on('window-shown', () => this.handleWindowShown(window));
        window.on('window-focused', () => this.handleWindowFocused(window));
        window.on('window-closed', () => this.handleWindowClosed(window));
        return window;
    }
    createModal(config) {
        // Center the modal on the RuneScape window
        const rsWidth = window.alt1?.rsWidth || 800;
        const rsHeight = window.alt1?.rsHeight || 600;
        const modalConfig = {
            ...config,
            rsX: config.rsX ?? Math.max(0, (rsWidth - config.width) / 2),
            rsY: config.rsY ?? Math.max(0, (rsHeight - config.height) / 2),
            draggable: config.draggable ?? true,
            closable: config.closable ?? true,
            resizable: config.resizable ?? false
        };
        const modal = this.createWindow(modalConfig);
        modal.show();
        modal.focus();
        return modal;
    }
    createSettingsModal(title, settingsElement) {
        return this.createModal({
            title,
            width: 500,
            height: 400,
            content: settingsElement,
            theme: _types__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.MODERN_DARK,
            draggable: true,
            resizable: true,
            closable: true
        });
    }
    // Dialog methods with Alt1 coordinate positioning
    async alert(title, message, rsX, rsY) {
        return new Promise((resolve) => {
            const alertContent = `
                <div style="padding: 20px; text-align: center; font-family: 'Segoe UI', sans-serif;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">${title}</h3>
                    <p style="margin: 0 0 20px 0; line-height: 1.5; color: #666;">${message}</p>
                    <button id="alert-ok-btn" style="background: #007ACC; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                        OK
                    </button>
                </div>
            `;
            const modal = this.createModal({
                title: '📢 Alert',
                width: 400,
                height: 200,
                content: alertContent,
                rsX,
                rsY,
                closable: true
            });
            // Handle OK button click
            const handleOK = () => {
                modal.close();
                resolve();
            };
            // Set up event handlers after content is rendered
            setTimeout(() => {
                const okBtn = modal.element.querySelector('#alert-ok-btn');
                if (okBtn) {
                    okBtn.addEventListener('click', handleOK);
                }
            }, 10);
            // Handle window close
            modal.on('window-closed', () => resolve());
        });
    }
    async confirm(title, message, rsX, rsY) {
        return new Promise((resolve) => {
            const confirmContent = `
                <div style="padding: 20px; text-align: center; font-family: 'Segoe UI', sans-serif;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">${title}</h3>
                    <p style="margin: 0 0 20px 0; line-height: 1.5; color: #666;">${message}</p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="confirm-yes-btn" style="background: #28A745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                            Yes
                        </button>
                        <button id="confirm-no-btn" style="background: #DC3545; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                            No
                        </button>
                    </div>
                </div>
            `;
            const modal = this.createModal({
                title: '❓ Confirm',
                width: 400,
                height: 200,
                content: confirmContent,
                rsX,
                rsY,
                closable: true
            });
            const handleYes = () => {
                modal.close();
                resolve(true);
            };
            const handleNo = () => {
                modal.close();
                resolve(false);
            };
            // Set up event handlers after content is rendered
            setTimeout(() => {
                const yesBtn = modal.element.querySelector('#confirm-yes-btn');
                const noBtn = modal.element.querySelector('#confirm-no-btn');
                if (yesBtn)
                    yesBtn.addEventListener('click', handleYes);
                if (noBtn)
                    noBtn.addEventListener('click', handleNo);
            }, 10);
            // Handle window close (default to No)
            modal.on('window-closed', () => resolve(false));
        });
    }
    // Window management
    getVisibleWindows() {
        return Array.from(this._windows.values()).filter(w => w.state.visible);
    }
    closeAllWindows() {
        this._windows.forEach(window => window.close());
    }
    // Layout management for full RS window
    cascadeWindows() {
        const visibleWindows = this.getVisibleWindows();
        let offsetX = 50;
        let offsetY = 50;
        visibleWindows.forEach((window, index) => {
            window.setRSPosition(offsetX + (index * 30), offsetY + (index * 30));
        });
    }
    tileWindows() {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0)
            return;
        const rsWidth = window.alt1?.rsWidth || 800;
        const rsHeight = window.alt1?.rsHeight || 600;
        // Calculate grid dimensions
        const cols = Math.ceil(Math.sqrt(visibleWindows.length));
        const rows = Math.ceil(visibleWindows.length / cols);
        const windowWidth = Math.floor(rsWidth / cols) - 20;
        const windowHeight = Math.floor(rsHeight / rows) - 20;
        visibleWindows.forEach((window, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * (windowWidth + 20) + 10;
            const y = row * (windowHeight + 20) + 10;
            window.setRSPosition(x, y);
            window.setSize(windowWidth, windowHeight);
        });
    }
    centerWindow(window) {
        const rsWidth = globalThis.alt1?.rsWidth || 800;
        const rsHeight = globalThis.alt1?.rsHeight || 600;
        const centerX = Math.max(0, (rsWidth - window.state.size.width) / 2);
        const centerY = Math.max(0, (rsHeight - window.state.size.height) / 2);
        window.setRSPosition(centerX, centerY);
    }
    // Private methods
    initialize() {
        if (this._isInitialized)
            return;
        // Check Alt1 availability
        if (!window.alt1) {
            console.warn('HybridWindowManager: Alt1 not available, overlay features disabled');
        }
        // Set up global event handlers
        this.setupGlobalEventHandlers();
        this._isInitialized = true;
    }
    setupGlobalEventHandlers() {
        // Handle clicking outside windows to blur focus
        document.addEventListener('mousedown', (e) => {
            let clickedInWindow = false;
            for (const window of this._windows.values()) {
                if (window.element.contains(e.target)) {
                    clickedInWindow = true;
                    break;
                }
            }
            if (!clickedInWindow && this._activeWindow) {
                this._activeWindow.blur();
                this._activeWindow = null;
            }
        });
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt+Tab: cycle through windows
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                this.cycleWindows();
            }
            // Ctrl+W: close active window
            if (e.ctrlKey && e.key === 'w' && this._activeWindow) {
                e.preventDefault();
                this._activeWindow.close();
            }
        });
    }
    handleWindowShown(window) {
        // Bring window to front when shown
        window.focus();
    }
    handleWindowFocused(window) {
        // Blur other windows
        if (this._activeWindow && this._activeWindow !== window) {
            this._activeWindow.blur();
        }
        this._activeWindow = window;
    }
    handleWindowClosed(window) {
        this._windows.delete(window.id);
        if (this._activeWindow === window) {
            this._activeWindow = null;
        }
    }
    cycleWindows() {
        const visibleWindows = this.getVisibleWindows();
        if (visibleWindows.length === 0)
            return;
        const currentIndex = this._activeWindow ?
            visibleWindows.indexOf(this._activeWindow) : -1;
        const nextIndex = (currentIndex + 1) % visibleWindows.length;
        visibleWindows[nextIndex].focus();
    }
}


/***/ }),

/***/ "./src/InteractiveWindow.ts":
/*!**********************************!*\
  !*** ./src/InteractiveWindow.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_21566__) => {

__nested_webpack_require_21566__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_21566__.d(__nested_webpack_exports__, {
/* harmony export */   InteractiveWindow: () => (/* binding */ InteractiveWindow)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_21566__(/*! ./types */ "./src/types.ts");
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
        // Use current state size if available, otherwise use config values
        const width = this._state?.size?.width || this._config.width;
        const height = this._state?.size?.height || this._config.height;
        return {
            x: Math.max(0, (window.innerWidth - width) / 2),
            y: Math.max(0, (window.innerHeight - height) / 2)
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
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_43993__) => {

__nested_webpack_require_43993__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_43993__.d(__nested_webpack_exports__, {
/* harmony export */   InteractiveWindowManager: () => (/* binding */ InteractiveWindowManager)
/* harmony export */ });
/* harmony import */ var _InteractiveWindow__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_43993__(/*! ./InteractiveWindow */ "./src/InteractiveWindow.ts");
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
            const windowZIndex = window.state.zIndex || 0;
            if (window.isVisible() && windowZIndex > maxZIndex) {
                maxZIndex = windowZIndex;
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
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_57298__) => {

__nested_webpack_require_57298__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_57298__.d(__nested_webpack_exports__, {
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
/******/ 	function __nested_webpack_require_60671__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_60671__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nested_webpack_require_60671__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nested_webpack_require_60671__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_60671__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_60671__.o(definition, key) && !__nested_webpack_require_60671__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_60671__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_60671__.r = (exports) => {
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
__nested_webpack_require_60671__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_60671__.d(__nested_webpack_exports__, {
/* harmony export */   HybridWindow: () => (/* reexport safe */ _HybridWindow__WEBPACK_IMPORTED_MODULE_3__.HybridWindow),
/* harmony export */   HybridWindowManager: () => (/* reexport safe */ _HybridWindowManager__WEBPACK_IMPORTED_MODULE_2__.HybridWindowManager),
/* harmony export */   InteractiveWindow: () => (/* reexport safe */ _InteractiveWindow__WEBPACK_IMPORTED_MODULE_1__.InteractiveWindow),
/* harmony export */   InteractiveWindowManager: () => (/* reexport safe */ _InteractiveWindowManager__WEBPACK_IMPORTED_MODULE_0__.InteractiveWindowManager),
/* harmony export */   WindowThemes: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_4__.WindowThemes),
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
/* harmony import */ var _InteractiveWindowManager__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_60671__(/*! ./InteractiveWindowManager */ "./src/InteractiveWindowManager.ts");
/* harmony import */ var _InteractiveWindow__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_60671__(/*! ./InteractiveWindow */ "./src/InteractiveWindow.ts");
/* harmony import */ var _HybridWindowManager__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_60671__(/*! ./HybridWindowManager */ "./src/HybridWindowManager.ts");
/* harmony import */ var _HybridWindow__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_60671__(/*! ./HybridWindow */ "./src/HybridWindow.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_60671__(/*! ./types */ "./src/types.ts");
/**
 * Interactive Windows Component - Main Export
 *
 * Provides truly interactive modal window system for Alt1 applications
 * with full drag, resize, close functionality using DOM-based windows.
 */

// Main exports


// Hybrid window exports (Alt1 full-screen positioning)


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

/***/ "../../../components/window-resizer/dist/index.js":
/*!********************************************************!*\
  !*** ../../../components/window-resizer/dist/index.js ***!
  \********************************************************/
/***/ (function(module) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else // removed by dead control flow
{}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./LayoutManager.ts":
/*!**************************!*\
  !*** ./LayoutManager.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_661__) => {

__nested_webpack_require_661__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_661__.d(__nested_webpack_exports__, {
/* harmony export */   LayoutManager: () => (/* binding */ LayoutManager)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_661__(/*! ./types */ "./types.ts");
/**
 * Window Layout Manager
 *
 * Manages predefined and custom window layouts
 */

class LayoutManager {
    constructor(resizer) {
        this.layouts = new Map();
        this.currentLayout = _types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.COMPACT;
        this.resizer = resizer;
        this.initializeBuiltInLayouts();
    }
    /**
     * Switch to a specific layout
     */
    async switchLayout(layoutName, options = {}) {
        const layout = this.layouts.get(layoutName);
        if (!layout) {
            return {
                success: false,
                method: 'failed',
                error: `Layout '${layoutName}' not found`,
                executionTime: 0
            };
        }
        try {
            const result = await this.resizer.resizeWindow(layout.width, layout.height, options);
            if (result.success) {
                this.currentLayout = layoutName;
                // Save current layout to localStorage
                this.saveCurrentLayout();
            }
            return result;
        }
        catch (error) {
            return {
                success: false,
                method: 'failed',
                error: `Failed to switch to layout '${layoutName}': ${error instanceof Error ? error.message : String(error)}`,
                executionTime: 0
            };
        }
    }
    /**
     * Add a custom layout
     */
    addLayout(layout) {
        // Validate layout
        if (!layout.name || layout.width < 100 || layout.height < 100) {
            throw new Error('Invalid layout: name is required and dimensions must be at least 100x100');
        }
        this.layouts.set(layout.name, { ...layout });
        this.saveLayoutsToStorage();
    }
    /**
     * Remove a layout
     */
    removeLayout(layoutName) {
        // Don't allow removing built-in layouts
        if (Object.values(_types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS).includes(layoutName)) {
            return false;
        }
        const removed = this.layouts.delete(layoutName);
        if (removed) {
            this.saveLayoutsToStorage();
            // If removing current layout, switch to compact
            if (this.currentLayout === layoutName) {
                this.currentLayout = _types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.COMPACT;
                this.saveCurrentLayout();
            }
        }
        return removed;
    }
    /**
     * Get a specific layout
     */
    getLayout(layoutName) {
        return this.layouts.get(layoutName);
    }
    /**
     * Get all available layouts
     */
    getAllLayouts() {
        return Array.from(this.layouts.values());
    }
    /**
     * Get layouts by category
     */
    getBuiltInLayouts() {
        return Array.from(this.layouts.values()).filter(layout => Object.values(_types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS).includes(layout.name));
    }
    getCustomLayouts() {
        return Array.from(this.layouts.values()).filter(layout => !Object.values(_types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS).includes(layout.name));
    }
    /**
     * Create a layout from current window size
     */
    createLayoutFromCurrent(name, displayName, description) {
        const currentSize = this.resizer.getCurrentSize();
        const layout = {
            name,
            displayName: displayName || name,
            width: currentSize.width,
            height: currentSize.height,
            description,
            minWidth: Math.max(100, currentSize.width - 200),
            maxWidth: currentSize.width + 400,
            minHeight: Math.max(100, currentSize.height - 200),
            maxHeight: currentSize.height + 400
        };
        this.addLayout(layout);
        return layout;
    }
    /**
     * Auto-detect optimal layout based on content
     */
    suggestLayout() {
        const currentSize = this.resizer.getCurrentSize();
        const contentHeight = document.body.scrollHeight;
        const contentWidth = document.body.scrollWidth;
        // If content is overflowing, suggest larger layout
        if (contentHeight > currentSize.height || contentWidth > currentSize.width) {
            if (contentWidth > 800) {
                return this.getLayout(_types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.DASHBOARD);
            }
            else if (contentHeight > 700) {
                return this.getLayout(_types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.TALL);
            }
            else {
                return this.getLayout(_types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.EXPANDED);
            }
        }
        // If window is much larger than content, suggest compact
        if (contentHeight < currentSize.height * 0.6 && contentWidth < currentSize.width * 0.6) {
            return this.getLayout(_types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.COMPACT);
        }
        // Current layout is probably optimal
        return this.getLayout(this.currentLayout) || this.getLayout(_types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.COMPACT);
    }
    /**
     * Restore layout from previous session
     */
    restoreLayout() {
        const saved = localStorage.getItem('alt1-resizer-current-layout');
        if (saved && this.layouts.has(saved)) {
            this.currentLayout = saved;
        }
        // Load custom layouts
        this.loadLayoutsFromStorage();
    }
    // Private methods
    initializeBuiltInLayouts() {
        const builtInLayouts = [
            {
                name: _types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.COMPACT,
                displayName: 'Compact',
                width: 450,
                height: 600,
                description: 'Standard Alt1 plugin size for basic functionality',
                minWidth: 400,
                maxWidth: 500,
                minHeight: 500,
                maxHeight: 700,
                responsive: false
            },
            {
                name: _types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.EXPANDED,
                displayName: 'Expanded',
                width: 700,
                height: 800,
                description: 'Larger window for advanced tools and multiple panels',
                minWidth: 600,
                maxWidth: 900,
                minHeight: 700,
                maxHeight: 1000,
                responsive: true
            },
            {
                name: _types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.WIDE,
                displayName: 'Wide',
                width: 1000,
                height: 600,
                description: 'Wide layout for side-by-side panels and data tables',
                minWidth: 800,
                maxWidth: 1400,
                minHeight: 500,
                maxHeight: 700,
                aspectRatio: 1.67,
                responsive: true
            },
            {
                name: _types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.TALL,
                displayName: 'Tall',
                width: 500,
                height: 900,
                description: 'Tall layout for inventory tools and vertical lists',
                minWidth: 400,
                maxWidth: 600,
                minHeight: 800,
                maxHeight: 1200,
                aspectRatio: 0.56,
                responsive: true
            },
            {
                name: _types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.DASHBOARD,
                displayName: 'Dashboard',
                width: 1200,
                height: 800,
                description: 'Large dashboard for comprehensive multi-tool interfaces',
                minWidth: 1000,
                maxWidth: 1600,
                minHeight: 700,
                maxHeight: 1000,
                aspectRatio: 1.5,
                responsive: true
            },
            {
                name: _types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS.FULLSCREEN,
                displayName: 'Fullscreen',
                width: Math.min(1920, screen.width || 1920),
                height: Math.min(1080, screen.height || 1080),
                description: 'Maximum size for comprehensive interfaces',
                minWidth: 1200,
                maxWidth: 2560,
                minHeight: 800,
                maxHeight: 1600,
                responsive: true
            }
        ];
        builtInLayouts.forEach(layout => {
            this.layouts.set(layout.name, layout);
        });
    }
    saveCurrentLayout() {
        try {
            localStorage.setItem('alt1-resizer-current-layout', this.currentLayout);
        }
        catch (e) {
            console.warn('[LayoutManager] Failed to save current layout to localStorage');
        }
    }
    saveLayoutsToStorage() {
        try {
            const customLayouts = this.getCustomLayouts();
            localStorage.setItem('alt1-resizer-custom-layouts', JSON.stringify(customLayouts));
        }
        catch (e) {
            console.warn('[LayoutManager] Failed to save custom layouts to localStorage');
        }
    }
    loadLayoutsFromStorage() {
        try {
            const saved = localStorage.getItem('alt1-resizer-custom-layouts');
            if (saved) {
                const customLayouts = JSON.parse(saved);
                customLayouts.forEach(layout => {
                    // Don't overwrite built-in layouts
                    if (!Object.values(_types__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_PRESETS).includes(layout.name)) {
                        this.layouts.set(layout.name, layout);
                    }
                });
            }
        }
        catch (e) {
            console.warn('[LayoutManager] Failed to load custom layouts from localStorage');
        }
    }
}


/***/ }),

/***/ "./WindowResizer.ts":
/*!**************************!*\
  !*** ./WindowResizer.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_10988__) => {

__nested_webpack_require_10988__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_10988__.d(__nested_webpack_exports__, {
/* harmony export */   WindowResizer: () => (/* binding */ WindowResizer)
/* harmony export */ });
/* harmony import */ var _strategies_WebAPIStrategy__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_10988__(/*! ./strategies/WebAPIStrategy */ "./strategies/WebAPIStrategy.ts");
/* harmony import */ var _strategies_Alt1NativeStrategy__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_10988__(/*! ./strategies/Alt1NativeStrategy */ "./strategies/Alt1NativeStrategy.ts");
/* harmony import */ var _strategies_ContentExpansionStrategy__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_10988__(/*! ./strategies/ContentExpansionStrategy */ "./strategies/ContentExpansionStrategy.ts");
/**
 * Alt1 Window Resizer
 *
 * Universal Alt1 plugin window resizer with multiple fallback strategies
 */



class WindowResizer {
    constructor(config = {}) {
        this.strategies = [];
        this.capabilities = null;
        this.eventListeners = new Map();
        this.config = {
            enableFallbacks: true,
            maxFallbackAttempts: 3,
            animateResize: false,
            resizeAnimationDuration: 300,
            detectCapabilitiesOnInit: true,
            logLevel: 'warn',
            customStrategies: [],
            ...config
        };
        this.initializeStrategies();
        if (this.config.detectCapabilitiesOnInit) {
            this.detectCapabilities();
        }
    }
    /**
     * Resize window to specific dimensions
     */
    async resizeWindow(width, height, options = {}) {
        const startTime = performance.now();
        this.log('info', `Starting window resize to ${width}x${height}`);
        this.emit('resize-start', { width, height });
        const mergedOptions = {
            maxAttempts: this.config.maxFallbackAttempts,
            fallbackToContentExpansion: this.config.enableFallbacks,
            ...options
        };
        // Validate dimensions
        if (width < 100 || height < 100) {
            const result = {
                success: false,
                method: 'failed',
                error: 'Invalid dimensions: minimum size is 100x100',
                executionTime: performance.now() - startTime
            };
            this.emit('resize-error', { width, height }, undefined, result.error);
            return result;
        }
        // Try each strategy in priority order
        const availableStrategies = this.getAvailableStrategies();
        let lastError = '';
        let fallbacksAttempted = 0;
        for (const strategy of availableStrategies) {
            if (fallbacksAttempted >= mergedOptions.maxAttempts) {
                break;
            }
            try {
                this.log('debug', `Attempting resize with strategy: ${strategy.name}`);
                const result = await strategy.resize(width, height);
                result.fallbacksAttempted = fallbacksAttempted;
                if (result.success) {
                    this.log('info', `Resize successful with strategy: ${strategy.name}`);
                    this.emit('resize-complete', { width, height }, result.newSize);
                    return result;
                }
                lastError = result.error || `Strategy ${strategy.name} failed`;
                this.log('warn', `Strategy ${strategy.name} failed: ${lastError}`);
                fallbacksAttempted++;
                // Progress callback
                if (mergedOptions.onProgress) {
                    mergedOptions.onProgress(result);
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                lastError = `Strategy ${strategy.name} threw error: ${errorMessage}`;
                this.log('error', lastError);
                fallbacksAttempted++;
                if (mergedOptions.onError) {
                    mergedOptions.onError(errorMessage, strategy.name);
                }
            }
            // Small delay between attempts
            await this.delay(50);
        }
        // All strategies failed
        const finalResult = {
            success: false,
            method: 'failed',
            error: `All resize strategies failed. Last error: ${lastError}`,
            fallbacksAttempted,
            executionTime: performance.now() - startTime
        };
        this.emit('resize-error', { width, height }, undefined, finalResult.error);
        return finalResult;
    }
    /**
     * Get current window size
     */
    getCurrentSize() {
        return {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };
    }
    /**
     * Detect available resize capabilities
     */
    detectCapabilities() {
        const capabilities = {
            webAPIs: _strategies_WebAPIStrategy__WEBPACK_IMPORTED_MODULE_0__.WebAPIStrategy.detectCapabilities(),
            alt1APIs: {
                userResize: _strategies_Alt1NativeStrategy__WEBPACK_IMPORTED_MODULE_1__.Alt1NativeStrategy.detectCapabilities().userResize || false,
                updateConfig: _strategies_Alt1NativeStrategy__WEBPACK_IMPORTED_MODULE_1__.Alt1NativeStrategy.detectCapabilities().updateConfig || false,
                windowControl: _strategies_Alt1NativeStrategy__WEBPACK_IMPORTED_MODULE_1__.Alt1NativeStrategy.detectCapabilities().windowControl || false
            },
            contentExpansion: _strategies_ContentExpansionStrategy__WEBPACK_IMPORTED_MODULE_2__.ContentExpansionStrategy.detectCapabilities(),
            externalControl: false, // TODO: Implement external control detection
            detectedVersion: this.detectAlt1Version(),
            limitations: []
        };
        // Add limitations based on detected environment
        if (!capabilities.webAPIs.resizeTo && !capabilities.webAPIs.resizeBy) {
            capabilities.limitations.push('Standard web resize APIs blocked');
        }
        if (!capabilities.alt1APIs.userResize) {
            capabilities.limitations.push('Alt1 userResize API not available');
        }
        if (window.location.protocol === 'file:') {
            capabilities.limitations.push('File protocol may limit resize capabilities');
        }
        this.capabilities = capabilities;
        this.log('info', 'Capabilities detected:', capabilities);
        return capabilities;
    }
    /**
     * Get available strategies based on current capabilities
     */
    getAvailableStrategies() {
        if (!this.capabilities) {
            this.detectCapabilities();
        }
        return this.strategies
            .filter(strategy => strategy.isAvailable())
            .filter(strategy => !strategy.validate || strategy.validate(this.capabilities))
            .sort((a, b) => a.priority - b.priority);
    }
    /**
     * Add event listener
     */
    addEventListener(event, listener) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(listener);
    }
    /**
     * Remove event listener
     */
    removeEventListener(event, listener) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    /**
     * Cleanup resources
     */
    cleanup() {
        // Clean up content expansion strategy
        const contentExpansion = this.strategies.find(s => s.name === 'content-expansion');
        if (contentExpansion) {
            contentExpansion.cleanup();
        }
        this.eventListeners.clear();
    }
    // Private methods
    initializeStrategies() {
        this.strategies = [
            new _strategies_WebAPIStrategy__WEBPACK_IMPORTED_MODULE_0__.WebAPIStrategy(),
            new _strategies_Alt1NativeStrategy__WEBPACK_IMPORTED_MODULE_1__.Alt1NativeStrategy(),
            new _strategies_ContentExpansionStrategy__WEBPACK_IMPORTED_MODULE_2__.ContentExpansionStrategy(),
            ...this.config.customStrategies
        ];
        this.log('debug', `Initialized ${this.strategies.length} resize strategies`);
    }
    detectAlt1Version() {
        if (window.alt1) {
            return window.alt1.version || 'unknown';
        }
        return 'not-detected';
    }
    emit(type, target, current, error) {
        const event = {
            type,
            target,
            current,
            error,
            timestamp: Date.now()
        };
        const listeners = this.eventListeners.get(type);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(event);
                }
                catch (error) {
                    this.log('error', 'Error in event listener:', error);
                }
            });
        }
    }
    log(level, message, data) {
        const logLevels = ['none', 'error', 'warn', 'info', 'debug'];
        const currentLevelIndex = logLevels.indexOf(this.config.logLevel);
        const messageLevelIndex = logLevels.indexOf(level);
        if (currentLevelIndex >= messageLevelIndex) {
            const prefix = '[Alt1WindowResizer]';
            if (data !== undefined) {
                console[level](`${prefix} ${message}`, data);
            }
            else {
                console[level](`${prefix} ${message}`);
            }
        }
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


/***/ }),

/***/ "./strategies/Alt1NativeStrategy.ts":
/*!******************************************!*\
  !*** ./strategies/Alt1NativeStrategy.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_20993__) => {

__nested_webpack_require_20993__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_20993__.d(__nested_webpack_exports__, {
/* harmony export */   Alt1NativeStrategy: () => (/* binding */ Alt1NativeStrategy)
/* harmony export */ });
/**
 * Alt1 Native Resize Strategy
 *
 * Uses Alt1's userResize API and other native Alt1 methods
 */
class Alt1NativeStrategy {
    constructor() {
        this.name = 'alt1-native';
        this.priority = 2; // Second priority - Alt1 specific
    }
    isAvailable() {
        return typeof window !== 'undefined' &&
            !!window.alt1 &&
            typeof window.alt1.userResize === 'function';
    }
    validate(capabilities) {
        return capabilities.alt1APIs.userResize;
    }
    async resize(width, height) {
        const startTime = performance.now();
        const previousSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };
        try {
            // Method 1: Programmatic userResize simulation
            const result = await this.programmaticUserResize(width, height, previousSize);
            if (result.success) {
                return {
                    ...result,
                    executionTime: performance.now() - startTime
                };
            }
            // Method 2: Force resize through element manipulation + userResize
            const elementResult = await this.elementBasedResize(width, height, previousSize);
            if (elementResult.success) {
                return {
                    ...elementResult,
                    executionTime: performance.now() - startTime
                };
            }
            // Method 3: Try Alt1 config update (if available)
            if (window.alt1?.updateConfig) {
                try {
                    window.alt1.updateConfig({
                        defaultWidth: width,
                        defaultHeight: height,
                        minWidth: Math.min(width, 300),
                        maxWidth: Math.max(width, 800),
                        minHeight: Math.min(height, 200),
                        maxHeight: Math.max(height, 800)
                    });
                    await this.waitForResize();
                    const newSize = {
                        width: window.outerWidth || document.body.clientWidth,
                        height: window.outerHeight || document.body.clientHeight
                    };
                    if (Math.abs(newSize.width - width) < 20 && Math.abs(newSize.height - height) < 20) {
                        return {
                            success: true,
                            method: this.name,
                            previousSize,
                            newSize,
                            executionTime: performance.now() - startTime
                        };
                    }
                }
                catch (e) {
                    // Config update failed, continue to failure
                }
            }
            return {
                success: false,
                method: this.name,
                previousSize,
                error: 'Alt1 APIs available but resize was ineffective',
                executionTime: performance.now() - startTime
            };
        }
        catch (error) {
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Alt1 native resize failed: ${error instanceof Error ? error.message : String(error)}`,
                executionTime: performance.now() - startTime
            };
        }
    }
    async programmaticUserResize(width, height, previousSize) {
        try {
            // Calculate which borders need to be adjusted
            const deltaWidth = width - previousSize.width;
            const deltaHeight = height - previousSize.height;
            // Determine resize direction
            const expandRight = deltaWidth > 0;
            const expandBottom = deltaHeight > 0;
            const shrinkLeft = deltaWidth < 0;
            const shrinkTop = deltaHeight < 0;
            // Create a temporary invisible element to trigger userResize
            const resizeElement = document.createElement('div');
            resizeElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 1px;
                height: 1px;
                opacity: 0;
                pointer-events: none;
            `;
            document.body.appendChild(resizeElement);
            // Simulate the resize operation
            const resizePromise = new Promise((resolve) => {
                const resizeHandler = () => {
                    if (window.alt1?.userResize) {
                        // Call userResize with appropriate parameters
                        window.alt1.userResize(shrinkLeft, // left
                        shrinkTop, // top
                        expandRight, // right
                        expandBottom // bottom
                        );
                    }
                    resolve(true);
                };
                // Trigger resize after a short delay
                setTimeout(resizeHandler, 10);
            });
            await resizePromise;
            await this.waitForResize(200); // Give more time for Alt1 to process
            // Clean up
            document.body.removeChild(resizeElement);
            const newSize = {
                width: window.outerWidth || document.body.clientWidth,
                height: window.outerHeight || document.body.clientHeight
            };
            const success = Math.abs(newSize.width - width) < 20 && Math.abs(newSize.height - height) < 20;
            return {
                success,
                method: this.name,
                previousSize,
                newSize,
                error: success ? undefined : 'Programmatic userResize was ineffective'
            };
        }
        catch (error) {
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Programmatic userResize failed: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }
    async elementBasedResize(width, height, previousSize) {
        try {
            // Create resize trigger elements at window edges
            const resizeElements = this.createResizeElements();
            // Simulate dragging from appropriate edges
            const deltaWidth = width - previousSize.width;
            const deltaHeight = height - previousSize.height;
            if (deltaWidth !== 0) {
                // Trigger right edge resize
                const rightElement = resizeElements.right;
                this.simulateMouseResize(rightElement, deltaWidth, 0);
            }
            if (deltaHeight !== 0) {
                // Trigger bottom edge resize
                const bottomElement = resizeElements.bottom;
                this.simulateMouseResize(bottomElement, 0, deltaHeight);
            }
            await this.waitForResize(300);
            // Clean up resize elements
            Object.values(resizeElements).forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
            const newSize = {
                width: window.outerWidth || document.body.clientWidth,
                height: window.outerHeight || document.body.clientHeight
            };
            const success = Math.abs(newSize.width - width) < 20 && Math.abs(newSize.height - height) < 20;
            return {
                success,
                method: this.name,
                previousSize,
                newSize,
                error: success ? undefined : 'Element-based resize was ineffective'
            };
        }
        catch (error) {
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Element-based resize failed: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }
    createResizeElements() {
        const elements = {
            right: document.createElement('div'),
            bottom: document.createElement('div'),
            corner: document.createElement('div')
        };
        // Right edge
        elements.right.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 5px;
            height: 100%;
            cursor: e-resize;
            z-index: 9999;
            background: transparent;
        `;
        // Bottom edge
        elements.bottom.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 5px;
            cursor: s-resize;
            z-index: 9999;
            background: transparent;
        `;
        // Corner
        elements.corner.style.cssText = `
            position: fixed;
            bottom: 0;
            right: 0;
            width: 10px;
            height: 10px;
            cursor: se-resize;
            z-index: 10000;
            background: transparent;
        `;
        // Add Alt1 userResize functionality
        if (window.alt1?.userResize) {
            elements.right.addEventListener('mousedown', () => window.alt1.userResize(false, false, true, false));
            elements.bottom.addEventListener('mousedown', () => window.alt1.userResize(false, false, false, true));
            elements.corner.addEventListener('mousedown', () => window.alt1.userResize(false, false, true, true));
        }
        // Add to DOM
        Object.values(elements).forEach(el => document.body.appendChild(el));
        return elements;
    }
    simulateMouseResize(element, deltaX, deltaY) {
        // Create and dispatch mouse events
        const mouseDown = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: 0,
            clientY: 0
        });
        element.dispatchEvent(mouseDown);
        // Simulate drag
        setTimeout(() => {
            const mouseMove = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: deltaX,
                clientY: deltaY
            });
            document.dispatchEvent(mouseMove);
            setTimeout(() => {
                const mouseUp = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(mouseUp);
            }, 50);
        }, 50);
    }
    async waitForResize(duration = 100) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }
    // Detect Alt1 API capabilities
    static detectCapabilities() {
        const alt1 = window.alt1;
        return {
            userResize: alt1 && typeof alt1.userResize === 'function',
            updateConfig: alt1 && typeof alt1.updateConfig === 'function',
            windowControl: alt1 && typeof alt1.setWindowBounds === 'function'
        };
    }
}


/***/ }),

/***/ "./strategies/ContentExpansionStrategy.ts":
/*!************************************************!*\
  !*** ./strategies/ContentExpansionStrategy.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_32670__) => {

__nested_webpack_require_32670__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_32670__.d(__nested_webpack_exports__, {
/* harmony export */   ContentExpansionStrategy: () => (/* binding */ ContentExpansionStrategy)
/* harmony export */ });
/**
 * Content Expansion Strategy
 *
 * Forces window resize by expanding content that requires larger window
 */
class ContentExpansionStrategy {
    constructor() {
        this.name = 'content-expansion';
        this.priority = 3; // Third priority - fallback method
        this.expansionElements = [];
    }
    isAvailable() {
        return typeof document !== 'undefined';
    }
    validate(capabilities) {
        return capabilities.contentExpansion;
    }
    async resize(width, height) {
        const startTime = performance.now();
        const previousSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };
        try {
            // Clean up any existing expansion elements
            this.cleanup();
            // Method 1: Force minimum content size
            const minContentResult = await this.forceMinimumContentSize(width, height);
            if (minContentResult.success) {
                return {
                    ...minContentResult,
                    executionTime: performance.now() - startTime
                };
            }
            // Method 2: Create expanding content that forces window growth
            const expandingContentResult = await this.createExpandingContent(width, height);
            if (expandingContentResult.success) {
                return {
                    ...expandingContentResult,
                    executionTime: performance.now() - startTime
                };
            }
            // Method 3: Scrollable content expansion
            const scrollableResult = await this.createScrollableExpansion(width, height, previousSize);
            return {
                ...scrollableResult,
                executionTime: performance.now() - startTime
            };
        }
        catch (error) {
            this.cleanup();
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Content expansion failed: ${error instanceof Error ? error.message : String(error)}`,
                executionTime: performance.now() - startTime
            };
        }
    }
    async forceMinimumContentSize(width, height) {
        const previousSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };
        // Set minimum dimensions on body and html
        const html = document.documentElement;
        const body = document.body;
        const originalBodyStyle = {
            minWidth: body.style.minWidth,
            minHeight: body.style.minHeight,
            width: body.style.width,
            height: body.style.height
        };
        const originalHtmlStyle = {
            minWidth: html.style.minWidth,
            minHeight: html.style.minHeight
        };
        try {
            // Force minimum dimensions
            body.style.minWidth = `${width}px`;
            body.style.minHeight = `${height}px`;
            body.style.width = `${width}px`;
            body.style.height = `${height}px`;
            html.style.minWidth = `${width}px`;
            html.style.minHeight = `${height}px`;
            await this.waitForResize();
            const newSize = {
                width: window.outerWidth || document.body.clientWidth,
                height: window.outerHeight || document.body.clientHeight
            };
            const success = newSize.width >= width * 0.9 && newSize.height >= height * 0.9;
            if (!success) {
                // Restore original styles if resize failed
                body.style.minWidth = originalBodyStyle.minWidth;
                body.style.minHeight = originalBodyStyle.minHeight;
                body.style.width = originalBodyStyle.width;
                body.style.height = originalBodyStyle.height;
                html.style.minWidth = originalHtmlStyle.minWidth;
                html.style.minHeight = originalHtmlStyle.minHeight;
            }
            return {
                success,
                method: this.name,
                previousSize,
                newSize,
                error: success ? undefined : 'Minimum content size was ineffective'
            };
        }
        catch (error) {
            // Restore original styles on error
            body.style.minWidth = originalBodyStyle.minWidth;
            body.style.minHeight = originalBodyStyle.minHeight;
            body.style.width = originalBodyStyle.width;
            body.style.height = originalBodyStyle.height;
            html.style.minWidth = originalHtmlStyle.minWidth;
            html.style.minHeight = originalHtmlStyle.minHeight;
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Force minimum size failed: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }
    async createExpandingContent(width, height) {
        const previousSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };
        // Create a large container that forces window expansion
        const expandingContainer = document.createElement('div');
        expandingContainer.className = 'alt1-resizer-expansion';
        expandingContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${width}px;
            height: ${height}px;
            min-width: ${width}px;
            min-height: ${height}px;
            background: transparent;
            pointer-events: none;
            z-index: -1;
            overflow: visible;
        `;
        // Create inner content that's even larger
        const innerContent = document.createElement('div');
        innerContent.style.cssText = `
            width: ${width + 20}px;
            height: ${height + 20}px;
            min-width: ${width + 20}px;
            min-height: ${height + 20}px;
            background: transparent;
        `;
        expandingContainer.appendChild(innerContent);
        document.body.appendChild(expandingContainer);
        this.expansionElements.push(expandingContainer);
        await this.waitForResize();
        const newSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };
        const success = newSize.width >= width * 0.8 && newSize.height >= height * 0.8;
        return {
            success,
            method: this.name,
            previousSize,
            newSize,
            error: success ? undefined : 'Expanding content was ineffective'
        };
    }
    async createScrollableExpansion(width, height, previousSize) {
        // Create a scrollable area that's larger than requested size
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'alt1-resizer-scroll-expansion';
        scrollContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: auto;
            background: rgba(0, 0, 0, 0.01);
            z-index: -2;
        `;
        // Create large content area
        const largeContent = document.createElement('div');
        largeContent.style.cssText = `
            width: ${Math.max(width, previousSize.width + 200)}px;
            height: ${Math.max(height, previousSize.height + 200)}px;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: rgba(100, 100, 100, 0.3);
            font-size: 12px;
        `;
        largeContent.textContent = `Expanded content area: ${width}x${height}`;
        scrollContainer.appendChild(largeContent);
        document.body.appendChild(scrollContainer);
        this.expansionElements.push(scrollContainer);
        await this.waitForResize(200);
        const newSize = {
            width: window.outerWidth || document.body.clientWidth,
            height: window.outerHeight || document.body.clientHeight
        };
        // For scrollable expansion, we consider it successful if we get scrollbars
        // or if the content area expanded
        const hasScrollbars = scrollContainer.scrollWidth > scrollContainer.clientWidth ||
            scrollContainer.scrollHeight > scrollContainer.clientHeight;
        const dimensionsImproved = newSize.width > previousSize.width || newSize.height > previousSize.height;
        const success = hasScrollbars || dimensionsImproved;
        return {
            success,
            method: this.name,
            previousSize,
            newSize,
            error: success ? undefined : 'Content expansion created scrollable area but window did not resize'
        };
    }
    async waitForResize(duration = 100) {
        return new Promise(resolve => {
            // Force layout recalculation
            document.body.offsetHeight;
            setTimeout(resolve, duration);
        });
    }
    cleanup() {
        this.expansionElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.expansionElements = [];
        // Reset body styles if they were modified
        const body = document.body;
        const html = document.documentElement;
        if (body.style.minWidth && body.style.minWidth.includes('px')) {
            body.style.minWidth = '';
        }
        if (body.style.minHeight && body.style.minHeight.includes('px')) {
            body.style.minHeight = '';
        }
        if (html.style.minWidth && html.style.minWidth.includes('px')) {
            html.style.minWidth = '';
        }
        if (html.style.minHeight && html.style.minHeight.includes('px')) {
            html.style.minHeight = '';
        }
    }
    // Always available - content manipulation is always possible
    static detectCapabilities() {
        return true;
    }
}


/***/ }),

/***/ "./strategies/WebAPIStrategy.ts":
/*!**************************************!*\
  !*** ./strategies/WebAPIStrategy.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_43519__) => {

__nested_webpack_require_43519__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_43519__.d(__nested_webpack_exports__, {
/* harmony export */   WebAPIStrategy: () => (/* binding */ WebAPIStrategy)
/* harmony export */ });
/**
 * Web API Resize Strategy
 *
 * Uses standard browser window resize APIs
 */
class WebAPIStrategy {
    constructor() {
        this.name = 'webapi';
        this.priority = 1; // Highest priority - try first
    }
    isAvailable() {
        return typeof window !== 'undefined' &&
            (typeof window.resizeTo === 'function' ||
                typeof window.resizeBy === 'function');
    }
    validate(capabilities) {
        return capabilities.webAPIs.resizeTo ||
            capabilities.webAPIs.resizeBy ||
            capabilities.webAPIs.outerWidth ||
            capabilities.webAPIs.outerHeight;
    }
    async resize(width, height) {
        const startTime = performance.now();
        const previousSize = {
            width: window.outerWidth,
            height: window.outerHeight
        };
        try {
            // Method 1: Direct resizeTo (most reliable)
            if (window.resizeTo) {
                window.resizeTo(width, height);
                // Give browser time to process resize
                await this.waitForResize();
                const newSize = {
                    width: window.outerWidth,
                    height: window.outerHeight
                };
                // Check if resize was successful with stricter verification for Alt1
                const widthDiff = Math.abs(newSize.width - width);
                const heightDiff = Math.abs(newSize.height - height);
                const actuallyResized = widthDiff < 10 && heightDiff < 10;
                // Additional Alt1-specific check: verify the resize actually took visual effect
                const alt1SilentIgnore = this.detectAlt1SilentIgnore(previousSize, newSize, width, height);
                if (actuallyResized && !alt1SilentIgnore) {
                    return {
                        success: true,
                        method: this.name,
                        previousSize,
                        newSize,
                        executionTime: performance.now() - startTime
                    };
                }
                else {
                    // Method 1 failed - provide specific feedback
                    let errorMessage = 'resizeTo() call did not achieve target dimensions';
                    if (alt1SilentIgnore) {
                        errorMessage = 'Alt1 Toolkit silently ignored resizeTo() command - expected behavior for security';
                    }
                    else if (!actuallyResized) {
                        errorMessage = `resizeTo() failed - target: ${width}x${height}, actual: ${newSize.width}x${newSize.height} (diff: ${widthDiff}x${heightDiff})`;
                    }
                    // Continue to try other methods, but store this error for potential use
                    // Fall through to method 2
                }
            }
            // Method 2: Calculate delta and use resizeBy
            if (window.resizeBy) {
                const deltaWidth = width - previousSize.width;
                const deltaHeight = height - previousSize.height;
                window.resizeBy(deltaWidth, deltaHeight);
                await this.waitForResize();
                const newSize = {
                    width: window.outerWidth,
                    height: window.outerHeight
                };
                if (Math.abs(newSize.width - width) < 10 && Math.abs(newSize.height - height) < 10) {
                    return {
                        success: true,
                        method: this.name,
                        previousSize,
                        newSize,
                        executionTime: performance.now() - startTime
                    };
                }
            }
            // Method 3: Direct property assignment (less reliable)
            try {
                window.outerWidth = width;
                window.outerHeight = height;
                await this.waitForResize();
                const newSize = {
                    width: window.outerWidth,
                    height: window.outerHeight
                };
                if (Math.abs(newSize.width - width) < 10 && Math.abs(newSize.height - height) < 10) {
                    return {
                        success: true,
                        method: this.name,
                        previousSize,
                        newSize,
                        executionTime: performance.now() - startTime
                    };
                }
            }
            catch (e) {
                // Property assignment failed, continue to failure
            }
            // All methods failed - determine why
            const finalSize = {
                width: window.outerWidth,
                height: window.outerHeight
            };
            // Check if Alt1 is silently ignoring commands
            const alt1Detected = typeof window.alt1 !== 'undefined';
            let errorMessage = 'Web APIs available but resize was blocked or ineffective';
            if (alt1Detected) {
                if (previousSize.width === finalSize.width && previousSize.height === finalSize.height) {
                    errorMessage = 'Alt1 Toolkit silently ignored window resize commands - this is expected behavior for security';
                }
                else {
                    errorMessage = `Alt1 Toolkit partially processed resize (${previousSize.width}x${previousSize.height} → ${finalSize.width}x${finalSize.height}) but blocked target size (${width}x${height})`;
                }
            }
            return {
                success: false,
                method: this.name,
                previousSize,
                newSize: finalSize,
                error: errorMessage,
                executionTime: performance.now() - startTime
            };
        }
        catch (error) {
            return {
                success: false,
                method: this.name,
                previousSize,
                error: `Web API resize failed: ${error instanceof Error ? error.message : String(error)}`,
                executionTime: performance.now() - startTime
            };
        }
    }
    async waitForResize() {
        return new Promise(resolve => {
            // Give browser time to process resize
            setTimeout(resolve, 50);
        });
    }
    /**
     * Detect if Alt1 is silently ignoring resize commands
     * This happens when window.resizeTo() executes but has no visual effect
     */
    detectAlt1SilentIgnore(previousSize, newSize, targetWidth, targetHeight) {
        // Check if we're in Alt1 environment
        const isAlt1 = typeof window.alt1 !== 'undefined';
        if (!isAlt1)
            return false;
        // If window dimensions didn't change at all despite resize command
        const noVisualChange = previousSize.width === newSize.width &&
            previousSize.height === newSize.height;
        // If outerWidth/outerHeight report the target size but visually nothing changed
        const reportsFakeSuccess = (Math.abs(newSize.width - targetWidth) < 10 &&
            Math.abs(newSize.height - targetHeight) < 10) && noVisualChange;
        return noVisualChange || reportsFakeSuccess;
    }
    // Detect available Web API capabilities
    static detectCapabilities() {
        return {
            resizeTo: typeof window.resizeTo === 'function',
            resizeBy: typeof window.resizeBy === 'function',
            outerWidth: 'outerWidth' in window,
            outerHeight: 'outerHeight' in window
        };
    }
}


/***/ }),

/***/ "./types.ts":
/*!******************!*\
  !*** ./types.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_51501__) => {

__nested_webpack_require_51501__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_51501__.d(__nested_webpack_exports__, {
/* harmony export */   LAYOUT_PRESETS: () => (/* binding */ LAYOUT_PRESETS)
/* harmony export */ });
/**
 * Window Resizer Component Types
 *
 * Provides type definitions for the Alt1 window resizing system
 */
// Built-in layout constants
const LAYOUT_PRESETS = {
    COMPACT: 'compact',
    EXPANDED: 'expanded',
    WIDE: 'wide',
    TALL: 'tall',
    DASHBOARD: 'dashboard',
    FULLSCREEN: 'fullscreen'
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_52280__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_52280__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_52280__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_52280__.o(definition, key) && !__nested_webpack_require_52280__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_52280__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_52280__.r = (exports) => {
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
__nested_webpack_require_52280__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_52280__.d(__nested_webpack_exports__, {
/* harmony export */   Alt1NativeStrategy: () => (/* reexport safe */ _strategies_Alt1NativeStrategy__WEBPACK_IMPORTED_MODULE_4__.Alt1NativeStrategy),
/* harmony export */   ContentExpansionStrategy: () => (/* reexport safe */ _strategies_ContentExpansionStrategy__WEBPACK_IMPORTED_MODULE_5__.ContentExpansionStrategy),
/* harmony export */   LAYOUT_PRESETS: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_2__.LAYOUT_PRESETS),
/* harmony export */   LayoutManager: () => (/* reexport safe */ _LayoutManager__WEBPACK_IMPORTED_MODULE_1__.LayoutManager),
/* harmony export */   WebAPIStrategy: () => (/* reexport safe */ _strategies_WebAPIStrategy__WEBPACK_IMPORTED_MODULE_3__.WebAPIStrategy),
/* harmony export */   WindowResizer: () => (/* reexport safe */ _WindowResizer__WEBPACK_IMPORTED_MODULE_0__.WindowResizer)
/* harmony export */ });
/* harmony import */ var _WindowResizer__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_52280__(/*! ./WindowResizer */ "./WindowResizer.ts");
/* harmony import */ var _LayoutManager__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_52280__(/*! ./LayoutManager */ "./LayoutManager.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_52280__(/*! ./types */ "./types.ts");
/* harmony import */ var _strategies_WebAPIStrategy__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_52280__(/*! ./strategies/WebAPIStrategy */ "./strategies/WebAPIStrategy.ts");
/* harmony import */ var _strategies_Alt1NativeStrategy__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_52280__(/*! ./strategies/Alt1NativeStrategy */ "./strategies/Alt1NativeStrategy.ts");
/* harmony import */ var _strategies_ContentExpansionStrategy__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_52280__(/*! ./strategies/ContentExpansionStrategy */ "./strategies/ContentExpansionStrategy.ts");
/**
 * @tmg-alt1/window-resizer
 * Universal Alt1 plugin window resizer with multiple fallback strategies
 */







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
/* harmony import */ var _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/interactive-windows/dist/index */ "../../../components/interactive-windows/dist/index.js");
/* harmony import */ var _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_window_resizer_dist_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../components/window-resizer/dist/index */ "../../../components/window-resizer/dist/index.js");
/* harmony import */ var _components_window_resizer_dist_index__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_components_window_resizer_dist_index__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger */ "./logger.ts");
// Interactive Windows Test Plugin
// Demonstrates the capabilities of the @tmg-alt1/interactive-windows component




/**
 * Main test application class demonstrating interactive windows
 */
class InteractiveWindowsTestApp {
    constructor() {
        this.windowManager = null;
        this.hybridWindowManager = null;
        this.windowResizer = null;
        this.layoutManager = null;
        this.openWindows = [];
        this.isInitialized = false;
        // UI Elements
        this.elements = {
            alt1Status: null,
            alt1StatusText: null,
            alt1InstallLink: null,
            openInteractiveModal: null,
            openSettingsModal: null,
            openMultipleWindows: null,
            openHybridModal: null,
            testWindowResize: null,
            testCompactLayout: null,
            testExpandedLayout: null,
            detectResizeCapabilities: null,
            showAlert: null,
            showConfirm: null,
            closeAllWindows: null,
            managerStatus: null,
            windowCount: null,
            focusedWindow: null,
            resizerStatus: null,
            currentWindowSize: null,
            userResizeStatus: null,
            webApiStatus: null
        };
        // Initialize logger first
        this.logger = new _logger__WEBPACK_IMPORTED_MODULE_3__.Alt1Logger('InteractiveWindowsTest', _logger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.DEBUG);
        this.logger.init('Initializing Interactive Windows Test App...');
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
    getUIElements() {
        this.elements.alt1Status = document.getElementById('alt1Status');
        this.elements.alt1StatusText = document.getElementById('alt1StatusText');
        this.elements.alt1InstallLink = document.getElementById('alt1InstallLink');
        this.elements.openInteractiveModal = document.getElementById('openInteractiveModal');
        this.elements.openSettingsModal = document.getElementById('openSettingsModal');
        this.elements.openMultipleWindows = document.getElementById('openMultipleWindows');
        this.elements.openHybridModal = document.getElementById('openHybridModal');
        this.elements.testWindowResize = document.getElementById('testWindowResize');
        this.elements.testCompactLayout = document.getElementById('testCompactLayout');
        this.elements.testExpandedLayout = document.getElementById('testExpandedLayout');
        this.elements.detectResizeCapabilities = document.getElementById('detectResizeCapabilities');
        this.elements.showAlert = document.getElementById('showAlert');
        this.elements.showConfirm = document.getElementById('showConfirm');
        this.elements.closeAllWindows = document.getElementById('closeAllWindows');
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
    checkAlt1Status() {
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
            alt1__WEBPACK_IMPORTED_MODULE_0__.identifyApp('./appconfig.json');
            // Update status icon
            const statusIcon = this.elements.alt1Status?.querySelector('.status-icon');
            if (statusIcon) {
                statusIcon.textContent = '✅';
            }
        }
        else {
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
    initializeInteractiveWindowManager() {
        try {
            this.logger.init('Initializing InteractiveWindowManager...');
            this.windowManager = new _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.InteractiveWindowManager();
            this.logger.success('InteractiveWindowManager initialized successfully');
            // Set up event listeners for window events
            this.setupWindowEventListeners();
            // Update status
            this.updateStatus();
            this.updateResizeStatus();
        }
        catch (error) {
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
    initializeHybridWindowManager() {
        try {
            this.logger.init('Initializing HybridWindowManager...');
            this.hybridWindowManager = new _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.HybridWindowManager();
            this.logger.success('HybridWindowManager initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize HybridWindowManager:', error);
        }
    }
    /**
     * Initialize the window resizer component
     */
    initializeWindowResizer() {
        try {
            this.logger.init('Initializing WindowResizer...');
            this.windowResizer = new _components_window_resizer_dist_index__WEBPACK_IMPORTED_MODULE_2__.WindowResizer({
                enableFallbacks: true,
                maxFallbackAttempts: 3,
                detectCapabilitiesOnInit: true,
                logLevel: 'debug'
            });
            this.logger.success('WindowResizer initialized successfully');
            this.updateResizeStatus();
        }
        catch (error) {
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
    initializeLayoutManager() {
        try {
            this.logger.init('Initializing LayoutManager...');
            if (!this.windowResizer) {
                this.logger.error('Cannot initialize LayoutManager: WindowResizer not available');
                return;
            }
            this.layoutManager = new _components_window_resizer_dist_index__WEBPACK_IMPORTED_MODULE_2__.LayoutManager(this.windowResizer);
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
        }
        catch (error) {
            this.logger.error('Failed to initialize LayoutManager:', error);
        }
    }
    /**
     * Set up event listeners for window events
     */
    setupWindowEventListeners() {
        // Window event handling would be implemented here
        // The InteractiveWindowManager handles its own events internally
    }
    /**
     * Set up event handlers for UI buttons
     */
    setupEventHandlers() {
        this.logger.init('Setting up event handlers...');
        // Open interactive modal
        this.elements.openInteractiveModal?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openInteractiveModal', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.openInteractiveModal();
        });
        // Open settings modal
        this.elements.openSettingsModal?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openSettingsModal', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.openSettingsModal();
        });
        // Open multiple windows
        this.elements.openMultipleWindows?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openMultipleWindows', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.openMultipleWindows();
        });
        // Open hybrid modal (full screen positioning)
        this.elements.openHybridModal?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: openHybridModal', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.openHybridModal();
        });
        // Test window resize functionality
        this.elements.testWindowResize?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testWindowResize', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.testWindowResize();
        });
        // Test compact layout
        this.elements.testCompactLayout?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testCompactLayout', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.testCompactLayout();
        });
        // Test expanded layout
        this.elements.testExpandedLayout?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testExpandedLayout', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.testExpandedLayout();
        });
        // Detect resize capabilities
        this.elements.detectResizeCapabilities?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: detectResizeCapabilities', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.detectResizeCapabilities();
        });
        // Show alert
        this.elements.showAlert?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: showAlert', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.showAlert();
        });
        // Show confirm dialog
        this.elements.showConfirm?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: showConfirm', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.showConfirm();
        });
        // Close all windows
        this.elements.closeAllWindows?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: closeAllWindows', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.closeAllWindows();
        });
    }
    /**
     * Open an interactive modal window
     */
    openInteractiveModal() {
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
                theme: _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.DISCORD,
                resizable: true,
                draggable: true,
                closable: true
            });
            this.openWindows.push(modal);
            this.updateStatus();
            this.logger.success('Interactive modal created:', modal.id);
        }
        catch (error) {
            this.logger.error('Failed to create interactive modal:', error);
        }
    }
    /**
     * Open settings modal
     */
    openSettingsModal() {
        this.logger.window('openSettingsModal() called');
        if (!this.windowManager) {
            this.logger.error('openSettingsModal failed: Window manager not available');
            return;
        }
        try {
            const settingsTemplate = (0,_components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.createSettingsTemplate)({
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
        }
        catch (error) {
            this.logger.error('Failed to create settings modal:', error);
        }
    }
    /**
     * Open multiple test windows
     */
    openMultipleWindows() {
        this.logger.window('openMultipleWindows() called');
        if (!this.windowManager) {
            this.logger.error('openMultipleWindows failed: Window manager not available');
            return;
        }
        const themes = [_components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.DISCORD, _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.RUNESCAPE, _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.MODERN_DARK];
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
            }
            catch (error) {
                this.logger.error(`Failed to create test window ${i + 1}:`, error);
            }
        }
        this.updateStatus();
    }
    /**
     * Open hybrid modal with full RuneScape window positioning
     */
    openHybridModal() {
        this.logger.window('openHybridModal() called');
        if (!this.hybridWindowManager) {
            this.logger.error('openHybridModal failed: Hybrid window manager not available');
            return;
        }
        try {
            // Position the modal at specific RS coordinates (not constrained to plugin window)
            const rsX = 200; // RS coordinate X
            const rsY = 150; // RS coordinate Y
            const hybridConfig = {
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
                theme: _components_interactive_windows_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowThemes.DISCORD,
                useOverlayChrome: true,
                overlayColor: alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(100, 100, 150, 200),
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
        }
        catch (error) {
            this.logger.error('Failed to create hybrid modal:', error);
        }
    }
    /**
     * Show alert dialog
     */
    async showAlert() {
        this.logger.window('showAlert() called');
        if (!this.windowManager) {
            this.logger.error('showAlert failed: Window manager not available');
            return;
        }
        try {
            await this.windowManager.alert('📢 Alert Dialog Test', 'This is an interactive alert dialog! Unlike Alt1 overlays, this dialog can be clicked, dragged, and properly focused.');
            this.logger.success('Alert dialog completed');
        }
        catch (error) {
            this.logger.error('Failed to show alert:', error);
        }
    }
    /**
     * Show confirmation dialog
     */
    async showConfirm() {
        this.logger.window('showConfirm() called');
        if (!this.windowManager) {
            this.logger.error('showConfirm failed: Window manager not available');
            return;
        }
        try {
            const confirmed = await this.windowManager.confirm('❓ Confirmation Dialog Test', 'Do you want to test the confirmation dialog? This demonstrates async/await support with interactive buttons.');
            if (confirmed) {
                this.logger.success('User confirmed dialog');
                alert('You clicked Yes! ✅');
            }
            else {
                this.logger.ui('User cancelled dialog');
                alert('You clicked No! ❌');
            }
        }
        catch (error) {
            this.logger.error('Failed to show confirmation:', error);
        }
    }
    /**
     * Close all open windows
     */
    closeAllWindows() {
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
        }
        catch (error) {
            this.logger.error('Failed to close all windows:', error);
        }
    }
    /**
     * Update status display
     */
    updateStatus() {
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
    updateResizeStatus() {
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
    async testWindowResize() {
        this.logger.window('testWindowResize() called');
        if (!this.windowResizer) {
            this.logger.error('testWindowResize failed: Window resizer not available');
            alert('❌ Window resizer not initialized!');
            return;
        }
        try {
            this.logger.window('Attempting to resize window to 800x600...');
            const result = await this.windowResizer.resizeWindow(800, 600, {
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
            }
            else {
                this.logger.error('Window resize failed:', result);
                alert(`❌ Window resize failed!\n\nError: ${result.error}\nFallbacks attempted: ${result.fallbacksAttempted}\nExecution time: ${result.executionTime?.toFixed(2)}ms\n\nThis demonstrates Alt1's window resize limitations.`);
            }
        }
        catch (error) {
            this.logger.error('Failed to test window resize:', error);
            alert(`❌ Window resize test failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Test compact layout switching
     */
    async testCompactLayout() {
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
            }
            else {
                this.logger.error('Compact layout failed:', result);
                alert(`❌ Compact layout failed: ${result.error}`);
            }
            this.updateResizeStatus();
        }
        catch (error) {
            this.logger.error('Failed to test compact layout:', error);
            alert(`❌ Compact layout test failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Test expanded layout switching
     */
    async testExpandedLayout() {
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
            }
            else {
                this.logger.error('Expanded layout failed:', result);
                alert(`❌ Expanded layout failed: ${result.error}`);
            }
            this.updateResizeStatus();
        }
        catch (error) {
            this.logger.error('Failed to test expanded layout:', error);
            alert(`❌ Expanded layout test failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Detect and display resize capabilities
     */
    detectResizeCapabilities() {
        this.logger.window('detectResizeCapabilities() called');
        if (!this.windowResizer) {
            this.logger.error('detectResizeCapabilities failed: Window resizer not available');
            alert('❌ Window resizer not initialized!');
            return;
        }
        try {
            const capabilities = this.windowResizer.detectCapabilities();
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
            }
            else {
                report += 'Alt1 blocks programmatic window resizing. Content-based adaptive layouts are the recommended alternative.';
            }
            alert(report);
        }
        catch (error) {
            this.logger.error('Failed to detect resize capabilities:', error);
            alert(`❌ Capability detection failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
// Initialize the app when the page loads
const app = new InteractiveWindowsTestApp();


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