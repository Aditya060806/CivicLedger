import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  IndianRupee,
  Eye,
  Settings,
  Zap,
  Activity
} from "lucide-react";

interface PolicyData {
  id: string;
  name: string;
  description: string;
  status: "pending" | "executing" | "paused" | "completed" | "failed";
  progress: number;
  fundAllocated: number;
  fundUsed: number;
  beneficiaries: number;
  targetBeneficiaries: number;
  estimatedCompletion: string;
  contractAddress: string;
  lastUpdate: string;
  milestones: {
    id: string;
    name: string;
    completed: boolean;
    date?: string;
  }[];
}

interface PolicyExecutionCardProps {
  policyData: PolicyData;
  onTrigger?: (policyId: string, action: string) => void;
  canControl?: boolean;
}

export const PolicyExecutionCard = ({ 
  policyData, 
  onTrigger, 
  canControl = false 
}: PolicyExecutionCardProps) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [realTimeData, setRealTimeData] = useState(policyData);
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (realTimeData.status === "executing") {
        setRealTimeData(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 2, 100),
          fundUsed: Math.min(prev.fundUsed + Math.random() * 10000, prev.fundAllocated),
          beneficiaries: Math.min(prev.beneficiaries + Math.floor(Math.random() * 5), prev.targetBeneficiaries),
          lastUpdate: "Just now"
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeData.status]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      executing: "bg-blue-100 text-blue-800 border-blue-200",
      paused: "bg-orange-100 text-orange-800 border-orange-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      executing: Activity,
      paused: Pause,
      completed: CheckCircle,
      failed: AlertTriangle
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const handleAction = async (action: string) => {
    setIsExecuting(true);
    setExecutionProgress(0);

    // Simulate execution feedback
    const steps = [
      { progress: 20, message: "Validating smart contract..." },
      { progress: 40, message: "Checking fund availability..." },
      { progress: 60, message: "Executing policy logic..." },
      { progress: 80, message: "Updating blockchain state..." },
      { progress: 100, message: "Policy action completed!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setExecutionProgress(step.progress);
    }

    // Generate mock transaction ID
    const txId = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;

    // Update policy status based on action
    const newStatus = action === "execute" ? "executing" : 
                     action === "pause" ? "paused" : 
                     action === "stop" ? "pending" : realTimeData.status;

    setRealTimeData(prev => ({
      ...prev,
      status: newStatus as any,
      lastUpdate: "Just now"
    }));

    toast({
      title: `Policy ${action} successful! ✅`,
      description: `Transaction ID: ${txId}`,
      duration: 4000
    });

    setIsExecuting(false);
    setExecutionProgress(0);
    onTrigger?.(realTimeData.id, action);
  };

  const completedMilestones = realTimeData.milestones.filter(m => m.completed).length;
  const progressPercentage = (completedMilestones / realTimeData.milestones.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden border-2 hover:shadow-elevation transition-all duration-300">
        {/* Status Indicator Bar */}
        <div className={`h-1 w-full ${
          realTimeData.status === "executing" ? "bg-gradient-to-r from-civic-blue to-civic-green" :
          realTimeData.status === "completed" ? "bg-civic-green" :
          realTimeData.status === "paused" ? "bg-orange-400" :
          realTimeData.status === "failed" ? "bg-red-400" :
          "bg-gray-300"
        }`} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg font-bold leading-tight">
                {realTimeData.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {realTimeData.description}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(realTimeData.status)} variant="outline">
                {getStatusIcon(realTimeData.status)}
                <span className="ml-1 capitalize">{realTimeData.status}</span>
              </Badge>
              
              {realTimeData.status === "executing" && (
                <div className="flex items-center gap-1 text-xs text-civic-blue">
                  <div className="w-2 h-2 bg-civic-blue rounded-full animate-pulse" />
                  Live
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Execution Progress</span>
              <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground">
              {completedMilestones} of {realTimeData.milestones.length} milestones completed
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <IndianRupee className="w-3 h-3" />
                Fund Utilization
              </div>
              <div className="text-sm font-semibold">
                ₹{(realTimeData.fundUsed / 100000).toFixed(1)}L / ₹{(realTimeData.fundAllocated / 100000).toFixed(1)}L
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-civic-green h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(realTimeData.fundUsed / realTimeData.fundAllocated) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                Beneficiaries
              </div>
              <div className="text-sm font-semibold">
                {realTimeData.beneficiaries.toLocaleString()} / {realTimeData.targetBeneficiaries.toLocaleString()}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-civic-blue h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(realTimeData.beneficiaries / realTimeData.targetBeneficiaries) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Execution Feedback */}
          <AnimatePresence>
            {isExecuting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-civic-blue/5 border border-civic-blue/20 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-civic-blue animate-pulse" />
                  <span className="text-sm font-medium">Executing Policy Action...</span>
                </div>
                <Progress value={executionProgress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {executionProgress < 20 && "Validating smart contract..."}
                  {executionProgress >= 20 && executionProgress < 40 && "Checking fund availability..."}
                  {executionProgress >= 40 && executionProgress < 60 && "Executing policy logic..."}
                  {executionProgress >= 60 && executionProgress < 80 && "Updating blockchain state..."}
                  {executionProgress >= 80 && "Policy action completed!"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Milestones */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Recent Milestones</div>
            <div className="space-y-1">
              {realTimeData.milestones.slice(-2).map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2 text-xs">
                  {milestone.completed ? (
                    <CheckCircle className="w-3 h-3 text-civic-green" />
                  ) : (
                    <Clock className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className={milestone.completed ? "text-foreground" : "text-muted-foreground"}>
                    {milestone.name}
                  </span>
                  {milestone.date && (
                    <span className="text-muted-foreground ml-auto">{milestone.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contract Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Contract: {realTimeData.contractAddress}</div>
            <div>Last Update: {realTimeData.lastUpdate}</div>
            <div>Est. Completion: {realTimeData.estimatedCompletion}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {canControl && (
              <>
                {realTimeData.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => handleAction("execute")}
                    disabled={isExecuting}
                    className="bg-civic-green hover:bg-civic-green-dark text-white"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Execute
                  </Button>
                )}

                {realTimeData.status === "executing" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("pause")}
                    disabled={isExecuting}
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Pause className="w-3 h-3 mr-1" />
                    Pause
                  </Button>
                )}

                {(realTimeData.status === "executing" || realTimeData.status === "paused") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("stop")}
                    disabled={isExecuting}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Square className="w-3 h-3 mr-1" />
                    Stop
                  </Button>
                )}
              </>
            )}

            <Button size="sm" variant="outline" className="ml-auto">
              <Eye className="w-3 h-3 mr-1" />
              Details
            </Button>

            {canControl && (
              <Button size="sm" variant="outline">
                <Settings className="w-3 h-3 mr-1" />
                Config
              </Button>
            )}
          </div>
        </CardContent>

        {/* Glow effect for executing policies */}
        {realTimeData.status === "executing" && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-civic-blue/5 via-transparent to-civic-green/5 pointer-events-none" />
        )}
      </Card>
    </motion.div>
  );
};