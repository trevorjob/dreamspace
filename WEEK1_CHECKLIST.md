# ✅ Week 1 Checklist - 3D Migration

**Goal:** Replace 2D canvas with 3D room and prepare for furniture system

---

## Day 1: Environment Setup ☑️

### Morning: Get Docker Running
- [ ] Open new laptop
- [ ] Install Docker Desktop (if not installed)
- [ ] Navigate to project: `cd dreamspace`
- [ ] Start services: `docker-compose up -d`
- [ ] Verify frontend: http://localhost:5173
- [ ] Verify backend: http://localhost:8000
- [ ] Check logs: `docker-compose logs -f`

### Afternoon: Add Database Models
- [ ] Open `backend/apps/projects/models.py`
- [ ] Add `Vendor` model (see COPILOT_HANDOFF.md line 123)
- [ ] Add `FurnitureProduct` model (line 130)
- [ ] Add `RoomModel` model (line 150)
- [ ] Add `PlacedFurniture` model (line 164)
- [ ] Save file
- [ ] Run: `docker-compose exec api python manage.py makemigrations`
- [ ] Run: `docker-compose exec api python manage.py migrate`
- [ ] Verify: `docker-compose exec api python manage.py showmigrations`

**Success:** Should see new migration for projects app with 4 new tables

---

## Day 2: Install 3D Libraries ☑️

### Morning: Frontend Dependencies
- [ ] Open terminal in project root
- [ ] Navigate: `cd frontend`
- [ ] Install: `npm install three @react-three/fiber @react-three/drei`
- [ ] Install: `npm install leva` (for debugging)
- [ ] Verify: Check `package.json` has new dependencies
- [ ] Test: `npm run dev` should still work

### Afternoon: Download Test Models
- [ ] Go to https://sketchfab.com/
- [ ] Search "furniture low poly free"
- [ ] Download 3-5 GLTF models:
  - 1 sofa
  - 1 coffee table
  - 1 chair
  - 1 lamp
  - 1 rug
- [ ] Create folder: `frontend/public/models/`
- [ ] Extract GLTF files to this folder
- [ ] Verify files: should have `.gltf` or `.glb` extension

**Success:** Models folder exists with 3-5 furniture GLTF files

---

## Day 3: Create Basic 3D Room ☑️

### Morning: Create Scene Components
- [ ] Create folder: `frontend/src/components/Scene/`
- [ ] Create file: `RoomScene.tsx` in this folder
- [ ] Copy code from COPILOT_HANDOFF.md line 424
- [ ] Save file
- [ ] Check for TypeScript errors

### Afternoon: Wire Up to Editor
- [ ] Open `frontend/src/pages/ProjectEditor.tsx`
- [ ] Import: `import RoomScene from '../components/Scene/RoomScene'`
- [ ] Find where `<ThreeCanvas>` is used
- [ ] Replace `<ThreeCanvas>` with `<RoomScene>`
- [ ] Save file
- [ ] Open browser: http://localhost:5173
- [ ] Login and open a project
- [ ] **Should see:** 3D scene with floor grid and walls

**Success:** 3D room visible with camera controls (drag to orbit)

---

## Day 4: Add Furniture Loading ☑️

### Morning: Create Furniture Component
- [ ] Create file: `frontend/src/components/Scene/FurnitureModel.tsx`
- [ ] Add code:
```typescript
import { useGLTF } from '@react-three/drei'

export default function FurnitureModel({ modelUrl, position, rotation }) {
  const gltf = useGLTF(modelUrl)
  
  return (
    <primitive 
      object={gltf.scene.clone()} 
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  )
}
```
- [ ] Save file

### Afternoon: Test Loading One Model
- [ ] Open `RoomScene.tsx`
- [ ] Import FurnitureModel
- [ ] Add to scene:
```typescript
<FurnitureModel 
  modelUrl="/models/sofa.glb"
  position={[0, 0, 0]}
  rotation={[0, 0, 0]}
/>
```
- [ ] Save and check browser
- [ ] **Should see:** Sofa model in the scene

**Success:** One furniture model loads and displays in 3D

---

## Day 5: Add Admin Interface ☑️

### Morning: Django Admin Setup
- [ ] Open `backend/apps/projects/admin.py`
- [ ] Add imports:
```python
from .models import Vendor, FurnitureProduct, RoomModel, PlacedFurniture
```
- [ ] Register models:
```python
@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    search_fields = ['name']

@admin.register(FurnitureProduct)
class FurnitureProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'vendor', 'category', 'price', 'in_stock']
    list_filter = ['category', 'vendor', 'in_stock']
    search_fields = ['name', 'description']
```
- [ ] Save file

### Afternoon: Create Test Data
- [ ] Go to: http://localhost:8000/admin
- [ ] Login with superuser
- [ ] Add 1-2 test vendors
- [ ] Add 3-5 test furniture products
- [ ] Use your downloaded GLTF file URLs for `model_url`

**Success:** Can see and manage vendors/products in Django admin

---

## End of Week 1: Verify Everything ☑️

### Final Checklist
- [ ] Docker is running smoothly
- [ ] 4 new database tables exist
- [ ] Three.js and R3F are installed
- [ ] Basic 3D room renders
- [ ] Camera controls work (orbit, pan, zoom)
- [ ] At least 1 furniture model loads
- [ ] Django admin shows new models
- [ ] Test data exists in database

### Test the Full Flow
1. [ ] Start Docker
2. [ ] Open frontend: http://localhost:5173
3. [ ] Login
4. [ ] Create new project
5. [ ] Upload room image
6. [ ] See 3D room with your image as background
7. [ ] See test furniture model in scene
8. [ ] Orbit camera around the room

**If all ✅ → You're ready for Week 2!**

---

## Week 2 Preview (Don't Start Yet)

Week 2 will focus on:
- Building furniture catalog UI
- Drag & drop from catalog to scene
- Transform controls (move/rotate furniture)
- Properties panel integration

**For now, just get Week 1 done!**

---

## 🆘 Troubleshooting

### Docker won't start
```bash
# Check if Docker Desktop is running
docker --version

# Try rebuilding
docker-compose down
docker-compose up --build
```

### Migrations fail
```bash
# Reset migrations (CAREFUL - dev only!)
docker-compose exec api python manage.py migrate projects zero
docker-compose exec api python manage.py migrate
```

### 3D scene is black
- Check browser console for errors
- Verify GLTF file path is correct
- Try adding more lighting to scene

### Models don't load
- Check file path: should be `/models/yourfile.glb`
- Verify file is in `frontend/public/models/`
- Check browser network tab for 404 errors

---

## 📊 Progress Tracking

| Day | Task | Status | Time |
|-----|------|--------|------|
| 1 | Docker + DB Models | ⬜ | ___ hrs |
| 2 | Install 3D + Download Models | ⬜ | ___ hrs |
| 3 | Create 3D Room | ⬜ | ___ hrs |
| 4 | Load Furniture | ⬜ | ___ hrs |
| 5 | Admin Interface | ⬜ | ___ hrs |

**Estimated Total:** 15-20 hours

---

**Good luck! Check off items as you go. You got this! 🚀**

**Last updated:** November 8, 2025
