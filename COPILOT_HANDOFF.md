# 🤝 Copilot Handoff Document
**Date:** November 8, 2025  
**Project:** DreamSpace - Interior Design Tool  
**Status:** Architecture Pivot in Progress

---

## 🎯 PROJECT OVERVIEW

**What This Is:**
A professional interior design tool for designers to create room visualizations using **real furniture from local vendors**. Think: Figma/Blender for interior decorators + furniture marketplace.

**Business Model:**
- Designers use the tool to create room designs
- They place actual furniture from local vendor catalogs
- Vendors get leads/sales from the designs
- Revenue from vendor listing fees or commission

---

## 🔄 CRITICAL CONTEXT: WE'RE CHANGING DIRECTION

### **Original Approach (What's Currently Built)**
- 2D Konva.js canvas with rectangles/blocks
- Trying to fake 3D by positioning at different Y/X/Z
- **PROBLEM:** Doesn't work when you need actual 3D furniture models
- **PROBLEM:** Only looks right from one specific angle

### **NEW Approach (Where We're Going)**
**"Hybrid 2.5D with Real-Time 3D Preview"**

The designer identified the core issue:
> "What about when I want to add the actual furniture? I don't know how that'll work"

So we're pivoting to a true 3D approach with real furniture models.

---

## 💡 THE NEW ARCHITECTURE

### **How It Will Work:**

**Phase 1: Room Setup**
1. Designer uploads room photo
2. AI detects room dimensions & perspective
3. System creates simple 3D box model of room
4. Background photo mapped as texture on back wall

**Phase 2: Furniture Placement**
1. Designer browses vendor furniture catalog
2. Drags furniture (GLTF 3D models) onto canvas
3. Furniture appears at floor level in 3D space
4. Designer moves X/Y (floor position) and rotates
5. AI suggests optimal positions

**Phase 3: Viewing**
1. Photo match view (from original photo angle)
2. Free 3D view (orbit camera around room)
3. Top-down view (floor plan)
4. Export high-res renders from any angle

---

## 🏗️ NEW TECH STACK

### **Backend (Mostly Keep Current)**
```
✅ Django + DRF              (Keep)
✅ PostgreSQL                (Keep)
✅ Cloudinary                (Keep)
✅ Celery + Redis            (Keep)

🆕 ADD:
├─ Depth estimation API      (Convert photo to depth map)
└─ Room layout detection     (Find walls/floor/ceiling)
```

### **Frontend (Major Changes)**
```
✅ React + TypeScript        (Keep)
✅ TailwindCSS              (Keep)
✅ Zustand                  (Keep)

❌ REPLACE Konva.js with:
├─ React Three Fiber         (3D rendering)
├─ @react-three/drei         (Already installed!)
├─ @react-three/postprocessing (Already installed!)
└─ Three.js                  (Core 3D engine)

⚠️ Konva.js (Keep as optional 2D fallback)
```

---

## 🗄️ NEW DATABASE MODELS TO ADD

```python
# backend/apps/projects/models.py

class Vendor(models.Model):
    """Local furniture vendors"""
    name = models.CharField(max_length=255)
    contact_email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    website = models.URLField(blank=True)
    logo_url = models.URLField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class FurnitureProduct(models.Model):
    """Actual furniture from vendors"""
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)  # sofa, table, chair, etc.
    style = models.CharField(max_length=100)  # modern, rustic, industrial
    
    # Visuals
    model_url = models.URLField()  # GLTF 3D model (PRIMARY!)
    thumbnail_url = models.URLField()  # Product photo
    images = models.JSONField(default=list)  # Multiple photos
    
    # Physical properties
    dimensions = models.JSONField()  # {width, height, depth} in cm
    color_options = models.JSONField(default=list)
    material = models.CharField(max_length=100)
    
    # Business
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    in_stock = models.BooleanField(default=True)
    lead_time_days = models.IntegerField(default=14)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class RoomModel(models.Model):
    """3D representation of a room"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    
    # Room geometry (derived from photo)
    dimensions = models.JSONField()  # {width, length, height} in meters
    floor_plan = models.JSONField()  # Wall coordinates
    perspective_data = models.JSONField()  # Vanishing points, camera params
    depth_map_url = models.URLField(blank=True)
    
    # 3D scene data
    camera_position = models.JSONField()  # Camera X,Y,Z
    camera_rotation = models.JSONField()  # Camera angles
    lighting = models.JSONField(default=dict)

class PlacedFurniture(models.Model):
    """Furniture placed in a design"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='placed_furniture')
    product = models.ForeignKey(FurnitureProduct, on_delete=models.CASCADE)
    
    # 3D Transform
    position = models.JSONField()  # {x, y, z}
    rotation = models.JSONField()  # {x, y, z} in degrees
    scale = models.JSONField(default=dict)  # {x, y, z} usually {1, 1, 1}
    
    # Variant
    selected_color = models.CharField(max_length=50, blank=True)
    
    # Metadata
    added_by_ai = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## 🎨 NEW FRONTEND ARCHITECTURE

### **Main Components to Build:**

```typescript
// 1. Left Sidebar: Furniture Catalog
<CatalogPanel>
  ├─ Search & Filters (category, style, price, vendor, color)
  ├─ Product Grid (thumbnails, drag to canvas)
  └─ Virtual scrolling for performance
