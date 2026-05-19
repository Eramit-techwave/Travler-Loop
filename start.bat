@echo off
REM Travel-Project Quick Start Script for Windows

echo ========================================
echo Travel-Project - Quick Start
echo ========================================
echo.

REM Check if both directories exist
if not exist "Travel-loop" (
    echo Error: Travel-loop directory not found!
    pause
    exit /b 1
)

if not exist "travel-loop-frontend" (
    echo Error: travel-loop-frontend directory not found!
    pause
    exit /b 1
)

echo.
echo [1/4] Starting Backend Server...
echo ========================================
start cmd /k "cd Travel-loop && npm start"
timeout /t 3

echo.
echo [2/4] Backend Server Started on port 5000
echo.
echo [3/4] Starting Frontend Dev Server...
echo ========================================
start cmd /k "cd travel-loop-frontend && npm run dev"
timeout /t 3

echo.
echo [4/4] Frontend Server Starting on port 5173
echo.
echo ========================================
echo ✅ ALL SERVERS STARTED
echo ========================================
echo.
echo Backend:  http://localhost:5000
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
