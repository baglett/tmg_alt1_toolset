@echo off
echo Building and running the Dungeoneering Gate Engine...

echo Creating icon.png...
powershell -ExecutionPolicy Bypass -File create-icon.ps1

echo Installing dependencies...
call npm install

echo Building the project...
call npm run build

echo Starting the development server...
call npm run dev

echo.
echo ======================================================
echo IMPORTANT: First-time setup for Alt1 app
echo ======================================================
echo 1. Navigate to http://localhost:9000/install.html
echo 2. Click the "Install Map Helper" button to install the app in Alt1
echo 3. Then go to the main app and use the "Open Helper Window" button
echo    in the Map Interaction tab to open the helper window
echo.
echo NOTE: The helper window now uses an improved approach to open in Alt1:
echo       - Uses multiple methods in sequence to ensure it opens in Alt1
echo       - Prevents duplicate windows from opening
echo       - Falls back to default browser only if Alt1 methods fail
echo       Make sure Alt1 is running when you click the button.
echo ======================================================

echo Done! 