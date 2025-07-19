import { motion } from "framer-motion";
import { 
  FileText, 
  Pause, 
  Eye, 
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface TimelineStep {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  status: "completed" | "active" | "pending" | "error";
  date?: string;
  description?: string;
}

interface TimelineProgressProps {
  complaintId: string;
  currentStep: number;
}

export const TimelineProgress = ({ complaintId, currentStep }: TimelineProgressProps) => {
  const steps: TimelineStep[] = [
    {
      id: "filed",
      title: "Complaint Filed",
      icon: FileText,
      status: currentStep >= 0 ? "completed" : "pending",
      date: "2024-01-15",
      description: "Complaint submitted with evidence"
    },
    {
      id: "fund-paused",
      title: "Fund Triggered",
      icon: Pause,
      status: currentStep >= 1 ? "completed" : currentStep === 0 ? "active" : "pending",
      date: currentStep >= 1 ? "2024-01-16" : undefined,
      description: "Automatic fund pause initiated"
    },
    {
      id: "auditor-review",
      title: "Auditor Review", 
      icon: Eye,
      status: currentStep >= 2 ? "completed" : currentStep === 1 ? "active" : "pending",
      date: currentStep >= 2 ? "2024-01-18" : undefined,
      description: "Independent auditor assessment"
    },
    {
      id: "resolved",
      title: "Resolved",
      icon: CheckCircle,
      status: currentStep >= 3 ? "completed" : currentStep === 2 ? "active" : "pending",
      date: currentStep >= 3 ? "2024-01-20" : undefined,
      description: "Issue resolved and funds released"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-civic-green border-civic-green bg-civic-green/10";
      case "active":
        return "text-civic-blue border-civic-blue bg-civic-blue/10 animate-pulse";
      case "error":
        return "text-red-500 border-red-500 bg-red-50";
      default:
        return "text-gray-400 border-gray-300 bg-gray-50";
    }
  };

  const getConnectorColor = (index: number) => {
    return currentStep > index ? "bg-civic-green" : "bg-gray-300";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative flex-1">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <motion.div
                className={`absolute top-6 left-1/2 w-full h-0.5 z-0 ${getConnectorColor(index)}`}
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: currentStep > index ? 1 : 0 
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.2 
                }}
                style={{ transformOrigin: "left" }}
              />
            )}

            {/* Step Circle */}
            <motion.div
              className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.1 }}
            >
              <step.icon className="w-5 h-5" />
              
              {/* Pulse animation for active step */}
              {step.status === "active" && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-civic-blue"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [1, 0, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                />
              )}
            </motion.div>

            {/* Step Content */}
            <motion.div
              className="mt-4 text-center max-w-24"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <h4 className="text-xs font-semibold mb-1">{step.title}</h4>
              {step.date && (
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(step.date).toLocaleDateString()}
                </div>
              )}
            </motion.div>

            {/* Hover Details */}
            <motion.div
              className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border opacity-0 pointer-events-none z-20 w-48"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Progress Percentage */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inline-flex items-center space-x-2 text-sm">
          <span className="text-muted-foreground">Progress:</span>
          <motion.span
            className="font-semibold text-civic-green"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </motion.span>
        </div>
        
        {/* Progress Bar */}
        <motion.div
          className="w-full bg-gray-200 rounded-full h-1 mt-2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="bg-gradient-civic h-1 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};