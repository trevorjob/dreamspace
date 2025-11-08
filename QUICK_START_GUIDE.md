# 🚀 Quick Start Guide for New Laptop

**Read `COPILOT_HANDOFF.md` for full context!**

---

## ⚡ FIRST 5 COMMANDS TO RUN

```bash
# 1. Navigate to project
cd dreamspace

# 2. Check Docker is running
docker --version

# 3. Start all services
docker-compose up -d

# 4. Check logs
docker-compose logs -f api

# 5. Open in browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# Admin:    http://localhost:8000/admin
```

---

## 🎯 WHERE WE ARE

**Status:** Pivoting from 2D Konva canvas → 3D React Three Fiber  
**Reason:** Need to support real 3D furniture models from local vendors  
**Current Code:** Working MVP with auth, projects, image upload  
**Next Step:** Add 3D room visualization + furniture catalog

---

## 📋 IMMEDIATE TODO LIST

### **Step 1: Add Database Models** (30 min)
```bash
# Add these models to backend/apps/projects/models.py:
- Vendor (furniture vendors)
- FurnitureProduct (3D models + metadata)
- RoomModel (3D room representation)
- PlacedFurniture (furniture in a design)

# Then run:
docker-compose exec api python manage.py makemigrations
docker-compose exec api python manage.py migrate
```

### **Step 2: Install 3D Libraries** (10 min)
```bash
cd frontend
npm install three @react-three/fiber @react-three/drei leva
```

### **Step 3: Create Basic 3D Room** (1 hour)
```bash
# Create: frontend/src/components/Scene/RoomScene.tsx
# Copy example code from COPILOT_HANDOFF.md line 424
```

### **Step 4: Test It Works** (15 min)
```bash
# Replace KonvaCanvas with RoomScene in ProjectEditor.tsx
# Should see: 3D room with floor and walls
```

---

## 🗂️ KEY FILES TO KNOW

```
backend/apps/projects/models.py    ← Add new models here
backend/apps/projects/views.py     ← Add furniture API endpoints
frontend/src/pages/ProjectEditor.tsx   ← Main editor page
frontend/src/components/Scene/         ← Create this folder for 3D
frontend/src/store/useSceneStore.ts    ← Update state for 3D
```

---

## 📦 RESOURCES NEEDED

1. **3D Models:** Download 10-20 free GLTF furniture from:
   - https://sketchfab.com/
   - https://poly.pizza/

2. **Docs:**
   - React Three Fiber: https://docs.pmnd.rs/react-three-fiber
   - Three.js: https://threejs.org/docs/

---

## 🆘 IF STUCK

1. Read `COPILOT_HANDOFF.md` in this folder
2. Check `README.md` for general project info
3. Look at `CURRENT_STATE.md` for what's implemented
4. Ask Copilot: "Read COPILOT_HANDOFF.md and help me with [specific task]"

---

## 🎯 SUCCESS CRITERIA FOR WEEK 1

- [ ] Docker running
- [ ] New database models added and migrated
- [ ] 3D libraries installed
- [ ] Basic 3D room rendering (floor + walls)
- [ ] One GLTF model loads in the scene

---

**Good luck! 🚀**

*Last updated: November 8, 2025*
