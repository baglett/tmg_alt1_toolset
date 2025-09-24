# Alt1 API Reference - Two Access Methods

## Overview

Alt1 provides **two different ways** to access its functionality. Understanding when to use each is crucial for avoiding common errors.

## Method 1: `alt1` npm Package

**Import**: `import * as a1lib from 'alt1';`

**Purpose**: Utility functions, helpers, and processing tools

**Use Cases**:
- Color mixing and manipulation
- Image capture and processing utilities
- OCR and text detection helpers
- Mathematical calculations
- Data processing functions

**Examples**:
```typescript
import * as a1lib from 'alt1';

// Color utilities
const red = a1lib.mixColor(255, 0, 0, 255);
const transparent = a1lib.mixColor(255, 255, 255, 128);

// Image capture helpers
const capture = a1lib.captureHold(100, 100, 200, 200);

// Image processing
const reader = new a1lib.ImageReader();
```

**What it provides**:
- `mixColor()` - Create RGBA color values
- `captureHold()` - Image capture utilities
- `ImageReader` - OCR and image analysis
- Various helper functions and constants

## Method 2: `window.alt1` Runtime API

**Access**: `(window as any).alt1` or `window.alt1` (with proper types)

**Purpose**: Core Alt1 API functions injected at runtime

**Use Cases**:
- Drawing overlays on screen
- Screen capture and region reading
- App registration and lifecycle
- Game state access
- Permission checking

**Examples**:
```typescript
// Overlay drawing (MUST use window.alt1)
(window as any).alt1.overLayRect(0xFF0000FF, 100, 100, 50, 50, 5000, 2);
(window as any).alt1.overLayText('Hello', 0xFFFFFFFF, 16, 110, 120, 5000);

// Screen capture (MUST use window.alt1)
const pixelData = (window as any).alt1.getRegion(0, 0, 100, 100);

// App registration (MUST use window.alt1)
(window as any).alt1.identifyApp('./appconfig.json');

// Game state (can use window.alt1 with types)
if (window.alt1.rsActive) {
    console.log('RuneScape is active');
}

// Permission checking
if (window.alt1.permissionPixel && window.alt1.permissionOverlay) {
    // App has required permissions
}
```

**What it provides**:
- `overLayRect()`, `overLayText()` - Drawing overlays
- `getRegion()`, `bindRegion()` - Screen capture
- `identifyApp()` - App registration
- `rsActive`, `mousePosition` - Game state
- `permissionPixel`, `permissionOverlay` - Permission status

## Common Mistakes & Fixes

### ❌ **Wrong**: Using a1lib for overlay functions
```typescript
import * as a1lib from 'alt1';

// This will fail with "overLayRect is not a function"
a1lib.overLayRect(0xFF0000FF, 100, 100, 50, 50, 5000, 2);
```

### ✅ **Correct**: Using window.alt1 for overlay functions
```typescript
// This works correctly
(window as any).alt1.overLayRect(0xFF0000FF, 100, 100, 50, 50, 5000, 2);
```

### ❌ **Wrong**: Using window.alt1 for utilities
```typescript
// This might not work as expected
const color = (window as any).alt1.mixColor(255, 0, 0, 255);
```

### ✅ **Correct**: Using a1lib for utilities
```typescript
import * as a1lib from 'alt1';

// This is the proper way
const color = a1lib.mixColor(255, 0, 0, 255);
```

### ❌ **Wrong**: Using window.alt1 for app identification
```typescript
// This will fail with "identifyApp is not a function"
(window as any).alt1.identifyApp('./appconfig.json');
```

### ✅ **Correct**: Using a1lib for app identification
```typescript
import * as a1lib from 'alt1';

// This is the proper way
a1lib.identifyApp('./appconfig.json');
```

## Quick Reference

| Function | Use | Import Method |
|----------|-----|---------------|
| `mixColor()` | Color utilities | `a1lib.mixColor()` |
| `overLayRect()` | Draw overlay | `window.alt1.overLayRect()` |
| `overLayText()` | Draw text overlay | `window.alt1.overLayText()` |
| `getRegion()` | Screen capture | `window.alt1.getRegion()` |
| `identifyApp()` | Register app | `a1lib.identifyApp()` |
| `captureHold()` | Image utilities | `a1lib.captureHold()` |
| `rsActive` | Game state | `window.alt1.rsActive` |
| `ImageReader` | OCR processing | `new a1lib.ImageReader()` |

## Type Safety

For TypeScript projects, you may need type assertions for the runtime API:

```typescript
// Type assertion for runtime API
declare global {
    interface Window {
        alt1: any; // Or import proper types
    }
}

// Then use normally
window.alt1.overLayRect(...);

// Or use inline assertion
(window as any).alt1.overLayRect(...);
```

## Summary

- **`a1lib` (npm package)**: Utilities, helpers, processing
- **`window.alt1` (runtime API)**: Core Alt1 functions, overlays, screen access
- **Key rule**: Overlays and screen capture → `window.alt1`, Everything else → `a1lib`