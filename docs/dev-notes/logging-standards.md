# Alt1 Application Logging Standards

## Overview

Consistent logging is essential for debugging Alt1 applications, especially given the unique constraints of the Alt1 environment. This document defines the standard logging patterns to be used across all TMG Alt1 Toolset applications.

## Core Logging Principles

### 1. **Visual Consistency**
- Use emojis for instant visual categorization
- Consistent color coding and prefixes
- Hierarchical information display

### 2. **Performance Awareness**
- Minimal overhead in production
- Configurable log levels
- Batch logging for high-frequency events

### 3. **Alt1 Environment Specific**
- Log Alt1 API availability and permissions
- Track overlay rendering performance
- Monitor screen capture operations

## Standard Log Categories

### 🚀 Initialization & Lifecycle
```typescript
console.log('🚀 [AppName] Starting initialization...');
console.log('✅ [AppName] Initialization completed successfully');
console.error('❌ [AppName] Initialization failed:', error);
```

### 🔧 Alt1 Integration
```typescript
console.log('🔧 [Alt1] Checking Alt1 availability...');
console.log('✅ [Alt1] Alt1 detected with permissions:', permissions);
console.warn('⚠️ [Alt1] Alt1 detected but missing permissions:', missingPerms);
console.error('❌ [Alt1] Alt1 not available - running in browser mode');
```

### 🪟 Window Management
```typescript
console.log('🪟 [Windows] Creating window:', windowId, config);
console.log('📏 [Windows] Window resized:', windowId, newSize);
console.log('🎯 [Windows] Window focused:', windowId);
console.log('❌ [Windows] Window closed:', windowId);
```

### 🎮 User Interactions
```typescript
console.log('🎮 [UI] Button clicked:', buttonId, event);
console.log('🎮 [UI] Input changed:', inputId, value);
console.log('🎮 [UI] Form submitted:', formData);
```

### 📊 Performance & Monitoring
```typescript
console.time('⏱️ [Perf] Operation: ' + operationName);
console.timeEnd('⏱️ [Perf] Operation: ' + operationName);
console.log('📊 [Perf] FPS:', fps, 'Memory:', memUsage);
```

### 🔍 OCR & Screen Capture
```typescript
console.log('🔍 [OCR] Starting text recognition...', region);
console.log('✅ [OCR] Text detected:', recognizedText);
console.log('📸 [Capture] Screen captured:', dimensions);
console.error('❌ [OCR] Recognition failed:', error);
```

### 🌐 Network & External APIs
```typescript
console.log('🌐 [Network] Request sent:', url, method);
console.log('✅ [Network] Response received:', status, data);
console.error('❌ [Network] Request failed:', error);
```

### 💾 Data & Storage
```typescript
console.log('💾 [Data] Saving configuration:', config);
console.log('📥 [Data] Loading saved data:', dataType);
console.error('❌ [Data] Save operation failed:', error);
```

## Standard Logger Implementation

### Base Logger Class
```typescript
export class Alt1Logger {
    private appName: string;
    private logLevel: LogLevel;

    constructor(appName: string, logLevel: LogLevel = LogLevel.INFO) {
        this.appName = appName;
        this.logLevel = logLevel;
    }

    // Lifecycle logging
    init(message: string, ...args: any[]) {
        console.log(`🚀 [${this.appName}] ${message}`, ...args);
    }

    success(message: string, ...args: any[]) {
        console.log(`✅ [${this.appName}] ${message}`, ...args);
    }

    error(message: string, error?: any, ...args: any[]) {
        console.error(`❌ [${this.appName}] ${message}`, error, ...args);
    }

    warn(message: string, ...args: any[]) {
        console.warn(`⚠️ [${this.appName}] ${message}`, ...args);
    }

    // Category-specific methods
    alt1(message: string, ...args: any[]) {
        console.log(`🔧 [Alt1] ${message}`, ...args);
    }

    window(message: string, ...args: any[]) {
        console.log(`🪟 [Windows] ${message}`, ...args);
    }

    ui(message: string, ...args: any[]) {
        console.log(`🎮 [UI] ${message}`, ...args);
    }

    perf(message: string, ...args: any[]) {
        console.log(`📊 [Perf] ${message}`, ...args);
    }

    ocr(message: string, ...args: any[]) {
        console.log(`🔍 [OCR] ${message}`, ...args);
    }

    data(message: string, ...args: any[]) {
        console.log(`💾 [Data] ${message}`, ...args);
    }
}

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
```

