# InDecor DreamSpace 🎨

**A "Figma for interior decorators"** - A web application where designers can upload room photos, edit them in a canvas (drag/drop, resize, swap items, recolor), and generate/share design variants.

> **🚨 IMPORTANT:** Architecture is being migrated from 2D Konva to 3D React Three Fiber.  
> **📖 New to this project?** Start with **[HANDOFF_README.md](HANDOFF_README.md)**  
> **💻 Setting up on new laptop?** Read **[START_HERE.md](START_HERE.md)**

---

> **MVP Focus (LEGACY):** 2D canvas editor with extensible architecture for future 3D integration.  
> **NEW FOCUS:** True 3D room visualization with real furniture models from local vendors.

---

## 🏗️ Tech Stack

### Frontend
- **React** + **TypeScript** - Type-safe UI components
- **TailwindCSS** - Modern, responsive styling
- **Zustand** - Lightweight state management
- **Konva.js** - High-performance 2D canvas with drag/drop layers
- **React Router** - Client-side routing
- **Axios** - API client with JWT authentication

### Backend
- **Django** + **Django REST Framework** - Robust API backend
- **PostgreSQL** - Relational database
- **Cloudinary** - Cloud-based image/media storage
- **Celery** + **Redis** - Async task queue for AI operations
- **JWT (simplejwt)** - Token-based authentication

### Infrastructure
- **Docker** + **docker-compose** - Containerized development environment
- **Vite** - Fast frontend build tool

---

## 🚀 Quick Start

