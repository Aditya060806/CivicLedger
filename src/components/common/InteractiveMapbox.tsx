import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Layers,
  Search,
  Filter,
  TrendingUp,
  Users,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface RegionData {
  id: string;
  name: string;
  center: [number, number];
  policies: number;
  activePolicies: number;
  totalFunds: number;
  releasedFunds: number;
  beneficiaries: number;
  complaints: number;
  transparencyScore: number;
  status: "excellent" | "good" | "needs-attention" | "critical";
}

export const InteractiveMapbox = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Mock regional data
  const regions: RegionData[] = [
    {
      id: "delhi",
      name: "Delhi",
      center: [77.2090, 28.6139],
      policies: 156,
      activePolicies: 142,
      totalFunds: 25000000,
      releasedFunds: 21750000,
      beneficiaries: 12450,
      complaints: 8,
      transparencyScore: 98.2,
      status: "excellent"
    },
    {
      id: "mumbai",
      name: "Mumbai",
      center: [72.8777, 19.0760],
      policies: 203,
      activePolicies: 185,
      totalFunds: 45000000,
      releasedFunds: 38250000,
      beneficiaries: 28750,
      complaints: 15,
      transparencyScore: 95.8,
      status: "excellent"
    },
    {
      id: "bangalore",
      name: "Bangalore",
      center: [77.5946, 12.9716],
      policies: 178,
      activePolicies: 162,
      totalFunds: 32000000,
      releasedFunds: 26400000,
      beneficiaries: 19200,
      complaints: 12,
      transparencyScore: 94.5,
      status: "good"
    },
    {
      id: "kolkata",
      name: "Kolkata", 
      center: [88.3639, 22.5726],
      policies: 134,
      activePolicies: 118,
      totalFunds: 22000000,
      releasedFunds: 17600000,
      beneficiaries: 15600,
      complaints: 22,
      transparencyScore: 87.3,
      status: "needs-attention"
    },
    {
      id: "chennai",
      name: "Chennai",
      center: [80.2707, 13.0827],
      policies: 165,
      activePolicies: 149,
      totalFunds: 28000000,
      releasedFunds: 23800000,
      beneficiaries: 21350,
      complaints: 18,
      transparencyScore: 91.7,
      status: "good"
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: "bg-green-100 text-green-800 border-green-200",
      good: "bg-blue-100 text-blue-800 border-blue-200", 
      "needs-attention": "bg-yellow-100 text-yellow-800 border-yellow-200",
      critical: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[status as keyof typeof colors] || colors.good;
  };

  const getStatusIcon = (status: string) => {
    if (status === "excellent" || status === "good") return <CheckCircle className="w-4 h-4" />;
    if (status === "needs-attention") return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const initializeMap = async (token: string) => {
    if (!mapContainer.current) return;

    try {
      // Use dynamic import for mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      
      mapboxgl.default.accessToken = token;
      
      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [78.9629, 20.5937], // Center of India
        zoom: 4.5,
        projection: 'mercator'
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Add region markers
      map.current.on('load', () => {
        regions.forEach((region) => {
          const el = document.createElement('div');
          el.className = 'region-marker';
          el.style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 12px;
            transition: all 0.3s ease;
            background: ${
              region.status === 'excellent' ? 'linear-gradient(135deg, #10b981, #059669)' :
              region.status === 'good' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
              region.status === 'needs-attention' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
              'linear-gradient(135deg, #ef4444, #dc2626)'
            };
          `;
          
          el.innerHTML = region.policies.toString();
          
          el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.2)';
            el.style.zIndex = '1000';
          });
          
          el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)';
            el.style.zIndex = '1';
          });

          el.addEventListener('click', () => {
            setSelectedRegion(region);
            map.current?.flyTo({
              center: region.center,
              zoom: 8,
              duration: 2000
            });
          });

          new mapboxgl.default.Marker(el)
            .setLngLat(region.center)
            .addTo(map.current);
        });
      });

      setShowTokenInput(false);
      toast({
        title: "Map loaded successfully! 🗺️",
        description: "Interactive policy visualization is now active"
      });

    } catch (error) {
      console.error('Error loading map:', error);
      toast({
        title: "Map loading failed",
        description: "Please check your Mapbox token and try again",
        variant: "destructive"
      });
    }
  };

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast({
        title: "Token required",
        description: "Please enter your Mapbox public token",
        variant: "destructive"
      });
      return;
    }
    initializeMap(mapboxToken);
  };

  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showTokenInput) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Interactive Policy Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Mapbox Token Required</h4>
                <p className="text-sm text-blue-700 mt-1">
                  To use the interactive map, please enter your Mapbox public token. 
                  You can get one for free at{" "}
                  <a 
                    href="https://account.mapbox.com/access-tokens/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    mapbox.com
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Enter your Mapbox public token (pk.xxx...)"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
            />
            <Button onClick={handleTokenSubmit} className="w-full">
              Load Interactive Map
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Map Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="interactive-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-civic-blue">
                <div className="w-10 h-10 bg-gradient-civic rounded-xl flex items-center justify-center shadow-glow">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Policy Rollout Visualization
                <Badge className="bg-civic-green/10 text-civic-green border-civic-green/20">
                  Live Data
                </Badge>
              </CardTitle>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-civic-slate" />
                  <Input
                    placeholder="Search regions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-56 border-civic-blue/20 focus:border-civic-blue transition-colors"
                  />
                </div>
                <Button variant="outline" size="icon" className="border-civic-blue/20 hover:border-civic-blue hover:bg-civic-blue/5">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-civic-blue/20 hover:border-civic-blue hover:bg-civic-blue/5">
                  <Layers className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enhanced Map Container */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="h-[500px] overflow-hidden interactive-card map-glow">
            <div className="relative">
              <div ref={mapContainer} className="w-full h-full" />
              {/* Map Legend */}
              <div className="absolute top-4 left-4 bg-civic-white/95 backdrop-blur-md rounded-xl p-4 shadow-glass border border-civic-blue/20">
                <h4 className="text-sm font-semibold text-civic-blue mb-3">Policy Status</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-civic-green to-civic-green-light"></div>
                    <span>Excellent (90%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-civic-blue to-civic-blue-light"></div>
                    <span>Good (70-89%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-civic-gold to-civic-orange"></div>
                    <span>Needs Attention</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-civic-red to-civic-pink"></div>
                    <span>Critical</span>
                  </div>
                </div>
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 bg-civic-white/95 backdrop-blur-md rounded-xl shadow-glass border border-civic-blue/20 overflow-hidden">
                <Button variant="ghost" size="sm" className="w-10 h-10 rounded-none">
                  +
                </Button>
                <div className="border-t border-civic-blue/20"></div>
                <Button variant="ghost" size="sm" className="w-10 h-10 rounded-none">
                  -
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Region Info Panel */}
        <div className="space-y-4">
          {/* Selected Region Details */}
          {selectedRegion ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {selectedRegion.name}
                    </CardTitle>
                    <Badge className={getStatusColor(selectedRegion.status)} variant="outline">
                      {getStatusIcon(selectedRegion.status)}
                      <span className="ml-1 capitalize">{selectedRegion.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Total Policies</div>
                      <div className="font-semibold text-lg">{selectedRegion.policies}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Active</div>
                      <div className="font-semibold text-lg text-civic-green">{selectedRegion.activePolicies}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Beneficiaries</div>
                      <div className="font-semibold text-lg">{selectedRegion.beneficiaries.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Complaints</div>
                      <div className="font-semibold text-lg text-red-600">{selectedRegion.complaints}</div>
                    </div>
                  </div>

                  {/* Fund Utilization */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fund Utilization</span>
                      <span className="font-medium">
                        {Math.round((selectedRegion.releasedFunds / selectedRegion.totalFunds) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-civic-green h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(selectedRegion.releasedFunds / selectedRegion.totalFunds) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ₹{(selectedRegion.releasedFunds / 10000000).toFixed(1)}Cr of ₹{(selectedRegion.totalFunds / 10000000).toFixed(1)}Cr released
                    </div>
                  </div>

                  {/* Transparency Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transparency Score</span>
                      <span className="font-medium">{selectedRegion.transparencyScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-civic-blue h-2 rounded-full transition-all duration-500"
                        style={{ width: `${selectedRegion.transparencyScore}%` }}
                      />
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    View Regional Dashboard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Click on a region marker to view detailed information</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">National Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-civic-green" />
                  Total Policies
                </span>
                <span className="font-semibold">{regions.reduce((sum, r) => sum + r.policies, 0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-civic-blue" />
                  Beneficiaries
                </span>
                <span className="font-semibold">{regions.reduce((sum, r) => sum + r.beneficiaries, 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-civic-gold" />
                  Funds Released
                </span>
                <span className="font-semibold">₹{(regions.reduce((sum, r) => sum + r.releasedFunds, 0) / 10000000).toFixed(1)}Cr</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Total Complaints
                </span>
                <span className="font-semibold text-red-600">{regions.reduce((sum, r) => sum + r.complaints, 0)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Regions List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Regions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-60 overflow-y-auto">
              {filteredRegions.map((region) => (
                <div
                  key={region.id}
                  className={`p-2 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedRegion?.id === region.id ? 'bg-civic-blue/10 border border-civic-blue/30' : ''
                  }`}
                  onClick={() => {
                    setSelectedRegion(region);
                    map.current?.flyTo({
                      center: region.center,
                      zoom: 8,
                      duration: 2000
                    });
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{region.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {region.activePolicies}/{region.policies} policies active
                      </div>
                    </div>
                    <Badge className={getStatusColor(region.status)} variant="outline">
                      {region.transparencyScore}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};