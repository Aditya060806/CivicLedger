import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Vote,
  TrendingUp,
  Target,
  MapPin,
  Calendar,
  Users,
  Star,
  Flag
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { GroundTruthToggle } from "@/components/common/GroundTruthToggle";

export const CitizenDashboard = () => {
  const [groundTruthEnabled, setGroundTruthEnabled] = useState(false);

  const statsData = [
    {
      icon: FileText,
      label: "Available Schemes",
      value: "5",
      color: "text-civic-blue",
      bgColor: "bg-civic-blue/10"
    },
    {
      icon: CheckCircle,
      label: "Active Applications", 
      value: "3",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: AlertTriangle,
      label: "Filed Complaints",
      value: "0", 
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Vote,
      label: "Pending Votes",
      value: "2",
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100"
    }
  ];

  const quickActions = [
    {
      title: "File a Complaint",
      description: "Report issues with government schemes",
      icon: Flag,
      variant: "civic" as const,
      path: "/file-complaint"
    },
    {
      title: "Apply for Scheme", 
      description: "Browse and apply for available schemes",
      icon: FileText,
      variant: "outline" as const,
      path: "/schemes"
    },
    {
      title: "DAO Voting",
      description: "Participate in governance decisions", 
      icon: Vote,
      variant: "outline" as const,
      path: "/dao-voting"
    },
    {
      title: "Track Local Projects",
      description: "Monitor development in your area",
      icon: MapPin,
      variant: "outline" as const,
      path: "/my-area"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.header 
            className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-xl border-b"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-civic rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-civic bg-clip-text text-transparent">
                  CivilLedger
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Live Dashboard</span>
              <span className="text-sm text-muted-foreground">DAO Voting</span>
              <span className="text-sm text-muted-foreground">Role:</span>
              <Badge className="bg-civic-primary text-white">Policy Maker</Badge>
              <Badge variant="outline">Citizen</Badge>
              <Badge variant="outline">Auditor</Badge>
              <Badge variant="outline">Contractor</Badge>
              <Button size="sm" variant="default" className="bg-gradient-civic">
                Internet Identity
              </Button>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold text-foreground">Citizen Dashboard</h1>
              <p className="text-muted-foreground">Your gateway to transparent governance</p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 text-center hover:shadow-lg transition-all duration-300">
                    <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-3`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Popular</span>
                  </div>
                </div>

                <div className="grid gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <GlassCard className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              action.variant === 'civic' 
                                ? 'bg-gradient-civic text-white' 
                                : 'bg-muted text-muted-foreground group-hover:text-foreground'
                            }`}>
                              <action.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground group-hover:text-civic-primary transition-colors">
                                {action.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                          <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            className="text-muted-foreground group-hover:text-foreground"
                          >
                            →
                          </motion.div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* My Complaints */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">My Complaints</h2>
                  <Badge variant="secondary">0</Badge>
                </div>

                <GlassCard className="p-8 text-center">
                  <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-muted-foreground mb-2">No complaints filed yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    File your first complaint to track its progress
                  </p>
                  <AnimatedButton variant="outline" size="sm">
                    File Complaint
                  </AnimatedButton>
                </GlassCard>
              </motion.div>
            </div>

            {/* GroundTruth Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6 bg-gradient-to-r from-muted/30 to-muted/10 border-l-4 border-civic-blue">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">GroundTruth Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      View real-time scheme status in your local area
                    </p>
                  </div>
                  <GroundTruthToggle 
                    isEnabled={groundTruthEnabled}
                    onToggle={setGroundTruthEnabled}
                  />
                </div>
              </GlassCard>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};