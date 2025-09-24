# TMG Alt1 Toolset

A modular ecosystem of Alt1 Toolkit applications and reusable components for RuneScape automation and enhancement tools.

## 🏗️ Architecture

This repository follows a **component-plugin workspace** pattern:

```
tmg_alt1_toolset/
├── components/                    # Reusable libraries (@tmg-alt1/*)
│   ├── mouse-text-tool/          # OCR component
│   └── advanced-overlay-windows/ # Window management system
├── plugins/                      # Complete Alt1 applications
│   └── dungeoneering-optimizer/  # Alt1 app for dungeoneering
├── shared/                       # Shared build configurations
└── .github/workflows/            # Automated deployment
```

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server for specific plugin
npm run dev:dungeoneering

# Build all components and plugins
npm run build:all
```

### Testing in Alt1
1. Start dev server: `npm run dev:dungeoneering`
2. Install in Alt1: `alt1://addapp/http://localhost:9000/appconfig.json`
3. Grant required permissions when prompted

## 📦 Available Plugins

### 🏰 Dungeoneering Optimizer
Advanced gate engine and optimization tools for RuneScape Dungeoneering.

#### Install Links by Branch:
- **Main (Production):** `alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/dungeoneering-optimizer/appconfig.json`
- **Development:** `alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/development/dungeoneering-optimizer/appconfig.json`
- **Current Feature:** `alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/dungeoneering-optimizer/appconfig.json`

### 🪟 Advanced Windows Test
Test plugin demonstrating advanced overlay window management capabilities.

#### Install Links by Branch:
- **Main (Production):** `alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/advanced-windows-test/appconfig.json`
- **Development:** `alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/development/advanced-windows-test/appconfig.json`
- **Current Feature:** `alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/advanced-windows-test/appconfig.json`

## 🔧 Development Workflow

### Standard Development Process
```bash
# 1. Make your changes to source files
# 2. Test locally
npm run dev:dungeoneering

# 3. CRITICAL: Build before committing
npm run build:all  # Builds all components and plugins

# 4. Commit with built files
git add .
git commit -m "Your changes description"
git push

# 5. CRITICAL: Monitor deployment
# Check: https://github.com/baglett/tmg_alt1_toolset/actions
# Verify latest workflow succeeds before considering work complete
```

### **⚠️ Why Building is Mandatory**

**Must build before committing because:**
- `dist/` files are committed to git and deployed directly
- GitHub Pages serves built files, not source code
- Alt1 loads the `index.bundle.js` from the `dist/` folder
- Source changes without building = broken deployments

### 🚨 **MANDATORY Post-Push Protocol**

**Every commit MUST be followed by deployment verification:**

1. **Check GitHub Actions**: Navigate to [Actions tab](https://github.com/baglett/tmg_alt1_toolset/actions)
2. **Monitor Latest Run**: Ensure workflow completes successfully
3. **Fix Failures Immediately**: If build fails, investigate logs and fix before next commit
4. **Verify Deployment**: Check that the deployed URL is accessible

**❌ Never consider work complete until deployment succeeds**

## 🛠️ Component Architecture

### Components (Reusable Libraries)
- `@tmg-alt1/mouse-text-tool` - OCR functionality for text recognition
- `@tmg-alt1/advanced-overlay-windows` - Advanced window management system

### Plugins (Complete Alt1 Apps)
- `@tmg-alt1/dungeoneering-optimizer` - Dungeoneering automation and optimization

### Modern Import Pattern
```typescript
// CORRECT: Import from reusable components
import { DoorTextReader } from '@tmg-alt1/mouse-text-tool';
import { OverlayWindowManager } from '@tmg-alt1/advanced-overlay-windows';

// AVOID: Duplicated embedded code
class DoorTextReader { /* embedded copy */ }
```

## 🌐 Deployment

### Branch-Specific Deployment System
GitHub Actions automatically deploys different branches to isolated URLs:

#### Deployment URLs:
- **Main Branch (Production):** `https://baglett.github.io/tmg_alt1_toolset/`
- **Development Branch:** `https://baglett.github.io/tmg_alt1_toolset/development/`
- **Feature Branches:** `https://baglett.github.io/tmg_alt1_toolset/{branch-name}/`

#### Alt1 Install URL Pattern:
```
# Main branch (clean URLs)
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/{plugin-name}/appconfig.json

# Other branches (prefixed URLs)
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/{branch-name}/{plugin-name}/appconfig.json
```

#### Automatic Features:
- **Branch Isolation**: Each branch gets its own deployment path for safe testing
- **Auto-Generated Index**: Each deployment includes an index page with install buttons
- **Dynamic URLs**: GitHub Actions template automatically generates correct Alt1 links

## 📖 Documentation

- **Development Context**: See [CLAUDE.md](./CLAUDE.md) for comprehensive development guidelines
- **Agent Instructions**: See [.claude/agents/](./claude/agents/) for specialized development protocols

## 🔗 Links

- **Alt1 Toolkit**: https://github.com/skillbert/alt1
- **Live Deployment**: https://baglett.github.io/tmg_alt1_toolset/
- **GitHub Actions**: https://github.com/baglett/tmg_alt1_toolset/actions

---

⚠️ **Remember**: Always monitor GitHub Actions after pushing to ensure successful deployment!