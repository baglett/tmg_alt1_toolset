(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["InteractiveWindows"] = factory();
	else
		root["InteractiveWindows"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/InteractiveWindow.ts":
/*!**********************************!*\
  !*** ./src/InteractiveWindow.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InteractiveWindow: () => (/* binding */ InteractiveWindow)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/types.ts");
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InteractiveWindowManager: () => (/* binding */ InteractiveWindowManager)
/* harmony export */ });
/* harmony import */ var _InteractiveWindow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InteractiveWindow */ "./src/InteractiveWindow.ts");
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
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
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
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
/* harmony import */ var _InteractiveWindowManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InteractiveWindowManager */ "./src/InteractiveWindowManager.ts");
/* harmony import */ var _InteractiveWindow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InteractiveWindow */ "./src/InteractiveWindow.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types */ "./src/types.ts");
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

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map