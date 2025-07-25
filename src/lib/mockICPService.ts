// Mock ICP Service for testing without DFX
// This simulates the canister functionality until DFX is properly installed

import { Policy, PolicyStatus, Complaint, ComplaintPriority, ComplaintStatus, Proposal, VoteType, FundTransaction, TransactionType, TransactionStatus } from './icpService';

// Mock data storage
let mockPolicies: Policy[] = [];
let mockComplaints: Complaint[] = [];
let mockProposals: Proposal[] = [];
let mockTransactions: FundTransaction[] = [];

// Initialize with sample data
const initializeMockData = () => {
  // Sample policies
  mockPolicies = [
    {
      id: "policy-001",
      title: "PM Awas Yojana - Phase 3",
      description: "Housing for All scheme providing affordable housing to urban poor",
      category: "Housing",
      fund_allocation: BigInt(5000000000), // 5 crore
      fund_released: BigInt(2500000000), // 2.5 crore
      beneficiaries: 1250,
      status: { Active: null },
      created_at: BigInt(Date.now() * 1000000),
      updated_at: BigInt(Date.now() * 1000000),
      district: "Mumbai",
      contractor: "ABC Construction Ltd",
      eligibility_criteria: ["Below Poverty Line", "Urban residence", "No existing house"],
      execution_conditions: ["House completion within 18 months", "Quality standards compliance"],
      smart_contract_code: "// Smart contract for PM Awas Yojana\ncontract PMAYContract {\n    // Implementation details\n}"
    },
    {
      id: "policy-002",
      title: "Digital India Infrastructure",
      description: "Building digital infrastructure across rural areas",
      category: "Technology",
      fund_allocation: BigInt(3000000000), // 3 crore
      fund_released: BigInt(1500000000), // 1.5 crore
      beneficiaries: 500,
      status: { Active: null },
      created_at: BigInt(Date.now() * 1000000),
      updated_at: BigInt(Date.now() * 1000000),
      district: "Bangalore",
      contractor: "Tech Solutions Inc",
      eligibility_criteria: ["Rural areas", "No internet connectivity"],
      execution_conditions: ["Fiber optic installation", "WiFi hotspot setup"],
      smart_contract_code: "// Smart contract for Digital India\ncontract DigitalIndiaContract {\n    // Implementation details\n}"
    }
  ];

  // Sample complaints
  mockComplaints = [
    {
      id: "complaint-001",
      title: "Delayed Construction Work",
      description: "PM Awas Yojana construction has been delayed by 3 months",
      category: "Infrastructure",
      priority: { High: null },
      status: { UnderReview: null },
      policy_id: "policy-001",
      district: "Mumbai",
      location: "Andheri West",
      media_links: ["photo1.jpg", "photo2.jpg"],
      citizen_id: "citizen-001",
      created_at: BigInt(Date.now() * 1000000),
      updated_at: BigInt(Date.now() * 1000000),
      ai_analysis: {
        sentiment: "negative",
        category_prediction: "construction_delay",
        priority_score: 0.8,
        suggested_action: "Investigate contractor performance",
        confidence: 0.85,
        keywords: ["delay", "construction", "timeline"]
      },
      audit_score: 0.7,
      resolution_time: undefined
    }
  ];

  // Sample proposals
  mockProposals = [
    {
      id: "proposal-001",
      title: "Increase Fund Allocation for Rural Areas",
      description: "Proposal to increase fund allocation for rural development schemes",
      category: "Governance",
      proposer: "citizen-002",
      created_at: BigInt(Date.now() * 1000000),
      voting_start: BigInt(Date.now() * 1000000),
      voting_end: BigInt(Date.now() * 1000000 + 7 * 24 * 3600 * 1000000000), // 7 days
      status: { Active: null },
      yes_votes: 45,
      no_votes: 12,
      abstain_votes: 3,
      total_votes: 60,
      quorum_required: 50,
      execution_data: undefined
    }
  ];

  // Sample transactions
  mockTransactions = [
    {
      id: "tx-001",
      policy_id: "policy-001",
      transaction_type: { Allocation: null },
      amount: BigInt(5000000000),
      from_address: "government_treasury",
      to_address: "policy_contract",
      timestamp: BigInt(Date.now() * 1000000),
      status: { Completed: null },
      transaction_hash: "0x1234567890abcdef",
      metadata: [["purpose", "initial_allocation"], ["scheme", "pmay"]]
    },
    {
      id: "tx-002",
      policy_id: "policy-001",
      transaction_type: { Release: null },
      amount: BigInt(2500000000),
      from_address: "policy_contract",
      to_address: "contractor_wallet",
      timestamp: BigInt(Date.now() * 1000000),
      status: { Completed: null },
      transaction_hash: "0xabcdef1234567890",
      metadata: [["purpose", "construction_payment"], ["phase", "foundation"]]
    }
  ];
};

