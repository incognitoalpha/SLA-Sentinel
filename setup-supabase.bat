@echo off
REM Windows Batch Script for Supabase Setup
REM Run this after creating your Supabase project

echo ========================================
echo SLA Sentinel - Supabase Setup Helper
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "PRD.md" (
    echo Error: Run this script from the project root
    exit /b 1
)

echo Step 1: Collect Supabase Credentials
echo ----------------------------------------
echo Go to: https://supabase.com/dashboard
echo        Your Project ^> Settings ^> API
echo.

set /p SUPABASE_URL="Enter your Supabase URL (e.g., https://xxx.supabase.co): "
set /p SUPABASE_ANON_KEY="Enter your Supabase Anon Key: "
set /p SUPABASE_SERVICE_KEY="Enter your Supabase Service Role Key: "

if "%SUPABASE_URL%"=="" (
    echo Error: Supabase URL is required
    exit /b 1
)

echo.
echo Credentials collected
echo.

REM Create apps/api/.env
echo Step 2: Creating apps/api/.env
echo -----------------------------------

(
echo # Supabase Configuration
echo SUPABASE_URL=%SUPABASE_URL%
echo SUPABASE_SERVICE_ROLE_KEY=%SUPABASE_SERVICE_KEY%
echo SUPABASE_ANON_KEY=%SUPABASE_ANON_KEY%
echo.
echo # Blockchain Configuration ^(Sepolia Testnet^)
echo SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-key
echo ORACLE_PRIVATE_KEY=0xYourPrivateKeyHere
echo SLA_ESCROW_CONTRACT_ADDRESS=0xYourDeployedContractAddress
echo.
echo # Notifications
echo RESEND_API_KEY=re_your_resend_api_key
echo WEBHOOK_SIGNING_SECRET=your-webhook-secret-min-32-chars
echo.
echo # Server Configuration
echo PORT=3002
echo CORS_ORIGIN=http://localhost:3000
echo.
echo # Node Environment
echo NODE_ENV=development
) > apps\api\.env

echo Created apps/api/.env
echo.

REM Create apps/web/.env.local
echo Step 3: Creating apps/web/.env.local
echo ----------------------------------------

(
echo # Supabase Configuration
echo NEXT_PUBLIC_SUPABASE_URL=%SUPABASE_URL%
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=%SUPABASE_ANON_KEY%
echo.
echo # API Configuration
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
) > apps\web\.env.local

echo Created apps/web/.env.local
echo.

echo Step 4: Run Migrations
echo -------------------------
echo Now you need to run the migrations in your Supabase SQL Editor
echo.
echo Go to: %SUPABASE_URL%/project/default/sql/new
echo.
echo Run each migration file in order:
echo   1. apps/api/migrations/001_initial_schema.sql
echo   2. apps/api/migrations/002_rls_policies.sql
echo   3. apps/api/migrations/003_add_evaluated_at.sql
echo.
pause

echo.
echo Step 5: Seed Demo Data
echo -------------------------

cd apps\api
echo Installing dependencies...
call pnpm install

echo Running seed script...
call pnpm seed

cd ..\..

echo.
echo Setup Complete!
echo.
echo Next Steps:
echo   1. In Supabase Dashboard ^> Authentication ^> Users
echo   2. Create a new user with your email
echo   3. Copy the User UUID
echo   4. Run this SQL query:
echo.
echo      insert into profiles ^(id, org_id, role^)
echo      values ^('YOUR_USER_UUID', '00000000-0000-0000-0000-000000000001', 'owner'^);
echo.
echo   5. Start the servers:
echo      Terminal 1: cd apps/api ^&^& pnpm dev
echo      Terminal 2: cd apps/web ^&^& pnpm dev
echo.
echo   6. Open http://localhost:3000 and login!
echo.
pause
