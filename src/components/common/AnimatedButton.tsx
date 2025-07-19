import React from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  showConfetti?: boolean;
  pulse?: boolean;
  glow?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, showConfetti = false, pulse = false, glow = false, ...props }, ref) => {
    return (
      <motion.div
        className="relative inline-block"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            glow && "shadow-lg hover:shadow-xl hover:shadow-primary/25",
            pulse && "animate-pulse",
            className
          )}
          {...props}
        >
          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              translateX: ["-100%", "100%"]
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut"
            }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
            }}
          />
          
          {/* Button content */}
          <span className="relative z-10 flex items-center">
            {children}
          </span>

          {/* Ripple effect on click */}
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-inherit"
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 2, opacity: [0, 1, 0] }}
            transition={{ duration: 0.4 }}
          />
        </Button>

        {/* Glow effect */}
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-gradient-to-r from-primary/50 to-accent/50 blur-lg opacity-0 pointer-events-none"
            whileHover={{ opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-civic-gold rounded-full"
                initial={{ 
                  scale: 0,
                  x: "50%",
                  y: "50%"
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: [
                    "50%",
                    `${50 + (Math.random() - 0.5) * 200}%`
                  ],
                  y: [
                    "50%",
                    `${50 + (Math.random() - 0.5) * 200}%`
                  ],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";