# TMG Alt1 Toolset - Claude Development Context

## Project Overview

This repository contains a modular ecosystem of Alt1 Toolkit applications and reusable components for RuneScape automation and enhancement tools. The project follows a **component-plugin architecture** with shared configurations and modern monorepo structure.

## Architecture

### Repository Structure

```
tmg_alt1_toolset/
├── components/                    # Reusable libraries
│   ├── mouse-text-tool/          # OCR component (@tmg-alt1/mouse-text-tool)
│   └── advanced-overlay-windows/ # Window management component
├── plugins/                      # Complete Alt1 applications
│   └── dungeoneering-optimizer/  # Alt1 app (@tmg-alt1/dungeoneering-optimizer)
├── shared/                       # Shared configurations
│   ├── webpack.config.base.js    # Base webpack config
│   ├── tsconfig.base.json        # Base TypeScript config
│   └── eslint.config.js          # Shared linting rules
├── docs/                         # Documentation and dev notes
├── scripts/                      # Build and deployment automation
└── package.json                  # Root workspace configuration
```

### Component Types

**Components** (Reusable Libraries):
- `@tmg-alt1/mouse-text-tool` - OCR component library exporting `DoorTextReader` class
- `@tmg-alt1/advanced-overlay-windows` - Advanced window management for Alt1 apps
- Purpose: Shared functionality that can be imported by multiple plugins
- No `appconfig.json` - these are libraries, not Alt1 apps
- Export TypeScript interfaces and classes

**Plugins** (Complete Alt1 Applications):
- `@tmg-alt1/dungeoneering-optimizer` - Complete Alt1 app for dungeoneering optimization
- Purpose: Game-specific tools that consume reusable components
- Include `appconfig.json` for Alt1 installation
- Deployable to Alt1 Toolkit

### Technology Stack

**Core Technologies**
- TypeScript 5.1.3+ (primary language)
- Webpack 5.65+ (build system with dev server)
- Alt1 API v0.1.0+ (official npm package from skillbert/alt1)
- Tesseract.js 4.1.1 (OCR engine)

**Alt1 Integration Methods**
- **`alt1` npm package** (`import * as a1lib from 'alt1'`): Utility functions, color mixing, image processing
- **`window.alt1` runtime API** (`(window as any).alt1`): Core overlay functions, screen capture, app registration

**Build & Deployment**
- Webpack (production builds only - no dev server for Alt1 apps)
- Copy Webpack Plugin (asset management)
- CSS/SASS Loaders (styling support)
- TypeScript Loader (compilation)
- GitHub Pages (automated deployment via GitHub Actions)
- Alt1 Protocol (`alt1://addapp/` URLs for branch deployments)
- **NO LOCAL DEVELOPMENT FOR ALT1 APPS** - Must deploy to test

## Development Patterns

### Component Architecture Pattern
```typescript
// CORRECT: Import from reusable components (new structure)
import { DoorTextReader } from '@tmg-alt1/mouse-text-tool';
import { OverlayWindowManager } from '@tmg-alt1/advanced-overlay-windows';

// OLD (deprecated): Direct path imports
import { DoorTextReader } from '../mouse_text_tool/dist/index.bundle.js';

// AVOID: Duplicating code between components
class DoorTextReader { /* embedded copy */ }
```

### Workspace Build Pattern
```bash
# Root workspace commands
npm run build:all              # Build all components and plugins

# Individual component builds
cd components/mouse-text-tool
npm run build                  # Build component library

# Individual plugin builds
cd plugins/dungeoneering-optimizer
npm run build                  # Build Alt1 application

# IMPORTANT: After building, always commit and push for deployment
git add .
git commit -m "Your changes"
git push
# Then monitor: https://github.com/baglett/tmg_alt1_toolset/actions
```

### Alt1 Integration Pattern
```typescript
// Standard Alt1 initialization
if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");
    if (alt1.permissionPixel) {
        // Initialize app functionality
    } else {
        // Handle missing permissions
    }
} else {
    // Development mode fallback
}
```

### Build Configuration Pattern
```javascript
// webpack.config.js standard setup
module.exports = {
    entry: './src/index.ts',
    output: { path: path.resolve(__dirname, 'dist') },
    // NO devServer configuration for Alt1 apps
    // Apps must be deployed to GitHub Pages for testing
};
```

## Architecture Improvements Completed

### ✅ Repository Reorganization
- **Completed**: Moved to `components/` and `plugins/` structure
- **New Names**:
  - `mouse_text_tool` → `@tmg-alt1/mouse-text-tool`
  - `dungeoneering-optimization-gate-engine` → `@tmg-alt1/dungeoneering-optimizer`
