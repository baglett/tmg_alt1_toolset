import * as alt1lib from 'alt1';
import { WindowConfig, OverlayWindowState, Point, Size, Rect, InteractionEvent, InteractionRegion, WindowTheme } from './types';

/**
 * Individual overlay window with advanced rendering and interaction capabilities
 */
export class OverlayWindow {
    private state: OverlayWindowState;
    private theme: WindowTheme;
    private interactionRegions: InteractionRegion[] = [];
    private contentRenderer: ((window: OverlayWindow) => void) | null = null;
    private eventHandlers: Map<string, Function[]> = new Map();

    // Interaction state
    private dragStartPosition: Point | null = null;
    private resizeStartPosition: Point | null = null;
    private resizeStartSize: Size | null = null;

    // Rendering constants
    private readonly titleBarHeight = 30;
    private readonly borderWidth = 2;
    private readonly shadowOffset = 3;
    private readonly shadowBlur = 5;

    // Default theme
    private static readonly DEFAULT_THEME: WindowTheme = {
        titleBarColor: alt1lib.mixColor(88, 101, 242, 240),     // Discord purple
        titleBarTextColor: alt1lib.mixColor(255, 255, 255, 255), // White text
        borderColor: alt1lib.mixColor(88, 101, 242, 255),       // Purple border
        backgroundColor: alt1lib.mixColor(47, 49, 54, 240),     // Dark background
        shadowColor: alt1lib.mixColor(0, 0, 0, 80),             // Dark shadow
        accentColor: alt1lib.mixColor(114, 137, 218, 255)       // Light purple accent
    };

    constructor(config: WindowConfig) {
        this.state = {
            id: config.id || this.generateId(),
            config: { ...config },
            position: { x: config.x, y: config.y },
            size: { width: config.width, height: config.height },
            isVisible: true,
            isMinimized: false,
            isMaximized: false,
            isFocused: false,
            isDragging: false,
            isResizing: false,
            zIndex: config.zIndex || 1000,
            overlayGroup: `window_${config.id || this.generateId()}`,
            lastInteraction: Date.now()
        };

        this.theme = config.theme || { ...OverlayWindow.DEFAULT_THEME };
        this.setupInteractionRegions();
    }

    /**
     * Get window ID
     */
    get id(): string {
        return this.state.id;
    }

    /**
     * Get window position
     */
    get position(): Point {
        return { ...this.state.position };
    }

    /**
     * Get window size
     */
    get size(): Size {
        return { ...this.state.size };
    }

    /**
     * Get window visibility
     */
    get isVisible(): boolean {
        return this.state.isVisible;
    }

    /**
     * Get window overlay group
     */
    get overlayGroup(): string {
        return this.state.overlayGroup;
    }

    /**
     * Set window position
     */
    setPosition(x: number, y: number): void {
        this.state.position = { x: Math.round(x), y: Math.round(y) };
        this.setupInteractionRegions();
        this.emit('moved', this.state.position);
    }

    /**
     * Set window size
     */
    setSize(width: number, height: number): void {
        this.state.size = { width: Math.round(width), height: Math.round(height) };
        this.setupInteractionRegions();
        this.emit('resized', this.state.size);
    }

    /**
     * Show window
     */
    show(): void {
        this.state.isVisible = true;
        this.render();
        this.emit('shown');
    }

    /**
     * Hide window
     */
    hide(): void {
        this.state.isVisible = false;
        this.clearOverlays();
        this.emit('hidden');
    }

    /**
     * Focus window
     */
    focus(): void {
        this.state.isFocused = true;
        this.state.lastInteraction = Date.now();
        this.render(); // Re-render with focus styling
        this.emit('focused');
    }

    /**
     * Blur window
     */
    blur(): void {
        this.state.isFocused = false;
        this.render(); // Re-render without focus styling
        this.emit('blurred');
    }

    /**
     * Minimize window
     */
    minimize(): void {
        this.state.isMinimized = true;
        this.state.isVisible = false;
        this.clearOverlays();
        this.emit('minimized');
    }

