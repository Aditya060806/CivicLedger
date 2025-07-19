import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/common/GlassCard";
import { MapPin, Settings, Layers, Search, Filter, Info } from "lucide-react";

interface PolicyImpactData {
  state: string;
  policies: number;
  funding: number;
  beneficiaries: number;
  completion: number;
  coordinates: [number, number];
}

const SAMPLE_IMPACT_DATA: PolicyImpactData[] = [
  { state: "Maharashtra", policies: 45, funding: 2500000, beneficiaries: 125000, completion: 78, coordinates: [75.7139, 19.7515] },
  { state: "Karnataka", policies: 38, funding: 1800000, beneficiaries: 98000, completion: 82, coordinates: [75.7139, 15.3173] },
  { state: "Tamil Nadu", policies: 42, funding: 2200000, beneficiaries: 115000, completion: 75, coordinates: [78.6569, 11.1271] },
  { state: "Gujarat", policies: 35, funding: 1900000, beneficiaries: 89000, completion: 85, coordinates: [71.1924, 22.2587] },
  { state: "Rajasthan", policies: 28, funding: 1500000, beneficiaries: 67000, completion: 68, coordinates: [74.2179, 27.0238] },
  { state: "Uttar Pradesh", policies: 52, funding: 3200000, beneficiaries: 180000, completion: 72, coordinates: [80.9462, 26.8467] },
  { state: "West Bengal", policies: 33, funding: 1600000, beneficiaries: 92000, completion: 79, coordinates: [87.8550, 22.9868] },
  { state: "Andhra Pradesh", policies: 29, funding: 1400000, beneficiaries: 76000, completion: 73, coordinates: [79.7400, 15.9129] }
];

interface EnhancedIndiaMapProps {
  mapboxToken?: string;
}

export const EnhancedIndiaMap = ({ mapboxToken }: EnhancedIndiaMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userToken, setUserToken] = useState(mapboxToken || "");
  const [selectedState, setSelectedState] = useState<PolicyImpactData | null>(null);
  const [filterType, setFilterType] = useState<"all" | "high" | "medium" | "low">("all");
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !userToken) return;

    mapboxgl.accessToken = userToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [78.9629, 20.5937], // Center of India
        zoom: 4.5,
        maxZoom: 10,
        minZoom: 3
      });

      map.current.on("load", () => {
        setIsMapReady(true);
        addPolicyImpactMarkers();
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    } catch (error) {
      console.error("Error initializing Mapbox:", error);
    }

    return () => {
      map.current?.remove();
    };
  }, [userToken]);

  const addPolicyImpactMarkers = () => {
    if (!map.current) return;

    SAMPLE_IMPACT_DATA.forEach((data) => {
      const completionColor = 
        data.completion >= 80 ? "#10b981" : // Green for high completion
        data.completion >= 60 ? "#f59e0b" : // Orange for medium completion
        "#ef4444"; // Red for low completion

      // Create custom marker element
      const markerElement = document.createElement("div");
      markerElement.className = "policy-impact-marker";
      markerElement.innerHTML = `
        <div style="
          width: ${Math.min(40, Math.max(20, data.policies))}px;
          height: ${Math.min(40, Math.max(20, data.policies))}px;
          background: ${completionColor};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        ">${data.policies}</div>
      `;

      markerElement.addEventListener("mouseenter", () => {
        markerElement.style.transform = "scale(1.2)";
      });

      markerElement.addEventListener("mouseleave", () => {
        markerElement.style.transform = "scale(1)";
      });

      markerElement.addEventListener("click", () => {
        setSelectedState(data);
      });

      new mapboxgl.Marker(markerElement)
        .setLngLat(data.coordinates)
        .addTo(map.current!);
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  const getFilteredData = () => {
    if (filterType === "all") return SAMPLE_IMPACT_DATA;
    if (filterType === "high") return SAMPLE_IMPACT_DATA.filter(d => d.completion >= 80);
    if (filterType === "medium") return SAMPLE_IMPACT_DATA.filter(d => d.completion >= 60 && d.completion < 80);
    return SAMPLE_IMPACT_DATA.filter(d => d.completion < 60);
  };

  if (!userToken) {
    return (
      <div className="w-full h-96 relative">
        <GlassCard className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <MapPin className="w-16 h-16 text-civic-blue mb-4" />
          <h3 className="text-xl font-bold mb-4 text-center">Interactive India Policy Impact Map</h3>
          <p className="text-muted-foreground mb-6 text-center">
            Enter your Mapbox public token to view policy impact zones across India
          </p>
          
          <div className="w-full max-w-md space-y-4">
            <Input
              placeholder="Enter Mapbox public token..."
              value={userToken}
              onChange={(e) => setUserToken(e.target.value)}
              className="text-center"
            />
            <p className="text-xs text-muted-foreground text-center">
              Get your token from{" "}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-civic-blue hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full h-96 relative overflow-hidden rounded-2xl">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <GlassCard className="p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-4 h-4 text-civic-blue" />
            <span className="text-sm font-medium">Filter by Completion</span>
          </div>
          <div className="flex space-x-1">
            {[
              { key: "all", label: "All", color: "bg-civic-blue" },
              { key: "high", label: "80%+", color: "bg-civic-green" },
              { key: "medium", label: "60-79%", color: "bg-civic-gold" },
              { key: "low", label: "<60%", color: "bg-civic-red" }
            ].map((filter) => (
              <Button
                key={filter.key}
                size="sm"
                variant={filterType === filter.key ? "default" : "outline"}
                onClick={() => setFilterType(filter.key as any)}
                className={`text-xs ${filterType === filter.key ? filter.color : ""}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-civic-blue" />
            <span className="text-sm font-medium">Legend</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-civic-green"></div>
              <span>High Performance (80%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-civic-gold"></div>
              <span>Medium Performance (60-79%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-civic-red"></div>
              <span>Needs Attention (&lt;60%)</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* State Details Panel */}
      {selectedState && (
        <motion.div
          className="absolute bottom-4 right-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <GlassCard className="p-4 w-64">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{selectedState.state}</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedState(null)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Policies</span>
                <span className="font-semibold">{selectedState.policies}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Funding</span>
                <span className="font-semibold">{formatCurrency(selectedState.funding)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Beneficiaries</span>
                <span className="font-semibold">{formatNumber(selectedState.beneficiaries)}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold">{selectedState.completion}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      selectedState.completion >= 80 ? "bg-civic-green" :
                      selectedState.completion >= 60 ? "bg-civic-gold" : "bg-civic-red"
                    }`}
                    style={{ width: `${selectedState.completion}%` }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Loading State */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-civic-blue mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading interactive map...</p>
          </div>
        </div>
      )}
    </div>
  );
};