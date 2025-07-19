import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/common/GlassCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { SuccessAnimation } from "@/components/common/SuccessAnimation";
import { GroundTruthToggle } from "@/components/common/GroundTruthToggle";
import { TimelineProgress } from "@/components/common/TimelineProgress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload,
  QrCode,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Camera,
  MapPin,
  User,
  Phone,
  Mail,
  IdCard,
  Send,
  Eye,
  Calendar,
  MessageSquare,
  Users,
  Heart,
  Award,
  TrendingUp,
  Activity,
  Target
} from "lucide-react";

interface Complaint {
  id: string;
  schemeName: string;
  issueType: string;
  description: string;
  status: "pending" | "under-review" | "approved" | "rejected";
  submittedDate: string;
  images: string[];
  hasQR: boolean;
  district: string;
}

export const CitizenPortal = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"apply" | "complaint" | "track">("complaint");
  const [showSuccess, setShowSuccess] = useState(false);
  const [groundTruthEnabled, setGroundTruthEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Enhanced citizen portal stats
  const citizenStats = [
    { icon: FileText, label: "Available Schemes", value: "24", change: "+3", color: "civic-blue" },
    { icon: MessageSquare, label: "My Applications", value: "5", change: "+2", color: "civic-green" },
    { icon: Heart, label: "Community Impact", value: "89%", change: "+7%", color: "civic-pink" },
    { icon: Award, label: "Benefits Received", value: "₹45K", change: "+12K", color: "civic-gold" }
  ];

  const [complaintForm, setComplaintForm] = useState({
    schemeName: "",
    issueType: "",
    description: "",
    images: [] as File[],
    hasQR: false
  });

  const [kyc] = useState({
    name: "Rahul Kumar",
    aadhaar: "****-****-1234",
    phone: "+91-98765-43210",
    email: "rahul.kumar@email.com",
    verified: true
  });

  // Mock complaint data
  const complaints: Complaint[] = [
    {
      id: "C001",
      schemeName: "PM Awas Yojana - Phase 3",
      issueType: "Fund Delay",
      description: "Eligible beneficiary but funds not released after 6 months",
      status: "under-review",
      submittedDate: "2024-01-15",
      images: ["receipt.jpg", "eligibility.pdf"],
      hasQR: true,
      district: "North Delhi"
    },
    {
      id: "C002", 
      schemeName: "Mid Day Meal Program",
      issueType: "Quality Issue",
      description: "Poor quality food being served at local school",
      status: "approved",
      submittedDate: "2024-01-10",
      images: ["food_sample.jpg"],
      hasQR: false,
      district: "South Delhi"
    }
  ];

  const issueTypes = [
    "Fund Delay",
    "Quality Issue", 
    "Eligibility Problem",
    "Contractor Negligence",
    "Corruption",
    "Documentation Issue",
    "Other"
  ];

  const schemes = [
    "PM Awas Yojana - Phase 3",
    "Mid Day Meal Program",
    "Digital Literacy Campaign", 
    "Rural Road Development",
    "Healthcare Accessibility",
    "Education Infrastructure"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setComplaintForm(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // Max 5 images
    }));
  };

  const handleSubmitComplaint = () => {
    if (!complaintForm.schemeName || !complaintForm.issueType || !complaintForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setShowSuccess(true);
    
    // Reset form
    setComplaintForm({
      schemeName: "",
      issueType: "",
      description: "",
      images: [],
      hasQR: false
    });
  };

  const handleQRScan = () => {
    setComplaintForm(prev => ({ ...prev, hasQR: true }));
    toast({
      title: "QR Code Scanned",
      description: "Location and timestamp verified",
    });
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
          <h1 className="text-3xl font-bold mb-2">Citizen Portal</h1>
          <p className="text-muted-foreground">
            Apply for schemes, track applications, and report issues transparently
          </p>
        </motion.div>

        {/* KYC Status */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-civic rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{kyc.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <IdCard className="w-4 h-4 mr-1" />
                      {kyc.aadhaar}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {kyc.phone}
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {kyc.email}
                    </span>
                  </div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                KYC Verified
              </Badge>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "apply" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("apply")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Apply for Scheme
            </Button>
            <Button
              variant={activeTab === "complaint" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("complaint")}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              File Complaint
            </Button>
            <Button
              variant={activeTab === "track" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("track")}
            >
              <Eye className="w-4 h-4 mr-2" />
              Track Status
            </Button>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "apply" && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Apply for Government Scheme</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {schemes.map((scheme, index) => (
                  <motion.div
                    key={scheme}
                    className="border rounded-xl p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-semibold mb-2">{scheme}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Check eligibility and apply directly through the smart contract system
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">Open for Applications</Badge>
                      <Button size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {activeTab === "complaint" && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">File a Complaint</h2>
              <div className="space-y-6">
                {/* Scheme Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Scheme Name *</label>
                  <select
                    className="w-full p-3 border rounded-lg bg-background"
                    value={complaintForm.schemeName}
                    onChange={(e) => setComplaintForm(prev => ({ ...prev, schemeName: e.target.value }))}
                  >
                    <option value="">Select a scheme</option>
                    {schemes.map(scheme => (
                      <option key={scheme} value={scheme}>{scheme}</option>
                    ))}
                  </select>
                </div>

                {/* Issue Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Issue Type *</label>
                  <select
                    className="w-full p-3 border rounded-lg bg-background"
                    value={complaintForm.issueType}
                    onChange={(e) => setComplaintForm(prev => ({ ...prev, issueType: e.target.value }))}
                  >
                    <option value="">Select issue type</option>
                    {issueTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    placeholder="Provide detailed description of the issue..."
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                {/* Evidence Upload */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Evidence</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload images or documents
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Max 5 files, 10MB each
                        </p>
                      </label>
                    </div>
                    {complaintForm.images.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {complaintForm.images.map((file, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-center">
                            <Camera className="w-4 h-4 mr-2" />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location Verification</label>
                    <Button
                      variant="outline"
                      className="w-full p-4 h-auto flex-col"
                      onClick={handleQRScan}
                    >
                      <QrCode className="w-8 h-8 mb-2" />
                      <span className="text-sm">Scan QR Code</span>
                      <span className="text-xs text-muted-foreground">
                        Verify location & timestamp
                      </span>
                    </Button>
                    {complaintForm.hasQR && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Location verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <AnimatedButton
                    onClick={handleSubmitComplaint}
                    variant="civic"
                    size="lg"
                    glow
                    className="w-full md:w-auto"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Complaint
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "track" && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                <GroundTruthToggle 
                  isEnabled={groundTruthEnabled} 
                  onToggle={setGroundTruthEnabled} 
                />
              </GlassCard>
              
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-6">Track Your Complaints</h2>
              <div className="space-y-4">
                {complaints.map((complaint, index) => (
                  <motion.div
                    key={complaint.id}
                    className="border rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">#{complaint.id}</h3>
                            <p className="text-sm text-muted-foreground">{complaint.schemeName}</p>
                          </div>
                          <StatusBadge status={complaint.status} />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground block">Issue Type</span>
                            <span className="font-medium">{complaint.issueType}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">District</span>
                            <span className="font-medium">{complaint.district}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Submitted</span>
                            <span className="font-medium flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(complaint.submittedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Evidence</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {complaint.images.length} files
                              </Badge>
                              {complaint.hasQR && (
                                <Badge variant="outline" className="text-xs">
                                  <QrCode className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm mt-3 text-muted-foreground">
                          {complaint.description}
                        </p>
                        
                        <div className="mt-4">
                          <TimelineProgress 
                            complaintId={complaint.id}
                            currentStep={complaint.status === "approved" ? 3 : complaint.status === "under-review" ? 1 : 0}
                          />
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}

                {complaints.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No complaints filed yet</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("complaint")}
                    >
                      File Your First Complaint
                    </Button>
                  </div>
                )}
              </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
        
        <SuccessAnimation
          isVisible={showSuccess}
          message="Your complaint has been submitted successfully and will be reviewed within 48 hours!"
          onComplete={() => setShowSuccess(false)}
        />
      </div>
    </Layout>
  );
};