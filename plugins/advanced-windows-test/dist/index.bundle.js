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
/* harmony import */ var _components_window_resizer_dist_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/window-resizer/dist/index */ "../../../components/window-resizer/dist/index.js");
/* harmony import */ var _components_window_resizer_dist_index__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_components_window_resizer_dist_index__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logger */ "./logger.ts");
// Alt1 Window Resize Test - MVP
// Focused testing of Alt1 window resize functionality and current size detection



/**
 * Minimal Alt1 window resize test application
 */
class Alt1WindowResizeTest {
    constructor() {
        this.windowResizer = null;
        this.sizeUpdateInterval = null;
        // UI Elements
        this.elements = {
            alt1Status: null,
            alt1StatusText: null,
            alt1InstallLink: null,
            currentSizeDisplay: null,
            testWindowResize: null,
            testWindowResize2: null,
            refreshSize: null,
            resizerStatus: null,
            currentWindowSize: null,
            userResizeStatus: null,
            webApiStatus: null,
            lastResizeResult: null
        };
        this.logger = new _logger__WEBPACK_IMPORTED_MODULE_2__.Alt1Logger('Alt1WindowResizeTest', _logger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.DEBUG);
        this.logger.init('Initializing Alt1 Window Resize Test...');
        this.initialize();
    }
    /**
     * Initialize the test application
     */
    async initialize() {
        this.logger.init('Starting initialization...');
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        // Wait a bit for Alt1 API to be injected
        await new Promise(resolve => setTimeout(resolve, 100));
        // Get UI elements
        this.getUIElements();
        // Check Alt1 availability
        this.checkAlt1Status();
        // Set up event handlers
        this.setupEventHandlers();
        // Initialize window resizer
        this.initializeWindowResizer();
        // Start real-time size monitoring
        this.startSizeMonitoring();
        this.logger.success('Alt1 Window Resize Test initialized successfully');
    }
    /**
     * Get references to UI elements
     */
    getUIElements() {
        this.elements.alt1Status = document.getElementById('alt1Status');
        this.elements.alt1StatusText = document.getElementById('alt1StatusText');
        this.elements.alt1InstallLink = document.getElementById('alt1InstallLink');
        this.elements.currentSizeDisplay = document.getElementById('currentSizeDisplay');
        this.elements.testWindowResize = document.getElementById('testWindowResize');
        this.elements.testWindowResize2 = document.getElementById('testWindowResize2');
        this.elements.refreshSize = document.getElementById('refreshSize');
        this.elements.resizerStatus = document.getElementById('resizerStatus');
        this.elements.currentWindowSize = document.getElementById('currentWindowSize');
        this.elements.userResizeStatus = document.getElementById('userResizeStatus');
        this.elements.webApiStatus = document.getElementById('webApiStatus');
        this.elements.lastResizeResult = document.getElementById('lastResizeResult');
    }
    /**
     * Check Alt1 status and update UI accordingly
     */
    checkAlt1Status() {
        this.logger.alt1('Checking Alt1 status...');
        // Check both window.alt1 and global alt1
        const hasWindowAlt1 = !!window.alt1;
        const hasGlobalAlt1 = typeof alt1 !== 'undefined';
        const isAlt1Available = hasWindowAlt1 || hasGlobalAlt1;
        this.logger.alt1('Alt1 detection results:', {
            hasWindowAlt1,
            hasGlobalAlt1,
            isAlt1Available
        });
        if (isAlt1Available) {
            this.logger.alt1('Alt1 detected');
            if (this.elements.alt1Status) {
                this.elements.alt1Status.className = 'header-status detected';
            }
            if (this.elements.alt1StatusText) {
                this.elements.alt1StatusText.textContent = ' Alt1 Ready';
            }
            this.logger.alt1('Identifying app to Alt1...');
            try {
                alt1__WEBPACK_IMPORTED_MODULE_0__.identifyApp('./appconfig.json');
                this.logger.alt1('App identified successfully');
            }
            catch (error) {
                this.logger.error('Failed to identify app:', error);
            }
            const statusIcon = this.elements.alt1Status?.querySelector('.status-icon');
            if (statusIcon) {
                statusIcon.textContent = '';
            }
        }
        else {
            this.logger.alt1('Alt1 not detected - running in browser mode');
            const addAppUrl = `alt1://addapp/${new URL('./appconfig.json', document.location.href).href}`;
            if (this.elements.alt1InstallLink) {
                this.elements.alt1InstallLink.href = addAppUrl;
                this.elements.alt1InstallLink.style.display = 'inline';
            }
            if (this.elements.alt1StatusText) {
                this.elements.alt1StatusText.textContent = 'L Alt1 not detected';
            }
            const statusIcon = this.elements.alt1Status?.querySelector('.status-icon');
            if (statusIcon) {
                statusIcon.textContent = 'L';
            }
        }
    }
    /**
     * Initialize the window resizer component
     */
    initializeWindowResizer() {
        try {
            this.logger.init('Initializing WindowResizer...');
            this.windowResizer = new _components_window_resizer_dist_index__WEBPACK_IMPORTED_MODULE_1__.WindowResizer({
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
            this.setStatusValue('resizerStatus', 'Error', 'error');
        }
    }
    /**
     * Set up event handlers for UI buttons
     */
    setupEventHandlers() {
        this.logger.init('Setting up event handlers...');
        // Resize to 500x650 (within appconfig.json bounds: 400-600×500-800)
        this.elements.testWindowResize?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testWindowResize', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.testWindowResize(500, 650);
        });
        // Resize to 550x700 (within appconfig.json bounds: 400-600×500-800)
        this.elements.testWindowResize2?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: testWindowResize2', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.testWindowResize(550, 700);
        });
        // Refresh size
        this.elements.refreshSize?.addEventListener('click', (event) => {
            this.logger.ui('Button clicked: refreshSize', {
                disabled: event.target?.disabled,
                timestamp: Date.now()
            });
            this.updateCurrentSize();
        });
    }
    /**
     * Start real-time size monitoring
     */
    startSizeMonitoring() {
        this.logger.init('Starting real-time size monitoring...');
        // Update size immediately
        this.updateCurrentSize();
        // Update size every 1 second
        this.sizeUpdateInterval = window.setInterval(() => {
            this.updateCurrentSize();
        }, 1000);
        this.logger.success('Size monitoring started');
    }
    /**
     * Update current window size display
     */
    updateCurrentSize() {
        if (!this.windowResizer) {
            this.setCurrentSizeDisplay('WindowResizer not available', 'error');
            return;
        }
        try {
            const size = this.windowResizer.getCurrentSize();
            const sizeText = `${size.width} � ${size.height}`;
            this.setCurrentSizeDisplay(sizeText, 'success');
            this.setStatusValue('currentWindowSize', sizeText, 'success');
            this.logger.data('Current window size:', size);
        }
        catch (error) {
            this.logger.error('Failed to get current size:', error);
            this.setCurrentSizeDisplay('Size detection error', 'error');
            this.setStatusValue('currentWindowSize', 'Error', 'error');
        }
    }
    /**
     * Update resize status display
     */
    updateResizeStatus() {
        if (!this.windowResizer) {
            this.setStatusValue('resizerStatus', 'Not Available', 'error');
            return;
        }
        this.setStatusValue('resizerStatus', 'Ready', 'success');
        try {
            const capabilities = this.windowResizer.detectCapabilities();
            // Update Alt1 userResize status
            const userResizeAvailable = capabilities.alt1APIs.userResize;
            this.setStatusValue('userResizeStatus', userResizeAvailable ? 'Available' : 'Not Available', userResizeAvailable ? 'success' : 'error');
            // Update Web APIs status
            const hasWebAPIs = capabilities.webAPIs.resizeTo || capabilities.webAPIs.resizeBy;
            this.setStatusValue('webApiStatus', hasWebAPIs ? 'Available' : 'Blocked', hasWebAPIs ? 'success' : 'error');
            this.logger.data('Resize capabilities:', capabilities);
        }
        catch (error) {
            this.logger.error('Failed to detect capabilities:', error);
            this.setStatusValue('userResizeStatus', 'Error', 'error');
            this.setStatusValue('webApiStatus', 'Error', 'error');
        }
    }
    /**
     * Test Alt1 window resize functionality
     */
    async testWindowResize(width, height) {
        this.logger.window(`testWindowResize(${width}, ${height}) called`);
        if (!this.windowResizer) {
            this.logger.error('testWindowResize failed: Window resizer not available');
            alert('L Window resizer not initialized!');
            return;
        }
        try {
            this.setStatusValue('lastResizeResult', 'Attempting...', 'updating');
            this.logger.window(`Attempting to resize window to ${width}x${height}...`);
            const result = await this.windowResizer.resizeWindow(width, height, {
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
            // Update size immediately after resize attempt
            setTimeout(() => this.updateCurrentSize(), 500);
            if (result.success) {
                this.logger.success('Window resize succeeded:', result);
                this.setStatusValue('lastResizeResult', ` ${result.method} (${result.executionTime?.toFixed(0)}ms)`, 'success');
                alert(` Resize successful!\n\nMethod: ${result.method}\nNew size: ${result.newSize?.width}�${result.newSize?.height}\nTime: ${result.executionTime?.toFixed(2)}ms`);
            }
            else {
                this.logger.error('Window resize failed:', result);
                this.setStatusValue('lastResizeResult', `L Failed: ${result.error}`, 'error');
                alert(`L Resize failed!\n\nError: ${result.error}\nMethod attempted: ${result.method}\nTime: ${result.executionTime?.toFixed(2)}ms`);
            }
        }
        catch (error) {
            this.logger.error('Failed to test window resize:', error);
            this.setStatusValue('lastResizeResult', 'L Exception', 'error');
            alert(`L Resize test failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Set current size display with status styling
     */
    setCurrentSizeDisplay(text, status) {
        if (!this.elements.currentSizeDisplay)
            return;
        this.elements.currentSizeDisplay.textContent = text;
        // Reset classes
        this.elements.currentSizeDisplay.className = 'size-display';
        // Add status-specific styling
        if (status === 'error') {
            this.elements.currentSizeDisplay.style.color = '#ff6b6b';
            this.elements.currentSizeDisplay.style.borderColor = '#ff6b6b';
        }
        else if (status === 'updating') {
            this.elements.currentSizeDisplay.style.color = '#ffd43b';
            this.elements.currentSizeDisplay.style.borderColor = '#ffd43b';
        }
        else {
            this.elements.currentSizeDisplay.style.color = '#51cf66';
            this.elements.currentSizeDisplay.style.borderColor = '#51cf66';
        }
    }
    /**
     * Set status value with appropriate styling
     */
    setStatusValue(elementId, text, status) {
        const element = this.elements[elementId];
        if (!element)
            return;
        element.textContent = text;
        // Reset classes
        element.className = 'status-value';
        // Add status class
        if (status !== 'success') {
            element.classList.add(status);
        }
    }
    /**
     * Cleanup when page unloads
     */
    cleanup() {
        if (this.sizeUpdateInterval) {
            clearInterval(this.sizeUpdateInterval);
        }
    }
}
// Initialize the app when the page loads
const app = new Alt1WindowResizeTest();
// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.cleanup();
    }
});


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