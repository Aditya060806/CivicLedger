import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
  duration?: number;
  colors?: string[];
}

export const ConfettiEffect = ({ 
  trigger, 
  onComplete, 
  duration = 3000,
  colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]
}: ConfettiEffectProps) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -10,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          delay: Math.random() * 2000
        });
      }
      setConfetti(pieces);

      // Auto cleanup
      const timer = setTimeout(() => {
        setIsActive(false);
        setConfetti([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, onComplete, colors]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ 
              x: piece.x, 
              y: piece.y, 
              rotate: piece.rotation,
              opacity: 1,
              scale: 1
            }}
            animate={{ 
              y: window.innerHeight + 100,
              rotate: piece.rotation + 720,
              opacity: 0,
              scale: 0.5
            }}
            transition={{ 
              duration: duration / 1000,
              delay: piece.delay / 1000,
              ease: "easeOut"
            }}
            style={{
              position: "absolute",
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: "2px"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Sparkle Effect Component
interface SparkleProps {
  children: React.ReactNode;
  isActive?: boolean;
}

export const SparkleEffect = ({ children, isActive = false }: SparkleProps) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1000
      }));
      setSparkles(newSparkles);

      const timer = setTimeout(() => {
        setSparkles([]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="relative inline-block">
      {children}
      
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              scale: 0, 
              rotate: 0, 
              opacity: 1,
              x: `${sparkle.x}%`,
              y: `${sparkle.y}%`
            }}
            animate={{ 
              scale: [0, 1, 0], 
              rotate: 180, 
              opacity: [0, 1, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 1.5,
              delay: sparkle.delay / 1000,
              ease: "easeInOut"
            }}
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: 0
            }}
          >
            <div className="w-2 h-2 bg-yellow-400 rotate-45 animate-pulse" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Glow Effect Component
interface GlowEffectProps {
  children: React.ReactNode;
  isActive?: boolean;
  color?: string;
  intensity?: "low" | "medium" | "high";
}

export const GlowEffect = ({ 
  children, 
  isActive = false, 
  color = "blue", 
  intensity = "medium" 
}: GlowEffectProps) => {
  const glowStyles = {
    low: "shadow-lg",
    medium: "shadow-xl",
    high: "shadow-2xl"
  };

  const colorStyles = {
    blue: "shadow-blue-500/20",
    green: "shadow-green-500/20",
    purple: "shadow-purple-500/20",
    orange: "shadow-orange-500/20",
    red: "shadow-red-500/20"
  };

  return (
    <motion.div
      animate={isActive ? {
        boxShadow: [
          "0 0 0 0 rgba(59, 130, 246, 0)",
          "0 0 20px 5px rgba(59, 130, 246, 0.3)",
          "0 0 0 0 rgba(59, 130, 246, 0)"
        ]
      } : {}}
      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
      className={`
        ${isActive ? glowStyles[intensity] : ""} 
        ${isActive ? colorStyles[color as keyof typeof colorStyles] : ""}
        transition-all duration-300
      `}
    >
      {children}
    </motion.div>
  );
};