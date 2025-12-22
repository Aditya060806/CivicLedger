// Enhanced ICP Service with PostgreSQL Integration
import { aiService } from './aiService';
import { postgresService } from './postgresService';

export class EnhancedICPService {
  private isAuthenticated = false;
  private useDatabase = false;

  constructor() {
    this.isAuthenticated = true;
    this.useDatabase = import.meta.env.VITE_USE_DATABASE === 'true';
    
    if (!this.useDatabase) {
      this.initializeMockData();
    }
  }

  private initializeMockData() {
    if (!localStorage.getItem('civicledger_initialized')) {
      this.generateSampleData();
      localStorage.setItem('civicledger_initialized', 'true');
    }
  }

  private generateSampleData() {
    const samplePolicies = [
      {
        id: 'POLICY_001',
        title: 'PM Awas Yojana - Phase 3',
        description: 'Housing for All scheme providing affordable housing to urban poor',
        category: 'Housing',
        fund_allocation: 5000000000,
        fund_released: 2500000000,
        beneficiaries: 1250,
        status: 'Active',
        created_at: Date.now(),
        updated_at: Date.now(),
        district: 'Mumbai',
        contractor: 'ABC Construction Ltd',
        eligibility_criteria: ['Below Poverty Line', 'Urban residence'],
        execution_conditions: ['House completion within 18 months'],
        smart_contract_code: '// Smart contract code',
        blockchain_hash: '0x1234567890abcdef',
        icp_transaction_id: 'ICP_TX_001',
        audit_trail: [],
        ai_analysis_score: 0.92,
        transparency_score: 0.95,
        citizen_approval_rate: 0.88
      }
    ];
    localStorage.setItem('civicledger_policies', JSON.stringify(samplePolicies));
  }

  async login(): Promise<boolean> {
    this.isAuthenticated = true;
    return true;
  }

