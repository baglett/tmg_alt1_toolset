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

**Install:** `alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/dungeoneering-optimizer/appconfig.json`

## 🔧 Development Workflow

### Standard Development Process
```bash
# 1. Make your changes
# 2. Test locally
npm run dev:dungeoneering

# 3. Build and commit
npm run build:all
git add .
git commit -m "Your changes description"
git push

# 4. CRITICAL: Monitor deployment
# Check: https://github.com/baglett/tmg_alt1_toolset/actions
# Verify latest workflow succeeds before considering work complete
```

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

- **Automatic**: GitHub Actions deploys on every push
- **Branch-specific URLs**: Feature branches get their own deployment paths
- **Main Branch**: `https://baglett.github.io/tmg_alt1_toolset/`
- **Feature Branches**: `https://baglett.github.io/tmg_alt1_toolset/{branch-name}/`

## 📖 Documentation

- **Development Context**: See [CLAUDE.md](./CLAUDE.md) for comprehensive development guidelines
- **Agent Instructions**: See [.claude/agents/](./claude/agents/) for specialized development protocols

## 🔗 Links

- **Alt1 Toolkit**: https://github.com/skillbert/alt1
- **Live Deployment**: https://baglett.github.io/tmg_alt1_toolset/
- **GitHub Actions**: https://github.com/baglett/tmg_alt1_toolset/actions

---

⚠️ **Remember**: Always monitor GitHub Actions after pushing to ensure successful deployment!