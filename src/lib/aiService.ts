// AI Service for CivicLedger - Enhanced Analytics and Optimization
export class AIService {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
  }

  // Policy Analysis and Optimization
  async optimizePolicy(title: string, description: string): Promise<{
    score: number;
    suggestions: string[];
    riskFactors: string[];
    estimatedImpact: number;
    optimizedDescription?: string;
  }> {
    try {
      // Simulate AI analysis
      const score = this.calculatePolicyScore(title, description);
      const suggestions = this.generatePolicySuggestions(title, description);
      const riskFactors = this.identifyRiskFactors(description);
      const estimatedImpact = this.estimateImpact(title, description);

      return {
        score,
        suggestions,
        riskFactors,
        estimatedImpact,
        optimizedDescription: this.optimizeDescription(description)
      };
    } catch (error) {
      console.error('AI optimization failed:', error);
      return {
        score: 75,
        suggestions: ['Ensure clear eligibility criteria', 'Add measurable outcomes'],
        riskFactors: ['Implementation delays', 'Budget overruns'],
        estimatedImpact: 80
      };
    }
  }

  // Complaint Analysis
  async analyzeComplaint(description: string): Promise<{
    sentiment: string;
    priority: string;
    category: string;
    urgency: number;
    suggestedActions: string[];
    keywords: string[];
  }> {
    try {
      const sentiment = this.analyzeSentiment(description);
      const priority = this.determinePriority(description);
      const category = this.categorizeComplaint(description);
      const urgency = this.calculateUrgency(description);
      const suggestedActions = this.generateActions(description);
      const keywords = this.extractKeywords(description);

      return {
        sentiment,
        priority,
        category,
        urgency,
        suggestedActions,
        keywords
      };
    } catch (error) {
      console.error('Complaint analysis failed:', error);
      return {
        sentiment: 'neutral',
        priority: 'Medium',
        category: 'General',
        urgency: 50,
        suggestedActions: ['Review complaint', 'Contact citizen'],
        keywords: ['complaint', 'issue']
      };
    }
  }

  // Generate Policy Summary
  async generatePolicySummary(policies: any[]): Promise<string> {
    try {
      const totalPolicies = policies.length;
      const activePolicies = policies.filter(p => p.status === 'Active').length;
      const totalFunds = policies.reduce((sum, p) => sum + Number(p.fund_allocation || 0), 0);
      const releasedFunds = policies.reduce((sum, p) => sum + Number(p.fund_released || 0), 0);
      const avgTransparency = policies.reduce((sum, p) => sum + (p.transparency_score || 0), 0) / totalPolicies;

      const releaseRate = totalFunds > 0 ? (releasedFunds / totalFunds) * 100 : 0;
      const fundsCr = (totalFunds / 10000000).toFixed(1);

      return `Current governance overview: ${totalPolicies} policies managing ₹${fundsCr}Cr in public funds. ${activePolicies} policies are actively executing with ${releaseRate.toFixed(1)}% fund utilization rate. Average transparency score is ${(avgTransparency * 100).toFixed(1)}%, indicating strong accountability measures. Key focus areas include housing, infrastructure, and digital initiatives with citizen-centric execution tracking.`;
    } catch (error) {
      return 'AI analysis temporarily unavailable. System continues to operate with full transparency and real-time tracking capabilities.';
    }
  }

  // Real-time Insights
  async generateRealTimeInsights(metrics: any): Promise<{
    trends: string[];
    alerts: string[];
    recommendations: string[];
    performance: string;
  }> {
    const trends = [
      `${metrics.active_policies} policies currently executing`,
      `${metrics.transparency_score * 100}% transparency maintained`,
      `${metrics.total_beneficiaries} citizens benefited`
    ];

    const alerts = [];
    if (metrics.total_complaints > metrics.resolved_complaints * 2) {
      alerts.push('High complaint resolution backlog detected');
    }
    if (metrics.transparency_score < 0.9) {
      alerts.push('Transparency score below optimal threshold');
    }

    const recommendations = [
      'Increase citizen engagement through mobile notifications',
      'Implement predictive analytics for fund allocation',
      'Enhance cross-district collaboration mechanisms'
    ];

    const performance = metrics.hackathon_score > 90 ? 'Excellent' : 
                      metrics.hackathon_score > 80 ? 'Good' : 
                      metrics.hackathon_score > 70 ? 'Fair' : 'Needs Improvement';

    return { trends, alerts, recommendations, performance };
  }

  // Private helper methods
  private calculatePolicyScore(title: string, description: string): number {
    let score = 70; // Base score
    
    // Title analysis
    if (title.length > 10 && title.length < 100) score += 5;
    if (title.includes('Digital') || title.includes('Smart')) score += 3;
    
    // Description analysis
    if (description.length > 100) score += 10;
    if (description.includes('citizen') || description.includes('transparent')) score += 5;
    if (description.includes('measurable') || description.includes('timeline')) score += 5;
    
    return Math.min(score, 100);
  }

  private generatePolicySuggestions(title: string, description: string): string[] {
    const suggestions = [];
    
    if (!description.includes('timeline')) {
      suggestions.push('Add specific implementation timeline');
    }
    if (!description.includes('measurable')) {
      suggestions.push('Include measurable success metrics');
    }
    if (!description.includes('citizen')) {
      suggestions.push('Enhance citizen participation mechanisms');
    }
    if (description.length < 100) {
      suggestions.push('Provide more detailed implementation plan');
    }
    
    return suggestions.length > 0 ? suggestions : ['Policy structure is well-optimized'];
  }

  private identifyRiskFactors(description: string): string[] {
    const risks = [];
    
    if (description.includes('large scale') || description.includes('nationwide')) {
      risks.push('Implementation complexity due to scale');
    }
    if (description.includes('new technology') || description.includes('digital')) {
      risks.push('Technology adoption challenges');
    }
    if (!description.includes('budget') && !description.includes('fund')) {
      risks.push('Unclear budget allocation');
    }
    
    return risks.length > 0 ? risks : ['Low risk implementation'];
  }

  private estimateImpact(title: string, description: string): number {
    let impact = 60; // Base impact
    
    if (title.includes('National') || title.includes('All')) impact += 20;
    if (description.includes('rural') || description.includes('urban')) impact += 10;
    if (description.includes('employment') || description.includes('education')) impact += 15;
    
    return Math.min(impact, 100);
  }

  private optimizeDescription(description: string): string {
    return description + ' Enhanced with real-time monitoring, citizen feedback mechanisms, and transparent fund tracking for maximum accountability.';
  }

  private analyzeSentiment(text: string): string {
    const negativeWords = ['delay', 'problem', 'issue', 'corrupt', 'fraud', 'poor', 'bad'];
    const positiveWords = ['good', 'excellent', 'satisfied', 'happy', 'great'];
    
    const lowerText = text.toLowerCase();
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  private determinePriority(text: string): string {
    const urgentWords = ['urgent', 'critical', 'emergency', 'immediate'];
    const highWords = ['important', 'serious', 'major'];
    
    const lowerText = text.toLowerCase();
    
    if (urgentWords.some(word => lowerText.includes(word))) return 'Critical';
    if (highWords.some(word => lowerText.includes(word))) return 'High';
    if (text.length > 200) return 'Medium';
    return 'Low';
  }

  private categorizeComplaint(text: string): string {
    const categories = {
      'Infrastructure': ['road', 'bridge', 'building', 'construction'],
      'Healthcare': ['hospital', 'doctor', 'medicine', 'health'],
      'Education': ['school', 'teacher', 'education', 'student'],
      'Corruption': ['bribe', 'corrupt', 'fraud', 'illegal'],
      'Service': ['service', 'office', 'staff', 'delay']
    };
    
    const lowerText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    
    return 'General';
  }

  private calculateUrgency(text: string): number {
    let urgency = 30; // Base urgency
    
    if (text.includes('emergency')) urgency += 40;
    if (text.includes('urgent')) urgency += 30;
    if (text.includes('delay')) urgency += 20;
    if (text.length > 300) urgency += 10;
    
    return Math.min(urgency, 100);
  }

  private generateActions(text: string): string[] {
    const actions = ['Acknowledge complaint receipt'];
    
    if (text.includes('delay')) {
      actions.push('Investigate timeline delays');
    }
    if (text.includes('quality')) {
      actions.push('Conduct quality assessment');
    }
    if (text.includes('fund') || text.includes('money')) {
      actions.push('Review fund allocation');
    }
    
    actions.push('Contact citizen for updates');
    actions.push('Schedule resolution timeline');
    
    return actions;
  }

  private extractKeywords(text: string): string[] {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }
}

export const aiService = new AIService();