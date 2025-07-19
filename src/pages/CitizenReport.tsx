import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle,
  MapPin,
  Upload,
  Send,
  FileText,
  Camera,
  Clock,
  Shield,
  Flag
} from "lucide-react";

interface ReportFormData {
  title: string;
  category: string;
  description: string;
  location: {
    district: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  evidence: File[];
  severity: string;
  anonymous: boolean;
}

export const CitizenReport = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    category: "",
    description: "",
    location: {
      district: "",
      address: ""
    },
    evidence: [],
    severity: "medium",
    anonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportCategories = [
    { value: "fund-misuse", label: "Fund Misallocation", icon: "💰" },
    { value: "corruption", label: "Corruption/Bribery", icon: "⚠️" },
    { value: "project-delay", label: "Project Delays", icon: "⏰" },
    { value: "quality-issues", label: "Quality Concerns", icon: "🔧" },
    { value: "transparency", label: "Lack of Transparency", icon: "👁️" },
    { value: "contractor-issues", label: "Contractor Problems", icon: "🏗️" },
    { value: "other", label: "Other Issues", icon: "📝" }
  ];

  const districts = [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
    "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", 
    "South West Delhi", "West Delhi"
  ];

  const severityLevels = [
    { value: "low", label: "Low Priority", color: "text-yellow-600" },
    { value: "medium", label: "Medium Priority", color: "text-orange-600" },
    { value: "high", label: "High Priority", color: "text-red-600" },
    { value: "critical", label: "Critical/Urgent", color: "text-red-800" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      evidence: [...prev.evidence, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }
          }));
          toast({
            title: "Location Captured",
            description: "Your current location has been added to the report."
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report Submitted Successfully",
        description: "Your report has been recorded on the blockchain and assigned ID: RPT-" + Date.now().toString().slice(-6)
      });
      
      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        location: { district: "", address: "" },
        evidence: [],
        severity: "medium",
        anonymous: false
      });
      
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Flag className="w-8 h-8 mr-3 text-civic-red" />
            Submit a Report
          </h1>
          <p className="text-muted-foreground">
            Report issues related to government schemes, fund misuse, or project implementation problems.
            Your report will be securely recorded on the blockchain.
          </p>
        </motion.div>

        {/* Report Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Report Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Report Title *</Label>
                      <Input
                        id="title"
                        placeholder="Brief description of the issue"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Issue Category *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select the type of issue" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <span className="flex items-center">
                                <span className="mr-2">{cat.icon}</span>
                                {cat.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="severity">Priority Level *</Label>
                      <Select 
                        value={formData.severity} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {severityLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <span className={`font-medium ${level.color}`}>
                                {level.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Detailed Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide detailed information about the issue, including dates, amounts, people involved, etc."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Location Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <Select 
                        value={formData.location.district} 
                        onValueChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, district: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="address">Specific Address/Location</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter specific address, landmark, or location details"
                        value={formData.location.address}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, address: e.target.value }
                        }))}
                        className="min-h-[80px]"
                      />
                    </div>

                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={getCurrentLocation}
                      className="w-full"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Use Current Location
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Evidence Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Evidence & Documentation
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload photos, documents, videos, or other evidence
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="evidence-upload"
                      />
                      <Label htmlFor="evidence-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>Choose Files</span>
                        </Button>
                      </Label>
                    </div>

                    {formData.evidence.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Files:</Label>
                        {formData.evidence.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Privacy & Security
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.anonymous}
                        onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="anonymous" className="text-sm">
                        Submit anonymously
                      </Label>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-2">
                      <p>🔒 All reports are encrypted and stored on blockchain</p>
                      <p>📝 You'll receive a unique tracking ID</p>
                      <p>🔍 Auditors will review within 24-48 hours</p>
                      <p>📧 Updates sent via email (if not anonymous)</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    What Happens Next?
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-civic-blue text-white flex items-center justify-center text-xs font-bold">1</div>
                      <span>Report recorded on blockchain with unique ID</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-civic-blue text-white flex items-center justify-center text-xs font-bold">2</div>
                      <span>Assigned to relevant auditor for review</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-civic-blue text-white flex items-center justify-center text-xs font-bold">3</div>
                      <span>Investigation initiated if validated</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-civic-blue text-white flex items-center justify-center text-xs font-bold">4</div>
                      <span>Updates shared on audit dashboard</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-civic text-white py-6 text-lg"
                  disabled={isSubmitting || !formData.title || !formData.category || !formData.description || !formData.location.district}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};