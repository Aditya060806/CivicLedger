import { io, Socket } from 'socket.io-client';

// Types
export interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  fund_allocation: string; // BigInt as string from API
  fund_released: string; // BigInt as string from API
  beneficiaries: number;
  status: string;
  created_at: string; // BigInt as string from API
  updated_at: string; // BigInt as string from API
  district: string;
  contractor?: string;
  eligibility_criteria: string[];
  execution_conditions: string[];
  smart_contract_code: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  policy_id?: string;
  district: string;
  location?: string;
  media_links: string[];
  citizen_id: string;
  created_at: string; // BigInt as string from API
  updated_at: string; // BigInt as string from API
  ai_analysis?: AIAnalysis;
  audit_score: number;
  resolution_time?: string | null; // BigInt as string from API
}

export interface AIAnalysis {
  sentiment: string;
  category_prediction: string;
  priority_score: number;
  suggested_action: string;
  confidence: number;
  keywords: string[];
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  proposer: string;
  created_at: string; // BigInt as string from API
  voting_start: string; // BigInt as string from API
  voting_end: string; // BigInt as string from API
  status: string;
  yes_votes: number;
  no_votes: number;
  abstain_votes: number;
  total_votes: number;
  quorum_required: number;
  execution_data?: any;
}

export interface FundTransaction {
  id: string;
  policy_id: string;
  transaction_type: string;
  amount: string; // BigInt as string from API
  from_address: string;
  to_address: string;
  timestamp: string; // BigInt as string from API
  status: string;
  transaction_hash: string;
  metadata: [string, string][];
}

export interface AnalyticsOverview {
  totalPolicies: number;
  activePolicies: number;
  totalComplaints: number;
  pendingComplaints: number;
  totalProposals: number;
  activeProposals: number;
  totalTransactions: number;
  totalFundsAllocated: string;
  totalFundsReleased: string;
  utilizationRate: string;
}

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';
const WS_URL = 'http://localhost:3001';

// WebSocket connection
let socket: Socket | null = null;

const getSocket = () => {
  if (!socket) {
    try {
      socket = io(WS_URL, {
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000
      });
      socket.on('connect', () => {
        console.log('Connected to CivicLedger Backend');
      });
      socket.on('disconnect', () => {
        console.log('Disconnected from CivicLedger Backend');
      });
      socket.on('connect_error', (error) => {
        console.warn('WebSocket connection failed:', error);
      });
    } catch (error) {
      console.warn('Failed to initialize WebSocket connection:', error);
      // Return a mock socket that does nothing
      return {
        emit: () => {},
        on: () => {},
        off: () => {}
      } as unknown as Socket;
    }
  }
  return socket;
};

// Utility functions
export const formatBigInt = (value: bigint | string): string => {
  const numValue = typeof value === 'string' ? BigInt(value) : value;
  return (Number(numValue) / 100000000).toFixed(2);
};

export const formatTimestamp = (timestamp: bigint | string): string => {
  const numValue = typeof timestamp === 'string' ? BigInt(timestamp) : timestamp;
  return new Date(Number(numValue) / 1000000).toLocaleString();
};

export const getPolicyStatusText = (status: string): string => {
  return status;
};

export const getComplaintPriorityText = (priority: string): string => {
  return priority;
};

export const getComplaintStatusText = (status: string): string => {
  return status;
};

// API Helper functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error);
    // Return empty data instead of throwing to prevent app crashes
    if (endpoint.includes('/policies')) return [];
    if (endpoint.includes('/complaints')) return [];
    if (endpoint.includes('/proposals')) return [];
    if (endpoint.includes('/transactions')) return [];
    if (endpoint.includes('/analytics')) return {
      totalPolicies: 0,
      activePolicies: 0,
      totalComplaints: 0,
      pendingComplaints: 0,
      totalProposals: 0,
      activeProposals: 0,
      totalTransactions: 0,
      totalFundsAllocated: "0.00",
      totalFundsReleased: "0.00",
      utilizationRate: "0.00"
    };
    throw error;
  }
};

