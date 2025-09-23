# TMG Alt1 Toolset - Deployment Guide

This guide explains how to deploy and install Alt1 plugins from this repository.

## Overview

This repository contains multiple Alt1 plugins for RuneScape 3, organized in a monorepo structure. Each plugin can be installed individually from different branches for testing and production use.

## Available Plugins

### 🏰 Dungeoneering Optimizer
Advanced gate engine and optimization tools for RuneScape Dungeoneering with automatic screen capture and OCR integration.

### 🪟 Advanced Windows Test
Test plugin demonstrating advanced overlay window management capabilities with interactive examples and comprehensive feature showcase.

### 🔍 Mouse Text Tool (Component)
Reusable OCR component library that powers other plugins but is not directly installable as a standalone Alt1 app.

## Branch-Based Deployment

The repository deploys to different URLs based on the git branch:

- **Production (main)**: `https://baglett.github.io/tmg_alt1_toolset/`
- **Development**: `https://baglett.github.io/tmg_alt1_toolset/development/`
- **Feature Branches**: `https://baglett.github.io/tmg_alt1_toolset/[branch-name]/`

## Installation Methods

### Method 1: Direct Plugin Installation (Recommended)

Install individual plugins directly using Alt1's protocol:

#### Production (main branch):
```
🏰 Dungeoneering Optimizer:
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/dungeoneering-optimizer/appconfig.json

🪟 Advanced Windows Test:
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/advanced-windows-test/appconfig.json
```

#### Development branch:
```
🏰 Dungeoneering Optimizer:
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/development/dungeoneering-optimizer/appconfig.json

🪟 Advanced Windows Test:
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/development/advanced-windows-test/appconfig.json
```

#### Current feature branch (feature/claude_setup):
```
🏰 Dungeoneering Optimizer:
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/dungeoneering-optimizer/appconfig.json

🪟 Advanced Windows Test:
alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/advanced-windows-test/appconfig.json
```

### Method 2: Browse and Install

Visit the deployment page in your browser to see all available plugins:

- **Production**: https://baglett.github.io/tmg_alt1_toolset/
- **Development**: https://baglett.github.io/tmg_alt1_toolset/development/
- **Feature Branch**: https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/

Each page provides one-click installation buttons and browsable file directories.

### Method 3: Manual Installation

For manual installation through Alt1's interface:

1. Open Alt1 Toolkit
2. Click "Add App" → "Browse"
3. Navigate to the desired plugin URL (see Method 1 for URLs)
4. Click "Add App"

### Method 4: Local Development Installation

For users who want to run local builds or development versions:

1. **Clone/Download Repository**
   ```bash
   git clone https://github.com/baglett/tmg_alt1_toolset.git
   cd tmg_alt1_toolset
   ```

2. **Build All Plugins**
   ```bash
   npm install
   npm run build:all
   ```

3. **Install Specific Plugin in Alt1**
   - Open Alt1 Toolkit
   - Click "Add App" → "Browse"
   - Navigate to the desired plugin's `dist/index.html` file:
     - `plugins/dungeoneering-optimizer/dist/index.html`
     - `plugins/advanced-windows-test/dist/index.html`
   - Click "Add App"

## Deployment Process for Developers

### Building for Production

1. **Install dependencies (root level)**
   ```bash
   npm install
   ```

2. **Build all plugins**
   ```bash
   npm run build:all
   ```

3. **Test local deployment structure**
   ```bash
   npm run deploy
   ```
   This creates a `deploy-local/` directory with the same structure as GitHub Pages.

4. **Verify build output**
   - Check each plugin's `dist/` folder contains all necessary files
   - Verify `appconfig.json` files are copied correctly
   - Test individual plugins locally

### GitHub Pages Deployment

The repository uses GitHub Actions to automatically build and deploy to GitHub Pages:

#### Automatic Deployment

**Supported Branches:**
- `main` → `https://baglett.github.io/tmg_alt1_toolset/`
- `development` → `https://baglett.github.io/tmg_alt1_toolset/development/`
- `feature/claude_setup` → `https://baglett.github.io/tmg_alt1_toolset/feature/claude_setup/`

**Process:**
1. Push changes to any supported branch
2. GitHub Actions automatically:
   - Builds all plugins using `npm run build:all`
   - Creates branch-specific deployment structure
   - Generates plugin directory index page
   - Deploys to GitHub Pages with proper MIME types

#### Manual Deployment

```bash
git add .
git commit -m "Update plugins"
git push origin [branch-name]
```

#### Deployment Structure

Each branch creates the following structure:
```
https://baglett.github.io/tmg_alt1_toolset/[branch]/
├── index.html (plugin directory)
├── dungeoneering-optimizer/
│   ├── index.html
│   ├── appconfig.json
│   └── [other plugin files]
└── advanced-windows-test/
    ├── index.html
    ├── appconfig.json
    └── [other plugin files]
```

### Alt1 App Configuration

Each tool includes an `appconfig.json` that defines:

```json
{
    "appName": "Dungeoneering Gate Engine",
    "description": "Dungeoneering gate text reader and map tracker",
    "appUrl": "./index.html",
    "configUrl": "./appconfig.json",
    "iconUrl": "./icon.png",
    "defaultWidth": 500,
    "defaultHeight": 800,
    "permissions": "pixel,overlay"
}
```

Key fields for deployment:
- `appName`: Display name in Alt1
- `permissions`: Required Alt1 permissions
- `defaultWidth/Height`: Initial window size
- `appUrl`: Entry point (usually index.html)

## User Installation Steps

### Prerequisites
1. **Alt1 Toolkit installed**
   - Download from [runeapps.org](https://runeapps.org/alt1)
   - Ensure it's running and has necessary permissions

2. **RuneScape 3 running** (for full functionality)
   - Required for pixel reading and screen capture
   - OCR features need game window access

### Installation Process

1. **Install the tool**
   - Use the quick install link OR
   - Manual installation via Alt1 browser

2. **Grant permissions**
   - Alt1 will prompt for pixel and overlay permissions
   - These are required for screen capture and UI overlays

3. **Configure the tool**
   - Adjust window size as needed
   - Configure tool-specific settings
   - Test functionality with RuneScape 3

### Troubleshooting

#### Common Issues

1. **"Alt1 not detected" error**
   - Ensure Alt1 Toolkit is running
   - Check that the app was added correctly
   - Verify the installation URL is correct

2. **Permission errors**
   - Enable pixel permissions in Alt1 settings
   - Enable overlay permissions if using screen overlays
   - Restart Alt1 if permissions aren't taking effect

3. **Tool not loading**
   - Check internet connection (for online installation)
   - Verify the GitHub URL is accessible
   - Try local installation as fallback

#### Debug Mode
For development and troubleshooting:
```bash
npm run dev
```
- Starts development server on `localhost:9000`
- Provides detailed error messages
- Allows testing without Alt1 first

## Version Management

### Release Process
1. Update version in `package.json`
2. Build production version: `npm run build`
3. Commit and push changes
4. Create GitHub release tag
5. Update installation links if needed

### User Updates
- Users can reinstall using the same installation link
- Alt1 will automatically use the latest version
- No manual update process required for online installations

This deployment approach ensures users always have access to the latest stable versions while maintaining easy installation and update processes.