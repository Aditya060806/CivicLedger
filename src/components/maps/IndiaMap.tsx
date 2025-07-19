import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../common/GlassCard";
import { StatusBadge } from "../common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Eye, 
  AlertCircle, 
  CheckCircle,
  Clock,
  IndianRupee,
  X,
  TrendingUp,
  Users,
  FileText
} from "lucide-react";

interface StateData {
  id: string;
  name: string;
  schemes: Array<{
    name: string;
    status: "completed" | "in-progress" | "delayed" | "not-started";
    contractor: string;
    fundReleased: number;
    totalFund: number;
    lastComplaint?: string;
    complaintsCount: number;
  }>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export const IndiaMap = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Mock India states data with approximate SVG positions
  const states: StateData[] = [
    {
      id: "delhi",
      name: "Delhi",
      position: { x: 45, y: 35 },
      size: { width: 4, height: 4 },
      schemes: [
        {
          name: "PM Awas Yojana - Phase 3",
          status: "in-progress",
          contractor: "Urban Infrastructure Ltd",
          fundReleased: 2500000,
          totalFund: 5000000,
          lastComplaint: "Fund delay reported by 3 beneficiaries",
          complaintsCount: 3
        },
        {
          name: "Digital Literacy Campaign",
          status: "delayed",
          contractor: "TechEd Solutions",
          fundReleased: 800000,
          totalFund: 4500000,
          lastComplaint: "Quality issues with training materials",
          complaintsCount: 7
        }
      ]
    },
    {
      id: "maharashtra",
      name: "Maharashtra",
      position: { x: 35, y: 55 },
      size: { width: 12, height: 15 },
      schemes: [
        {
          name: "Rural Road Development",
          status: "completed",
          contractor: "Maharashtra Infra Corp",
          fundReleased: 15000000,
          totalFund: 15000000,
          complaintsCount: 0
        },
        {
          name: "Farmer Support Scheme",
          status: "in-progress", 
          contractor: "Agri Solutions Ltd",
          fundReleased: 8500000,
          totalFund: 12000000,
          complaintsCount: 1
        }
      ]
    },
    {
      id: "karnataka",
      name: "Karnataka",
      position: { x: 32, y: 68 },
      size: { width: 10, height: 12 },
      schemes: [
        {
          name: "Tech Hub Development",
          status: "completed",
          contractor: "Bangalore Tech Corp",
          fundReleased: 25000000,
          totalFund: 25000000,
          complaintsCount: 0
        }
      ]
    },
    {
      id: "rajasthan",
      name: "Rajasthan",
      position: { x: 28, y: 35 },
      size: { width: 16, height: 18 },
      schemes: [
        {
          name: "Desert Solar Project",
          status: "in-progress",
          contractor: "Solar Energy Systems",
          fundReleased: 18000000,
          totalFund: 30000000,
          complaintsCount: 2
        },
        {
          name: "Water Conservation",
          status: "delayed",
          contractor: "Water Works Ltd",
          fundReleased: 5000000,
          totalFund: 20000000,
          lastComplaint: "Delayed implementation affecting farmers",
          complaintsCount: 12
        }
      ]
    },
    {
      id: "uttar-pradesh",
      name: "Uttar Pradesh",
      position: { x: 48, y: 32 },
      size: { width: 18, height: 14 },
      schemes: [
        {
          name: "Education Infrastructure",
          status: "in-progress",
          contractor: "UP Education Corp",
          fundReleased: 45000000,
          totalFund: 75000000,
          complaintsCount: 5
        }
      ]
    },
    {
      id: "tamil-nadu",
      name: "Tamil Nadu",
      position: { x: 38, y: 78 },
      size: { width: 8, height: 10 },
      schemes: [
        {
          name: "Coastal Protection",
          status: "not-started",
          contractor: "Coastal Engineering Ltd",
          fundReleased: 0,
          totalFund: 18000000,
          complaintsCount: 0
        }
      ]
    }
  ];

  const getStateColor = (state: StateData) => {
    const hasDelayed = state.schemes.some(s => s.status === "delayed");
    const hasInProgress = state.schemes.some(s => s.status === "in-progress");
    const allCompleted = state.schemes.every(s => s.status === "completed");
    const allNotStarted = state.schemes.every(s => s.status === "not-started");

    if (hasDelayed) return "#ef4444"; // red
    if (allCompleted) return "#22c55e"; // green
    if (hasInProgress) return "#f59e0b"; // yellow
    if (allNotStarted) return "#6b7280"; // gray
    return "#6b7280";
  };

