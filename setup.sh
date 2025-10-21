#!/bin/bash
# Quick setup script for InDecor DreamSpace

echo "🎨 Setting up InDecor DreamSpace..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env from example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your Cloudinary credentials!"
    echo ""
fi

# Build and start containers
echo "🐳 Building Docker containers..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

echo ""
echo "📊 Running database migrations..."
docker-compose exec -T api python manage.py migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   Admin:    http://localhost:8000/admin"
echo ""
echo "📝 Next steps:"
echo "   1. Edit backend/.env with your Cloudinary credentials"
echo "   2. Create a superuser: docker-compose exec api python manage.py createsuperuser"
echo "   3. Visit http://localhost:5173 and register an account"
echo ""
echo "📖 View logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"

