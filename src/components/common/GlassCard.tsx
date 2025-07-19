import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: "default" | "executive" | "luxury" | "power" | "minimal";
  glow?: boolean;
}

export const GlassCard = ({ 
  children, 
  className, 
  hoverable = false, 
  variant = "default",
  glow = false
}: GlassCardProps) => {
  const variants = {
    default: "backdrop-blur-sm bg-gradient-cards rounded-xl border border-civic-gray-100 shadow-glass",
    executive: "card-executive rounded-xl",
    luxury: "card-luxury rounded-xl",
    power: "bg-gradient-power rounded-xl border border-civic-purple/20 shadow-premium text-white",
    minimal: "bg-white/95 backdrop-blur-md rounded-xl border border-civic-gray-100/50 shadow-subtle"
  };

  const hoverEffects = {
    default: "hover:shadow-card-hover hover:border-civic-blue/20 hover-lift",
    executive: "", // Already included in card-executive
    luxury: "", // Already included in card-luxury  
    power: "hover:shadow-luxury hover:border-civic-purple/40 hover-lift",
    minimal: "hover:shadow-elevation hover:border-civic-blue/30 hover-lift"
  };

  return (
    <motion.div
      className={cn(
        variants[variant],
        "gpu-accelerated transition-all duration-300",
        hoverable && `cursor-pointer ${hoverEffects[variant]}`,
        glow && "animate-pulse-glow",
        className
      )}
      whileHover={hoverable ? { y: -4, scale: 1.008 } : undefined}
      whileTap={hoverable ? { scale: 0.995 } : undefined}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.2
      }}
      layout
    >
      {children}
    </motion.div>
  );
};