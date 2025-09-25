/**
 * Alt1 Native Resize Strategy
 *
 * Uses Alt1's userResize API and other native Alt1 methods
 */
import { ResizeStrategy, ResizeResult, WindowCapabilities } from '../types';
declare global {
    interface Window {
        alt1?: {
            userResize?: (left: boolean, top: boolean, right: boolean, bottom: boolean) => any;
            [key: string]: any;
        };
    }
}
export declare class Alt1NativeStrategy implements ResizeStrategy {
    name: "alt1-native";
    priority: number;
    isAvailable(): boolean;
    validate(capabilities: WindowCapabilities): boolean;
    resize(width: number, height: number): Promise<ResizeResult>;
    private programmaticUserResize;
    private elementBasedResize;
    private createResizeElements;
    private simulateMouseResize;
    private waitForResize;
    static detectCapabilities(): {
        userResize: boolean | undefined;
        updateConfig: boolean | undefined;
        windowControl: boolean | undefined;
    };
}
//# sourceMappingURL=Alt1NativeStrategy.d.ts.map