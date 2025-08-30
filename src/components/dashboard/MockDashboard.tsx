import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const handleActivatePolicy = async (policyId: string) => {
    try {
      await icpService.activatePolicy(policyId);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to activate policy:', error);
    }
  };

  const handleReleaseFunds = async (policyId: string) => {
    try {
      const amount = BigInt(1000000000); // 1 crore
      await icpService.releaseFunds(policyId, amount, "contractor_wallet");
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to release funds:', error);
    }
  };

  const formatBigInt = (value: bigint): string => {
    return (Number(value) / 100000000).toFixed(2);
  };

  const formatTimestamp = (timestamp: bigint): string => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  const getPolicyStatusText = (status: string): string => {
    return status;
  };

  const getComplaintPriorityText = (priority: string): string => {
    return priority;
  };

  const getComplaintStatusText = (status: string): string => {
    return status;
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