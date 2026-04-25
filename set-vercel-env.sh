#!/bin/bash

# Vercel CLI commands to set environment variables
# Run this after installing Vercel CLI and logging in

# Generate secure keys (run these first to get values)
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

echo "Generated keys:"
echo "JWT_SECRET=$JWT_SECRET"
echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Type: https://api.nexus.app

vercel env add NEXT_PUBLIC_WS_URL production
# Type: wss://api.nexus.app

vercel env add NEXT_PUBLIC_APP_NAME production
# Type: NEXUS

vercel env add NEXT_PUBLIC_APP_URL production
# Type: https://nexus.app

vercel env add NEXT_PUBLIC_INSFORGE_URL production
# Type: https://wk49fyqm.us-east.insforge.app

vercel env add NEXT_PUBLIC_INSFORGE_ANON_KEY production
# Type: [your InsForge anon key]

vercel env add INSFORGE_API_KEY production
# Type: [your InsForge API key]

vercel env add JWT_SECRET production
# Type: $JWT_SECRET

vercel env add JWT_REFRESH_SECRET production
# Type: $JWT_REFRESH_SECRET

vercel env add ENCRYPTION_KEY production
# Type: $ENCRYPTION_KEY

vercel env add REDIS_URL production
# Type: redis://localhost:6379

echo "Environment variables setup complete!"
echo "Make sure to deploy your changes after setting these."