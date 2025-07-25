import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

// Candid interfaces for our canisters
export interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  fund_allocation: bigint;
  fund_released: bigint;
  beneficiaries: number;
  status: PolicyStatus;
  created_at: bigint;
  updated_at: bigint;
  district: string;
  contractor?: string;
  eligibility_criteria: string[];
  execution_conditions: string[];
  smart_contract_code: string;
}

export type PolicyStatus = 
  | { Draft: null }
  | { Active: null }
  | { Paused: null }
  | { UnderReview: null }
  | { Completed: null }
  | { Cancelled: null };

export interface FundFlow {
  id: string;
  policy_id: string;
  amount: bigint;
  from_address: string;
  to_address: string;
  timestamp: bigint;
  status: FundFlowStatus;
  transaction_hash?: string;
}

export type FundFlowStatus = 
  | { Pending: null }
  | { Processing: null }
  | { Completed: null }
  | { Failed: null };

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  policy_id?: string;
  district: string;
  location?: string;
  media_links: string[];
  citizen_id: string;
  created_at: bigint;
  updated_at: bigint;
  ai_analysis?: AIAnalysis;
  audit_score: number;
  resolution_time?: bigint;
}

export type ComplaintPriority = 
  | { Low: null }
  | { Medium: null }
  | { High: null }
  | { Critical: null };

export type ComplaintStatus = 
  | { Submitted: null }
  | { UnderReview: null }
  | { Investigation: null }
  | { Resolved: null }
  | { Dismissed: null }
  | { Escalated: null };

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
  created_at: bigint;
  voting_start: bigint;
  voting_end: bigint;
  status: ProposalStatus;
  yes_votes: number;
  no_votes: number;
  abstain_votes: number;
  total_votes: number;
  quorum_required: number;
  execution_data?: ProposalExecution;
}

export type ProposalStatus = 
  | { Draft: null }
  | { Active: null }
  | { Passed: null }
  | { Rejected: null }
  | { Executed: null }
  | { Expired: null };

export interface ProposalExecution {
  executed_at: bigint;
  executor: string;
  execution_hash: string;
  success: boolean;
  error_message?: string;
}

export type VoteType = 
  | { Yes: null }
  | { No: null }
  | { Abstain: null };

export interface FundTransaction {
  id: string;
  policy_id: string;
  transaction_type: TransactionType;
  amount: bigint;
  from_address: string;
  to_address: string;
  timestamp: bigint;
  status: TransactionStatus;
  transaction_hash: string;
  metadata: [string, string][];
}

export type TransactionType = 
  | { Allocation: null }
  | { Release: null }
  | { Transfer: null }
  | { Refund: null }
  | { Fee: null };

export type TransactionStatus = 
  | { Pending: null }
  | { Processing: null }
  | { Completed: null }
  | { Failed: null }
  | { Cancelled: null };

// Canister IDs (replace with actual deployed canister IDs)
const CANISTER_IDS = {
  smart_policy: import.meta.env.VITE_SMART_POLICY_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  complaint_handler: import.meta.env.VITE_COMPLAINT_HANDLER_CANISTER_ID || 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  dao_manager: import.meta.env.VITE_DAO_MANAGER_CANISTER_ID || 'r7inp-6aaaa-aaaaa-aaabq-cai',
  fund_tracker: import.meta.env.VITE_FUND_TRACKER_CANISTER_ID || 'rno2w-sqaaa-aaaaa-aaacq-cai',
};

// Initialize ICP agent
let agent: HttpAgent | null = null;
let authClient: AuthClient | null = null;

export const initializeICP = async () => {
  try {
    // Initialize auth client
    authClient = await AuthClient.create();
    
    // Check if user is authenticated
    const isAuthenticated = await authClient.isAuthenticated();
    
    if (!isAuthenticated) {
      // Redirect to Internet Identity
      await authClient.login({
        identityProvider: import.meta.env.VITE_INTERNET_IDENTITY_URL || 'https://identity.ic0.app',
        onSuccess: () => {
          console.log('Successfully authenticated with Internet Identity');
        },
      });
    }
    
    // Create agent
    agent = new HttpAgent({
      identity: authClient.getIdentity(),
      host: import.meta.env.VITE_IC_HOST || 'https://ic0.app',
    });
    
    // Fetch root key for local development
    if (import.meta.env.DEV) {
      await agent.fetchRootKey();
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize ICP:', error);
    return false;
  }
};

// Import real services
import { 
  realSmartPolicyService, 
  realComplaintHandlerService, 
  realDAOManagerService, 
  realFundTrackerService,
  analyticsService,
  checkBackendHealth
} from './realICPService';

// Export service instances (use real backend services)
export const smartPolicyService = realSmartPolicyService;
export const complaintHandlerService = realComplaintHandlerService;
export const daoManagerService = realDAOManagerService;
export const fundTrackerService = realFundTrackerService;
export { analyticsService, checkBackendHealth };

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