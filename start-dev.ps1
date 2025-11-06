# Digital Job Connection - Development Startup Script
# Windows PowerShell version

Write-Host "🚀 Starting Digital Job Connection Development Environment" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the application, open TWO terminal windows:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - Backend Server:" -ForegroundColor Yellow
Write-Host "  npm run server" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Frontend Dev Server:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Or run both together:" -ForegroundColor Yellow
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Then visit: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
