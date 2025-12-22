import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from './GlassCard';
import { enhancedICPService } from '@/lib/enhancedICPService';
import { aiService } from '@/lib/aiService';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Brain,
  Target,
  Users,
  IndianRupee
} from 'lucide-react';

interface PolicyFormData {
  title: string;
  description: string;
  category: string;
  fundAllocation: string;
  district: string;
  eligibilityCriteria: string[];
  executionConditions: string[];
}

export const EnhancedPolicyMaker = () => {
  const [formData, setFormData] = useState<PolicyFormData>({
    title: '',
    description: '',
    category: '',
    fundAllocation: '',
    district: '',
    eligibilityCriteria: [],
    executionConditions: []
  });

  const [newCriteria, setNewCriteria] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiOptimization, setAiOptimization] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categories = [
    'Housing & Urban Development',
    'Healthcare',
    'Education',
    'Infrastructure',
    'Digital Services',
    'Agriculture',
    'Employment',
    'Social Welfare'
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

  const handleInputChange = (field: keyof PolicyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCriteria = () => {
    if (newCriteria.trim()) {
      setFormData(prev => ({
        ...prev,
        eligibilityCriteria: [...prev.eligibilityCriteria, newCriteria.trim()]
      }));
      setNewCriteria('');
    }
  };

  const removeCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      eligibilityCriteria: prev.eligibilityCriteria.filter((_, i) => i !== index)
    }));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        executionConditions: [...prev.executionConditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      executionConditions: prev.executionConditions.filter((_, i) => i !== index)
    }));
  };

  const analyzePolicy = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please provide title and description for AI analysis');
      return;
    }

    setIsAnalyzing(true);
    try {
      const optimization = await aiService.optimizePolicy(formData.title, formData.description);
      setAiOptimization(optimization);
      toast.success('AI analysis completed successfully');
    } catch (error) {
      toast.error('Failed to analyze policy');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.fundAllocation || !formData.district) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.eligibilityCriteria.length === 0) {
      toast.error('Please add at least one eligibility criteria');
      return;
    }

    if (formData.executionConditions.length === 0) {
      toast.error('Please add at least one execution condition');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await enhancedICPService.registerPolicy({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fundAllocation: parseInt(formData.fundAllocation),
        district: formData.district,
        eligibilityCriteria: formData.eligibilityCriteria,
        executionConditions: formData.executionConditions
      });

      if (result.success) {
        toast.success(`Policy registered successfully! ID: ${result.policyId}`);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          fundAllocation: '',
          district: '',
          eligibilityCriteria: [],
          executionConditions: []
        });
        setAiOptimization(null);
      } else {
        toast.error(result.error || 'Failed to register policy');
      }
    } catch (error) {
      toast.error('An error occurred while registering the policy');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-civic-blue" />
          Policy Creation Studio
        </h1>
        <p className="text-muted-foreground">
          Create transparent, AI-optimized government policies with smart contract execution
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Policy Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., PM Awas Yojana - Phase 4"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the policy objectives, scope, and expected outcomes..."
                  rows={4}
                  className="w-full"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                  <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
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
                <label className="block text-sm font-medium mb-2">Fund Allocation (₹) *</label>
                <Input
                  type="number"
                  value={formData.fundAllocation}
                  onChange={(e) => handleInputChange('fundAllocation', e.target.value)}
                  placeholder="e.g., 50000000"
                  className="w-full"
                />
              </div>
            </div>
          </GlassCard>

          {/* Eligibility Criteria */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCriteria}
                  onChange={(e) => setNewCriteria(e.target.value)}
                  placeholder="Add eligibility criteria..."
                  onKeyPress={(e) => e.key === 'Enter' && addCriteria()}
                />
                <Button onClick={addCriteria} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.eligibilityCriteria.map((criteria, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {criteria}
                    <button onClick={() => removeCriteria(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Execution Conditions */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Execution Conditions</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Add execution condition..."
                  onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                />
                <Button onClick={addCondition} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.executionConditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {condition}
                    <button onClick={() => removeCondition(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* AI Analysis Panel */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-civic-purple" />
              <h2 className="text-lg font-semibold">AI Analysis</h2>
            </div>

            <Button
              onClick={analyzePolicy}
              disabled={isAnalyzing || !formData.title || !formData.description}
              className="w-full mb-4"
              variant="outline"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Policy
                </>
              )}
            </Button>

            {aiOptimization && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-civic-green" />
                  <span className="font-medium">Optimization Score</span>
                  <Badge variant="secondary">{aiOptimization.score}/100</Badge>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Suggestions
                  </h4>
                  <ul className="text-xs space-y-1">
                    {aiOptimization.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-civic-green mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Risk Factors
                  </h4>
                  <ul className="text-xs space-y-1">
                    {aiOptimization.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Estimated Impact</span>
                    <Badge variant="outline">
                      {Math.round(aiOptimization.estimatedImpact * 100)}%
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">Policy Preview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fund Allocation</span>
                <span className="font-medium flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" />
                  {formData.fundAllocation ? `${(parseInt(formData.fundAllocation) / 10000000).toFixed(1)}Cr` : '0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Criteria Count</span>
                <span className="font-medium">{formData.eligibilityCriteria.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Conditions Count</span>
                <span className="font-medium">{formData.executionConditions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target District</span>
                <span className="font-medium">{formData.district || 'Not selected'}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registering Policy...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Register Policy
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};