### Usage Pattern
```typescript
// Initialize logger
const logger = new Alt1Logger('AdvancedWindowsTest');

// App lifecycle
logger.init('Starting initialization...');
logger.success('Initialization completed successfully');

// Alt1 integration
logger.alt1('Checking Alt1 availability...');
logger.alt1('Alt1 detected with permissions:', permissions);

// User interactions
logger.ui('Button clicked:', 'openExampleWindow');
logger.window('Creating window:', windowConfig);

// Error handling
try {
    // risky operation
} catch (error) {
    logger.error('Operation failed:', error);
}
```

## Event Logging Standards

### Button Clicks
```typescript
private setupEventHandlers(): void {
    this.elements.openExampleWindow?.addEventListener('click', (event) => {
        logger.ui('Button clicked: openExampleWindow', {
            timestamp: Date.now(),
            disabled: event.target.disabled
        });
        this.openExampleWindow();
    });
}
```

### Method Entry/Exit
```typescript
private openExampleWindow(): void {
    logger.window('openExampleWindow() called');

    if (!this.windowManager) {
        logger.error('openExampleWindow failed: Window manager not available');
        return;
    }

    try {
        const window = this.windowManager.createWindow(config);
        logger.success('Example window created:', window.id);
    } catch (error) {
        logger.error('Failed to create example window:', error);
    }
}
```

### Alt1 Permission Checking
```typescript
private checkAlt1Status(): void {
    logger.alt1('Checking Alt1 status...');

    if (window.alt1) {
        logger.alt1('Alt1 detected');

        const permissions = {
            pixel: window.alt1.permissionPixel,
            overlay: window.alt1.permissionOverlay,
            gameState: window.alt1.permissionGameState
        };

        logger.alt1('Alt1 permissions:', permissions);

        if (permissions.pixel && permissions.overlay) {
            logger.success('Alt1 ready with full permissions');
        } else {
            logger.warn('Alt1 missing required permissions:',
                Object.entries(permissions)
                    .filter(([key, value]) => !value)
                    .map(([key]) => key)
            );
        }
    } else {
        logger.error('Alt1 not detected - running in browser mode');
    }
}
```

## Performance Logging

### Method Performance
```typescript
private performExpensiveOperation(): void {
    logger.perf('Starting expensive operation...');
    console.time('⏱️ [Perf] Expensive Operation');

    try {
        // expensive operation

        console.timeEnd('⏱️ [Perf] Expensive Operation');
        logger.perf('Expensive operation completed successfully');
    } catch (error) {
        console.timeEnd('⏱️ [Perf] Expensive Operation');
        logger.error('Expensive operation failed:', error);
    }
}
```

### Render Loop Performance
```typescript
private renderLoop(): void {
    if (this.logLevel <= LogLevel.DEBUG) {
        logger.perf(`Render loop: Windows=${this.windowCount}, FPS=${this.fps}`);
    }
}
```

## Environment-Specific Logging

### Development vs Production
```typescript
const logger = new Alt1Logger('AppName',
    process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

// Development-only verbose logging
if (process.env.NODE_ENV === 'development') {
    logger.debug('Detailed debugging info:', complexObject);
}
```

### Alt1 vs Browser Environment
```typescript
if (window.alt1) {
    logger.alt1('Running in Alt1 environment');
    // Alt1-specific logging
} else {
    logger.warn('Running in browser - Alt1 features disabled');
    // Browser fallback logging
}
```

## Debugging Guidelines

### 1. **Always log method entry for public methods**
### 2. **Log all error conditions with context**
### 3. **Log state changes that affect user experience**
### 4. **Use performance logging for operations > 16ms**
### 5. **Include relevant data objects in logs**
### 6. **Log Alt1 permission checks and results**

## Implementation Requirements

1. **All new Alt1 applications MUST implement the standard logger**
2. **Existing applications SHOULD be updated to use standard logging**
3. **All error conditions MUST be logged with context**
4. **All user interactions SHOULD be logged**
5. **Performance-critical operations MUST include timing logs**

This logging standard ensures consistent, debuggable Alt1 applications across the entire TMG Alt1 Toolset.