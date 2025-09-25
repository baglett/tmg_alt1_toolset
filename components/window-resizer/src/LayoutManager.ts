/**
 * Window Layout Manager
 *
 * Manages predefined and custom window layouts
 */

import { LayoutPreset, ResizeResult, ResizeOptions, WindowLayoutManager, LAYOUT_PRESETS, BuiltInLayout } from './types';
import { WindowResizer } from './WindowResizer';

export class LayoutManager implements WindowLayoutManager {
    layouts: Map<string, LayoutPreset> = new Map();
    currentLayout: string = LAYOUT_PRESETS.COMPACT;

    private resizer: WindowResizer;

    constructor(resizer: WindowResizer) {
        this.resizer = resizer;
        this.initializeBuiltInLayouts();
    }

    /**
     * Switch to a specific layout
     */
    async switchLayout(layoutName: string, options: ResizeOptions = {}): Promise<ResizeResult> {
        const layout = this.layouts.get(layoutName);
        if (!layout) {
            return {
                success: false,
                method: 'failed',
                error: `Layout '${layoutName}' not found`,
                executionTime: 0
            };
        }

        try {
            const result = await this.resizer.resizeWindow(layout.width, layout.height, options);

            if (result.success) {
                this.currentLayout = layoutName;

                // Save current layout to localStorage
                this.saveCurrentLayout();
            }

            return result;
        } catch (error) {
            return {
                success: false,
                method: 'failed',
                error: `Failed to switch to layout '${layoutName}': ${error instanceof Error ? error.message : String(error)}`,
                executionTime: 0
            };
        }
    }

    /**
     * Add a custom layout
     */
    addLayout(layout: LayoutPreset): void {
        // Validate layout
        if (!layout.name || layout.width < 100 || layout.height < 100) {
            throw new Error('Invalid layout: name is required and dimensions must be at least 100x100');
        }

        this.layouts.set(layout.name, { ...layout });
        this.saveLayoutsToStorage();
    }

    /**
     * Remove a layout
     */
    removeLayout(layoutName: string): boolean {
        // Don't allow removing built-in layouts
        if (Object.values(LAYOUT_PRESETS).includes(layoutName as BuiltInLayout)) {
            return false;
        }

        const removed = this.layouts.delete(layoutName);
        if (removed) {
            this.saveLayoutsToStorage();

            // If removing current layout, switch to compact
            if (this.currentLayout === layoutName) {
                this.currentLayout = LAYOUT_PRESETS.COMPACT;
                this.saveCurrentLayout();
            }
        }

        return removed;
    }

    /**
     * Get a specific layout
     */
    getLayout(layoutName: string): LayoutPreset | undefined {
        return this.layouts.get(layoutName);
    }

    /**
     * Get all available layouts
     */
    getAllLayouts(): LayoutPreset[] {
        return Array.from(this.layouts.values());
    }

    /**
     * Get layouts by category
     */
    getBuiltInLayouts(): LayoutPreset[] {
        return Array.from(this.layouts.values()).filter(layout =>
            Object.values(LAYOUT_PRESETS).includes(layout.name as BuiltInLayout)
        );
    }

    getCustomLayouts(): LayoutPreset[] {
        return Array.from(this.layouts.values()).filter(layout =>
            !Object.values(LAYOUT_PRESETS).includes(layout.name as BuiltInLayout)
        );
    }

    /**
     * Create a layout from current window size
     */
    createLayoutFromCurrent(name: string, displayName?: string, description?: string): LayoutPreset {
        const currentSize = this.resizer.getCurrentSize();

        const layout: LayoutPreset = {
            name,
            displayName: displayName || name,
            width: currentSize.width,
            height: currentSize.height,
            description,
            minWidth: Math.max(100, currentSize.width - 200),
            maxWidth: currentSize.width + 400,
            minHeight: Math.max(100, currentSize.height - 200),
            maxHeight: currentSize.height + 400
        };

        this.addLayout(layout);
        return layout;
    }

