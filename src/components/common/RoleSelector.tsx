import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlassCard } from "./GlassCard";
import { 
  Users, 
  Shield, 
  Eye, 
  Hammer,
  FileText,
  CheckCircle
} from "lucide-react";

interface Role {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
  gradient: string;
}

export const RoleSelector = () => {
  const roles: Role[] = [
    {
      title: "Policy Maker",
      description: "Create and deploy government schemes as smart contracts",
      icon: FileText,
      path: "/policy-maker",
      color: "civic-blue",
      gradient: "from-civic-blue/20 to-civic-blue/5"
    },
    {
      title: "Citizen",
      description: "Apply for schemes, file complaints, and track status",
      icon: Users,
      path: "/citizen",
      color: "civic-green",
      gradient: "from-civic-green/20 to-civic-green/5"
    },
    {
      title: "Auditor",
      description: "Review complaints and ensure transparency",
      icon: Eye,
      path: "/auditor",
      color: "civic-gold",
      gradient: "from-civic-gold/20 to-civic-gold/5"
    },
    {
      title: "Contractor",
      description: "Submit bids and provide work proof",
      icon: Hammer,
      path: "/contractor",
      color: "civic-blue",
      gradient: "from-civic-blue/20 to-civic-blue/5"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {roles.map((role, index) => (
        <motion.div
          key={role.title}
          initial={{ opacity: 0, y: 30, rotateY: -15 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ 
            delay: index * 0.1, 
            duration: 0.6,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            y: -10, 
            rotateY: 5,
            scale: 1.05
          }}
          style={{ perspective: "1000px" }}
        >
          <Link to={role.path}>
            <GlassCard className="h-full relative overflow-hidden group cursor-pointer">
              {/* Animated Background Gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-100`}
                transition={{ duration: 0.3 }}
              />
              
              {/* Floating Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Icon with rotation animation */}
                <motion.div
                  className="mb-4"
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`w-16 h-16 bg-gradient-civic rounded-2xl flex items-center justify-center`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <motion.h3 
                    className="text-xl font-bold mb-2 group-hover:text-civic-green transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {role.title}
                  </motion.h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                </div>

                {/* Animated Arrow */}
                <motion.div
                  className="mt-4 self-end opacity-0 group-hover:opacity-100"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 rounded-full bg-civic-green/20 flex items-center justify-center">
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </div>
                </motion.div>

                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full"
                  transition={{ duration: 0.6 }}
                />
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};