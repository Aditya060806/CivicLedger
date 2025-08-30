#!/bin/bash

# 🚀 WCHL25 CIVICLEDGER - ENHANCED ICP DEPLOYMENT SCRIPT
# This script deploys the complete enhanced ICP system with all new canisters

set -e

echo "🚀 Starting WCHL25 Enhanced ICP Deployment..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    print_error "DFX is not installed. Please install DFX first."
    exit 1
fi

# Check if we're in the backend directory
if [ ! -f "dfx.json" ]; then
    print_error "Please run this script from the backend directory"
    exit 1
fi

# Stop any running dfx processes
print_status "Stopping any running DFX processes..."
dfx stop 2>/dev/null || true

# Clean previous builds
print_status "Cleaning previous builds..."
dfx start --clean --background

# Wait for dfx to be ready
print_status "Waiting for DFX to be ready..."
sleep 10

# Build all canisters
print_status "Building all enhanced canisters..."
dfx build

# Check if build was successful
if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the build output."
    exit 1
fi

print_success "All canisters built successfully!"

# Deploy canisters
print_status "Deploying enhanced canisters..."

# Deploy core canisters first
print_status "Deploying smart_policy canister..."
dfx deploy smart_policy

print_status "Deploying complaint_handler canister..."
dfx deploy complaint_handler

print_status "Deploying dao_manager canister..."
dfx deploy dao_manager

print_status "Deploying fund_tracker canister..."
dfx deploy fund_tracker

# Deploy new enhanced canisters
print_status "Deploying india_hub canister..."
dfx deploy india_hub

print_status "Deploying blockchain_verifier canister..."
dfx deploy blockchain_verifier

print_status "Deploying ai_optimizer canister..."
dfx deploy ai_optimizer

# Deploy frontend last (depends on all other canisters)
print_status "Deploying frontend canister..."
dfx deploy frontend

print_success "All canisters deployed successfully!"

# Get canister IDs
print_status "Retrieving canister IDs..."
SMART_POLICY_ID=$(dfx canister id smart_policy)
COMPLAINT_HANDLER_ID=$(dfx canister id complaint_handler)
DAO_MANAGER_ID=$(dfx canister id dao_manager)
FUND_TRACKER_ID=$(dfx canister id fund_tracker)
INDIA_HUB_ID=$(dfx canister id india_hub)
BLOCKCHAIN_VERIFIER_ID=$(dfx canister id blockchain_verifier)
AI_OPTIMIZER_ID=$(dfx canister id ai_optimizer)
FRONTEND_ID=$(dfx canister id frontend)

# Display canister IDs
echo ""
print_success "🎉 DEPLOYMENT COMPLETE!"
echo "=============================================="
echo "Canister IDs:"
echo "  Smart Policy: $SMART_POLICY_ID"
echo "  Complaint Handler: $COMPLAINT_HANDLER_ID"
echo "  DAO Manager: $DAO_MANAGER_ID"
echo "  Fund Tracker: $FUND_TRACKER_ID"
echo "  India Hub: $INDIA_HUB_ID"
echo "  Blockchain Verifier: $BLOCKCHAIN_VERIFIER_ID"
echo "  AI Optimizer: $AI_OPTIMIZER_ID"
echo "  Frontend: $FRONTEND_ID"
echo ""

# Create environment file with canister IDs
print_status "Creating environment file..."
cat > .env.local << EOF
# ICP Network Configuration
VITE_IC_HOST=https://ic0.app
VITE_INTERNET_IDENTITY_URL=https://identity.ic0.app
VITE_LEDGER_CANISTER_ID=ryjl3-tyaaa-aaaaa-aaaba-cai
VITE_CYCLES_CANISTER_ID=rkp4c-7iaaa-aaaaa-aaaka-cai

# WCHL25 Canister IDs (Local Development)
VITE_SMART_POLICY_CANISTER_ID=$SMART_POLICY_ID
VITE_COMPLAINT_HANDLER_CANISTER_ID=$COMPLAINT_HANDLER_ID
VITE_DAO_MANAGER_CANISTER_ID=$DAO_MANAGER_ID
VITE_FUND_TRACKER_CANISTER_ID=$FUND_TRACKER_ID
VITE_INDIA_HUB_CANISTER_ID=$INDIA_HUB_ID
VITE_BLOCKCHAIN_VERIFIER_CANISTER_ID=$BLOCKCHAIN_VERIFIER_ID
VITE_AI_OPTIMIZER_CANISTER_ID=$AI_OPTIMIZER_ID

# India Hub Configuration
VITE_AADHAAR_API_ENDPOINT=https://api.uidai.gov.in
VITE_GST_API_ENDPOINT=https://api.gst.gov.in
VITE_DIGITAL_LOCKER_ENDPOINT=https://api.digitallocker.gov.in

# Blockchain Configuration
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
VITE_POLYGON_RPC_URL=https://polygon-rpc.com
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# AI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_AI_MODEL_ENDPOINT=https://api.openai.com/v1

# Monitoring and Analytics
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ANALYTICS_ID=your_analytics_id
VITE_MONITORING_ENDPOINT=https://api.monitoring.com
EOF

print_success "Environment file created: .env.local"

# Test canister functionality
print_status "Testing canister functionality..."

# Test smart policy canister
print_status "Testing smart_policy canister..."
dfx canister call smart_policy get_policies

# Test india hub canister
print_status "Testing india_hub canister..."
dfx canister call india_hub get_registrations

# Test blockchain verifier canister
print_status "Testing blockchain_verifier canister..."
dfx canister call blockchain_verifier get_all_transactions

# Test ai optimizer canister
print_status "Testing ai_optimizer canister..."
dfx canister call ai_optimizer get_all_optimizations

print_success "All canisters tested successfully!"

# Display access URLs
echo ""
print_success "🌐 ACCESS URLs:"
echo "=============================================="
echo "Frontend: http://localhost:4943/?canisterId=$FRONTEND_ID"
echo "Smart Policy: http://localhost:4943/?canisterId=$SMART_POLICY_ID"
echo "India Hub: http://localhost:4943/?canisterId=$INDIA_HUB_ID"
echo "Blockchain Verifier: http://localhost:4943/?canisterId=$BLOCKCHAIN_VERIFIER_ID"
echo "AI Optimizer: http://localhost:4943/?canisterId=$AI_OPTIMIZER_ID"
echo ""

# Display next steps
echo ""
print_success "📋 NEXT STEPS:"
echo "=============================================="
echo "1. Copy the canister IDs to your frontend .env.local file"
echo "2. Update the environment variables with your API keys"
echo "3. Start the frontend development server: npm run dev"
echo "4. Test the enhanced features in the WCHL25 Dashboard"
echo "5. Monitor the real-time blockchain integration"
echo "6. Test India Hub integrations and compliance features"
echo "7. Verify AI-powered optimizations and predictions"
echo ""

print_success "🎉 WCHL25 Enhanced ICP System deployed successfully!"
print_success "Ready for hackathon submission! 🏆"