// Initialize mock data
initializeMockData();

// Mock Smart Policy Service
export class MockSmartPolicyService {
  async registerPolicy(
    title: string,
    description: string,
    category: string,
    fundAllocation: bigint,
    district: string,
    eligibilityCriteria: string[],
    executionConditions: string[]
  ): Promise<string> {
    const policyId = `policy-${Date.now()}`;
    const now = BigInt(Date.now() * 1000000);
    
    const policy: Policy = {
      id: policyId,
      title,
      description,
      category,
      fund_allocation: fundAllocation,
      fund_released: BigInt(0),
      beneficiaries: 0,
      status: { Draft: null },
      created_at: now,
      updated_at: now,
      district,
      contractor: undefined,
      eligibility_criteria: eligibilityCriteria,
      execution_conditions: executionConditions,
      smart_contract_code: `// Smart Contract for ${title}\ncontract ${title.replace(/\s+/g, '')}Contract {\n    // Auto-generated contract\n}`
    };
    
    mockPolicies.push(policy);
    return policyId;
  }

  async getPolicy(policyId: string): Promise<Policy> {
    const policy = mockPolicies.find(p => p.id === policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }
    return policy;
  }

  async getAllPolicies(): Promise<Policy[]> {
    return mockPolicies;
  }

  async activatePolicy(policyId: string): Promise<void> {
    const policy = mockPolicies.find(p => p.id === policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }
    policy.status = { Active: null };
    policy.updated_at = BigInt(Date.now() * 1000000);
  }

  async releaseFunds(
    policyId: string,
    amount: bigint,
    toAddress: string
  ): Promise<string> {
    const policy = mockPolicies.find(p => p.id === policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }
    
    if (policy.fund_released + amount > policy.fund_allocation) {
      throw new Error("Insufficient funds");
    }
    
    policy.fund_released += amount;
    policy.updated_at = BigInt(Date.now() * 1000000);
    
    // Create transaction record
    const transactionId = `tx-${Date.now()}`;
    const transaction: FundTransaction = {
      id: transactionId,
      policy_id: policyId,
      transaction_type: { Release: null },
      amount,
      from_address: "government_treasury",
      to_address: toAddress,
      timestamp: BigInt(Date.now() * 1000000),
      status: { Completed: null },
      transaction_hash: `0x${Math.random().toString(16).substr(2, 16)}`,
      metadata: [["purpose", "fund_release"], ["recipient", toAddress]]
    };
    
    mockTransactions.push(transaction);
    return transactionId;
  }
}

// Mock Complaint Handler Service
export class MockComplaintHandlerService {
  async submitComplaint(
    title: string,
    description: string,
    category: string,
    priority: ComplaintPriority,
    policyId: string | undefined,
    district: string,
    location: string | undefined,
    mediaLinks: string[],
    citizenId: string
  ): Promise<string> {
    const complaintId = `complaint-${Date.now()}`;
    const now = BigInt(Date.now() * 1000000);
    
    const complaint: Complaint = {
      id: complaintId,
      title,
      description,
      category,
      priority,
      status: { Submitted: null },
      policy_id: policyId,
      district,
      location,
      media_links: mediaLinks,
      citizen_id: citizenId,
      created_at: now,
      updated_at: now,
             ai_analysis: {
         sentiment: description.includes("delay") || description.includes("problem") ? "negative" : "neutral",
         category_prediction: category,
         priority_score: 'Critical' in priority ? 0.9 : 'High' in priority ? 0.7 : 'Medium' in priority ? 0.5 : 0.3,
         suggested_action: "Investigate and respond within 48 hours",
         confidence: 0.85,
         keywords: ["government", "service", "issue"]
       },
      audit_score: 0.5,
      resolution_time: undefined
    };
    
    mockComplaints.push(complaint);
    return complaintId;
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return mockComplaints;
  }

  async getComplaint(complaintId: string): Promise<Complaint> {
    const complaint = mockComplaints.find(c => c.id === complaintId);
    if (!complaint) {
      throw new Error("Complaint not found");
    }
    return complaint;
  }
}

