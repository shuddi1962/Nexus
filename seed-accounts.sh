#!/bin/bash

# NEXUS Demo Accounts Seeding Script
# This script creates demo accounts in InsForge database

echo "🌱 Seeding NEXUS demo accounts..."

# Demo accounts data
ACCOUNTS=(
  "admin@nexus.demo:NexusAdmin2025!:Platform Admin:admin:agency"
  "owner@nexus.demo:NexusOwner2025!:Agency Owner:owner:agency"
  "pro@nexus.demo:NexusPro2025!:Pro User:owner:pro"
  "starter@nexus.demo:NexusStarter2025!:Starter User:owner:starter"
  "staff@nexus.demo:NexusStaff2025!:Team Member:staff:pro"
)

# Function to hash password (simple hash for demo)
hash_password() {
  echo -n "$1" | sha256sum | cut -d' ' -f1
}

# Create each account
for account in "${ACCOUNTS[@]}"; do
  IFS=':' read -r email password name role plan <<< "$account"

  echo "Creating account: $email"

  # Create user JSON
  user_data=$(cat <<EOF
{
  "email": "$email",
  "password_hash": "$(hash_password "$password")",
  "name": "$name",
  "role": "$role",
  "plan": "$plan",
  "email_verified": true,
  "two_fa_enabled": false,
  "suspended": false
}
EOF
)

  # Insert into InsForge (this would need the actual API key)
  echo "User data prepared for: $email"
  echo "$user_data"
  echo "---"
done

echo "✅ Demo accounts prepared for seeding"
echo ""
echo "To complete seeding, run these commands with your actual InsForge API key:"
echo "npx @insforge/cli db query \"INSERT INTO users (email, password_hash, name, role, plan, email_verified, two_fa_enabled, suspended) VALUES ('admin@nexus.demo', '\$(echo -n 'NexusAdmin2025!' | sha256sum | cut -d' ' -f1)', 'Platform Admin', 'admin', 'agency', true, false, false);\""
echo ""
echo "Or use the seed-demo.ts script after setting up environment variables properly."