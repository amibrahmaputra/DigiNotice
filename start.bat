@echo off
echo Starting DigiNotice Application...

REM Kill any existing Node processes
taskkill /F /IM node.exe > nul 2>&1

REM NOTE: Database is NOT deleted to preserve notices and user data
REM If you need to reset data, manually delete: server\data\noticeboard.sqlite

REM Start the backend server
start cmd /k "cd server && npm install && npm start"

REM Wait for 5 seconds to let the backend start
timeout /t 5 /nobreak

REM Start the frontend server
start cmd /k "cd frontend && npm install && npm run dev"

echo System is starting...
echo Please wait a moment, then open: http://localhost:5173
echo.
echo Use these simple login credentials:
echo.
echo Admin:    username: 111    password: 111
echo Teacher:  username: 222    password: 222
echo Student:  username: 333    password: 333
echo.
echo DO NOT CLOSE THIS WINDOW