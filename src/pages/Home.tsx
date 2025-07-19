import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/common/GlassCard";
import { RoleSelector } from "@/components/common/RoleSelector";
import { DemoRunner } from "@/components/common/DemoRunner";
import { EnhancedReportModal } from "@/components/common/EnhancedReportModal";
import { PolicyExecutionCard } from "@/components/common/PolicyExecutionCard";
import { InteractiveMapbox } from "@/components/common/InteractiveMapbox";
import { FundFlowInterface } from "@/components/common/FundFlowInterface";
import { SmartContractLogViewer } from "@/components/common/SmartContractLogViewer";
import { Footer } from "@/components/common/Footer";
import { AboutSection } from "@/components/common/AboutSection";
import { AdvancedSearchInterface } from "@/components/common/AdvancedSearchInterface";
import { RealTimeAnalyticsDashboard } from "@/components/common/RealTimeAnalyticsDashboard";
import { EnhancedAccordion, sampleAccordionItems } from "@/components/common/EnhancedInteractiveElements";

import { 
  Shield, 
  Users, 
  FileText, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  ArrowRight,
  Zap,
  Globe,
  BarChart3,
  UserCheck,
  Building,
  Gavel,
  ShieldCheck,
  Search,
  Settings,
  HelpCircle
} from "lucide-react";

