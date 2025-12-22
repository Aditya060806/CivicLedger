import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';
import { enhancedICPService } from '@/lib/enhancedICPService';
import { aiService } from '@/lib/aiService';
import { toast } from 'sonner';
import {
  Users,
  MessageSquare,
  FileText,
  Send,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Loader2,
  Brain,
  Star
} from 'lucide-react';

interface ComplaintFormData {
  title: string;
  description: string;
  category: string;
  district: string;
  policyId?: string;
}

export const EnhancedCitizenPortal = () => {
  const [activeTab, setActiveTab] = useState<'policies' | 'complaints' | 'submit'>('policies');
  const [policies, setPolicies] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Complaint form state
  const [complaintForm, setComplaintForm] = useState<ComplaintFormData>({
    title: '',
    description: '',
    category: '',
    district: '',
    policyId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);

  const categories = [
    'Infrastructure Issues',
    'Fund Misuse',
    'Service Delays',
    'Corruption',
    'Quality Issues',
    'Accessibility Problems',
    'Other'
  ];

  const districts = [
    'Central Delhi',
    'North Delhi',
    'South Delhi',
    'East Delhi',
    'West Delhi',
    'New Delhi',
    'North East Delhi',
    'North West Delhi',
    'South East Delhi',
    'South West Delhi',
    'Shahdara'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [policiesData, complaintsData] = await Promise.all([
        enhancedICPService.getAllPolicies(),
        enhancedICPService.getAllComplaints()
      ]);
      
      setPolicies(policiesData);
      setComplaints(complaintsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplaintSubmit = async () => {
    if (!complaintForm.title || !complaintForm.description || !complaintForm.category || !complaintForm.district) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await enhancedICPService.submitComplaint({
        title: complaintForm.title,
        description: complaintForm.description,
        category: complaintForm.category,
        district: complaintForm.district,
        policyId: complaintForm.policyId || undefined
      });

      if (result.success) {
        toast.success(`Complaint submitted successfully! ID: ${result.complaintId}`);
        setAiAnalysis(result.aiAnalysis || null);
        
        // Reset form
        setComplaintForm({
          title: '',
          description: '',
          category: '',
          district: '',
          policyId: ''
        });
        
        // Reload complaints
        await loadData();
      } else {
        toast.error(result.error || 'Failed to submit complaint');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const analyzeComplaint = async () => {
    if (!complaintForm.description) {
      toast.error('Please enter a description to analyze');
      return;
    }

    try {
      const analysis = await aiService.analyzeComplaint(complaintForm.description);
      setAiAnalysis(analysis);
      
      // Auto-fill category if not selected
      if (!complaintForm.category && analysis.category) {
        setComplaintForm(prev => ({ ...prev, category: analysis.category }));
      }
      
      toast.success('AI analysis completed');
    } catch (error) {
      toast.error('Failed to analyze complaint');
    }
  };

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'policies', label: 'Track Policies', icon: FileText, count: policies.length },
    { id: 'complaints', label: 'My Complaints', icon: MessageSquare, count: complaints.length },
    { id: 'submit', label: 'Submit Complaint', icon: Send, count: null }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-civic-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading citizen portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Users className="w-8 h-8 text-civic-blue" />
          Citizen Portal
        </h1>
        <p className="text-muted-foreground">
          Track government policies, submit complaints, and participate in transparent governance
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-2">
          <div className="flex flex-col sm:flex-row gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 justify-start"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count !== null && (
                  <Badge variant="secondary" className="ml-2">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'policies' && (
          <div className="space-y-6">
            {/* Search */}
            <GlassCard className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search policies by title or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </GlassCard>

            {/* Policies Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolicies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full" hoverable>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg leading-tight">{policy.title}</h3>
                      <StatusBadge status={policy.status.toLowerCase()} />
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">District</span>
                        <span className="font-medium">{policy.district}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{policy.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beneficiaries</span>
                        <span className="font-medium">{policy.beneficiaries?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transparency</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-civic-green" />
                          <span className="font-medium">{(policy.transparency_score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Fund Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Fund Release Progress</span>
                        <span>{Math.round((Number(policy.fund_released) / Number(policy.fund_allocation)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-civic-green h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((Number(policy.fund_released) / Number(policy.fund_allocation)) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="space-y-6">
            {/* Search */}
            <GlassCard className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </GlassCard>

            {/* Complaints List */}
            <div className="space-y-4">
              {filteredComplaints.length === 0 ? (
                <GlassCard className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-semibold mb-2">No complaints found</h3>
                  <p className="text-muted-foreground mb-4">You haven't submitted any complaints yet.</p>
                  <Button onClick={() => setActiveTab('submit')}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Your First Complaint
                  </Button>
                </GlassCard>
              ) : (
                filteredComplaints.map((complaint, index) => (
                  <motion.div
                    key={complaint.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard className="p-6" hoverable>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{complaint.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
                        </div>
                        <StatusBadge status={complaint.status.toLowerCase()} />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block">Category</span>
                          <span className="font-medium">{complaint.category}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">District</span>
                          <span className="font-medium">{complaint.district}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Priority</span>
                          <Badge variant={complaint.priority === 'high' ? 'destructive' : 'secondary'}>
                            {complaint.priority}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Submitted</span>
                          <span className="font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(Number(complaint.created_at) / 1000000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {complaint.ai_analysis && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-civic-purple" />
                            <span className="text-sm font-medium">AI Analysis</span>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(complaint.ai_analysis.confidence * 100)}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{complaint.ai_analysis.summary}</p>
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Submit a Complaint</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Complaint Title *</label>
                  <Input
                    value={complaintForm.title}
                    onChange={(e) => setComplaintForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief title describing your complaint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of your complaint..."
                    rows={4}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {complaintForm.description.length} characters
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={analyzeComplaint}
                      disabled={!complaintForm.description}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      AI Analyze
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <Select 
                      value={complaintForm.category} 
                      onValueChange={(value) => setComplaintForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">District *</label>
                    <Select 
                      value={complaintForm.district} 
                      onValueChange={(value) => setComplaintForm(prev => ({ ...prev, district: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Related Policy (Optional)</label>
                  <Select 
                    value={complaintForm.policyId} 
                    onValueChange={(value) => setComplaintForm(prev => ({ ...prev, policyId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select related policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {policies.map(policy => (
                        <SelectItem key={policy.id} value={policy.id}>{policy.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {aiAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-civic-purple/5 border border-civic-purple/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-civic-purple" />
                      <span className="font-medium">AI Analysis Results</span>
                      <Badge variant="outline">{Math.round(aiAnalysis.confidence * 100)}% confidence</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block">Sentiment</span>
                        <Badge variant={aiAnalysis.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                          {aiAnalysis.sentiment}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Priority</span>
                        <Badge variant={aiAnalysis.priority === 'high' ? 'destructive' : 'secondary'}>
                          {aiAnalysis.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <span className="text-muted-foreground text-sm block mb-1">Summary</span>
                      <p className="text-sm">{aiAnalysis.summary}</p>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={handleComplaintSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Complaint...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
      </motion.div>
    </div>
  );
};