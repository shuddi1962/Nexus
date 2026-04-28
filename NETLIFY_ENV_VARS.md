# Environment Variables for Netlify Deployment

## Frontend Environment Variables (Add these to Netlify Build Settings)

```bash
# Application Configuration
NEXT_PUBLIC_APP_NAME=NEXUS
NEXT_PUBLIC_APP_URL=https://your-netlify-site.netlify.app

# API Configuration
NEXT_PUBLIC_API_URL=https://api.nexus.app
NEXT_PUBLIC_WS_URL=wss://api.nexus.app

# InsForge Configuration
NEXT_PUBLIC_INSFORGE_URL=https://wk49fyqm.us-east.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your_insforge_anon_key_here
```

## Backend Environment Variables (For API Functions if deployed to Netlify)

```bash
# InsForge Configuration
INSFORGE_URL=https://wk49fyqm.us-east.insforge.app
INSFORGE_API_KEY=your_insforge_api_key_here
INSFORGE_DB_NAME=nexus

# Application Settings
NODE_ENV=production
PORT=3001
API_BASE_URL=https://api.nexus.app

# JWT Configuration (Generate secure random values)
JWT_SECRET=your_64_char_random_hex_jwt_secret
JWT_REFRESH_SECRET=your_64_char_random_hex_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Encryption (Generate with: openssl rand -hex 32)
ENCRYPTION_KEY=your_32_byte_hex_encryption_key
ENCRYPTION_IV_LENGTH=16

# Redis (if using Redis)
REDIS_URL=redis://localhost:6379

# Email Configuration (Optional)
SYSTEM_SMTP_HOST=your_smtp_host
SYSTEM_SMTP_PORT=587
SYSTEM_SMTP_USER=your_smtp_username
SYSTEM_SMTP_PASS=your_smtp_password
SYSTEM_FROM_EMAIL=noreply@nexus.app

# Frontend URL
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## Netlify-Specific Environment Variables

```bash
# Build Configuration
NODE_VERSION=22

# Netlify Functions (if using Netlify Functions for API)
NETLIFY=true
```

## How to Add Environment Variables in Netlify:

1. **Go to your Netlify site dashboard**
2. **Navigate to: Site Settings → Build & Deploy → Environment Variables**
3. **Add each variable one by one**
4. **Click "Deploy Site" to trigger a new build**

## Important Notes:

- **Generate secure random values** for JWT secrets and encryption keys
- **Replace placeholder URLs** with your actual deployed URLs
- **Keep sensitive keys secure** - never commit them to code
- **Test locally first** with these variables before deploying

## Quick Setup Commands:

```bash
# Generate JWT secrets (64 characters)
openssl rand -hex 32

# Generate encryption key (32 bytes)
openssl rand -hex 32
```

Once you've added these environment variables to Netlify, your next deployment should work successfully! 🚀