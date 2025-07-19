import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Mic,
  MicOff,
  ThumbsUp,
  ThumbsDown,
  Upload,
  Search,
  Compass,
  AlertTriangle,
  HelpCircle,
  FileText,
  MapPin,
  BarChart3,
  ShieldCheck,
  Globe,
  Eye,
  Zap,
  Clock,
  Volume2,
  Settings,
  RotateCcw,
  Languages,
  Trash2
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "card" | "button";
  emotion?: "positive" | "neutral" | "negative" | "urgent";
  quickReplies?: string[];
  feedback?: "helpful" | "not-helpful" | null;
}

interface QuickReply {
  text: string;
  action: string;
}

interface SectionContext {
  name: string;
  description: string;
  quickReplies: QuickReply[];
}

const SECTION_CONTEXTS: Record<string, SectionContext> = {
  "/": {
    name: "Home",
    description: "Main platform overview",
    quickReplies: [
      { text: "Explore Dashboard", action: "navigate_dashboard" },
      { text: "Submit Complaint", action: "submit_complaint" },
      { text: "Track My Application", action: "track_application" },
      { text: "Learn About Platform", action: "platform_info" }
    ]
  },
  "/dashboard": {
    name: "Dashboard",
    description: "Analytics and system overview",
    quickReplies: [
      { text: "Explain this chart", action: "explain_chart" },
      { text: "Show fund allocation", action: "fund_allocation" },
      { text: "Latest updates", action: "latest_updates" },
      { text: "Export data", action: "export_data" }
    ]
  },
  "/citizen": {
    name: "Citizen Portal",
    description: "Citizen services and tracking",
    quickReplies: [
      { text: "Where's my local representative spending funds?", action: "local_rep_funds" },
      { text: "Track my scheme application", action: "track_scheme" },
      { text: "File anonymous alert", action: "anonymous_alert" },
      { text: "Check scheme eligibility", action: "scheme_eligibility" }
    ]
  },
  "/voting": {
    name: "DAO Voting",
    description: "Decentralized governance voting",
    quickReplies: [
      { text: "Current voting proposals", action: "current_proposals" },
      { text: "How to vote", action: "voting_help" },
      { text: "My voting history", action: "voting_history" },
      { text: "Proposal guidelines", action: "proposal_guidelines" }
    ]
  },
  "/policy-maker": {
    name: "Policy Maker",
    description: "Policy creation and management",
    quickReplies: [
      { text: "Create new policy", action: "create_policy" },
      { text: "Policy performance metrics", action: "policy_metrics" },
      { text: "Budget allocation", action: "budget_allocation" },
      { text: "Citizen feedback", action: "citizen_feedback" }
    ]
  },
  "/auditor": {
    name: "Auditor Panel",
    description: "Audit reports and transparency",
    quickReplies: [
      { text: "Any corrupt fund red flags?", action: "corruption_alerts" },
      { text: "Generate audit report", action: "audit_report" },
      { text: "Compliance status", action: "compliance_status" },
      { text: "Risk assessment", action: "risk_assessment" }
    ]
  },
  "/contractor": {
    name: "Contractor View",
    description: "Contract management and execution",
    quickReplies: [
      { text: "Project status", action: "project_status" },
      { text: "Payment schedule", action: "payment_schedule" },
      { text: "Upload documents", action: "upload_docs" },
      { text: "Quality metrics", action: "quality_metrics" }
    ]
  }
};

// Enhanced Civic Icon with dove and shield elements
const CivicIcon = () => (
  <motion.div
    className="relative w-8 h-8 flex items-center justify-center"
    whileHover={{ 
      rotate: [0, 15, -15, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{ 
      duration: 0.6,
      ease: "easeInOut"
    }}
  >
    <svg
      viewBox="0 0 32 32"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield base */}
      <motion.path
        d="M16 3L10 6V14C10 19 13 23 16 25C19 23 22 19 22 14V6L16 3Z"
        fill="url(#shieldGradient)"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Dove element */}
      <motion.path
        d="M12 12C12 12 14 10 16 12C18 10 20 12 20 12C20 14 18 16 16 15C14 16 12 14 12 12Z"
        fill="white"
        animate={{ 
          y: [0, -1, 0],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Circuit pattern for tech */}
      <motion.circle
        cx="16"
        cy="16"
        r="10"
        stroke="url(#circuitGradient)"
        strokeWidth="0.5"
        fill="none"
        strokeDasharray="2 2"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--civic-gold))" />
          <stop offset="100%" stopColor="hsl(var(--civic-blue))" />
        </linearGradient>
        <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--civic-blue) / 0.3)" />
          <stop offset="100%" stopColor="hsl(var(--civic-gold) / 0.3)" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

