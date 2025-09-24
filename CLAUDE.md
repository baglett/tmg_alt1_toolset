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

**Build & Development**
- Webpack Dev Server (hot reload on port 9000)
- Copy Webpack Plugin (asset management)
- CSS/SASS Loaders (styling support)
- TypeScript Loader (compilation)

**Deployment**
- GitHub Pages (automated via GitHub Actions)
- Alt1 Protocol (`alt1://addapp/` URLs)
- Local development (`http://localhost:9000/`)

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

### Workspace Development Pattern
```bash
# Root workspace commands
npm run build:all              # Build all components and plugins
npm run dev:dungeoneering      # Start dungeoneering plugin dev server
npm run dev:mouse-text         # Start mouse-text component dev server

# Individual component development
cd components/mouse-text-tool
npm run dev                    # Component-specific development

# Individual plugin development
cd plugins/dungeoneering-optimizer
npm run dev                    # Plugin-specific development
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
    devServer: {
        port: 9000,
        headers: { "Access-Control-Allow-Origin": "*" }
    }
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

### Modern Workspace Development
```bash
# Root-level development (recommended)
npm run dev:mouse-text         # Start mouse-text component dev server
npm run dev:dungeoneering      # Start dungeoneering plugin dev server
npm run build:all              # Build all components and plugins
npm run test:all               # Run tests across all workspaces

# Individual workspace development
cd components/mouse-text-tool && npm run dev
cd plugins/dungeoneering-optimizer && npm run dev

# Alt1 Testing URLs
# Component: alt1://addapp/http://localhost:9000/appconfig.json
# Plugin: alt1://addapp/http://localhost:9000/appconfig.json

# Production deployment with monitoring
git add . && git commit -m "Your changes"
git push                       # Triggers GitHub Actions
# REQUIRED: Check https://github.com/baglett/tmg_alt1_toolset/actions
# Monitor deployment status and fix any failures immediately
```

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

### Available APIs
- Screen capture: `getRegion()`, `captureHoldFullRs()`
- Overlays: `overLayRect()`, `overLayText()`
- OCR: Text recognition capabilities
- Game state: `rsActive`, `mousePosition`

## Common Commands

### Development
```bash
npm run dev     # Start dev server with hot reload
npm run build   # Production build
npm run start   # Build and serve
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

#### Required Post-Push Protocol
```bash
# After pushing commits, ALWAYS check deployment status:
1. Check GitHub Actions tab: https://github.com/baglett/tmg_alt1_toolset/actions
2. Monitor latest workflow run for success/failure
3. If failed, check logs and fix issues before next push
4. Verify branch-specific deployment URL is accessible after success
5. Test Alt1 install links for the appropriate branch
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

## Project Context for Agents

When working on this codebase:

1. **Respect component boundaries** - Libraries export, applications consume
2. **Fix duplication issues** - Replace embedded code with proper imports
3. **Follow TypeScript patterns** - Avoid mixed HTML/JS implementations
4. **Test in Alt1** - Use development URLs for real-world testing
5. **Maintain build consistency** - All components should follow webpack pattern
6. **Version management** - Update `appconfig.json` version for releases

## Documentation References

- Alt1 API: https://github.com/skillbert/alt1
- Development Guide: `dev-notes/Deployment/iterative_development.md`
- Architecture Assessment: `dev-notes/session-9-19-25.md`