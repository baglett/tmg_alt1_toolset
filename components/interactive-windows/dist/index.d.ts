/**
 * Interactive Windows Component - Main Export
 *
 * Provides truly interactive modal window system for Alt1 applications
 * with full drag, resize, close functionality using DOM-based windows.
 */
import { InteractiveWindowManager } from './InteractiveWindowManager';
export { InteractiveWindowManager } from './InteractiveWindowManager';
export { InteractiveWindow } from './InteractiveWindow';
export type { InteractiveWindowConfig, InteractiveWindowManagerInterface, InteractiveWindow as IInteractiveWindow, WindowState, WindowEvent, WindowEventType, WindowTheme, WindowContentConfig, Point, Size, Rect, DragState, ResizeState, ResizeHandle } from './types';
export { WindowThemes } from './types';
export default InteractiveWindowManager;
export declare function createWindowManager(): InteractiveWindowManager;
export declare function getGlobalWindowManager(): InteractiveWindowManager;
export declare function createModal(config: import('./types').InteractiveWindowConfig): import('./InteractiveWindow').InteractiveWindow;
export declare function createDialog(title: string, content: string | HTMLElement, buttons?: {
    text: string;
    onClick: () => void;
    primary?: boolean;
}[]): import('./InteractiveWindow').InteractiveWindow;
export declare function createSettingsModal(title: string, settingsContent: HTMLElement): import('./InteractiveWindow').InteractiveWindow;
export declare function alert(title: string, message: string): Promise<void>;
export declare function confirm(title: string, message: string): Promise<boolean>;
export declare function createSettingsTemplate(settings: {
    title?: string;
    sections: {
        title: string;
        fields: {
            label: string;
            type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'range';
            key: string;
            value?: any;
            options?: {
                label: string;
                value: any;
            }[];
            min?: number;
            max?: number;
            step?: number;
            placeholder?: string;
        }[];
    }[];
    onSave?: (values: Record<string, any>) => void;
    onCancel?: () => void;
}): HTMLElement;
//# sourceMappingURL=index.d.ts.map