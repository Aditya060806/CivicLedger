import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import { ContractLifecycleBar } from "./ContractLifecycleBar";
import { PublicPulseFeed } from "./PublicPulseFeed";
import { PolicyExecutionCard } from "../common/PolicyExecutionCard";
import { ConfettiEffect, SparkleEffect, GlowEffect } from "./ConfettiEffect";
import { EnhancedIndiaMap } from "../maps/EnhancedIndiaMap";

import {
  MapPin,
  TrendingUp,
  Users,
  IndianRupee,
  Flag,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  Globe,
  Activity,
  Award,
  Eye,
  MessageSquare,
  ThumbsUp,
  Share2
} from "lucide-react";

interface DashboardProps {
  selectedRole: string;
}

const roleConfigs = {
  citizen: {
    title: "Citizen Dashboard",
    subtitle: "Track public services and voice your concerns",
    primaryColor: "civic-blue",
    actions: ["Report Issue", "Track Complaint", "Vote on Proposal", "View Progress"]
  },
  contractor: {
    title: "Contractor Portal",
    subtitle: "Execute projects with transparent proof submission",
    primaryColor: "civic-green",
    actions: ["Submit Proof", "Update Progress", "View Schedule", "GPS Verify"]
  },
  auditor: {
    title: "Auditor Panel",
    subtitle: "Verify compliance and ensure transparency",
    primaryColor: "amber-500",
    actions: ["Field Verify", "Flag Issues", "Approve Work", "Generate Report"]
  },
  policy_maker: {
    title: "Policy Maker Hub",
    subtitle: "Design policies and monitor implementation",
    primaryColor: "purple-500",
    actions: ["Create Policy", "Allocate Funds", "Monitor Regional", "DAO Governance"]
  }
};

const mockPolicies = [
  {
    id: "1",
    name: "Rural Road Connectivity Scheme",
    description: "Connecting remote villages with all-weather roads under PMGSY Phase III",
    status: "executing" as const,
    progress: 65,
    fundAllocated: 50000000,
    fundUsed: 32500000,
    beneficiaries: 1245,
    targetBeneficiaries: 2000,
    estimatedCompletion: "Mar 2024",
    contractAddress: "0x742...89Ab",
    lastUpdate: "2 hours ago",
    milestones: [
      { id: "1", name: "Survey Completed", completed: true, date: "Jan 2024" },
      { id: "2", name: "Land Acquisition", completed: true, date: "Feb 2024" },
      { id: "3", name: "Construction Started", completed: true, date: "Feb 2024" },
      { id: "4", name: "50% Progress", completed: false },
      { id: "5", name: "Quality Check", completed: false }
    ]
  },
  {
    id: "2",
    name: "Digital Education Initiative",
    description: "Providing digital learning infrastructure to 1000 government schools",
    status: "pending" as const,
    progress: 0,
    fundAllocated: 25000000,
    fundUsed: 0,
    beneficiaries: 0,
    targetBeneficiaries: 50000,
    estimatedCompletion: "Dec 2024",
    contractAddress: "0x8C3...12Df",
    lastUpdate: "1 day ago",
    milestones: [
      { id: "1", name: "Tender Process", completed: false },
      { id: "2", name: "Vendor Selection", completed: false },
      { id: "3", name: "Equipment Procurement", completed: false },
      { id: "4", name: "Installation", completed: false },
      { id: "5", name: "Training", completed: false }
    ]
  }
];

export const EnhancedGovernanceDashboard = ({ selectedRole }: DashboardProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const { toast } = useToast();

  const config = roleConfigs[selectedRole as keyof typeof roleConfigs];

  const handlePolicyAction = (policyId: string, action: string) => {
    setActivePolicy(policyId);
    
    // Trigger success effects
    if (action === "execute") {
      setShowConfetti(true);
      toast({
        title: "🎉 Policy Execution Started!",
        description: "Smart contract activated. Blockchain transaction confirmed.",
        duration: 5000
      });
    }

    setTimeout(() => setActivePolicy(null), 3000);
  };

  const triggerEmotion = (emotion: "success" | "concern" | "pending") => {
    const messages = {
      success: { title: "✅ Issue Resolved!", description: "Your complaint has been successfully addressed." },
      concern: { title: "🚨 Escalated to DAO", description: "Community will vote on immediate intervention." },
      pending: { title: "⏳ Under Review", description: "Your report is being processed by the relevant authority." }
    };

    toast(messages[emotion]);
    if (emotion === "success") setShowConfetti(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <ConfettiEffect 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-2 rounded-full bg-gradient-to-r from-primary to-civic-blue"
              >
                <Globe className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">{config.title}</h1>
                <p className="text-muted-foreground">{config.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 text-primary">
                <Activity className="w-3 h-3 mr-1" />
                Live DAO
              </Badge>
              {config.actions.map((action, idx) => (
                <Button 
                  key={action} 
                  variant="outline" 
                  size="sm"
                  onClick={() => triggerEmotion(idx === 0 ? "success" : idx === 1 ? "concern" : "pending")}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Contracts
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Regional
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { 
                  title: "Active Contracts", 
                  value: "847", 
                  change: "+12%", 
                  icon: CheckCircle2, 
                  color: "civic-green" 
                },
                { 
                  title: "Fund Utilization", 
                  value: "₹2,456 Cr", 
                  change: "+8.5%", 
                  icon: IndianRupee, 
                  color: "civic-blue" 
                },
                { 
                  title: "Beneficiaries", 
                  value: "12.5L", 
                  change: "+15%", 
                  icon: Users, 
                  color: "purple-500" 
                },
                { 
                  title: "DAO Interventions", 
                  value: "23", 
                  change: "-5%", 
                  icon: Zap, 
                  color: "amber-500" 
                }
              ].map((metric, idx) => (
                <GlowEffect key={metric.title} isActive={activePolicy !== null} color={metric.color.split("-")[0] as any}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{metric.title}</p>
                            <p className="text-2xl font-bold">{metric.value}</p>
                            <p className={`text-xs ${
                              metric.change.startsWith("+") ? "text-green-600" : "text-red-600"
                            }`}>
                              {metric.change} from last month
                            </p>
                          </div>
                          <SparkleEffect isActive={activePolicy !== null}>
                            <div className={`p-3 rounded-full bg-${metric.color}/10`}>
                              <metric.icon className={`w-6 h-6 text-${metric.color}`} />
                            </div>
                          </SparkleEffect>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </GlowEffect>
              ))}
            </div>

            {/* Contract Lifecycle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ContractLifecycleBar />
            </motion.div>

            {/* Policy Execution Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockPolicies.map((policy, idx) => (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <PolicyExecutionCard
                      policyData={policy}
                      onTrigger={handlePolicyAction}
                      canControl={selectedRole === "policy_maker" || selectedRole === "contractor"}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                {mockPolicies.map((policy) => (
                  <PolicyExecutionCard
                    key={policy.id}
                    policyData={policy}
                    onTrigger={handlePolicyAction}
                    canControl={true}
                  />
                ))}
              </div>
              <PublicPulseFeed />
            </motion.div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[600px]"
            >
              <EnhancedIndiaMap />
            </motion.div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <PublicPulseFeed />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Community Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { action: "Issue Resolved", icon: CheckCircle2, type: "success" },
                    { action: "Escalate to DAO", icon: Flag, type: "concern" },
                    { action: "Under Review", icon: Eye, type: "pending" }
                  ].map((item) => (
                    <Button
                      key={item.action}
                      variant="outline"
                      onClick={() => triggerEmotion(item.type as any)}
                      className="w-full justify-start gap-2 hover:scale-105 transition-transform"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.action}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};