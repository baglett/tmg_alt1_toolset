// Advanced Overlay Windows - Main Export
//
// This component provides sophisticated window management for Alt1 applications
// using overlay-based virtual windows with computer vision interaction detection.

import { OverlayWindowManager } from './OverlayWindowManager';

export { OverlayWindowManager } from './OverlayWindowManager';
export { OverlayWindow } from './OverlayWindow';
export { InteractionDetector } from './InteractionDetector';

export type {
    WindowConfig,
    WindowContentType,
    WindowTheme,
    Point,
    Size,
    Rect,
    InteractionEvent,
    WindowEventHandlers,
    OverlayWindowState,
    InteractionRegion,
    OverlayRenderContext,
    WindowEventType,
    WindowEvent
} from './types';

// Default export for easier consumption
export default OverlayWindowManager;

// Convenience factory function
export function createWindowManager(): OverlayWindowManager {
    return new OverlayWindowManager();
}

// Pre-configured themes
export const WindowThemes = {
    DISCORD: {
        titleBarColor: 0x5865F2F0,     // Discord purple with transparency
        titleBarTextColor: 0xFFFFFFFF, // White text
        borderColor: 0x5865F2FF,       // Purple border
        backgroundColor: 0x2F3136F0,   // Dark background with transparency
        shadowColor: 0x00000050,       // Dark shadow
        accentColor: 0x7289DAFF        // Light purple accent
    },
    RUNESCAPE: {
        titleBarColor: 0x5A4B2AF0,     // RuneScape brown
        titleBarTextColor: 0xFFD700FF, // Gold text
        borderColor: 0x8B7355FF,       // Light brown border
        backgroundColor: 0x3E3424F0,   // Dark brown background
        shadowColor: 0x00000060,       // Darker shadow
        accentColor: 0xFFD700FF        // Gold accent
    },
    DARK: {
        titleBarColor: 0x1E1E1EF0,     // Dark gray
        titleBarTextColor: 0xFFFFFFFF, // White text
        borderColor: 0x404040FF,       // Medium gray border
        backgroundColor: 0x2D2D30F0,   // Dark background
        shadowColor: 0x00000080,       // Strong shadow
        accentColor: 0x007ACCFF        // Blue accent
    },
    LIGHT: {
        titleBarColor: 0xF0F0F0F0,     // Light gray
        titleBarTextColor: 0x000000FF, // Black text
        borderColor: 0xCCCCCCFF,       // Light border
        backgroundColor: 0xFFFFFFE0,   // White background with slight transparency
        shadowColor: 0x00000040,       // Light shadow
        accentColor: 0x0078D4FF        // Blue accent
    }
} as const;