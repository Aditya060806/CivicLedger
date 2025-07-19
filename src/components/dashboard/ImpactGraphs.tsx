import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { GlassCard } from "@/components/common/GlassCard";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SchemeData {
  month: string;
  funds: number;
  complaints: number;
  beneficiaries: number;
}

const mockData: SchemeData[] = [
  { month: "Jan", funds: 20, complaints: 8, beneficiaries: 450 },
  { month: "Feb", funds: 35, complaints: 12, beneficiaries: 680 },
  { month: "Mar", funds: 55, complaints: 6, beneficiaries: 920 },
  { month: "Apr", funds: 75, complaints: 4, beneficiaries: 1250 },
  { month: "May", funds: 85, complaints: 3, beneficiaries: 1480 },
  { month: "Jun", funds: 90, complaints: 2, beneficiaries: 1650 }
];

export const ImpactGraphs = () => {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-civic-blue" />
          <h3 className="text-xl font-semibold">Scheme Impact Analytics</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 6 Months
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Utilization vs Complaints */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Fund Utilization vs Complaints</h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-civic-blue rounded-full" />
                <span>Funds (%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Complaints</span>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="funds" 
                  stroke="hsl(var(--civic-blue))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--civic-blue))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--civic-blue))", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="complaints" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--destructive))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Indicators */}
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-civic-green" />
              <span className="text-sm">Fund efficiency improving</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-civic-green" />
              <span className="text-sm">Complaints decreasing</span>
            </div>
          </div>
        </motion.div>

        {/* Beneficiary Growth */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Beneficiary Growth Impact</h4>
            <div className="flex items-center gap-1 text-sm">
              <div className="w-3 h-3 bg-gradient-to-r from-civic-green to-civic-success rounded-full" />
              <span>Beneficiaries</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="beneficiaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--civic-green))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--civic-green))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                  formatter={(value: number) => [value.toLocaleString(), "Beneficiaries"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="beneficiaries" 
                  stroke="hsl(var(--civic-green))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#beneficiaryGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Impact Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Impact", value: "8.4K", subtext: "Lives improved" },
              { label: "Growth Rate", value: "+267%", subtext: "vs last period" },
              { label: "Efficiency", value: "94.2%", subtext: "Target achieved" }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                className="text-center p-3 bg-civic-green/5 border border-civic-green/20 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="font-bold text-civic-green">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.subtext}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Key Insights */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-civic-blue/10 to-civic-purple/10 border border-civic-blue/20 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className="font-medium mb-2 text-civic-blue">🔍 Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-civic-green">•</span>
            <span>Complaint rate dropped 75% as fund utilization improved</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-civic-green">•</span>
            <span>Beneficiary growth accelerated after month 3 efficiency gains</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-civic-blue">•</span>
            <span>DAO governance changes correlate with performance improvements</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-civic-purple">•</span>
            <span>Predictive model suggests 95%+ efficiency achievable by Q4</span>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
};