</CatalogPanel>

// 2. Center: 3D Canvas (REPLACE KonvaCanvas)
<ThreeCanvas>
  ├─ Room Box (walls with photo as texture)
  ├─ Floor Grid
  ├─ Placed Furniture (GLTF 3D models)
  ├─ Transform Gizmo (move/rotate selected)
  ├─ Camera Controls (orbit, pan, zoom)
  └─ View Modes:
     ├─ Photo Match View
     ├─ Free 3D View
     └─ Top-Down View
</ThreeCanvas>

// 3. Right Sidebar: Properties Panel
<PropertiesPanel>
  ├─ Selected Furniture Info
  │  ├─ Product name, vendor, price
  │  ├─ Dimensions
  │  └─ "Contact Vendor" button
  ├─ Transform Controls (X, Y, Z, rotation)
  ├─ Color options
  ├─ AI Suggestions
  │  ├─ "Better Position"
  │  ├─ "Similar Items"
  │  └─ "Complete the Look"
  └─ Shopping List (total price)
</PropertiesPanel>
```

---

## 🤖 AI FEATURES TO BUILD

### **1. Smart Positioning**
```python
def suggest_position(room_dimensions, furniture_dimensions, existing_furniture):
    """
    Rules:
    - Sofas against walls
    - Coffee table in front of sofa (60-80cm gap)
    - Maintain walking paths (min 90cm)
    - Balance the room
    """
    return {
        'position': {'x': 2.5, 'y': 0, 'z': 1.0},
        'rotation': {'x': 0, 'y': 90, 'z': 0},
        'confidence': 0.87,
        'reason': 'Creates conversation area with clear walkway'
    }
```

### **2. Room Understanding**
```python
def analyze_room_photo(image_url):
    """
    1. Depth estimation (MiDaS or DepthAnything)
    2. Room type detection
    3. Calculate real-world dimensions
    """
    return {
        'room_type': 'living_room',
        'dimensions': {'width': 4.5, 'length': 6.0, 'height': 2.7},
        'style': 'modern_minimalist'
    }
```

### **3. Style Matching**
```python
def recommend_furniture(placed_items, room_style):
    """Suggest complementary pieces"""
    return matching_products
```

---

## 📦 PACKAGES TO INSTALL

```bash
# Frontend - 3D Libraries
npm install three @react-three/fiber @react-three/drei
npm install leva  # GUI controls for debugging
npm install @react-three/gltfjsx  # Convert GLTF to React

# Frontend - Catalog
npm install react-window  # Virtual scrolling
npm install fuse.js  # Fuzzy search

