# Advanced Overlay Windows

An innovative window management component for Alt1 applications that creates virtual windows using Alt1's overlay system with computer vision-based interaction detection.

## Features

- **Virtual Window Management**: Create, resize, move, and manage multiple overlay windows
- **Computer Vision Interactions**: Advanced interaction detection using mouse tracking and computer vision
- **Customizable Themes**: Multiple built-in themes with full customization support
- **Modern Architecture**: TypeScript-first with clean APIs and event handling
- **Alt1 Integration**: Seamless integration with Alt1's overlay and event systems
- **Performance Optimized**: 60fps interaction detection with efficient overlay rendering

## Quick Start

```typescript
import { OverlayWindowManager, WindowThemes } from '@tmg-alt1/advanced-overlay-windows';

// Create window manager
const windowManager = new OverlayWindowManager();

// Create a window
const ocrWindow = windowManager.createWindow({
    title: "OCR Settings",
    x: 100, y: 100,
    width: 300, height: 200,
    contentType: 'ocr-settings',
    theme: WindowThemes.DISCORD,
    resizable: true,
    draggable: true
});

// Handle window events
windowManager.on('window-moved', (data) => {
    console.log(`Window ${data.windowId} moved to`, data.position);
});
```

## Core Classes

### OverlayWindowManager

Main manager class that handles multiple overlay windows and interaction detection.

```typescript
const manager = new OverlayWindowManager();

// Create windows
const window1 = manager.createWindow(config);
const window2 = manager.createWindow(config);

// Manage windows
manager.focusWindow(window1.id);
manager.bringToFront(window2.id);
manager.closeWindow(window1.id);
```

### OverlayWindow

Individual window with advanced rendering and interaction capabilities.

```typescript
// Window automatically created by manager
const window = manager.createWindow({
    title: "My Window",
    x: 100, y: 100,
    width: 400, height: 300,
    resizable: true,
    draggable: true,
    closable: true
});

// Set custom content renderer
window.setContentRenderer((window) => {
    // Custom overlay rendering logic
    alt1.overLayText("Custom content", 0xFFFFFFFF, 14,
                     window.position.x + 10,
                     window.position.y + 50,
                     60000);
});
```

### InteractionDetector

Advanced computer vision system for detecting user interactions.

```typescript
const detector = new InteractionDetector();

detector.startTracking();
detector.onInteraction('window-id', (event) => {
    console.log('Interaction detected:', event.type, event.position);
});
```

## Window Configuration

```typescript
interface WindowConfig {
    id?: string;              // Auto-generated if not provided
    title: string;            // Window title
    x: number;               // X position
    y: number;               // Y position
    width: number;           // Window width
    height: number;          // Window height
    resizable?: boolean;     // Can be resized (default: true)
    draggable?: boolean;     // Can be dragged (default: true)
    minimizable?: boolean;   // Can be minimized (default: true)
    maximizable?: boolean;   // Can be maximized (default: false)
    closable?: boolean;      // Can be closed (default: true)
    modal?: boolean;         // Modal window (default: false)
    zIndex?: number;         // Z-index (auto-assigned if not provided)
    contentType?: WindowContentType; // Content type for rendering
    theme?: WindowTheme;     // Custom theme
}
```

## Content Types

Built-in content types for common Alt1 use cases:

- `'ocr-settings'` - OCR configuration interface
- `'dungeon-map'` - Dungeon mapping display
- `'advanced-settings'` - Advanced configuration options
- `'inventory-tracker'` - Inventory monitoring
- `'chat-monitor'` - Chat monitoring interface
- `'custom'` - Custom content (use setContentRenderer)

## Themes

### Built-in Themes

```typescript
import { WindowThemes } from '@tmg-alt1/advanced-overlay-windows';

// Discord-style theme
theme: WindowThemes.DISCORD

// RuneScape-style theme
theme: WindowThemes.RUNESCAPE

// Dark theme
theme: WindowThemes.DARK

// Light theme
theme: WindowThemes.LIGHT
```

### Custom Themes

```typescript
const customTheme = {
    titleBarColor: 0x5865F2F0,     // RGBA color
    titleBarTextColor: 0xFFFFFFFF,
    borderColor: 0x5865F2FF,
    backgroundColor: 0x2F3136F0,
    shadowColor: 0x00000050,
    accentColor: 0x7289DAFF
};

const window = manager.createWindow({
    title: "Custom Themed Window",
    // ... other config
    theme: customTheme
});
```

## Event Handling

### Window Manager Events

```typescript
manager.on('window-created', (data) => {
    console.log('Window created:', data.windowId);
});

manager.on('window-moved', (data) => {
    console.log('Window moved:', data.windowId, data.position);
});

manager.on('window-resized', (data) => {
    console.log('Window resized:', data.windowId, data.size);
});

manager.on('window-focused', (data) => {
    console.log('Window focused:', data.windowId);
});

manager.on('window-closed', (data) => {
    console.log('Window closed:', data.windowId);
});
```

### Individual Window Events

```typescript
window.on('moved', (position) => {
    console.log('Window moved to:', position);
});

window.on('resized', (size) => {
    console.log('Window resized to:', size);
});

window.on('focused', () => {
    console.log('Window gained focus');
});

window.on('closed', () => {
    console.log('Window closed');
});
```

## Integration with Alt1 Apps

### Example: Dungeoneering Plugin Integration

```typescript
import { OverlayWindowManager } from '@tmg-alt1/advanced-overlay-windows';
import { DoorTextReader } from '@tmg-alt1/mouse-text-tool';

class DungeoneeringApp {
    private windowManager: OverlayWindowManager;
    private ocrWindow: OverlayWindow;
    private mapWindow: OverlayWindow;
    private settingsWindow: OverlayWindow;

    constructor() {
        this.windowManager = new OverlayWindowManager();
        this.createWindows();
    }

    private createWindows() {
        // OCR Settings Window
        this.ocrWindow = this.windowManager.createWindow({
            title: "OCR Settings",
            x: 100, y: 100,
            width: 320, height: 240,
            contentType: 'ocr-settings'
        });

        // Dungeon Map Window
        this.mapWindow = this.windowManager.createWindow({
            title: "Dungeon Map",
            x: 450, y: 100,
            width: 500, height: 400,
            contentType: 'dungeon-map'
        });

        // Advanced Settings Window
        this.settingsWindow = this.windowManager.createWindow({
            title: "Settings",
            x: 200, y: 300,
            width: 400, height: 300,
            contentType: 'advanced-settings',
            minimizable: true
        });
    }
}
```

## Performance Considerations

- **Interaction Detection**: Runs at 60fps with optimized computer vision algorithms
- **Overlay Rendering**: Uses Alt1's efficient overlay grouping and z-indexing
- **Memory Management**: Automatic cleanup of interaction regions and event handlers
- **Smooth Animations**: Frame-based updates for smooth dragging and resizing

## Browser Compatibility

- **Alt1 Environment**: Full functionality with all features
- **Development Browser**: Limited functionality (no overlay rendering)
- **TypeScript Support**: Full type definitions included

## Contributing

This component is part of the TMG Alt1 Toolset. See the main repository for contribution guidelines.

## License

MIT License - see the main repository for details.