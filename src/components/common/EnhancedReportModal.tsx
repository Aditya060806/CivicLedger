import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  Shield
} from "lucide-react";

const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  priority: z.string().min(1, "Please select priority level"),
  location: z.string().optional(),
  media: z.array(z.any()).optional(),
});

type ReportForm = z.infer<typeof reportSchema>;

interface EnhancedReportModalProps {
  trigger: React.ReactNode;
}

export const EnhancedReportModal = ({ trigger }: EnhancedReportModalProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "",
      location: "",
      media: [],
    },
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

  const analyzeWithAI = async (text: string) => {
    setAiAnalyzing(true);
    // Simulate AI analysis
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
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const onSubmit = async (data: ReportForm) => {
    try {
      // Simulate smart contract logging
      toast({
        title: "Report Submitted Successfully!",
        description: "Your report has been logged to the blockchain and assigned ID: #REP-2024-001",
      });
      
      setOpen(false);
      form.reset();
      setStep(1);
      setUploadedFiles([]);
      setAiSuggestion(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the issue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed information about the issue"
                      className="min-h-[120px]"
                      {...field}
                      onBlur={() => {
                        if (field.value.length > 20) {
                          analyzeWithAI(field.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {aiAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-civic-blue/10 rounded-lg"
              >
                <Bot className="w-4 h-4 text-civic-blue animate-pulse" />
                <span className="text-sm">AI analyzing your report...</span>
              </motion.div>
            )}

            {aiSuggestion && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-civic-green/10 border border-civic-green/20 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Bot className="w-4 h-4 text-civic-green mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-civic-green">AI Suggestion</p>
                    <p className="text-sm text-muted-foreground">{aiSuggestion}</p>
                  </div>
                </div>
              </motion.div>
            )}
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
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                            <span>{priority.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Enter location or address" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <label className="text-sm font-medium mb-2 block">Attach Evidence</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop files here or click to upload
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-1" />
                      Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mic className="w-4 h-4 mr-1" />
                      Audio
                    </Button>
                    <input
                      type="file"
                      multiple
                      accept="image/*,audio/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
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
                  </div>
                ))}
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
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden mobile-optimized enhanced-blur border-civic-blue/20 shadow-modal">
        <div className="bg-gradient-trust text-foreground p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-civic-blue/10 via-civic-mint/5 to-civic-green/10"></div>
          <div className="relative z-10">
            <DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DialogTitle className="text-2xl font-bold text-civic-blue flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-civic rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  Submit Issue Report
                </DialogTitle>
                <DialogDescription className="text-civic-slate mt-2">
                  Help improve governance by reporting issues transparently on the blockchain
                </DialogDescription>
              </motion.div>
            </DialogHeader>
            
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-between text-sm text-civic-slate">
                <span className="font-medium">Step {step} of 3</span>
                <span className="font-medium">{Math.round((step / 3) * 100)}% Complete</span>
              </div>
              <div className="mt-3 h-2 bg-civic-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-civic rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              
              <div className="flex gap-2 ml-auto">
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="bg-gradient-civic"
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="bg-gradient-civic">
                    <Zap className="w-4 h-4 mr-2" />
                    Submit to Blockchain
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};