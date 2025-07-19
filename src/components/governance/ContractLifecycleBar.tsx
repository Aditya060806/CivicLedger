import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  Play, 
  Camera, 
  ShieldCheck, 
  Vote,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";

interface LifecycleStage {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "completed" | "active" | "pending" | "failed";
  timestamp?: string;
  description: string;
}

const stages: LifecycleStage[] = [
  {
    id: "sanctioned",
    name: "Sanctioned",
    icon: FileCheck,
    status: "completed",
    timestamp: "2024-01-15",
    description: "Policy approved and funds allocated"
  },
  {
    id: "in_progress",
    name: "In Progress",
    icon: Play,
    status: "active",
    timestamp: "2024-01-20",
    description: "Execution underway with contractor"
  },
  {
    id: "proof",
    name: "Proof Submitted",
    icon: Camera,
    status: "pending",
    description: "Awaiting proof of work submission"
  },
  {
    id: "audited",
    name: "Audited",
    icon: ShieldCheck,
    status: "pending",
    description: "Independent verification required"
  },
  {
    id: "dao_approved",
    name: "DAO Approved",
    icon: Vote,
    status: "pending",
    description: "Community validation and final approval"
  }
];

export const ContractLifecycleBar = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-civic-green text-white border-civic-green";
      case "active":
        return "bg-civic-blue text-white border-civic-blue";
      case "pending":
        return "bg-muted text-muted-foreground border-border";
      case "failed":
        return "bg-destructive text-destructive-foreground border-destructive";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle2;
      case "active":
        return Play;
      case "pending":
        return Clock;
      case "failed":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  return (
    <div className="w-full p-6 bg-gradient-to-r from-background via-primary/5 to-background border rounded-xl shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Contract Execution Lifecycle</h3>
        <p className="text-sm text-muted-foreground">Track policy implementation from approval to completion</p>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-12 right-12 h-0.5 bg-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "40%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-civic-green via-civic-blue to-civic-blue"
            />
          </div>

          {/* Stages */}
          <div className="flex justify-between items-start relative">
            {stages.map((stage, index) => {
              const StatusIcon = getStatusIcon(stage.status);
              const isActive = stage.status === "active";
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col items-center space-y-3 max-w-[120px]"
                >
                  {/* Icon Circle */}
                  <div className="relative">
                    <motion.div
                      animate={isActive ? { 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                          "0 0 0 10px rgba(59, 130, 246, 0)",
                          "0 0 0 0 rgba(59, 130, 246, 0)"
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                      className={`
                        w-16 h-16 rounded-full border-2 flex items-center justify-center
                        ${getStatusColor(stage.status)}
                        ${isActive ? 'shadow-lg' : ''}
                      `}
                    >
                      <stage.icon className="w-6 h-6" />
                      {stage.status === "active" && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-civic-blue opacity-50"
                        />
                      )}
                    </motion.div>
                    
                    <div className="absolute -top-1 -right-1">
                      <StatusIcon className={`w-4 h-4 ${
                        stage.status === "completed" ? "text-civic-green" :
                        stage.status === "active" ? "text-civic-blue" :
                        stage.status === "failed" ? "text-destructive" :
                        "text-muted-foreground"
                      }`} />
                    </div>
                  </div>

                  {/* Stage Info */}
                  <div className="text-center space-y-2">
                    <h4 className="font-medium text-sm">{stage.name}</h4>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {stage.description}
                    </p>
                    {stage.timestamp && (
                      <Badge variant="outline" className="text-xs">
                        {stage.timestamp}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {stages.map((stage, index) => {
          const StatusIcon = getStatusIcon(stage.status);
          const isActive = stage.status === "active";
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center space-x-4 p-3 rounded-lg border
                ${isActive ? 'border-civic-blue bg-civic-blue/5' : 'border-border'}
              `}
            >
              <motion.div
                animate={isActive ? { 
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center
                  ${getStatusColor(stage.status)}
                `}
              >
                <stage.icon className="w-5 h-5" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{stage.name}</h4>
                  <StatusIcon className={`w-3 h-3 ${
                    stage.status === "completed" ? "text-civic-green" :
                    stage.status === "active" ? "text-civic-blue" :
                    stage.status === "failed" ? "text-destructive" :
                    "text-muted-foreground"
                  }`} />
                </div>
                <p className="text-xs text-muted-foreground">{stage.description}</p>
                {stage.timestamp && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {stage.timestamp}
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};