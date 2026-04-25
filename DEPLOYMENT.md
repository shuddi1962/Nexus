# NEXUS Deployment Guide

This guide covers deployment to multiple platforms with zero-error configurations.

## Prerequisites

### Environment Variables Setup
Create these secrets in your deployment platform:

**Required for all platforms:**
- `INSFORGE_URL`: https://aev8u7h7.us-east.insforge.app
- `INSFORGE_API_KEY`: Your InsForge API key
- `NEXT_PUBLIC_INSFORGE_URL`: https://aev8u7h7.us-east.insforge.app
- `NEXT_PUBLIC_INSFORGE_ANON_KEY`: Your InsForge anonymous key

**Authentication:**
- `JWT_SECRET`: 64-character random hex string
- `JWT_REFRESH_SECRET`: 64-character random hex string
- `ENCRYPTION_KEY`: 32-byte hex string for API key encryption

**External Services:**
- `REDIS_URL`: Redis connection URL (for Railway/Render/AWS)
- `SMTP_HOST`: Email SMTP host
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password

## Platform-Specific Deployments

### 1. Vercel (Frontend Only)
**Best for:** Static frontend deployment
**URL Pattern:** https://nexus.vercel.app

**Setup:**
1. Connect GitHub repo to Vercel
2. Set build settings:
   - Build Command: `cd apps/web && npm run build`
   - Output Directory: `apps/web/.next`
   - Install Command: `npm ci`
3. Add environment variables in Vercel dashboard
4. Deploy

**Demo Account URLs:**
- Admin: https://nexus.vercel.app/admin (admin@nexus.demo)
- Owner: https://nexus.vercel.app/dashboard (owner@nexus.demo)
- Pro: https://nexus.vercel.app/dashboard (pro@nexus.demo)

### 2. Netlify (Frontend Only)
**Best for:** Static sites with forms
**URL Pattern:** https://nexus.netlify.app

**Setup:**
1. Connect GitHub repo to Netlify
2. Build settings in `netlify.toml` (already configured)
3. Add environment variables in Netlify dashboard
4. Enable Netlify Forms if needed
5. Deploy

**Demo Account URLs:**
- Admin: https://nexus.netlify.app/admin
- Owner: https://nexus.netlify.app/dashboard
- Pro: https://nexus.netlify.app/dashboard

### 3. Railway (Full-Stack)
**Best for:** Full-stack applications
**URL Pattern:** https://nexus.up.railway.app

**Setup:**
1. Connect GitHub repo to Railway
2. Railway auto-detects monorepo structure
3. Set environment variables in Railway dashboard
4. Configure domains if needed
5. Deploy

**Demo Account URLs:**
- Admin: https://nexus.up.railway.app/admin
- Owner: https://nexus.up.railway.app/dashboard
- Pro: https://nexus.up.railway.app/dashboard

### 4. Render (Full-Stack)
**Best for:** Cloud-native deployments
**URL Pattern:** https://nexus.onrender.com

**Setup:**
1. Connect GitHub repo to Render
2. Use `render.yaml` configuration (already created)
3. Set environment variables as secrets
4. Configure custom domains
5. Deploy

**Demo Account URLs:**
- Admin: https://nexus.onrender.com/admin
- Owner: https://nexus.onrender.com/dashboard
- Pro: https://nexus.onrender.com/dashboard

### 5. AWS (ECS/Lambda)
**Best for:** Enterprise deployments
**URL Pattern:** https://nexus.yourdomain.com

**Setup:**
1. Create ECS cluster and service
2. Build Docker image using provided Dockerfile
3. Push to ECR
4. Deploy to ECS with environment variables
5. Configure ALB for routing
6. Set up CloudFront for CDN (optional)

**Demo Account URLs:**
- Admin: https://nexus.yourdomain.com/admin
- Owner: https://nexus.yourdomain.com/dashboard
- Pro: https://nexus.yourdomain.com/dashboard

### 6. Cloudways (Managed Hosting)
**Best for:** Traditional hosting
**URL Pattern:** https://nexus.cloudwaysapp.com

**Setup:**
1. Create server (DigitalOcean, Vultr, etc.)
2. Install Node.js application
3. Upload code via Git/SFTP
4. Configure environment variables
5. Set up SSL certificate
6. Configure reverse proxy

**Demo Account URLs:**
- Admin: https://nexus.cloudwaysapp.com/admin
- Owner: https://nexus.cloudwaysapp.com/dashboard
- Pro: https://nexus.cloudwaysapp.com/dashboard

### 7. Hostinger (Shared Hosting)
**Best for:** Budget hosting
**URL Pattern:** https://nexus.hostinger.com

**Setup:**
1. Upload built files to public_html
2. Configure .htaccess for SPA routing
3. Set environment variables via cPanel
4. Ensure Node.js support (if available)
5. Set up SSL

