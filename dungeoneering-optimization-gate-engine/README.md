# Dungeoneering Gate Engine with Alt1 Popup

This project includes a Dungeoneering Gate Engine with an Alt1 popup functionality.

## Alt1 Popup Feature

The Alt1 popup feature allows you to open a helper window from the map tab. This window displays useful information for dungeoneering, such as key tracking and room status.

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
   - Click the "Install Map Helper" button
   - Alt1 should prompt you to add the app

6. When the application is open, navigate to the "Map Interaction" tab.

7. Click the "Open Helper Window" button to open the Alt1 popup.

### How It Works

The Alt1 popup functionality uses a smart, sequential approach to ensure the helper window opens in Alt1 without duplicate windows:

1. **Primary Method**: Uses the `alt1://browser/` protocol with an anchor tag to open a new browser window directly within Alt1
2. **Fallback Method 1**: If the anchor tag approach fails, it tries using an iframe to load the Alt1 protocol URL
3. **Fallback Method 2**: As a last resort, it attempts to use the Alt1 API directly with `window.alt1.openBrowser()`
4. **Final Fallback**: Only if all Alt1 methods fail, it falls back to a regular browser window

This implementation uses a tracking flag to prevent multiple windows from opening simultaneously, ensuring that only one helper window appears, preferably in Alt1.

The implementation consists of:
- A button in the Map Interaction tab that triggers the `openAlt1Popup()` method
- The `openAlt1Popup()` method that tries multiple approaches to open the helper window
- A `helper.html` file that contains the UI for the helper window

For installation, we still use:
- `alt1://addapp/` - Used once to install the app (via the install.html page)

The `appconfig.json` file specifies:
- The name and description of the app
- The URL of the HTML file to display
- The dimensions of the window
- The permissions required by the app

### Customizing the Alt1 Popup

To customize the Alt1 popup:

1. Edit the `helper.html` file to change the content displayed in the popup.
2. Edit the `appconfig.json` file to change the configuration of the popup (e.g., name, dimensions).
3. Replace the `icon.png` file with your own icon.

### Troubleshooting

If the Alt1 popup doesn't open:

1. Make sure Alt1 Toolkit is installed and running.
2. Check if you have the necessary permissions enabled in Alt1:
   - Open Alt1 settings
   - Make sure the app has permission to open browser windows
3. Check the browser console for any error messages.
4. If you're running the app locally, make sure you're using the development server (npm run dev) as it sets up the necessary CORS headers.
5. If the helper window opens but doesn't display correctly, check that the `helper.html` file is being properly copied to the `dist` directory during the build process.
6. If the window still opens in your default browser instead of Alt1:
   - Make sure Alt1 is running and is the active window when you click the button
   - Try clicking the "Open Helper Window" button again
   - Check if your browser is blocking the Alt1 protocol - you may need to allow it in your browser settings

## License

[Include your license information here] 