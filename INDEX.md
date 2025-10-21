# 📑 Documentation Index

Quick navigation for **InDecor DreamSpace** documentation.

---

## 🚀 Getting Started

Start here if you're new:

1. **[README.md](README.md)** - Project overview, tech stack, features
2. **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
3. **[SUMMARY.md](SUMMARY.md)** - What's been built (61 files)

---

## 📖 Core Documentation

### For Developers
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete file tree with explanations
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - All 16 API endpoints with examples
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute features

### For Users
- **[FEATURES.md](FEATURES.md)** - Feature list and roadmap
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to production (Render, Heroku, AWS)

---

## 🛠️ Setup & Installation

### Quick Commands
```bash
# Fastest setup (Linux/macOS)
make setup

# Or use scripts
./setup.sh              # Linux/macOS
.\setup.ps1             # Windows

# Manual setup
docker-compose up --build
docker-compose exec api python manage.py migrate
```

### Configuration
1. Copy `backend/env.example` to `backend/.env`
2. Add Cloudinary credentials
3. Run setup script

---

## 📚 Documentation by Topic

### 🏗️ Architecture
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - File organization
- [SUMMARY.md](SUMMARY.md) - Tech stack overview
- [README.md](README.md#tech-stack) - Technology choices

### 🔌 API
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Complete API reference
- [README.md](README.md#api-endpoints) - Endpoint summary

### 🎨 Frontend
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md#frontend) - React components
- [README.md](README.md#frontend-requirements) - Frontend architecture

### 🐍 Backend
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md#backend) - Django apps
- [README.md](README.md#backend-requirements) - Models and views
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Endpoints

### 🐳 Docker
- [README.md](README.md#infra) - Docker services
- [QUICKSTART.md](QUICKSTART.md#step-3-run-the-setup) - Setup with Docker
- [docker-compose.yml](docker-compose.yml) - Service configuration

### 🚀 Deployment
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide
- Platforms: Render, Heroku, AWS, DigitalOcean

### 🤝 Contributing
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [FEATURES.md](FEATURES.md#-how-to-contribute) - Priority areas

---

## 📂 File Reference

### Root Files
```
📄 README.md              - Main documentation
📄 QUICKSTART.md          - Setup guide
📄 API_DOCUMENTATION.md   - API reference
📄 PROJECT_STRUCTURE.md   - File tree
📄 FEATURES.md            - Features & roadmap
📄 CONTRIBUTING.md        - Dev guidelines
📄 DEPLOYMENT.md          - Production guide
📄 SUMMARY.md             - Project summary
📄 INDEX.md               - This file
📄 docker-compose.yml     - Docker config
📄 Makefile               - Make commands
📄 .gitignore             - Git ignore
```

### Setup Scripts
```
📜 setup.sh               - Linux/macOS setup
📜 setup.ps1              - Windows setup
```

### Backend
```
backend/
├── config/               - Django settings
│   ├── settings.py       - Main config
│   ├── celery.py         - Celery setup
│   └── urls.py           - URL routing
├── apps/
│   ├── users/            - Authentication
│   └── projects/         - Main app
│       ├── models.py     - Database models
│       ├── views.py      - API views
│       ├── serializers.py - DRF serializers
│       └── tasks.py      - Celery tasks
├── Dockerfile            - Backend image
├── requirements.txt      - Python deps
└── .gitignore
```

### Frontend
```
frontend/
├── src/
│   ├── pages/            - Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── ProjectEditor.tsx
│   ├── components/       - UI components
│   │   ├── Canvas/
│   │   ├── Panels/
│   │   └── Toolbar/
│   ├── api/client.ts     - API client
│   ├── store/useStore.ts - State management
│   └── types/index.ts    - TypeScript types
├── Dockerfile            - Frontend image
├── package.json          - NPM deps
└── vite.config.ts        - Vite config
```

---

## 🎯 Quick Links by Task

### I Want To...

**Setup the project**
→ [QUICKSTART.md](QUICKSTART.md)

**Understand the architecture**
→ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

**Use the API**
→ [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

**Add a feature**
→ [CONTRIBUTING.md](CONTRIBUTING.md)

**Deploy to production**
→ [DEPLOYMENT.md](DEPLOYMENT.md)

**See what's built**
→ [SUMMARY.md](SUMMARY.md)

**Check the roadmap**
→ [FEATURES.md](FEATURES.md)

**Integrate real AI**
→ [CONTRIBUTING.md](CONTRIBUTING.md#1-ai-integration)

**Add 3D visualization**
→ [FEATURES.md](FEATURES.md#-3d-visualization)

**Build furniture catalog**
→ [CONTRIBUTING.md](CONTRIBUTING.md#2-furniture-catalog)

---

## 🔧 Makefile Commands

```bash
make setup          # Initial setup
make build          # Build containers
make up             # Start services
make down           # Stop services
make logs           # View logs
make migrate        # Run migrations
make shell          # Django shell
make superuser      # Create admin user
make clean          # Remove all containers
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Execute commands
docker-compose exec api python manage.py <command>
docker-compose exec web npm run <command>
```

---

## 📊 Cheat Sheet

### Authentication Flow
```
1. POST /api/users/register/
2. POST /api/auth/token/ (login)
3. Store access + refresh tokens
4. Use Bearer token in headers
5. Refresh when access expires
```

### Project Workflow
```
1. Create project
2. Upload room image
3. Add items to canvas
4. Edit properties
5. Generate variant
6. Export design
```

### Development Workflow
```
1. Make code changes
2. Hot reload kicks in
3. Test in browser
4. Check logs if needed
5. Commit changes
```

---

## 📞 Getting Help

### In Order of Preference:

1. **Check the docs** - Most questions answered here
2. **Search the code** - Well-commented, easy to read
3. **Check logs** - `docker-compose logs -f`
4. **Open an issue** - GitHub issues for bugs/features
5. **Read the source** - Code is the ultimate documentation

---

## 🎓 Learning Path

If you're new to this stack:

1. **Week 1:** Set up the project, understand structure
2. **Week 2:** Read backend code (Django models, views)
3. **Week 3:** Read frontend code (React components, state)
4. **Week 4:** Make small changes, test features
5. **Month 2:** Add your first feature
6. **Month 3:** Integrate real AI

---

## 📝 Document Updates

This index was last updated: **October 2024**

All documentation is version-controlled with the code.

---

## 🎉 Ready to Build?

1. Start with **[QUICKSTART.md](QUICKSTART.md)**
2. Read **[README.md](README.md)** for overview
3. Dive into **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)**
4. Check **[FEATURES.md](FEATURES.md)** for ideas

**Happy coding! 🚀**

