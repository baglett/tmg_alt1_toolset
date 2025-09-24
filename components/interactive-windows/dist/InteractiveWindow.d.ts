/**
 * Interactive Window Implementation
 *
 * Provides a truly interactive DOM-based window with full drag, resize, and event handling.
 * Unlike Alt1 overlays, these windows can receive mouse events and user interactions.
 */
import { InteractiveWindow as IInteractiveWindow, InteractiveWindowConfig, WindowState, WindowEvent, WindowEventType } from './types';
export declare class InteractiveWindow implements IInteractiveWindow {
    private _id;
    private _config;
    private _state;
    private _element;
    private _contentElement;
    private _titleBarElement;
    private _titleElement;
    private _buttonsElement;
    private _closeButton;
    private _minimizeButton;
    private _maximizeButton;
    private _resizeHandles;
    private _eventHandlers;
    private _dragState;
    private _resizeState;
    private _theme;
    private _styleElement;
    constructor(config: InteractiveWindowConfig);
    get id(): string;
    get state(): WindowState;
    get config(): InteractiveWindowConfig;
    get element(): HTMLElement;
    get contentElement(): HTMLElement;
    show(): void;
    hide(): void;
    close(): void;
    focus(): void;
    blur(): void;
    minimize(): void;
    restore(): void;
    maximize(): void;
    setPosition(x: number, y: number): void;
    setSize(width: number, height: number): void;
    center(): void;
    setContent(content: string | HTMLElement): void;
    getContent(): HTMLElement;
    on(event: WindowEventType, handler: (event: WindowEvent) => void): void;
    off(event: WindowEventType, handler?: (event: WindowEvent) => void): void;
    emit(event: WindowEventType, data?: any): void;
    bringToFront(): void;
    sendToBack(): void;
    isVisible(): boolean;
    isFocused(): boolean;
    isMinimized(): boolean;
    isMaximized(): boolean;
    private generateId;
    private getCenterPosition;
    private createElement;
    private createButton;
    private createResizeHandles;
    private getResizeHandleStyle;
    private attachEventListeners;
    private onDragStart;
    private onDragMove;
    private onDragEnd;
    private onResizeStart;
    private onResizeMove;
    private onResizeEnd;
    private updateElementStyle;
    private applyTheme;
}
//# sourceMappingURL=InteractiveWindow.d.ts.map