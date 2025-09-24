/**
 * Hybrid Window System
 *
 * Combines Alt1 overlays for positioning with DOM elements for interactivity.
 * This allows windows to be positioned anywhere on the RuneScape window while
 * maintaining full interactive capabilities within content areas.
 */
import { InteractiveWindowConfig, WindowState, WindowEventType } from './types';
export interface HybridWindowConfig extends InteractiveWindowConfig {
    rsX?: number;
    rsY?: number;
    useOverlayChrome?: boolean;
    overlayColor?: number;
    overlayLineWidth?: number;
    overlayDuration?: number;
}
export declare class HybridWindow {
    private _id;
    private _config;
    private _state;
    private _domElement;
    private _contentElement;
    private _overlayUpdateInterval;
    private _eventHandlers;
    constructor(config: HybridWindowConfig);
    get id(): string;
    get state(): WindowState;
    get element(): HTMLElement;
    show(): void;
    hide(): void;
    close(): void;
    focus(): void;
    blur(): void;
    setRSPosition(rsX: number, rsY: number): void;
    setSize(width: number, height: number): void;
    setContent(content: string | HTMLElement): void;
    on(event: WindowEventType, handler: Function): void;
    off(event: WindowEventType, handler?: Function): void;
    private generateId;
    private createElement;
    private setupEventHandlers;
    private updateDOMPosition;
    private convertRSToDOMCoordinates;
    private startOverlayUpdates;
    private stopOverlayUpdates;
    private emit;
    private cleanup;
}
//# sourceMappingURL=HybridWindow.d.ts.map