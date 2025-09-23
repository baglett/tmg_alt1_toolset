export interface Point {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface Rect extends Point, Size {
}
export interface WindowConfig {
    id?: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    resizable?: boolean;
    draggable?: boolean;
    minimizable?: boolean;
    maximizable?: boolean;
    closable?: boolean;
    modal?: boolean;
    zIndex?: number;
    contentType?: WindowContentType;
    theme?: WindowTheme;
}
export type WindowContentType = 'blank' | 'ocr-settings' | 'dungeon-map' | 'advanced-settings' | 'inventory-tracker' | 'chat-monitor' | 'custom';
export interface WindowTheme {
    titleBarColor: number;
    titleBarTextColor: number;
    borderColor: number;
    backgroundColor: number;
    shadowColor: number;
    accentColor: number;
}
export interface InteractionEvent {
    type: 'click' | 'drag' | 'resize' | 'hover';
    position: Point;
    button?: number;
    windowId: string;
    timestamp: number;
}
export interface WindowEventHandlers {
    onMove?: (windowId: string, newPosition: Point) => void;
    onResize?: (windowId: string, newSize: Size) => void;
    onFocus?: (windowId: string) => void;
    onBlur?: (windowId: string) => void;
    onClose?: (windowId: string) => void;
    onMinimize?: (windowId: string) => void;
    onMaximize?: (windowId: string) => void;
}
export interface OverlayWindowState {
    id: string;
    config: WindowConfig;
    position: Point;
    size: Size;
    isVisible: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isFocused: boolean;
    isDragging: boolean;
    isResizing: boolean;
    zIndex: number;
    overlayGroup: string;
    lastInteraction: number;
}
export interface InteractionRegion {
    rect: Rect;
    type: 'titlebar' | 'content' | 'resize-handle' | 'close-button' | 'minimize-button' | 'maximize-button';
    cursor?: string;
}
export interface OverlayRenderContext {
    overlayGroup: string;
    zIndex: number;
    duration: number;
    opacity: number;
}
export type WindowEventType = 'window-created' | 'window-destroyed' | 'window-moved' | 'window-resized' | 'window-focused' | 'window-minimized' | 'window-maximized' | 'window-restored';
export interface WindowEvent {
    type: WindowEventType;
    windowId: string;
    data?: any;
    timestamp: number;
}
//# sourceMappingURL=types.d.ts.map