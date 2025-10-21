# 📁 Project Structure

Complete file tree for **InDecor DreamSpace**.

```
dreamspace/
│
├── 📄 README.md                        # Main documentation
├── 📄 QUICKSTART.md                    # Quick start guide
├── 📄 CONTRIBUTING.md                  # Contribution guidelines
├── 📄 PROJECT_STRUCTURE.md             # This file
├── 📄 docker-compose.yml               # Docker orchestration
├── 📄 .gitignore                       # Git ignore rules
├── 📄 Makefile                         # Make commands
├── 📄 setup.sh                         # Setup script (Linux/macOS)
└── 📄 setup.ps1                        # Setup script (Windows)
│
├── 🐍 backend/                         # Django Backend
│   ├── 📄 Dockerfile                   # Backend Docker image
│   ├── 📄 .dockerignore               # Docker ignore
│   ├── 📄 .gitignore                  # Git ignore
│   ├── 📄 requirements.txt            # Python dependencies
│   ├── 📄 .env.example                # Environment template
│   ├── 📄 .env                        # Environment variables (create from example)
│   ├── 📄 manage.py                   # Django CLI
│   │
│   ├── ⚙️ config/                      # Django Configuration
│   │   ├── __init__.py
│   │   ├── settings.py                # Django settings
│   │   ├── urls.py                    # Root URL config
│   │   ├── wsgi.py                    # WSGI entry point
│   │   ├── asgi.py                    # ASGI entry point
│   │   └── celery.py                  # Celery configuration
│   │
│   └── 📦 apps/                        # Django Apps
│       │
│       ├── 👤 users/                   # User Management
│       │   ├── __init__.py
│       │   ├── models.py              # User models (using default)
│       │   ├── views.py               # Auth views (register, profile)
│       │   ├── serializers.py         # User serializers
│       │   ├── urls.py                # User routes
│       │   └── admin.py               # Admin interface
│       │
│       └── 🎨 projects/                # Project Management
│           ├── __init__.py
│           ├── models.py              # Project, DesignVariant, ItemInstance, Version
│           ├── views.py               # Project API views
│           ├── serializers.py         # DRF serializers
│           ├── urls.py                # Project routes
│           ├── admin.py               # Admin interface
│           └── tasks.py               # Celery async tasks (AI stub)
│
├── ⚛️ frontend/                        # React Frontend
│   ├── 📄 Dockerfile                   # Frontend Docker image
│   ├── 📄 .dockerignore               # Docker ignore
│   ├── 📄 .gitignore                  # Git ignore
│   ├── 📄 package.json                # NPM dependencies
│   ├── 📄 tsconfig.json               # TypeScript config
│   ├── 📄 tsconfig.node.json          # Node TypeScript config
│   ├── 📄 vite.config.ts              # Vite build config
│   ├── 📄 tailwind.config.js          # Tailwind CSS config
│   ├── 📄 postcss.config.js           # PostCSS config
│   ├── 📄 .eslintrc.cjs               # ESLint config
│   ├── 📄 index.html                  # HTML entry point
│   │
│   ├── 🎨 public/                      # Static Assets
│   │   └── vite.svg                   # Vite logo
│   │
│   └── 📦 src/                         # Source Code
│       ├── 📄 main.tsx                # React entry point
│       ├── 📄 App.tsx                 # App component with routing
│       ├── 📄 index.css               # Global styles
│       │
│       ├── 🔌 api/                     # API Client
│       │   └── client.ts              # Axios instance with JWT interceptors
│       │
│       ├── 🧩 components/              # React Components
│       │   │
│       │   ├── Canvas/                # Konva Canvas
│       │   │   └── KonvaCanvas.tsx    # Main canvas with drag/drop
│       │   │
│       │   ├── Panels/                # Side Panels
│       │   │   ├── UploadPanel.tsx    # Left upload panel
│       │   │   └── RightPanel.tsx     # Right details panel
│       │   │
│       │   └── Toolbar/               # Toolbar
│       │       └── EditorToolbar.tsx  # Top editor toolbar
│       │
│       ├── 📄 pages/                   # Page Components
│       │   ├── Login.tsx              # Login page
│       │   ├── Register.tsx           # Registration page
│       │   ├── Dashboard.tsx          # Projects dashboard
│       │   └── ProjectEditor.tsx      # Main editor workspace
│       │
│       ├── 💾 store/                   # State Management
│       │   └── useStore.ts            # Zustand stores (auth, projects, canvas, variants)
│       │
│       └── 📋 types/                   # TypeScript Types
│           └── index.ts               # Type definitions
│
└── 🐳 Docker Services (via docker-compose)
    ├── web        → Frontend (React + Vite)      Port 5173
    ├── api        → Backend (Django)             Port 8000
    ├── db         → PostgreSQL Database          Port 5432
    ├── redis      → Redis (Celery broker)        Port 6379
    └── worker     → Celery Worker (Async tasks)  No port
```

