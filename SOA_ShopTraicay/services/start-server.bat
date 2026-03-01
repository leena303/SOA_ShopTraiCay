@echo off
REM Script khởi động server cho Windows
REM Sử dụng: start-server.bat

echo 🔍 Đang kiểm tra port 3000...

REM Tìm và dừng process đang dùng port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo 🛑 Đang dừng process PID: %%a
    taskkill /PID %%a /F >nul 2>&1
    timeout /t 1 /nobreak >nul
)

echo.
echo 🚀 Đang khởi động server...
echo ─────────────────────────────────────
echo.

node server.js

pause

