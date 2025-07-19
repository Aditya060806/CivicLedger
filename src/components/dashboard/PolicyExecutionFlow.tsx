import { motion } from "framer-motion";
import { CheckCircle, Clock, Users, Vote, Flag } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";

interface PolicyStage {
  id: string;
  name: string;
  emoji: string;
  status: "completed" | "active" | "pending";
  description: string;
}

interface PolicyExecutionFlowProps {
  schemeId?: string;
  stages?: PolicyStage[];
}

export const PolicyExecutionFlow = ({ schemeId, stages }: PolicyExecutionFlowProps) => {
  const defaultStages: PolicyStage[] = [
    {
      id: "sanctioned",
      name: "Sanctioned",
      emoji: "📋",
      status: "completed",
      description: "Policy approved and budget allocated"
    },
    {
      id: "contracted",
      name: "Contracted",
      emoji: "🤝",
      status: "completed", 
      description: "Contractor selected and agreement signed"
    },
    {
      id: "progress",
      name: "In Progress",
      emoji: "🚧",
      status: "active",
      description: "Implementation underway"
    },
    {
      id: "dao-verified",
      name: "DAO Verified",
      emoji: "🗳️",
      status: "pending",
      description: "Community verification in progress"
    },
    {
      id: "complete",
      name: "Complete",
      emoji: "✅",
      status: "pending",
      description: "Project successfully delivered"
    }
  ];

  const currentStages = stages || defaultStages;
  const activeStageIndex = currentStages.findIndex(stage => stage.status === "active");
  const completedStages = currentStages.filter(stage => stage.status === "completed").length;
  const progressPercentage = (completedStages / currentStages.length) * 100;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Policy Execution Flow</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Stage {activeStageIndex + 1} of {currentStages.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-civic-blue to-civic-green rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Stage Flow */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-muted" />
        <motion.div
          className="absolute top-8 left-8 h-0.5 bg-civic-blue"
          initial={{ width: 0 }}
          animate={{ width: `${(completedStages / (currentStages.length - 1)) * 100}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        <div className="relative flex justify-between">
          {currentStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              className="flex flex-col items-center text-center max-w-32"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Stage Circle */}
              <motion.div
                className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl mb-3 ${
                  stage.status === "completed"
                    ? "bg-civic-green/20 border-civic-green text-civic-green"
                    : stage.status === "active"
                    ? "bg-civic-blue/20 border-civic-blue text-civic-blue animate-pulse"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {stage.status === "completed" ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span>{stage.emoji}</span>
                )}
                
                {stage.status === "active" && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-civic-blue"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Stage Info */}
              <div className="space-y-1">
                <h4 className={`font-medium text-sm ${
                  stage.status === "active" ? "text-civic-blue" : ""
                }`}>
                  {stage.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-tight">
                  {stage.description}
                </p>
              </div>

              {/* Action Buttons for Active Stage */}
              {stage.status === "active" && (
                <motion.div
                  className="mt-3 flex gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {stage.id === "dao-verified" && (
                    <>
                      <button className="p-1 rounded-full bg-civic-green/20 text-civic-green hover:bg-civic-green/30 transition-colors">
                        <Vote className="w-3 h-3" />
                      </button>
                      <button className="p-1 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
                        <Flag className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current Stage Details */}
      {activeStageIndex >= 0 && (
        <motion.div
          className="mt-6 p-4 bg-civic-blue/5 border border-civic-blue/20 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{currentStages[activeStageIndex].emoji}</span>
            <h4 className="font-medium text-civic-blue">
              Current: {currentStages[activeStageIndex].name}
            </h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentStages[activeStageIndex].description}
          </p>
        </motion.div>
      )}
    </GlassCard>
  );
};