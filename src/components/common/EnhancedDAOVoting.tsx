import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GlassCard } from './GlassCard';
import { enhancedICPService } from '@/lib/enhancedICPService';
import { toast } from 'sonner';
import {
  Vote,
  Plus,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Minus,
  TrendingUp,
  FileText,
  Send,
  Loader2,
  Calendar,
  Target
} from 'lucide-react';

interface ProposalFormData {
  title: string;
  description: string;
  category: string;
  votingDurationHours: number;
}

export const EnhancedDAOVoting = () => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'create'>('proposals');
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [proposalForm, setProposalForm] = useState<ProposalFormData>({
    title: '',
    description: '',
    category: '',
    votingDurationHours: 72
  });

  const categories = [
    'Policy Amendment',
    'Budget Allocation',
    'Infrastructure Project',
    'Service Improvement',
    'Transparency Initiative',
    'Community Development',
    'Emergency Response',
    'Other'
  ];

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setIsLoading(true);
    try {
      const proposalsData = await enhancedICPService.getAllProposals();
      setProposals(proposalsData);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProposal = async () => {
    if (!proposalForm.title || !proposalForm.description || !proposalForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await enhancedICPService.createProposal({
        title: proposalForm.title,
        description: proposalForm.description,
        category: proposalForm.category,
        votingDurationHours: proposalForm.votingDurationHours
      });

      if (result.success) {
        toast.success(`Proposal created successfully! ID: ${result.proposalId}`);
        
        // Reset form
        setProposalForm({
          title: '',
          description: '',
          category: '',
          votingDurationHours: 72
        });
        
        // Switch to proposals tab and reload
        setActiveTab('proposals');
        await loadProposals();
      } else {
        toast.error(result.error || 'Failed to create proposal');
      }
    } catch (error) {
      toast.error('An error occurred while creating the proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (proposalId: string, voteType: 'Yes' | 'No' | 'Abstain') => {
    try {
      const result = await enhancedICPService.castVote(proposalId, voteType);
      
      if (result.success) {
        toast.success(`Vote cast successfully: ${voteType}`);
        await loadProposals();
      } else {
        toast.error(result.error || 'Failed to cast vote');
      }
    } catch (error) {
      toast.error('An error occurred while casting vote');
    }
  };

  const getProposalStatus = (proposal: any) => {
    const now = Date.now() * 1000000;
    const votingStart = Number(proposal.voting_start);
    const votingEnd = Number(proposal.voting_end);
    
    if (now < votingStart) return 'Pending';
    if (now > votingEnd) {
      if (proposal.total_votes >= proposal.quorum_required) {
        return proposal.yes_votes > proposal.no_votes ? 'Passed' : 'Rejected';
      }
      return 'Expired';
    }
    return 'Active';
  };

  const getTimeRemaining = (proposal: any) => {
    const now = Date.now() * 1000000;
    const votingEnd = Number(proposal.voting_end);
    const remaining = votingEnd - now;
    
    if (remaining <= 0) return 'Voting ended';
    
    const hours = Math.floor(remaining / (3600 * 1000000000));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    return `${hours}h remaining`;
  };

  const tabs = [
    { id: 'proposals', label: 'Active Proposals', icon: Vote, count: proposals.length },
    { id: 'create', label: 'Create Proposal', icon: Plus, count: null }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-civic-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading DAO proposals...</p>
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
          <Vote className="w-8 h-8 text-civic-blue" />
          DAO Governance
        </h1>
        <p className="text-muted-foreground">
          Participate in decentralized decision-making for transparent governance
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <GlassCard className="p-4 text-center">
          <FileText className="w-6 h-6 mx-auto mb-2 text-civic-blue" />
          <div className="text-2xl font-bold">{proposals.length}</div>
          <div className="text-sm text-muted-foreground">Total Proposals</div>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-civic-green" />
          <div className="text-2xl font-bold">
            {proposals.filter(p => getProposalStatus(p) === 'Active').length}
          </div>
          <div className="text-sm text-muted-foreground">Active Voting</div>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-civic-success" />
          <div className="text-2xl font-bold">
            {proposals.filter(p => getProposalStatus(p) === 'Passed').length}
          </div>
          <div className="text-sm text-muted-foreground">Passed</div>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-civic-purple" />
          <div className="text-2xl font-bold">
            {proposals.reduce((sum, p) => sum + p.total_votes, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Votes</div>
        </GlassCard>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1"
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
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            {proposals.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Vote className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">No proposals yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to create a governance proposal.</p>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Proposal
                </Button>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal, index) => {
                  const status = getProposalStatus(proposal);
                  const timeRemaining = getTimeRemaining(proposal);
                  const totalVotes = proposal.total_votes;
                  const yesPercentage = totalVotes > 0 ? (proposal.yes_votes / totalVotes) * 100 : 0;
                  const noPercentage = totalVotes > 0 ? (proposal.no_votes / totalVotes) * 100 : 0;
                  const abstainPercentage = totalVotes > 0 ? (proposal.abstain_votes / totalVotes) * 100 : 0;
                  
                  return (
                    <motion.div
                      key={proposal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard className="p-6" hoverable>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{proposal.title}</h3>
                              <Badge variant={
                                status === 'Active' ? 'default' :
                                status === 'Passed' ? 'secondary' :
                                status === 'Rejected' ? 'destructive' : 'outline'
                              }>
                                {status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{proposal.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground block">Category</span>
                                <span className="font-medium">{proposal.category}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block">Proposer</span>
                                <span className="font-medium">{proposal.proposer}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block">Quorum</span>
                                <span className="font-medium">{proposal.quorum_required} votes</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block">Time</span>
                                <span className="font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {timeRemaining}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Voting Results */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Voting Progress</span>
                            <span>{totalVotes} / {proposal.quorum_required} votes</span>
                          </div>
                          
                          <Progress 
                            value={(totalVotes / proposal.quorum_required) * 100} 
                            className="h-2"
                          />
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-civic-green" />
                              <span>Yes: {proposal.yes_votes} ({yesPercentage.toFixed(1)}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span>No: {proposal.no_votes} ({noPercentage.toFixed(1)}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Minus className="w-4 h-4 text-gray-500" />
                              <span>Abstain: {proposal.abstain_votes} ({abstainPercentage.toFixed(1)}%)</span>
                            </div>
                          </div>
                        </div>

                        {/* Voting Buttons */}
                        {status === 'Active' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleVote(proposal.id, 'Yes')}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-civic-green" />
                              Vote Yes
                            </Button>
                            <Button
                              onClick={() => handleVote(proposal.id, 'No')}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-2 text-red-500" />
                              Vote No
                            </Button>
                            <Button
                              onClick={() => handleVote(proposal.id, 'Abstain')}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Minus className="w-4 h-4 mr-2 text-gray-500" />
                              Abstain
                            </Button>
                          </div>
                        )}
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Create New Proposal</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Proposal Title *</label>
                  <Input
                    value={proposalForm.title}
                    onChange={(e) => setProposalForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief, descriptive title for your proposal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={proposalForm.description}
                    onChange={(e) => setProposalForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of your proposal, including rationale and expected outcomes..."
                    rows={6}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <Select 
                      value={proposalForm.category} 
                      onValueChange={(value) => setProposalForm(prev => ({ ...prev, category: value }))}
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
                    <label className="block text-sm font-medium mb-2">Voting Duration (Hours)</label>
                    <Select 
                      value={proposalForm.votingDurationHours.toString()} 
                      onValueChange={(value) => setProposalForm(prev => ({ ...prev, votingDurationHours: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours (3 days)</SelectItem>
                        <SelectItem value="168">168 hours (1 week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Proposal Preview
                  </h4>
                  <div className="text-sm space-y-2">
                    <div><strong>Title:</strong> {proposalForm.title || 'Not specified'}</div>
                    <div><strong>Category:</strong> {proposalForm.category || 'Not selected'}</div>
                    <div><strong>Voting Duration:</strong> {proposalForm.votingDurationHours} hours</div>
                    <div><strong>Description Length:</strong> {proposalForm.description.length} characters</div>
                  </div>
                </div>

                <Button
                  onClick={handleCreateProposal}
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Proposal...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Proposal
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