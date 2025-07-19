import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  className,
  size = "md",
  variant = "default",
  animated = true,
  showLabel = false,
  label
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const variantClasses = {
    default: "bg-gradient-civic",
    success: "bg-gradient-to-r from-civic-success to-civic-green-light",
    warning: "bg-gradient-to-r from-civic-warning to-civic-orange",
    error: "bg-gradient-to-r from-civic-error to-red-400"
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-civic-slate">
            {label || "Progress"}
          </span>
          <span className="text-sm font-mono text-civic-slate">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        "progress-track",
        sizeClasses[size]
      )}>
        <motion.div
          className={cn(
            "progress-fill",
            variantClasses[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: "easeOut"
          }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export const SteppedProgress = ({
  currentStep,
  totalSteps,
  className
}: {
  currentStep: number;
  totalSteps: number;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <motion.div
          key={index}
          className={cn(
            "flex-1 h-2 rounded-full",
            index < currentStep 
              ? "bg-civic-success" 
              : index === currentStep
              ? "bg-civic-blue"
              : "bg-civic-gray-200"
          )}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ 
            scale: index <= currentStep ? 1 : 0.8,
            opacity: index <= currentStep ? 1 : 0.5
          }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );
};