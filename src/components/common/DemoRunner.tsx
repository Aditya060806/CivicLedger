import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./GlassCard";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight,
  Mouse,
  Eye,
  FileText,
  Users,
  CheckCircle
} from "lucide-react";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: string;
  element?: string;
  duration: number;
}

export const DemoRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: "intro",
      title: "Welcome to CivilLedger",
      description: "This demo will walk you through the key features of our civic dApp",
      action: "Starting demonstration",
      duration: 2000
    },
    {
      id: "navigation",
      title: "Navigation Overview",
      description: "Explore different roles and dashboards",
      action: "Highlighting navigation menu",
      element: "header",
      duration: 3000
    },
    {
      id: "citizen-portal",
      title: "Citizen Portal",
      description: "File complaints and track government schemes",
      action: "Navigating to citizen portal",
      element: "citizen-link",
      duration: 4000
    },
    {
      id: "complaint-filing",
      title: "Filing a Complaint", 
      description: "Submit evidence and location verification",
      action: "Demonstrating complaint submission",
      element: "complaint-form",
      duration: 5000
    },
    {
      id: "dashboard-view",
      title: "Live Dashboard",
      description: "Real-time tracking of schemes and fund distribution",
      action: "Switching to dashboard view",
      element: "dashboard-link",
      duration: 4000
    },
    {
      id: "analytics",
      title: "Analytics & Insights",
      description: "System-wide metrics and transparency data",
      action: "Showing analytics panel",
      element: "analytics-section",
      duration: 3000
    },
    {
      id: "conclusion",
      title: "Demo Complete",
      description: "Thank you for exploring CivilLedger! Ready to start using it?",
      action: "Demo finished",
      duration: 2000
    }
  ];

  const startDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setIsPaused(false);
    runDemoStep(0);
  };

  const pauseDemo = () => {
    setIsPaused(!isPaused);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setIsPaused(false);
  };

  const runDemoStep = (stepIndex: number) => {
    if (stepIndex >= demoSteps.length) {
      setIsRunning(false);
      return;
    }

    const step = demoSteps[stepIndex];
    setCurrentStep(stepIndex);

    // Simulate demo actions
    setTimeout(() => {
      if (stepIndex < demoSteps.length - 1 && !isPaused) {
        runDemoStep(stepIndex + 1);
      } else {
        setIsRunning(false);
      }
    }, step.duration);
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / demoSteps.length) * 100;
  };

  return (
    <div className="space-y-4">
      {/* Demo Controls */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <Play className="w-5 h-5 mr-2 text-civic-green" />
              Interactive Demo
            </h3>
            <p className="text-sm text-muted-foreground">
              Automated walkthrough of CivilLedger features
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {!isRunning ? (
              <Button
                onClick={startDemo}
                className="bg-gradient-civic"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Demo
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseDemo}
                  variant="outline"
                  size="sm"
                >
                  {isPaused ? (
                    <Play className="w-4 h-4 mr-2" />
                  ) : (
                    <Pause className="w-4 h-4 mr-2" />
                  )}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
                
                <Button
                  onClick={resetDemo}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-civic h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </GlassCard>

      {/* Demo Status */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <GlassCard className="p-4 max-w-sm">
              <div className="flex items-start space-x-3">
                <motion.div
                  className="w-10 h-10 bg-civic-green/20 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isPaused ? (
                    <Pause className="w-5 h-5 text-civic-green" />
                  ) : (
                    <Eye className="w-5 h-5 text-civic-green" />
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">
                    {demoSteps[currentStep]?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {demoSteps[currentStep]?.description}
                  </p>
                  
                  <div className="flex items-center mt-2 text-xs text-civic-green">
                    <Mouse className="w-3 h-3 mr-1" />
                    <span>{demoSteps[currentStep]?.action}</span>
                  </div>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex items-center space-x-1 mt-3">
                {demoSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep
                        ? 'bg-civic-green'
                        : index < currentStep
                        ? 'bg-civic-green/50'
                        : 'bg-gray-300'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </div>

              {/* Next Step Preview */}
              {currentStep < demoSteps.length - 1 && (
                <motion.div
                  className="mt-3 pt-3 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ChevronRight className="w-3 h-3 mr-1" />
                    <span>Next: {demoSteps[currentStep + 1]?.title}</span>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Completion */}
      <AnimatePresence>
        {currentStep === demoSteps.length - 1 && isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={resetDemo}
          >
            <GlassCard className="p-8 max-w-md mx-4 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-civic-green/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-civic-green" />
              </motion.div>
              
              <h3 className="text-xl font-bold mb-2">Demo Complete!</h3>
              <p className="text-muted-foreground mb-6">
                You've explored the key features of CivilLedger. Ready to start using it?
              </p>
              
              <div className="flex space-x-3">
                <Button onClick={resetDemo} variant="outline" className="flex-1">
                  Run Again
                </Button>
                <Button className="bg-gradient-civic flex-1">
                  Get Started
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};