// Smart Policy Service
export class RealSmartPolicyService {
  async registerPolicy(
    title: string,
    description: string,
    category: string,
    fundAllocation: bigint,
    district: string,
    eligibilityCriteria: string[],
    executionConditions: string[]
  ): Promise<string> {
    const policy = await apiCall('/policies', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        category,
        fund_allocation: fundAllocation.toString(),
        district,
        eligibility_criteria: eligibilityCriteria,
        execution_conditions: executionConditions,
      }),
    });
    return policy.id;
  }

  async getPolicy(policyId: string): Promise<Policy> {
    return apiCall(`/policies/${policyId}`);
  }

  async getAllPolicies(): Promise<Policy[]> {
    return apiCall('/policies');
  }

  async activatePolicy(policyId: string): Promise<void> {
    await apiCall(`/policies/${policyId}/activate`, {
      method: 'PUT',
    });
  }

  async releaseFunds(
    policyId: string,
    amount: bigint,
    toAddress: string
  ): Promise<string> {
    const result = await apiCall(`/policies/${policyId}/release-funds`, {
      method: 'POST',
      body: JSON.stringify({
        amount: amount.toString(),
        to_address: toAddress,
      }),
    });
    return result.transaction_id;
  }

  // Real-time updates
  subscribeToUpdates(callback: (policies: Policy[]) => void) {
    const ws = getSocket();
    ws.emit('subscribe_policies');
    ws.on('policies_update', callback);
    return () => {
      ws.off('policies_update', callback);
    };
  }
}

// Complaint Handler Service
export class RealComplaintHandlerService {
  async submitComplaint(
    title: string,
    description: string,
    category: string,
    priority: string,
    policyId: string | undefined,
    district: string,
    location: string | undefined,
    mediaLinks: string[],
    citizenId: string
  ): Promise<string> {
    const complaint = await apiCall('/complaints', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        category,
        priority,
        policy_id: policyId,
        district,
        location,
        media_links: mediaLinks,
        citizen_id: citizenId,
      }),
    });
    return complaint.id;
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return apiCall('/complaints');
  }

  async getComplaint(complaintId: string): Promise<Complaint> {
    return apiCall(`/complaints/${complaintId}`);
  }

  // Real-time updates
  subscribeToUpdates(callback: (complaints: Complaint[]) => void) {
    const ws = getSocket();
    ws.emit('subscribe_complaints');
    ws.on('complaints_update', callback);
    return () => {
      ws.off('complaints_update', callback);
    };
  }
}

// DAO Manager Service
export class RealDAOManagerService {
  async createProposal(
    title: string,
    description: string,
    category: string,
    proposer: string,
    votingDurationHours: bigint,
    quorumRequired: number
  ): Promise<string> {
    const proposal = await apiCall('/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        category,
        proposer,
        voting_duration_hours: votingDurationHours.toString(),
        quorum_required: quorumRequired,
      }),
    });
    return proposal.id;
  }

  async getAllProposals(): Promise<Proposal[]> {
    return apiCall('/proposals');
  }

  async castVote(
    proposalId: string,
    voter: string,
    voteType: string,
    votingPower: number,
    reason: string | undefined
  ): Promise<void> {
    await apiCall(`/proposals/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify({
        voter,
        vote_type: voteType,
        voting_power: votingPower,
        reason,
      }),
    });
  }

  // Real-time updates
  subscribeToUpdates(callback: (proposals: Proposal[]) => void) {
    const ws = getSocket();
    ws.emit('subscribe_proposals');
    ws.on('proposals_update', callback);
    return () => {
      ws.off('proposals_update', callback);
    };
  }
}

// Fund Tracker Service
export class RealFundTrackerService {
  async recordTransaction(
    policyId: string,
    transactionType: string,
    amount: bigint,
    fromAddress: string,
    toAddress: string,
    metadata: [string, string][]
  ): Promise<string> {
    const transaction = await apiCall('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        policy_id: policyId,
        transaction_type: transactionType,
        amount: amount.toString(),
        from_address: fromAddress,
        to_address: toAddress,
        metadata,
      }),
    });
    return transaction.id;
  }

  async getRecentTransactions(limit: number): Promise<FundTransaction[]> {
    return apiCall(`/transactions?limit=${limit}`);
  }

  async getPolicyTransactions(policyId: string): Promise<FundTransaction[]> {
    return apiCall(`/transactions/policy/${policyId}`);
  }

  // Real-time updates
  subscribeToUpdates(callback: (transactions: FundTransaction[]) => void) {
    const ws = getSocket();
    ws.emit('subscribe_transactions');
    ws.on('transactions_update', callback);
    return () => {
      ws.off('transactions_update', callback);
    };
  }
}

// Analytics Service
export class AnalyticsService {
  async getOverview(): Promise<AnalyticsOverview> {
    return apiCall('/analytics/overview');
  }
}

// Export service instances
export const realSmartPolicyService = new RealSmartPolicyService();
export const realComplaintHandlerService = new RealComplaintHandlerService();
export const realDAOManagerService = new RealDAOManagerService();
export const realFundTrackerService = new RealFundTrackerService();
export const analyticsService = new AnalyticsService();

// Health check
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3001/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
}; 