- **Monorepo**: Implemented npm workspaces with shared configurations

### ✅ Shared Build System
- **Base Configurations**: `shared/webpack.config.base.js`, `shared/tsconfig.base.json`
- **Unified Commands**: Root-level workspace commands for all components/plugins
- **Dependency Management**: Hoisted common dependencies to root level

### 🔄 Remaining Tasks

### Priority 1: Component Duplication (Still Needs Fix)
- **Problem**: `plugins/dungeoneering-optimizer` still contains embedded copy of `DoorTextReader`
- **Location**: `plugins/dungeoneering-optimizer/src/index.html:1900-2164`
- **Fix Required**: Replace with proper import: `import { DoorTextReader } from '@tmg-alt1/mouse-text-tool';`

### Priority 2: Advanced Window Management
- **New Component**: `@tmg-alt1/advanced-overlay-windows`
- **Innovation**: Computer vision-based interaction detection with Alt1 overlays
- **Integration**: Will be used by dungeoneering plugin for multi-window experience

## Development Workflow

### MANDATORY Alt1 Development Workflow

**CRITICAL: Alt1 apps CANNOT be properly tested locally. They MUST run in the actual Alt1 Toolkit environment.**

**NEVER use these commands for Alt1 development:**
- ❌ `npm run dev` - Local dev servers can't replicate Alt1 environment
- ❌ `webpack serve` - Missing Alt1 API injection and permissions
- ❌ `http-server` - No Alt1 window management or overlays
- ❌ `alt1://addapp/http://localhost:9000/appconfig.json` - Unreliable for testing

**ALWAYS follow this exact workflow:**

```bash
# Step 1: Build locally to catch errors early
npm run build                  # Build current plugin/component
# OR
npm run build:all              # Build all components and plugins

# Step 2: Commit changes with descriptive message
git add .
git commit -m "Your descriptive commit message

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Step 3: Push to trigger automatic deployment
git push

# Step 4: Monitor GitHub Actions immediately
# Visit: https://github.com/baglett/tmg_alt1_toolset/actions
# Wait for deployment to complete (usually 2-3 minutes)

# Step 5: Test using branch-specific Alt1 install URL
# For feature branches (e.g., feature/claude_setup):
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/[plugin-name]/appconfig.json

# For main branch (production):
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/[plugin-name]/appconfig.json
```

### Why This Workflow is MANDATORY

1. **Alt1 Environment Requirements**: Alt1 apps need the actual Alt1 Toolkit runtime to function properly
2. **Security Constraints**: Alt1's permission system and API injection only work in the real environment
3. **Window Management**: Alt1's window constraints and overlay system can't be simulated locally
4. **Branch Deployments**: Every push triggers automatic deployment to a branch-specific URL for safe testing
5. **Immediate Feedback**: GitHub Actions provide quick deployment (2-3 minutes) with full Alt1 compatibility

### What You Should Always Tell Users

When developing Alt1 applications:
- "We'll build locally, commit, and push to trigger deployment"
- "Let's monitor the GitHub Actions to ensure successful deployment"
- "Once deployed, use this branch-specific Alt1 install URL to test"
- "Never try to run Alt1 apps locally - they need the actual Alt1 environment"

### Component Development Exception

Components (libraries without appconfig.json) can be developed locally for unit testing:
```bash
# For component libraries only (not Alt1 apps):
cd components/mouse-text-tool
npm run dev                    # OK for component development
npm run test                   # OK for unit testing
```

But plugins (Alt1 apps) MUST use the deployment workflow above.

### File Structure Convention
```
component-name/
├── src/
│   ├── index.ts          # Main entry (TypeScript)
│   ├── index.html        # Template (if Alt1 app)
│   └── appconfig.json    # Alt1 configuration
├── dist/                 # Build output
├── assets/               # Static resources
├── package.json          # Dependencies & scripts
└── webpack.config.js     # Build configuration
```

## Alt1 API Constraints

### Window Management
- ❌ Apps cannot resize windows dynamically
- ❌ No multi-window spawning
- ✅ Fixed dimensions via `appconfig.json`
- ✅ CSS-based modals for additional UI

### Alt1 API Access Methods

**Two Ways to Access Alt1 Functions:**

1. **`alt1` npm package** - Utility Functions
   ```typescript
   import * as a1lib from 'alt1';

   // Use for utility functions
   const color = a1lib.mixColor(255, 0, 0, 255);  // Color mixing
   const region = a1lib.captureHold();            // Image capture helpers
   const reader = new a1lib.ImageReader();        // Image processing
   ```

