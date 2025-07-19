import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

export const EnhancedToast = ({
  id,
  type,
  title,
  description,
  onDismiss
}: ToastProps) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[type];

  const typeStyles = {
    success: "border-civic-success bg-civic-success/10 text-civic-success",
    error: "border-civic-error bg-civic-error/10 text-civic-error",
    warning: "border-civic-warning bg-civic-warning/10 text-civic-warning",
    info: "border-civic-info bg-civic-info/10 text-civic-info"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "relative p-4 rounded-lg border shadow-elevation backdrop-blur-sm",
        "w-full max-w-sm",
        typeStyles[type]
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-glass rounded-lg opacity-90" />
      
      {/* Content */}
      <div className="relative flex items-start space-x-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          {description && (
            <p className="text-xs opacity-90 mt-1">{description}</p>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(id)}
          className="p-1 h-auto opacity-70 hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-current rounded-b-lg"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
      />
    </motion.div>
  );
};

export const ToastContainer = ({ 
  toasts, 
  onDismiss 
}: { 
  toasts: ToastProps[], 
  onDismiss: (id: string) => void 
}) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    <AnimatePresence mode="popLayout">
      {toasts.map((toast) => (
        <EnhancedToast
          key={toast.id}
          {...toast}
          onDismiss={onDismiss}
        />
      ))}
    </AnimatePresence>
  </div>
);