@echo off
REM Travel-Project Quick Start Script for Windows

echo ========================================
echo Travel-Project - Quick Start
echo ========================================
echo.

REM Check if both directories exist
if not exist "TravelIndia" (
    echo Error: TravelIndia directory not found!
    pause
    exit /b 1
)

if not exist "TravelIndia-frontend" (
    echo Error: TravelIndia-frontend directory not found!
    pause
    exit /b 1
)

echo.
echo [1/4] Starting Backend Server...
echo ========================================
start cmd /k "cd TravelIndia && npm start"
timeout /t 3

echo.
echo [2/4] Backend Server Started on port 5000
echo.
echo [3/4] Starting Frontend Dev Server...
echo ========================================
start cmd /k "cd TravelIndia-frontend && npm run dev"
timeout /t 3

echo.
echo [4/4] Frontend Server Starting on port 5173
echo.
echo ========================================
echo ✅ ALL SERVERS STARTED
echo ========================================
echo.
echo Backend:  https://travler-loop.onrender.com
echo Frontend: http://localhost:5173
echo.
echo Press any key to continue...
pause

echo.
echo Opening Frontend in Browser...
start http://localhost:5173

echo.
echo ✨ Travel-Project is Ready!
echo.
pause
