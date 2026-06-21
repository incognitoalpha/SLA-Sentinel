#!/bin/bash
# Supabase Setup Helper Script
# Run this after creating your Supabase project

set -e

echo "🚀 SLA Sentinel - Supabase Setup Helper"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "PRD.md" ]; then
    echo "❌ Error: Run this script from the project root"
    exit 1
fi

# Function to prompt for input with validation
prompt_required() {
    local var_name=$1
    local prompt_text=$2
    local value

    while [ -z "$value" ]; do
        read -p "$prompt_text: " value
        if [ -z "$value" ]; then
            echo "❌ This field is required"
        fi
    done

    echo "$value"
}

echo "📝 Step 1: Collect Supabase Credentials"
echo "----------------------------------------"
echo "Go to: https://supabase.com/dashboard → Your Project → Settings → API"
echo ""

SUPABASE_URL=$(prompt_required "SUPABASE_URL" "Enter your Supabase URL (e.g., https://xxx.supabase.co)")
SUPABASE_ANON_KEY=$(prompt_required "SUPABASE_ANON_KEY" "Enter your Supabase Anon Key")
SUPABASE_SERVICE_KEY=$(prompt_required "SUPABASE_SERVICE_KEY" "Enter your Supabase Service Role Key")

echo ""
echo "✅ Credentials collected"
echo ""

# Create apps/api/.env
echo "📝 Step 2: Creating apps/api/.env"
echo "-----------------------------------"

cat > apps/api/.env <<EOF
# Supabase Configuration
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Blockchain Configuration (Sepolia Testnet)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-key
ORACLE_PRIVATE_KEY=0xYourPrivateKeyHere
SLA_ESCROW_CONTRACT_ADDRESS=0xYourDeployedContractAddress

# Notifications
RESEND_API_KEY=re_your_resend_api_key
WEBHOOK_SIGNING_SECRET=your-webhook-secret-min-32-chars

# Server Configuration
PORT=3002
CORS_ORIGIN=http://localhost:3000

# Node Environment
NODE_ENV=development
EOF

echo "✅ Created apps/api/.env"
echo ""

# Create apps/web/.env.local
echo "📝 Step 3: Creating apps/web/.env.local"
echo "----------------------------------------"

cat > apps/web/.env.local <<EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
EOF

echo "✅ Created apps/web/.env.local"
echo ""

echo "📝 Step 4: Run Migrations"
echo "-------------------------"
echo "Now you need to run the migrations in your Supabase SQL Editor"
echo ""
echo "Go to: ${SUPABASE_URL}/project/default/sql/new"
echo ""
echo "Run each migration file in order:"
echo "  1. apps/api/migrations/001_initial_schema.sql"
echo "  2. apps/api/migrations/002_rls_policies.sql"
echo "  3. apps/api/migrations/003_add_evaluated_at.sql"
echo ""
read -p "Press ENTER after you've run all migrations..."

echo ""
echo "📝 Step 5: Seed Demo Data"
echo "-------------------------"

cd apps/api
echo "Installing dependencies..."
pnpm install --silent

echo "Running seed script..."
pnpm seed

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo "  1. In Supabase Dashboard → Authentication → Users"
echo "  2. Create a new user with your email"
echo "  3. Copy the User UUID"
echo "  4. Run this SQL query:"
echo ""
echo "     insert into profiles (id, org_id, role)"
echo "     values ('YOUR_USER_UUID', '00000000-0000-0000-0000-000000000001', 'owner');"
echo ""
echo "  5. Start the servers:"
echo "     Terminal 1: cd apps/api && pnpm dev"
echo "     Terminal 2: cd apps/web && pnpm dev"
echo ""
echo "  6. Open http://localhost:3000 and login!"
echo ""