export const CivicChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false);
  const [userContext, setUserContext] = useState<any>({});
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [showSettings, setShowSettings] = useState(false);
  const [faqSuggestions, setFaqSuggestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const { toast } = useToast();
  
  const currentSection = SECTION_CONTEXTS[location.pathname] || SECTION_CONTEXTS["/"];

  // FAQ suggestions based on input
  const FAQ_BANK = [
    "How to track fund allocation?",
    "Where can I submit complaints?",
    "What are the current voting proposals?",
    "How to check scheme eligibility?",
    "How to file anonymous alerts?",
    "What is the project status?",
    "How to view audit reports?",
    "Where to find policy details?"
  ];

  // Clear chat functionality
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('civic-chat-history');
    toast({
      title: "Chat cleared",
      description: "All messages have been removed."
    });
  };

  // Language toggle
  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en");
    toast({
      title: language === "en" ? "Language switched to Hindi" : "भाषा अंग्रेजी में बदली गई",
      description: language === "en" ? "Now responding in Hindi" : "Now responding in English"
    });
  };

  const detectEmotion = (text: string): Message['emotion'] => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('urgent') || lowerText.includes('emergency') || lowerText.includes('immediate')) {
      return "urgent";
    }
    if (lowerText.includes('thank') || lowerText.includes('great') || lowerText.includes('good')) {
      return "positive";
    }
    if (lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('wrong')) {
      return "negative";
    }
    return "neutral";
  };

  const generateContextualResponse = (userMessage: string): { content: string; quickReplies: string[] } => {
    const message = userMessage.toLowerCase();
    const section = currentSection.name.toLowerCase();
    
    // Section-aware responses
    const responses: Record<string, any> = {
      "fund_allocation": {
        content: `Based on the ${section} data, here's the current fund allocation: ₹2.5Cr total tracked with 98.2% transparency. In this section, you can see real-time fund movements and allocation patterns. Would you like me to break down specific schemes?`,
        quickReplies: ["Show scheme breakdown", "Track fund usage", "Export fund report", "Set up alerts"]
      },
      "corruption_alerts": {
        content: "🚨 Current monitoring shows: 2 yellow flags for delayed disbursements, 0 red flags for corruption. All transactions are blockchain-verified. The AI has flagged unusual patterns in the Rural Development scheme for review.",
        quickReplies: ["View flagged transactions", "Set up monitoring", "Generate risk report", "Contact auditor"]
      },
      "local_rep_funds": {
        content: "Your local representative's fund allocation: Education (₹45L), Healthcare (₹32L), Infrastructure (₹67L). All expenditures are tracked in real-time. Recent activity includes school renovation and road repair projects.",
        quickReplies: ["View detailed breakdown", "Track project progress", "Submit feedback", "Compare with other areas"]
      },
      "anonymous_alert": {
        content: "You can file anonymous alerts securely through our blockchain-based system. Your identity is protected while maintaining audit trails. What type of issue would you like to report?",
        quickReplies: ["Corruption report", "Service quality issue", "Fund misuse", "Policy violation"]
      },
      "policy_breakdown": {
        content: "I'll break down complex policies into simple, actionable terms. Which policy would you like me to explain? I can provide citizen impact, timeline, and how to participate.",
        quickReplies: ["PM Awas Yojana", "Digital India", "Swachh Bharat", "Jan Aushadhi"]
      }
    };

    // Match user intent
    if (message.includes('fund') || message.includes('money') || message.includes('allocation')) {
      return responses.fund_allocation;
    }
    if (message.includes('corrupt') || message.includes('red flag') || message.includes('fraud')) {
      return responses.corruption_alerts;
    }
    if (message.includes('local') || message.includes('representative') || message.includes('spending')) {
      return responses.local_rep_funds;
    }
    if (message.includes('anonymous') || message.includes('alert') || message.includes('complaint')) {
      return responses.anonymous_alert;
    }
    if (message.includes('policy') || message.includes('simple') || message.includes('explain')) {
      return responses.policy_breakdown;
    }

    // Default contextual response
    return {
      content: `I'm here to help with ${section} related queries. I can provide real-time information, track your applications, explain policies, and help you navigate civic services. What specific assistance do you need?`,
      quickReplies: currentSection.quickReplies.map(qr => qr.text)
    };
  };

  const handleSendMessage = useCallback((message?: string) => {
    const messageText = message || inputValue;
    if (!messageText.trim()) return;

    const emotion = detectEmotion(messageText);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      emotion
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Enhanced response with memory and context
    setUserContext(prev => ({
      ...prev,
      lastQuery: messageText,
      section: currentSection.name,
      emotion,
      timestamp: new Date()
    }));

    setTimeout(() => {
      const { content, quickReplies } = generateContextualResponse(messageText);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
        emotion: emotion === "urgent" ? "urgent" : "neutral",
        quickReplies
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // Variable response time for naturalness
  }, [inputValue, currentSection]);

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    handleSendMessage(reply);
  };

  const handleFeedback = (messageId: string, feedback: "helpful" | "not-helpful") => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
    
    toast({
      title: feedback === "helpful" ? "Thank you!" : "Feedback received",
      description: feedback === "helpful" 
        ? "Your feedback helps me improve." 
        : "I'll work on providing better responses."
    });
  };

  const startVoiceInput = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Load persisted chat history
  useEffect(() => {
    const savedMessages = localStorage.getItem('civic-chat-history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        return;
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }

    // Initialize with greeting based on time and section
    const hour = new Date().getHours();
    let greeting = language === "hi" ? "नमस्ते" : "Good morning";
    if (hour >= 12 && hour < 18) greeting = language === "hi" ? "नमस्ते" : "Good afternoon";
    if (hour >= 18) greeting = language === "hi" ? "शुभ संध्या" : "Good evening";
    
    const initialMessage: Message = {
      id: "1",
      content: language === "hi" 
        ? `${greeting}! मैं CivicSense हूं, आपका नागरिक साथी। मैं देख रहा हूं कि आप ${currentSection.name} में हैं। मैं आपकी कैसे सहायता कर सकता हूं?`
        : `${greeting}! I'm CivicSense, your Civic Companion. I see you're in the ${currentSection.name}. ${currentSection.description}. How can I assist you today?`,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
      emotion: "positive",
      quickReplies: currentSection.quickReplies.map(qr => qr.text)
    };
    
    setMessages([initialMessage]);
  }, [location.pathname, language]);

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('civic-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // FAQ suggestions based on input
  useEffect(() => {
    if (inputValue.length > 2) {
      const suggestions = FAQ_BANK.filter(faq => 
        faq.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 3);
      setFaqSuggestions(suggestions);
    } else {
      setFaqSuggestions([]);
    }
  }, [inputValue]);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        recognition.current = new SpeechRecognitionConstructor();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = language === "hi" ? "hi-IN" : "en-US";

        recognition.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        };

        recognition.current.onerror = () => {
          setIsListening(false);
          toast({
            title: "Voice input error",
            description: "Please try again or use text input.",
            variant: "destructive"
          });
        };
      }
    }
  }, [handleSendMessage, language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if (e.ctrlKey && e.key === 'Enter' && isOpen && inputValue.trim()) {
        handleSendMessage();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isOpen, inputValue, handleSendMessage]);

  // Idle detection
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    
    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsIdle(true);
        if (isOpen && !isMinimized) {
          setIsMinimized(true);
        }
      }, 120000); // 2 minutes
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keypress', resetIdleTimer);
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keypress', resetIdleTimer);
    };
  }, [isOpen, isMinimized]);

  // Floating button when closed
  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-16 h-16 p-0 overflow-hidden relative glassmorphic-enhanced"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--civic-gold)) 0%, hsl(var(--civic-blue)) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: `
                0 20px 40px hsl(var(--civic-gold) / 0.3),
                0 0 30px hsl(var(--civic-blue) / 0.2),
                inset 0 1px 2px hsl(var(--civic-white) / 0.3)
              `
            }}
            title="Ask your Civic Companion (Ctrl+Shift+C)"
            role="button"
            aria-label="Open CivicSense AI Assistant"
          >
            {/* Animated background pulse */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <CivicIcon />
            
            {/* Online indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2"
              style={{
                background: 'hsl(var(--civic-success))',
                borderColor: 'hsl(var(--civic-white))'
              }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full"
                style={{ background: 'hsl(var(--civic-white))' }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: isMinimized ? 60 : "auto"
      }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[60] rounded-2xl shadow-2xl overflow-hidden w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] neomorphic"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        background: 'hsl(var(--civic-white) / 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid hsl(var(--civic-gold) / 0.2)',
        boxShadow: `
          0 25px 50px hsl(var(--civic-slate) / 0.25),
          0 0 50px hsl(var(--civic-gold) / 0.1),
          inset 0 1px 2px hsl(var(--civic-white) / 0.3)
        `
      }}
      role="dialog"
      aria-label="CivicSense AI Assistant"
      aria-expanded={!isMinimized}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-move"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--civic-gold)) 0%, hsl(var(--civic-blue)) 100%)',
          color: 'hsl(var(--civic-white))'
        }}
        onMouseDown={handleDragStart}
        role="banner"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-xl flex items-center justify-center relative backdrop-blur-sm"
            style={{ background: 'hsl(var(--civic-white) / 0.2)' }}
            animate={{ 
              boxShadow: isTyping 
                ? ['0 0 0 0 hsl(var(--civic-white) / 0.4)', '0 0 0 10px hsl(var(--civic-white) / 0)']
                : '0 0 0 0 hsl(var(--civic-white) / 0)'
            }}
            transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
          >
            <CivicIcon />
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm">CivicSense</h3>
            <p className="text-xs opacity-90 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(var(--civic-success))' }} />
              {currentSection.name} • Ready to help
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="hover:bg-civic-white/20 w-8 h-8 p-0"
            style={{ color: 'hsl(var(--civic-white))' }}
            title="Toggle Language"
            aria-label={`Switch to ${language === "en" ? "Hindi" : "English"}`}
          >
            <Languages className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="hover:bg-civic-white/20 w-8 h-8 p-0"
            style={{ color: 'hsl(var(--civic-white))' }}
            title="Clear Chat"
            aria-label="Clear all messages"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-civic-white/20 w-8 h-8 p-0"
            style={{ color: 'hsl(var(--civic-white))' }}
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="hover:bg-civic-white/20 w-8 h-8 p-0"
            style={{ color: 'hsl(var(--civic-white))' }}
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col h-[500px]"
          >
            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-4" role="log" aria-live="polite" aria-label="Chat messages">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="w-8 h-8 border-2" style={{ borderColor: 'hsl(var(--civic-gold) / 0.3)' }}>
                        <AvatarFallback className={`text-xs ${
                          message.sender === "user" 
                            ? "text-civic-blue" 
                            : "text-civic-gold"
                        }`} style={{
                          background: message.sender === "user" 
                            ? 'hsl(var(--civic-blue) / 0.1)' 
                            : 'hsl(var(--civic-gold) / 0.1)'
                        }}>
                          {message.sender === "user" ? <User className="w-4 h-4" /> : <CivicIcon />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2">
                        <div
                          className={`p-3 rounded-xl text-sm leading-relaxed backdrop-blur-sm ${
                            message.sender === "user"
                              ? "rounded-tr-sm"
                              : "border rounded-tl-sm"
                          }`}
                          style={{
                            background: message.sender === "user" 
                              ? 'hsl(var(--civic-blue) / 0.9)'
                              : 'hsl(var(--civic-white) / 0.7)',
                            borderColor: message.sender === "user" 
                              ? 'transparent'
                              : 'hsl(var(--civic-gold) / 0.2)',
                            boxShadow: message.sender === "user" 
                              ? '0 4px 12px hsl(var(--civic-blue) / 0.3)'
                              : '0 4px 12px hsl(var(--civic-slate) / 0.1)',
                            color: message.sender === "user" 
                              ? 'hsl(var(--civic-white))'
                              : 'hsl(var(--foreground))'
                          }}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            
                            {message.emotion && message.emotion !== "neutral" && (
                              <Badge 
                                variant="secondary" 
                                className={`text-xs px-2 py-0 h-4 ${
                                  message.emotion === "urgent" ? "text-civic-error" :
                                  message.emotion === "positive" ? "text-civic-success" :
                                  "text-civic-warning"
                                }`}
                                style={{
                                  background: message.emotion === "urgent" ? 'hsl(var(--civic-error) / 0.1)' :
                                  message.emotion === "positive" ? 'hsl(var(--civic-success) / 0.1)' :
                                  'hsl(var(--civic-warning) / 0.1)'
                                }}
                              >
                                {message.emotion === "urgent" ? "🚨" : 
                                 message.emotion === "positive" ? "😊" : "😐"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Quick replies */}
                        {message.quickReplies && message.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {message.quickReplies.map((reply, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(reply)}
                                className="text-xs h-7 px-3 hover:opacity-80"
                                style={{
                                  borderColor: 'hsl(var(--civic-primary) / 0.3)',
                                  background: 'hsl(var(--civic-primary) / 0.05)'
                                }}
                              >
                                {reply}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        {/* Feedback buttons for AI messages */}
                        {message.sender === "ai" && !message.feedback && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(message.id, "helpful")}
                              className="h-6 w-6 p-0"
                              style={{ 
                                color: 'hsl(var(--civic-success))',
                                background: 'transparent' 
                              }}
                              title="Was this helpful?"
                              aria-label="Mark as helpful"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(message.id, "not-helpful")}
                              className="h-6 w-6 p-0"
                              style={{ 
                                color: 'hsl(var(--civic-error))',
                                background: 'transparent' 
                              }}
                              title="Was this not helpful?"
                              aria-label="Mark as not helpful"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                    aria-label="CivicSense is typing"
                  >
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8 border-2" style={{ borderColor: 'hsl(var(--civic-gold) / 0.3)' }}>
                        <AvatarFallback style={{ background: 'hsl(var(--civic-gold) / 0.1)' }}>
                          <CivicIcon />
                        </AvatarFallback>
                      </Avatar>
                       <div className="p-3 rounded-xl rounded-tl-sm backdrop-blur-sm border"
                            style={{
                              background: 'hsl(var(--civic-white) / 0.7)',
                              borderColor: 'hsl(var(--civic-gold) / 0.2)'
                            }}>
                        <div className="flex gap-1" aria-label="Typing indicator">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{ background: 'hsl(var(--civic-gold))' }}
                              animate={{ y: [0, -6, 0] }}
                              transition={{ 
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* FAQ Suggestions */}
            {faqSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2 border-t"
                style={{ 
                  borderColor: 'hsl(var(--civic-gold) / 0.2)',
                  background: 'hsl(var(--civic-white) / 0.3)' 
                }}
              >
                <p className="text-xs opacity-70 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-1">
                  {faqSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickReply(suggestion)}
                      className="text-xs h-6 px-2 opacity-70 hover:opacity-100"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input area */}
            <div className="p-4 border-t backdrop-blur-sm"
                 style={{
                   borderColor: 'hsl(var(--civic-gold) / 0.2)',
                   background: 'hsl(var(--civic-white) / 0.5)'
                 }}>
              <div className="flex gap-2 mb-2">
                <Button
                  onClick={startVoiceInput}
                  disabled={isTyping}
                  className="h-10 w-10 p-0 rounded-full"
                  style={{
                    background: isListening 
                      ? 'hsl(var(--civic-error))' 
                      : 'hsl(var(--civic-blue))',
                    boxShadow: isListening 
                      ? '0 0 20px hsl(var(--civic-error) / 0.5)'
                      : '0 2px 8px hsl(var(--civic-blue) / 0.3)'
                  }}
                  title={isListening ? "Stop listening" : "Start voice input"}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask me about ${currentSection.name.toLowerCase()}...`}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 backdrop-blur-sm"
                  style={{
                    borderColor: 'hsl(var(--civic-gold) / 0.3)',
                    background: 'hsl(var(--civic-white) / 0.7)'
                  }}
                  disabled={isTyping || isListening}
                  aria-label="Type your message"
                />
                
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping || isListening}
                  className="h-10 px-4 hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--civic-gold)) 0%, hsl(var(--civic-blue)) 100%)',
                    boxShadow: '0 4px 12px hsl(var(--civic-gold) / 0.3)'
                  }}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick access buttons */}
              <div className="flex gap-1 justify-center">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Upload file" aria-label="Upload file">
                  <Upload className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Search" aria-label="Search">
                  <Search className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Help" aria-label="Get help">
                  <HelpCircle className="w-3 h-3" />
                </Button>
              </div>
              
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-center flex items-center justify-center gap-2"
                  style={{ color: 'hsl(var(--civic-error))' }}
                  aria-live="assertive"
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'hsl(var(--civic-error))' }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {language === "hi" ? "सुन रहा हूं... अब बोलें" : "Listening... Speak now"}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};