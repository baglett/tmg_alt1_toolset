/// <reference types="alt1" />

declare global {
    interface Window {
        alt1: typeof import('alt1');
    }
}

export {};