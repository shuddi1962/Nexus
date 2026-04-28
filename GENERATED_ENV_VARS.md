# 🔐 GENERATED SECURE ENVIRONMENT VARIABLES FOR NEXUS
# Generated on: 2026-04-27T20:38:31+01:00
# These keys were generated using cryptographically secure random generation

## 🚀 COPY THESE TO NETLIFY ENVIRONMENT VARIABLES

### Frontend Environment Variables (Public)
```bash
NEXT_PUBLIC_APP_NAME=NEXUS
NEXT_PUBLIC_APP_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_API_URL=https://api.nexus.app
NEXT_PUBLIC_WS_URL=wss://api.nexus.app
NEXT_PUBLIC_INSFORGE_URL=https://aev8u7h7.us-east.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTg5ODN9.X0j4newr-AMXt8zTaoFoxcP17rrGmL7vD2JYwA5co6g
```

### Backend Environment Variables (Private/Sensitive)
```bash
# InsForge Configuration
INSFORGE_URL=https://aev8u7h7.us-east.insforge.app
INSFORGE_API_KEY=ik_bca0b8f4c8f96f768a2b778bff908fe0
INSFORGE_DB_NAME=nexus

# Application Settings
NODE_ENV=production
PORT=3001
API_BASE_URL=https://api.nexus.app

# 🔑 GENERATED SECURE JWT SECRETS
JWT_SECRET=ba6f94ba617ed03d2dc47544a94377f28a0d299b76deab98b327f8db666ffaab
JWT_REFRESH_SECRET=849770df8413957d9ec570d4e329dafc6a672f4968172fc98cb24ad66bdfff5d
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 🔐 GENERATED ENCRYPTION KEY
ENCRYPTION_KEY=d295cdf8f3617ef869ffd6cd43a17d8fbb801c494cefdde80432ec92d1502a14
ENCRYPTION_IV_LENGTH=16

# Redis (if using Redis)
REDIS_URL=redis://localhost:6379

# Frontend URL
FRONTEND_URL=https://your-netlify-site.netlify.app

# Email Configuration (Optional - Configure in Admin Panel)
SYSTEM_SMTP_HOST=
SYSTEM_SMTP_PORT=587
SYSTEM_SMTP_USER=
SYSTEM_SMTP_PASS=
SYSTEM_FROM_EMAIL=noreply@nexus.app
```

## 📋 NETLIFY SETUP INSTRUCTIONS

### Step 1: Go to Netlify Dashboard
1. Open your Netlify site dashboard
2. Go to **Site Settings** → **Build & Deploy** → **Environment Variables**

### Step 2: Add Environment Variables
Copy and paste each variable individually:

1. `NEXT_PUBLIC_APP_NAME` = `NEXUS`
2. `NEXT_PUBLIC_APP_URL` = `https://your-netlify-site.netlify.app`
3. `NEXT_PUBLIC_API_URL` = `https://api.nexus.app`
4. `NEXT_PUBLIC_WS_URL` = `wss://api.nexus.app`
5. `NEXT_PUBLIC_INSFORGE_URL` = `https://aev8u7h7.us-east.insforge.app`
6. `NEXT_PUBLIC_INSFORGE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTg5ODN9.X0j4newr-AMXt8zTaoFoxcP17rrGmL7vD2JYwA5co6g`

7. `INSFORGE_URL` = `https://aev8u7h7.us-east.insforge.app`
8. `INSFORGE_API_KEY` = `ik_bca0b8f4c8f96f768a2b778bff908fe0`
9. `INSFORGE_DB_NAME` = `nexus`

10. `NODE_ENV` = `production`
11. `PORT` = `3001`
12. `API_BASE_URL` = `https://api.nexus.app`

13. `JWT_SECRET` = `ba6f94ba617ed03d2dc47544a94377f28a0d299b76deab98b327f8db666ffaab`
14. `JWT_REFRESH_SECRET` = `849770df8413957d9ec570d4e329dafc6a672f4968172fc98cb24ad66bdfff5d`
15. `JWT_EXPIRES_IN` = `15m`
16. `JWT_REFRESH_EXPIRES_IN` = `7d`

17. `ENCRYPTION_KEY` = `d295cdf8f3617ef869ffd6cd43a17d8fbb801c494cefdde80432ec92d1502a14`
18. `ENCRYPTION_IV_LENGTH` = `16`

19. `REDIS_URL` = `redis://localhost:6379`
20. `FRONTEND_URL` = `https://your-netlify-site.netlify.app`

### Step 3: Get InsForge Keys
1. Go to **https://wk49fyqm.us-east.insforge.app**
2. Navigate to your project settings
3. Copy the **API Key** for `INSFORGE_API_KEY`
4. Copy the **Anon Key** for `NEXT_PUBLIC_INSFORGE_ANON_KEY`

### Step 4: Deploy
1. Save all environment variables in Netlify
2. Click **"Deploy Site"** or push new commits
3. Monitor the build - it should succeed! ✅

## 🔒 SECURITY NOTES

- **JWT Secrets**: These are cryptographically secure 64-character hex strings
- **Encryption Key**: 32-byte hex key for AES-256-GCM encryption
- **Never commit these values** to version control
- **Use different keys** for production vs staging
- **Rotate keys regularly** for security

## 🎯 READY TO DEPLOY!

Once you've added these environment variables to Netlify, your NEXUS platform will deploy successfully with full security and functionality! 🚀

**Replace `your-netlify-site.netlify.app` with your actual Netlify domain and add your InsForge keys.**