export const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Transparent Governance",
      description: "Every policy becomes a smart contract with full execution transparency"
    },
    {
      icon: Users,
      title: "Citizen Participation",
      description: "Direct involvement in policy tracking, complaints, and auditing processes"
    },
    {
      icon: Zap,
      title: "Automated Execution", 
      description: "Smart contracts ensure policies execute automatically when conditions are met"
    },
    {
      icon: Globe,
      title: "Decentralized Network",
      description: "No single point of failure with distributed governance infrastructure"
    }
  ];

  const stats = [
    { value: "₹2.5Cr", label: "Funds Tracked", icon: TrendingUp },
    { value: "156", label: "Active Schemes", icon: FileText },
    { value: "12,450", label: "Citizens Enrolled", icon: Users },
    { value: "98.2%", label: "Transparency Score", icon: CheckCircle }
  ];

  const navigationOptions = [
    {
      icon: BarChart3,
      title: "Dashboard",
      description: "View comprehensive analytics and system overview",
      path: "/dashboard",
      color: "text-blue-500"
    },
    {
      icon: FileText,
      title: "Reports",
      description: "Access detailed audit reports and transparency data",
      path: "/auditor",
      color: "text-green-500"
    },
    {
      icon: ShieldCheck,
      title: "Safety & Security",
      description: "Monitor system security and safety protocols",
      path: "/auditor",
      color: "text-red-500"
    },
    {
      icon: Users,
      title: "Citizen Portal",
      description: "Track schemes, file complaints, and participate",
      path: "/citizen",
      color: "text-purple-500"
    },
    {
      icon: Gavel,
      title: "DAO Voting",
      description: "Participate in decentralized governance decisions",
      path: "/voting",
      color: "text-orange-500"
    },
    {
      icon: UserCheck,
      title: "Policy Maker",
      description: "Create and manage government policies",
      path: "/policy-maker",
      color: "text-indigo-500"
    },
    {
      icon: Building,
      title: "Contractor View",
      description: "Manage contracts and project execution",
      path: "/contractor",
      color: "text-teal-500"
    },
    {
      icon: Search,
      title: "Transparency Search",
      description: "Search and explore all government activities",
      path: "/dashboard",
      color: "text-cyan-500"
    },
    {
      icon: Settings,
      title: "System Settings",
      description: "Configure platform and user preferences",
      path: "/dashboard",
      color: "text-gray-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute inset-0 bg-gradient-trust opacity-60"></div>
        
        <div className="relative container mx-auto px-6">
          <motion.div
            className="text-center max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 tracking-tight leading-none"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
            >
              <span className="text-shimmer drop-shadow-2xl">
                CivicLedger
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl lg:text-4xl text-civic-blue mb-8 font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Governance That Executes Itself
            </motion.p>
            
            <motion.p 
              className="text-xl md:text-2xl text-civic-slate mb-12 max-w-5xl mx-auto leading-relaxed font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Transform government policies into transparent smart contracts with real-time tracking, 
              citizen participation, and automated execution. Building trust through blockchain technology 
              for accountable, transparent governance.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/dashboard">
                  <Button size="xl" variant="executive" className="px-10 h-14 shadow-executive hover:shadow-luxury font-bold text-lg">
                    <BarChart3 className="w-6 h-6 mr-3" />
                    Explore Dashboard
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/citizen">
                  <Button size="xl" variant="executive" className="px-10 h-14 shadow-executive hover:shadow-luxury font-bold text-lg">
                    <Users className="w-6 h-6 mr-3" />
                    Citizen Portal
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <EnhancedReportModal 
                  trigger={
                    <Button size="xl" variant="executive" className="px-10 h-14 shadow-executive hover:shadow-luxury font-bold text-lg">
                      <FileText className="w-6 h-6 mr-3" />
                      Submit Report
                    </Button>
                  }
                />
              </motion.div>
            </motion.div>

            {/* Enhanced Search Interface */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <AdvancedSearchInterface className="w-full max-w-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-trust">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Platform Impact</h2>
            <p className="text-xl text-civic-slate max-w-2xl mx-auto">Real-time transparency metrics driving citizen trust</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <GlassCard variant="executive" className="p-8 text-center" hoverable glow>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.3, duration: 0.5, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <stat.icon className="w-10 h-10 mx-auto mb-4 text-civic-green" />
                  </motion.div>
                  <motion.div 
                    className="text-3xl md:text-4xl font-black mb-2 text-shimmer"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-base font-semibold text-civic-slate">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Problem</h2>
            <p className="text-lg text-muted-foreground">
              Government schemes suffer from lack of transparency, delayed execution, fund misallocation, 
              and insufficient citizen oversight. Traditional systems create black boxes where accountability disappears.
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Solution</h2>
            <p className="text-lg text-muted-foreground mb-12">
              CivicLedger transforms government policies into transparent smart contracts on a decentralized network, 
              enabling real-time tracking, citizen participation, and automated execution with built-in accountability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation Options */}
      <section className="py-20 bg-gradient-to-r from-civic-blue/5 to-civic-green/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Explore the Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access different modules of CivicLedger designed for transparent governance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {navigationOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link to={option.path}>
                  <GlassCard className="p-6 h-full group cursor-pointer transition-all duration-300 hover:scale-105" hoverable>
                    <option.icon className={`w-10 h-10 mb-4 ${option.color} group-hover:scale-110 transition-transform duration-300`} />
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-civic-green transition-colors duration-300">{option.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{option.description}</p>
                    <div className="mt-4 flex items-center text-civic-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Access</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time Analytics Dashboard */}
      <section className="py-20 bg-gradient-trust">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <RealTimeAnalyticsDashboard />
          </motion.div>
        </div>
      </section>

      {/* Live Components Showcase */}
      <section className="py-20 bg-gradient-pastel">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="fluid-text-3xl font-bold mb-6">Live Platform Components</h2>
            <p className="fluid-text-lg text-civic-slate max-w-3xl mx-auto mb-8">
              Experience real-time governance in action with our smart contract execution, 
              fund flow tracking, and transparent audit logs.
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* Fund Flow Interface */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="fluid-text-xl font-semibold mb-6 text-center">Smart Contract Fund Flow</h3>
              <FundFlowInterface 
                totalFunds={5000000}
                utilizedFunds={3200000}
                pendingTransactions={[]}
                onTriggerFlow={() => {}}
              />
            </motion.div>

            {/* Smart Contract Logs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="fluid-text-xl font-semibold mb-6 text-center">Live Smart Contract Logs</h3>
              <SmartContractLogViewer 
                logs={[
                  {
                    id: "1",
                    timestamp: new Date(),
                    type: "transaction",
                    policy: "PM Awas Yojana",
                    fundAmount: 250000,
                    status: "success",
                    gasUsed: 21000,
                    hash: "0x742d35Cc6c26c33f76D9c8F59e5b30234d9f0e63",
                    rawData: { block: 18945123 },
                    aiSummary: "Successful fund disbursement to verified beneficiaries for housing scheme",
                    participants: ["0x8b2f1e3c"]
                  },
                  {
                    id: "2", 
                    timestamp: new Date(Date.now() - 300000),
                    type: "execution",
                    policy: "Digital Literacy Program",
                    fundAmount: 150000,
                    status: "success", 
                    gasUsed: 18500,
                    hash: "0x9a3c25Bb7d39f42e85c6f91b89e3d1234f6e2a47",
                    rawData: { block: 18945089 },
                    aiSummary: "Policy execution completed for digital training module distribution",
                    participants: ["0x4a8c9b5f"]
                  }
                ]}
                onFilter={() => {}}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Interactive Demo</h2>
            <p className="text-lg text-civic-slate max-w-2xl mx-auto mb-8">
              Experience how CivicLedger transforms governance through our interactive simulation
            </p>
          </motion.div>
          
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <DemoRunner />
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features with Interactive Elements */}
      <section className="py-20 bg-gradient-to-b from-background to-civic-green/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="fluid-text-3xl font-bold mb-6">Key Features & Capabilities</h2>
            <p className="fluid-text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Revolutionizing governance through blockchain technology and citizen empowerment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 h-full enhanced-card interactive-element" hoverable>
                  <feature.icon className="w-10 h-10 text-civic-green mb-4 animate-float" />
                  <h3 className="fluid-text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Interactive FAQ/Features Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="fluid-text-2xl font-bold mb-4">How It Works</h3>
              <p className="text-muted-foreground">
                Explore the core mechanisms that power transparent governance
              </p>
            </div>
            <EnhancedAccordion items={sampleAccordionItems} />
          </motion.div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Choose Your Role</h2>
            <p className="text-lg text-muted-foreground">
              Experience CivicLedger from different perspectives
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <RoleSelector />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-civic text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Governance Revolution
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of the most transparent and accountable governance system ever built
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/citizen">
                <Button size="lg" variant="secondary" className="px-8">
                  <Users className="w-5 h-5 mr-2" />
                  Join as Citizen
                </Button>
              </Link>
              <Link to="/voting">
                <Button size="lg" variant="outline" className="px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Shield className="w-5 h-5 mr-2" />
                  Participate in DAO
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};
