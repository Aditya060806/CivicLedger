import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flag, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FABProps {
  onReportClick: () => void;
  onChatClick: () => void;
  className?: string;
}

export const FloatingActionButton = ({ onReportClick, onChatClick, className }: FABProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fabVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    },
    hover: { 
      scale: 1.1,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20, scale: 0 },
    open: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className={cn("fixed bottom-20 right-6 z-40 sm:bottom-8 sm:right-8", className)}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Report Issue Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={() => {
                  onReportClick();
                  setIsExpanded(false);
                }}
                className="fab-pulse bg-civic-red hover:bg-civic-red/90 text-civic-white rounded-full w-14 h-14 shadow-fab group"
                variant="default"
              >
                <Flag className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </Button>
              <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Report Issue
              </div>
            </motion.div>

            {/* AI Chat Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={() => {
                  onChatClick();
                  setIsExpanded(false);
                }}
                className="bg-civic-blue hover:bg-civic-blue/90 text-civic-white rounded-full w-14 h-14 shadow-fab group"
                variant="default"
              >
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </Button>
              <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Ask AI
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        variants={fabVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "fab-pulse bg-gradient-civic hover:bg-gradient-civic-alt text-civic-white rounded-full w-16 h-16 shadow-fab transition-all duration-300",
            isExpanded && "rotate-45"
          )}
          variant="default"
        >
          {isExpanded ? (
            <X className="w-8 h-8" />
          ) : (
            <Plus className="w-8 h-8" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};