import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  smartPolicyService, 
  complaintHandlerService, 
  daoManagerService, 
  fundTrackerService,
  formatBigInt,
  formatTimestamp,
  getPolicyStatusText,
  getComplaintPriorityText,
  getComplaintStatusText
} from '@/lib/icpService';
import { Policy, Complaint, Proposal, FundTransaction } from '@/lib/icpService';

export default function MockDashboard() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [policiesData, complaintsData, proposalsData, transactionsData] = await Promise.all([
        smartPolicyService.getAllPolicies(),
        complaintHandlerService.getAllComplaints(),
        daoManagerService.getAllProposals(),
        fundTrackerService.getRecentTransactions(10)
      ]);
      
      setPolicies(policiesData);
      setComplaints(complaintsData);
      setProposals(proposalsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePolicy = async (policyId: string) => {
    try {
      await smartPolicyService.activatePolicy(policyId);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to activate policy:', error);
    }
  };

  const handleReleaseFunds = async (policyId: string) => {
    try {
      const amount = BigInt(1000000000); // 1 crore
      await smartPolicyService.releaseFunds(policyId, amount, "contractor_wallet");
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to release funds:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading CivicLedger Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CivicLedger Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Real-time Policy Execution & Fund Tracking
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="outline" className="text-green-600">
            {policies.length} Active Policies
          </Badge>
          <Badge variant="outline" className="text-orange-600">
            {complaints.length} Pending Complaints
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            {proposals.length} DAO Proposals
          </Badge>
        </div>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{policy.title}</CardTitle>
                  <CardDescription>{policy.description}</CardDescription>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPolicyStatusText(policy.status) === 'Active' ? 'default' : 'secondary'}>
                      {getPolicyStatusText(policy.status)}
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
                    {getPolicyStatusText(policy.status) === 'Draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleActivatePolicy(policy.id)}
                        className="flex-1"
                      >
                        Activate
                      </Button>
                    )}
                    {getPolicyStatusText(policy.status) === 'Active' && (
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{complaint.title}</CardTitle>
                  <CardDescription>{complaint.description}</CardDescription>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        getComplaintPriorityText(complaint.priority) === 'Critical' ? 'destructive' :
                        getComplaintPriorityText(complaint.priority) === 'High' ? 'default' : 'secondary'
                      }
                    >
                      {getComplaintPriorityText(complaint.priority)}
                    </Badge>
                    <Badge variant="outline">{getComplaintStatusText(complaint.status)}</Badge>
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

                  <Button size="sm" className="w-full">
                    Cast Vote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Fund Flow Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {Object.keys(transaction.transaction_type)[0]}
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
                        Completed
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
        <p>CivicLedger - Transparent Government Policy Execution</p>
        <p>Powered by Internet Computer Protocol</p>
      </div>
    </div>
  );
} 