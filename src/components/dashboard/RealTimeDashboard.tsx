import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus,
  Building2, 
  AlertTriangle, 
  Vote, 
  TrendingUp, 
  CheckCircle, 
  DollarSign,
  Users,
  FileText,
  Activity
} from 'lucide-react';
import { icpService, Policy } from '@/lib/icpService';

// Mock data types for backward compatibility
interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  district: string;
  created_at: bigint;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  proposer: string;
  created_at: bigint;
  status: string;
  yes_votes: number;
  no_votes: number;
  total_votes: number;
}

interface FundTransaction {
  id: string;
  policy_id: string;
  transaction_type: string;
  amount: bigint;
  from_address: string;
  to_address: string;
  timestamp: bigint;
  status: string;
  transaction_hash: string;
}

export default function RealTimeDashboard() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    description: '',
    category: '',
    fundAllocation: '',
    district: '',
    eligibilityCriteria: '',
    executionConditions: ''
  });

  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    district: ''
  });

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: '',
    proposer: ''
  });

  useEffect(() => {
    loadData();
    setupRealTimeUpdates();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load policies using the new service
      const policiesData = await icpService.mockGetAllPolicies();
      setPolicies(policiesData);
      
      // Mock data for other services
      const mockComplaints: Complaint[] = [
        {
          id: 'COMP_001',
          title: 'Road Maintenance Issue',
          description: 'Potholes on main road need immediate attention',
          category: 'Infrastructure',
          priority: 'High',
          status: 'Under Review',
          district: 'Mumbai',
          created_at: BigInt(Date.now() * 1000000),
        },
        {
          id: 'COMP_002',
          title: 'Water Supply Problem',
          description: 'Irregular water supply in residential area',
          category: 'Utilities',
          priority: 'Medium',
          status: 'Investigation',
          district: 'Bangalore',
          created_at: BigInt(Date.now() * 1000000),
        },
      ];
      
      const mockProposals: Proposal[] = [
        {
          id: 'PROP_001',
          title: 'Digital Infrastructure Upgrade',
          description: 'Proposal to upgrade digital infrastructure across the city',
          category: 'Technology',
          proposer: 'Tech Committee',
          created_at: BigInt(Date.now() * 1000000),
          status: 'Active',
          yes_votes: 45,
          no_votes: 12,
          total_votes: 57,
        },
        {
          id: 'PROP_002',
          title: 'Green Energy Initiative',
          description: 'Implement solar panels in government buildings',
          category: 'Environment',
          proposer: 'Environmental Council',
          created_at: BigInt(Date.now() * 1000000),
          status: 'Active',
          yes_votes: 38,
          no_votes: 8,
          total_votes: 46,
        },
      ];
      
      const mockTransactions: FundTransaction[] = [
        {
          id: 'TXN_001',
          policy_id: 'POLICY_001',
          transaction_type: 'Release',
          amount: BigInt(2500000000),
          from_address: 'government_treasury',
          to_address: 'contractor_wallet',
          timestamp: BigInt(Date.now() * 1000000),
          status: 'Completed',
          transaction_hash: '0x1234567890abcdef...',
        },
        {
          id: 'TXN_002',
          policy_id: 'POLICY_002',
          transaction_type: 'Release',
          amount: BigInt(1500000000),
          from_address: 'government_treasury',
          to_address: 'tech_solutions_wallet',
          timestamp: BigInt(Date.now() * 1000000),
          status: 'Completed',
          transaction_hash: '0xabcdef1234567890...',
        },
      ];
      
      setComplaints(mockComplaints);
      setProposals(mockProposals);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  };

  const handleActivatePolicy = async (policyId: string) => {
    try {
      await icpService.activatePolicy(policyId);
      await loadData();
    } catch (error) {
      console.error('Failed to activate policy:', error);
    }
  };

  const handleReleaseFunds = async (policyId: string) => {
    try {
      const amount = BigInt(1000000000); // 1 crore
      await icpService.releaseFunds(policyId, amount, "contractor_wallet");
      await loadData();
    } catch (error) {
      console.error('Failed to release funds:', error);
    }
  };

  const handleCreatePolicy = async () => {
    try {
      const fundAllocation = BigInt(parseInt(newPolicy.fundAllocation) * 100000000);
      const eligibilityCriteria = newPolicy.eligibilityCriteria.split(',').map(c => c.trim());
      const executionConditions = newPolicy.executionConditions.split(',').map(c => c.trim());
      
      await icpService.registerPolicy(
        newPolicy.title,
        newPolicy.description,
        newPolicy.category,
        fundAllocation,
        newPolicy.district,
        eligibilityCriteria,
        executionConditions
      );
      
      // Reset form
      setNewPolicy({
        title: '',
        description: '',
        category: '',
        fundAllocation: '',
        district: '',
        eligibilityCriteria: '',
        executionConditions: ''
      });
      
      await loadData();
    } catch (error) {
      console.error('Failed to create policy:', error);
    }
  };

  const handleSubmitComplaint = async () => {
    try {
      // Mock complaint submission
      const newComplaintData: Complaint = {
        id: `COMP_${Date.now()}`,
        title: newComplaint.title,
        description: newComplaint.description,
        category: newComplaint.category,
        priority: newComplaint.priority,
        status: 'Submitted',
        district: newComplaint.district,
        created_at: BigInt(Date.now() * 1000000),
      };
      
      setComplaints(prev => [...prev, newComplaintData]);
      
      // Reset form
      setNewComplaint({
        title: '',
        description: '',
        category: '',
        priority: '',
        district: ''
      });
    } catch (error) {
      console.error('Failed to submit complaint:', error);
    }
  };

  const handleCreateProposal = async () => {
    try {
      // Mock proposal creation
      const newProposalData: Proposal = {
        id: `PROP_${Date.now()}`,
        title: newProposal.title,
        description: newProposal.description,
        category: newProposal.category,
        proposer: newProposal.proposer,
        created_at: BigInt(Date.now() * 1000000),
        status: 'Active',
        yes_votes: 0,
        no_votes: 0,
        total_votes: 0,
      };
      
      setProposals(prev => [...prev, newProposalData]);
      
      // Reset form
      setNewProposal({
        title: '',
        description: '',
        category: '',
        proposer: ''
      });
    } catch (error) {
      console.error('Failed to create proposal:', error);
    }
  };

  const handleCastVote = async (proposalId: string, voteType: 'yes' | 'no') => {
    try {
      // Mock voting
      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            yes_votes: voteType === 'yes' ? proposal.yes_votes + 1 : proposal.yes_votes,
            no_votes: voteType === 'no' ? proposal.no_votes + 1 : proposal.no_votes,
            total_votes: proposal.total_votes + 1,
          };
        }
        return proposal;
      }));
    } catch (error) {
      console.error('Failed to cast vote:', error);
    }
  };

  const formatBigInt = (value: bigint): string => {
    return (Number(value) / 100000000).toFixed(2);
  };

  const formatTimestamp = (timestamp: bigint): string => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading CivicLedger Real-Time Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Connection Status */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CivicLedger Real-Time Dashboard
          </h1>
          <Badge variant={true ? "default" : "destructive"} className="ml-2">
            {true ? "🟢 Connected" : "🔴 Disconnected"}
          </Badge>
        </div>
        <p className="text-xl text-gray-600">
          Live Policy Execution & Fund Tracking with Real-Time Updates
        </p>
      </div>

      {/* Analytics Overview */}
      {/* This section is not directly tied to the new icpService mock data,
          so it will show placeholder values or be removed if not needed.
          For now, keeping it as is, but it might need adjustment based on new data. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Policies</p>
                <p className="text-2xl font-bold text-blue-600">{policies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Funds Released</p>
                <p className="text-2xl font-bold text-green-600">₹{formatBigInt(BigInt(0))} Cr</p> {/* Placeholder */}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Complaints</p>
                <p className="text-2xl font-bold text-orange-600">{complaints.length}</p> {/* Placeholder */}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Utilization Rate</p>
                <p className="text-2xl font-bold text-purple-600">0%</p> {/* Placeholder */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="policies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="dao">DAO Governance</TabsTrigger>
          <TabsTrigger value="transactions">Fund Flow</TabsTrigger>
        </TabsList>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Government Policies</h2>
            <Button onClick={() => setActiveTab('newPolicyForm')} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Policy</span>
            </Button>
          </div>

          {activeTab === 'newPolicyForm' && (
            <Card className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleCreatePolicy(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Policy Title</Label>
                    <Input
                      id="title"
                      value={newPolicy.title}
                      onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newPolicy.category} onValueChange={(value) => setNewPolicy({...newPolicy, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPolicy.description}
                    onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fund_allocation">Fund Allocation (Crores)</Label>
                    <Input
                      id="fund_allocation"
                      type="number"
                      value={newPolicy.fundAllocation}
                      onChange={(e) => setNewPolicy({...newPolicy, fundAllocation: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={newPolicy.district}
                      onChange={(e) => setNewPolicy({...newPolicy, district: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Create Policy</Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab('policies')} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{policy.title}</CardTitle>
                  <CardDescription>{policy.description}</CardDescription>
                  <div className="flex items-center space-x-2">
                    <Badge variant={policy.status === 'Active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                    <Badge variant="outline">{policy.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fund Allocation:</span>
                      <span className="font-semibold">₹{formatBigInt(policy.fund_allocation)} Cr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fund Released:</span>
                      <span className="font-semibold">₹{formatBigInt(policy.fund_released)} Cr</span>
                    </div>
                    <Progress 
                      value={(Number(policy.fund_released) / Number(policy.fund_allocation)) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>District:</strong> {policy.district}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Beneficiaries:</strong> {policy.beneficiaries.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    {policy.status === 'Draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleActivatePolicy(policy.id)}
                        className="flex-1"
                      >
                        Activate
                      </Button>
                    )}
                    {policy.status === 'Active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReleaseFunds(policy.id)}
                        className="flex-1"
                      >
                        Release Funds
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Complaints Tab */}
        <TabsContent value="complaints" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Citizen Complaints</h2>
            <Button onClick={() => setActiveTab('newComplaintForm')} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Complaint</span>
            </Button>
          </div>

          {activeTab === 'newComplaintForm' && (
            <Card className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmitComplaint(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="complaint-title">Title</Label>
                    <Input
                      id="complaint-title"
                      value={newComplaint.title}
                      onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="complaint-priority">Priority</Label>
                    <Select value={newComplaint.priority} onValueChange={(value) => setNewComplaint({...newComplaint, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="complaint-description">Description</Label>
                  <Textarea
                    id="complaint-description"
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="complaint-category">Category</Label>
                    <Input
                      id="complaint-category"
                      value={newComplaint.category}
                      onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="complaint-district">District</Label>
                    <Input
                      id="complaint-district"
                      value={newComplaint.district}
                      onChange={(e) => setNewComplaint({...newComplaint, district: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Submit Complaint</Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab('complaints')} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{complaint.title}</CardTitle>
                  <CardDescription>{complaint.description}</CardDescription>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        complaint.priority === 'Critical' ? 'destructive' :
                        complaint.priority === 'High' ? 'default' : 'secondary'
                      }
                    >
                      {complaint.priority}
                    </Badge>
                    <Badge variant="outline">{complaint.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Category:</strong> {complaint.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>District:</strong> {complaint.district}
                    </p>

                  </div>

                  {/* AI Analysis is not part of the new icpService mock, so it's removed */}

                  <p className="text-xs text-gray-500">
                    Submitted: {formatTimestamp(complaint.created_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* DAO Governance Tab */}
        <TabsContent value="dao" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">DAO Governance</h2>
            <Button onClick={() => setActiveTab('newProposalForm')} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Proposal</span>
            </Button>
          </div>

          {activeTab === 'newProposalForm' && (
            <Card className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateProposal(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proposal-title">Proposal Title</Label>
                    <Input
                      id="proposal-title"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="proposal-category">Category</Label>
                    <Select value={newProposal.category} onValueChange={(value) => setNewProposal({...newProposal, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Governance">Governance</SelectItem>
                        <SelectItem value="Funding">Funding</SelectItem>
                        <SelectItem value="Policy">Policy</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="proposal-description">Description</Label>
                  <Textarea
                    id="proposal-description"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="proposal-proposer">Proposer</Label>
                    <Input
                      id="proposal-proposer"
                      value={newProposal.proposer}
                      onChange={(e) => setNewProposal({...newProposal, proposer: e.target.value})}
                      required
                    />
                  </div>

                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Create Proposal</Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab('dao')} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                  <CardDescription>{proposal.description}</CardDescription>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{proposal.category}</Badge>
                    <Badge variant="outline">Status: {proposal.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Yes Votes:</span>
                      <span className="font-semibold text-green-600">{proposal.yes_votes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>No Votes:</span>
                      <span className="font-semibold text-red-600">{proposal.no_votes}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Total Votes:</span>
                      <span className="font-semibold">{proposal.total_votes}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Proposer:</strong> {proposal.proposer}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Created:</strong> {formatTimestamp(proposal.created_at)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCastVote(proposal.id, 'yes')}
                      className="text-green-600 hover:text-green-700"
                    >
                      Yes
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCastVote(proposal.id, 'no')}
                      className="text-red-600 hover:text-red-700"
                    >
                      No
                    </Button>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Fund Flow Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <h2 className="text-2xl font-bold">Real-Time Fund Flow</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {transaction.transaction_type}
                        </Badge>
                        <span className="font-semibold">₹{formatBigInt(transaction.amount)} Cr</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        From: {transaction.from_address} → To: {transaction.to_address}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(transaction.timestamp)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-green-600">
                        {transaction.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Hash: {transaction.transaction_hash.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>CivicLedger - Real-Time Transparent Government Policy Execution</p>
        <p>Powered by Real-Time Backend with WebSocket Updates</p>
      </div>
    </div>
  );
} 