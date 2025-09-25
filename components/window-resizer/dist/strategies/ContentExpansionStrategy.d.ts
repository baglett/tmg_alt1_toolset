/**
 * Content Expansion Strategy
 *
 * Forces window resize by expanding content that requires larger window
 */
import { ResizeStrategy, ResizeResult, WindowCapabilities } from '../types';
export declare class ContentExpansionStrategy implements ResizeStrategy {
    name: "content-expansion";
    priority: number;
    private expansionElements;
    isAvailable(): boolean;
    validate(capabilities: WindowCapabilities): boolean;
    resize(width: number, height: number): Promise<ResizeResult>;
    private forceMinimumContentSize;
    private createExpandingContent;
    private createScrollableExpansion;
    private waitForResize;
    cleanup(): void;
    static detectCapabilities(): boolean;
}
//# sourceMappingURL=ContentExpansionStrategy.d.ts.map