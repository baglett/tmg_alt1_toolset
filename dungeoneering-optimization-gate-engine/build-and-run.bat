@echo off
echo Building and running Dungeoneering Gate Engine...

echo Creating icon...
powershell -ExecutionPolicy Bypass -File create-icon.ps1

echo Installing dependencies...
call npm install

echo Building project...
call npm run build

echo Starting development server...
start "" http://localhost:9000
call npm run dev

echo.
echo =====================================================================
echo First-time setup for Alt1 app:
echo 1. Navigate to http://localhost:9000/install.html
echo 2. Click the "Install Dungeon Grid" button
echo 3. Use the "Open Helper Window" button in the Map Interaction tab
echo    to open the compact 140x140 pixel grid in Alt1
echo.
echo The compact grid allows you to visualize and mark locations in the dungeon
echo with minimal screen space usage.
echo =====================================================================

echo Done! 