2. **`window.alt1` runtime API** - Core Alt1 Functions
   ```typescript
   // Global API injected by Alt1 Toolkit at runtime
   (window as any).alt1.overLayRect(...);         // Overlay rendering
   (window as any).alt1.getRegion(...);           // Screen capture
   (window as any).alt1.identifyApp(...);         // App registration

   // Also available as window.alt1 with proper types in Alt1 environment
   window.alt1.rsActive;                          // Game state
   window.alt1.permissionPixel;                   // Permission checking
   ```

**When to Use Which:**
- **`a1lib`**: Helper functions, utilities, color manipulation, image processing
- **`window.alt1`**: Direct Alt1 API calls (overlays, screen capture, app lifecycle)
- **Overlays are visual-only**: Cannot receive mouse events, interaction must be handled in main app window

### Available APIs
- **Screen capture**: `window.alt1.getRegion()`, `a1lib.captureHoldFullRs()`
- **Overlays**: `window.alt1.overLayRect()`, `window.alt1.overLayText()`
- **OCR**: `a1lib` text recognition capabilities
- **Game state**: `window.alt1.rsActive`, `window.alt1.mousePosition`

## Common Commands

### Build Commands
```bash
npm run build     # Production build (REQUIRED before committing)
npm run build:all # Build all components and plugins
# Note: NO dev server commands for Alt1 apps - must deploy to test
```

### **CRITICAL: Build Before Commit Protocol**
**⚠️ MANDATORY**: All plugins and components must be built locally before committing:

```bash
# For any component changes:
cd components/[component-name]
npm run build

# For any plugin changes:
cd plugins/[plugin-name]
npm run build

# Or build everything:
npm run build:all
```

**Why this is required:**
- `dist/` files are committed to git and deployed directly
- GitHub Actions builds plugins but assumes components are pre-built
- Source code changes won't appear in deployment without building first
- Missing builds cause Alt1 API errors and broken functionality

### **Optional: Automated Pre-Commit Hook**
To automatically build before every commit:
```bash
# Install the pre-commit hook (one time setup)
./scripts/setup-pre-commit-hook.sh

# Now all commits will automatically:
# 1. Run npm run build:all
# 2. Stage newly built dist/ files
# 3. Include them in the commit
```

### Linting & Type Checking
```bash
npm run lint       # ESLint (if configured)
npm run typecheck  # TypeScript checking
```

### Deployment & Monitoring
- Commit triggers GitHub Actions automatically for `main`, `development`, and `feature/*` branches
- **CRITICAL**: Always monitor deployment status after pushing
- Branch-specific deployment URLs and Alt1 install links generated automatically

#### Branch Deployment Structure
```bash
# Main Branch (Production)
https://baglett.github.io/tmg_alt1_toolset/
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/dungeoneering-optimizer/appconfig.json

# Development Branch
https://baglett.github.io/tmg_alt1_toolset/development/
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/development/dungeoneering-optimizer/appconfig.json

# Feature Branches (e.g., feature/claude_setup)
https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/dungeoneering-optimizer/appconfig.json
```

#### GitHub Actions Template Logic
```yaml
# Auto-generates branch-specific URLs using:
${{ github.ref_name == 'main' && '' || github.ref_name }}${{ github.ref_name == 'main' && '' || '/' }}
# Main branch: "" (empty) → clean URLs
# Other branches: "branch-name/" → prefixed URLs
```

#### Required Development Protocol
```bash
# MANDATORY WORKFLOW - NO LOCAL TESTING FOR ALT1 APPS:

# Step 1: Build components/plugins locally
npm run build:all              # Or specific build command

# Step 2: Commit with built dist/ files
git add .
git commit -m "Your descriptive message

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Step 3: Push to trigger deployment
git push

# Step 4: Monitor GitHub Actions IMMEDIATELY
# Visit: https://github.com/baglett/tmg_alt1_toolset/actions
# Wait for deployment completion (2-3 minutes)

# Step 5: Test with branch-specific Alt1 URL
# Feature branch: alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/[branch-name]/[plugin-name]/appconfig.json
# Main branch: alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/[plugin-name]/appconfig.json
```

## Key Dependencies

### Production
- `alt1: ^0.1.0` - Official Alt1 API package
- `tesseract.js: ^4.1.1` - OCR engine

### Development
- `typescript: ^5.1.3` - TypeScript compiler
- `webpack: ^5.65.0` - Module bundler
- `ts-loader: ^9.3.1` - TypeScript webpack loader
- `copy-webpack-plugin: ^11.0.0` - Asset copying

## Logging Standards

### **MANDATORY: Alt1Logger Implementation**
All Alt1 applications MUST implement standardized logging using the `Alt1Logger` class for consistent debugging and monitoring.

