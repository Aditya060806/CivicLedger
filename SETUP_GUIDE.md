# 🚀 CivicLedger Setup Guide

## 📋 Prerequisites

Before setting up CivicLedger, ensure you have the following installed:

### Required Software
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/) (latest stable)
- [Git](https://git-scm.com/) (latest version)

### Optional but Recommended
- [Visual Studio Code](https://code.visualstudio.com/) with Rust extension
- [Windows Terminal](https://apps.microsoft.com/detail/9n0dx20hk701) for better terminal experience

---

## 🔧 DFX Installation

### Option 1: Using WSL (Recommended for Windows)

1. **Install WSL2**:
   ```powershell
   wsl --install
   ```
   Restart your computer when prompted.

2. **Install Ubuntu** (if not automatically installed):
   ```powershell
   wsl --install -d Ubuntu
   ```

3. **Open Ubuntu terminal** and install DFX:
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

4. **Add DFX to PATH**:
   ```bash
   echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

5. **Verify installation**:
   ```bash
   dfx --version
   ```

### Option 2: Manual Installation (Windows)

1. **Download DFX** from the official releases:
   - Visit: https://github.com/dfinity/dfx/releases
   - Download the latest Windows release (dfx-x.x.x-x86_64-windows.zip)

2. **Extract and install**:
   ```powershell
   # Extract to a directory (e.g., C:\dfx)
   # Add C:\dfx to your system PATH
   ```

3. **Verify installation**:
   ```powershell
   dfx --version
   ```

### Option 3: Using Chocolatey (Windows)

1. **Install Chocolatey** (if not already installed):
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install DFX**:
   ```powershell
   choco install dfx
   ```

---

## 🏗️ Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd CivicLedger

# Install frontend dependencies
npm install

# Navigate to backend
cd backend

# Install Rust dependencies (if needed)
cargo build
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# ICP Configuration
REACT_APP_IC_HOST=https://ic0.app
REACT_APP_INTERNET_IDENTITY_URL=https://identity.ic0.app

# Canister IDs (will be updated after deployment)
REACT_APP_SMART_POLICY_CANISTER_ID=your_smart_policy_canister_id
REACT_APP_COMPLAINT_HANDLER_CANISTER_ID=your_complaint_handler_canister_id
REACT_APP_DAO_MANAGER_CANISTER_ID=your_dao_manager_canister_id
REACT_APP_FUND_TRACKER_CANISTER_ID=your_fund_tracker_canister_id
```

### 3. Local Development Setup

```bash
# Start local ICP network
dfx start --background --clean

# In a new terminal, build and deploy canisters
cd backend
dfx build
dfx deploy

# Generate Candid bindings
dfx generate

# Start frontend development server
cd ..
npm run dev
```

### 4. Mainnet Deployment

```bash
# Configure for mainnet
dfx identity use default
dfx identity get-principal

# Deploy to mainnet
dfx deploy --network ic

# Get canister IDs
dfx canister id smart_policy --network ic
dfx canister id complaint_handler --network ic
dfx canister id dao_manager --network ic
dfx canister id fund_tracker --network ic
```

---

## 🧪 Testing

### Frontend Tests
```bash
npm test
npm run test:coverage
```

### Backend Tests
```bash
cd backend
cargo test
cargo test --all-features
```

### PocketIC Tests
```bash
cd backend
cargo test --package smart_policy
cargo test --package complaint_handler
cargo test --package dao_manager
cargo test --package fund_tracker
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. DFX Not Found
```bash
# Ensure DFX is in your PATH
echo $PATH
which dfx

# If not found, add to PATH manually
export PATH="$HOME/bin:$PATH"
```

#### 2. Rust Dependencies Issues
```bash
# Update Rust
rustup update

# Clean and rebuild
cargo clean
cargo build
```

#### 3. Node.js Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Canister Deployment Issues
```bash
# Check DFX status
dfx ping

# Reset local network
dfx stop
dfx start --clean --background

# Redeploy
dfx deploy
```

#### 5. Windows-Specific Issues

**WSL Installation Problems**:
```powershell
# Enable WSL feature
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart computer, then install WSL
wsl --install
```

**PowerShell Execution Policy**:
```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📱 Development Workflow

### 1. Daily Development
```bash
# Start local network
dfx start --background

# Deploy changes
dfx deploy

# Start frontend
npm run dev
```

### 2. Testing Changes
```bash
# Run all tests
npm test
cd backend && cargo test

# Check linting
npm run lint
```

### 3. Deployment to Mainnet
```bash
# Build for production
npm run build

# Deploy canisters
dfx deploy --network ic

# Update environment variables with new canister IDs
```

---

## 🔐 Security Considerations

### 1. Identity Management
```bash
# Create new identity for development
dfx identity new dev-identity

# Use specific identity
dfx identity use dev-identity

# List identities
dfx identity list
```

### 2. Environment Variables
- Never commit `.env` files to version control
- Use different identities for development and production
- Regularly rotate canister controllers

### 3. Testing
- Always test on local network before mainnet
- Use PocketIC for comprehensive testing
- Validate all canister interactions

---

## 📚 Additional Resources

### Documentation
- [ICP Developer Docs](https://internetcomputer.org/docs)
- [DFX Documentation](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- [Rust CDK Guide](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)

### Community
- [ICP Discord](https://discord.gg/dfinity)
- [ICP Forum](https://forum.dfinity.org/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/internet-computer)

### Tools
- [ICP Dashboard](https://dashboard.internetcomputer.org/)
- [Candid UI](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/)
- [ICP Explorer](https://dashboard.internetcomputer.org/canister)

---

## 🎯 Next Steps

1. **Complete DFX Installation** using one of the methods above
2. **Set up local development environment**
3. **Deploy canisters to local network**
4. **Test all features thoroughly**
5. **Deploy to mainnet for production**
6. **Record demo video** using the provided script
7. **Submit to WCHL25 hackathon**

---

## 🆘 Getting Help

If you encounter any issues:

1. **Check the troubleshooting section** above
2. **Search existing issues** in the repository
3. **Create a new issue** with detailed information
4. **Join the ICP community** for support

**Remember**: CivicLedger is designed to be transparent and accountable - just like the governance it enables! 🏛️✨ 