    /**
     * Restore window from minimized state
     */
    restore(): void {
        this.state.isMinimized = false;
        this.state.isMaximized = false;
        this.state.isVisible = true;
        this.render();
        this.emit('restored');
    }

    /**
     * Close window
     */
    close(): void {
        this.clearOverlays();
        this.emit('closed');
    }

    /**
     * Set content renderer function
     */
    setContentRenderer(renderer: (window: OverlayWindow) => void): void {
        this.contentRenderer = renderer;
    }

    /**
     * Main render method
     */
    render(): void {
        if (!this.state.isVisible || !window.alt1) return;

        try {
            // Set overlay group
            window.alt1.overLaySetGroup(this.state.overlayGroup);

            // Clear previous overlays
            window.alt1.overLayClearGroup(this.state.overlayGroup);

            // Freeze group for smooth rendering
            window.alt1.overLayFreezeGroup(this.state.overlayGroup, true);

            // Render window components
            this.renderShadow();
            this.renderFrame();
            this.renderTitleBar();
            this.renderContent();
            this.renderControlButtons();

            // Unfreeze group to display overlays
            window.alt1.overLayFreezeGroup(this.state.overlayGroup, false);

        } catch (error) {
            console.error('Error rendering overlay window:', error);
        }
    }

    /**
     * Handle interaction events
     */
    handleInteraction(event: InteractionEvent): void {
        this.state.lastInteraction = Date.now();

        switch (event.type) {
            case 'click':
                this.handleClick(event.position);
                break;
            case 'drag':
                this.handleDrag(event.position);
                break;
            case 'hover':
                this.handleHover(event.position);
                break;
        }
    }

