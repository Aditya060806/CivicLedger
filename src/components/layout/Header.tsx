
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedNotificationSystem } from "@/components/common/EnhancedNotificationSystem";
import { AuthModal } from "@/components/common/AuthModal";
import { EnhancedReportModal } from "@/components/common/EnhancedReportModal";
import { 
  Users, 
  FileText, 
  Gavel, 
  Menu, 
  X,
  LogIn,
  AlertTriangle,
  Shield
} from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userRoles = [
    { name: "Policy Maker", icon: FileText, path: "/policy-maker", color: "civic-green" },
    { name: "Citizen", icon: Users, path: "/citizen", color: "civic-blue" },
    { name: "Auditor", icon: Shield, path: "/auditor", color: "civic-gold" },
    { name: "Contractor", icon: Gavel, path: "/contractor", color: "accent" }
  ];

  return (
    <motion.header 
      className="fixed top-0 w-full z-50 backdrop-blur-xl bg-civic-white/98 border-b border-civic-gray-100/60 shadow-glass gpu-accelerated"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between flex-nowrap min-w-0">
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-elevation group-hover:shadow-glow transition-all duration-300 overflow-hidden bg-gradient-civic"
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src="/civic-logo.png"
              alt="CivicLedger Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <div className="flex flex-col">
            <motion.span 
              className="text-xl font-bold text-foreground group-hover:text-civic-blue transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              CivicLedger
            </motion.span>
            <span className="text-xs text-civic-slate opacity-80">Transparent Governance</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 flex-nowrap min-w-0">
          <Link to="/dashboard" className="nav-item text-sm font-semibold text-civic-slate hover:text-civic-blue transition-all duration-300 py-2">
            Live Dashboard
          </Link>
          <Link to="/mock-dashboard" className="nav-item text-sm font-semibold text-civic-slate hover:text-civic-blue transition-all duration-300 py-2">
            Mock Dashboard
          </Link>
          <Link to="/real-time-dashboard" className="nav-item text-sm font-semibold text-civic-slate hover:text-civic-blue transition-all duration-300 py-2">
            Real-Time Dashboard
          </Link>
          <Link to="/voting" className="nav-item text-sm font-semibold text-civic-slate hover:text-civic-blue transition-all duration-300 py-2">
            DAO Voting
          </Link>

          {/* Role Selection */}
          <div className="flex items-center space-x-1">
            {userRoles.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link to={role.path}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 px-4 text-civic-slate hover:text-civic-blue hover:bg-civic-blue/8 transition-all duration-300 font-semibold hover-lift border border-transparent hover:border-civic-blue/20"
                  >
                    <role.icon className="w-4 h-4 mr-2" />
                    <span>{role.name}</span>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Submit Report */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <EnhancedReportModal 
              trigger={
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 px-4 border-civic-orange/40 bg-civic-orange/8 text-civic-orange hover:bg-civic-orange hover:text-white transition-all duration-300 shadow-glass hover:shadow-warning font-semibold hover-lift"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span>Report Issue</span>
                </Button>
              }
            />
          </motion.div>

          {/* Enhanced Notification System */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <EnhancedNotificationSystem />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <AuthModal
              trigger={
                <Button 
                  variant="executive" 
                  size="sm" 
                  className="h-9 px-4 shadow-fab hover:shadow-glow transition-all duration-300 font-bold"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  <span>Internet Identity</span>
                </Button>
              }
            />
          </motion.div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden w-9 h-9 p-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="lg:hidden bg-civic-white/98 backdrop-blur-md border-t border-civic-gray-100 shadow-elevation"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-6 space-y-4">
            <div className="space-y-3">
              <Link 
                to="/dashboard" 
                className="flex items-center py-3 text-civic-slate hover:text-civic-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-5 h-5 mr-3" />
                Live Dashboard
              </Link>
              <Link 
                to="/voting" 
                className="flex items-center py-3 text-civic-slate hover:text-civic-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Gavel className="w-5 h-5 mr-3" />
                DAO Voting
              </Link>
            </div>
            
            <div className="pt-4 border-t border-civic-gray-100">
              <p className="text-sm font-medium text-civic-slate mb-3">Access Portal:</p>
              <div className="grid grid-cols-1 gap-2">
                {userRoles.map((role) => (
                  <Link key={role.name} to={role.path} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start h-12 border-civic-gray-200 hover:border-civic-blue hover:bg-civic-blue/5">
                      <role.icon className="w-5 h-5 mr-3" />
                      {role.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-civic-gray-100 space-y-3">
              <EnhancedReportModal 
                trigger={
                  <Button variant="outline" className="w-full h-12 border-civic-orange/30 bg-civic-orange/5 text-civic-orange hover:bg-civic-orange hover:text-white">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    Report Issue
                  </Button>
                }
              />
              
              <AuthModal
                trigger={
                  <Button className="w-full h-12 bg-gradient-civic text-white shadow-fab">
                    <LogIn className="w-5 h-5 mr-3" />
                    Internet Identity
                  </Button>
                }
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
