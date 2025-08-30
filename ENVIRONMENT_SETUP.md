# Environment Variables Setup Guide

## Current Situation

You need these environment variables for your CivicLedger project:
```env
VITE_IC_HOST=https://ic0.app
VITE_INTERNET_IDENTITY_URL=https://identity.ic0.app
VITE_SMART_POLICY_CANISTER_ID=your_canister_id
VITE_INDIA_HUB_CANISTER_ID=your_canister_id
VITE_BLOCKCHAIN_VERIFIER_CANISTER_ID=your_canister_id
VITE_AI_OPTIMIZER_CANISTER_ID=your_canister_id
```

## Solution Options

### Option 1: Use Placeholder Values (Immediate Solution)

I've created `env.local` with working placeholder values. You can:

1. **Copy the values manually:**
   ```env
   # ICP Configuration for Local Development
   VITE_IC_HOST=http://127.0.0.1:4943
   VITE_INTERNET_IDENTITY_URL=http://127.0.0.1:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai
   
   # Canister IDs (Placeholder values)
   VITE_SMART_POLICY_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai
   VITE_INDIA_HUB_CANISTER_ID=ryjl3-tyaaa-aaaaa-aaaba-cai
   VITE_BLOCKCHAIN_VERIFIER_CANISTER_ID=r7inp-6aaaa-aaaaa-aaabq-cai
   VITE_AI_OPTIMIZER_CANISTER_ID=rno2w-sqaaa-aaaaa-aaacq-cai
   VITE_COMPLAINT_HANDLER_CANISTER_ID=rrkah-fqaaa-aaaaa-aaaaq-cai
   VITE_DAO_MANAGER_CANISTER_ID=ryjl3-tyaaa-aaaaa-aaaba-cai
   VITE_FUND_TRACKER_CANISTER_ID=r7inp-6aaaa-aaaaa-aaabq-cai
   ```

2. **Create your .env file manually** with these values

### Option 2: Install DFX (Recommended for Full Functionality)

#### Manual DFX Installation Steps:

1. **Download DFX manually:**
   - Go to: https://github.com/dfinity/dfx/releases
   - Download: `dfx-x86_64-pc-windows-msvc.zip`

2. **Extract and install:**
   ```powershell
   # Create directory
   mkdir C:\dfx
   
   # Extract the downloaded zip to C:\dfx
   # (Do this manually in File Explorer)
   
   # Add to PATH
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\dfx", [EnvironmentVariableTarget]::User)
   ```

3. **Restart terminal and verify:**
   ```powershell
   dfx --version
   ```

#### Alternative: Use WSL (Windows Subsystem for Linux)

1. **Install WSL:**
   ```powershell
   wsl --install
   ```

2. **In WSL terminal:**
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

### Option 3: Use Docker (Advanced)

If you have Docker installed:
```bash
# Run DFX in Docker
docker run --rm -it -v ${PWD}:/workspace dfinity/dfx:latest
```

## Getting Real Canister IDs

Once DFX is installed:

### Step 1: Deploy Canisters
```bash
cd backend
dfx start --background --clean
dfx build
dfx deploy
```

### Step 2: Get Canister IDs
```bash
dfx canister id smart_policy
dfx canister id india_hub
dfx canister id blockchain_verifier
dfx canister id ai_optimizer
dfx canister id complaint_handler
dfx canister id dao_manager
dfx canister id fund_tracker
```

### Step 3: Update Environment Variables
Replace placeholder values with actual canister IDs in your `.env` file.

## Testing Your Setup

### Test with Placeholder Values
```bash
# Start your development server
npm run dev
```

### Test with Real Canisters
```bash
# After DFX installation and deployment
npm run dev
```

## Troubleshooting

### Common Issues:

1. **DFX Installation Problems:**
   - Try manual download from GitHub releases
   - Use WSL as alternative
   - Check Windows Defender/firewall settings

2. **Network Issues:**
   - Use VPN if needed
   - Check proxy settings
   - Try different DNS servers

3. **Permission Issues:**
   - Run PowerShell as Administrator
   - Check execution policy: `Get-ExecutionPolicy`

### Verification Commands:
```bash
# Check if environment variables are loaded
echo $env:VITE_IC_HOST

# Check if canisters are accessible
curl http://127.0.0.1:4943
```

## Next Steps

1. **Immediate:** Use placeholder values from `env.local`
2. **Short-term:** Install DFX using manual method
3. **Long-term:** Deploy to mainnet and get real canister IDs

## Important Notes

- **Placeholder values work for development** but won't connect to real canisters
- **Canister IDs are unique** - each deployment generates new ones
- **Never commit .env files** to version control
- **Local development** uses different URLs than production

## Quick Start Commands

```bash
# Copy environment variables
copy env.local .env

# Start development server
npm run dev

# Install dependencies if needed
npm install
```
