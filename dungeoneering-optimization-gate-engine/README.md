# Dungeoneering Gate Engine with Compact Map Grid

This project includes a Dungeoneering Gate Engine with a compact map grid functionality.

## Compact Map Grid Feature

The compact map grid feature allows you to open a small, interactive dungeoneering map in a separate Alt1 window. This 140x140 pixel grid provides a minimal visual representation of the dungeon layout and allows you to mark key locations.

### Setup Instructions

1. Make sure you have the Alt1 Toolkit installed on your computer. You can download it from [the Alt1 website](https://runeapps.org/alt1).

2. Create an `icon.png` file in the `src` directory. You can use the provided PowerShell script to generate a simple icon:
   ```powershell
   .\create-icon.ps1
   ```

3. Build the project using the following commands:
   ```powershell
   # Navigate to the dungeoneering-optimization-gate-engine directory
   cd dungeoneering-optimization-gate-engine
   
   # Install dependencies (if you haven't already)
   npm install
   
   # Build the project
   npm run build
   ```

4. Start the development server:
   ```powershell
   npm run dev
   ```
   This will open the application in your default browser.

5. **First-time setup**: You need to install the Alt1 app once before you can use it:
   - Navigate to `http://localhost:9000/install.html` in your browser
   - Click the "Install Map Grid" button
   - Alt1 should prompt you to add the app

6. When the application is open, navigate to the "Map Interaction" tab.

7. Click the "Open Helper Window" button to open the compact map grid.

### How It Works

The compact map grid functionality uses a smart, sequential approach to ensure the map window opens in Alt1 without duplicate windows:

1. **Primary Method**: Uses the `alt1://browser/` protocol with an anchor tag to open a new browser window directly within Alt1
2. **Fallback Method 1**: If the anchor tag approach fails, it tries using an iframe to load the Alt1 protocol URL
3. **Fallback Method 2**: As a last resort, it attempts to use the Alt1 API directly with `window.alt1.openBrowser()`
4. **Final Fallback**: Only if all Alt1 methods fail, it falls back to a regular browser window

This implementation uses a tracking flag to prevent multiple windows from opening simultaneously, ensuring that only one map window appears, preferably in Alt1.

The compact map grid provides the following features:
- Minimal 140x140 pixel size that fits perfectly in the Alt1 overlay
- Interactive grid that can be clicked to place markers
- Support for different dungeon sizes (small, medium, large)
- Ability to mark key locations (keys, boss, start, gates)
- Two-way synchronization between the main window and the Alt1 window

The implementation consists of:
- A button in the Map Interaction tab that triggers the `openAlt1Popup()` method
- The `openAlt1Popup()` method that tries multiple approaches to open the map window
- A `helper.html` file that contains the interactive map grid UI
- Two-way communication between the main window and the map window

For installation, we still use:
- `alt1://addapp/` - Used once to install the app (via the install.html page)

The `appconfig.json` file specifies:
- The name and description of the app
- The URL of the HTML file to display
- The dimensions of the window (140x140 pixels)
- The permissions required by the app

### Customizing the Compact Map Grid

To customize the compact map grid:

1. Edit the `helper.html` file to change the content displayed in the map window.
2. Edit the `appconfig.json` file to change the configuration of the window (e.g., name, dimensions).
3. Replace the `icon.png` file with your own icon.

### Troubleshooting

If the compact map grid doesn't open:

1. Make sure Alt1 Toolkit is installed and running.
2. Check if you have the necessary permissions enabled in Alt1:
   - Open Alt1 settings
   - Make sure the app has permission to open browser windows
3. Check the browser console for any error messages.
4. If you're running the app locally, make sure you're using the development server (npm run dev) as it sets up the necessary CORS headers.
5. If the map window opens but doesn't display correctly, check that the `helper.html` file is being properly copied to the `dist` directory during the build process.
6. If the window still opens in your default browser instead of Alt1:
   - Make sure Alt1 is running and is the active window when you click the button
   - Try clicking the "Open Helper Window" button again
   - Check if your browser is blocking the Alt1 protocol - you may need to allow it in your browser settings

## License

[Include your license information here] 