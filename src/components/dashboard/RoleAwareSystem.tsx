import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  HardHat, 
  Shield, 
  Vote, 
  Search, 
  MessageSquare, 
  Camera, 
  MapPin, 
  Clock, 
  Flag,
  FileText,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";
import { Input } from "@/components/ui/input";

type UserRole = "citizen" | "contractor" | "auditor" | "dao-member";

interface RoleConfig {
  id: UserRole;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const roles: RoleConfig[] = [
  {
    id: "citizen",
    name: "Citizen",
    icon: User,
    color: "civic-blue",
    description: "Track schemes, file complaints, participate in governance"
  },
  {
    id: "contractor",
    name: "Contractor",
    icon: HardHat,
    color: "civic-green",
    description: "Manage projects, upload progress, track payments"
  },
  {
    id: "auditor",
    name: "Auditor",
    icon: Shield,
    color: "civic-purple",
    description: "Verify implementations, assess quality, flag issues"
  },
  {
    id: "dao-member",
    name: "DAO Member",
    icon: Vote,
    color: "civic-success",
    description: "Vote on proposals, allocate funds, govern execution"
  }
];

export const RoleAwareSystem = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>("citizen");

  const getCurrentRoleConfig = () => roles.find(role => role.id === currentRole)!;

  const renderCitizenView = () => (
    <motion.div
      key="citizen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Scheme Finder */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-civic-blue" />
          <h4 className="font-semibold">🔎 Scheme Finder</h4>
        </div>
        <div className="flex gap-2 mb-3">
          <Input placeholder="Search by category, location, or benefits..." className="flex-1" />
          <Button variant="outline">Filter</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Rural Infra", "Women Schemes", "Health", "Education", "Housing"].map(category => (
            <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-civic-blue/20">
              {category}
            </Badge>
          ))}
        </div>
      </GlassCard>

      {/* File Complaint */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-civic-blue" />
          <h4 className="font-semibold">📝 File Complaint</h4>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              😡 <span>Corruption</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              😐 <span>Delay</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              😊 <span>Resolved</span>
            </Button>
          </div>
          <Button className="w-full bg-civic-blue hover:bg-civic-blue/80">
            Start New Complaint
          </Button>
        </div>
      </GlassCard>

      {/* DAO Wins */}
      <GlassCard className="p-4 bg-gradient-to-br from-civic-green/10 to-civic-success/10 border-civic-green/20">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉
          </motion.div>
          <h4 className="font-semibold text-civic-green">DAO-Funded Wins</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          3 schemes in your area got fast-tracked through community voting!
        </p>
        <motion.div
          className="h-1 bg-civic-green rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5 }}
        />
      </GlassCard>
    </motion.div>
  );

  const renderContractorView = () => (
    <motion.div
      key="contractor"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Work Log Carousel */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-civic-green" />
          <h4 className="font-semibold">Daily Work Log</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-square bg-muted rounded-lg p-3 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-xs">
                <div className="flex items-center gap-1 justify-center mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>Site {i}</span>
                </div>
                <div className="flex items-center gap-1 justify-center">
                  <Clock className="w-3 h-3" />
                  <span>8:30 AM</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-3 bg-civic-green hover:bg-civic-green/80">
          + Add Today's Progress
        </Button>
      </GlassCard>

      {/* Raise Flag */}
      <GlassCard className="p-4 border-yellow-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="w-5 h-5 text-yellow-600" />
          <h4 className="font-semibold">Raise Flag</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Report underpayment, resource shortage, or delays
        </p>
        <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10">
          Draft DAO Notice
        </Button>
      </GlassCard>
    </motion.div>
  );

  const renderAuditorView = () => (
    <motion.div
      key="auditor"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Audit Timeline */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-civic-purple" />
          <h4 className="font-semibold">Audit Timeline</h4>
        </div>
        <div className="space-y-3">
          {[
            { status: "🔥", label: "Urgent", count: 3 },
            { status: "⏳", label: "Backlog", count: 8 },
            { status: "✅", label: "Completed", count: 12 }
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <div className="flex items-center gap-2">
                <span>{item.status}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              <Badge variant="secondary">{item.count}</Badge>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Actions */}
      <GlassCard className="p-4">
        <h4 className="font-semibold mb-4">Quick Actions</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="w-4 h-4 mr-2" />
            💬 Request Clarification
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MapPin className="w-4 h-4 mr-2" />
            ⛳ Confirm On-Site
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );

  const renderDAOMemberView = () => (
    <motion.div
      key="dao-member"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Fund Chain Visualizer */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Vote className="w-5 h-5 text-civic-success" />
          <h4 className="font-semibold">Fund Chain Visualizer</h4>
        </div>
        <div className="space-y-2">
          {["Sanctioned", "Transferred", "In Use", "Disbursed"].map((stage, i) => (
            <div key={stage} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${i < 2 ? "bg-civic-success" : "bg-muted"}`} />
              <span className="flex-1">{stage}</span>
              <span className="text-sm text-muted-foreground">{i < 2 ? "✓" : "⏳"}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Voting Actions */}
      <GlassCard className="p-4">
        <h4 className="font-semibold mb-4">Governance Actions</h4>
        <div className="space-y-2">
          <Button className="w-full bg-civic-success hover:bg-civic-success/80">
            🗳️ Cast Vote
          </Button>
          <Button variant="destructive" className="w-full">
            🛑 Flag Execution
          </Button>
        </div>
      </GlassCard>

      {/* DAO Metrics */}
      <GlassCard className="p-4">
        <h4 className="font-semibold mb-4">DAO Metrics</h4>
        <div className="space-y-3">
          {[
            { label: "Citizen Impact Score", value: "94.2%", color: "civic-success" },
            { label: "Voting Latency", value: "2.3 days", color: "yellow-500" },
            { label: "Budget Utilization", value: "87.5%", color: "civic-blue" }
          ].map(metric => (
            <div key={metric.label} className="flex justify-between items-center">
              <span className="text-sm">{metric.label}</span>
              <span className={`font-medium text-${metric.color}`}>{metric.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );

  const renderRoleContent = () => {
    switch (currentRole) {
      case "citizen": return renderCitizenView();
      case "contractor": return renderContractorView();
      case "auditor": return renderAuditorView();
      case "dao-member": return renderDAOMemberView();
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Switcher */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5" />
          <h3 className="font-semibold">Role Perspective</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {roles.map(role => {
            const isActive = currentRole === role.id;
            const IconComponent = role.icon;
            
            return (
              <motion.button
                key={role.id}
                onClick={() => setCurrentRole(role.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isActive 
                    ? `border-${role.color} bg-${role.color}/10` 
                    : "border-muted hover:border-muted-foreground/50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <IconComponent 
                    className={`w-6 h-6 ${isActive ? `text-${role.color}` : "text-muted-foreground"}`} 
                  />
                  <span className={`text-sm font-medium ${isActive ? `text-${role.color}` : ""}`}>
                    {role.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.p 
          key={currentRole}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mt-3 text-center"
        >
          {getCurrentRoleConfig().description}
        </motion.p>
      </GlassCard>

      {/* Role-Specific Content */}
      <AnimatePresence mode="wait">
        {renderRoleContent()}
      </AnimatePresence>
    </div>
  );
};