### Prerequisites
- **Docker** and **docker-compose** installed
- **Cloudinary account** (free tier works fine)
  - Sign up at [cloudinary.com](https://cloudinary.com/)
  - Get your Cloud Name, API Key, and API Secret

### 1. Clone & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd dreamspace

# Configure backend environment
cd backend
cp .env.example .env
# Edit .env and add your Cloudinary credentials:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
cd ..
```

### 2. Run with Docker

```bash
# Build and start all services
docker-compose up --build

# In a separate terminal, run migrations
docker-compose exec api python manage.py migrate

# Create a superuser (optional, for Django admin)
docker-compose exec api python manage.py createsuperuser
```

### 3. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Django Admin:** http://localhost:8000/admin

---

## 📁 Project Structure

```
dreamspace/
├── backend/                    # Django API
│   ├── apps/
│   │   ├── projects/          # Project models, views, serializers
│   │   │   ├── models.py      # Project, DesignVariant, ItemInstance, etc.
│   │   │   ├── views.py       # API endpoints
│   │   │   ├── serializers.py # DRF serializers
│   │   │   └── tasks.py       # Celery async tasks
│   │   └── users/             # User authentication
│   ├── config/                # Django settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── celery.py          # Celery configuration
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                   # React app
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts      # API client with JWT interceptors
│   │   ├── components/
│   │   │   ├── Canvas/        # Konva canvas components
│   │   │   ├── Panels/        # Upload & right panels
│   │   │   └── Toolbar/       # Editor toolbar
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ProjectEditor.tsx
│   │   ├── store/
│   │   │   └── useStore.ts    # Zustand stores
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml          # Orchestrates all services
```

---

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/token/          - Login (get JWT tokens)
POST /api/auth/token/refresh/  - Refresh access token
POST /api/users/register/      - Register new user
GET  /api/users/profile/       - Get current user profile
PUT  /api/users/profile/       - Update user profile
```

### Projects
```
GET    /api/projects/                    - List all user's projects
POST   /api/projects/                    - Create new project
GET    /api/projects/{id}/               - Get project details
PUT    /api/projects/{id}/               - Update project
DELETE /api/projects/{id}/               - Delete project
POST   /api/projects/{id}/upload/        - Upload image to project
POST   /api/projects/{id}/generate/      - Generate AI variant (Celery task)
GET    /api/projects/{id}/variants/      - List design variants
GET    /api/projects/{id}/versions/      - List version history
```

### Variants
```
POST   /api/projects/variants/{id}/items/ - Add item to variant
PATCH  /api/projects/items/{id}/          - Update item instance
DELETE /api/projects/items/{id}/          - Delete item instance
```

---

## 🎨 Features

### ✅ Implemented (MVP)
- [x] User authentication (JWT)
- [x] Project creation and management
- [x] Image upload to Cloudinary
- [x] 2D canvas with Konva.js
- [x] Drag & drop items on canvas
- [x] Resize and transform items
- [x] Item selection and property editing
- [x] Undo/Redo functionality
- [x] Design variant generation (stub)
- [x] Celery async task queue
- [x] Dockerized environment

### 🚧 Coming Soon
- [ ] Real AI integration (Stable Diffusion, ControlNet)
- [ ] Object detection and segmentation
- [ ] Image-to-image style transfer
- [ ] Furniture catalog with alternatives
- [ ] 3D room visualization
- [ ] Collaborative editing
- [ ] Export to PDF/PNG
- [ ] Social sharing

---

## 🧪 Development

### Running Individual Services

```bash
# Frontend only (requires backend running)
cd frontend
npm install
npm run dev

# Backend only
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver

# Celery worker
celery -A config worker --loglevel=info

# Redis (if not using Docker)
redis-server
```

### Database Migrations

```bash
# Create migrations after model changes
docker-compose exec api python manage.py makemigrations

# Apply migrations
docker-compose exec api python manage.py migrate
```

### Accessing Django Shell

```bash
docker-compose exec api python manage.py shell
```

---

## 🤖 AI Integration (Stub → Production)

The current implementation includes a **stub AI generation** in `backend/apps/projects/tasks.py`. To integrate real AI:

### Option 1: Stable Diffusion API
```python
# In tasks.py
from openai import OpenAI  # or use replicate, etc.

def generate_variant(project_id, prompt):
    # 1. Download base image from Cloudinary
    # 2. Call AI API
    response = openai_client.images.edit(
        image=base_image,
        prompt=prompt,
        n=1,
        size="1024x1024"
    )
    # 3. Upload result to Cloudinary
    # 4. Create DesignVariant record
```

### Option 2: ControlNet for Room Redesign
```python
# Use ControlNet to preserve room structure
from diffusers import ControlNetModel, StableDiffusionControlNetPipeline

# Load room image, detect edges
# Generate with prompt while preserving structure
```

### Option 3: Segment Anything (SAM) for Object Extraction
```python
from segment_anything import sam_model_registry, SamPredictor

# Extract furniture items as masks
# Store as ItemInstance with bbox and mask_url
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,api

# Database
DATABASE_URL=postgresql://dreamspace_user:dreamspace_pass@db:5432/dreamspace

# Redis & Celery
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0

# Cloudinary (REQUIRED)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| **web** | 5173 | React frontend (Vite dev server) |
| **api** | 8000 | Django backend |
| **db** | 5432 | PostgreSQL database |
| **redis** | 6379 | Redis for Celery |
| **worker** | - | Celery worker (async tasks) |

---

## 📝 Notes

### Cloudinary Setup
1. The app uses Cloudinary for image storage (no local file uploads)
2. Images are organized in folders: `dreamspace/projects/{project_id}/`
3. Free tier: 25 GB storage, 25 GB bandwidth/month

### Celery Tasks
- Tasks run asynchronously in the `worker` container
- Check worker logs: `docker-compose logs -f worker`
- Task status can be tracked via Celery result backend (Redis)

### Canvas State
- Canvas items are stored in Zustand (frontend state)
- Use "Generate Variant" to persist to backend as DesignVariant
- Undo/Redo uses local history stack (not persisted)

### Database Models
```
Project
  ├── ProjectImage (uploaded images)
  ├── DesignVariant (AI-generated variants)
  │   └── ItemInstance (furniture/decor items)
  └── Version (snapshots for undo/redo)
```

---

## 🚢 Deployment

### Option 1: Render
```bash
# Deploy backend to Render (Web Service)
# Deploy frontend to Render (Static Site)
# Use Render PostgreSQL add-on
# Use Render Redis add-on
```

### Option 2: Heroku
```bash
# Add Procfile for Django + Celery
# Use Heroku Postgres add-on
# Use Heroku Redis add-on
```

### Option 3: AWS
```bash
# ECS for containers
# RDS for PostgreSQL
# ElastiCache for Redis
# S3 + CloudFront (or continue with Cloudinary)
```

---

## 🤝 Contributing

This is an MVP boilerplate. To extend:

1. **Add real AI models** - Replace stub in `tasks.py`
2. **Build furniture catalog** - Add Furniture model with alternatives
3. **Implement 3D view** - Use Three.js or Babylon.js
4. **Add collaboration** - WebSockets for real-time editing
5. **Social features** - Project sharing, comments, likes

---

## 📄 License

MIT License - feel free to use for your own projects!

---

## 🙋 Support

For questions or issues:
1. Check Docker logs: `docker-compose logs`
2. Verify Cloudinary credentials in `.env`
3. Ensure all containers are running: `docker-compose ps`

---

**Built with ❤️ for interior designers everywhere!**

