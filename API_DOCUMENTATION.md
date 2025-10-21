# 📚 API Documentation

Complete API reference for **InDecor DreamSpace** backend.

---

## Base URL

```
http://localhost:8000/api
```

---

## Authentication

All endpoints except registration and login require JWT authentication.

### Headers
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### Login
```http
POST /auth/token/
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Token
```http
POST /auth/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 👤 User Endpoints

### Register
```http
POST /users/register/
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "password2": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "message": "User created successfully. Please login to get your token."
}
```

### Get Profile
```http
GET /users/profile/
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "date_joined": "2024-01-15T10:30:00Z"
}
```

### Update Profile
```http
PUT /users/profile/
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith"
}
```

---

## 🎨 Project Endpoints

### List Projects
```http
GET /projects/
```

**Response:** `200 OK`
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Modern Living Room",
      "owner_username": "john_doe",
      "image_count": 3,
      "variant_count": 2,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T12:00:00Z"
    }
  ]
}
```

### Create Project
```http
POST /projects/
```

**Request Body:**
```json
{
  "name": "Cozy Bedroom Redesign"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "name": "Cozy Bedroom Redesign",
  "owner": 1,
  "owner_username": "john_doe",
  "images": [],
  "variants": [],
  "versions": [],
  "created_at": "2024-01-15T14:00:00Z",
  "updated_at": "2024-01-15T14:00:00Z"
}
```

### Get Project
```http
GET /projects/{id}/
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Modern Living Room",
  "owner": 1,
  "owner_username": "john_doe",
  "images": [
    {
      "id": 1,
      "project": 1,
      "type": "original",
      "image_url": "https://res.cloudinary.com/...",
      "metadata": {
        "width": 1920,
        "height": 1080,
        "format": "jpg"
      },
      "created_at": "2024-01-15T10:35:00Z"
    }
  ],
  "variants": [],
  "versions": [],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

### Update Project
```http
PATCH /projects/{id}/
```

**Request Body:**
```json
{
  "name": "Updated Project Name"
}
```

### Delete Project
```http
DELETE /projects/{id}/
```

**Response:** `204 No Content`

---

## 📤 Upload Endpoints

### Upload Image
```http
POST /projects/{id}/upload/
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image`: (file) Image file
- `type`: (string) "original" | "inspo" | "generated"

**Response:** `201 Created`
```json
{
  "id": 2,
  "project": 1,
  "type": "original",
  "image_url": "https://res.cloudinary.com/demo/image/upload/v1234567890/dreamspace/projects/1/abc123.jpg",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "cloudinary_id": "dreamspace/projects/1/abc123"
  },
  "created_at": "2024-01-15T15:00:00Z"
}
```

---

## ✨ Generation Endpoints

### Generate Variant
```http
POST /projects/{id}/generate/
```

**Request Body:**
```json
{
  "prompt": "Make the room more modern with neutral colors"
}
```

**Response:** `202 Accepted`
```json
{
  "message": "Generation started",
  "task_id": "abc123-def456-ghi789",
  "project_id": 1
}
```

> **Note:** This triggers an async Celery task. Check variants after ~2 seconds.

---

## 🖼️ Variant Endpoints

### List Variants
```http
GET /projects/{id}/variants/
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "project": 1,
    "image_url": "https://res.cloudinary.com/...",
    "metadata": {
      "prompt": "Make the room more modern",
      "base_image_id": 1,
      "generation_type": "stub"
    },
    "items": [],
    "created_at": "2024-01-15T15:30:00Z"
  }
]
```

### Add Item to Variant
```http
POST /projects/variants/{variant_id}/items/
```

**Request Body:**
```json
{
  "name": "Modern Sofa",
  "category": "sofa",
  "bbox": {
    "x": 100,
    "y": 200,
    "width": 300,
    "height": 150
  },
  "transform": {
    "rotation": 0,
    "scaleX": 1,
    "scaleY": 1
  }
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "variant": 1,
  "name": "Modern Sofa",
  "category": "sofa",
  "bbox": {
    "x": 100,
    "y": 200,
    "width": 300,
    "height": 150
  },
  "mask_url": null,
  "transform": {
    "rotation": 0,
    "scaleX": 1,
    "scaleY": 1
  },
  "created_at": "2024-01-15T16:00:00Z"
}
```

### Update Item
```http
PATCH /projects/items/{item_id}/
```

**Request Body:**
```json
{
  "bbox": {
    "x": 150,
    "y": 250,
    "width": 350,
    "height": 180
  }
}
```

### Delete Item
```http
DELETE /projects/items/{item_id}/
```

**Response:** `204 No Content`

---

## 📜 Version Endpoints

### List Versions
```http
GET /projects/{id}/versions/
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "project": 1,
    "snapshot": {
      "items": [...],
      "background": "..."
    },
    "prompt": "Checkpoint after adding sofa",
    "created_at": "2024-01-15T16:30:00Z"
  }
]
```

---

## 🏥 Health Check

### Health
```http
GET /health/
```

**Response:** `200 OK`
```json
{
  "status": "healthy"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message",
  "field_name": ["Error detail"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📝 Notes

### JWT Token Lifecycle
1. **Login** → Get `access` (60 min) and `refresh` (7 days) tokens
2. **Use access token** for authenticated requests
3. **When access expires** → Use refresh token to get new access token
4. **When refresh expires** → User must login again

### Cloudinary Integration
- All uploaded images are stored in Cloudinary
- URLs are in format: `https://res.cloudinary.com/{cloud_name}/image/upload/...`
- Images are organized in folders: `dreamspace/projects/{project_id}/`

### Celery Tasks
- Generation tasks run asynchronously
- Check task status via task_id (future feature)
- Results stored in Redis for 24 hours

### Pagination
- List endpoints use DRF pagination
- Default page size: 20 items
- Use `?page=2` for next page

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### Create Project
```bash
curl -X POST http://localhost:8000/api/projects/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Test Project"
  }'
```

### Upload Image
```bash
curl -X POST http://localhost:8000/api/projects/1/upload/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "image=@/path/to/room.jpg" \
  -F "type=original"
```

---

**Need help?** Check the [README.md](README.md) or open an issue!

