# Makefile for InDecor DreamSpace

.PHONY: help setup build up down logs migrate shell superuser clean

help:
	@echo "InDecor DreamSpace - Available Commands:"
	@echo ""
	@echo "  make setup       - Initial setup (build + migrate)"
	@echo "  make build       - Build Docker containers"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make logs        - View logs (all services)"
	@echo "  make migrate     - Run database migrations"
	@echo "  make shell       - Open Django shell"
	@echo "  make superuser   - Create Django superuser"
	@echo "  make clean       - Remove containers and volumes"
	@echo ""

setup:
	@echo "🎨 Setting up InDecor DreamSpace..."
	@if [ ! -f backend/.env ]; then \
		echo "📝 Creating backend/.env..."; \
		cp backend/.env.example backend/.env; \
		echo "⚠️  Edit backend/.env with your Cloudinary credentials!"; \
	fi
	docker-compose build
	docker-compose up -d
	@echo "⏳ Waiting for database..."
	@sleep 5
	docker-compose exec -T api python manage.py migrate
	@echo "✅ Setup complete! Visit http://localhost:5173"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "✅ Services started! Frontend: http://localhost:5173"

down:
	docker-compose down

logs:
	docker-compose logs -f

migrate:
	docker-compose exec api python manage.py migrate

makemigrations:
	docker-compose exec api python manage.py makemigrations

shell:
	docker-compose exec api python manage.py shell

superuser:
	docker-compose exec api python manage.py createsuperuser

clean:
	docker-compose down -v
	@echo "🧹 Cleaned up containers and volumes"

# Frontend commands
frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

# Backend commands
backend-shell:
	docker-compose exec api /bin/bash

worker-logs:
	docker-compose logs -f worker

db-shell:
	docker-compose exec db psql -U dreamspace_user -d dreamspace

