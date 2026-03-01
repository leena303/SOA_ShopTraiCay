@echo off
REM Script Batch để chạy tất cả services cho Bài thực hành số 6
REM Chạy: start-all-services.bat

echo.
echo ========================================
echo   KHOI DONG TAT CA SERVICES
echo   Bai thuc hanh so 6
echo ========================================
echo.

REM Kiểm tra và dừng port nếu đang sử dụng
echo [1/4] Kiem tra port...
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo Port 3000 dang su dung. Dang dung...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
    timeout /t 2 /nobreak >nul
)

netstat -ano | findstr :3001 >nul
if %errorlevel% == 0 (
    echo Port 3001 dang su dung. Dang dung...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1
    timeout /t 2 /nobreak >nul
)

netstat -ano | findstr :3002 >nul
if %errorlevel% == 0 (
    echo Port 3002 dang su dung. Dang dung...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do taskkill /PID %%a /F >nul 2>&1
    timeout /t 2 /nobreak >nul
)

netstat -ano | findstr :3003 >nul
if %errorlevel% == 0 (
    echo Port 3003 dang su dung. Dang dung...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3003') do taskkill /PID %%a /F >nul 2>&1
    timeout /t 2 /nobreak >nul
)

echo.
echo [2/4] Khoi dong Auth Service (port 3000)...
start "Auth Service - Port 3000" cmd /k "cd /d %~dp0 && node server.js"

timeout /t 2 /nobreak >nul

echo [3/4] Khoi dong Product Service (port 3001)...
start "Product Service - Port 3001" cmd /k "cd /d %~dp0\product-service && node server-standalone.js"

timeout /t 2 /nobreak >nul

echo [4/4] Khoi dong Order Service (port 3002)...
start "Order Service - Port 3002" cmd /k "cd /d %~dp0\order-service && node server-standalone.js"

timeout /t 2 /nobreak >nul

echo [5/5] Khoi dong Reporting Service (port 3003)...
start "Reporting Service - Port 3003" cmd /k "cd /d %~dp0\reporting-service && node server-standalone.js"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   TAT CA SERVICES DA KHOI DONG!
echo ========================================
echo.
echo Danh sach services:
echo   Auth Service:      http://localhost:3000
echo   Product Service:   http://localhost:3001
echo   Order Service:     http://localhost:3002
echo   Reporting Service: http://localhost:3003
echo.
echo Test voi Postman:
echo   Import file: POSTMAN_COLLECTION_BTH6.json
echo.
echo Luu y: Dong tat ca cua so CMD de dung services
echo.
pause

