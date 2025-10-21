# Contributing to InDecor DreamSpace

Thank you for your interest in contributing! This MVP is designed to be extensible.

## 🎯 Priority Areas for Contribution

### 1. AI Integration
The current implementation has a stub AI generator. We need:
- **Real image generation** using Stable Diffusion, DALL-E, or Midjourney API
- **Style transfer** for room redesign
- **Object detection** (YOLO, SAM) for furniture segmentation
- **ControlNet** integration for structure-preserving generation

See: `backend/apps/projects/tasks.py` → `generate_variant()`

### 2. Furniture Catalog
Build a furniture database with:
- Categories (sofa, table, lamp, etc.)
- Multiple product variants
- Product images and metadata
- API for alternatives/recommendations

### 3. 3D Visualization
- Integrate Three.js or Babylon.js
- Convert 2D canvas to 3D scene
- Camera controls and perspective views

### 4. Real-time Collaboration
- WebSocket integration (Django Channels)
- Multi-user editing
- Live cursors and updates

### 5. Export & Sharing
- Export canvas to PDF/PNG
- Generate shareable links
- Social media integration

## 🛠️ Development Setup

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/dreamspace.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make changes and test
make setup
make up

# 5. Commit with clear messages
git commit -m "feat: add furniture catalog API"

# 6. Push and create PR
git push origin feature/your-feature-name
```

## 📝 Code Style

### Backend (Python)
- Follow PEP 8
- Use type hints where possible
- Add docstrings to functions/classes
- Run `black` for formatting

### Frontend (TypeScript)
- Use TypeScript strictly
- Follow React best practices
- Component names in PascalCase
- Hooks in camelCase with `use` prefix

## 🧪 Testing

```bash
# Backend tests
docker-compose exec api python manage.py test

# Frontend tests
cd frontend
npm run test
```

## 📚 Documentation

- Update README.md for new features
- Add inline comments for complex logic
- Document API changes in docstrings

## 🐛 Reporting Bugs

Open an issue with:
1. Steps to reproduce
2. Expected vs actual behavior
3. Environment (OS, Docker version)
4. Relevant logs

## 💡 Suggesting Features

Open an issue labeled "enhancement" with:
1. Use case description
2. Proposed implementation
3. UI/UX mockups (if applicable)

## 🔄 Pull Request Process

1. Ensure Docker build passes
2. Update documentation
3. Add tests for new features
4. Request review from maintainers
5. Address feedback

## 📄 License

By contributing, you agree to license your work under the MIT License.

---

**Questions?** Open a discussion or reach out to maintainers!