### Standard Logger Usage Pattern
```typescript
import { Alt1Logger, LogLevel } from './logger';

// Initialize logger for your app
const logger = new Alt1Logger('YourAppName', LogLevel.DEBUG);

// App lifecycle logging
logger.init('Starting initialization...');
logger.success('Initialization completed successfully');

// Alt1 integration logging
logger.alt1('Checking Alt1 availability...');
logger.alt1('Alt1 detected with permissions:', permissions);

// User interaction logging
logger.ui('Button clicked: openExampleWindow', {
    timestamp: Date.now(),
    disabled: event.target?.disabled
});

// Window management logging
logger.window('Creating window:', windowConfig);
logger.window('Window focused:', windowId);

// Error handling logging
try {
    // risky operation
} catch (error) {
    logger.error('Operation failed:', error);
}
```

### Required Logging Categories
- 🚀 **Initialization**: `logger.init()`, `logger.success()`
- 🔧 **Alt1 Integration**: `logger.alt1()` - API availability, permissions
- 🪟 **Window Management**: `logger.window()` - Create, focus, resize, close
- 🎮 **User Interactions**: `logger.ui()` - Button clicks, form submissions
- 📊 **Performance**: `logger.perf()` - Timing, memory usage
- 🔍 **OCR Operations**: `logger.ocr()` - Text recognition, screen capture
- 💾 **Data Operations**: `logger.data()` - Save/load operations
- 🌐 **Network**: `logger.network()` - API calls, requests
- ❌ **Errors**: `logger.error()` - All error conditions with context

### Critical Logging Requirements
1. **Method Entry**: Log entry to all public methods
2. **Error Conditions**: Log all error conditions with full context
3. **State Changes**: Log changes affecting user experience
4. **Alt1 Permissions**: Log all Alt1 API availability checks
5. **User Interactions**: Log all button clicks and form submissions
6. **Performance Operations**: Log operations taking >16ms

### Event Handler Logging Pattern
```typescript
private setupEventHandlers(): void {
    this.elements.openExampleWindow?.addEventListener('click', (event) => {
        this.logger.ui('Button clicked: openExampleWindow', {
            disabled: (event.target as HTMLButtonElement)?.disabled,
            timestamp: Date.now()
        });
        this.openExampleWindow();
    });
}

private openExampleWindow(): void {
    this.logger.window('openExampleWindow() called');

    if (!this.windowManager) {
        this.logger.error('openExampleWindow failed: Window manager not available');
        return;
    }

    try {
        const window = this.windowManager.createWindow(config);
        this.logger.success('Example window created:', window.id);
    } catch (error) {
        this.logger.error('Failed to create example window:', error);
    }
}
```

### Alt1 Permission Logging Pattern
```typescript
private checkAlt1Status(): void {
    this.logger.alt1('Checking Alt1 status...');

    if (window.alt1) {
        this.logger.alt1('Alt1 detected');

        const permissions = {
            pixel: window.alt1.permissionPixel,
            overlay: window.alt1.permissionOverlay,
            gameState: window.alt1.permissionGameState
        };

        this.logger.alt1('Alt1 permissions:', permissions);

        if (permissions.pixel && permissions.overlay) {
            this.logger.success('Alt1 ready with full permissions');
        } else {
            this.logger.warn('Alt1 missing required permissions:',
                Object.entries(permissions)
                    .filter(([key, value]) => !value)
                    .map(([key]) => key)
            );
        }
    } else {
        this.logger.error('Alt1 not detected - running in browser mode');
    }
}
```

## Project Context for Agents

When working on this codebase:

1. **Respect component boundaries** - Libraries export, applications consume
2. **Fix duplication issues** - Replace embedded code with proper imports
3. **Follow TypeScript patterns** - Avoid mixed HTML/JS implementations
4. **NEVER test Alt1 apps locally** - Always build, commit, push, and use branch deployment URLs
5. **Maintain build consistency** - All components should follow webpack pattern
6. **Version management** - Update `appconfig.json` version for releases
7. **MANDATORY: Implement Alt1Logger** - All applications must use standardized logging
8. **Log all user interactions** - Button clicks, method entries, errors with full context
9. **ALWAYS use deployment workflow** - Build → Commit → Push → Monitor → Test with Alt1 URL
10. **NO local dev servers for Alt1 apps** - They cannot replicate the Alt1 environment

## Documentation References

- Alt1 API: https://github.com/skillbert/alt1
- Development Guide: `dev-notes/Deployment/iterative_development.md`
- Architecture Assessment: `dev-notes/session-9-19-25.md`