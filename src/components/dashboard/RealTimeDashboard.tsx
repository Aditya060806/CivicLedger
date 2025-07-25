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
  smartPolicyService, 
  complaintHandlerService, 
  daoManagerService, 
  fundTrackerService,
  analyticsService,
  checkBackendHealth,
  formatBigInt,
  formatTimestamp,
  getPolicyStatusText,
  getComplaintPriorityText,
  getComplaintStatusText
} from '@/lib/icpService';
import { Policy, Complaint, Proposal, FundTransaction, AnalyticsOverview } from '@/lib/realICPService';
import { 
  Building2, 
  AlertTriangle, 
  Vote, 
  TrendingUp, 
  Plus, 
  CheckCircle, 
  DollarSign,
  Users,
  FileText,
  Activity
} from 'lucide-react';

export default function RealTimeDashboard() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [showNewPolicyForm, setShowNewPolicyForm] = useState(false);
  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);
  const [showNewProposalForm, setShowNewProposalForm] = useState(false);

  // Form states
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    description: '',
    category: '',
    fund_allocation: '',
    district: '',
    eligibility_criteria: '',
    execution_conditions: ''
  });

  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    district: '',
    location: ''
  });

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: '',
    proposer: '',
    voting_duration_hours: '168', // 7 days
    quorum_required: '50'
  });

  useEffect(() => {
    checkBackendConnection();
    loadData();
    setupRealTimeUpdates();
  }, []);

  const checkBackendConnection = async () => {
    const isHealthy = await checkBackendHealth();
    setBackendConnected(isHealthy);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [policiesData, complaintsData, proposalsData, transactionsData, analyticsData] = await Promise.all([
        smartPolicyService.getAllPolicies(),
        complaintHandlerService.getAllComplaints(),
        daoManagerService.getAllProposals(),
        fundTrackerService.getRecentTransactions(10),
        analyticsService.getOverview()
      ]);
      
      setPolicies(policiesData);
      setComplaints(complaintsData);
      setProposals(proposalsData);
      setTransactions(transactionsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Subscribe to real-time updates
    const unsubscribePolicies = smartPolicyService.subscribeToUpdates((updatedPolicies) => {
      setPolicies(updatedPolicies);
    });

    const unsubscribeComplaints = complaintHandlerService.subscribeToUpdates((updatedComplaints) => {
      setComplaints(updatedComplaints);
    });

    const unsubscribeProposals = daoManagerService.subscribeToUpdates((updatedProposals) => {
      setProposals(updatedProposals);
    });

    const unsubscribeTransactions = fundTrackerService.subscribeToUpdates((updatedTransactions) => {
      setTransactions(updatedTransactions);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribePolicies();
      unsubscribeComplaints();
      unsubscribeProposals();
      unsubscribeTransactions();
    };
  };

  const handleActivatePolicy = async (policyId: string) => {
    try {
      await smartPolicyService.activatePolicy(policyId);
      // Real-time update will handle the UI update
    } catch (error) {
      console.error('Failed to activate policy:', error);
    }
  };

  const handleReleaseFunds = async (policyId: string) => {
    try {
      const amount = BigInt(1000000000); // 1 crore
      await smartPolicyService.releaseFunds(policyId, amount, "contractor_wallet");
      // Real-time update will handle the UI update
    } catch (error) {
      console.error('Failed to release funds:', error);
    }
  };

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await smartPolicyService.registerPolicy(
        newPolicy.title,
        newPolicy.description,
        newPolicy.category,
        BigInt(parseInt(newPolicy.fund_allocation) * 100000000), // Convert to nano
        newPolicy.district,
        newPolicy.eligibility_criteria.split(',').map(s => s.trim()),
        newPolicy.execution_conditions.split(',').map(s => s.trim())
      );
      setShowNewPolicyForm(false);
      setNewPolicy({
        title: '',
        description: '',
        category: '',
        fund_allocation: '',
        district: '',
        eligibility_criteria: '',
        execution_conditions: ''
      });
    } catch (error) {
      console.error('Failed to create policy:', error);
    }
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await complaintHandlerService.submitComplaint(
        newComplaint.title,
        newComplaint.description,
        newComplaint.category,
        newComplaint.priority,
        undefined,
        newComplaint.district,
        newComplaint.location,
        [],
        'citizen-001'
      );
      setShowNewComplaintForm(false);
      setNewComplaint({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        district: '',
        location: ''
      });
    } catch (error) {
      console.error('Failed to create complaint:', error);
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await daoManagerService.createProposal(
        newProposal.title,
        newProposal.description,
        newProposal.category,
        newProposal.proposer,
        BigInt(parseInt(newProposal.voting_duration_hours)),
        parseInt(newProposal.quorum_required)
      );
      setShowNewProposalForm(false);
      setNewProposal({
        title: '',
        description: '',
        category: '',
        proposer: '',
        voting_duration_hours: '168',
        quorum_required: '50'
      });
    } catch (error) {
      console.error('Failed to create proposal:', error);
    }
  };

  const handleVote = async (proposalId: string, voteType: string) => {
    try {
      await daoManagerService.castVote(proposalId, 'voter-001', voteType, 1, 'Supporting this proposal');
    } catch (error) {
      console.error('Failed to cast vote:', error);
    }
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
          <Badge variant={backendConnected ? "default" : "destructive"} className="ml-2">
            {backendConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </Badge>
        </div>
        <p className="text-xl text-gray-600">
          Live Policy Execution & Fund Tracking with Real-Time Updates
        </p>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Policies</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.totalPolicies}</p>
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
                  <p className="text-2xl font-bold text-green-600">₹{analytics.totalFundsReleased} Cr</p>
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
                  <p className="text-2xl font-bold text-orange-600">{analytics.pendingComplaints}</p>
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
                  <p className="text-2xl font-bold text-purple-600">{analytics.utilizationRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
            <Button onClick={() => setShowNewPolicyForm(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Policy</span>
            </Button>
          </div>

          {showNewPolicyForm && (
            <Card className="p-6">
              <form onSubmit={handleCreatePolicy} className="space-y-4">
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
                      value={newPolicy.fund_allocation}
                      onChange={(e) => setNewPolicy({...newPolicy, fund_allocation: e.target.value})}
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
                  <Button type="button" variant="outline" onClick={() => setShowNewPolicyForm(false)}>
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
            <Button onClick={() => setShowNewComplaintForm(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Complaint</span>
            </Button>
          </div>

          {showNewComplaintForm && (
            <Card className="p-6">
              <form onSubmit={handleCreateComplaint} className="space-y-4">
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
                  <Button type="button" variant="outline" onClick={() => setShowNewComplaintForm(false)}>
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
                    {complaint.location && (
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {complaint.location}
                      </p>
                    )}
                  </div>

                  {complaint.ai_analysis && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">AI Analysis</h4>
                      <div className="space-y-1 text-xs">
                        <p><strong>Sentiment:</strong> {complaint.ai_analysis.sentiment}</p>
                        <p><strong>Priority Score:</strong> {(complaint.ai_analysis.priority_score * 100).toFixed(0)}%</p>
                        <p><strong>Suggested Action:</strong> {complaint.ai_analysis.suggested_action}</p>
                      </div>
                    </div>
                  )}

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
            <Button onClick={() => setShowNewProposalForm(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Proposal</span>
            </Button>
          </div>

          {showNewProposalForm && (
            <Card className="p-6">
              <form onSubmit={handleCreateProposal} className="space-y-4">
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
                  <div>
                    <Label htmlFor="voting-duration">Voting Duration (hours)</Label>
                    <Input
                      id="voting-duration"
                      type="number"
                      value={newProposal.voting_duration_hours}
                      onChange={(e) => setNewProposal({...newProposal, voting_duration_hours: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quorum-required">Quorum Required</Label>
                    <Input
                      id="quorum-required"
                      type="number"
                      value={newProposal.quorum_required}
                      onChange={(e) => setNewProposal({...newProposal, quorum_required: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Create Proposal</Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewProposalForm(false)}>
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
                    <Badge variant="outline">Quorum: {proposal.quorum_required}</Badge>
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
                      <span>Abstain:</span>
                      <span className="font-semibold text-gray-600">{proposal.abstain_votes}</span>
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
                      <strong>Voting Ends:</strong> {formatTimestamp(proposal.voting_end)}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleVote(proposal.id, 'Yes')}
                      className="text-green-600 hover:text-green-700"
                    >
                      Yes
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleVote(proposal.id, 'No')}
                      className="text-red-600 hover:text-red-700"
                    >
                      No
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleVote(proposal.id, 'Abstain')}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Abstain
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