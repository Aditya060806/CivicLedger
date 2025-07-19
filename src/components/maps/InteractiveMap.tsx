import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../common/GlassCard";
import { StatusBadge } from "../common/StatusBadge";
import { Button } from "@/components/ui/button";
import { MapPin, Eye, AlertCircle } from "lucide-react";

interface District {
  id: string;
  name: string;
  schemes: number;
  complaints: number;
  fundReleased: number;
  totalFund: number;
  status: "active" | "paused" | "under-review";
  position: { x: number; y: number };
}

export const InteractiveMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Mock data for districts
  const districts: District[] = [
    { id: "1", name: "North Delhi", schemes: 12, complaints: 3, fundReleased: 2500000, totalFund: 5000000, status: "active", position: { x: 30, y: 20 } },
    { id: "2", name: "South Delhi", schemes: 8, complaints: 1, fundReleased: 1800000, totalFund: 3000000, status: "active", position: { x: 25, y: 60 } },
    { id: "3", name: "East Delhi", schemes: 15, complaints: 7, fundReleased: 800000, totalFund: 4500000, status: "paused", position: { x: 70, y: 35 } },
    { id: "4", name: "West Delhi", schemes: 10, complaints: 2, fundReleased: 3200000, totalFund: 4000000, status: "under-review", position: { x: 15, y: 45 } },
  ];

  const getDistrictColor = (status: string) => {
    switch (status) {
      case "active": return "bg-civic-green";
      case "paused": return "bg-orange-500";
      case "under-review": return "bg-civic-blue";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Interactive Map */}
      <div className="lg:col-span-2">
        <GlassCard className="p-6 h-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Delhi Districts - Scheme Coverage</h3>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-civic-green rounded-full"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Paused</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-civic-blue rounded-full"></div>
                <span>Under Review</span>
              </div>
            </div>
          </div>
          
          <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden">
            {/* Map background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            {/* District markers */}
            {districts.map((district) => (
              <motion.div
                key={district.id}
                className={`absolute w-4 h-4 rounded-full cursor-pointer ${getDistrictColor(district.status)} shadow-lg flex items-center justify-center`}
                style={{ 
                  left: `${district.position.x}%`, 
                  top: `${district.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                whileHover={{ scale: 1.5 }}
                onClick={() => setSelectedDistrict(district)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * parseInt(district.id) }}
              >
                <MapPin className="w-2 h-2 text-white" />
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* District Details */}
      <div>
        <GlassCard className="p-6 h-96">
          <h3 className="text-lg font-semibold mb-4">District Details</h3>
          {selectedDistrict ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h4 className="font-medium text-lg">{selectedDistrict.name}</h4>
                <StatusBadge status={selectedDistrict.status} className="mt-1" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Schemes</span>
                  <span className="font-medium">{selectedDistrict.schemes}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Complaints</span>
                  <span className="font-medium text-red-600">{selectedDistrict.complaints}</span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Fund Release</span>
                    <span className="font-medium">
                      ₹{(selectedDistrict.fundReleased / 100000).toFixed(1)}L / ₹{(selectedDistrict.totalFund / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-civic-green h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(selectedDistrict.fundReleased / selectedDistrict.totalFund) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {selectedDistrict.complaints > 0 && (
                  <Button variant="outline" size="sm" className="w-full justify-start text-red-600 border-red-200">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    View Complaints ({selectedDistrict.complaints})
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Click on a district marker to view details</p>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};