import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedCardProps {
  children: React.ReactNode;
  variant?: "glass" | "elevated" | "outlined" | "ghost" | "neomorphic";
  hoverable?: boolean;
  animated?: boolean;
  glowing?: boolean;
  delay?: number;
  className?: string;
}

export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className, 
    children, 
    variant = "elevated", 
    hoverable = true, 
    animated = true,
    glowing = false,
    delay = 0,
    ...props 
  }, ref) => {
    const variants = {
      glass: "glassmorphic-enhanced border-white/20",
      elevated: "enhanced-card bg-card border shadow-subtle",
      outlined: "border-2 border-civic-blue/20 bg-card/50 backdrop-blur-sm",
      ghost: "bg-card/30 border-transparent shadow-none",
      neomorphic: "neomorphic border-none"
    };

    const hoverClasses = hoverable ? "card-hover cursor-pointer" : "";
    const glowClasses = glowing ? "hover:shadow-glow animate-pulse-glow" : "";

    const cardClasses = cn(
      "rounded-lg p-6 transition-all duration-300 mobile-optimized",
      variants[variant],
      hoverClasses,
      glowClasses,
      className
    );

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay, ease: "easeOut" }}
          viewport={{ once: true }}
          whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : {}}
          whileTap={hoverable ? { scale: 0.98 } : {}}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={cardClasses}>
        {children}
      </div>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

// Predefined card components for common use cases
export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  className,
  ...props 
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
  className?: string;
} & EnhancedCardProps) => {
  const trendColors = {
    up: "text-civic-success",
    down: "text-civic-error", 
    neutral: "text-civic-slate"
  };

  return (
    <EnhancedCard className={cn("text-center", className)} {...props}>
      <div className="space-y-4">
        {Icon && (
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-civic-blue/10">
              <Icon className="w-6 h-6 text-civic-blue" />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-civic-slate">{title}</p>
          <p className={cn(
            "text-3xl font-bold text-mono",
            trend && trendColors[trend]
          )}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-civic-slate">{description}</p>
          )}
        </div>
      </div>
    </EnhancedCard>
  );
};

export const FeatureCard = ({ 
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props 
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
} & Omit<EnhancedCardProps, 'children'>) => (
  <EnhancedCard className={cn("h-full", className)} {...props}>
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-civic text-white">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      
      <p className="text-civic-slate leading-relaxed flex-1">{description}</p>
      
      {action && (
        <div className="pt-4">{action}</div>
      )}
    </div>
  </EnhancedCard>
);

export const LoadingCard = ({ className, ...props }: { className?: string } & EnhancedCardProps) => (
  <EnhancedCard variant="ghost" animated={false} className={cn("", className)} {...props}>
    <div className="space-y-4">
      <div className="h-4 bg-civic-gray-200 rounded skeleton"></div>
      <div className="h-20 bg-civic-gray-200 rounded skeleton"></div>
      <div className="flex space-x-2">
        <div className="h-8 w-16 bg-civic-gray-200 rounded skeleton"></div>
        <div className="h-8 w-16 bg-civic-gray-200 rounded skeleton"></div>
      </div>
    </div>
  </EnhancedCard>
);