# DFX Setup Guide for CivicLedger

## Prerequisites

Before you can get your canister IDs, you need to install DFX (DFINITY Canister SDK).

## Installation Methods

### Method 1: Manual Installation (Recommended for Windows)

1. **Download DFX:**
   - Go to: https://github.com/dfinity/dfx/releases
   - Download the latest Windows version: `dfx-x86_64-pc-windows-msvc.zip`

2. **Extract and Install:**
   ```powershell
   # Create directory
   mkdir C:\dfx
   
   # Extract the downloaded zip to C:\dfx
   # (Do this manually or use PowerShell)
   Expand-Archive -Path "path\to\dfx-x86_64-pc-windows-msvc.zip" -DestinationPath "C:\dfx"
   
   # Add to PATH
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\dfx", [EnvironmentVariableTarget]::User)
   ```

3. **Restart your terminal and verify:**
   ```powershell
   dfx --version
   ```

### Method 2: Using Chocolatey

1. **Install Chocolatey first:**
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force
   [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
   iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install DFX:**
   ```powershell
   choco install dfx
   ```

### Method 3: Using WSL (Windows Subsystem for Linux)

1. **Install WSL:**
   ```powershell
   wsl --install
   ```

2. **In WSL terminal:**
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

## Getting Your Environment Variables

### Step 1: Deploy Your Canisters

Once DFX is installed:

```bash
# Navigate to backend directory
cd backend

# Start local network (for testing)
dfx start --background --clean

# Build canisters
dfx build

# Deploy to local network
dfx deploy

# For mainnet deployment
dfx deploy --network ic
```

### Step 2: Get Canister IDs

After deployment, get your canister IDs:

```bash
# For local deployment
dfx canister id smart_policy
dfx canister id complaint_handler
dfx canister id dao_manager
dfx canister id fund_tracker
dfx canister id india_hub
dfx canister id blockchain_verifier
dfx canister id ai_optimizer

# For mainnet deployment
dfx canister id smart_policy --network ic
dfx canister id complaint_handler --network ic
dfx canister id dao_manager --network ic
dfx canister id fund_tracker --network ic
dfx canister id india_hub --network ic
dfx canister id blockchain_verifier --network ic
dfx canister id ai_optimizer --network ic
```

### Step 3: Create Your .env File

Copy `env.example` to `.env` and replace the placeholder values:

```env
# ICP Configuration (Fixed values)
VITE_IC_HOST=https://ic0.app
VITE_INTERNET_IDENTITY_URL=https://identity.ic0.app

# Canister IDs (Replace with actual IDs from Step 2)
VITE_SMART_POLICY_CANISTER_ID=your_actual_smart_policy_canister_id
VITE_INDIA_HUB_CANISTER_ID=your_actual_india_hub_canister_id
VITE_BLOCKCHAIN_VERIFIER_CANISTER_ID=your_actual_blockchain_verifier_canister_id
VITE_AI_OPTIMIZER_CANISTER_ID=your_actual_ai_optimizer_canister_id
VITE_COMPLAINT_HANDLER_CANISTER_ID=your_actual_complaint_handler_canister_id
VITE_DAO_MANAGER_CANISTER_ID=your_actual_dao_manager_canister_id
VITE_FUND_TRACKER_CANISTER_ID=your_actual_fund_tracker_canister_id
```

### Step 4: Local Development Setup

For local development, use these settings:

```env
# Local development
VITE_IC_HOST=http://127.0.0.1:4943
VITE_INTERNET_IDENTITY_URL=http://127.0.0.1:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai

# Local canister IDs (will be generated after dfx deploy)
VITE_SMART_POLICY_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai
VITE_INDIA_HUB_CANISTER_ID=ryjl3-tyaaa-aaaaa-aaaba-cai
VITE_BLOCKCHAIN_VERIFIER_CANISTER_ID=r7inp-6aaaa-aaaaa-aaabq-cai
VITE_AI_OPTIMIZER_CANISTER_ID=rno2w-sqaaa-aaaaa-aaacq-cai
VITE_COMPLAINT_HANDLER_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai
VITE_DAO_MANAGER_CANISTER_ID=ryjl3-tyaaa-aaaaa-aaaba-cai
VITE_FUND_TRACKER_CANISTER_ID=r7inp-6aaaa-aaaaa-aaabq-cai
```

## Troubleshooting

### Common Issues

1. **DFX not found:**
   - Ensure DFX is in your PATH
   - Restart your terminal after installation

2. **Network issues:**
   - Check your internet connection
   - Try using a VPN if needed

3. **Permission issues:**
   - Run PowerShell as Administrator
   - Check execution policy: `Get-ExecutionPolicy`

4. **Canister deployment fails:**
   - Ensure you have enough cycles
   - Check canister dependencies
   - Verify your identity is set up: `dfx identity list`

### Verification Commands

```bash
# Check DFX installation
dfx --version

# Check network connectivity
dfx ping

# List identities
dfx identity list

# Check canister status
dfx canister status smart_policy
```

## Next Steps

1. Install DFX using one of the methods above
2. Deploy your canisters
3. Get the canister IDs
4. Update your `.env` file
5. Start your development server: `npm run dev`

## Important Notes

- **Canister IDs are unique** - Each deployment generates new IDs
- **Mainnet vs Local** - Use different networks for production vs development
- **Environment Variables** - Make sure your frontend can access these variables
- **Security** - Never commit your `.env` file to version control
- **Cycles** - Ensure you have enough cycles for mainnet deployment