    /**
     * Auto-detect optimal layout based on content
     */
    suggestLayout(): LayoutPreset {
        const currentSize = this.resizer.getCurrentSize();
        const contentHeight = document.body.scrollHeight;
        const contentWidth = document.body.scrollWidth;

        // If content is overflowing, suggest larger layout
        if (contentHeight > currentSize.height || contentWidth > currentSize.width) {
            if (contentWidth > 800) {
                return this.getLayout(LAYOUT_PRESETS.DASHBOARD)!;
            } else if (contentHeight > 700) {
                return this.getLayout(LAYOUT_PRESETS.TALL)!;
            } else {
                return this.getLayout(LAYOUT_PRESETS.EXPANDED)!;
            }
        }

        // If window is much larger than content, suggest compact
        if (contentHeight < currentSize.height * 0.6 && contentWidth < currentSize.width * 0.6) {
            return this.getLayout(LAYOUT_PRESETS.COMPACT)!;
        }

        // Current layout is probably optimal
        return this.getLayout(this.currentLayout) || this.getLayout(LAYOUT_PRESETS.COMPACT)!;
    }

    /**
     * Restore layout from previous session
     */
    restoreLayout(): void {
        const saved = localStorage.getItem('alt1-resizer-current-layout');
        if (saved && this.layouts.has(saved)) {
            this.currentLayout = saved;
        }

        // Load custom layouts
        this.loadLayoutsFromStorage();
    }

    // Private methods
    private initializeBuiltInLayouts(): void {
        const builtInLayouts: LayoutPreset[] = [
            {
                name: LAYOUT_PRESETS.COMPACT,
                displayName: 'Compact',
                width: 450,
                height: 600,
                description: 'Standard Alt1 plugin size for basic functionality',
                minWidth: 400,
                maxWidth: 500,
                minHeight: 500,
                maxHeight: 700,
                responsive: false
            },
            {
                name: LAYOUT_PRESETS.EXPANDED,
                displayName: 'Expanded',
                width: 700,
                height: 800,
                description: 'Larger window for advanced tools and multiple panels',
                minWidth: 600,
                maxWidth: 900,
                minHeight: 700,
                maxHeight: 1000,
                responsive: true
            },
            {
                name: LAYOUT_PRESETS.WIDE,
                displayName: 'Wide',
                width: 1000,
                height: 600,
                description: 'Wide layout for side-by-side panels and data tables',
                minWidth: 800,
                maxWidth: 1400,
                minHeight: 500,
                maxHeight: 700,
                aspectRatio: 1.67,
                responsive: true
            },
            {
                name: LAYOUT_PRESETS.TALL,
                displayName: 'Tall',
                width: 500,
                height: 900,
                description: 'Tall layout for inventory tools and vertical lists',
                minWidth: 400,
                maxWidth: 600,
                minHeight: 800,
                maxHeight: 1200,
                aspectRatio: 0.56,
                responsive: true
            },
            {
                name: LAYOUT_PRESETS.DASHBOARD,
                displayName: 'Dashboard',
                width: 1200,
                height: 800,
                description: 'Large dashboard for comprehensive multi-tool interfaces',
                minWidth: 1000,
                maxWidth: 1600,
                minHeight: 700,
                maxHeight: 1000,
                aspectRatio: 1.5,
                responsive: true
            },
            {
                name: LAYOUT_PRESETS.FULLSCREEN,
                displayName: 'Fullscreen',
                width: Math.min(1920, screen.width || 1920),
                height: Math.min(1080, screen.height || 1080),
                description: 'Maximum size for comprehensive interfaces',
                minWidth: 1200,
                maxWidth: 2560,
                minHeight: 800,
                maxHeight: 1600,
                responsive: true
            }
        ];

        builtInLayouts.forEach(layout => {
            this.layouts.set(layout.name, layout);
        });
    }

    private saveCurrentLayout(): void {
        try {
            localStorage.setItem('alt1-resizer-current-layout', this.currentLayout);
        } catch (e) {
            console.warn('[LayoutManager] Failed to save current layout to localStorage');
        }
    }

    private saveLayoutsToStorage(): void {
        try {
            const customLayouts = this.getCustomLayouts();
            localStorage.setItem('alt1-resizer-custom-layouts', JSON.stringify(customLayouts));
        } catch (e) {
            console.warn('[LayoutManager] Failed to save custom layouts to localStorage');
        }
    }

    private loadLayoutsFromStorage(): void {
        try {
            const saved = localStorage.getItem('alt1-resizer-custom-layouts');
            if (saved) {
                const customLayouts: LayoutPreset[] = JSON.parse(saved);
                customLayouts.forEach(layout => {
                    // Don't overwrite built-in layouts
                    if (!Object.values(LAYOUT_PRESETS).includes(layout.name as BuiltInLayout)) {
                        this.layouts.set(layout.name, layout);
                    }
                });
            }
        } catch (e) {
            console.warn('[LayoutManager] Failed to load custom layouts from localStorage');
        }
    }
}