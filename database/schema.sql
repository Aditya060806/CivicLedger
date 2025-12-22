-- CivicLedger PostgreSQL Database Schema

-- Policies table
CREATE TABLE policies (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    fund_allocation BIGINT NOT NULL,
    fund_released BIGINT DEFAULT 0,
    beneficiaries INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Draft',
    district VARCHAR(100) NOT NULL,
    contractor VARCHAR(255),
    eligibility_criteria JSONB,
    execution_conditions JSONB,
    smart_contract_code TEXT,
    blockchain_hash VARCHAR(100),
    icp_transaction_id VARCHAR(100),
    ai_analysis_score DECIMAL(3,2),
    transparency_score DECIMAL(3,2) DEFAULT 0.95,
    citizen_approval_rate DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaints table
CREATE TABLE complaints (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'Submitted',
    policy_id VARCHAR(50) REFERENCES policies(id),
    district VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    citizen_id VARCHAR(50) NOT NULL,
    ai_analysis JSONB,
    audit_score DECIMAL(3,2) DEFAULT 0.0,
    resolution_time BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proposals table
CREATE TABLE proposals (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    proposer VARCHAR(100) NOT NULL,
    voting_start TIMESTAMP NOT NULL,
    voting_end TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    yes_votes INTEGER DEFAULT 0,
    no_votes INTEGER DEFAULT 0,
    abstain_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    quorum_required INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fund flows table
CREATE TABLE fund_flows (
    id VARCHAR(50) PRIMARY KEY,
    policy_id VARCHAR(50) REFERENCES policies(id),
    amount BIGINT NOT NULL,
    from_address VARCHAR(255) NOT NULL,
    to_address VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed',
    transaction_hash VARCHAR(100),
    icp_block_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    proposal_id VARCHAR(50) REFERENCES proposals(id),
    voter VARCHAR(100) NOT NULL,
    vote_type VARCHAR(20) NOT NULL,
    voting_power INTEGER DEFAULT 1,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(proposal_id, voter)
);

-- Indexes for performance
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_district ON policies(district);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_district ON complaints(district);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_fund_flows_policy ON fund_flows(policy_id);

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();