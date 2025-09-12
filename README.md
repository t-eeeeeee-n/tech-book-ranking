# TechBook Ranking - Docker Deployment

Complete Docker setup for the TechBook Ranking application with MongoDB, Express backend, and Nuxt 3 frontend.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd tech-book-ranking

# Copy environment template
cp .env.example .env
# Edit .env with your actual values
```

### 2. Start Services

**Production:**
```bash
# Start core services
docker-compose up -d

# With cron jobs
docker-compose --profile cron up -d

# With Nginx reverse proxy
docker-compose --profile nginx up -d

# All services
docker-compose --profile cron --profile nginx up -d
```

**Development:**
```bash
# Uses override file automatically
docker-compose up -d
```

### 3. Access Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **MongoDB**: localhost:27017
- **Admin Panel**: http://localhost:3000/admin/books
- **Nginx (if enabled)**: http://localhost

## 🏗️ Architecture

```
┌─────────────────────┐
│      Nginx          │  ← Reverse Proxy (optional)
│   Load Balancer     │
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
┌───▼────┐ ┌────▼────┐
│Frontend│ │ Backend │
│Nuxt 3  │ │Express  │
│:3000   │ │ :3001   │
└────────┘ └─────┬───┘
                 │
         ┌───────▼────────┐
         │    MongoDB     │
         │    :27017      │
         └────────────────┘
```

## 📦 Services

### Core Services
- **mongodb**: MongoDB 6.0 with authentication
- **backend**: Express + TypeScript API
- **frontend**: Nuxt 3 SSR application

### Optional Services
- **cron**: Automated data fetching and ranking updates
- **nginx**: Production reverse proxy with SSL support

## ⚙️ Configuration

### Environment Variables
```bash
# Required
MONGO_ROOT_PASSWORD=secure_password
QIITA_TOKEN=your_qiita_token
API_KEYS=your_secure_api_key

# Optional
AMAZON_ACCESS_KEY=your_amazon_key
JWT_SECRET=your_jwt_secret
ENABLE_CRON_JOBS=true
```

### Service Profiles
```bash
# Run only core services (default)
docker-compose up -d

# Include cron jobs
docker-compose --profile cron up -d

# Include Nginx
docker-compose --profile nginx up -d

# All services
docker-compose --profile cron --profile nginx up -d
```

## 🔧 Development

### Local Development
```bash
# Start in development mode
docker-compose up -d

# Watch logs
docker-compose logs -f backend frontend

# Execute commands in containers
docker-compose exec backend npm run test
docker-compose exec frontend npm run build
```

### Hot Reloading
Both frontend and backend support hot reloading in development:
- Backend: Uses nodemon
- Frontend: Uses Nuxt 3 dev server

### Database Access
```bash
# MongoDB shell
docker-compose exec mongodb mongosh -u admin -p

# Import/Export data
docker-compose exec mongodb mongodump --db techbook-ranking
docker-compose exec mongodb mongorestore --db techbook-ranking
```

## 📊 Monitoring & Logs

### Health Checks
```bash
# Check service health
docker-compose ps

# Test endpoints
curl http://localhost:3000/health    # Frontend
curl http://localhost:3001/api/health # Backend
```

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Cron jobs
docker-compose logs -f cron

# Follow last 100 lines
docker-compose logs --tail=100 -f
```

### Volume Management
```bash
# List volumes
docker volume ls | grep techbook

# Backup MongoDB data
docker run --rm -v techbook-mongodb-data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz -C /data .

# Restore MongoDB data
docker run --rm -v techbook-mongodb-data:/data -v $(pwd):/backup alpine tar xzf /backup/mongodb-backup.tar.gz -C /data
```

## 🚀 Production Deployment

### 1. Server Setup
```bash
# Clone repository
git clone <repository-url>
cd tech-book-ranking

# Configure environment
cp .env.example .env
nano .env  # Add production values
```

### 2. SSL Certificate (if using Nginx)
```bash
# Create SSL directory
mkdir -p docker/nginx/ssl

# Add your certificates
cp server.crt docker/nginx/ssl/
cp server.key docker/nginx/ssl/
```

### 3. Deploy
```bash
# Build and start
docker-compose --profile cron --profile nginx up -d --build

# Verify deployment
docker-compose ps
curl -I http://localhost/health
```

### 4. Maintenance
```bash
# Update services
docker-compose pull
docker-compose up -d --build

# Scale services
docker-compose up -d --scale backend=2

# Backup before updates
docker run --rm -v techbook-mongodb-data:/data -v $(pwd):/backup alpine tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C /data .
```

## 🛠️ Troubleshooting

### Common Issues

**Services won't start:**
```bash
docker-compose down
docker system prune -f
docker-compose up -d
```

**Database connection issues:**
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Verify network
docker network ls | grep techbook
```

**Permission errors:**
```bash
# Fix volume permissions
sudo chown -R $USER:$USER .
```

**Out of disk space:**
```bash
# Clean up
docker system prune -a -f
docker volume prune -f
```

### Performance Tuning

**MongoDB:**
- Increase `--wiredTigerCacheSizeGB`
- Add more indexes for frequent queries

**Backend:**
- Scale horizontally: `docker-compose up -d --scale backend=3`
- Increase memory limits in docker-compose.yml

**Frontend:**
- Enable static generation: `npm run generate`
- Configure CDN for static assets

## 📁 File Structure
```
tech-book-ranking/
├── backend/
│   ├── Dockerfile           # Production build
│   ├── Dockerfile.dev       # Development build
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile           # Multi-stage production build
│   ├── Dockerfile.dev       # Development build
│   └── .dockerignore
├── docker/
│   ├── mongo-init.js        # MongoDB initialization
│   └── nginx/
│       └── nginx.conf       # Nginx configuration
├── docker-compose.yml       # Main services
├── docker-compose.override.yml  # Development overrides
├── .env.example             # Environment template
└── README.md               # This file
```

## 🔒 Security Considerations

- Change default passwords in `.env`
- Use strong API keys
- Configure firewall rules
- Enable SSL/TLS in production
- Regular security updates
- Monitor logs for suspicious activity
- Backup data regularly