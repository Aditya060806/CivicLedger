import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  HardHat,
  ShieldCheck,
  Scale,
  MapPin,
  TrendingUp,
  Gavel,
  Flag
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  responsibilities: string[];
  impact: string;
}

const roles: Role[] = [
  {
    id: "citizen",
    name: "Citizen",
    description: "Voice your community needs and track public service delivery",
    icon: Users,
    color: "civic-blue",
    gradient: "from-civic-blue to-civic-blue-dark",
    responsibilities: ["Report Issues", "Track Complaints", "Vote on Proposals", "Monitor Progress"],
    impact: "Direct Democracy Participation"
  },
  {
    id: "contractor",
    name: "Contractor",
    description: "Execute approved projects with transparent proof-of-work submission",
    icon: HardHat,
    color: "civic-green",
    gradient: "from-civic-green to-civic-green-dark",
    responsibilities: ["Submit Proofs", "GPS Verification", "Timeline Adherence", "Quality Assurance"],
    impact: "Infrastructure Delivery"
  },
  {
    id: "auditor",
    name: "Auditor",
    description: "Verify project compliance and ensure fund utilization transparency",
    icon: ShieldCheck,
    color: "amber-500",
    gradient: "from-amber-400 to-amber-600",
    responsibilities: ["Field Verification", "Compliance Check", "Flag Irregularities", "Quality Audit"],
    impact: "Accountability Enforcement"
  },
  {
    id: "policy_maker",
    name: "Policy Maker",
    description: "Design schemes and oversee regional implementation strategies",
    icon: Scale,
    color: "purple-500",
    gradient: "from-purple-400 to-purple-600",
    responsibilities: ["Policy Design", "Fund Allocation", "Regional Analysis", "DAO Governance"],
    impact: "Strategic Governance"
  }
];

interface RoleSelectorProps {
  onRoleSelect: (roleId: string) => void;
  selectedRole?: string;
}

export const RoleSelector = ({ onRoleSelect, selectedRole }: RoleSelectorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextRole = () => {
    setCurrentIndex((prev) => (prev + 1) % roles.length);
  };

  const prevRole = () => {
    setCurrentIndex((prev) => (prev - 1 + roles.length) % roles.length);
  };

  const currentRole = roles[currentIndex];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-civic-blue to-civic-green bg-clip-text text-transparent mb-4">
            Digital India DAO
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent governance, accountable execution, citizen empowerment
          </p>
          <Badge variant="outline" className="mt-4 border-primary/20 text-primary">
            <Gavel className="w-3 h-3 mr-1" />
            Constitutional Technology for All
          </Badge>
        </motion.div>

        {/* Role Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="max-w-4xl mx-auto"
            >
              <Card className="relative overflow-hidden border-2 shadow-2xl">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentRole.gradient} opacity-5`} />
                
                <CardContent className="p-8 md:p-12 relative">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Role Info */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentRole.gradient} text-white shadow-lg`}>
                          <currentRole.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">{currentRole.name}</h2>
                          <p className="text-muted-foreground">{currentRole.description}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Core Responsibilities
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {currentRole.responsibilities.map((resp, idx) => (
                              <motion.div
                                key={resp}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                {resp}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <h4 className="font-medium text-primary mb-1 flex items-center gap-2">
                            <Flag className="w-4 h-4" />
                            Impact Area
                          </h4>
                          <p className="text-sm">{currentRole.impact}</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => onRoleSelect(currentRole.id)}
                        className={`w-full h-12 bg-gradient-to-r ${currentRole.gradient} hover:opacity-90 text-white font-semibold shadow-lg`}
                      >
                        Enter as {currentRole.name}
                      </Button>
                    </div>

                    {/* Visual Representation */}
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`relative p-8 rounded-3xl bg-gradient-to-br ${currentRole.gradient} text-white shadow-2xl`}
                      >
                        <currentRole.icon className="w-24 h-24 mx-auto mb-4 opacity-90" />
                        
                        {/* Floating Elements */}
                        <motion.div
                          animate={{ y: [-10, 10, -10] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute top-4 right-4 p-2 bg-white/20 rounded-full"
                        >
                          <MapPin className="w-4 h-4" />
                        </motion.div>
                        
                        <motion.div
                          animate={{ y: [10, -10, 10] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute bottom-4 left-4 p-2 bg-white/20 rounded-full"
                        >
                          <Gavel className="w-4 h-4" />
                        </motion.div>

                        {/* Pulse Ring */}
                        <div className="absolute inset-0 rounded-3xl">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 border-2 border-white rounded-3xl"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={prevRole}
              className="p-3 rounded-full"
            >
              ←
            </Button>

            <div className="flex gap-2">
              {roles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-primary scale-125' : 'bg-primary/30'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextRole}
              className="p-3 rounded-full"
            >
              →
            </Button>
          </div>
        </div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Quick Access</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {roles.map((role) => (
              <Button
                key={role.id}
                variant="ghost"
                onClick={() => onRoleSelect(role.id)}
                className="p-2 hover:scale-105 transition-transform"
              >
                <role.icon className="w-5 h-5" />
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};