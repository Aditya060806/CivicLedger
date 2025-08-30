@echo off
REM 🚀 WCHL25 CIVICLEDGER - ENHANCED ICP DEPLOYMENT SCRIPT (Windows)
REM This script deploys the complete enhanced ICP system with all new canisters

echo 🚀 Starting WCHL25 Enhanced ICP Deployment...
echo ==============================================

REM Check if dfx is installed
where dfx >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ DFX is not installed. Please install DFX first.
    echo Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/
    pause
    exit /b 1
)

REM Check if we're in the backend directory
if not exist "dfx.json" (
    echo ❌ Please run this script from the backend directory
    pause
    exit /b 1
)

REM Stop any running dfx processes
echo [INFO] Stopping any running DFX processes...
dfx stop 2>nul

REM Clean previous builds
echo [INFO] Cleaning previous builds...
dfx start --clean --background

REM Wait for dfx to be ready
echo [INFO] Waiting for DFX to be ready...
timeout /t 10 /nobreak >nul

REM Build all canisters
echo [INFO] Building all enhanced canisters...
dfx build

REM Check if build was successful
if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the build output.
    pause
    exit /b 1
)

echo ✅ All canisters built successfully!

REM Deploy canisters
echo [INFO] Deploying enhanced canisters...

REM Deploy core canisters first
echo [INFO] Deploying smart_policy canister...
dfx deploy smart_policy

echo [INFO] Deploying complaint_handler canister...
dfx deploy complaint_handler

echo [INFO] Deploying dao_manager canister...
dfx deploy dao_manager

echo [INFO] Deploying fund_tracker canister...
dfx deploy fund_tracker

REM Deploy new enhanced canisters
echo [INFO] Deploying india_hub canister...
dfx deploy india_hub

echo [INFO] Deploying blockchain_verifier canister...
dfx deploy blockchain_verifier

echo [INFO] Deploying ai_optimizer canister...
dfx deploy ai_optimizer

REM Deploy frontend last (depends on all other canisters)
echo [INFO] Deploying frontend canister...
dfx deploy frontend

echo ✅ All canisters deployed successfully!

REM Get canister IDs
echo [INFO] Retrieving canister IDs...
for /f "tokens=*" %%i in ('dfx canister id smart_policy') do set SMART_POLICY_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id complaint_handler') do set COMPLAINT_HANDLER_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id dao_manager') do set DAO_MANAGER_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id fund_tracker') do set FUND_TRACKER_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id india_hub') do set INDIA_HUB_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id blockchain_verifier') do set BLOCKCHAIN_VERIFIER_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id ai_optimizer') do set AI_OPTIMIZER_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id frontend') do set FRONTEND_ID=%%i

REM Display canister IDs
echo.
echo 🎉 DEPLOYMENT COMPLETE!
echo ==============================================
echo Canister IDs:
echo   Smart Policy: %SMART_POLICY_ID%
echo   Complaint Handler: %COMPLAINT_HANDLER_ID%
echo   DAO Manager: %DAO_MANAGER_ID%
echo   Fund Tracker: %FUND_TRACKER_ID%
echo   India Hub: %INDIA_HUB_ID%
echo   Blockchain Verifier: %BLOCKCHAIN_VERIFIER_ID%
echo   AI Optimizer: %AI_OPTIMIZER_ID%
echo   Frontend: %FRONTEND_ID%
echo.

REM Create environment file with canister IDs
echo [INFO] Creating environment file...
(
echo # ICP Network Configuration
echo VITE_IC_HOST=https://ic0.app
echo VITE_INTERNET_IDENTITY_URL=https://identity.ic0.app
echo VITE_LEDGER_CANISTER_ID=ryjl3-tyaaa-aaaaa-aaaba-cai
echo VITE_CYCLES_CANISTER_ID=rkp4c-7iaaa-aaaaa-aaaka-cai
echo.
echo # WCHL25 Canister IDs ^(Local Development^)
echo VITE_SMART_POLICY_CANISTER_ID=%SMART_POLICY_ID%
echo VITE_COMPLAINT_HANDLER_CANISTER_ID=%COMPLAINT_HANDLER_ID%
echo VITE_DAO_MANAGER_CANISTER_ID=%DAO_MANAGER_ID%
echo VITE_FUND_TRACKER_CANISTER_ID=%FUND_TRACKER_ID%
echo VITE_INDIA_HUB_CANISTER_ID=%INDIA_HUB_ID%
echo VITE_BLOCKCHAIN_VERIFIER_CANISTER_ID=%BLOCKCHAIN_VERIFIER_ID%
echo VITE_AI_OPTIMIZER_CANISTER_ID=%AI_OPTIMIZER_ID%
echo.
echo # India Hub Configuration
echo VITE_AADHAAR_API_ENDPOINT=https://api.uidai.gov.in
echo VITE_GST_API_ENDPOINT=https://api.gst.gov.in
echo VITE_DIGITAL_LOCKER_ENDPOINT=https://api.digitallocker.gov.in
echo.
echo # Blockchain Configuration
echo VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
echo VITE_POLYGON_RPC_URL=https://polygon-rpc.com
echo VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
echo.
echo # AI Configuration
echo VITE_OPENAI_API_KEY=your_openai_api_key
echo VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
echo VITE_AI_MODEL_ENDPOINT=https://api.openai.com/v1
echo.
echo # Monitoring and Analytics
echo VITE_SENTRY_DSN=your_sentry_dsn
echo VITE_ANALYTICS_ID=your_analytics_id
echo VITE_MONITORING_ENDPOINT=https://api.monitoring.com
) > .env.local

echo ✅ Environment file created: .env.local

REM Test canister functionality
echo [INFO] Testing canister functionality...

echo [INFO] Testing smart_policy canister...
dfx canister call smart_policy get_policies

echo [INFO] Testing india_hub canister...
dfx canister call india_hub get_registrations

echo [INFO] Testing blockchain_verifier canister...
dfx canister call blockchain_verifier get_all_transactions

echo [INFO] Testing ai_optimizer canister...
dfx canister call ai_optimizer get_all_optimizations

echo ✅ All canisters tested successfully!

REM Display access URLs
echo.
echo 🌐 ACCESS URLs:
echo ==============================================
echo Frontend: http://localhost:4943/?canisterId=%FRONTEND_ID%
echo Smart Policy: http://localhost:4943/?canisterId=%SMART_POLICY_ID%
echo India Hub: http://localhost:4943/?canisterId=%INDIA_HUB_ID%
echo Blockchain Verifier: http://localhost:4943/?canisterId=%BLOCKCHAIN_VERIFIER_ID%
echo AI Optimizer: http://localhost:4943/?canisterId=%AI_OPTIMIZER_ID%
echo.

REM Display next steps
echo.
echo 📋 NEXT STEPS:
echo ==============================================
echo 1. Copy the canister IDs to your frontend .env.local file
echo 2. Update the environment variables with your API keys
echo 3. Start the frontend development server: npm run dev
echo 4. Test the enhanced features in the WCHL25 Dashboard
echo 5. Monitor the real-time blockchain integration
echo 6. Test India Hub integrations and compliance features
echo 7. Verify AI-powered optimizations and predictions
echo.

echo 🎉 WCHL25 Enhanced ICP System deployed successfully!
echo Ready for hackathon submission! 🏆

pause