  const getStateColorClass = (state: StateData) => {
    const hasDelayed = state.schemes.some(s => s.status === "delayed");
    const hasInProgress = state.schemes.some(s => s.status === "in-progress");
    const allCompleted = state.schemes.every(s => s.status === "completed");
    
    if (hasDelayed) return "bg-red-500";
    if (allCompleted) return "bg-green-500";
    if (hasInProgress) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const totalSchemes = states.reduce((acc, state) => acc + state.schemes.length, 0);
  const completedSchemes = states.reduce((acc, state) => 
    acc + state.schemes.filter(s => s.status === "completed").length, 0);
  const delayedSchemes = states.reduce((acc, state) => 
    acc + state.schemes.filter(s => s.status === "delayed").length, 0);
  const totalComplaints = states.reduce((acc, state) => 
    acc + state.schemes.reduce((schemeAcc, scheme) => schemeAcc + scheme.complaintsCount, 0), 0);

  return (
    <div className="space-y-6">
      {/* Development Notice */}
      <motion.div
        className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <div className="text-amber-600">⚠️</div>
          <span className="text-amber-800 font-medium">
            Interactive Map under development — regions below represent live governance tracking
          </span>
        </div>
      </motion.div>

      {/* Map Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-4 h-4 text-civic-green" />
            <span className="text-xs text-muted-foreground">Total Schemes</span>
          </div>
          <div className="text-2xl font-bold">{totalSchemes}</div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{completedSchemes}</div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="text-xs text-muted-foreground">Delayed</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{delayedSchemes}</div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center space-x-2 mb-1">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-muted-foreground">Complaints</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{totalComplaints}</div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">India - Scheme Execution Map</h3>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Delayed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>Not Started</span>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Enhanced India outline background */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="mapGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                      <path d="M 5 0 L 0 0 0 5" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3"/>
                    </pattern>
                    <linearGradient id="indiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--civic-blue))" stopOpacity="0.1"/>
                      <stop offset="100%" stopColor="hsl(var(--civic-green))" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  <rect width="100" height="100" fill="url(#mapGrid)" />
                  <path
                    d="M35 25 L55 20 L70 25 L75 35 L70 50 L75 65 L70 75 L55 85 L45 80 L35 75 L25 65 L20 50 L25 35 Z"
                    fill="url(#indiaGradient)"
                    stroke="hsl(var(--civic-blue))"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />
                </svg>
              </div>

              {/* State regions */}
              {states.map((state, index) => (
                <motion.div
                  key={state.id}
                  className={`absolute rounded-lg cursor-pointer transition-all duration-500 ${getStateColorClass(state)} ${
                    hoveredState === state.id ? 'ring-4 ring-white ring-opacity-80 scale-125 shadow-xl z-10' : 'hover:shadow-lg'
                  } ${selectedState?.id === state.id ? 'ring-2 ring-civic-green scale-110 z-10' : ''}`}
                  style={{
                    left: `${state.position.x}%`,
                    top: `${state.position.y}%`,
                    width: `${state.size.width}%`,
                    height: `${state.size.height}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  onClick={() => setSelectedState(state)}
                  onHoverStart={() => setHoveredState(state.id)}
                  onHoverEnd={() => setHoveredState(null)}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-white drop-shadow-lg" />
                  </div>
                  
                  {/* State name tooltip */}
                  <AnimatePresence>
                    {hoveredState === state.id && (
                      <motion.div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                      >
                        {state.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </GlassCard>
        </div>

        {/* State Details Drawer */}
        <div>
          <GlassCard className="p-6 h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">State Details</h3>
              {selectedState && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedState(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {selectedState ? (
                <motion.div
                  key={selectedState.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h4 className="font-medium text-lg mb-2">{selectedState.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedState.schemes.length} active schemes
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedState.schemes.map((scheme, index) => (
                      <motion.div
                        key={index}
                        className="border rounded-lg p-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-sm">{scheme.name}</h5>
                          <StatusBadge status={scheme.status.replace('-', '-') as any} />
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contractor</span>
                            <span className="font-medium">{scheme.contractor}</span>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground">Fund Release</span>
                              <span className="font-medium">
                                ₹{(scheme.fundReleased / 100000).toFixed(1)}L / ₹{(scheme.totalFund / 100000).toFixed(1)}L
                              </span>
                            </div>
                            <Progress 
                              value={(scheme.fundReleased / scheme.totalFund) * 100} 
                              className="h-1"
                            />
                          </div>

                          {scheme.complaintsCount > 0 && (
                            <div className="flex items-center text-red-600">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              <span>{scheme.complaintsCount} complaints</span>
                            </div>
                          )}

                          {scheme.lastComplaint && (
                            <div className="mt-2 p-2 bg-red-50 rounded text-red-800">
                              <p className="text-xs">{scheme.lastComplaint}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Details
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-full text-center text-muted-foreground"
                >
                  <div>
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Click on a state to view scheme details</p>
                    <p className="text-xs mt-1">Interactive governance tracking</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};