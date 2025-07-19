import { motion } from "framer-motion";

export const TypingIndicator = () => (
  <motion.div
    className="flex space-x-1 px-4 py-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="w-2 h-2 bg-civic-blue rounded-full"
        animate={{ y: [-2, 2, -2] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: index * 0.2
        }}
      />
    ))}
  </motion.div>
);