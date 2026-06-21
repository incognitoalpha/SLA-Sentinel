#!/bin/bash
# Verify Supabase Setup Script
# Run this to check if everything is working

set -e

echo "🔍 SLA Sentinel - Setup Verification"
echo "====================================="
echo ""

# Check if .env files exist
echo "📁 Checking environment files..."
if [ ! -f "apps/api/.env" ]; then
    echo "❌ apps/api/.env not found"
    echo "   Run ./setup-supabase.sh first"
    exit 1
fi

if [ ! -f "apps/web/.env.local" ]; then
    echo "❌ apps/web/.env.local not found"
    echo "   Run ./setup-supabase.sh first"
    exit 1
fi

echo "✅ Environment files exist"
echo ""

# Check if Supabase credentials are set
echo "🔑 Checking Supabase credentials..."
source apps/api/.env

if [ "$SUPABASE_URL" = "https://your-project.supabase.co" ]; then
    echo "❌ SUPABASE_URL not configured"
    echo "   Run ./setup-supabase.sh to set credentials"
    exit 1
fi

echo "✅ Supabase URL: $SUPABASE_URL"
echo ""

# Test Supabase connection
echo "🌐 Testing Supabase connection..."
cd apps/api

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install --silent
fi

# Simple connection test
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
    try {
        const { data, error } = await supabase.from('organizations').select('count');
        if (error) {
            console.error('❌ Database connection failed:', error.message);
            process.exit(1);
        }
        console.log('✅ Database connection successful');
        console.log('');
    } catch (err) {
        console.error('❌ Connection test failed:', err.message);
        process.exit(1);
    }
})();
" || exit 1

# Check if tables exist
echo "📊 Checking database tables..."
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const tables = [
    'organizations',
    'profiles',
    'providers',
    'endpoints',
    'probes',
    'agreements',
    'evaluations',
    'breaches',
    'alerts',
    'audit_log'
];

(async () => {
    for (const table of tables) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (error) {
            console.log('❌', table, '- not found');
            console.log('   Run migrations in Supabase SQL Editor');
            process.exit(1);
        } else {
            console.log('✅', table);
        }
    }
    console.log('');
})();
" || exit 1

# Check if demo data exists
echo "🎭 Checking demo data..."
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
    const { data: orgs } = await supabase.from('organizations').select('*');
    const { data: providers } = await supabase.from('providers').select('*');
    const { data: endpoints } = await supabase.from('endpoints').select('*');

    console.log('  Organizations:', orgs?.length || 0);
    console.log('  Providers:', providers?.length || 0);
    console.log('  Endpoints:', endpoints?.length || 0);
    console.log('');

    if (!orgs || orgs.length === 0) {
        console.log('⚠️  No demo data found - run: pnpm seed');
    } else {
        console.log('✅ Demo data exists');
    }
    console.log('');
})();
"

cd ../..

echo "✅ Verification Complete!"
echo ""
echo "🎯 Ready to start development:"
echo "  Terminal 1: cd apps/api && pnpm dev"
echo "  Terminal 2: cd apps/web && pnpm dev"
echo "  Browser:    http://localhost:3000"
echo ""
