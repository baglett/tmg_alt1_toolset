/**
 * Web API Resize Strategy
 *
 * Uses standard browser window resize APIs
 */
import { ResizeStrategy, ResizeResult, WindowCapabilities } from '../types';
export declare class WebAPIStrategy implements ResizeStrategy {
    name: "webapi";
    priority: number;
    isAvailable(): boolean;
    validate(capabilities: WindowCapabilities): boolean;
    resize(width: number, height: number): Promise<ResizeResult>;
    private waitForResize;
    static detectCapabilities(): {
        resizeTo: boolean;
        resizeBy: boolean;
        outerWidth: boolean;
        outerHeight: boolean;
    };
}
//# sourceMappingURL=WebAPIStrategy.d.ts.map