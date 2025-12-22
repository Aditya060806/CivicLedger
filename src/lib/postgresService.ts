// PostgreSQL service - only available in Node.js environment
let pool: any = null;

// Check if we're in a browser environment
if (typeof window === 'undefined') {
  try {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/civicledger',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  } catch (error) {
    console.warn('PostgreSQL not available in browser environment');
  }
}

export class PostgreSQLService {
  // Policy operations
  async createPolicy(policyData: any) {
    if (!pool) throw new Error('Database not available in browser environment');
    
    const query = `
      INSERT INTO policies (id, title, description, category, fund_allocation, district, 
                           eligibility_criteria, execution_conditions, smart_contract_code, 
                           blockchain_hash, icp_transaction_id, ai_analysis_score, transparency_score)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const values = [
      policyData.id, policyData.title, policyData.description, policyData.category,
      policyData.fundAllocation, policyData.district, JSON.stringify(policyData.eligibilityCriteria),
      JSON.stringify(policyData.executionConditions), policyData.smart_contract_code,
      policyData.blockchain_hash, policyData.icp_transaction_id, policyData.ai_analysis_score,
      policyData.transparency_score
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getAllPolicies() {
    const query = 'SELECT * FROM policies ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  async getPolicyById(id: string) {
    const query = 'SELECT * FROM policies WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async updatePolicyStatus(id: string, status: string) {
    const query = 'UPDATE policies SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  async releaseFunds(policyId: string, amount: number) {
    const query = 'UPDATE policies SET fund_released = fund_released + $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [amount, policyId]);
    return result.rows[0];
  }

  // Complaint operations
  async createComplaint(complaintData: any) {
    const query = `
      INSERT INTO complaints (id, title, description, category, priority, district, 
                             location, citizen_id, ai_analysis, policy_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      complaintData.id, complaintData.title, complaintData.description, complaintData.category,
      complaintData.priority, complaintData.district, complaintData.location, complaintData.citizen_id,
      JSON.stringify(complaintData.ai_analysis), complaintData.policy_id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getAllComplaints() {
    const query = 'SELECT * FROM complaints ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  async updateComplaintStatus(id: string, status: string) {
    const query = 'UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  // Proposal operations
  async createProposal(proposalData: any) {
    const query = `
      INSERT INTO proposals (id, title, description, category, proposer, voting_start, 
                            voting_end, quorum_required)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      proposalData.id, proposalData.title, proposalData.description, proposalData.category,
      proposalData.proposer, proposalData.voting_start, proposalData.voting_end, proposalData.quorum_required
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getAllProposals() {
    const query = 'SELECT * FROM proposals ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  async castVote(proposalId: string, voter: string, voteType: string, votingPower: number = 1) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert vote
      const voteQuery = `
        INSERT INTO votes (proposal_id, voter, vote_type, voting_power)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (proposal_id, voter) DO UPDATE SET
        vote_type = EXCLUDED.vote_type, voting_power = EXCLUDED.voting_power
      `;
      await client.query(voteQuery, [proposalId, voter, voteType, votingPower]);
      
      // Update proposal vote counts
      const updateQuery = `
        UPDATE proposals SET
        yes_votes = (SELECT COALESCE(SUM(voting_power), 0) FROM votes WHERE proposal_id = $1 AND vote_type = 'Yes'),
        no_votes = (SELECT COALESCE(SUM(voting_power), 0) FROM votes WHERE proposal_id = $1 AND vote_type = 'No'),
        abstain_votes = (SELECT COALESCE(SUM(voting_power), 0) FROM votes WHERE proposal_id = $1 AND vote_type = 'Abstain'),
        total_votes = (SELECT COALESCE(SUM(voting_power), 0) FROM votes WHERE proposal_id = $1)
        WHERE id = $1
      `;
      await client.query(updateQuery, [proposalId]);
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Fund flow operations
  async createFundFlow(flowData: any) {
    const query = `
      INSERT INTO fund_flows (id, policy_id, amount, from_address, to_address, 
                             transaction_hash, icp_block_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      flowData.id, flowData.policy_id, flowData.amount, flowData.from_address,
      flowData.to_address, flowData.transaction_hash, flowData.icp_block_hash
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getFundFlowsByPolicy(policyId: string) {
    const query = 'SELECT * FROM fund_flows WHERE policy_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [policyId]);
    return result.rows;
  }

  // Analytics
  async getMetrics() {
    const queries = {
      totalPolicies: 'SELECT COUNT(*) as count FROM policies',
      activePolicies: "SELECT COUNT(*) as count FROM policies WHERE status = 'Active'",
      totalComplaints: 'SELECT COUNT(*) as count FROM complaints',
      resolvedComplaints: "SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'",
      totalProposals: 'SELECT COUNT(*) as count FROM proposals',
      totalFunds: 'SELECT COALESCE(SUM(fund_allocation), 0) as sum FROM policies',
      releasedFunds: 'SELECT COALESCE(SUM(fund_released), 0) as sum FROM policies',
      totalBeneficiaries: 'SELECT COALESCE(SUM(beneficiaries), 0) as sum FROM policies'
    };

    const results = await Promise.all(
      Object.entries(queries).map(async ([key, query]) => {
        const result = await pool.query(query);
        return [key, result.rows[0].count || result.rows[0].sum || 0];
      })
    );

    return Object.fromEntries(results);
  }
}

export const postgresService = new PostgreSQLService();