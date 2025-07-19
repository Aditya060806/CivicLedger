import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  IndianRupee, 
  User, 
  AlertTriangle,
  QrCode,
  Clock,
  CheckCircle
} from "lucide-react";

interface GroundTruthData {
  id: string;
  schemeName: string;
  district: string;
  lastDisbursement: string;
  contractor: string;
  contractorRating: number;
  fundStatus: "disbursed" | "pending" | "paused";
  lastAmount: number;
  hasIssues: boolean;
}

interface GroundTruthToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const GroundTruthToggle = ({ isEnabled, onToggle }: GroundTruthToggleProps) => {
  const groundTruthData: GroundTruthData[] = [
    {
      id: "GT001",
      schemeName: "PM Awas Yojana - Phase 3",
      district: "North Delhi",
      lastDisbursement: "2024-01-15",
      contractor: "Urban Infrastructure Ltd",
      contractorRating: 4.2,
      fundStatus: "disbursed",
      lastAmount: 2500000,
      hasIssues: false
    },
    {
      id: "GT002", 
      schemeName: "Mid Day Meal Program",
      district: "South Delhi",
      lastDisbursement: "2024-01-10",
      contractor: "Food Services Corp",
      contractorRating: 3.8,
      fundStatus: "paused",
      lastAmount: 0,
      hasIssues: true
    },
    {
      id: "GT003",
      schemeName: "Digital Literacy Campaign", 
      district: "East Delhi",
      lastDisbursement: "2023-12-20",
      contractor: "TechEd Solutions",
      contractorRating: 4.5,
      fundStatus: "pending",
      lastAmount: 800000,
      hasIssues: true
    }
  ];

  const handleFlagIssue = (schemeId: string) => {
    // Handle flag issue logic
    console.log(`Flagging issue for scheme: ${schemeId}`);
  };

  return (
    <div className="space-y-6">
      {/* Toggle Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">GroundTruth Mode</h3>
          <p className="text-sm text-muted-foreground">
            View real-time scheme status in your local area
          </p>
        </div>
        
        <motion.button
          className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 ${
            isEnabled ? 'bg-civic-green' : 'bg-gray-300'
          }`}
          onClick={() => onToggle(!isEnabled)}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-6 h-6 bg-white rounded-full shadow-md"
            animate={{ x: isEnabled ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          {/* Pulse effect when enabled */}
          {isEnabled && (
            <motion.div
              className="absolute inset-0 bg-civic-green rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>

      {/* GroundTruth Data */}
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {groundTruthData.map((data, index) => (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <GlassCard className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{data.schemeName}</h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {data.district}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {data.hasIssues && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Issues
                        </Badge>
                      )}
                      
                      <Badge 
                        variant={
                          data.fundStatus === 'disbursed' ? 'default' :
                          data.fundStatus === 'pending' ? 'secondary' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {data.fundStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                    <div>
                      <span className="text-muted-foreground block">Last Disbursement</span>
                      <span className="font-medium flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(data.lastDisbursement).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground block">Amount</span>
                      <span className="font-medium flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {data.lastAmount > 0 ? `₹${(data.lastAmount / 100000).toFixed(1)}L` : 'On Hold'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium">{data.contractor}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < Math.floor(data.contractorRating) 
                                  ? 'bg-civic-gold' 
                                  : 'bg-gray-200'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {data.contractorRating}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs px-2"
                      >
                        <QrCode className="w-3 h-3 mr-1" />
                        Scan
                      </Button>
                    </div>
                    
                    <Button
                      variant={data.hasIssues ? "destructive" : "outline"}
                      size="sm"
                      className="h-6 text-xs px-3"
                      onClick={() => handleFlagIssue(data.id)}
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Flag Issue
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};