// Mock DAO Manager Service
export class MockDAOManagerService {
  async createProposal(
    title: string,
    description: string,
    category: string,
    proposer: string,
    votingDurationHours: bigint,
    quorumRequired: number
  ): Promise<string> {
    const proposalId = `proposal-${Date.now()}`;
    const now = BigInt(Date.now() * 1000000);
    const votingStart = now + BigInt(3600 * 1000000000); // 1 hour from now
    const votingEnd = votingStart + (votingDurationHours * BigInt(3600 * 1000000000));
    
    const proposal: Proposal = {
      id: proposalId,
      title,
      description,
      category,
      proposer,
      created_at: now,
      voting_start: votingStart,
      voting_end: votingEnd,
      status: { Draft: null },
      yes_votes: 0,
      no_votes: 0,
      abstain_votes: 0,
      total_votes: 0,
      quorum_required: quorumRequired,
      execution_data: undefined
    };
    
    mockProposals.push(proposal);
    return proposalId;
  }

  async getAllProposals(): Promise<Proposal[]> {
    return mockProposals;
  }

  async castVote(
    proposalId: string,
    voter: string,
    voteType: VoteType,
    votingPower: number,
    reason: string | undefined
  ): Promise<void> {
    const proposal = mockProposals.find(p => p.id === proposalId);
    if (!proposal) {
      throw new Error("Proposal not found");
    }
    
    if ('Yes' in voteType) {
      proposal.yes_votes += votingPower;
    } else if ('No' in voteType) {
      proposal.no_votes += votingPower;
    } else if ('Abstain' in voteType) {
      proposal.abstain_votes += votingPower;
    }
    
    proposal.total_votes += votingPower;
  }
}

// Mock Fund Tracker Service
export class MockFundTrackerService {
  async recordTransaction(
    policyId: string,
    transactionType: TransactionType,
    amount: bigint,
    fromAddress: string,
    toAddress: string,
    metadata: [string, string][]
  ): Promise<string> {
    const transactionId = `tx-${Date.now()}`;
    const now = BigInt(Date.now() * 1000000);
    
    const transaction: FundTransaction = {
      id: transactionId,
      policy_id: policyId,
      transaction_type: transactionType,
      amount,
      from_address: fromAddress,
      to_address: toAddress,
      timestamp: now,
      status: { Completed: null },
      transaction_hash: `0x${Math.random().toString(16).substr(2, 16)}`,
      metadata
    };
    
    mockTransactions.push(transaction);
    return transactionId;
  }

  async getRecentTransactions(limit: number): Promise<FundTransaction[]> {
    return mockTransactions
      .sort((a, b) => Number(b.timestamp - a.timestamp))
      .slice(0, limit);
  }

  async getPolicyTransactions(policyId: string): Promise<FundTransaction[]> {
    return mockTransactions.filter(t => t.policy_id === policyId);
  }
}

// Export mock service instances
export const mockSmartPolicyService = new MockSmartPolicyService();
export const mockComplaintHandlerService = new MockComplaintHandlerService();
export const mockDAOManagerService = new MockDAOManagerService();
export const mockFundTrackerService = new MockFundTrackerService();

// Utility functions
export const formatBigInt = (value: bigint): string => {
  return (Number(value) / 100000000).toFixed(2);
};

export const formatTimestamp = (timestamp: bigint): string => {
  return new Date(Number(timestamp) / 1000000).toLocaleString();
};

export const getPolicyStatusText = (status: PolicyStatus): string => {
  if ('Draft' in status) return 'Draft';
  if ('Active' in status) return 'Active';
  if ('Paused' in status) return 'Paused';
  if ('UnderReview' in status) return 'Under Review';
  if ('Completed' in status) return 'Completed';
  if ('Cancelled' in status) return 'Cancelled';
  return 'Unknown';
};

export const getComplaintPriorityText = (priority: ComplaintPriority): string => {
  if ('Low' in priority) return 'Low';
  if ('Medium' in priority) return 'Medium';
  if ('High' in priority) return 'High';
  if ('Critical' in priority) return 'Critical';
  return 'Unknown';
};

export const getComplaintStatusText = (status: ComplaintStatus): string => {
  if ('Submitted' in status) return 'Submitted';
  if ('UnderReview' in status) return 'Under Review';
  if ('Investigation' in status) return 'Investigation';
  if ('Resolved' in status) return 'Resolved';
  if ('Dismissed' in status) return 'Dismissed';
  if ('Escalated' in status) return 'Escalated';
  return 'Unknown';
}; 