# Already installed (keep):
- @react-three/postprocessing
- axios, react-router-dom, zustand
```

---

## 🚀 MIGRATION PLAN (6 WEEKS)

### **Week 1: Database & API**
- [ ] Add new models (Vendor, FurnitureProduct, RoomModel, PlacedFurniture)
- [ ] Create migrations
- [ ] Build API endpoints for furniture catalog
- [ ] Set up vendor admin panel in Django admin

### **Week 2: 3D Foundation**
- [ ] Replace Konva canvas with React Three Fiber
- [ ] Create basic Room component (box with walls)
- [ ] Implement camera controls (OrbitControls)
- [ ] Load background photo as wall texture

### **Week 3: Furniture System**
- [ ] Build furniture catalog UI
- [ ] Implement drag-from-catalog-to-scene
- [ ] Load GLTF models in 3D scene
- [ ] Basic positioning (drop at Y=0 floor level)

### **Week 4: Transform Controls**
- [ ] Add transform gizmo (TransformControls from drei)
- [ ] Properties panel for selected furniture
- [ ] Color variant switching
- [ ] Delete furniture functionality

### **Week 5: AI Features**
- [ ] Room dimension detection from photo
- [ ] Smart position suggestions
- [ ] Style matching recommendations

### **Week 6: Export & Business Features**
- [ ] Render views from multiple angles
- [ ] Generate shopping list with prices
- [ ] Vendor contact integration
- [ ] Share designs with clients

---

## 🎯 IMMEDIATE FIRST STEPS

**When you start working again:**

1. **Get Test 3D Models**
   - Download 10-20 free furniture GLTF models from Sketchfab or Poly Pizza
   - Store in `frontend/public/models/` folder
   - Test loading in browser

2. **Create New Database Models**
   - Add Vendor, FurnitureProduct, RoomModel, PlacedFurniture to `backend/apps/projects/models.py`
   - Run `python manage.py makemigrations`
   - Run `python manage.py migrate`

3. **Build Simple 3D Room**
   - Create `frontend/src/components/Scene/RoomScene.tsx`
   - Replace KonvaCanvas usage in ProjectEditor.tsx
   - Basic room box with floor and back wall

4. **Test Furniture Loading**
   - Load one GLTF model into scene
   - Make it draggable/movable
   - Verify it works

5. **Build Catalog UI**
   - Simple grid of furniture cards
   - Thumbnails + name + price
   - Drag to add to scene

---

## 📝 IMPORTANT NOTES

### **User Requirements (From Discussion):**
1. ✅ Manual placement (designer has control)
2. ✅ AI assistance (can suggest positions)
3. ✅ Target: Professional designers
4. ✅ Budget: Can afford API calls
5. ✅ Multiple viewing angles: Probably yes
6. ✅ Furniture source: Real products from local vendors

### **Key Design Decisions:**
- Use GLTF format for 3D models (industry standard)
- Floor position is always Y=0
- Dimensions stored in centimeters
- Support color variants per product
- AI suggests but doesn't force positions
- Export renders from multiple angles

### **Files That Will Change:**
- `backend/apps/projects/models.py` - Add new models
- `frontend/src/components/Scene/ThreeCanvas.tsx` - Replace Konva
- `frontend/src/components/Panels/CatalogPanel.tsx` - Build catalog
- `frontend/src/store/useSceneStore.ts` - Update for 3D data
- `frontend/src/pages/ProjectEditor.tsx` - Wire up new components

### **Files to Keep:**
- Authentication system (works fine)
- Image upload to Cloudinary (works fine)
- Project CRUD operations (works fine)
- Docker setup (works fine)

---

## 🔧 QUICK REFERENCE

### **Current Codebase Structure:**
```
dreamspace/
├── backend/
│   ├── apps/
│   │   ├── projects/  ← ADD new models here
│   │   └── users/     ← Leave alone
│   ├── config/
│   │   └── settings.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas/  ← REPLACE with Scene/
│   │   │   ├── Panels/  ← UPDATE
│   │   │   └── Toolbar/
│   │   ├── pages/
│   │   │   └── ProjectEditor.tsx  ← UPDATE
│   │   ├── store/
│   │   │   └── useSceneStore.ts  ← UPDATE
│   │   └── types/  ← ADD furniture types
│   └── package.json
└── docker-compose.yml
```

### **Example: Basic 3D Room Component**
```typescript
// frontend/src/components/Scene/RoomScene.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

export default function RoomScene() {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 1.6, 5]} />
      <OrbitControls maxPolarAngle={Math.PI / 2} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} castShadow />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Back wall with photo texture */}
      <mesh position={[0, 2.5, -5]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <gridHelper args={[10, 10]} />
    </Canvas>
  )
}
```

---

## 🎓 LEARNING RESOURCES

If you need to understand:

**React Three Fiber:**
- https://docs.pmnd.rs/react-three-fiber
- https://threejs-journey.com/ (excellent course)

**GLTF Models:**
- https://sketchfab.com/ (free models)
- https://poly.pizza/ (free models)

**Interior Design Rules:**
- Sofa-to-coffee-table: 45-60cm
- Walking paths: min 90cm
- Furniture height: sofa ~80cm, table ~75cm

---

## 💬 LAST CONVERSATION SUMMARY

**Designer's Pain Point:**
"I don't know how actual furniture will work with the current rectangle/block approach"

**Solution:**
Switch to true 3D with real furniture models (GLTF) from local vendors, allowing designers to create realistic visualizations they can share with clients.

**Business Value:**
- Designers get professional tool
- Vendors get qualified leads
- Platform earns commission/listing fees

---

## ✅ CURRENT STATUS

**What Works:**
- ✅ User authentication
- ✅ Project creation
- ✅ Image upload to Cloudinary
- ✅ Docker environment
- ✅ Basic 2D canvas (Konva)

**What Needs Building:**
- ❌ 3D room visualization
- ❌ Furniture catalog system
- ❌ Vendor database
- ❌ GLTF model loading
- ❌ AI positioning
- ❌ Multi-angle export

**Next Session Should Start With:**
1. Review this document
2. Add new database models
3. Create basic 3D room component
4. Test loading one GLTF model

---

## 📞 HANDOFF COMPLETE

This document contains everything the next Copilot session needs to continue the work. The project is at a critical pivot point - transitioning from 2D canvas to 3D visualization with real furniture models.

**Good luck with the new laptop! 🚀**

---

*Last updated: November 8, 2025*
*Original Copilot Session: Comprehensive codebase analysis & architecture redesign*
