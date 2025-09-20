# User Initial Deployment Guide

This guide explains how to deploy Alt1 tools from this repository for end users.

## Overview

This repository contains Alt1 tools for RuneScape 3. Currently, the only installable Alt1 tool is the **Dungeoneering Optimization Gate Engine**. The `mouse_text_tool` is a reusable component library that powers other tools but is not directly installable.

## Available Tools

### Dungeoneering Optimization Gate Engine
A tool for RuneScape 3 Dungeoneering that helps optimize gate and key placement with automatic screen capture and mouse text OCR integration.

## Deployment Methods

### Method 1: Online Installation (Recommended)

This is the easiest method for end users:

1. **Quick Install Link**

   **Production (main branch):**
   ```
   alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/appconfig.json
   ```

   **Development (feature branches):**
   ```
   alt1://addapp/https://baglett.github.io/tmg_alt1_toolset/development/appconfig.json
   ```

   - Click links to install directly in Alt1
   - Automatically downloads and installs from GitHub Pages
   - Uses proper MIME types for reliable loading

2. **Manual Online Installation**
   - Open Alt1 Toolkit
   - Click "Add App" � "Browse"
   - Navigate to: `https://baglett.github.io/tmg_alt1_toolset/appconfig.json`
   - Click "Add App"

### Method 2: Local Installation

For users who want to run local builds or development versions:

1. **Clone/Download Repository**
   ```bash
   git clone https://github.com/baglett/tmg_alt1_toolset.git
   cd tmg_alt1_toolset/dungeoneering-optimization-gate-engine
   ```

2. **Build the Tool**
   ```bash
   npm install
   npm run build
   ```

3. **Install in Alt1**
   - Open Alt1 Toolkit
   - Click "Add App" � "Browse"
   - Navigate to the local `dist/index.html` file
   - Click "Add App"

## Deployment Process for Developers

### Building for Production

1. **Navigate to tool directory**
   ```bash
   cd dungeoneering-optimization-gate-engine/
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build production version**
   ```bash
   npm run build
   ```

4. **Verify build output**
   - Check `dist/` folder contains all necessary files
   - Verify `appconfig.json` is copied correctly
   - Test the built version locally

### GitHub Pages Deployment

The repository uses GitHub Actions to automatically build and deploy to GitHub Pages:

1. **Automatic deployment**
   - Push changes to `main` branch
   - GitHub Actions automatically builds the tool
   - Deploys to GitHub Pages with proper MIME types

2. **Files become available at**
   ```
   https://baglett.github.io/tmg_alt1_toolset/appconfig.json
   ```

3. **Manual deployment (if needed)**
   ```bash
   git add .
   git commit -m "Update tool"
   git push origin main
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