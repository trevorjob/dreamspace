# 🎨 Architecture Transition Diagram

## BEFORE (Current 2D Approach - Being Replaced)

```
┌─────────────────────────────────────────────────────────┐
│                    ProjectEditor                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐   ┌─────────────────┐   ┌────────────┐  │
│  │  Upload  │   │  KonvaCanvas    │   │   Right    │  │
│  │  Panel   │   │   (2D Canvas)   │   │   Panel    │  │
│  │          │   │                 │   │            │  │
│  │  - File  │   │  ┌──────────┐  │   │  - Props   │  │
│  │    Input │   │  │ BG Image │  │   │  - Details │  │
│  │          │   │  └──────────┘  │   │            │  │
│  │  - Cloud │   │                 │   │            │  │
│  │    Upload│   │  📦 Rectangle   │   │            │  │
│  │          │   │  📦 Rectangle   │   │            │  │
│  │          │   │  📦 Rectangle   │   │            │  │
│  └──────────┘   └─────────────────┘   └────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘

Problems:
❌ Rectangles, not real furniture
❌ Only looks right from one angle
❌ No way to add 3D models
❌ Can't rotate camera
```

## AFTER (New 3D Approach - Target Architecture)

```
┌───────────────────────────────────────────────────────────────────┐
│                         ProjectEditor                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────────────────┐  ┌──────────────────┐   │
│  │Catalog   │  │   ThreeCanvas        │  │  Properties      │   │
│  │Panel     │  │   (3D Scene)         │  │  Panel           │   │
│  │          │  │                      │  │                  │   │
│  │ Search:  │  │  ┌────────────────┐ │  │  Selected Item:  │   │
│  │ ┌──────┐ │  │  │  Room Box      │ │  │  ┌────────────┐  │   │
│  │ │ sofa │ │  │  │  ┌──────────┐  │ │  │  │Modern Sofa │  │   │
│  │ └──────┘ │  │  │  │ BG Photo │  │ │  │  │$1,299      │  │   │
│  │          │  │  │  │ on Wall  │  │ │  │  └────────────┘  │   │
│  │ Filters: │  │  │  └──────────┘  │ │  │                  │   │
│  │ Style    │  │  │                │ │  │  Position:       │   │
│  │ Price    │  │  └────────────────┘ │  │  X: 2.5m         │   │
│  │ Vendor   │  │                      │  │  Y: 0.0m         │   │
│  │          │  │  🛋️ 3D Sofa Model   │  │  Z: 1.0m         │   │
│  │ Results: │  │  🪑 3D Chair Model   │  │                  │   │
│  │ ┌──────┐ │  │  📦 3D Table Model   │  │  Rotation: 90°   │   │
│  │ │ 🛋️   │◄┼──┼─ Drag & Drop ────── │  │                  │   │
│  │ │$1299 │ │  │                      │  │  Color Options:  │   │
│  │ └──────┘ │  │  🎥 Camera Controls │  │  ⚫ Blue          │   │
│  │ ┌──────┐ │  │  (Orbit/Pan/Zoom)    │  │  ⚪ Gray         │   │
│  │ │ 🪑   │ │  │                      │  │                  │   │
│  │ │$599  │ │  │  View Modes:         │  │  🤖 AI Suggest: │   │
│  │ └──────┘ │  │  • Photo Match       │  │  "Move 20cm     │   │
│  │          │  │  • Free 3D           │  │   closer to     │   │
│  │ [Load    │  │  • Top Down          │  │   wall"         │   │
│  │  More]   │  │                      │  │                  │   │
│  └──────────┘  └──────────────────────┘  └──────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

Benefits:
✅ Real 3D furniture models (GLTF)
✅ Works from any camera angle
✅ Real vendor products with prices
✅ AI positioning assistance
✅ Multiple view modes
```

## Data Flow Changes

### BEFORE (2D)
```
User → Upload Image → Cloudinary
                    ↓
              ProjectImage record
                    ↓
              Konva Canvas renders as background
                    ↓
User drags rectangles → CanvasStore (Zustand)
                    ↓
              Local state only
```

### AFTER (3D)
```
User → Upload Image → Cloudinary
                    ↓
              ProjectImage record
                    ↓
         AI analyzes photo (NEW!)
                    ↓
         Creates RoomModel (NEW!)
         - dimensions
         - perspective data
         - camera position
                    ↓
         Three.js renders 3D room
                    ↓
User drags furniture from catalog
                    ↓
         PlacedFurniture record (NEW!)
         - product FK
         - position {x,y,z}
         - rotation {x,y,z}
                    ↓
         GLTF model loads in scene
                    ↓
         AI suggests optimal position (NEW!)
```

## Database Schema Changes

### NEW Tables to Add:

