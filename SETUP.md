# 🚀 CivicLedger Setup Guide

## Quick Start Options

### Option 1: Development Mode (localStorage) - Fastest
```bash
npm install
npm run dev
```
✅ No database required, data stored in browser

### Option 2: Production Mode (PostgreSQL) - Full Features

## 📋 Prerequisites
- Node.js 18+
- PostgreSQL 14+ (for production mode)

## 🔧 Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Choose Your Mode

#### A. Development Mode (Default)
```bash
# Just run - uses localStorage
npm run dev
```
Open http://localhost:5173

#### B. Production Mode with PostgreSQL

**Step 1: Install PostgreSQL**

Windows:
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use chocolatey:
choco install postgresql
```

Mac:
```bash
brew install postgresql
brew services start postgresql
```

Linux:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Step 2: Create Database**
```bash
# Login to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE civicledger;
\q
```

**Step 3: Setup Database Schema**
```bash
# Run schema setup
npm run db:setup

# Or manually:
psql -U postgres -d civicledger -f database/schema.sql
```

**Step 4: Configure Environment**

Edit `.env` file:
```env
USE_DATABASE=true
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/civicledger
```

**Step 5: Start Application**
```bash
npm run dev
```

## 🔑 Environment Variables

### Required for Development Mode
```env
USE_DATABASE=false
```

### Required for Production Mode
```env
USE_DATABASE=true
DATABASE_URL=postgresql://username:password@host:port/database
```

### Optional (ICP Integration)
```env
VITE_IC_HOST=https://ic0.app
VITE_INTERNET_IDENTITY_URL=https://identity.ic0.app
VITE_SMART_POLICY_CANISTER_ID=your_canister_id
```

## 🛠️ Database Management

### Reset Database
```bash
npm run db:reset
```

### Manual Database Operations
```bash
# Connect to database
psql -U postgres -d civicledger

# View tables
\dt

# Query data
SELECT * FROM policies;
SELECT * FROM complaints;
SELECT * FROM proposals;

# Exit
\q
```

## 🧪 Testing Your Setup

### 1. Check Application is Running
- Open http://localhost:5173
- You should see the CivicLedger dashboard

### 2. Test Policy Creation
- Navigate to Policy Maker
- Create a test policy
- Check if it appears in dashboard

### 3. Test Complaint Submission
- Navigate to Citizen Portal
- Submit a test complaint
- Verify it appears in complaints list

### 4. Verify Database (Production Mode)
```bash
psql -U postgres -d civicledger -c "SELECT COUNT(*) FROM policies;"
```

## 🐛 Troubleshooting

### Issue: "psql: command not found"
**Solution**: Add PostgreSQL to PATH or use full path
```bash
# Windows
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
```

### Issue: "database does not exist"
**Solution**: Create database first
```bash
psql -U postgres -c "CREATE DATABASE civicledger;"
```

### Issue: "password authentication failed"
**Solution**: Update DATABASE_URL with correct password
```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/civicledger
```

### Issue: Port 5173 already in use
**Solution**: Kill process or use different port
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

## 📊 Data Storage Comparison

| Feature | localStorage | PostgreSQL |
|---------|-------------|------------|
| Setup Time | Instant | 5-10 minutes |
| Data Persistence | Browser only | Server-side |
| Multi-user | No | Yes |
| Analytics | Limited | Full SQL |
| Production Ready | No | Yes |
| Best For | Development | Production |

## 🎯 Recommended Workflow

1. **Start with localStorage** for quick testing
2. **Switch to PostgreSQL** when:
   - Testing multi-user features
   - Need persistent data
   - Preparing for deployment
   - Running analytics queries

## 📝 Next Steps

After setup:
1. ✅ Create sample policies
2. ✅ Test complaint submission
3. ✅ Try DAO voting
4. ✅ Monitor fund tracking
5. ✅ Explore analytics dashboard

## 🆘 Need Help?

- Check logs: Browser Console (F12)
- Database logs: `psql -U postgres -d civicledger`
- GitHub Issues: [Report a bug](https://github.com/civicledger/issues)

---

**Ready to build transparent governance! 🏛️✨**
