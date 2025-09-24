/**
 * Interactive Window Manager
 *
 * Manages multiple interactive windows with focus handling, layout management,
 * and global event coordination.
 */
import { InteractiveWindow } from './InteractiveWindow';
import { InteractiveWindowManagerInterface, InteractiveWindowConfig, WindowEvent, WindowEventType } from './types';
export declare class InteractiveWindowManager implements InteractiveWindowManagerInterface {
    private _windows;
    private _focusedWindow;
    private _eventHandlers;
    private _nextZIndex;
    private _cascadeOffset;
    get windows(): Map<string, InteractiveWindow>;
    get focusedWindow(): InteractiveWindow | null;
    constructor();
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
    createModal(config: Omit<InteractiveWindowConfig, 'modal'> & {
        modal?: boolean;
    }): InteractiveWindow;
    createDialog(title: string, content: string | HTMLElement, buttons?: {
        text: string;
        onClick: () => void;
        primary?: boolean;
    }[]): InteractiveWindow;
    createSettingsModal(title: string, settingsContent: HTMLElement): InteractiveWindow;
    alert(title: string, message: string): Promise<void>;
    confirm(title: string, message: string): Promise<boolean>;
    private emit;
    private setupWindowEventForwarding;
    private setupGlobalEventHandlers;
    private removeGlobalEventHandlers;
    private onGlobalKeyDown;
    private onWindowResize;
    private onDocumentClick;
    private getTopMostWindow;
}
//# sourceMappingURL=InteractiveWindowManager.d.ts.map