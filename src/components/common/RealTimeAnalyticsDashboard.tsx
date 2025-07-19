import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  Target
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MetricData {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  trend: number[];
  color: string;
}

interface RealTimeAnalyticsDashboardProps {
  className?: string;
}

export const RealTimeAnalyticsDashboard: React.FC<RealTimeAnalyticsDashboardProps> = ({ className }) => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      id: 'funds',
      title: 'Total Funds Tracked',
      value: '₹2.5Cr',
      change: 12.5,
      changeType: 'increase',
      icon: DollarSign,
      trend: [2.1, 2.2, 2.3, 2.4, 2.5],
      color: 'civic-green'
    },
    {
      id: 'policies',
      title: 'Active Policies',
      value: 156,
      change: 8.2,
      changeType: 'increase',
      icon: FileText,
      trend: [140, 145, 150, 153, 156],
      color: 'civic-blue'
    },
    {
      id: 'citizens',
      title: 'Citizens Enrolled',
      value: '12,450',
      change: 15.7,
      changeType: 'increase',
      icon: Users,
      trend: [10800, 11200, 11600, 12000, 12450],
      color: 'civic-purple'
    },
    {
      id: 'transparency',
      title: 'Transparency Score',
      value: '98.2%',
      change: 2.1,
      changeType: 'increase',
      icon: Eye,
      trend: [96.1, 96.8, 97.5, 97.9, 98.2],
      color: 'civic-orange'
    },
    {
      id: 'contracts',
      title: 'Smart Contracts',
      value: 48,
      change: 4.3,
      changeType: 'increase',
      icon: Activity,
      trend: [42, 44, 46, 47, 48],
      color: 'civic-teal'
    },
    {
      id: 'efficiency',
      title: 'Efficiency Index',
      value: '94.7%',
      change: 1.8,
      changeType: 'increase',
      icon: Target,
      trend: [91.2, 92.5, 93.1, 94.0, 94.7],
      color: 'civic-indigo'
    }
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const timeframes = ['1h', '24h', '7d', '30d'];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        // Simulate small random changes
        change: metric.change + (Math.random() - 0.5) * 0.5,
        trend: [...metric.trend.slice(1), metric.trend[metric.trend.length - 1] + (Math.random() - 0.5) * 0.1]
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderMiniChart = (trend: number[], color: string) => {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;

    return (
      <div className="flex items-end h-8 gap-1">
        {trend.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <motion.div
              key={index}
              className={`w-1 bg-${color} rounded-sm opacity-70`}
              style={{ height: `${Math.max(height, 10)}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Real-Time Analytics</h2>
          <p className="text-muted-foreground">Live governance metrics and performance indicators</p>
        </div>
        
        <div className="flex items-center gap-2">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
              className={cn(
                "h-8 text-xs",
                selectedTimeframe === timeframe 
                  ? "bg-civic-blue text-white" 
                  : "hover:bg-civic-blue/10"
              )}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6 enhanced-card">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${metric.color}/10`}>
                  <metric.icon className={`w-5 h-5 text-${metric.color}`} />
                </div>
                <Badge 
                  variant={metric.changeType === 'increase' ? 'default' : 'secondary'}
                  className={cn(
                    "text-xs",
                    metric.changeType === 'increase' && "bg-civic-success/10 text-civic-success",
                    metric.changeType === 'decrease' && "bg-civic-error/10 text-civic-error"
                  )}
                >
                  <div className="flex items-center gap-1">
                    {metric.changeType === 'increase' ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {Math.abs(metric.change).toFixed(1)}%
                  </div>
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </h3>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-foreground number-counter">
                    {metric.value}
                  </span>
                  {renderMiniChart(metric.trend, metric.color)}
                </div>
              </div>
              
              {/* Live indicator */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <div className="w-2 h-2 bg-civic-success rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Live data</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-civic-green" />
            <h3 className="text-lg font-semibold">Key Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-civic-blue">Performance Highlights</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 15.7% increase in citizen engagement this month</li>
                <li>• Smart contract execution efficiency at 98.2%</li>
                <li>• Zero fund allocation disputes in the last 30 days</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-civic-green">Recent Achievements</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Successfully automated 48 policy executions</li>
                <li>• Reduced processing time by 67% using smart contracts</li>
                <li>• Achieved highest transparency score in government tech</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};