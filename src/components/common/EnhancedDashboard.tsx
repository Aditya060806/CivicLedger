import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { civicLedgerService } from '@/lib/civicLedgerService';
import {
  TrendingUp,
  Users,
  FileText,
  IndianRupee,
  Activity,
  Search,
  Eye,
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  Sparkles,
  BarChart3,
  Zap,
  RefreshCw
} from 'lucide-react';

interface DashboardMetrics {
  totalPolicies: number;
  activePolicies: number;
  totalFunds: number;
  releasedFunds: number;
  totalBeneficiaries: number;
  totalComplaints: number;
  resolvedComplaints: number;
  transparencyScore: number;
}

export const EnhancedDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load metrics
      const metricsData = await civicLedgerService.getMetrics();
      const releasedFunds = policies.reduce((sum, p) => sum + Number(p.fund_released || 0), 0);
      
      setMetrics({
        totalPolicies: metricsData.total_policies_created,
        activePolicies: metricsData.active_policies,
        totalFunds: Number(metricsData.total_funds_managed),
        releasedFunds,
        totalBeneficiaries: metricsData.total_beneficiaries,
        totalComplaints: metricsData.total_complaints,
        resolvedComplaints: metricsData.resolved_complaints,
        transparencyScore: metricsData.transparency_score * 100,
      });

      // Load policies
      const policiesData = await civicLedgerService.getAllPolicies();
      setPolicies(policiesData);

      // Generate AI summary
      const summary = await civicLedgerService.generatePolicySummary(policiesData);
      setAiSummary(summary);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || policy.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const statsCards = [
    {
      icon: FileText,
      label: 'Total Policies',
      value: metrics?.totalPolicies || 0,
      change: '+12%',
      color: 'text-civic-blue'
    },
    {
      icon: Activity,
      label: 'Active Policies',
      value: metrics?.activePolicies || 0,
      change: '+8%',
      color: 'text-civic-green'
    },
    {
      icon: IndianRupee,
      label: 'Total Funds',
      value: civicLedgerService.formatCurrency(metrics?.totalFunds || 0),
      change: '+15%',
      color: 'text-civic-purple'
    },
    {
      icon: Users,
      label: 'Beneficiaries',
      value: (metrics?.totalBeneficiaries || 0).toLocaleString(),
      change: '+22%',
      color: 'text-civic-success'
    },
    {
      icon: AlertCircle,
      label: 'Complaints',
      value: metrics?.totalComplaints || 0,
      change: '-5%',
      color: 'text-orange-500'
    },
    {
      icon: TrendingUp,
      label: 'Transparency',
      value: `${(metrics?.transparencyScore || 0).toFixed(1)}%`,
      change: '+2%',
      color: 'text-civic-green'
    }
  ];

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-civic-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-civic-blue" />
            Governance Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time transparency • AI-powered insights • Citizen accountability
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={loadDashboardData} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </motion.div>

      {/* AI Summary */}
      {aiSummary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6 bg-gradient-to-r from-civic-purple/5 to-civic-blue/5 border-civic-purple/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-civic-purple to-civic-blue flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  AI Executive Summary
                  <Badge variant="secondary" className="text-xs">Live Analysis</Badge>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{aiSummary}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-4 text-center" hoverable>
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-lg font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className={`text-xs font-medium ${
                stat.change.startsWith('+') ? 'text-civic-green' : 'text-orange-500'
              }`}>
                {stat.change}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Policies Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Policy Execution Tracker
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <div className="flex gap-2">
                {['all', 'active', 'draft', 'completed'].map(status => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Policies List */}
          <div className="space-y-4">
            {filteredPolicies.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No policies found matching your criteria</p>
              </div>
            ) : (
              filteredPolicies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-xl p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{policy.title}</h3>
                        <StatusBadge status={policy.status.toLowerCase()} />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="block">Category</span>
                          <span className="font-medium text-foreground">{policy.category}</span>
                        </div>
                        <div>
                          <span className="block">District</span>
                          <span className="font-medium text-foreground">{policy.district}</span>
                        </div>
                        <div>
                          <span className="block">Beneficiaries</span>
                          <span className="font-medium text-foreground">{policy.beneficiaries?.toLocaleString() || 0}</span>
                        </div>
                        <div>
                          <span className="block">AI Score</span>
                          <span className="font-medium text-foreground flex items-center gap-1">
                            <Zap className="w-3 h-3 text-civic-purple" />
                            {((policy.ai_analysis_score || 0) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                      {/* Fund Progress */}
                      <div className="text-right min-w-32">
                        <div className="text-sm text-muted-foreground mb-1">Fund Release</div>
                        <div className="font-semibold">
                          {civicLedgerService.formatCurrency(Number(policy.fund_released))} / {civicLedgerService.formatCurrency(Number(policy.fund_allocation))}
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-civic-green h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${civicLedgerService.calculateProgress(Number(policy.fund_released), Number(policy.fund_allocation))}%` 
                            }}
                          />
                        </div>
                      </div>

                      {/* Transparency Score */}
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-civic-green" />
                        <span className="text-sm font-medium">
                          {(policy.transparency_score * 100).toFixed(0)}% Transparent
                        </span>
                      </div>

                      {/* Actions */}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};