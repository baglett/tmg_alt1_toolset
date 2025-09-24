/**
 * Interactive Windows Component - Type Definitions
 *
 * Provides truly interactive modal window system for Alt1 applications
 * using DOM-based windows with full event handling capabilities.
 */
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
/**
 * Configuration for creating an interactive window
 */
export interface InteractiveWindowConfig {
    /** Unique identifier for the window */
    id?: string;
    /** Window title displayed in title bar */
    title: string;
    /** Initial window dimensions */
    width: number;
    height: number;
    /** Initial window position (defaults to center) */
    x?: number;
    y?: number;
    /** Window content - can be HTML string, HTMLElement, or URL */
    content: string | HTMLElement | WindowContentConfig;
    /** Window behavior options */
    resizable?: boolean;
    draggable?: boolean;
    modal?: boolean;
    closable?: boolean;
    minimizable?: boolean;
    /** Window constraints */
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    /** Styling and appearance */
    theme?: WindowTheme;
    className?: string;
    /** Event handlers */
    onClose?: (window: InteractiveWindow) => void | boolean;
    onResize?: (window: InteractiveWindow, size: Size) => void;
    onMove?: (window: InteractiveWindow, position: Point) => void;
    onFocus?: (window: InteractiveWindow) => void;
    onBlur?: (window: InteractiveWindow) => void;
    onMinimize?: (window: InteractiveWindow) => void;
    onRestore?: (window: InteractiveWindow) => void;
}
/**
 * Configuration for window content that should be loaded from URL or component
 */
export interface WindowContentConfig {
    /** Content type */
    type: 'url' | 'component' | 'html';
    /** Source URL or HTML content */
    source: string;
    /** Props to pass to component (if type is 'component') */
    props?: Record<string, any>;
}
/**
 * Theme configuration for window appearance
 */
export interface WindowTheme {
    /** Title bar background color */
    titleBarColor: string;
    /** Title bar text color */
    titleBarTextColor: string;
    /** Window border color */
    borderColor: string;
    /** Window background color */
    backgroundColor: string;
    /** Window content background color */
    contentBackgroundColor?: string;
    /** Shadow color and properties */
    shadowColor: string;
    shadowBlur?: number;
    shadowOffset?: Point;
    /** Border radius for rounded corners */
    borderRadius?: number;
    /** Title bar height */
    titleBarHeight?: number;
    /** Border width */
    borderWidth?: number;
    /** Button colors */
    buttonColor?: string;
    buttonHoverColor?: string;
    buttonActiveColor?: string;
    /** Focus highlight color */
    focusColor?: string;
    /** Font family for title bar */
    fontFamily?: string;
    fontSize?: number;
}
/**
 * Current state of an interactive window
 */
export interface WindowState {
    id: string;
    position: Point;
    size: Size;
    visible: boolean;
    focused: boolean;
    minimized: boolean;
    maximized: boolean;
    zIndex?: number;
    dragging?: boolean;
    resizing?: boolean;
}
/**
 * Window event types
 */
export type WindowEventType = 'create' | 'close' | 'resize' | 'move' | 'focus' | 'blur' | 'minimize' | 'restore' | 'maximize' | 'beforeClose' | 'window-shown' | 'window-hidden' | 'window-closed' | 'window-focused' | 'window-blurred' | 'window-moved' | 'window-resized';
/**
 * Window event data
 */
export interface WindowEvent {
    type: WindowEventType;
    window: InteractiveWindow;
    data?: any;
    timestamp: number;
}
/**
 * Window resize handle positions
 */
export type ResizeHandle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
/**
 * Interactive window class interface
 */
export interface InteractiveWindow {
    /** Unique window identifier */
    readonly id: string;
    /** Current window state */
    readonly state: WindowState;
    /** Window configuration */
    readonly config: InteractiveWindowConfig;
    /** Window DOM element */
    readonly element: HTMLElement;
    /** Content container element */
    readonly contentElement: HTMLElement;
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
}
/**
 * Interactive window manager interface
 */
export interface InteractiveWindowManagerInterface {
    /** Get all managed windows */
    readonly windows: Map<string, InteractiveWindow>;
    /** Currently focused window */
    readonly focusedWindow: InteractiveWindow | null;
    createWindow(config: InteractiveWindowConfig): InteractiveWindow;
    getWindow(id: string): InteractiveWindow | null;
    closeWindow(id: string): boolean;
    closeAllWindows(): void;
    focusWindow(id: string): boolean;
    getNextWindow(): InteractiveWindow | null;
    getPreviousWindow(): InteractiveWindow | null;
    cascadeWindows(): void;
    tileWindows(): void;
    centerAllWindows(): void;
    on(event: WindowEventType, handler: (event: WindowEvent) => void): void;
    off(event: WindowEventType, handler?: (event: WindowEvent) => void): void;
    getVisibleWindows(): InteractiveWindow[];
    getWindowCount(): number;
    destroy(): void;
}
/**
 * Drag state information
 */
