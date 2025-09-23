import * as alt1lib from 'alt1';
import { Point, InteractionEvent, Rect } from './types';

/**
 * Advanced interaction detection system using computer vision and mouse tracking
 * for detecting user interactions with overlay windows
 */
export class InteractionDetector {
    private mouseTrackingInterval: number | null = null;
    private lastMousePosition: Point = { x: 0, y: 0 };
    private clickDetectionRegions: Map<string, Rect[]> = new Map();
    private eventCallbacks: Map<string, (event: InteractionEvent) => void> = new Map();
    private isTracking: boolean = false;

    // Click detection settings
    private readonly clickDetectionSensitivity = 15; // pixels
    private readonly doubleClickThreshold = 300; // milliseconds
    private lastClickTime = 0;
    private lastClickPosition: Point = { x: 0, y: 0 };

    constructor() {
        this.setupMouseTracking();
    }

    /**
     * Start tracking interactions
     */
    startTracking(): void {
        if (this.isTracking) return;

        this.isTracking = true;
        this.setupMouseTracking();

        // Set up Alt1 event listeners for additional interaction detection
        if (typeof alt1lib.on === 'function') {
            alt1lib.on('alt1pressed', this.handleAlt1Pressed.bind(this));
        }
    }

    /**
     * Stop tracking interactions
     */
    stopTracking(): void {
        if (!this.isTracking) return;

        this.isTracking = false;

        if (this.mouseTrackingInterval) {
            clearInterval(this.mouseTrackingInterval);
            this.mouseTrackingInterval = null;
        }
    }

    /**
     * Register a window's interaction regions for click detection
     */
    registerWindow(windowId: string, regions: Rect[]): void {
        this.clickDetectionRegions.set(windowId, regions);
    }

    /**
     * Unregister a window from interaction detection
     */
    unregisterWindow(windowId: string): void {
        this.clickDetectionRegions.delete(windowId);
        this.eventCallbacks.delete(windowId);
    }

    /**
     * Set callback for window interaction events
     */
    onInteraction(windowId: string, callback: (event: InteractionEvent) => void): void {
        this.eventCallbacks.set(windowId, callback);
    }

    /**
     * Setup mouse position tracking
     */
    private setupMouseTracking(): void {
        if (this.mouseTrackingInterval) {
            clearInterval(this.mouseTrackingInterval);
        }

        // Track mouse position at 60fps for smooth interaction detection
        this.mouseTrackingInterval = window.setInterval(() => {
            if (!this.isTracking) return;

            const mousePos = this.getMousePosition();
            if (mousePos) {
                this.handleMouseMovement(mousePos);
            }
        }, 16); // ~60fps
    }

    /**
     * Get current mouse position from Alt1
     */
    private getMousePosition(): Point | null {
        if (!window.alt1) return null;

        const pos = window.alt1.mousePosition;
        if (!pos) return null;

        return {
            x: pos.x,
            y: pos.y
        };
    }

    /**
     * Handle mouse movement and detect interactions
     */
    private handleMouseMovement(mousePos: Point): void {
        const previousPos = this.lastMousePosition;
        this.lastMousePosition = mousePos;

        // Detect rapid mouse movement that might indicate a click
        const movement = this.calculateDistance(previousPos, mousePos);

        // If mouse moved significantly and then stopped, might be a click
        if (movement > this.clickDetectionSensitivity) {
            this.checkForClicks(mousePos);
        }

        // Check for hover events
        this.checkForHovers(mousePos);
    }

    /**
     * Calculate distance between two points
     */
    private calculateDistance(p1: Point, p2: Point): number {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Check if mouse position indicates a click on any registered window
     */
    private checkForClicks(mousePos: Point): void {
        for (const [windowId, regions] of this.clickDetectionRegions) {
            for (const region of regions) {
                if (this.isPointInRect(mousePos, region)) {
                    this.handlePotentialClick(windowId, mousePos);
                    break;
                }
            }
        }
    }

    /**
     * Check for hover events on registered windows
     */
    private checkForHovers(mousePos: Point): void {
        for (const [windowId, regions] of this.clickDetectionRegions) {
            let isHovering = false;

            for (const region of regions) {
                if (this.isPointInRect(mousePos, region)) {
                    isHovering = true;
                    this.emitInteractionEvent(windowId, {
                        type: 'hover',
                        position: mousePos,
                        windowId,
                        timestamp: Date.now()
                    });
                    break;
                }
            }
        }
    }

    /**
     * Handle potential click detection with debouncing
     */
    private handlePotentialClick(windowId: string, position: Point): void {
        const now = Date.now();
        const timeSinceLastClick = now - this.lastClickTime;
        const distanceFromLastClick = this.calculateDistance(position, this.lastClickPosition);

        // Detect if this is likely a click (quick movement followed by stillness)
        if (timeSinceLastClick > 50 && distanceFromLastClick < this.clickDetectionSensitivity) {
            this.emitInteractionEvent(windowId, {
                type: 'click',
                position,
                windowId,
                timestamp: now
            });

            this.lastClickTime = now;
            this.lastClickPosition = position;
        }
    }

    /**
     * Handle Alt1 key press events
     */
    private handleAlt1Pressed(event: any): void {
        if (event.mouseRs) {
            const mousePos: Point = { x: event.mouseRs.x, y: event.mouseRs.y };

            // Check if Alt1 key was pressed over any of our windows
            for (const [windowId, regions] of this.clickDetectionRegions) {
                for (const region of regions) {
                    if (this.isPointInRect(mousePos, region)) {
                        this.emitInteractionEvent(windowId, {
                            type: 'click',
                            position: mousePos,
                            windowId,
                            timestamp: Date.now()
                        });
                        return;
                    }
                }
            }
        }
    }

    /**
     * Check if a point is within a rectangle
     */
    private isPointInRect(point: Point, rect: Rect): boolean {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }

    /**
     * Emit an interaction event to the appropriate window
     */
    private emitInteractionEvent(windowId: string, event: InteractionEvent): void {
        const callback = this.eventCallbacks.get(windowId);
        if (callback) {
            callback(event);
        }
    }

    /**
     * Add interaction region for a specific window
     */
    addInteractionRegion(windowId: string, region: Rect): void {
        const existing = this.clickDetectionRegions.get(windowId) || [];
        existing.push(region);
        this.clickDetectionRegions.set(windowId, existing);
    }

    /**
     * Remove interaction region for a specific window
     */
    removeInteractionRegion(windowId: string, region: Rect): void {
        const existing = this.clickDetectionRegions.get(windowId) || [];
        const filtered = existing.filter(r =>
            !(r.x === region.x && r.y === region.y &&
              r.width === region.width && r.height === region.height)
        );
        this.clickDetectionRegions.set(windowId, filtered);
    }

    /**
     * Get current mouse position (public interface)
     */
    getCurrentMousePosition(): Point | null {
        return this.getMousePosition();
    }

    /**
     * Check if currently tracking
     */
    isCurrentlyTracking(): boolean {
        return this.isTracking;
    }
}