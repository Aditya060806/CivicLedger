import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Users, 
  IndianRupee,
  Zap,
  Brain,
  BarChart3,
  Timer,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

type PolicyState = "idle" | "triggered" | "processing" | "executed";

interface PolicyData {
  id: string;
  name: string;
  description: string;
  fundAllocated: number;
  fundReleased: number;
  beneficiaries: number;
  votes: { for: number; against: number };
  executionProgress: number;
  aiDescription: string;
  state: PolicyState;
  timeline: { phase: string; status: "completed" | "current" | "pending"; date?: string }[];
}

interface PolicyCardProps {
  policy: PolicyData;
  onTrigger: () => void;
  className?: string;
}

export const PolicyCard = ({ policy, onTrigger, className }: PolicyCardProps) => {
  const [currentState, setCurrentState] = useState<PolicyState>(policy.state);
  const [timelinePosition, setTimelinePosition] = useState([policy.executionProgress]);
  const [isAnimating, setIsAnimating] = useState(false);

  const stateConfig = {
    idle: { color: "bg-gray-500", label: "Idle", icon: Clock },
    triggered: { color: "bg-civic-blue", label: "Triggered", icon: Zap },
    processing: { color: "bg-civic-gold", label: "Processing", icon: Timer },
    executed: { color: "bg-civic-green", label: "Executed", icon: CheckCircle }
  };

  const triggerStateTransition = () => {
    if (currentState === "idle") {
      setIsAnimating(true);
      setCurrentState("triggered");
      
      setTimeout(() => setCurrentState("processing"), 1000);
      setTimeout(() => setCurrentState("executed"), 3000);
      setTimeout(() => {
        setIsAnimating(false);
        onTrigger();
      }, 4000);
    }
  };

  const StateIcon = stateConfig[currentState].icon;

  return (
    <GlassCard className={cn("p-6 relative overflow-hidden", className)}>
      {/* Background Animation */}
      <div className={cn(
        "absolute inset-0 opacity-10 transition-all duration-1000",
        isAnimating && "bg-gradient-fund-flow fund-flow-animation"
      )} />

      {/* State Indicator */}
      <motion.div
        className="flex items-center justify-between mb-4"
        animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className={cn(
              "w-3 h-3 rounded-full",
              stateConfig[currentState].color,
              isAnimating && "policy-state-transition"
            )}
            animate={isAnimating ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
          />
          <Badge variant="outline" className="text-xs">
            {stateConfig[currentState].label}
          </Badge>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <StateIcon className={cn(
            "w-5 h-5",
            stateConfig[currentState].color.replace('bg-', 'text-')
          )} />
        </motion.div>
      </motion.div>

      {/* Policy Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{policy.name}</h3>
        <p className="text-sm text-muted-foreground">{policy.description}</p>
      </div>

      {/* AI Description */}
      <motion.div
        className="mb-4 p-3 bg-gradient-glass-blue rounded-lg border border-civic-blue/20"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-civic-blue" />
          <span className="text-xs font-medium text-civic-blue">AI Analysis</span>
        </div>
        <p className="text-xs text-foreground/80">{policy.aiDescription}</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-civic-green" />
            <span className="text-xs text-muted-foreground">Fund Release</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">₹{(policy.fundReleased / 100000).toFixed(1)}L</span>
              <span className="text-muted-foreground">₹{(policy.fundAllocated / 100000).toFixed(1)}L</span>
            </div>
            <Progress 
              value={(policy.fundReleased / policy.fundAllocated) * 100} 
              className="h-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-civic-blue" />
            <span className="text-xs text-muted-foreground">Beneficiaries</span>
          </div>
          <div className="text-sm font-medium">{policy.beneficiaries.toLocaleString()}</div>
        </div>
      </div>

      {/* Voting Stats */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-civic-mint" />
            <span className="text-xs text-muted-foreground">Citizen Votes</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {policy.votes.for + policy.votes.against} total
          </span>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex-1 bg-civic-green/20 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-civic-green"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(policy.votes.for / (policy.votes.for + policy.votes.against)) * 100}%` 
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex-1 bg-civic-red/20 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-civic-red"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(policy.votes.against / (policy.votes.for + policy.votes.against)) * 100}%` 
              }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
        </div>
        
        <div className="flex justify-between text-xs mt-1">
          <span className="text-civic-green">{policy.votes.for} For</span>
          <span className="text-civic-red">{policy.votes.against} Against</span>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Execution Timeline</span>
          <span className="text-xs font-medium">{timelinePosition[0]}%</span>
        </div>
        
        <Slider
          value={timelinePosition}
          onValueChange={setTimelinePosition}
          max={100}
          step={1}
          className="w-full"
          disabled={isAnimating}
        />
        
        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
          {policy.timeline.map((phase, index) => (
            <span key={index} className={cn(
              "transition-colors",
              timelinePosition[0] >= (index * 33.33) && "text-civic-blue font-medium"
            )}>
              {phase.phase}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <AnimatePresence>
        {currentState === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button 
              onClick={triggerStateTransition}
              disabled={isAnimating}
              className="w-full bg-gradient-civic hover:bg-gradient-civic-alt text-civic-white ripple-effect group"
            >
              <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Trigger Execution
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Data Sync Indicator */}
      <motion.div
        className="absolute top-4 right-4 flex items-center space-x-1"
        animate={isAnimating ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.7 }}
        transition={{ duration: 1, repeat: isAnimating ? Infinity : 0 }}
      >
        <div className="w-2 h-2 bg-civic-green rounded-full" />
        <span className="text-xs text-muted-foreground">Live</span>
      </motion.div>
    </GlassCard>
  );
};