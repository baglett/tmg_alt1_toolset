/**
 * Window Layout Manager
 *
 * Manages predefined and custom window layouts
 */
import { LayoutPreset, ResizeResult, ResizeOptions, WindowLayoutManager } from './types';
import { WindowResizer } from './WindowResizer';
export declare class LayoutManager implements WindowLayoutManager {
    layouts: Map<string, LayoutPreset>;
    currentLayout: string;
    private resizer;
    constructor(resizer: WindowResizer);
    /**
     * Switch to a specific layout
     */
    switchLayout(layoutName: string, options?: ResizeOptions): Promise<ResizeResult>;
    /**
     * Add a custom layout
     */
    addLayout(layout: LayoutPreset): void;
    /**
     * Remove a layout
     */
    removeLayout(layoutName: string): boolean;
    /**
     * Get a specific layout
     */
    getLayout(layoutName: string): LayoutPreset | undefined;
    /**
     * Get all available layouts
     */
    getAllLayouts(): LayoutPreset[];
    /**
     * Get layouts by category
     */
    getBuiltInLayouts(): LayoutPreset[];
    getCustomLayouts(): LayoutPreset[];
    /**
     * Create a layout from current window size
     */
    createLayoutFromCurrent(name: string, displayName?: string, description?: string): LayoutPreset;
    /**
     * Auto-detect optimal layout based on content
     */
    suggestLayout(): LayoutPreset;
    /**
     * Restore layout from previous session
     */
    restoreLayout(): void;
    private initializeBuiltInLayouts;
    private saveCurrentLayout;
    private saveLayoutsToStorage;
    private loadLayoutsFromStorage;
}
//# sourceMappingURL=LayoutManager.d.ts.map