import { ReactNode } from "react";
import { Header } from "./Header";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      x: 300,
      scale: 0.8,
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: -300,
      scale: 1.2,
    }
  };

  const pageTransition = {
    duration: 0.5,
    ease: "easeInOut"
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 scroll-smooth">
      <Header />
      <motion.main 
        key={location.pathname}
        className="pt-16 overflow-hidden"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  );
};