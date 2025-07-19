import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Flag, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users, 
  MapPin,
  Zap,
  ArrowUp,
  Eye
} from "lucide-react";

interface PulseItem {
  id: string;
  type: "citizen_flag" | "contract_pending" | "dao_intervention" | "audit_alert";
  title: string;
  description: string;
  location: string;
  timestamp: string;
  urgency: "low" | "medium" | "high" | "critical";
  author: string;
  votes?: number;
  status: "open" | "in_progress" | "resolved";
}

const mockPulseData: PulseItem[] = [
  {
    id: "1",
    type: "citizen_flag",
    title: "Road Construction Delayed",
    description: "NH-44 repair work stalled for 3 weeks without explanation",
    location: "Gurgaon, Haryana",
    timestamp: "2 min ago",
    urgency: "high",
    author: "Priya Sharma",
    votes: 47,
    status: "open"
  },
  {
    id: "2",
    type: "dao_intervention",
    title: "Emergency Fund Release Approved",
    description: "₹2.5 Cr released for flood relief in Assam districts",
    location: "Assam",
    timestamp: "15 min ago",
    urgency: "critical",
    author: "DAO Community",
    votes: 156,
    status: "in_progress"
  },
  {
    id: "3",
    type: "contract_pending",
    title: "School Infrastructure Tender",
    description: "Awaiting contractor selection for 25 rural schools",
    location: "Rajasthan",
    timestamp: "1 hour ago",
    urgency: "medium",
    author: "Education Dept",
    status: "open"
  },
  {
    id: "4",
    type: "audit_alert",
    title: "Irregularity in Material Quality",
    description: "Substandard cement detected in 3 construction sites",
    location: "Mumbai, Maharashtra",
    timestamp: "3 hours ago",
    urgency: "high",
    author: "Audit Team",
    status: "in_progress"
  }
];

export const PublicPulseFeed = () => {
  const [pulseItems, setPulseItems] = useState<PulseItem[]>(mockPulseData);
  const [filter, setFilter] = useState<string>("all");

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update an item or add a new one
      if (Math.random() > 0.7) {
        setPulseItems(prev => {
          const updated = [...prev];
          const randomIndex = Math.floor(Math.random() * updated.length);
          updated[randomIndex] = {
            ...updated[randomIndex],
            votes: (updated[randomIndex].votes || 0) + Math.floor(Math.random() * 3),
            timestamp: "Just now"
          };
          return updated;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500 animate-pulse";
      case "high":
        return "bg-orange-500 animate-pulse";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "citizen_flag":
        return Flag;
      case "contract_pending":
        return Clock;
      case "dao_intervention":
        return Zap;
      case "audit_alert":
        return AlertTriangle;
      default:
        return Flag;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "citizen_flag":
        return "border-l-civic-blue bg-civic-blue/5";
      case "contract_pending":
        return "border-l-amber-400 bg-amber-400/5";
      case "dao_intervention":
        return "border-l-civic-green bg-civic-green/5";
      case "audit_alert":
        return "border-l-red-400 bg-red-400/5";
      default:
        return "border-l-gray-400 bg-gray-400/5";
    }
  };

  const filteredItems = filter === "all" 
    ? pulseItems 
    : pulseItems.filter(item => item.type === filter);

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <TrendingUp className="w-5 h-5 text-primary" />
              </motion.div>
              <h3 className="font-semibold">Public Pulse Feed</h3>
              <Badge variant="outline" className="animate-pulse">Live</Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-civic-green rounded-full animate-pulse" />
              Real-time
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: "all", label: "All", icon: Eye },
              { id: "citizen_flag", label: "Flags", icon: Flag },
              { id: "contract_pending", label: "Pending", icon: Clock },
              { id: "dao_intervention", label: "DAO", icon: Zap },
              { id: "audit_alert", label: "Alerts", icon: AlertTriangle }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={filter === id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(id)}
                className="whitespace-nowrap"
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-1">
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    p-4 border-l-4 hover:bg-accent/50 transition-all cursor-pointer group
                    ${getTypeColor(item.type)}
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Urgency Indicator */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <div className={`w-3 h-3 rounded-full ${getUrgencyStyle(item.urgency)}`} />
                      <TypeIcon className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={`text-xs shrink-0 ${
                            item.status === "resolved" ? "bg-civic-green/10 text-civic-green" :
                            item.status === "in_progress" ? "bg-civic-blue/10 text-civic-blue" :
                            "bg-muted"
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Avatar className="w-4 h-4">
                              <AvatarFallback className="text-xs">
                                {item.author.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            {item.author}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {item.votes && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center gap-1 text-civic-blue cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                              {item.votes}
                            </motion.div>
                          )}
                          <span className="text-muted-foreground">{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/20 text-center">
          <p className="text-xs text-muted-foreground">
            <Users className="w-3 h-3 inline mr-1" />
            {pulseItems.length} active items • Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};