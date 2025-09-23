import { OverlayWindowManager } from './OverlayWindowManager';
export { OverlayWindowManager } from './OverlayWindowManager';
export { OverlayWindow } from './OverlayWindow';
export { InteractionDetector } from './InteractionDetector';
export type { WindowConfig, WindowContentType, WindowTheme, Point, Size, Rect, InteractionEvent, WindowEventHandlers, OverlayWindowState, InteractionRegion, OverlayRenderContext, WindowEventType, WindowEvent } from './types';
export default OverlayWindowManager;
export declare function createWindowManager(): OverlayWindowManager;
export declare const WindowThemes: {
    readonly DISCORD: {
        readonly titleBarColor: 1483076336;
        readonly titleBarTextColor: 4294967295;
        readonly borderColor: 1483076351;
        readonly backgroundColor: 791754480;
        readonly shadowColor: 80;
        readonly accentColor: 1921637119;
    };
    readonly RUNESCAPE: {
        readonly titleBarColor: 1514875632;
        readonly titleBarTextColor: 4292280575;
        readonly borderColor: 2339591679;
        readonly backgroundColor: 1043604720;
        readonly shadowColor: 96;
        readonly accentColor: 4292280575;
    };
    readonly DARK: {
        readonly titleBarColor: 505290480;
        readonly titleBarTextColor: 4294967295;
        readonly borderColor: 1077952767;
        readonly backgroundColor: 757936368;
        readonly shadowColor: 128;
        readonly accentColor: 8047871;
    };
    readonly LIGHT: {
        readonly titleBarColor: 4042322160;
        readonly titleBarTextColor: 255;
        readonly borderColor: 3435973887;
        readonly backgroundColor: 4294967264;
        readonly shadowColor: 64;
        readonly accentColor: 7918847;
    };
};
//# sourceMappingURL=index.d.ts.map