export interface DragState {
    isDragging: boolean;
    startPosition: Point;
    startWindowPosition: Point;
    offset: Point;
}
/**
 * Resize state information
 */
export interface ResizeState {
    isResizing: boolean;
    handle: ResizeHandle | null;
    startPosition: Point;
    startSize: Size;
    startWindowPosition: Point;
}
/**
 * Pre-defined window themes
 */
export declare const WindowThemes: {
    readonly DISCORD: {
        readonly titleBarColor: "#5865F2";
        readonly titleBarTextColor: "#FFFFFF";
        readonly borderColor: "#5865F2";
        readonly backgroundColor: "#36393F";
        readonly contentBackgroundColor: "#40444B";
        readonly shadowColor: "rgba(0, 0, 0, 0.3)";
        readonly shadowBlur: 10;
        readonly shadowOffset: {
            readonly x: 0;
            readonly y: 4;
        };
        readonly borderRadius: 8;
        readonly titleBarHeight: 32;
        readonly borderWidth: 1;
        readonly buttonColor: "#FFFFFF";
        readonly buttonHoverColor: "#FF5555";
        readonly buttonActiveColor: "#FF3333";
        readonly focusColor: "#5865F2";
        readonly fontFamily: "\"Whitney\", \"Helvetica Neue\", Helvetica, Arial, sans-serif";
        readonly fontSize: 14;
    };
    readonly RUNESCAPE: {
        readonly titleBarColor: "#5A4B2A";
        readonly titleBarTextColor: "#FFD700";
        readonly borderColor: "#8B7355";
        readonly backgroundColor: "#3E3424";
        readonly contentBackgroundColor: "#2D2618";
        readonly shadowColor: "rgba(0, 0, 0, 0.4)";
        readonly shadowBlur: 12;
        readonly shadowOffset: {
            readonly x: 0;
            readonly y: 6;
        };
        readonly borderRadius: 4;
        readonly titleBarHeight: 28;
        readonly borderWidth: 2;
        readonly buttonColor: "#FFD700";
        readonly buttonHoverColor: "#FF6B6B";
        readonly buttonActiveColor: "#FF4757";
        readonly focusColor: "#FFD700";
        readonly fontFamily: "\"Trajan Pro\", serif";
        readonly fontSize: 13;
    };
    readonly MODERN_DARK: {
        readonly titleBarColor: "#1E1E1E";
        readonly titleBarTextColor: "#FFFFFF";
        readonly borderColor: "#404040";
        readonly backgroundColor: "#2D2D30";
        readonly contentBackgroundColor: "#252526";
        readonly shadowColor: "rgba(0, 0, 0, 0.5)";
        readonly shadowBlur: 15;
        readonly shadowOffset: {
            readonly x: 0;
            readonly y: 8;
        };
        readonly borderRadius: 6;
        readonly titleBarHeight: 30;
        readonly borderWidth: 1;
        readonly buttonColor: "#FFFFFF";
        readonly buttonHoverColor: "#FF6B6B";
        readonly buttonActiveColor: "#FF4757";
        readonly focusColor: "#007ACC";
        readonly fontFamily: "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif";
        readonly fontSize: 14;
    };
    readonly MODERN_LIGHT: {
        readonly titleBarColor: "#F3F3F3";
        readonly titleBarTextColor: "#323130";
        readonly borderColor: "#D1D1D1";
        readonly backgroundColor: "#FFFFFF";
        readonly contentBackgroundColor: "#FAFAFA";
        readonly shadowColor: "rgba(0, 0, 0, 0.2)";
        readonly shadowBlur: 8;
        readonly shadowOffset: {
            readonly x: 0;
            readonly y: 2;
        };
        readonly borderRadius: 6;
        readonly titleBarHeight: 30;
        readonly borderWidth: 1;
        readonly buttonColor: "#323130";
        readonly buttonHoverColor: "#FF6B6B";
        readonly buttonActiveColor: "#FF4757";
        readonly focusColor: "#0078D4";
        readonly fontFamily: "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif";
        readonly fontSize: 14;
    };
};
//# sourceMappingURL=types.d.ts.map