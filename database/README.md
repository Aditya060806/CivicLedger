# PostgreSQL Database Setup for CivicLedger

## Prerequisites
- PostgreSQL 12+ installed
- Node.js 18+ installed

## Quick Setup

### 1. Install PostgreSQL
```bash
# Windows (using chocolatey)
choco install postgresql

# macOS (using homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE civicledger;

# Exit PostgreSQL
\q
```

### 3. Setup Schema
```bash
# Navigate to project directory
cd CivicLedger

# Install dependencies
npm install

# Run database setup
npm run db:setup
```

### 4. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
# Set USE_DATABASE=true to enable PostgreSQL
```

## Database Commands

### Setup Database
```bash
npm run db:setup
```

### Reset Database (WARNING: Deletes all data)
```bash
npm run db:reset
```

### Manual Schema Setup
```bash
psql -U postgres -d civicledger -f database/schema.sql
```

## Environment Variables

Required variables in `.env`:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=civicledger
DB_PASSWORD=your_password
DB_PORT=5432
USE_DATABASE=true
```

## Database Schema

The database includes these main tables:
- `policies` - Government policies and smart contracts
- `complaints` - Citizen complaints and reports
- `proposals` - DAO governance proposals
- `fund_flows` - Fund allocation and release tracking
- `votes` - DAO voting records

## Features

### Automatic Fallback
- If PostgreSQL is not available, the system automatically falls back to localStorage
- Set `USE_DATABASE=false` to force localStorage mode

### Performance Optimizations
- Indexed columns for fast queries
- Automatic timestamp updates
- JSONB fields for flexible data storage
- Connection pooling for scalability

### Data Integrity
- Foreign key constraints
- Unique constraints for votes
- Transaction support for complex operations

## Production Deployment

For production, ensure:
1. PostgreSQL is properly configured with SSL
2. Database credentials are secure
3. Connection pooling is optimized
4. Regular backups are scheduled
5. Monitoring is in place

## Troubleshooting

### Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Permission Issues
```bash
# Grant permissions to user
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE civicledger TO your_user;
```

### Schema Issues
```bash
# Drop and recreate database
npm run db:reset
```