    /**
     * Add event listener
     */
    on(event: string, handler: Function): void {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)!.push(handler);
    }

    /**
     * Remove event listener
     */
    off(event: string, handler: Function): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    /**
     * Get interaction regions for this window
     */
    getInteractionRegions(): Rect[] {
        return this.interactionRegions.map(region => region.rect);
    }

    // Private methods

    private generateId(): string {
        return 'overlay_window_' + Math.random().toString(36).substr(2, 9);
    }

    private setupInteractionRegions(): void {
        const { x, y } = this.state.position;
        const { width, height } = this.state.size;

        this.interactionRegions = [
            // Title bar (for dragging)
            {
                rect: { x, y, width, height: this.titleBarHeight },
                type: 'titlebar',
                cursor: 'move'
            },
            // Content area
            {
                rect: { x, y: y + this.titleBarHeight, width, height: height - this.titleBarHeight },
                type: 'content',
                cursor: 'default'
            },
            // Resize handle (bottom-right corner)
            {
                rect: { x: x + width - 15, y: y + height - 15, width: 15, height: 15 },
                type: 'resize-handle',
                cursor: 'nw-resize'
            },
            // Close button
            {
                rect: { x: x + width - 25, y: y + 5, width: 20, height: 20 },
                type: 'close-button',
                cursor: 'pointer'
            }
        ];
    }

    private renderShadow(): void {
        if (!window.alt1) return;

        const { x, y } = this.state.position;
        const { width, height } = this.state.size;

        // Multi-layer shadow for depth effect
        for (let i = 1; i <= this.shadowBlur; i++) {
            const alpha = Math.max(10, 40 - (i * 8));
            const shadowColor = alt1lib.mixColor(0, 0, 0, alpha);
            const offset = this.shadowOffset + i;

            alt1.overLayRect(
                shadowColor,
                x + offset,
                y + offset,
                width,
                height,
                60000,
                0
            );
        }
    }

    private renderFrame(): void {
        if (!window.alt1) return;

        const { x, y } = this.state.position;
        const { width, height } = this.state.size;

        // Main window background
        window.alt1.overLayRect(
            this.theme.backgroundColor,
            x,
            y,
            width,
            height,
            60000,
            0
        );

        // Border with focus highlight
        const borderColor = this.state.isFocused
            ? this.theme.accentColor
            : this.theme.borderColor;

        window.alt1.overLayRect(
            borderColor,
            x - this.borderWidth,
            y - this.borderWidth,
            width + (this.borderWidth * 2),
            height + (this.borderWidth * 2),
            60000,
            this.borderWidth
        );
    }

    private renderTitleBar(): void {
        if (!window.alt1) return;

        const { x, y } = this.state.position;
        const { width } = this.state.size;

        // Title bar background
        window.alt1.overLayRect(
            this.theme.titleBarColor,
            x,
            y,
            width,
            this.titleBarHeight,
            60000,
            0
        );

        // Title text
        window.alt1.overLayText(
            this.state.config.title,
            this.theme.titleBarTextColor,
            14,
            x + 10,
            y + 20,
            60000
        );
    }

    private renderContent(): void {
        if (this.contentRenderer) {
            this.contentRenderer(this);
        } else {
            this.renderDefaultContent();
        }
    }

    private renderDefaultContent(): void {
        if (!window.alt1) return;

        const { x, y } = this.state.position;

        // Default content message
        window.alt1.overLayText(
            `Window Content (${this.state.config.contentType || 'default'})`,
            this.theme.titleBarTextColor,
            12,
            x + 10,
            y + this.titleBarHeight + 20,
            60000
        );
    }

    private renderControlButtons(): void {
        if (!window.alt1) return;

        const { x, y } = this.state.position;
        const { width } = this.state.size;

        // Close button
        if (this.state.config.closable !== false) {
            const closeX = x + width - 25;
            const closeY = y + 5;

            // Close button background
            window.alt1.overLayRect(
                alt1lib.mixColor(220, 53, 69, 200), // Red background
                closeX,
                closeY,
                20,
                20,
                60000,
                0
            );

            // Close button X
            window.alt1.overLayText(
                '×',
                alt1lib.mixColor(255, 255, 255, 255),
                16,
                closeX + 6,
                closeY + 15,
                60000
            );
        }
    }

    private handleClick(position: Point): void {
        const region = this.getRegionAtPosition(position);

        switch (region?.type) {
            case 'titlebar':
                this.startDrag(position);
                break;
            case 'resize-handle':
                this.startResize(position);
                break;
            case 'close-button':
                this.close();
                break;
            case 'content':
                this.focus();
                break;
        }
    }

    private handleDrag(position: Point): void {
        if (this.state.isDragging && this.dragStartPosition) {
            const deltaX = position.x - this.dragStartPosition.x;
            const deltaY = position.y - this.dragStartPosition.y;

            this.setPosition(
                this.state.position.x + deltaX,
                this.state.position.y + deltaY
            );

            this.dragStartPosition = position;
            this.render();
        }

        if (this.state.isResizing && this.resizeStartPosition && this.resizeStartSize) {
            const deltaX = position.x - this.resizeStartPosition.x;
            const deltaY = position.y - this.resizeStartPosition.y;

            const newWidth = Math.max(200, this.resizeStartSize.width + deltaX);
            const newHeight = Math.max(100, this.resizeStartSize.height + deltaY);

            this.setSize(newWidth, newHeight);
            this.render();
        }
    }

    private handleHover(position: Point): void {
        // Could implement hover effects here
        // For now, just update last interaction time
        this.state.lastInteraction = Date.now();
    }

    private startDrag(position: Point): void {
        if (!this.state.config.draggable) return;

        this.state.isDragging = true;
        this.dragStartPosition = position;
        this.focus();
    }

    private startResize(position: Point): void {
        if (!this.state.config.resizable) return;

        this.state.isResizing = true;
        this.resizeStartPosition = position;
        this.resizeStartSize = { ...this.state.size };
        this.focus();
    }

    private getRegionAtPosition(position: Point): InteractionRegion | null {
        for (const region of this.interactionRegions) {
            if (this.isPointInRect(position, region.rect)) {
                return region;
            }
        }
        return null;
    }

    private isPointInRect(point: Point, rect: Rect): boolean {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }

    private clearOverlays(): void {
        if (window.alt1) {
            window.alt1.overLayClearGroup(this.state.overlayGroup);
        }
    }

    private emit(event: string, data?: any): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
}