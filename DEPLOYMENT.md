# 🚀 Deployment Guide

Deploy **InDecor DreamSpace** to production.

---

## 🎯 Pre-Deployment Checklist

- [ ] Set `DEBUG=False` in Django settings
- [ ] Configure production database (PostgreSQL)
- [ ] Set up Redis for production
- [ ] Configure production domain in CORS
- [ ] Set strong `SECRET_KEY`
- [ ] Set up SSL/HTTPS
- [ ] Configure static file serving
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy

---

## 🌐 Option 1: Render (Recommended for MVP)

### Backend Deployment

1. **Create Web Service** on Render:
   - Repository: Your GitHub repo
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Docker`
   - Build Command: (auto-detected from Dockerfile)
   - Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

2. **Add PostgreSQL Database**:
   - Create PostgreSQL instance
   - Copy `Internal Database URL`
   - Set as `DATABASE_URL` environment variable

3. **Add Redis Instance**:
   - Create Redis instance
   - Copy `Internal Redis URL`
   - Set as `REDIS_URL`, `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`

4. **Environment Variables**:
   ```
   SECRET_KEY=<generate-strong-key>
   DEBUG=False
   ALLOWED_HOSTS=your-api.onrender.com
   DATABASE_URL=<from-postgres-addon>
   REDIS_URL=<from-redis-addon>
   CLOUDINARY_CLOUD_NAME=<your-value>
   CLOUDINARY_API_KEY=<your-value>
   CLOUDINARY_API_SECRET=<your-value>
   CORS_ALLOWED_ORIGINS=https://your-frontend.onrender.com
   ```

5. **Deploy Celery Worker** (separate service):
   - Same repo, same root directory
   - Start Command: `celery -A config worker --loglevel=info`
   - Same environment variables

### Frontend Deployment

1. **Create Static Site** on Render:
   - Repository: Your GitHub repo
   - Branch: `main`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Environment Variables**:
   ```
   VITE_API_URL=https://your-api.onrender.com
   ```

3. **Redirects for SPA** (create `frontend/public/_redirects`):
   ```
   /*    /index.html   200
   ```

---

## ☁️ Option 2: Heroku

### Backend

1. **Create Heroku App**:
   ```bash
   heroku create dreamspace-api
   heroku addons:create heroku-postgresql:mini
   heroku addons:create heroku-redis:mini
   ```

2. **Set Environment Variables**:
   ```bash
   heroku config:set SECRET_KEY=<your-secret-key>
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=dreamspace-api.herokuapp.com
   heroku config:set CLOUDINARY_CLOUD_NAME=<your-value>
   heroku config:set CLOUDINARY_API_KEY=<your-value>
   heroku config:set CLOUDINARY_API_SECRET=<your-value>
   heroku config:set CORS_ALLOWED_ORIGINS=https://dreamspace.herokuapp.com
   ```

3. **Create `Procfile` in backend/**:
   ```
   web: gunicorn config.wsgi --log-file -
   worker: celery -A config worker --loglevel=info
   ```

4. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

5. **Run Migrations**:
   ```bash
   heroku run python manage.py migrate
   heroku run python manage.py createsuperuser
   ```

### Frontend

1. **Create Heroku App**:
   ```bash
   heroku create dreamspace-frontend
   ```

2. **Add Buildpack**:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. **Create `static.json` in frontend/**:
   ```json
   {
     "root": "dist",
     "clean_urls": true,
     "routes": {
       "/**": "index.html"
     }
   }
   ```

4. **Deploy**:
   ```bash
   git subtree push --prefix frontend heroku main
   ```

---

## ☁️ Option 3: AWS (Advanced)

### Architecture
- **ECS/Fargate** - Container orchestration
- **RDS PostgreSQL** - Database
- **ElastiCache Redis** - Cache/Queue
- **S3 + CloudFront** - Frontend static hosting
- **ALB** - Load balancer
- **Route 53** - DNS

### Steps

1. **Set up VPC & Subnets**
2. **Create RDS PostgreSQL instance**
3. **Create ElastiCache Redis cluster**
4. **Create ECR repositories** for Docker images
5. **Push Docker images** to ECR
6. **Create ECS cluster** with Fargate tasks
7. **Set up ALB** for backend
8. **Deploy frontend** to S3 + CloudFront
9. **Configure Route 53** for custom domain
10. **Set up SSL** with ACM

### Environment Variables (ECS Task Definition)
```json
{
  "environment": [
    {"name": "SECRET_KEY", "value": "..."},
    {"name": "DEBUG", "value": "False"},
    {"name": "DATABASE_URL", "value": "..."},
    {"name": "REDIS_URL", "value": "..."}
  ]
}
```

---

## 🐳 Option 4: DigitalOcean App Platform

### Backend

1. **Create App**:
   - Source: GitHub repo
   - Type: Web Service
   - Dockerfile: `backend/Dockerfile`

2. **Add Database** (PostgreSQL)

3. **Add Redis**

4. **Environment Variables**:
   ```
   SECRET_KEY=${SECRET_KEY}
   DATABASE_URL=${DATABASE_URL}
   REDIS_URL=${REDIS_URL}
   ```

5. **Add Worker Component**:
   - Type: Worker
   - Run Command: `celery -A config worker --loglevel=info`

### Frontend

1. **Create Static Site**:
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## 📝 Production Dockerfile Updates

### Backend (Production)

```dockerfile
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Frontend (Production)

Use multi-stage build:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create `frontend/nginx.conf`:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_comp_level 9;
}
```

---

## 🔒 Security Checklist

- [ ] Use HTTPS only
- [ ] Set secure `SECRET_KEY` (generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- [ ] Enable CSRF protection
- [ ] Configure CORS properly (specific domains only)
- [ ] Use environment variables for secrets (never commit)
- [ ] Enable Django security middleware
- [ ] Set up rate limiting
- [ ] Configure CSP headers
- [ ] Regular security updates

### Django Security Settings (Production)

```python
# config/settings.py (production)
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# HSTS
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

---

## 📊 Monitoring & Logging

### Sentry (Error Tracking)

1. **Install**:
   ```bash
   pip install sentry-sdk
   ```

2. **Configure** in `settings.py`:
   ```python
   import sentry_sdk
   
   sentry_sdk.init(
       dsn="https://xxx@xxx.ingest.sentry.io/xxx",
       traces_sample_rate=1.0,
   )
   ```

### Application Logs

- Use logging framework
- Send to CloudWatch, LogDNA, or Papertrail
- Set up alerts for errors

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_FRONTEND_HOOK }}
```

---

## 💾 Backup Strategy

1. **Database Backups**:
   - Automated daily backups (RDS, Render, etc.)
   - Retain 30 days

2. **Media Files**:
   - Cloudinary has built-in backups
   - Export to S3 periodically

3. **Code**:
   - GitHub as source of truth
   - Tag releases

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (ALB, nginx)
- Multiple backend instances
- Separate worker instances
- Database connection pooling

### Caching
- Redis for session storage
- CloudFront/CDN for static files
- Django cache framework

### Database
- Read replicas for scaling reads
- Connection pooling (pgBouncer)
- Query optimization

---

## 🧪 Pre-Production Testing

```bash
# Load testing
ab -n 1000 -c 10 https://your-api.com/api/projects/

# Security scan
safety check
bandit -r backend/

# Lighthouse (frontend)
lighthouse https://your-frontend.com --view
```

---

## 🎉 Post-Deployment

1. **Verify all services are running**
2. **Run health checks**
3. **Test critical flows** (register, login, create project)
4. **Monitor logs** for errors
5. **Set up alerts**
6. **Update documentation** with production URLs

---

**Need help?** Check platform-specific docs or open an issue!

