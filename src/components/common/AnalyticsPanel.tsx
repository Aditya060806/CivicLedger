import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  IndianRupee,
  MapPin,
  BarChart3,
  PieChart,
  Target
} from "lucide-react";

interface AnalyticsData {
  totalSchemes: number;
  complaintsPerScheme: number;
  fundDisbursedPercentage: number;
  topFlaggedDistricts: Array<{
    name: string;
    complaints: number;
    severity: "high" | "medium" | "low";
  }>;
  monthlyTrends: Array<{
    month: string;
    schemes: number;
    complaints: number;
  }>;
}

export const AnalyticsPanel = () => {
  const analyticsData: AnalyticsData = {
    totalSchemes: 24,
    complaintsPerScheme: 2.3,
    fundDisbursedPercentage: 68,
    topFlaggedDistricts: [
      { name: "East Delhi", complaints: 15, severity: "high" },
      { name: "North Delhi", complaints: 12, severity: "high" },
      { name: "South Delhi", complaints: 8, severity: "medium" },
      { name: "West Delhi", complaints: 6, severity: "medium" },
      { name: "Central Delhi", complaints: 3, severity: "low" }
    ],
    monthlyTrends: [
      { month: "Oct", schemes: 8, complaints: 12 },
      { month: "Nov", schemes: 12, complaints: 18 },
      { month: "Dec", schemes: 15, complaints: 22 },
      { month: "Jan", schemes: 24, complaints: 44 }
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-500 bg-red-50 border-red-200";
      case "medium": return "text-orange-500 bg-orange-50 border-orange-200";
      case "low": return "text-green-500 bg-green-50 border-green-200";
      default: return "text-gray-500 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">System-wide insights and metrics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Target className="w-4 h-4" />
          <span>Admin Only</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-civic-green/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-civic-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Schemes</p>
                <p className="text-2xl font-bold">{analyticsData.totalSchemes}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Complaints</p>
                <p className="text-2xl font-bold">{analyticsData.complaintsPerScheme}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-civic-blue/20 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-civic-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fund Disbursed</p>
                <p className="text-2xl font-bold">{analyticsData.fundDisbursedPercentage}%</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-civic-gold/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-civic-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">+24%</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Animated Progress Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">Fund Disbursement Progress</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Background Circle */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                
                {/* Progress Circle */}
                <motion.path
                  className="text-civic-green"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ 
                    strokeDasharray: `${analyticsData.fundDisbursedPercentage} 100` 
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </svg>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <div className="text-2xl font-bold text-civic-green">
                    {analyticsData.fundDisbursedPercentage}%
                  </div>
                  <div className="text-xs text-muted-foreground">Disbursed</div>
                </motion.div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Top Flagged Districts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top 5 Flagged Districts</h3>
          <div className="space-y-3">
            {analyticsData.topFlaggedDistricts.map((district, index) => (
              <motion.div
                key={district.name}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-civic-blue/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-civic-blue" />
                  </div>
                  <div>
                    <p className="font-medium">{district.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {district.complaints} complaints
                    </p>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(district.severity)}`}>
                  {district.severity}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {analyticsData.monthlyTrends.map((trend, index) => (
              <motion.div
                key={trend.month}
                className="flex items-center justify-between"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <span className="text-sm font-medium w-12">{trend.month}</span>
                
                <div className="flex-1 mx-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-civic-green h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(trend.schemes / 24) * 100}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16">
                      {trend.schemes} schemes
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-orange-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(trend.complaints / 44) * 100}%` }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16">
                      {trend.complaints} issues
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};