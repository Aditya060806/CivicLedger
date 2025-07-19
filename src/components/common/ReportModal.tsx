import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Flag, 
  MapPin, 
  Upload, 
  Send, 
  Camera, 
  FileText,
  Loader2,
  CheckCircle,
  X
} from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const ReportModal = ({ isOpen, onClose }: ReportModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reportId, setReportId] = useState("");

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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate IPFS/blockchain submission
    setTimeout(() => {
      const id = "RPT-" + Date.now().toString().slice(-6);
      setReportId(id);
      setIsSuccess(true);
      setIsSubmitting(false);
      
      toast({
        title: "Report Submitted Successfully",
        description: `Your report has been recorded on the blockchain with ID: ${id}`
      });
    }, 3000);
  };

  const resetForm = () => {
    setStep(1);
    setIsSuccess(false);
    setIsSubmitting(false);
    setReportId("");
    setFormData({
      title: "",
      category: "",
      description: "",
      location: { district: "", address: "" },
      evidence: [],
      severity: "medium",
      anonymous: false
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.category && formData.description;
      case 2:
        return formData.location.district;
      case 3:
        return true; // Evidence is optional
      default:
        return false;
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl glassmorphism border-civic-blue/20 shadow-modal">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Flag className="w-6 h-6 mr-2 text-civic-red" />
              Report Issue to Blockchain
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={step}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6 py-6"
              >
                {/* Progress Indicator */}
                <div className="flex items-center space-x-2 mb-6">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        stepNumber === step 
                          ? "bg-civic-blue text-white" 
                          : stepNumber < step 
                            ? "bg-civic-green text-white" 
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {stepNumber < step ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div className={`w-12 h-0.5 mx-2 transition-colors ${
                          stepNumber < step ? "bg-civic-green" : "bg-muted"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Report Details */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Report Title *</Label>
                      <Input
                        id="title"
                        placeholder="Brief description of the issue"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <MapPin className="w-5 h-5 text-civic-blue" />
                      <h3 className="text-lg font-medium">Location Information</h3>
                    </div>

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
                )}

                {/* Step 3: Evidence & Privacy */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* Evidence Upload */}
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Camera className="w-5 h-5 text-civic-blue" />
                        <h3 className="text-lg font-medium">Evidence & Documentation</h3>
                      </div>

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
                        <div className="space-y-2 mt-4">
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
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Privacy Settings */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="anonymous" className="text-sm font-medium">
                            Submit Anonymously
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Your identity will be hidden from public view
                          </p>
                        </div>
                        <Switch
                          id="anonymous"
                          checked={formData.anonymous}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
                    disabled={isSubmitting}
                  >
                    {step > 1 ? "Previous" : "Cancel"}
                  </Button>

                  {step < 3 ? (
                    <Button 
                      onClick={() => setStep(step + 1)}
                      disabled={!isStepValid()}
                      className="bg-civic-blue hover:bg-civic-blue/90"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting || !isStepValid()}
                      className="bg-gradient-civic hover:bg-gradient-civic-alt"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting to IPFS...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-civic-green rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-2">Report Submitted Successfully!</h3>
                <p className="text-muted-foreground mb-4">
                  Your report has been recorded on the blockchain
                </p>
                
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <p className="text-sm font-medium mb-1">Report ID:</p>
                  <code className="text-civic-blue font-mono">{reportId}</code>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <p>✓ Encrypted and stored on IPFS</p>
                  <p>✓ Smart contract execution triggered</p>
                  <p>✓ Assigned to relevant auditor</p>
                  <p>✓ You'll receive updates via email</p>
                </div>
                
                <Button onClick={handleClose} className="w-full">
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};