```sql
-- Vendors (furniture suppliers)
vendors
  - id
  - name
  - contact_email
  - phone
  - address
  - website
  - logo_url
  - is_active

-- Furniture Products
furniture_products
  - id
  - vendor_id (FK)
  - name
  - description
  - category (sofa, table, chair...)
  - style (modern, rustic...)
  - model_url (GLTF file!)
  - thumbnail_url
  - dimensions {width, height, depth}
  - color_options []
  - price
  - in_stock

-- Room 3D Data
room_models
  - id
  - project_id (FK, one-to-one)
  - dimensions {width, length, height}
  - floor_plan (wall coords)
  - perspective_data
  - depth_map_url
  - camera_position {x,y,z}
  - camera_rotation {x,y,z}

-- Placed Furniture in Designs
placed_furniture
  - id
  - project_id (FK)
  - product_id (FK)
  - position {x, y, z}
  - rotation {x, y, z}
  - scale {x, y, z}
  - selected_color
  - added_by_ai (boolean)
  - notes
```

## Component Architecture Changes

### BEFORE
```
ProjectEditor
├── UploadPanel
├── KonvaCanvas
│   ├── BackgroundImage
│   ├── Rectangle (multiple)
│   └── Transformer
└── RightPanel
    ├── ItemDetails
    └── VariantsTab
```

### AFTER
```
ProjectEditor
├── CatalogPanel (NEW!)
│   ├── SearchFilters
│   ├── ProductGrid
│   │   └── FurnitureCard (drag source)
│   └── VirtualScrolling
│
├── ThreeCanvas (REPLACES Konva)
│   ├── Room
│   │   ├── BackWall (with photo texture)
│   │   ├── SideWalls
│   │   └── Floor (with grid)
│   ├── PlacedFurniture[] (GLTF models)
│   ├── TransformGizmo
│   ├── OrbitControls
│   └── Lighting
│
└── PropertiesPanel (ENHANCED)
    ├── FurnitureDetails (price, vendor, dimensions)
    ├── TransformControls (position, rotation)
    ├── ColorPicker
    ├── AISuggestions (NEW!)
    └── ShoppingList (NEW!)
```

## Tech Stack Comparison

```
┌──────────────────┬─────────────────┬─────────────────┐
│   Component      │   BEFORE (2D)   │   AFTER (3D)    │
├──────────────────┼─────────────────┼─────────────────┤
│ Canvas Rendering │ Konva.js        │ Three.js        │
│ React Wrapper    │ react-konva     │ R3F             │
│ Transform        │ Transformer     │ TransformGizmo  │
│ Items            │ Rectangles      │ GLTF Models     │
│ Camera           │ Fixed           │ OrbitControls   │
│ Dimensions       │ 2D (x, y)       │ 3D (x, y, z)    │
│ Catalog          │ None            │ Database        │
│ AI Features      │ Stub only       │ Position + More │
└──────────────────┴─────────────────┴─────────────────┘
```

## Migration Steps Visual

```
Week 1: Database
┌─────────────────────────────┐
│ ✓ Add 4 new models          │
│ ✓ Run migrations            │
│ ✓ Seed vendor data          │
│ ✓ Create admin interface    │
└─────────────────────────────┘

Week 2: 3D Foundation
┌─────────────────────────────┐
│ ✓ Install Three.js + R3F    │
│ ✓ Create RoomScene component│
│ ✓ Replace Konva with Three  │
│ ✓ Basic room box + floor    │
│ ✓ Camera controls           │
└─────────────────────────────┘

Week 3: Furniture
┌─────────────────────────────┐
│ ✓ Build catalog UI          │
│ ✓ Drag & drop to scene      │
│ ✓ Load GLTF models          │
│ ✓ Position at floor level   │
└─────────────────────────────┘

Week 4: Controls
┌─────────────────────────────┐
│ ✓ Transform gizmo           │
│ ✓ Properties panel          │
│ ✓ Color variants            │
│ ✓ Delete furniture          │
└─────────────────────────────┘

Week 5: AI
┌─────────────────────────────┐
│ ✓ Room dimension detection  │
│ ✓ Position suggestions      │
│ ✓ Style recommendations     │
└─────────────────────────────┘

Week 6: Export
┌─────────────────────────────┐
│ ✓ Multi-angle renders       │
│ ✓ Shopping list generation  │
│ ✓ Vendor integration        │
└─────────────────────────────┘
```

## Key Decision Points

### Why 3D over 2D?
- ❌ 2D: Can't represent real furniture accurately
- ❌ 2D: Only works from one angle
- ✅ 3D: Real products with dimensions
- ✅ 3D: Multiple viewing angles
- ✅ 3D: AR preview possible later

### Why GLTF models?
- Industry standard 3D format
- Supported by Three.js natively
- Small file sizes
- PBR materials support
- Animation support (for future)

### Why React Three Fiber?
- React-friendly Three.js wrapper
- Declarative syntax
- Better performance
- Active community
- Great ecosystem (@react-three/drei)

---

**Start here when resuming work:**
1. Read COPILOT_HANDOFF.md for full context
2. Follow QUICK_START_GUIDE.md for immediate steps
3. Reference this diagram for architecture clarity

**Last updated:** November 8, 2025
