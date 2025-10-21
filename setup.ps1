# Quick setup script for InDecor DreamSpace (Windows PowerShell)

Write-Host "Setting up InDecor DreamSpace..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info 2>&1 | Out-Null
}
catch {
    Write-Host "ERROR: Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Create backend .env if it doesn't exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating backend\.env from example..." -ForegroundColor Yellow
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "WARNING: Please edit backend\.env and add your Cloudinary credentials!" -ForegroundColor Yellow
    Write-Host ""
}

# Build and start containers
Write-Host "Building Docker containers..." -ForegroundColor Cyan
docker-compose build

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan
docker-compose up -d

Write-Host ""
Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Cyan
docker-compose exec -T api python manage.py migrate

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173"
Write-Host "   Backend:  http://localhost:8000"
Write-Host "   Admin:    http://localhost:8000/admin"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Edit backend\.env with your Cloudinary credentials"
Write-Host "   2. Create a superuser: docker-compose exec api python manage.py createsuperuser"
Write-Host "   3. Visit http://localhost:5173 and register an account"
Write-Host ""
Write-Host "View logs: docker-compose logs -f" -ForegroundColor Cyan
Write-Host "Stop services: docker-compose down" -ForegroundColor Cyan
