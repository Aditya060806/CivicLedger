import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Zap, TrendingUp, AlertCircle, Eye } from "lucide-react";
import { IndiaMap } from "@/components/maps/IndiaMap";
import { GlassCard } from "@/components/common/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RegionData {
  id: string;
  name: string;
  daoRollouts: number;
  complaintDensity: "low" | "medium" | "high";
  successIndex: number;
  activeSchemes: number;
  coordinates: [number, number];
}

const mockRegionData: RegionData[] = [
  {
    id: "delhi",
    name: "Delhi",
    daoRollouts: 12,
    complaintDensity: "medium",
    successIndex: 87,
    activeSchemes: 8,
    coordinates: [77.1025, 28.7041]
  },
  {
    id: "mumbai",
    name: "Mumbai",
    daoRollouts: 18,
    complaintDensity: "low",
    successIndex: 94,
    activeSchemes: 15,
    coordinates: [72.8777, 19.0760]
  },
  {
    id: "bangalore",
    name: "Bangalore",
    daoRollouts: 9,
    complaintDensity: "high",
    successIndex: 76,
    activeSchemes: 6,
    coordinates: [77.5946, 12.9716]
  }
];

export const EnhancedMapInterface = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [mapView, setMapView] = useState<"dao-rollouts" | "complaints" | "success">("dao-rollouts");

  const getComplaintColor = (density: string) => {
    switch (density) {
      case "low": return "text-civic-green";
      case "medium": return "text-yellow-500";
      case "high": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getSuccessColor = (index: number) => {
    if (index >= 85) return "text-civic-green";
    if (index >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Enhanced Map Intelligence</h3>
        
        {/* Map View Toggle */}
        <div className="flex gap-2">
          {[
            { id: "dao-rollouts", label: "DAO Rollouts", icon: Zap },
            { id: "complaints", label: "Complaints", icon: AlertCircle },
            { id: "success", label: "Success Index", icon: TrendingUp }
          ].map(view => (
            <Button
              key={view.id}
              variant={mapView === view.id ? "default" : "outline"}
              size="sm"
              onClick={() => setMapView(view.id as any)}
              className="flex items-center gap-1"
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="relative">
            <IndiaMap />
            
            {/* Overlay Data Points */}
            <div className="absolute inset-0 pointer-events-none">
              {mockRegionData.map((region, index) => (
                <motion.div
                  key={region.id}
                  className="absolute"
                  style={{
                    left: `${30 + index * 20}%`,
                    top: `${40 + index * 15}%`
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <motion.div
                    className={`w-4 h-4 rounded-full cursor-pointer pointer-events-auto ${
                      mapView === "dao-rollouts" ? "bg-civic-blue" :
                      mapView === "complaints" ? getComplaintColor(region.complaintDensity).replace("text-", "bg-") :
                      "bg-civic-green"
                    }`}
                    whileHover={{ scale: 1.5 }}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0.7)",
                        "0 0 0 10px rgba(59, 130, 246, 0)",
                        "0 0 0 0 rgba(59, 130, 246, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                    onClick={() => setSelectedRegion(region)}
                  />
                  
                  {/* Hover Tooltip */}
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 pointer-events-none"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-lg">
                      <div className="font-medium">{region.name}</div>
                      <div className="text-muted-foreground">
                        {mapView === "dao-rollouts" && `${region.daoRollouts} rollouts`}
                        {mapView === "complaints" && `${region.complaintDensity} complaints`}
                        {mapView === "success" && `${region.successIndex}% success`}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Details Panel */}
        <div className="space-y-4">
          <h4 className="font-semibold">Regional Intelligence</h4>
          
          {selectedRegion ? (
            <motion.div
              key={selectedRegion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-civic-blue" />
                  <h5 className="font-semibold">{selectedRegion.name}</h5>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">DAO Rollouts</span>
                    <Badge variant="secondary">{selectedRegion.daoRollouts}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Complaint Density</span>
                    <Badge className={`${getComplaintColor(selectedRegion.complaintDensity).replace("text-", "text-")}`}>
                      {selectedRegion.complaintDensity}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Index</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getSuccessColor(selectedRegion.successIndex)}`}>
                        {selectedRegion.successIndex}%
                      </span>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <motion.div
                          className={`h-full rounded-full ${
                            selectedRegion.successIndex >= 85 ? "bg-civic-green" :
                            selectedRegion.successIndex >= 70 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedRegion.successIndex}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Schemes</span>
                    <span className="font-medium">{selectedRegion.activeSchemes}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="p-4 bg-muted/30 rounded-lg text-center text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Click on a region to view details</p>
            </div>
          )}
          
          {/* Legend */}
          <div className="space-y-2">
            <h5 className="font-medium text-sm">Legend</h5>
            <div className="space-y-1 text-xs">
              {mapView === "dao-rollouts" && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-civic-blue" />
                  <span>DAO Rollout Activity</span>
                </div>
              )}
              {mapView === "complaints" && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-civic-green" />
                    <span>Low Complaints</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Medium Complaints</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>High Complaints</span>
                  </div>
                </>
              )}
              {mapView === "success" && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-civic-green" />
                  <span>Success Index</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};