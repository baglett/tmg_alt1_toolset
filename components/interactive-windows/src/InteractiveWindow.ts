/**
 * Interactive Window Implementation
 *
 * Provides a truly interactive DOM-based window with full drag, resize, and event handling.
 * Unlike Alt1 overlays, these windows can receive mouse events and user interactions.
 */

import {
    InteractiveWindow as IInteractiveWindow,
    InteractiveWindowConfig,
    WindowState,
    WindowEvent,
    WindowEventType,
    Point,
    Size,
    DragState,
    ResizeState,
    ResizeHandle,
    WindowTheme,
    WindowThemes
} from './types';

export class InteractiveWindow implements IInteractiveWindow {
    private _id: string;
    private _config: InteractiveWindowConfig;
    private _state: WindowState;
    private _element!: HTMLElement;
    private _contentElement!: HTMLElement;
    private _titleBarElement!: HTMLElement;
    private _titleElement!: HTMLElement;
    private _buttonsElement!: HTMLElement;
    private _closeButton!: HTMLElement;
    private _minimizeButton!: HTMLElement;
    private _maximizeButton!: HTMLElement;
    private _resizeHandles: Map<ResizeHandle, HTMLElement> = new Map();

    // Event handling
    private _eventHandlers: Map<WindowEventType, ((event: WindowEvent) => void)[]> = new Map();

    // Interaction state
    private _dragState: DragState = {
        isDragging: false,
        startPosition: { x: 0, y: 0 },
        startWindowPosition: { x: 0, y: 0 },
        offset: { x: 0, y: 0 }
    };

    private _resizeState: ResizeState = {
        isResizing: false,
        handle: null,
        startPosition: { x: 0, y: 0 },
        startSize: { width: 0, height: 0 },
        startWindowPosition: { x: 0, y: 0 }
    };

    // Theme and styling
    private _theme: WindowTheme;
    private _styleElement: HTMLStyleElement | null = null;

