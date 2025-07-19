import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FloatingOrbProps {
  onClick: () => void;
  isIdle: boolean;
}

export const FloatingCivicOrb = ({ onClick, isIdle }: FloatingOrbProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={onClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.div
            className="relative w-16 h-16 glassmorphic-enhanced rounded-full flex items-center justify-center floating-orb-glow"
            animate={isIdle ? {
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.6)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Symbolic SVG Orb */}
            <motion.svg
              viewBox="0 0 32 32"
              className="w-8 h-8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {/* Megaphone/Speaker Symbol */}
              <path
                d="M8 10L16 6v20l-8-4v-12z"
                fill="hsl(var(--civic-blue))"
                opacity="0.8"
              />
              <path
                d="M16 6v20c4-2 8-6 8-10s-4-8-8-10z"
                fill="hsl(var(--civic-gold))"
                opacity="0.6"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="hsl(var(--civic-blue))"
                strokeWidth="1"
                fill="none"
                strokeDasharray="2 2"
                className="animate-pulse"
              />
            </motion.svg>
            
            {/* Ripple Effect on Hover */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-civic-blue opacity-0"
              whileHover={{
                opacity: [0, 0.6, 0],
                scale: [1, 1.3, 1.5]
              }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Need civic help? Ask me!</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);