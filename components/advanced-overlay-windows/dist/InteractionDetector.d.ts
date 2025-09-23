import { Point, InteractionEvent, Rect } from './types';
/**
 * Advanced interaction detection system using computer vision and mouse tracking
 * for detecting user interactions with overlay windows
 */
export declare class InteractionDetector {
    private mouseTrackingInterval;
    private lastMousePosition;
    private clickDetectionRegions;
    private eventCallbacks;
    private isTracking;
    private readonly clickDetectionSensitivity;
    private readonly doubleClickThreshold;
    private lastClickTime;
    private lastClickPosition;
    constructor();
    /**
     * Start tracking interactions
     */
    startTracking(): void;
    /**
     * Stop tracking interactions
     */
    stopTracking(): void;
    /**
     * Register a window's interaction regions for click detection
     */
    registerWindow(windowId: string, regions: Rect[]): void;
    /**
     * Unregister a window from interaction detection
     */
    unregisterWindow(windowId: string): void;
    /**
     * Set callback for window interaction events
     */
    onInteraction(windowId: string, callback: (event: InteractionEvent) => void): void;
    /**
     * Setup mouse position tracking
     */
    private setupMouseTracking;
    /**
     * Get current mouse position from Alt1
     */
    private getMousePosition;
    /**
     * Handle mouse movement and detect interactions
     */
    private handleMouseMovement;
    /**
     * Calculate distance between two points
     */
    private calculateDistance;
    /**
     * Check if mouse position indicates a click on any registered window
     */
    private checkForClicks;
    /**
     * Check for hover events on registered windows
     */
    private checkForHovers;
    /**
     * Handle potential click detection with debouncing
     */
    private handlePotentialClick;
    /**
     * Handle Alt1 key press events
     */
    private handleAlt1Pressed;
    /**
     * Check if a point is within a rectangle
     */
    private isPointInRect;
    /**
     * Emit an interaction event to the appropriate window
     */
    private emitInteractionEvent;
    /**
     * Add interaction region for a specific window
     */
    addInteractionRegion(windowId: string, region: Rect): void;
    /**
     * Remove interaction region for a specific window
     */
    removeInteractionRegion(windowId: string, region: Rect): void;
    /**
     * Get current mouse position (public interface)
     */
    getCurrentMousePosition(): Point | null;
    /**
     * Check if currently tracking
     */
    isCurrentlyTracking(): boolean;
}
//# sourceMappingURL=InteractionDetector.d.ts.map