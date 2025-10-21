# 🚀 Quick Start Guide

Get **InDecor DreamSpace** up and running in 5 minutes!

---

## Prerequisites

- ✅ **Docker Desktop** installed and running
- ✅ **Cloudinary account** (free tier is fine)
  - Sign up at [cloudinary.com](https://cloudinary.com/)
  - Get your credentials from the dashboard

---

## Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd dreamspace
```

---

## Step 2: Configure Cloudinary

1. **Copy the example environment file:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Edit `backend/.env`** and add your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

> **Where to find these?**  
> Dashboard → Settings → Product Environment Credentials

---

## Step 3: Run the Setup

### Option A: Using Make (Linux/macOS)
```bash
make setup
```

### Option B: Using Shell Script (Linux/macOS)
```bash
chmod +x setup.sh
./setup.sh
```

### Option C: Using PowerShell (Windows)
```powershell
.\setup.ps1
```

### Option D: Manual Docker Commands
```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# Wait 5 seconds for DB to initialize
sleep 5  # Or: Start-Sleep -Seconds 5 on Windows

# Run migrations
docker-compose exec -T api python manage.py migrate
```

---

## Step 4: Access the Application

🌐 **Open your browser:**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/
- **Django Admin:** http://localhost:8000/admin/ (create superuser first)

---

## Step 5: Create Your First Account

1. Go to http://localhost:5173
2. Click "Sign up"
3. Register with username, email, and password
4. Login with your credentials

---

## Step 6: Create a Project

1. Click **"+ New Project"**
2. Enter a project name
3. Click **"Create"**
4. You'll be taken to the project editor!

---

## Step 7: Upload a Room Photo

1. In the left panel, click **"+ Upload Image"**
2. Select a room photo from your computer
3. The image will appear as the canvas background

---

## Step 8: Add Items to the Canvas

1. Click **"➕ Add Item"** in the toolbar
2. A blue rectangle will appear on the canvas
3. **Drag** it to position
4. **Resize** using the corner handles
5. **Edit properties** in the right panel (color, size, position)

---

## Step 9: Generate a Variant (Stub)

1. Click **"✨ Generate Variant"** in the toolbar
2. Wait ~2 seconds for the Celery worker to process
3. Switch to the **"Variants"** tab in the right panel
4. You'll see the generated variant (currently a sepia-filtered version)

> **Note:** This is a stub implementation. Replace with real AI in production!

---

## Useful Commands

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Create Django Superuser
```bash
docker-compose exec api python manage.py createsuperuser
```

### Access Django Shell
```bash
docker-compose exec api python manage.py shell
```

---

## Troubleshooting

### Issue: "Connection refused" or services won't start
**Solution:** Ensure Docker Desktop is running

### Issue: Database migration errors
**Solution:**
```bash
docker-compose down
docker-compose up -d
docker-compose exec api python manage.py migrate
```

### Issue: Cloudinary upload fails
**Solution:** Double-check your credentials in `backend/.env`

### Issue: Frontend can't connect to backend
**Solution:** Check that the API is running at http://localhost:8000

### Issue: Celery worker not processing tasks
**Solution:** Check worker logs:
```bash
docker-compose logs -f worker
```

---

## What's Next?

✅ **Explore the codebase**  
✅ **Read the full [README.md](README.md)**  
✅ **Check [CONTRIBUTING.md](CONTRIBUTING.md)** to add features  
✅ **Replace the AI stub** with real models  
✅ **Build a furniture catalog**  
✅ **Add 3D visualization**  

---

**Happy designing! 🎨**

