// Alt1 TypeScript Declarations
// Based on the alt1 library for RuneScape

declare module 'alt1' {
  // Base Alt1 API
  export function identifyApp(appName: string): void;

  // Overlay functions
  export function overLayRect(
    color: number,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    lineWidth?: number
  ): void;

  export function overLayText(
    text: string,
    color: number,
    size: number,
    x: number,
    y: number,
    time: number,
    centered?: boolean
  ): void;

  export function overLayLine(
    color: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    time: number,
    lineWidth?: number
  ): void;

  export function overLayClearGroup(group: string): void;
  export function overLaySetGroup(group: string): void;
  export function overLayFreezeGroup(group: string, freeze: boolean): void;
  export function overLayCircle(color: number, x: number, y: number, radius: number, width: number, time: number, group?: string): void;

  // Screen capture
  export function captureHoldFullRs(): ImageData | null;
  export function captureHold(x: number, y: number, w: number, h: number): ImageData | null;

  // Mouse functions
  export function getMousePosition(): { x: number; y: number } | null;

  // Event handling
  export function on(event: string, callback: (data: any) => void): void;

  // Utility functions
  export function mixColor(r: number, g: number, b: number, a?: number): number;

  // Color constants and utilities
  export const colors: {
    red: number;
    green: number;
    blue: number;
    yellow: number;
    white: number;
    black: number;
  };

  // Extended ImageData interface for Alt1
  interface ExtendedImageData extends ImageData {
    findSubimage(needle: ImageData): { x: number; y: number }[];
    toData(): Uint8ClampedArray;
  }
}

// Global Alt1 interface
declare global {
  interface Window {
    alt1?: {
      permissionPixel: boolean;
      permissionOverlay: boolean;
      permissionGameState: boolean;
      rsActive: boolean;
      rsWidth: number;
      rsHeight: number;
      rsLinked: boolean;
      mousePosition: { x: number; y: number };
      overLayRect: (color: number, x: number, y: number, width: number, height: number, time: number, lineWidth?: number) => void;
      overLayText: (text: string, color: number, size: number, x: number, y: number, time: number, centered?: boolean) => void;
      overLayLine: (color: number, x1: number, y1: number, x2: number, y2: number, time: number, lineWidth?: number) => void;
      overLayClearGroup: (group: string) => void;
      overLaySetGroup: (group: string) => void;
      overLayFreezeGroup: (group: string, freeze: boolean) => void;
      overLayCircle: (color: number, x: number, y: number, radius: number, width: number, time: number, group?: string) => void;
    };
    a1lib?: any;
  }

  const alt1: Window['alt1'];

  // Extend the global ImageData interface with Alt1 methods
  interface ImageData {
    findSubimage(needle: ImageData, x?: number, y?: number, w?: number, h?: number): { x: number; y: number }[];
    toData(x?: number, y?: number, w?: number, h?: number): ImageData;
  }
}

export {};