    constructor(config: InteractiveWindowConfig) {
        this._id = config.id || this.generateId();
        this._config = { ...config };
        this._theme = config.theme || WindowThemes.MODERN_DARK;

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
    get id(): string { return this._id; }
    get state(): WindowState { return { ...this._state }; }
    get config(): InteractiveWindowConfig { return { ...this._config }; }
    get element(): HTMLElement { return this._element; }
    get contentElement(): HTMLElement { return this._contentElement; }

    // Window management methods
    show(): void {
        if (this._state.visible) return;

        this._state.visible = true;
        this._element.style.display = 'block';

        // Add to DOM if not already added
        if (!this._element.parentElement) {
            document.body.appendChild(this._element);
        }

        this.emit('create');
        this.focus();
    }

    hide(): void {
        if (!this._state.visible) return;

        this._state.visible = false;
        this._element.style.display = 'none';
        this.emit('close');
    }

    close(): void {
        // Call onClose handler if provided
        if (this._config.onClose) {
            const shouldClose = this._config.onClose(this);
            if (shouldClose === false) return;
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

    focus(): void {
        if (this._state.focused) return;

        this._state.focused = true;
        this._element.classList.add('iwm-focused');
        this.bringToFront();
        this.emit('focus');

        if (this._config.onFocus) {
            this._config.onFocus(this);
        }
    }

    blur(): void {
        if (!this._state.focused) return;

        this._state.focused = false;
        this._element.classList.remove('iwm-focused');
        this.emit('blur');

        if (this._config.onBlur) {
            this._config.onBlur(this);
        }
    }

    minimize(): void {
        if (this._state.minimized) return;

        this._state.minimized = true;
        this._element.classList.add('iwm-minimized');
        this._element.style.display = 'none';
        this.emit('minimize');

        if (this._config.onMinimize) {
            this._config.onMinimize(this);
        }
    }

    restore(): void {
        if (!this._state.minimized && !this._state.maximized) return;

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

    maximize(): void {
        if (this._state.maximized) return;

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
    setPosition(x: number, y: number): void {
        this._state.position = { x, y };
        this.updateElementStyle();
        this.emit('move');

        if (this._config.onMove) {
            this._config.onMove(this, this._state.position);
        }
    }

    setSize(width: number, height: number): void {
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

    center(): void {
        const centerPos = this.getCenterPosition();
        this.setPosition(centerPos.x, centerPos.y);
    }

    // Content methods
    setContent(content: string | HTMLElement): void {
        this._contentElement.innerHTML = '';

        if (typeof content === 'string') {
            this._contentElement.innerHTML = content;
        } else {
            this._contentElement.appendChild(content);
        }
    }

    getContent(): HTMLElement {
        return this._contentElement;
    }

    // Event handling
    on(event: WindowEventType, handler: (event: WindowEvent) => void): void {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, []);
        }
        this._eventHandlers.get(event)!.push(handler);
    }

    off(event: WindowEventType, handler?: (event: WindowEvent) => void): void {
        if (!this._eventHandlers.has(event)) return;

        if (handler) {
            const handlers = this._eventHandlers.get(event)!;
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        } else {
            this._eventHandlers.set(event, []);
        }
    }

    emit(event: WindowEventType, data?: any): void {
        const eventObj: WindowEvent = {
            type: event,
            window: this,
            data,
            timestamp: Date.now()
        };

        if (this._eventHandlers.has(event)) {
            this._eventHandlers.get(event)!.forEach(handler => {
                try {
                    handler(eventObj);
                } catch (error) {
                    console.error(`Error in window event handler for ${event}:`, error);
                }
            });
        }
    }

    // Utility methods
    bringToFront(): void {
        // Find the highest z-index among all windows
        let maxZIndex = 1000;
        document.querySelectorAll('.iwm-window').forEach(el => {
            const zIndex = parseInt((el as HTMLElement).style.zIndex || '1000');
            maxZIndex = Math.max(maxZIndex, zIndex);
        });

        this._state.zIndex = maxZIndex + 1;
        this._element.style.zIndex = this._state.zIndex.toString();
    }

    sendToBack(): void {
        this._state.zIndex = 999;
        this._element.style.zIndex = this._state.zIndex.toString();
    }

    isVisible(): boolean { return this._state.visible; }
    isFocused(): boolean { return this._state.focused; }
    isMinimized(): boolean { return this._state.minimized; }
    isMaximized(): boolean { return this._state.maximized; }

    // Private methods
    private generateId(): string {
        return `iwm-window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private getCenterPosition(): Point {
        return {
            x: (window.innerWidth - this._state.size.width) / 2,
            y: (window.innerHeight - this._state.size.height) / 2
        };
    }

    private createElement(): void {
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
            this.setContent(this._config.content as any);
        }

        this.updateElementStyle();
    }

    private createButton(type: string, symbol: string): HTMLElement {
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

    private createResizeHandles(): void {
        const handles: ResizeHandle[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

        handles.forEach(handle => {
            const element = document.createElement('div');
            element.className = `iwm-resize-handle iwm-resize-${handle}`;
            element.style.cssText = this.getResizeHandleStyle(handle);
            this._element.appendChild(element);
            this._resizeHandles.set(handle, element);
        });
    }

    private getResizeHandleStyle(handle: ResizeHandle): string {
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

    private attachEventListeners(): void {
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
            } else {
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

    private onDragStart(e: MouseEvent): void {
        if (e.button !== 0) return; // Only left mouse button
        if ((e.target as HTMLElement).closest('.iwm-button')) return; // Don't drag when clicking buttons

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

    private onDragMove(e: MouseEvent): void {
        if (!this._dragState.isDragging) return;

        const newX = e.clientX - this._dragState.offset.x;
        const newY = e.clientY - this._dragState.offset.y;

        this.setPosition(newX, newY);
    }

    private onDragEnd(): void {
        this._dragState.isDragging = false;
        document.removeEventListener('mousemove', this.onDragMove.bind(this));
        document.removeEventListener('mouseup', this.onDragEnd.bind(this));
        document.body.style.cursor = '';
    }

    private onResizeStart(e: MouseEvent, handle: ResizeHandle): void {
        if (e.button !== 0) return;

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

    private onResizeMove(e: MouseEvent): void {
        if (!this._resizeState.isResizing || !this._resizeState.handle) return;

        const deltaX = e.clientX - this._resizeState.startPosition.x;
        const deltaY = e.clientY - this._resizeState.startPosition.y;

        let newWidth = this._resizeState.startSize.width;
        let newHeight = this._resizeState.startSize.height;
        let newX = this._resizeState.startWindowPosition.x;
        let newY = this._resizeState.startWindowPosition.y;

        const handle = this._resizeState.handle;

        // Calculate new dimensions based on resize handle
        if (handle.includes('e')) newWidth += deltaX;
        if (handle.includes('w')) { newWidth -= deltaX; newX += deltaX; }
        if (handle.includes('s')) newHeight += deltaY;
        if (handle.includes('n')) { newHeight -= deltaY; newY += deltaY; }

        // Apply constraints
        const minWidth = this._config.minWidth || 200;
        const minHeight = this._config.minHeight || 100;

        if (newWidth < minWidth) {
            if (handle.includes('w')) newX = this._resizeState.startWindowPosition.x + (this._resizeState.startSize.width - minWidth);
            newWidth = minWidth;
        }

        if (newHeight < minHeight) {
            if (handle.includes('n')) newY = this._resizeState.startWindowPosition.y + (this._resizeState.startSize.height - minHeight);
            newHeight = minHeight;
        }

        this.setSize(newWidth, newHeight);
        if (handle.includes('w') || handle.includes('n')) {
            this.setPosition(newX, newY);
        }
    }

    private onResizeEnd(): void {
        this._resizeState.isResizing = false;
        this._resizeState.handle = null;
        document.removeEventListener('mousemove', this.onResizeMove.bind(this));
        document.removeEventListener('mouseup', this.onResizeEnd.bind(this));
    }

    private updateElementStyle(): void {
        this._element.style.left = `${this._state.position.x}px`;
        this._element.style.top = `${this._state.position.y}px`;
        this._element.style.width = `${this._state.size.width}px`;
        this._element.style.height = `${this._state.size.height}px`;
    }

    private applyTheme(): void {
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