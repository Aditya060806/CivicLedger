import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Zap, 
  Globe, 
  Github, 
  Linkedin, 
  Heart,
  Target,
  Eye,
  Lock,
  BookOpen,
  Award,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedCard, FeatureCard } from "./EnhancedCard";
import { Separator } from "@/components/ui/separator";

export const AboutSection = () => {
  const missionValues = [
    {
      icon: Target,
      title: "Mission",
      description: "To revolutionize governance through transparent, automated smart contracts that ensure every policy is executed with complete accountability and citizen oversight."
    },
    {
      icon: Eye,
      title: "Vision", 
      description: "A future where government operations are fully transparent, corruption is eliminated through blockchain technology, and citizens actively participate in governance decisions."
    },
    {
      icon: Heart,
      title: "Values",
      description: "Transparency, Accountability, Innovation, Citizen Empowerment, and Democratic Participation form the core of our platform's philosophy."
    }
  ];

  const platformFeatures = [
    {
      icon: Lock,
      title: "Blockchain Security",
      description: "Military-grade encryption and immutable ledger technology ensure data integrity and prevent unauthorized modifications."
    },
    {
      icon: Users,
      title: "Citizen Participation",
      description: "Direct involvement in governance through voting, feedback, complaints, and real-time tracking of policy implementations."
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description: "Automated policy execution through smart contracts eliminates delays and ensures compliance with predefined conditions."
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Live dashboards and reports provide instant insights into fund utilization, project progress, and governance metrics."
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Chief Technology Officer",
      specialty: "Blockchain Architecture",
      description: "15+ years in distributed systems and blockchain technology",
      image: "RK"
    },
    {
      name: "Priya Sharma",
      role: "Head of Design",
      specialty: "User Experience",
      description: "Former Google designer specializing in government interfaces",
      image: "PS"
    },
    {
      name: "Amit Singh",
      role: "Lead Developer",
      specialty: "Full Stack Development",
      description: "Expert in React, Node.js, and smart contract development",
      image: "AS"
    },
    {
      name: "Neha Gupta",
      role: "Smart Contract Lead",
      specialty: "Solidity & Web3",
      description: "Specialized in governance smart contracts and DeFi protocols",
      image: "NG"
    },
    {
      name: "Dr. Sandeep Verma",
      role: "Policy Advisor",
      specialty: "Government Relations",
      description: "Former IAS officer with 20+ years in public administration",
      image: "SV"
    },
    {
      name: "Kavita Patel",
      role: "Security Auditor",
      specialty: "Cybersecurity",
      description: "Certified ethical hacker and blockchain security specialist",
      image: "KP"
    }
  ];

  const achievements = [
    { number: "50M+", label: "Transactions Processed", icon: Zap },
    { number: "25+", label: "Government Partners", icon: Shield },
    { number: "98.9%", label: "Uptime Reliability", icon: Target },
    { number: "500K+", label: "Active Citizens", icon: Users }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-civic-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="fluid-text-4xl font-bold mb-6 text-display">
            About CivicLedger
          </h2>
          <p className="fluid-text-lg text-civic-slate max-w-3xl mx-auto leading-relaxed">
            We're building the future of governance through blockchain technology, 
            creating transparent, accountable, and citizen-centric government operations.
          </p>
        </motion.div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {missionValues.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                variant="glass"
                glowing
              />
            </motion.div>
          ))}
        </div>

        {/* Platform Features */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="fluid-text-3xl font-bold text-center mb-12">
            Platform Capabilities
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variant="elevated"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="mb-20 py-12 bg-gradient-civic rounded-2xl text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="fluid-text-3xl font-bold text-center mb-12">
            Platform Impact
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <achievement.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="fluid-text-3xl font-bold mb-2 text-mono">
                  {achievement.number}
                </div>
                <div className="text-sm opacity-90">{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="fluid-text-3xl font-bold text-center mb-12">
            Our Team
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <EnhancedCard variant="glass" className="text-center h-full">
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-civic rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {member.image}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{member.name}</h4>
                      <p className="text-civic-blue font-medium">{member.role}</p>
                      <p className="text-sm text-civic-gold">{member.specialty}</p>
                    </div>
                    <p className="text-sm text-civic-slate">{member.description}</p>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </EnhancedCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <EnhancedCard variant="outlined" className="p-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className="fluid-text-3xl font-bold">
                Join the Governance Revolution
              </h3>
              <p className="fluid-text-lg text-civic-slate max-w-2xl mx-auto">
                Experience transparent, accountable governance powered by blockchain technology. 
                Start tracking policies, participating in decisions, and holding institutions accountable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="civic">
                  <Link to="/citizen">
                    <Users className="w-5 h-5 mr-2" />
                    Citizen Portal
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/dashboard">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explore Platform
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 mr-2" />
                    View Source
                  </a>
                </Button>
              </div>
            </div>
          </EnhancedCard>
        </motion.div>
      </div>
    </section>
  );
};