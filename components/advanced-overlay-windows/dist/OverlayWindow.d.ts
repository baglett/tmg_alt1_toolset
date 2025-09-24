import { WindowConfig, Point, Size, Rect, InteractionEvent } from './types';
/**
 * Individual overlay window with advanced rendering and interaction capabilities
 *
 * IMPORTANT: Alt1 overlay limitations:
 * - Overlays are purely visual and cannot receive mouse events directly
 * - Interactions must be handled by the main Alt1 application window
 * - Drag, resize, and click functionality requires workarounds using:
 *   1. Main window buttons to control overlay windows
 *   2. Keyboard shortcuts for window management
 *   3. Context menus in the main Alt1 app window
 *
 * This implementation provides the visual rendering and state management,
 * but actual interaction must be triggered from the main application.
 */
export declare class OverlayWindow {
    private state;
    private theme;
    private interactionRegions;
    private contentRenderer;
    private eventHandlers;
    private dragStartPosition;
    private resizeStartPosition;
    private resizeStartSize;
    private readonly titleBarHeight;
    private readonly borderWidth;
    private readonly shadowOffset;
    private readonly shadowBlur;
    private static getDefaultTheme;
    constructor(config: WindowConfig);
    /**
     * Get window ID
     */
    get id(): string;
    /**
     * Get window position
     */
    get position(): Point;
    /**
     * Get window size
     */
    get size(): Size;
    /**
     * Get window visibility
     */
    get isVisible(): boolean;
    /**
     * Get window overlay group
     */
    get overlayGroup(): string;
    /**
     * Set window position
     */
    setPosition(x: number, y: number): void;
    /**
     * Set window size
     */
    setSize(width: number, height: number): void;
    /**
     * Show window
     */
    show(): void;
    /**
     * Hide window
     */
    hide(): void;
    /**
     * Focus window
     */
    focus(): void;
    /**
     * Blur window
     */
    blur(): void;
    /**
     * Minimize window
     */
    minimize(): void;
    /**
     * Restore window from minimized state
     */
    restore(): void;
    /**
     * Close window
     */
    close(): void;
    /**
     * Set content renderer function
     */
    setContentRenderer(renderer: (window: OverlayWindow) => void): void;
    /**
     * Main render method
     */
    render(): void;
    /**
     * Handle interaction events
     */
    handleInteraction(event: InteractionEvent): void;
    /**
     * Add event listener
     */
    on(event: string, handler: Function): void;
    /**
     * Remove event listener
     */
    off(event: string, handler: Function): void;
    /**
     * Get interaction regions for this window
     */
    getInteractionRegions(): Rect[];
    private generateId;
    private setupInteractionRegions;
    private renderShadow;
    private renderFrame;
    private renderTitleBar;
    private renderContent;
    private renderDefaultContent;
    private renderControlButtons;
    private handleClick;
    private handleDrag;
    private handleHover;
    private startDrag;
    private startResize;
    private getRegionAtPosition;
    private isPointInRect;
    private clearOverlays;
    private emit;
}
//# sourceMappingURL=OverlayWindow.d.ts.map