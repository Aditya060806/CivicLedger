import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedIndiaMap } from "@/components/maps/EnhancedIndiaMap";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  BarChart3,
  Activity,
  MapPin,
  ArrowUp,
  ArrowDown,
  Target,
  Calendar,
  Filter
} from "lucide-react";

interface DashboardStats {
  totalFunding: number;
  activePolicies: number;
  citizensEnrolled: number;
  transparencyScore: number;
  fundUtilization: number;
  completedProjects: number;
  ongoingProjects: number;
  pendingApprovals: number;
}

interface PolicyDistribution {
  name: string;
  value: number;
  color: string;
}

interface TrendData {
  month: string;
  funding: number;
  policies: number;
  citizens: number;
}

const SAMPLE_STATS: DashboardStats = {
  totalFunding: 25000000,
  activePolicies: 156,
  citizensEnrolled: 124500,
  transparencyScore: 98.2,
  fundUtilization: 87.5,
  completedProjects: 89,
  ongoingProjects: 45,
  pendingApprovals: 22
};

const POLICY_DISTRIBUTION: PolicyDistribution[] = [
  { name: "Healthcare", value: 35, color: "#10b981" },
  { name: "Education", value: 28, color: "#3b82f6" },
  { name: "Infrastructure", value: 22, color: "#f59e0b" },
  { name: "Agriculture", value: 15, color: "#8b5cf6" }
];

const TREND_DATA: TrendData[] = [
  { month: "Jan", funding: 18000000, policies: 120, citizens: 95000 },
  { month: "Feb", funding: 19500000, policies: 128, citizens: 102000 },
  { month: "Mar", funding: 21200000, policies: 135, citizens: 108500 },
  { month: "Apr", funding: 22800000, policies: 142, citizens: 115000 },
  { month: "May", funding: 24100000, policies: 149, citizens: 119500 },
  { month: "Jun", funding: 25000000, policies: 156, citizens: 124500 }
];

interface StatCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: number;
  color: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, title, value, suffix = "", prefix = "", trend, color, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <GlassCard className="p-6 card-hover-glow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${trend >= 0 ? 'text-civic-green' : 'text-civic-red'}`}>
              {trend >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-bold number-counter">
            {prefix}
            <CountUp
              end={value}
              duration={2}
              delay={delay}
              separator=","
              decimals={suffix === "%" ? 1 : 0}
            />
            {suffix}
          </p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <GlassCard className="p-3 border-0">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </GlassCard>
    );
  }
  return null;
};

export const EnhancedDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<"1M" | "3M" | "6M" | "1Y">("6M");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const statCards = [
    {
      icon: DollarSign,
      title: "Total Funds Allocated",
      value: SAMPLE_STATS.totalFunding / 100000, // Convert to lakhs
      suffix: "L",
      prefix: "₹",
      trend: 12.5,
      color: "from-civic-green to-civic-green-light"
    },
    {
      icon: FileText,
      title: "Active Policies",
      value: SAMPLE_STATS.activePolicies,
      trend: 8.2,
      color: "from-civic-blue to-civic-blue-light"
    },
    {
      icon: Users,
      title: "Citizens Enrolled",
      value: SAMPLE_STATS.citizensEnrolled,
      trend: 15.7,
      color: "from-civic-mint to-civic-mint-light"
    },
    {
      icon: CheckCircle,
      title: "Transparency Score",
      value: SAMPLE_STATS.transparencyScore,
      suffix: "%",
      trend: 2.1,
      color: "from-civic-gold to-civic-orange"
    },
    {
      icon: Target,
      title: "Fund Utilization",
      value: SAMPLE_STATS.fundUtilization,
      suffix: "%",
      trend: 5.3,
      color: "from-civic-purple to-civic-indigo"
    },
    {
      icon: Activity,
      title: "Completed Projects",
      value: SAMPLE_STATS.completedProjects,
      trend: 18.9,
      color: "from-civic-teal to-civic-cyan"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Enhanced Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights into policy execution and citizen engagement</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          {["1M", "3M", "6M", "1Y"].map((range) => (
            <Button
              key={range}
              size="sm"
              variant={selectedTimeRange === range ? "default" : "outline"}
              onClick={() => setSelectedTimeRange(range as any)}
              className="micro-interaction"
            >
              {range}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Distribution Donut Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <GlassCard className="p-6 card-hover-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Policy Distribution</h3>
              <BarChart3 className="w-5 h-5 text-civic-blue" />
            </div>
            
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={POLICY_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {POLICY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              {POLICY_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {item.value}%
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <GlassCard className="p-6 card-hover-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Growth Trends</h3>
              <TrendingUp className="w-5 h-5 text-civic-green" />
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={TREND_DATA}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="policies" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="citizens" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-civic-blue" />
                <span className="text-sm">Policies</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-civic-green" />
                <span className="text-sm">Citizens</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Interactive Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <GlassCard className="p-6 card-hover-glow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Policy Impact Zones</h3>
              <p className="text-sm text-muted-foreground">Real-time visualization of policy implementation across India</p>
            </div>
            <MapPin className="w-5 h-5 text-civic-blue" />
          </div>
          
          <EnhancedIndiaMap />
        </GlassCard>
      </motion.div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <GlassCard className="p-6 card-hover-glow">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { icon: FileText, label: "Create New Policy", color: "text-civic-blue" },
                { icon: Users, label: "Citizen Enrollment", color: "text-civic-green" },
                { icon: Activity, label: "Generate Report", color: "text-civic-purple" },
                { icon: CheckCircle, label: "Audit Review", color: "text-civic-gold" }
              ].map((action, index) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="w-full justify-start micro-interaction"
                >
                  <action.icon className={`w-4 h-4 mr-3 ${action.color}`} />
                  {action.label}
                </Button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <GlassCard className="p-6 card-hover-glow">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { type: "success", message: "Policy P-2024-045 executed successfully", time: "2 min ago" },
                { type: "info", message: "New citizen enrollment: 125 applications", time: "15 min ago" },
                { type: "warning", message: "Fund utilization alert for Project X", time: "1 hour ago" },
                { type: "success", message: "Audit completed for Healthcare scheme", time: "3 hours ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 micro-interaction p-2 rounded-lg hover:bg-muted/50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "success" ? "bg-civic-green" :
                    activity.type === "warning" ? "bg-civic-gold" : "bg-civic-blue"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};