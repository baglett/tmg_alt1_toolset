# @tmg-alt1/interactive-windows

🎯 **Revolutionary Interactive Window System for Alt1 Applications**

The first truly interactive window system for Alt1 that bypasses overlay limitations using DOM-based windows with full mouse and keyboard interactivity.

## ✨ Features

### ✅ **What Alt1 Overlays CAN'T Do (But We Can!)**
- ❌ Alt1 overlays: No mouse click events
- ✅ **Interactive windows: Full click, hover, focus events**

- ❌ Alt1 overlays: No drag and drop
- ✅ **Interactive windows: Draggable title bars**

- ❌ Alt1 overlays: No resize handles
- ✅ **Interactive windows: Resizable corners and edges**

- ❌ Alt1 overlays: No form interactions
- ✅ **Interactive windows: Text inputs, buttons, dropdowns**

- ❌ Alt1 overlays: No keyboard input
- ✅ **Interactive windows: Tab navigation, Enter/Escape**

### 🚀 **Key Capabilities**
- **Multiple Windows**: Z-index management with proper focus handling
- **Responsive Themes**: Discord, RuneScape, Modern Dark/Light themes
- **Settings Templates**: Auto-generated settings forms with validation
- **Dialog System**: Alert and confirmation dialogs with async/await
- **Event System**: Comprehensive event handling with proper cleanup
- **TypeScript First**: Full type definitions and IntelliSense support

## 📦 Installation

```bash
npm install @tmg-alt1/interactive-windows
```

## 🎮 Quick Start

```typescript
import { InteractiveWindowManager, WindowThemes } from '@tmg-alt1/interactive-windows';

// Create window manager
const windowManager = new InteractiveWindowManager();

// Create interactive modal
const modal = windowManager.createModal({
    title: 'My Interactive Window',
    width: 500,
    height: 400,
    content: `
        <div style="padding: 20px;">
            <h2>This window is fully interactive!</h2>
            <button onclick="alert('Button clicked!')">Click me!</button>
            <input type="text" placeholder="Type something...">
        </div>
    `,
    theme: WindowThemes.DISCORD,
    resizable: true,
    draggable: true,
    closable: true
});
```

## 🎨 Settings Modal Template

```typescript
import { createSettingsTemplate } from '@tmg-alt1/interactive-windows';

const settingsTemplate = createSettingsTemplate({
    title: 'Plugin Settings',
    sections: [
        {
            title: 'Display Settings',
            fields: [
                { label: 'Opacity', type: 'range', key: 'opacity', value: 90, min: 10, max: 100 },
                { label: 'Show Tooltips', type: 'checkbox', key: 'showTooltips', value: true },
                { label: 'Theme', type: 'select', key: 'theme', value: 'dark', options: [
                    { label: 'Dark', value: 'dark' },
                    { label: 'Light', value: 'light' }
                ]}
            ]
        }
    ],
    onSave: (values) => {
        console.log('Settings saved:', values);
        // Save to localStorage or send to server
    },
    onCancel: () => {
        console.log('Settings cancelled');
    }
});

const settingsModal = windowManager.createSettingsModal('Settings', settingsTemplate);
```

## 🎭 Available Themes

- **Discord**: Modern purple theme matching Discord's UI
- **RuneScape**: Classic RuneScape brown and gold theme
- **Modern Dark**: Clean dark theme with blue accents
- **Modern Light**: Clean light theme with subtle shadows

## 💬 Dialog System

```typescript
// Alert dialog
await windowManager.alert('Success!', 'Your action completed successfully.');

// Confirmation dialog
const confirmed = await windowManager.confirm(
    'Confirm Action',
    'Are you sure you want to proceed?'
);

if (confirmed) {
    console.log('User confirmed');
} else {
    console.log('User cancelled');
}
```

## 🎯 Use Cases

### Perfect For:
- **Settings Modals**: Plugin configuration with forms
- **Help Dialogs**: Interactive tutorials and guides
- **Data Entry**: Forms that require user input
- **Confirmation Dialogs**: User decision prompts
- **Multi-Step Wizards**: Complex workflows
- **Rich Content**: HTML/CSS layouts with interactions

### When to Use Overlays Instead:
- HUD elements that should overlay game content
- Simple visual indicators (health bars, timers)
- Non-interactive information displays
- Performance-critical real-time updates

## 🛠 API Reference

### InteractiveWindowManager

```typescript
class InteractiveWindowManager {
    // Window management
    createWindow(config: InteractiveWindowConfig): InteractiveWindow;
    createModal(config: InteractiveWindowConfig): InteractiveWindow;
    createSettingsModal(title: string, content: HTMLElement): InteractiveWindow;

    // Dialog methods
    alert(title: string, message: string): Promise<void>;
    confirm(title: string, message: string): Promise<boolean>;

    // Layout management
    cascadeWindows(): void;
    tileWindows(): void;
    centerAllWindows(): void;

    // Utility
    getVisibleWindows(): InteractiveWindow[];
    closeAllWindows(): void;
}
```

### InteractiveWindow

```typescript
interface InteractiveWindow {
    // Properties
    readonly id: string;
    readonly state: WindowState;
    readonly element: HTMLElement;

    // Window management
    show(): void;
    hide(): void;
    close(): void;
    focus(): void;

    // Position and size
    setPosition(x: number, y: number): void;
    setSize(width: number, height: number): void;
    center(): void;

    // Content
    setContent(content: string | HTMLElement): void;

    // Events
    on(event: WindowEventType, handler: Function): void;
    off(event: WindowEventType, handler?: Function): void;
}
```

## 🎪 Live Demo

Check out the **advanced-windows-test** plugin to see interactive windows in action:

```
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/advanced-windows-test/appconfig.json
```

## 🏗 Architecture

The component uses a **progressive enhancement** strategy:

1. **DOM-based Windows**: Creates real HTML elements with full interactivity
2. **Event Delegation**: Proper mouse and keyboard event handling
3. **Z-Index Management**: Multiple window support with focus handling
4. **Theme System**: CSS-in-JS with dynamic styling
5. **Memory Management**: Proper cleanup and garbage collection

## 🤝 Contributing

This component is part of the TMG Alt1 Toolset ecosystem. See the main repository for contribution guidelines.

## 📄 License

MIT License - see the main repository for details.

---

**🎯 This component solves the fundamental limitation of Alt1 overlays and opens up entirely new possibilities for Alt1 application user interfaces.**