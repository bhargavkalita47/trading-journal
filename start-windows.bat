@echo off
echo ===================================================
echo      Starting TradeLedger Pro India (Local)
echo ===================================================
echo.

echo Step 1: Checking if Node.js is installed...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed! 
    echo Please download and install it from https://nodejs.org/
    echo Once installed, run this file again.
    pause
    exit
)

echo.
echo Step 2: Installing required files (this takes a minute the first time)...
call npm install

echo.
echo Step 3: Starting the application...
echo (A browser window will open automatically)
echo.

:: Wait 3 seconds then open the browser
start "" "http://localhost:3000"

:: Start the server
call npm run dev

pause
