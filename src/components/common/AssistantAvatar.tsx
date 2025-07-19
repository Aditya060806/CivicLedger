import { motion } from "framer-motion";

interface AssistantAvatarProps {
  emotion?: "positive" | "neutral" | "negative" | "urgent";
  isTyping: boolean;
}

export const AssistantAvatar = ({ emotion, isTyping }: AssistantAvatarProps) => (
  <motion.div
    className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg border-2 border-white"
    animate={isTyping ? { 
      scale: [1, 1.1, 1],
      boxShadow: [
        "0 4px 20px rgba(59, 130, 246, 0.3)",
        "0 6px 25px rgba(59, 130, 246, 0.5)",
        "0 4px 20px rgba(59, 130, 246, 0.3)"
      ]
    } : {}}
    transition={{ duration: 0.8, repeat: isTyping ? Infinity : 0 }}
    whileHover={{ scale: 1.05 }}
  >
    {/* Main Avatar */}
    <motion.div
      className="relative z-10"
      animate={isTyping ? { rotate: [0, 5, -5, 0] } : {}}
      transition={{ duration: 2, repeat: isTyping ? Infinity : 0 }}
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
        {/* Face Background */}
        <circle cx="12" cy="12" r="8" fill="white" opacity="0.95" />
        
        {/* Eyes with enhanced blinking */}
        <motion.circle
          cx="9"
          cy="10"
          r="1.2"
          fill="#3B82F6"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.circle
          cx="15"
          cy="10"
          r="1.2"
          fill="#3B82F6"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        
        {/* Enhanced mouth expressions */}
        <motion.path
          d={emotion === "positive" ? "M9 14c1 1.5 2 1.5 3 1.5s2 0 3-1.5" : 
             emotion === "negative" ? "M9 16c1-1.5 2-1.5 3-1.5s2 0 3 1.5" :
             emotion === "urgent" ? "M9 14.5h6" :
             "M10 15h4"}
          stroke="#3B82F6"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Thought bubbles when typing */}
        {isTyping && (
          <>
            <motion.circle
              cx="18"
              cy="8"
              r="1"
              fill="#3B82F6"
              opacity="0.6"
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="20"
              cy="6"
              r="0.5"
              fill="#3B82F6"
              opacity="0.4"
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 0.4, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </svg>
    </motion.div>
    
    {/* Status indicator ring */}
    <motion.div
      className={`absolute inset-0 rounded-full border-2 ${
        emotion === "positive" ? "border-green-400" :
        emotion === "negative" ? "border-red-400" :
        emotion === "urgent" ? "border-yellow-400" :
        "border-blue-400"
      }`}
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Pulse effect for active states */}
    {(isTyping || emotion === "urgent") && (
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-400"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0, 0.4]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    )}
  </motion.div>
);