import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  ArrowRight, 
  Zap, 
  CheckCircle, 
  IndianRupee,
  Building,
  Users,
  TrendingUp,
  AlertTriangle,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletNode {
  id: string;
  name: string;
  type: "government" | "contractor" | "beneficiary";
  balance: number;
  address: string;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  timestamp: Date;
  purpose: string;
}

interface FundFlowInterfaceProps {
  totalFunds: number;
  utilizedFunds: number;
  pendingTransactions: Transaction[];
  onTriggerFlow: () => void;
}

export const FundFlowInterface = ({ 
  totalFunds, 
  utilizedFunds, 
  pendingTransactions, 
  onTriggerFlow 
}: FundFlowInterfaceProps) => {
  const [isFlowing, setIsFlowing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [utilizationProgress, setUtilizationProgress] = useState(0);

  const wallets: WalletNode[] = [
    {
      id: "gov-treasury",
      name: "Government Treasury",
      type: "government",
      balance: totalFunds,
      address: "0x742d3...Aa9E"
    },
    {
      id: "contractor-wallet",
      name: "Contractor Pool",
      type: "contractor", 
      balance: totalFunds * 0.3,
      address: "0x8b2f1...3D4C"
    },
    {
      id: "beneficiary-pool",
      name: "Beneficiary Pool",
      type: "beneficiary",
      balance: totalFunds * 0.6,
      address: "0x4a8c9...7F2E"
    }
  ];

  useEffect(() => {
    setUtilizationProgress((utilizedFunds / totalFunds) * 100);
  }, [utilizedFunds, totalFunds]);

  const triggerFundFlow = () => {
    setIsFlowing(true);
    setShowFeedback("⚡ Transaction Initiated");

    // Simulate metamask-style flow
    setTimeout(() => {
      setCurrentTransaction(pendingTransactions[0] || {
        id: "tx-" + Date.now(),
        from: "gov-treasury",
        to: "beneficiary-pool",
        amount: 500000,
        status: "processing",
        timestamp: new Date(),
        purpose: "Direct Benefit Transfer"
      });
      setShowFeedback("📝 Smart Contract Executing");
    }, 1000);

    setTimeout(() => {
      setShowFeedback("✅ Transaction Confirmed");
    }, 3000);

    setTimeout(() => {
      setShowFeedback("🎉 Funds Distributed Successfully");
      setIsFlowing(false);
      setCurrentTransaction(null);
      onTriggerFlow();
    }, 5000);

    setTimeout(() => {
      setShowFeedback(null);
    }, 7000);
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case "government": return Building;
      case "contractor": return Wallet;
      case "beneficiary": return Users;
      default: return Wallet;
    }
  };

  const getWalletColor = (type: string) => {
    switch (type) {
      case "government": return "text-civic-blue";
      case "contractor": return "text-civic-gold";
      case "beneficiary": return "text-civic-green";
      default: return "text-gray-500";
    }
  };

  return (
    <GlassCard className="p-6 relative overflow-hidden">
      {/* Background Flow Animation */}
      <motion.div
        className={cn(
          "absolute inset-0 opacity-5",
          isFlowing && "bg-gradient-fund-flow fund-flow-animation"
        )}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Smart Contract Fund Flow</h3>
          <p className="text-sm text-muted-foreground">Real-time blockchain transaction visualization</p>
        </div>
        <Badge variant="outline" className="text-civic-blue border-civic-blue">
          <Timer className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      {/* Fund Utilization Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Fund Utilization</span>
          <span className="text-sm text-muted-foreground">
            ₹{(utilizedFunds / 100000).toFixed(1)}L / ₹{(totalFunds / 100000).toFixed(1)}L
          </span>
        </div>
        
        <div className="relative">
          <Progress value={utilizationProgress} className="h-3" />
          <motion.div
            className="absolute inset-0 bg-gradient-fund-flow opacity-20 rounded-full"
            animate={isFlowing ? { x: ["-100%", "100%"] } : {}}
            transition={{ duration: 2, repeat: isFlowing ? Infinity : 0, ease: "linear" }}
          />
        </div>
        
        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
          <span>Available: ₹{((totalFunds - utilizedFunds) / 100000).toFixed(1)}L</span>
          <span className="text-civic-green">{utilizationProgress.toFixed(1)}% Utilized</span>
        </div>
      </div>

      {/* Wallet Timeline */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between">
          {wallets.map((wallet, index) => {
            const WalletIcon = getWalletIcon(wallet.type);
            const isActive = currentTransaction && 
              (wallet.id === currentTransaction.from || wallet.id === currentTransaction.to);

            return (
              <div key={wallet.id} className="flex-1 text-center relative">
                <motion.div
                  className={cn(
                    "w-16 h-16 mx-auto mb-3 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isActive ? "border-civic-blue bg-civic-blue/10 shadow-glow" : "border-border bg-background"
                  )}
                  animate={isActive && isFlowing ? { 
                    scale: [1, 1.1, 1], 
                    boxShadow: ["0 0 0 rgba(54, 133, 251, 0)", "0 0 20px rgba(54, 133, 251, 0.5)", "0 0 0 rgba(54, 133, 251, 0)"]
                  } : {}}
                  transition={{ duration: 1, repeat: isActive && isFlowing ? Infinity : 0 }}
                >
                  <WalletIcon className={cn("w-6 h-6", getWalletColor(wallet.type))} />
                </motion.div>

                <div className="space-y-1">
                  <h4 className="text-xs font-medium">{wallet.name}</h4>
                  <p className="text-xs text-muted-foreground">₹{(wallet.balance / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-muted-foreground font-mono">{wallet.address}</p>
                </div>

                {/* Connection Arrow */}
                {index < wallets.length - 1 && (
                  <motion.div
                    className="absolute top-8 left-[calc(100%-12px)] w-6 h-0.5 bg-border flex items-center justify-center"
                    animate={isFlowing && currentTransaction ? {
                      backgroundColor: ["rgb(203, 213, 225)", "rgb(54, 133, 251)", "rgb(203, 213, 225)"]
                    } : {}}
                    transition={{ duration: 1, repeat: isFlowing ? Infinity : 0 }}
                  >
                    <motion.div
                      animate={isFlowing ? { x: ["-100%", "100%"] } : {}}
                      transition={{ duration: 1, repeat: isFlowing ? Infinity : 0, ease: "linear" }}
                    >
                      <ArrowRight className="w-4 h-4 text-civic-blue" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Details */}
      <AnimatePresence>
        {currentTransaction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-gradient-glass-blue rounded-lg border border-civic-blue/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-civic-blue">Active Transaction</span>
              <Badge variant="secondary" className="text-xs">
                {currentTransaction.status}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">₹{(currentTransaction.amount / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose:</span>
                <span className="font-medium">{currentTransaction.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas Fee:</span>
                <span className="font-medium text-civic-green">Sponsored by DAO</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={triggerFundFlow}
          disabled={isFlowing}
          className={cn(
            "flex-1 bg-gradient-civic hover:bg-gradient-civic-alt text-civic-white transition-all duration-300",
            isFlowing && "cursor-not-allowed opacity-75"
          )}
        >
          <Zap className={cn("w-4 h-4 mr-2", isFlowing && "animate-pulse")} />
          {isFlowing ? "Processing..." : "Trigger Fund Flow"}
        </Button>

        {/* Quick Stats */}
        <div className="flex space-x-2 text-xs">
          <div className="text-center">
            <div className="text-civic-green font-medium">{pendingTransactions.length}</div>
            <div className="text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-civic-blue font-medium">98.2%</div>
            <div className="text-muted-foreground">Success</div>
          </div>
        </div>
      </div>

      {/* Feedback Notifications */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="absolute bottom-4 left-4 right-4 p-3 bg-black/90 text-white text-sm rounded-lg text-center font-medium"
          >
            {showFeedback}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};