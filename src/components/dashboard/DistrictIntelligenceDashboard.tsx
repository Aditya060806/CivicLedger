import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Users, 
  MapPin,
  Filter,
  ChevronRight
} from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DistrictScheme {
  id: string;
  name: string;
  district: string;
  state: string;
  fundUtilization: number;
  complaintCount: number;
  auditStatus: "verified" | "pending" | "flagged";
  healthStatus: "healthy" | "alert" | "delayed";
  beneficiaries: number;
  lastUpdate: string;
  contractor: string;
  daoScore: number;
}

const mockSchemes: DistrictScheme[] = [
  {
    id: "1",
    name: "PM Awas Yojana - Phase 3",
    district: "North Delhi",
    state: "Delhi",
    fundUtilization: 75,
    complaintCount: 3,
    auditStatus: "verified",
    healthStatus: "healthy",
    beneficiaries: 1250,
    lastUpdate: "2 hours ago",
    contractor: "Urban Infrastructure Ltd",
    daoScore: 94
  },
  {
    id: "2",
    name: "Digital Literacy Campaign",
    district: "East Delhi",
    state: "Delhi",
    fundUtilization: 45,
    complaintCount: 7,
    auditStatus: "pending",
    healthStatus: "alert",
    beneficiaries: 850,
    lastUpdate: "3 days ago",
    contractor: "TechEd Solutions",
    daoScore: 67
  },
  {
    id: "3",
    name: "Rural Road Development",
    district: "West Delhi",
    state: "Delhi",
    fundUtilization: 88,
    complaintCount: 2,
    auditStatus: "verified",
    healthStatus: "delayed",
    beneficiaries: 2100,
    lastUpdate: "5 hours ago",
    contractor: "Infrastructure Pro",
    daoScore: 82
  }
];

export const DistrictIntelligenceDashboard = () => {
  const [selectedState, setSelectedState] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [schemes] = useState<DistrictScheme[]>(mockSchemes);

  const getHealthEmoji = (status: string) => {
    switch (status) {
      case "healthy": return "🟢";
      case "alert": return "🔴";
      case "delayed": return "🟡";
      default: return "⚪";
    }
  };

  const getHealthLabel = (status: string) => {
    switch (status) {
      case "healthy": return "Healthy";
      case "alert": return "Alert";
      case "delayed": return "Delayed";
      default: return "Unknown";
    }
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-civic-green/20 text-civic-green";
      case "pending": return "bg-yellow-500/20 text-yellow-600";
      case "flagged": return "bg-red-500/20 text-red-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === "all" || scheme.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">District Intelligence Dashboard</h3>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search schemes or districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Schemes", value: schemes.length, icon: MapPin, color: "civic-blue" },
          { label: "Avg Fund Usage", value: "69%", icon: TrendingUp, color: "civic-green" },
          { label: "Active Complaints", value: "12", icon: AlertTriangle, color: "red-500" },
          { label: "DAO Score", value: "81", icon: Users, color: "civic-purple" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-3 bg-gradient-to-br from-background to-muted/50 border rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`w-4 h-4 text-${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className="text-lg font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Scheme Cards */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            className="group p-4 border rounded-xl hover:bg-muted/50 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{getHealthEmoji(scheme.healthStatus)}</span>
                  <div>
                    <h4 className="font-semibold">{scheme.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{scheme.district}, {scheme.state}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{scheme.lastUpdate}</span>
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Fund Usage</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <motion.div
                          className={`h-full rounded-full ${
                            scheme.fundUtilization > 80 ? "bg-civic-green" :
                            scheme.fundUtilization > 60 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${scheme.fundUtilization}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-sm font-medium">{scheme.fundUtilization}%</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Complaints</div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{scheme.complaintCount}</span>
                      {scheme.complaintCount > 5 ? (
                        <TrendingUp className="w-3 h-3 text-red-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-civic-green" />
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Beneficiaries</div>
                    <div className="font-medium">{scheme.beneficiaries.toLocaleString()}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">DAO Score</div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{scheme.daoScore}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        scheme.daoScore > 80 ? "bg-civic-green" :
                        scheme.daoScore > 60 ? "bg-yellow-500" : "bg-red-500"
                      }`} />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {getHealthEmoji(scheme.healthStatus)} {getHealthLabel(scheme.healthStatus)}
                  </Badge>
                  <Badge className={`text-xs ${getAuditStatusColor(scheme.auditStatus)}`}>
                    Audit: {scheme.auditStatus}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {scheme.contractor}
                  </Badge>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No schemes found matching your criteria</p>
        </div>
      )}
    </GlassCard>
  );
};