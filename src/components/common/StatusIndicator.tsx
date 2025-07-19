import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "pending" | "info";
  text?: string;
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

export const StatusIndicator = ({ 
  status, 
  text, 
  showIcon = true, 
  animated = true,
  className 
}: StatusIndicatorProps) => {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      className: "status-success",
      color: "text-civic-success"
    },
    warning: {
      icon: AlertCircle,
      className: "status-warning", 
      color: "text-civic-warning"
    },
    error: {
      icon: XCircle,
      className: "status-error",
      color: "text-civic-error"
    },
    pending: {
      icon: Clock,
      className: "bg-civic-blue/10 text-civic-blue border border-civic-blue/20",
      color: "text-civic-blue"
    },
    info: {
      icon: Info,
      className: "bg-civic-info/10 text-civic-info border border-civic-info/20",
      color: "text-civic-info"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const content = (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
      config.className,
      className
    )}>
      {showIcon && (
        <Icon className="w-3 h-3" />
      )}
      {text && <span>{text}</span>}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};