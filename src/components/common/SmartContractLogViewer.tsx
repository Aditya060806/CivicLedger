import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Download, 
  Code, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Database,
  Zap,
  Eye,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContractLog {
  id: string;
  timestamp: Date;
  type: "transaction" | "execution" | "error" | "validation";
  policy: string;
  fundAmount?: number;
  status: "success" | "pending" | "failed";
  gasUsed: number;
  hash: string;
  rawData: any;
  aiSummary: string;
  participants: string[];
}

interface SmartContractLogViewerProps {
  logs: ContractLog[];
  onFilter: (filters: any) => void;
}

export const SmartContractLogViewer = ({ logs, onFilter }: SmartContractLogViewerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRawLogs, setShowRawLogs] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filteredLogs, setFilteredLogs] = useState<ContractLog[]>(logs);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time log updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newLog: ContractLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        type: ["transaction", "execution", "validation"][Math.floor(Math.random() * 3)] as any,
        policy: ["PM Awas Yojana", "Mid Day Meal", "Digital Literacy"][Math.floor(Math.random() * 3)],
        fundAmount: Math.floor(Math.random() * 1000000),
        status: ["success", "pending"][Math.floor(Math.random() * 2)] as any,
        gasUsed: Math.floor(Math.random() * 50000),
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
        rawData: { block: Math.floor(Math.random() * 1000000) },
        aiSummary: "Automated fund disbursement completed successfully with all validation checks passed.",
        participants: [`0x${Math.random().toString(16).substr(2, 8)}`]
      };

      setFilteredLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep latest 50 logs
    }, 5000); // Add new log every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    let filtered = logs;
    
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.policy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.aiSummary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(log => log.type === filterType);
    }
    
    setFilteredLogs(filtered);
  }, [searchTerm, filterType, logs]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "transaction": return Zap;
      case "execution": return Code;
      case "error": return AlertTriangle;
      case "validation": return CheckCircle;
      default: return Database;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "transaction": return "text-civic-blue";
      case "execution": return "text-civic-green";
      case "error": return "text-civic-red";
      case "validation": return "text-civic-gold";
      default: return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-civic-green";
      case "pending": return "bg-civic-gold";
      case "failed": return "bg-civic-red";
      default: return "bg-gray-500";
    }
  };

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Smart Contract Logs</h3>
          <p className="text-sm text-muted-foreground">Real-time blockchain transaction monitoring</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.div
            className={cn("w-2 h-2 rounded-full", isLive ? "bg-civic-green" : "bg-gray-500")}
            animate={isLive ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs text-muted-foreground">
            {isLive ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs by policy, hash, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
          >
            All
          </Button>
          <Button
            variant={filterType === "transaction" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("transaction")}
          >
            Transactions
          </Button>
          <Button
            variant={filterType === "execution" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("execution")}
          >
            Executions
          </Button>
          <Button
            variant={filterType === "validation" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("validation")}
          >
            Validations
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="raw-logs"
            checked={showRawLogs}
            onCheckedChange={setShowRawLogs}
          />
          <Label htmlFor="raw-logs" className="text-sm">Raw Logs</Label>
        </div>

        {/* Export */}
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Log Entries */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredLogs.map((log, index) => {
            const TypeIcon = getTypeIcon(log.type);
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  {/* Header Info */}
                  <div className="flex items-center space-x-3">
                    <TypeIcon className={cn("w-5 h-5", getTypeColor(log.type))} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{log.policy}</span>
                        <Badge variant="outline" className="text-xs">
                          {log.type}
                        </Badge>
                        <div className={cn("w-2 h-2 rounded-full", getStatusColor(log.status))} />
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <span className="flex items-center">
                          <Database className="w-3 h-3 mr-1" />
                          {log.gasUsed.toLocaleString()} gas
                        </span>
                        {log.fundAmount && (
                          <span className="flex items-center text-civic-green">
                            ₹{(log.fundAmount / 100000).toFixed(1)}L
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <Badge 
                    variant={log.status === "success" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {log.status}
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {/* AI Interpretation */}
                  {!showRawLogs && (
                    <div className="flex items-start space-x-2">
                      <Brain className="w-4 h-4 text-civic-blue mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground/80">{log.aiSummary}</p>
                      </div>
                    </div>
                  )}

                  {/* Raw Data */}
                  {showRawLogs && (
                    <div className="bg-black/5 dark:bg-white/5 rounded p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Code className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Raw Log Data</span>
                      </div>
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
                        {JSON.stringify(log.rawData, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Hash and Participants */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">Hash:</span>
                      <code className="bg-muted px-2 py-1 rounded font-mono">
                        {log.hash.slice(0, 16)}...
                      </code>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="text-civic-blue">{log.participants.length}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No logs found matching your criteria</p>
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t text-xs text-muted-foreground">
        <span>Showing {filteredLogs.length} of {logs.length} logs</span>
        <div className="flex items-center space-x-4">
          <span>Last update: {new Date().toLocaleTimeString()}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="text-xs"
          >
            {isLive ? "Pause" : "Resume"} Live Updates
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};