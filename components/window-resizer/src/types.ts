/**
 * Window Resizer Component Types
 *
 * Provides type definitions for the Alt1 window resizing system
 */

export interface WindowSize {
    width: number;
    height: number;
}

export interface WindowPosition {
    x: number;
    y: number;
}

export interface WindowBounds extends WindowPosition, WindowSize {}

export interface ResizeResult {
    success: boolean;
    method: ResizeMethod;
    previousSize?: WindowSize;
    newSize?: WindowSize;
    error?: string;
    fallbacksAttempted?: number;
    executionTime?: number;
}

export type ResizeMethod =
    | 'webapi'
    | 'alt1-native'
    | 'content-expansion'
    | 'external-window'
    | 'user-resize-simulation'
    | 'config-update'
    | 'failed';

export interface WindowCapabilities {
    webAPIs: {
        resizeTo: boolean;
        resizeBy: boolean;
        outerWidth: boolean;
        outerHeight: boolean;
    };
    alt1APIs: {
        userResize: boolean;
        updateConfig: boolean;
        windowControl: boolean;
    };
    contentExpansion: boolean;
    externalControl: boolean;
    detectedVersion?: string;
    limitations?: string[];
}

export interface LayoutPreset {
    name: string;
    displayName: string;
    width: number;
    height: number;
    description?: string;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    aspectRatio?: number;
    responsive?: boolean;
}

export interface ResizeStrategy {
    name: ResizeMethod;
    priority: number;
    isAvailable(): boolean;
    resize(width: number, height: number): Promise<ResizeResult>;
    validate?(capabilities: WindowCapabilities): boolean;
}

export interface ResizeOptions {
    animated?: boolean;
    duration?: number;
    preserveAspectRatio?: boolean;
    maxAttempts?: number;
    fallbackToContentExpansion?: boolean;
    onProgress?: (result: ResizeResult) => void;
    onError?: (error: string, method: ResizeMethod) => void;
}

export interface WindowLayoutManager {
    layouts: Map<string, LayoutPreset>;
    currentLayout: string;
    switchLayout(layoutName: string, options?: ResizeOptions): Promise<ResizeResult>;
    addLayout(layout: LayoutPreset): void;
    removeLayout(layoutName: string): boolean;
    getLayout(layoutName: string): LayoutPreset | undefined;
}

export interface ResizeEvent {
    type: 'resize-start' | 'resize-progress' | 'resize-complete' | 'resize-error';
    target: WindowSize;
    current?: WindowSize;
    method?: ResizeMethod;
    error?: string;
    timestamp: number;
}

export type ResizeEventListener = (event: ResizeEvent) => void;

export interface WindowResizerConfig {
    enableFallbacks?: boolean;
    maxFallbackAttempts?: number;
    animateResize?: boolean;
    resizeAnimationDuration?: number;
    detectCapabilitiesOnInit?: boolean;
    logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug';
    customStrategies?: ResizeStrategy[];
}

// Built-in layout constants
export const LAYOUT_PRESETS = {
    COMPACT: 'compact',
    EXPANDED: 'expanded',
    WIDE: 'wide',
    TALL: 'tall',
    DASHBOARD: 'dashboard',
    FULLSCREEN: 'fullscreen'
} as const;

export type BuiltInLayout = typeof LAYOUT_PRESETS[keyof typeof LAYOUT_PRESETS];