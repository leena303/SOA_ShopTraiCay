# Script khởi động server và tự động xử lý lỗi port đã được sử dụng
# Sử dụng: .\start-server.ps1

Write-Host "🔍 Đang kiểm tra port 3000..." -ForegroundColor Yellow

# Tìm process đang dùng port 3000
$portProcess = netstat -ano | findstr :3000 | findstr LISTENING

if ($portProcess) {
    Write-Host "⚠️  Port 3000 đang được sử dụng!" -ForegroundColor Red
    
    # Lấy PID từ kết quả
    $pid = ($portProcess -split '\s+')[-1]
    
    if ($pid -and $pid -ne "0") {
        Write-Host "🛑 Đang dừng process PID: $pid..." -ForegroundColor Yellow
        taskkill /PID $pid /F 2>$null
        Start-Sleep -Seconds 1
        Write-Host "✅ Đã dừng process" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Port 3000 đang trống" -ForegroundColor Green
}

Write-Host "`n🚀 Đang khởi động server..." -ForegroundColor Cyan
Write-Host "─────────────────────────────────────`n" -ForegroundColor Gray

# Khởi động server
node server.js

