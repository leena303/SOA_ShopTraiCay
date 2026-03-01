# Script PowerShell để chạy tất cả services cho Bài thực hành số 6
# Chạy: .\start-all-services.ps1

Write-Host "🚀 Bắt đầu khởi động tất cả services..." -ForegroundColor Green
Write-Host ""

# Kiểm tra port đang sử dụng
function CheckPort {
    param($port)
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "⚠️  Port $port đang được sử dụng. Đang dừng process..." -ForegroundColor Yellow
        $processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
        if ($processId) {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
        }
    }
}

# Dừng các port nếu đang chạy
Write-Host "📋 Kiểm tra và dừng các port đang sử dụng..." -ForegroundColor Cyan
CheckPort 3000
CheckPort 3001
CheckPort 3002
CheckPort 3003

Write-Host ""
Write-Host "✅ Đã dọn dẹp port" -ForegroundColor Green
Write-Host ""

# Thay đổi thư mục
Set-Location $PSScriptRoot

# Khởi động Auth Service (port 3000)
Write-Host "🔐 Khởi động Auth Service (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '🔐 Auth Service - Port 3000' -ForegroundColor Green; node server.js" -WindowStyle Normal

Start-Sleep -Seconds 2

# Khởi động Product Service (port 3001)
Write-Host "📦 Khởi động Product Service (port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\product-service'; Write-Host '📦 Product Service - Port 3001' -ForegroundColor Green; node server-standalone.js" -WindowStyle Normal

Start-Sleep -Seconds 2

# Khởi động Order Service (port 3002)
Write-Host "🛒 Khởi động Order Service (port 3002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\order-service'; Write-Host '🛒 Order Service - Port 3002' -ForegroundColor Green; node server-standalone.js" -WindowStyle Normal

Start-Sleep -Seconds 2

# Khởi động Reporting Service (port 3003)
Write-Host "📊 Khởi động Reporting Service (port 3003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\reporting-service'; Write-Host '📊 Reporting Service - Port 3003' -ForegroundColor Green; node server-standalone.js" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ Tất cả services đã được khởi động!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Danh sách services:" -ForegroundColor Cyan
Write-Host "   🔐 Auth Service:      http://localhost:3000" -ForegroundColor White
Write-Host "   📦 Product Service:   http://localhost:3001" -ForegroundColor White
Write-Host "   🛒 Order Service:     http://localhost:3002" -ForegroundColor White
Write-Host "   📊 Reporting Service: http://localhost:3003" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Test với Postman:" -ForegroundColor Cyan
Write-Host "   Import file: POSTMAN_COLLECTION_BTH6.json" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Lưu ý: Đóng tất cả cửa sổ PowerShell để dừng services" -ForegroundColor Yellow

