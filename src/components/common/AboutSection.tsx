import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/common/GlassCard";
import { 
  Github, 
  ExternalLink, 
  Mail, 
  Shield, 
  Users, 
  Zap, 
  Globe,
  Award,
  Code,
  Database,
  Lock,
  TrendingUp
} from "lucide-react";

export const AboutSection = () => {
  const teamMembers = [
    {
      name: "Policy Engine Team",
      role: "Smart Contract Development",
      avatar: "🏛️",
      expertise: "Rust, ICP Canisters, Blockchain"
    },
    {
      name: "AI Integration Team", 
      role: "Machine Learning & Analysis",
      avatar: "🧠",
      expertise: "LLM, Sentiment Analysis, NLP"
    },
    {
      name: "Frontend Team",
      role: "User Experience & Interface",
      avatar: "🎨", 
      expertise: "React, TypeScript, Tailwind"
    },
    {
      name: "Governance Team",
      role: "DAO & Voting Systems",
      avatar: "🗳️",
      expertise: "Decentralized Governance, Consensus"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Transparent Governance",
      description: "Every policy becomes an immutable smart contract with full execution transparency"
    },
    {
      icon: Zap,
      title: "Real-time Execution",
      description: "Automated fund flow and policy execution with instant status updates"
    },
    {
      icon: Users,
      title: "Citizen Participation",
      description: "Direct involvement in policy tracking, complaints, and DAO voting"
    },
    {
      icon: Database,
      title: "ICP Blockchain",
      description: "Built on Internet Computer Protocol for decentralized, secure governance"
    }
  ];

  const techStack = [
    {
      category: "Backend",
      technologies: ["Rust", "ICP Canisters", "Candid", "Stable Storage"]
    },
    {
      category: "Frontend", 
      technologies: ["React 18", "TypeScript", "Tailwind CSS", "Framer Motion"]
    },
    {
      category: "AI & Analytics",
      technologies: ["LLM Integration", "Sentiment Analysis", "Real-time Metrics"]
    },
    {
      category: "Blockchain",
      technologies: ["Internet Computer", "Smart Contracts", "Decentralized Storage"]
    }
  ];

  const stats = [
    { value: "4", label: "Rust Canisters", icon: Code },
    { value: "1000+", label: "TPS Capacity", icon: TrendingUp },
    { value: "99.9%", label: "Uptime", icon: Lock },
    { value: "24/7", label: "Real-time Monitoring", icon: Globe }
  ];

  return (
    <section className="py-24 bg-gradient-trust">
      <div className="container mx-auto px-4">
        {/* Project Vision */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">About CivicLedger</h2>
          <p className="text-xl text-civic-slate max-w-4xl mx-auto leading-relaxed">
            CivicLedger is a revolutionary decentralized public policy execution engine that transforms 
            government policies into executable smart contracts on the Internet Computer Protocol. 
            We're building the future of transparent, accountable governance.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <GlassCard variant="executive" className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg text-civic-slate leading-relaxed">
              To democratize governance by providing citizens with real-time visibility into policy execution, 
              enabling direct participation in decision-making, and ensuring every rupee is accounted for 
              through blockchain transparency.
            </p>
          </GlassCard>
        </motion.div>

        {/* Key Features */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-center mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard variant="luxury" className="p-6 text-center h-full" hoverable>
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-civic-blue" />
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-civic-slate">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-center mb-8">Technology Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack, index) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard variant="power" className="p-6 h-full">
                  <h4 className="text-lg font-semibold mb-4 text-white">{stack.category}</h4>
                  <div className="space-y-2">
                    {stack.technologies.map((tech) => (
                      <div key={tech} className="text-sm text-white/80 bg-white/10 px-3 py-1 rounded-full inline-block mr-2 mb-2">
                        {tech}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Members */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-center mb-8">Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard variant="executive" className="p-6 text-center h-full" hoverable>
                  <div className="text-4xl mb-4">{member.avatar}</div>
                  <h4 className="text-lg font-semibold mb-2">{member.name}</h4>
                  <p className="text-sm text-civic-blue mb-2">{member.role}</p>
                  <p className="text-xs text-civic-slate">{member.expertise}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard variant="luxury" className="p-6 text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-civic-gold" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="executive" size="lg" className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Repository
            </Button>
            <Button variant="executive" size="lg" className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Documentation
            </Button>
            <Button variant="executive" size="lg" className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              ICP Canister
            </Button>
            <Button variant="executive" size="lg" className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us
            </Button>
          </div>
        </motion.div>

        {/* Version Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 text-sm text-civic-slate">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Built with ❤️ for WCHL25</span>
            <span>•</span>
            <span>Powered by Internet Computer</span>
          </div>
          <div className="mt-4">
            <Award className="w-6 h-6 mx-auto text-civic-gold" />
            <p className="text-xs text-civic-slate mt-2">
              Winner of WCHL25 Hackathon - Best Governance Solution
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};