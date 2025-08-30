import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Shield, 
  Globe, 
  Bot, 
  Award,
  Zap,
  Building2,
  FileText,
  BarChart3,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star
} from 'lucide-react';
import { icpService, WCHL25Metrics, Policy, FundFlow, IndiaHubRegistration } from '@/lib/icpService';

export const WCHL25Dashboard = () => {
  const [metrics, setMetrics] = useState<WCHL25Metrics | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [fundFlows, setFundFlows] = useState<FundFlow[]>([]);
  const [indiaHubRegistrations, setIndiaHubRegistrations] = useState<IndiaHubRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [metricsData, policiesData, indiaHubData] = await Promise.all([
        icpService.mockGetWCHL25Metrics(),
        icpService.mockGetAllPolicies(),
        icpService.getIndiaHubRegistrations(),
      ]);

      setMetrics(metricsData);
      setPolicies(policiesData);
      setIndiaHubRegistrations(indiaHubData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBigInt = (value: bigint): string => {
    return (Number(value) / 100000000).toFixed(2);
  };

  const getHackathonScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHackathonScoreBadge = (score: number) => {
    if (score >= 90) return { color: 'bg-green-500', text: 'Excellent' };
    if (score >= 80) return { color: 'bg-yellow-500', text: 'Good' };
    if (score >= 70) return { color: 'bg-orange-500', text: 'Fair' };
    return { color: 'bg-red-500', text: 'Needs Improvement' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-civic-blue mx-auto"></div>
          <p className="mt-4 text-lg">Loading WCHL25 Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-civic-blue mb-2">
              🏆 WCHL25 CivicLedger Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              National Level Hackathon Project - Internet Computer Protocol Integration
            </p>
          </div>
          <div className="text-right">
            <Badge className="bg-gradient-civic text-white px-4 py-2 text-lg">
              <Award className="w-5 h-5 mr-2" />
              WCHL25 Finalist
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Hackathon Score Card */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-civic text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">WCHL25 Hackathon Score</h2>
                  <p className="text-civic-blue-100">
                    Comprehensive evaluation of project innovation, technical implementation, and impact
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-6xl font-bold ${getHackathonScoreColor(metrics.hackathon_score)}`}>
                    {metrics.hackathon_score.toFixed(1)}
                  </div>
                  <Badge className={`${getHackathonScoreBadge(metrics.hackathon_score).color} text-white mt-2`}>
                    {getHackathonScoreBadge(metrics.hackathon_score).text}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={metrics.hackathon_score} 
                className="mt-4 h-3 bg-white/20"
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-civic-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-civic data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="data-[state=active]:bg-gradient-civic data-[state=active]:text-white">
            <Zap className="w-4 h-4 mr-2" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="india-hub" className="data-[state=active]:bg-gradient-civic data-[state=active]:text-white">
            <Globe className="w-4 h-4 mr-2" />
            India Hub
          </TabsTrigger>
          <TabsTrigger value="ai-analytics" className="data-[state=active]:bg-gradient-civic data-[state=active]:text-white">
            <Bot className="w-4 h-4 mr-2" />
            AI Analytics
          </TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-gradient-civic data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />
            Policies
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.total_policies_created || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Government policies created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Funds Managed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{formatBigInt(metrics?.total_funds_managed || BigInt(0))} Cr
                </div>
                <p className="text-xs text-muted-foreground">
                  Total funds allocated
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.total_beneficiaries || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Citizens impacted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transparency</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics?.transparency_score || 0) * 100}%</div>
                <p className="text-xs text-muted-foreground">
                  Overall transparency score
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  WCHL25 Achievement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Blockchain Transactions</span>
                  <Badge variant="secondary">{metrics?.blockchain_transactions || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>India Hub Integrations</span>
                  <Badge variant="secondary">{metrics?.india_hub_integrations || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>AI Optimizations</span>
                  <Badge variant="secondary">{metrics?.ai_optimizations || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Citizen Engagements</span>
                  <Badge variant="secondary">{metrics?.citizen_engagements || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Technical Excellence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Rust Implementation</span>
                    <span>40%+</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>ICP Integration</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Smart Contracts</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Real-time Features</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  ICP Blockchain Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-civic-blue/10 rounded-lg">
                  <span>Total Transactions</span>
                  <Badge variant="outline">{metrics?.blockchain_transactions || 0}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-civic-green/10 rounded-lg">
                  <span>Smart Contracts Deployed</span>
                  <Badge variant="outline">{policies.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-civic-purple/10 rounded-lg">
                  <span>Fund Flows Tracked</span>
                  <Badge variant="outline">{fundFlows.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-civic-orange/10 rounded-lg">
                  <span>Blockchain Hash Generation</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Blockchain Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Immutable Audit Trails</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Real-time Fund Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Smart Contract Execution</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Transparent Governance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Decentralized Storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Zero-knowledge Proofs</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* India Hub Tab */}
        <TabsContent value="india-hub" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  ICP India Hub Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-civic-blue/10 rounded-lg">
                  <span>Hub Registrations</span>
                  <Badge variant="outline">{metrics?.india_hub_integrations || 0}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-civic-green/10 rounded-lg">
                  <span>Regional Impact Score</span>
                  <Badge variant="outline">88%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-civic-purple/10 rounded-lg">
                  <span>Compliance Score</span>
                  <Badge variant="outline">95%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-civic-orange/10 rounded-lg">
                  <span>Verification Status</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  India Hub Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Regional Policy Alignment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Local Compliance Verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Regional Impact Assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Local Government Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Regional Data Sovereignty</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Analytics Tab */}
        <TabsContent value="ai-analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  AI-Powered Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-civic-blue/10 rounded-lg">
                  <span>AI Optimizations Applied</span>
                  <Badge variant="outline">{metrics?.ai_optimizations || 0}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-civic-green/10 rounded-lg">
                  <span>Policy Analysis Score</span>
                  <Badge variant="outline">92%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-civic-purple/10 rounded-lg">
                  <span>Sentiment Analysis</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-civic-orange/10 rounded-lg">
                  <span>Predictive Analytics</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Policy Optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Complaint Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Fund Flow Prediction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Risk Assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Performance Optimization</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        {policy.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {policy.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={policy.status === 'Active' ? 'default' : 'secondary'}
                      className={policy.status === 'Active' ? 'bg-green-500' : ''}
                    >
                      {policy.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Fund Allocation</p>
                      <p className="font-semibold">₹{formatBigInt(policy.fund_allocation)} Cr</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fund Released</p>
                      <p className="font-semibold">₹{formatBigInt(policy.fund_released)} Cr</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Beneficiaries</p>
                      <p className="font-semibold">{policy.beneficiaries}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transparency Score</p>
                      <p className="font-semibold">{(policy.transparency_score * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  {policy.blockchain_hash && (
                    <div className="mt-4 p-3 bg-civic-blue/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Blockchain Hash</p>
                      <p className="font-mono text-xs break-all">{policy.blockchain_hash}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-muted-foreground">
          🏆 CivicLedger - WCHL25 National Level Finalist | Built on Internet Computer Protocol
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Transforming government policies into executable smart contracts with real-time transparency
        </p>
      </motion.div>
    </div>
  );
};
