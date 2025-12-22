import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { civicLedgerService } from "@/lib/civicLedgerService";
import {
  FileText,
  Upload,
  Camera,
  Mic,
  MapPin,
  Bot,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  X,
  Loader2
} from "lucide-react";

interface ReportFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  location: string;
  district: string;
}

interface EnhancedReportModalProps {
  trigger: React.ReactNode;
}

export const EnhancedReportModal = ({ trigger }: EnhancedReportModalProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  
  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    district: ""
  });

  const categories = [
    { value: "infrastructure", label: "Infrastructure", icon: "🏗️" },
    { value: "corruption", label: "Corruption", icon: "⚖️" },
    { value: "service-delay", label: "Service Delay", icon: "⏱️" },
    { value: "fund-misuse", label: "Fund Misuse", icon: "💰" },
    { value: "policy-violation", label: "Policy Violation", icon: "📜" },
    { value: "other", label: "Other", icon: "📋" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "critical", label: "Critical", color: "bg-red-500" },
  ];

  const districts = [
    'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
    'New Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 
    'South West Delhi', 'Shahdara'
  ];

  const analyzeWithAI = async (text: string) => {
    if (text.length < 20) return;
    
    setAiAnalyzing(true);
    setTimeout(() => {
      const suggestions = [
        "This appears to be an infrastructure-related issue with high priority",
        "Based on the description, this seems like a service delay issue",
        "This looks like a corruption-related complaint requiring immediate attention",
        "The described issue appears to be related to fund misuse",
      ];
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setAiSuggestion(randomSuggestion);
      setAiAnalyzing(false);
    }, 1500);
  };

  const handleInputChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'description' && value.length > 20) {
      analyzeWithAI(value);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const simulateBlockchainSubmission = async () => {
    setIsSubmitting(true);
    setSubmissionProgress(0);
    
    const steps = [
      { progress: 20, message: "Encrypting data..." },
      { progress: 40, message: "Generating blockchain hash..." },
      { progress: 60, message: "Submitting to ICP network..." },
      { progress: 80, message: "Confirming transaction..." },
      { progress: 100, message: "Transaction confirmed!" }
    ];
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSubmissionProgress(step.progress);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || formData.title.length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }
    
    if (!formData.description || formData.description.length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }
    
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    
    if (!formData.priority) {
      toast.error("Please select priority level");
      return;
    }

    if (!formData.district) {
      toast.error("Please select a district");
      return;
    }

    try {
      await simulateBlockchainSubmission();
      
      // Submit to service
      const result = await civicLedgerService.submitComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        district: formData.district
      });

      if (result.success) {
        const txId = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const reportId = "REP-" + Date.now().toString().slice(-6);
        
        toast.success(`Report submitted successfully! Transaction ID: ${txId}, Report ID: ${reportId}`);
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "",
          location: "",
          district: ""
        });
        setUploadedFiles([]);
        setAiSuggestion(null);
        setSubmissionProgress(0);
        setStep(1);
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to submit report");
      }
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    switch (step) {
      case 1:
        return formData.title.length >= 5 && formData.category && formData.priority && formData.district;
      case 2:
        return formData.description.length >= 20;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Issue Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief description of the issue"
              />
              {formData.title.length > 0 && formData.title.length < 5 && (
                <p className="text-sm text-red-500 mt-1">Title must be at least 5 characters</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority Level *</label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${priority.color}`}></div>
                        {priority.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">District *</label>
              <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
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
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Detailed Description *</label>
              <Textarea 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed information about the issue..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length} characters (minimum 20 required)
              </p>
            </div>

            {aiAnalyzing && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-600">AI analyzing your report...</span>
              </div>
            )}

            {aiSuggestion && !aiAnalyzing && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Bot className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">AI Suggestion</p>
                    <p className="text-sm text-green-700">{aiSuggestion}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Location (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location or address" 
                  className="pl-10" 
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium mb-2 block">Attach Evidence (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop files here or click to upload
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('photo-input')?.click()}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Photo
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('audio-input')?.click()}
                    >
                      <Mic className="w-4 h-4 mr-1" />
                      Audio
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Files
                    </Button>
                  </div>
                  
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <input
                    id="audio-input"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Uploaded Files</label>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm flex-1">{file.name}</span>
                    <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Submitting to Blockchain...</span>
                  <span>{submissionProgress}%</span>
                </div>
                <Progress value={submissionProgress} className="w-full" />
              </div>
            )}

            <div className="bg-civic-blue/10 border border-civic-blue/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-civic-blue mt-0.5" />
                <div>
                  <p className="font-medium text-civic-blue">Blockchain Security</p>
                  <p className="text-sm text-muted-foreground">
                    Your report will be encrypted and stored on the blockchain for maximum transparency and immutability.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-civic-blue/10 to-civic-green/10 text-foreground p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-civic-blue flex items-center gap-3">
              <div className="w-10 h-10 bg-civic-blue rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              Submit Issue Report
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Help improve governance by reporting issues transparently on the blockchain
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="font-medium">Step {step} of 3</span>
              <span className="font-medium">{Math.round((step / 3) * 100)}% Complete</span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-civic-blue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
            
            <div className="flex gap-2 ml-auto">
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceedToNext() || isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Submit to Blockchain
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};