---

## Key Files Explained

### Backend

| File | Purpose |
|------|---------|
| `backend/config/settings.py` | Django settings (DB, apps, middleware, JWT, Celery) |
| `backend/config/celery.py` | Celery configuration for async tasks |
| `backend/apps/projects/models.py` | Database models (Project, DesignVariant, etc.) |
| `backend/apps/projects/views.py` | API endpoints (CRUD, upload, generate) |
| `backend/apps/projects/tasks.py` | Celery tasks (AI generation stub) |
| `backend/apps/users/views.py` | Auth endpoints (register, login, profile) |

### Frontend

| File | Purpose |
|------|---------|
| `frontend/src/App.tsx` | Main app with routing and auth guards |
| `frontend/src/api/client.ts` | Axios client with JWT token handling |
| `frontend/src/store/useStore.ts` | Zustand state stores (auth, canvas, projects) |
| `frontend/src/pages/ProjectEditor.tsx` | Main editor workspace |
| `frontend/src/components/Canvas/KonvaCanvas.tsx` | Konva.js canvas with drag/drop |

### Infrastructure

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Defines all services (web, api, db, redis, worker) |
| `backend/Dockerfile` | Backend Docker image |
| `frontend/Dockerfile` | Frontend Docker image |
| `Makefile` | Convenience commands (setup, build, up, down, etc.) |

---

## Data Flow

```
User
  ↓
React Frontend (Vite)
  ↓ (Axios with JWT)
Django REST API
  ↓ (Celery tasks)
Redis + Celery Worker
  ↓ (Cloudinary)
Image Upload/Generation
  ↓
PostgreSQL Database
```

---

## State Management

### Frontend (Zustand)
- **AuthStore:** User authentication, tokens
- **ProjectStore:** Projects list, current project
- **CanvasStore:** Canvas items, selection, history (undo/redo)
- **VariantsStore:** Design variants

### Backend (Django ORM)
- **Project:** Top-level project container
- **ProjectImage:** Uploaded images
- **DesignVariant:** AI-generated variants
- **ItemInstance:** Individual canvas items with transforms
- **Version:** Project version history

---

## Routes

### Frontend Routes
```
/                   → Redirect to /login or /dashboard
/login              → Login page
/register           → Registration page
/dashboard          → Projects list
/project/:id        → Project editor (protected)
```

### Backend Routes
```
/api/auth/token/                    → POST: Login (JWT)
/api/users/register/                → POST: Register
/api/users/profile/                 → GET/PUT: User profile
/api/projects/                      → GET/POST: List/Create projects
/api/projects/{id}/                 → GET/PUT/DELETE: Project details
/api/projects/{id}/upload/          → POST: Upload image
/api/projects/{id}/generate/        → POST: Generate variant (Celery)
/api/projects/{id}/variants/        → GET: List variants
/api/projects/variants/{id}/items/  → POST: Add item to variant
/api/projects/items/{id}/           → PATCH/DELETE: Update/Delete item
```

---

## Environment Variables

### Backend (`.env`)
```
SECRET_KEY          → Django secret key
DEBUG               → Debug mode (True/False)
ALLOWED_HOSTS       → Comma-separated hosts
DATABASE_URL        → PostgreSQL connection string
REDIS_URL           → Redis connection string
CLOUDINARY_*        → Cloudinary credentials
CORS_ALLOWED_ORIGINS → CORS whitelist
```

### Frontend (Vite)
```
VITE_API_URL        → Backend API URL (default: http://localhost:8000)
```

---

## Development Workflow

1. **Make changes** to code
2. **Hot reload** automatically kicks in (Vite + Django runserver)
3. **Test** in browser
4. **Check logs:** `docker-compose logs -f`
5. **Migrate DB:** `make migrate` (if models changed)
6. **Commit** changes

---

## Production Considerations

- Set `DEBUG=False` in Django
- Use production WSGI server (Gunicorn)
- Use production DB (managed PostgreSQL)
- Set up HTTPS (nginx, Cloudflare, etc.)
- Use environment secrets (not `.env` files)
- Enable CORS only for production domain
- Set up monitoring (Sentry, etc.)

---

**Need help?** Check the [README.md](README.md) or [CONTRIBUTING.md](CONTRIBUTING.md)!