**Demo Account URLs:**
- Admin: https://nexus.hostinger.com/admin
- Owner: https://nexus.hostinger.com/dashboard
- Pro: https://nexus.hostinger.com/dashboard

## Demo Accounts Configuration

The platform includes pre-configured demo accounts:

### Admin Account
- **Email:** admin@nexus.demo
- **Password:** NexusAdmin2025!
- **Role:** admin
- **Access:** Full platform control, API vault, user management
- **URL:** /admin

### Agency Owner Account
- **Email:** owner@nexus.demo
- **Password:** NexusOwner2025!
- **Role:** owner
- **Plan:** agency
- **Access:** All features, white-label, 20 workspaces
- **URL:** /dashboard

### Pro User Account
- **Email:** pro@nexus.demo
- **Password:** NexusPro2025!
- **Role:** owner
- **Plan:** pro
- **Access:** Marketing, ads, creative, CRM features
- **URL:** /dashboard

### Starter User Account
- **Email:** starter@nexus.demo
- **Password:** NexusStarter2025!
- **Role:** owner
- **Plan:** starter
- **Access:** Basic CRM, email, 50 AI pieces/month
- **URL:** /dashboard

### Staff Account
- **Email:** staff@nexus.demo
- **Password:** NexusStaff2025!
- **Role:** staff
- **Plan:** pro
- **Access:** Limited permissions under pro org
- **URL:** /dashboard

## Post-Deployment Checklist

### For All Platforms:
- [ ] Environment variables set correctly
- [ ] Database tables created (InsForge)
- [ ] Demo accounts accessible
- [ ] SSL certificate configured
- [ ] Domain DNS pointing correctly
- [ ] CORS configured for API calls

### Frontend-Specific:
- [ ] Static assets loading correctly
- [ ] Images and fonts loading
- [ ] Responsive design working
- [ ] Form submissions working

### Backend-Specific:
- [ ] API endpoints responding
- [ ] Database connections working
- [ ] Authentication working
- [ ] WebSocket connections (if used)

### Testing Demo Accounts:
1. Visit platform URL
2. Click "Login" or go to /login
3. Use demo account credentials
4. Verify correct dashboard loads
5. Test role-specific features

## Troubleshooting

### Common Issues:

**Build Failures:**
- Ensure Node.js version 22
- Check environment variables
- Verify monorepo configuration

**Demo Accounts Not Working:**
- Run `npm run seed:demo` in API
- Check database connectivity
- Verify JWT secrets

**CORS Errors:**
- Configure API URL in frontend env vars
- Check backend CORS settings

**Database Connection Issues:**
- Verify InsForge credentials
- Check network connectivity
- Ensure tables exist

### Platform-Specific Issues:

**Vercel:**
- Check build logs in dashboard
- Verify environment variables
- Ensure correct build settings

**Netlify:**
- Check deploy logs
- Verify netlify.toml configuration
- Check function deployment

**Railway/Render:**
- Check container logs
- Verify environment variables
- Check health endpoints

## Environment Variables Template

Create `.env.example` files in each app directory:

**apps/web/.env.local:**
```
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_WS_URL=wss://your-api-url.com
NEXT_PUBLIC_APP_NAME=NEXUS
NEXT_PUBLIC_APP_URL=https://your-frontend-url.com
NEXT_PUBLIC_INSFORGE_URL=https://your-project.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your-anon-key
```

**apps/api/.env:**
```
NODE_ENV=production
PORT=3001
INSFORGE_URL=https://your-project.insforge.app
INSFORGE_API_KEY=your-api-key
INSFORGE_DB_NAME=nexus
JWT_SECRET=your-64-char-jwt-secret
JWT_REFRESH_SECRET=your-64-char-refresh-secret
ENCRYPTION_KEY=your-32-byte-encryption-key
REDIS_URL=redis://localhost:6379
FRONTEND_URL=https://your-frontend-url.com
SYSTEM_SMTP_HOST=your-smtp-host
SYSTEM_SMTP_PORT=587
SYSTEM_SMTP_USER=your-smtp-user
SYSTEM_SMTP_PASS=your-smtp-pass
SYSTEM_FROM_EMAIL=noreply@yourdomain.com
```

## Health Check Endpoints

Test your deployment with these endpoints:

- **Frontend:** `GET /` - Should load homepage
- **API Health:** `GET /api/health` - Should return 200 OK
- **Auth Test:** `POST /api/auth/login` - Should authenticate demo users
- **Database Test:** `GET /api/admin/vault` - Should return API keys (admin only)

## Success Criteria

✅ **Deployment succeeds without errors**
✅ **Homepage loads with Three.js particles**
✅ **Demo accounts can log in**
✅ **Different dashboards load based on roles**
✅ **All features accessible and functional**
✅ **API calls work correctly**
✅ **Database operations successful**
✅ **SSL certificate active**
✅ **Mobile responsive design**

The platform is now ready for deployment across all major hosting platforms with zero-configuration errors!