  async logout(): Promise<void> {
    this.isAuthenticated = false;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  // Enhanced Policy Management with PostgreSQL
  async registerPolicy(policyData: {
    title: string;
    description: string;
    category: string;
    fundAllocation: number;
    district: string;
    eligibilityCriteria: string[];
    executionConditions: string[];
  }): Promise<{ success: boolean; policyId?: string; error?: string; aiAnalysis?: any }> {
    try {
      const aiAnalysis = await aiService.optimizePolicy(policyData.title, policyData.description);
      const policyId = `POLICY_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      const newPolicy = {
        id: policyId,
        ...policyData,
        fund_allocation: policyData.fundAllocation,
        fund_released: 0,
        beneficiaries: 0,
        status: 'Draft',
        created_at: Date.now(),
        updated_at: Date.now(),
        contractor: null,
        smart_contract_code: this.generateSmartContract(policyId),
        blockchain_hash: `0x${Math.random().toString(16).substring(2, 18)}`,
        icp_transaction_id: `ICP_TX_${Date.now()}`,
        audit_trail: [],
        ai_analysis_score: aiAnalysis.score / 100,
        transparency_score: 0.95,
        citizen_approval_rate: 0.0,
      };

      if (this.useDatabase) {
        await postgresService.createPolicy(newPolicy);
      } else {
        const policies = this.getStoredPolicies();
        policies.push(newPolicy);
        localStorage.setItem('civicledger_policies', JSON.stringify(policies));
      }
      
      return { success: true, policyId, aiAnalysis };
    } catch (error) {
      console.error('Policy registration error:', error);
      return { success: false, error: 'Failed to register policy' };
    }
  }

  async getAllPolicies(): Promise<any[]> {
    if (this.useDatabase) {
      return await postgresService.getAllPolicies();
    }
    return this.getStoredPolicies();
  }

  async getPolicy(policyId: string): Promise<any | null> {
    if (this.useDatabase) {
      return await postgresService.getPolicyById(policyId);
    }
    const policies = this.getStoredPolicies();
    return policies.find(p => p.id === policyId) || null;
  }

  async activatePolicy(policyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.useDatabase) {
        await postgresService.updatePolicyStatus(policyId, 'Active');
      } else {
        const policies = this.getStoredPolicies();
        const policy = policies.find(p => p.id === policyId);
        
        if (!policy) {
          return { success: false, error: 'Policy not found' };
        }
        
        policy.status = 'Active';
        policy.updated_at = Date.now();
        
        localStorage.setItem('civicledger_policies', JSON.stringify(policies));
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to activate policy' };
    }
  }

  async releaseFunds(policyId: string, amount: number, toAddress: string): Promise<{ success: boolean; flowId?: string; error?: string }> {
    try {
      if (this.useDatabase) {
        const policy = await postgresService.getPolicyById(policyId);
        if (!policy) {
          return { success: false, error: 'Policy not found' };
        }
        
        if (policy.status !== 'Active') {
          return { success: false, error: 'Policy is not active' };
        }
        
        if (policy.fund_released + amount > policy.fund_allocation) {
          return { success: false, error: 'Insufficient funds' };
        }
        
        await postgresService.releaseFunds(policyId, amount);
        
        const flowId = `FLOW_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        await postgresService.createFundFlow({
          id: flowId,
          policy_id: policyId,
          amount: amount,
          from_address: 'government_treasury',
          to_address: toAddress,
          transaction_hash: `0x${Math.random().toString(16).substring(2, 18)}`,
          icp_block_hash: `0x${Math.random().toString(16).substring(2, 18)}`,
        });
        
        return { success: true, flowId };
      } else {
        // Fallback to localStorage
        const policies = this.getStoredPolicies();
        const policy = policies.find(p => p.id === policyId);
        
        if (!policy) {
          return { success: false, error: 'Policy not found' };
        }
        
        if (policy.status !== 'Active') {
          return { success: false, error: 'Policy is not active' };
        }
        
        const currentReleased = Number(policy.fund_released);
        const totalAllocation = Number(policy.fund_allocation);
        
        if (currentReleased + amount > totalAllocation) {
          return { success: false, error: 'Insufficient funds' };
        }
        
        policy.fund_released = currentReleased + amount;
        policy.updated_at = Date.now();
        
        const flowId = `FLOW_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const fundFlows = this.getStoredFundFlows();
        
        fundFlows.push({
          id: flowId,
          policy_id: policyId,
          amount: amount,
          from_address: 'government_treasury',
          to_address: toAddress,
          timestamp: Date.now(),
          status: 'Completed',
          transaction_hash: `0x${Math.random().toString(16).substring(2, 18)}`,
          icp_block_hash: `0x${Math.random().toString(16).substring(2, 18)}`,
        });
        
        localStorage.setItem('civicledger_policies', JSON.stringify(policies));
        localStorage.setItem('civicledger_fund_flows', JSON.stringify(fundFlows));
        
        return { success: true, flowId };
      }
    } catch (error) {
      return { success: false, error: 'Failed to release funds' };
    }
  }

  // Complaint Management with PostgreSQL
  async submitComplaint(complaintData: {
    title: string;
    description: string;
    category: string;
    district: string;
    policyId?: string;
  }): Promise<{ success: boolean; complaintId?: string; error?: string; aiAnalysis?: any }> {
    try {
      const aiAnalysis = await aiService.analyzeComplaint(complaintData.description);
      const complaintId = `COMPLAINT_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      const newComplaint = {
        id: complaintId,
        ...complaintData,
        priority: aiAnalysis.priority,
        status: 'Submitted',
        citizen_id: 'citizen_' + Math.random().toString(36).substring(2, 8),
        created_at: Date.now(),
        updated_at: Date.now(),
        ai_analysis: aiAnalysis,
        audit_score: 0.0,
        resolution_time: null,
        location: null
      };

      if (this.useDatabase) {
        await postgresService.createComplaint(newComplaint);
      } else {
        const complaints = this.getStoredComplaints();
        complaints.push(newComplaint);
        localStorage.setItem('civicledger_complaints', JSON.stringify(complaints));
      }
      
      return { success: true, complaintId, aiAnalysis };
    } catch (error) {
      console.error('Complaint submission error:', error);
      return { success: false, error: 'Failed to submit complaint' };
    }
  }

  async getAllComplaints(): Promise<any[]> {
    if (this.useDatabase) {
      return await postgresService.getAllComplaints();
    }
    return this.getStoredComplaints();
  }

  // DAO Management with PostgreSQL
  async createProposal(proposalData: {
    title: string;
    description: string;
    category: string;
    votingDurationHours: number;
  }): Promise<{ success: boolean; proposalId?: string; error?: string }> {
    try {
      const proposalId = `PROPOSAL_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      const now = Date.now();
      const votingStart = new Date(now + 3600000); // 1 hour from now
      const votingEnd = new Date(now + (proposalData.votingDurationHours * 3600000));
      
      const newProposal = {
        id: proposalId,
        ...proposalData,
        proposer: 'current_user',
        voting_start: votingStart,
        voting_end: votingEnd,
        status: 'Draft',
        yes_votes: 0,
        no_votes: 0,
        abstain_votes: 0,
        total_votes: 0,
        quorum_required: 100,
      };

      if (this.useDatabase) {
        await postgresService.createProposal(newProposal);
      } else {
        const proposals = this.getStoredProposals();
        proposals.push({
          ...newProposal,
          created_at: now,
          voting_start: votingStart.getTime(),
          voting_end: votingEnd.getTime(),
        });
        localStorage.setItem('civicledger_proposals', JSON.stringify(proposals));
      }
      
      return { success: true, proposalId };
    } catch (error) {
      console.error('Proposal creation error:', error);
      return { success: false, error: 'Failed to create proposal' };
    }
  }

  async getAllProposals(): Promise<any[]> {
    if (this.useDatabase) {
      return await postgresService.getAllProposals();
    }
    return this.getStoredProposals();
  }

  async castVote(proposalId: string, voteType: 'Yes' | 'No' | 'Abstain'): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.useDatabase) {
        await postgresService.castVote(proposalId, 'current_user', voteType, 1);
      } else {
        const proposals = this.getStoredProposals();
        const proposal = proposals.find(p => p.id === proposalId);
        
        if (!proposal) {
          return { success: false, error: 'Proposal not found' };
        }
        
        const votingPower = 1;
        switch (voteType) {
          case 'Yes':
            proposal.yes_votes += votingPower;
            break;
          case 'No':
            proposal.no_votes += votingPower;
            break;
          case 'Abstain':
            proposal.abstain_votes += votingPower;
            break;
        }
        proposal.total_votes += votingPower;
        
        localStorage.setItem('civicledger_proposals', JSON.stringify(proposals));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Vote casting error:', error);
      return { success: false, error: 'Failed to cast vote' };
    }
  }

  // Analytics and Metrics with PostgreSQL
  async getMetrics(): Promise<any> {
    if (this.useDatabase) {
      const dbMetrics = await postgresService.getMetrics();
      return {
        total_policies_created: dbMetrics.totalPolicies,
        total_funds_managed: dbMetrics.totalFunds,
        total_beneficiaries: dbMetrics.totalBeneficiaries,
        blockchain_transactions: 0, // Calculate from fund_flows
        india_hub_integrations: dbMetrics.totalPolicies,
        ai_optimizations: dbMetrics.totalPolicies,
        citizen_engagements: dbMetrics.totalComplaints + dbMetrics.totalProposals,
        transparency_score: 0.96,
        hackathon_score: 95.5,
        active_policies: dbMetrics.activePolicies,
        total_complaints: dbMetrics.totalComplaints,
        resolved_complaints: dbMetrics.resolvedComplaints,
        active_proposals: 0, // Calculate based on voting dates
      };
    }
    
    // Fallback to localStorage
    const policies = this.getStoredPolicies();
    const complaints = this.getStoredComplaints();
    const proposals = this.getStoredProposals();
    const fundFlows = this.getStoredFundFlows();
    
    const totalFunds = policies.reduce((sum, p) => sum + Number(p.fund_allocation), 0);
    const releasedFunds = policies.reduce((sum, p) => sum + Number(p.fund_released), 0);
    const totalBeneficiaries = policies.reduce((sum, p) => sum + (p.beneficiaries || 0), 0);
    
    return {
      total_policies_created: policies.length,
      total_funds_managed: totalFunds,
      total_beneficiaries: totalBeneficiaries,
      blockchain_transactions: fundFlows.length,
      india_hub_integrations: policies.filter(p => p.district).length,
      ai_optimizations: policies.filter(p => p.ai_analysis_score).length,
      citizen_engagements: complaints.length + proposals.length,
      transparency_score: 0.96,
      hackathon_score: 95.5,
      active_policies: policies.filter(p => p.status === 'Active').length,
      total_complaints: complaints.length,
      resolved_complaints: complaints.filter(c => c.status === 'Resolved').length,
      active_proposals: proposals.filter(p => p.status === 'Active').length,
    };
  }

  // Utility methods for localStorage fallback
  private getStoredPolicies(): any[] {
    try {
      return JSON.parse(localStorage.getItem('civicledger_policies') || '[]');
    } catch {
      return [];
    }
  }

  private getStoredComplaints(): any[] {
    try {
      return JSON.parse(localStorage.getItem('civicledger_complaints') || '[]');
    } catch {
      return [];
    }
  }

  private getStoredProposals(): any[] {
    try {
      return JSON.parse(localStorage.getItem('civicledger_proposals') || '[]');
    } catch {
      return [];
    }
  }

  private getStoredFundFlows(): any[] {
    try {
      return JSON.parse(localStorage.getItem('civicledger_fund_flows') || '[]');
    } catch {
      return [];
    }
  }

  private generateSmartContract(policyId: string): string {
    return `
// CivicLedger Smart Contract for Policy: ${policyId}
contract PolicyContract {
    address public government;
    uint public fundAllocation;
    uint public fundReleased;
    bool public isActive;
    string public policyId;
    
    event FundsReleased(address indexed recipient, uint amount);
    event PolicyActivated(string policyId, uint timestamp);
    
    constructor(uint _fundAllocation, string memory _policyId) {
        government = msg.sender;
        fundAllocation = _fundAllocation;
        policyId = _policyId;
        isActive = true;
    }
    
    function releaseFunds(uint amount, address recipient) public {
        require(msg.sender == government, "Only government can release funds");
        require(isActive, "Policy is not active");
        require(fundReleased + amount <= fundAllocation, "Insufficient funds");
        
        fundReleased += amount;
        emit FundsReleased(recipient, amount);
    }
}`;
  }
}

export const enhancedICPService = new EnhancedICPService();