// Unified CivicLedger Service - Production Ready
import { enhancedICPService } from './enhancedICPService';
import { aiService } from './aiService';

export interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  fund_allocation: number;
  fund_released: number;
  beneficiaries: number;
  status: string;
  created_at: number;
  updated_at: number;
  district: string;
  contractor?: string;
  eligibility_criteria: string[];
  execution_conditions: string[];
  smart_contract_code: string;
  blockchain_hash?: string;
  icp_transaction_id?: string;
  audit_trail: AuditEntry[];
  ai_analysis_score?: number;
  transparency_score: number;
  citizen_approval_rate: number;
}

export interface AuditEntry {
  timestamp: number;
  action: string;
  actor: string;
  details: string;
  blockchain_hash?: string;
  icp_transaction_id?: string;
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
  created_at: number;
  updated_at: number;
  ai_analysis?: any;
  audit_score: number;
  resolution_time?: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  proposer: string;
  created_at: number;
  voting_start: number;
  voting_end: number;
  status: string;
  yes_votes: number;
  no_votes: number;
  abstain_votes: number;
  total_votes: number;
  quorum_required: number;
  execution_data?: any;
}

export interface Metrics {
  total_policies_created: number;
  total_funds_managed: number;
  total_beneficiaries: number;
  blockchain_transactions: number;
  india_hub_integrations: number;
  ai_optimizations: number;
  citizen_engagements: number;
  transparency_score: number;
  hackathon_score: number;
  active_policies: number;
  total_complaints: number;
  resolved_complaints: number;
  active_proposals: number;
}

class CivicLedgerService {
  // Policy Management
  async registerPolicy(policyData: {
    title: string;
    description: string;
    category: string;
    fundAllocation: number;
    district: string;
    eligibilityCriteria: string[];
    executionConditions: string[];
  }): Promise<{ success: boolean; policyId?: string; error?: string; aiAnalysis?: any }> {
    return await enhancedICPService.registerPolicy(policyData);
  }

  async getAllPolicies(): Promise<Policy[]> {
    return await enhancedICPService.getAllPolicies();
  }

  async getPolicy(policyId: string): Promise<Policy | null> {
    return await enhancedICPService.getPolicy(policyId);
  }

  async activatePolicy(policyId: string): Promise<{ success: boolean; error?: string }> {
    return await enhancedICPService.activatePolicy(policyId);
  }

  async releaseFunds(policyId: string, amount: number, toAddress: string): Promise<{ success: boolean; flowId?: string; error?: string }> {
    return await enhancedICPService.releaseFunds(policyId, amount, toAddress);
  }

  // Complaint Management
  async submitComplaint(complaintData: {
    title: string;
    description: string;
    category: string;
    district: string;
    policyId?: string;
  }): Promise<{ success: boolean; complaintId?: string; error?: string; aiAnalysis?: any }> {
    return await enhancedICPService.submitComplaint(complaintData);
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return await enhancedICPService.getAllComplaints();
  }

  // DAO Management
  async createProposal(proposalData: {
    title: string;
    description: string;
    category: string;
    votingDurationHours: number;
  }): Promise<{ success: boolean; proposalId?: string; error?: string }> {
    return await enhancedICPService.createProposal(proposalData);
  }

  async getAllProposals(): Promise<Proposal[]> {
    return await enhancedICPService.getAllProposals();
  }

  async castVote(proposalId: string, voteType: 'Yes' | 'No' | 'Abstain'): Promise<{ success: boolean; error?: string }> {
    return await enhancedICPService.castVote(proposalId, voteType);
  }

  // Analytics and Metrics
  async getMetrics(): Promise<Metrics> {
    return await enhancedICPService.getMetrics();
  }

  // Authentication
  async login(): Promise<boolean> {
    return await enhancedICPService.login();
  }

  async logout(): Promise<void> {
    return await enhancedICPService.logout();
  }

  isAuthenticated(): boolean {
    return enhancedICPService.isUserAuthenticated();
  }

  // AI Services
  async generatePolicySummary(policies: Policy[]): Promise<string> {
    return await aiService.generatePolicySummary(policies);
  }

  async analyzeComplaint(description: string): Promise<any> {
    return await aiService.analyzeComplaint(description);
  }

  async optimizePolicy(title: string, description: string): Promise<any> {
    return await aiService.optimizePolicy(title, description);
  }

  // Utility Methods
  formatCurrency(amount: number): string {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  calculateProgress(released: number, allocated: number): number {
    return allocated > 0 ? Math.min((released / allocated) * 100, 100) : 0;
  }

  generateMockData(): void {
    // Initialize with sample data for demo
    const samplePolicies = [
      {
        title: "PM Awas Yojana - Phase 3",
        description: "Housing for All scheme providing affordable housing to urban poor with enhanced transparency and citizen participation",
        category: "Housing",
        fundAllocation: 5000000000,
        district: "Mumbai",
        eligibilityCriteria: ["Below Poverty Line", "Urban residence", "No existing house"],
        executionConditions: ["House completion within 18 months", "Quality standards compliance"]
      },
      {
        title: "Digital India Infrastructure",
        description: "Building digital infrastructure across rural areas with fiber optic connectivity and digital literacy programs",
        category: "Technology",
        fundAllocation: 3000000000,
        district: "Bangalore",
        eligibilityCriteria: ["Rural areas", "No internet connectivity"],
        executionConditions: ["Fiber optic installation", "WiFi hotspot setup"]
      },
      {
        title: "Swachh Bharat Mission 2.0",
        description: "Enhanced cleanliness drive with waste management and sanitation facilities in urban and rural areas",
        category: "Environment",
        fundAllocation: 2500000000,
        district: "Delhi",
        eligibilityCriteria: ["Public areas", "Community participation"],
        executionConditions: ["Waste segregation", "Regular monitoring"]
      }
    ];

    // Register sample policies
    samplePolicies.forEach(async (policy) => {
      await this.registerPolicy(policy);
    });
  }
}

export const civicLedgerService = new CivicLedgerService();