/**
 * Hybrid Window Manager
 *
 * Manages multiple hybrid windows that can be positioned anywhere on the RuneScape
 * window while maintaining interactive content areas using DOM elements.
 */
import { HybridWindow, HybridWindowConfig } from './HybridWindow';
export declare class HybridWindowManager {
    private _windows;
    private _activeWindow;
    private _isInitialized;
    constructor();
    createWindow(config: HybridWindowConfig): HybridWindow;
    createModal(config: HybridWindowConfig): HybridWindow;
    createSettingsModal(title: string, settingsElement: HTMLElement): HybridWindow;
    alert(title: string, message: string, rsX?: number, rsY?: number): Promise<void>;
    confirm(title: string, message: string, rsX?: number, rsY?: number): Promise<boolean>;
    getVisibleWindows(): HybridWindow[];
    closeAllWindows(): void;
    cascadeWindows(): void;
    tileWindows(): void;
    centerWindow(window: HybridWindow): void;
    private initialize;
    private setupGlobalEventHandlers;
    private handleWindowShown;
    private handleWindowFocused;
    private handleWindowClosed;
    private cycleWindows;
}
//# sourceMappingURL=HybridWindowManager.d.ts.map