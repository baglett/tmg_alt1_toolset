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

export interface Rect extends Point, Size {}

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
    onClose?: (window: InteractiveWindow) => void | boolean; // return false to prevent close
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
export type WindowEventType =
    | 'create'
    | 'close'
    | 'resize'
    | 'move'
    | 'focus'
    | 'blur'
    | 'minimize'
    | 'restore'
    | 'maximize'
    | 'beforeClose'
    | 'window-shown'
    | 'window-hidden'
    | 'window-closed'
    | 'window-focused'
    | 'window-blurred'
    | 'window-moved'
    | 'window-resized';

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
export type ResizeHandle =
    | 'n' | 'ne' | 'e' | 'se'
    | 's' | 'sw' | 'w' | 'nw';

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

    // Window management methods
    show(): void;
    hide(): void;
    close(): void;
    focus(): void;
    blur(): void;
    minimize(): void;
    restore(): void;
    maximize(): void;

    // Position and size methods
    setPosition(x: number, y: number): void;
    setSize(width: number, height: number): void;
    center(): void;

    // Content methods
    setContent(content: string | HTMLElement): void;
    getContent(): HTMLElement;

    // Event handling
    on(event: WindowEventType, handler: (event: WindowEvent) => void): void;
    off(event: WindowEventType, handler?: (event: WindowEvent) => void): void;
    emit(event: WindowEventType, data?: any): void;

    // Utility methods
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

    // Window management
    createWindow(config: InteractiveWindowConfig): InteractiveWindow;
    getWindow(id: string): InteractiveWindow | null;
    closeWindow(id: string): boolean;
    closeAllWindows(): void;

    // Focus management
    focusWindow(id: string): boolean;
    getNextWindow(): InteractiveWindow | null;
    getPreviousWindow(): InteractiveWindow | null;

    // Layout management
    cascadeWindows(): void;
    tileWindows(): void;
    centerAllWindows(): void;

    // Event handling
    on(event: WindowEventType, handler: (event: WindowEvent) => void): void;
    off(event: WindowEventType, handler?: (event: WindowEvent) => void): void;

    // Utility methods
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
export const WindowThemes = {
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
} as const;