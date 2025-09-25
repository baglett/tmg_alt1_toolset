/**
 * @tmg-alt1/window-resizer
 * Universal Alt1 plugin window resizer with multiple fallback strategies
 */

export { WindowResizer } from './WindowResizer';
export { LayoutManager } from './LayoutManager';
export * from './types';
export * from './strategies/WebAPIStrategy';
export * from './strategies/Alt1NativeStrategy';
export * from './strategies/ContentExpansionStrategy';