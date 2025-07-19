import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Sentiment from "sentiment";
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
  Sun,
  Moon,
  Trash2,
  Volume2,
  VolumeX,
  Move,
  RotateCcw,
  Settings,
  Heart,
  Shield,
  Compass,
  Megaphone,
  Eye
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "action" | "suggestion";
  emotion?: "positive" | "neutral" | "negative";
  civicTag?: "complaint" | "suggestion" | "feedback" | "info";
  language?: string;
}

type AssistantMode = "citizen" | "policy" | "activist";
type SymbolicIcon = "dove" | "shield" | "compass" | "megaphone" | "eye";

const SYMBOLIC_ICONS = {
  dove: "🕊️",
  shield: "🛡️", 
  compass: "🧭",
  megaphone: "📣",
  eye: "👁️"
};

const ASSISTANT_MODES = {
  citizen: {
    name: "Citizen Mode",
    description: "Casual, friendly assistance",
    avatar: "👨‍💼",
    color: "from-blue-500 to-cyan-500"
  },
  policy: {
    name: "Policy Officer",
    description: "Professional, fact-based guidance", 
    avatar: "👩‍💼",
    color: "from-purple-500 to-indigo-500"
  },
  activist: {
    name: "Reform Activist", 
    description: "Motivational, change-focused support",
    avatar: "✊",
    color: "from-orange-500 to-red-500"
  }
};

export const EnhancedAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('civic-ai-messages');
    return saved ? JSON.parse(saved) : [{
      id: "1",
      content: "Hello! I'm your CivilLedger AI assistant. I can help you navigate the platform, understand policy execution, and analyze governance data. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
      emotion: "positive"
    }];
  });
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDark, setIsDark] = useState(() => 
    localStorage.getItem('civic-ai-theme') === 'dark'
  );
  const [assistantMode, setAssistantMode] = useState<AssistantMode>("citizen");
  const [currentIcon, setCurrentIcon] = useState<SymbolicIcon>("dove");
  const [isBlinking, setIsBlinking] = useState(false);
  const [volumeEnabled, setVolumeEnabled] = useState(true);
  const [emotionColor, setEmotionColor] = useState("bg-blue-500");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const sentiment = new Sentiment();
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        recognition.current = new SpeechRecognitionConstructor();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = 'en-US';

        recognition.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
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
  }, [toast]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('civic-ai-messages', JSON.stringify(messages));
  }, [messages]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('civic-ai-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

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
      if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isOpen]);

  // Avatar blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const detectEmotion = (text: string) => {
    const result = sentiment.analyze(text);
    if (result.score > 2) return "positive";
    if (result.score < -2) return "negative"; 
    return "neutral";
  };

  const detectCivicIntent = (text: string): Message['civicTag'] => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('complaint') || lowerText.includes('problem') || lowerText.includes('issue')) {
      return "complaint";
    }
    if (lowerText.includes('suggest') || lowerText.includes('recommend') || lowerText.includes('improve')) {
      return "suggestion";
    }
    if (lowerText.includes('feedback') || lowerText.includes('opinion') || lowerText.includes('comment')) {
      return "feedback";
    }
    return "info";
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "positive": return "bg-green-500";
      case "negative": return "bg-red-500";
      default: return "bg-blue-500";
    }
  };

  const getModeResponse = (message: string, mode: AssistantMode): string => {
    const responses = {
      citizen: {
        greeting: "Hey there! I'm here to help you navigate civic services easily.",
        policy: "I can help you understand policy details in simple terms.",
        fund: "Let me break down the fund allocation for you in plain language.",
        default: "I'm here to help! What would you like to know about?"
      },
      policy: {
        greeting: "Good day. I provide accurate, policy-based information and guidance.",
        policy: "Based on current regulations and official documentation, here's the policy status.",
        fund: "According to official records, fund allocation stands at the following metrics.",
        default: "I can provide detailed, fact-based information on governance matters."
      },
      activist: {
        greeting: "Together we can drive change! I'm here to empower your civic engagement.",
        policy: "Let's examine how this policy impacts real people and communities!",
        fund: "Every rupee matters! Here's how these funds can create meaningful change.",
        default: "Your voice matters! How can we work together to improve our community?"
      }
    };

    const message_lower = message.toLowerCase();
    if (message_lower.includes('policy') || message_lower.includes('scheme')) {
      return responses[mode].policy;
    }
    if (message_lower.includes('fund') || message_lower.includes('budget')) {
      return responses[mode].fund;
    }
    if (message_lower.includes('hello') || message_lower.includes('hi')) {
      return responses[mode].greeting;
    }
    return responses[mode].default;
  };

  const generateAIResponse = (userMessage: string): string => {
    const baseResponses = {
      "policy": "I can help you track policy execution. Currently, there are 156 active schemes with an average execution rate of 94.2%. Would you like to see details for a specific policy?",
      "fund": "Fund flow analysis shows ₹2.5Cr total tracked with 98.2% transparency score. All transactions are logged on the blockchain. Would you like me to show recent fund movements?",
      "report": "To submit a report, click the 'Submit Report' button in the header or use the enhanced report modal for a guided experience with AI categorization.",
      "security": "Security status is excellent with 99.8% uptime. All smart contracts have been audited and are functioning normally. No security incidents detected in the last 30 days.",
      "help": "I can assist with: Policy tracking, Fund analysis, Report submission, Security monitoring, DAO voting, and Platform navigation. What would you like to explore?",
    };

    // Try to match base responses first
    const message = userMessage.toLowerCase();
    let response = "";
    
    if (message.includes("policy") || message.includes("scheme")) response = baseResponses.policy;
    else if (message.includes("fund") || message.includes("money") || message.includes("budget")) response = baseResponses.fund;
    else if (message.includes("report") || message.includes("complaint")) response = baseResponses.report;
    else if (message.includes("security") || message.includes("audit")) response = baseResponses.security;
    else if (message.includes("help") || message.includes("assist")) response = baseResponses.help;
    else response = getModeResponse(userMessage, assistantMode);

    return response;
  };

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    const emotion = detectEmotion(inputValue);
    const civicTag = detectCivicIntent(inputValue);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      emotion,
      civicTag
    };

    setMessages(prev => [...prev, userMessage]);
    setEmotionColor(getEmotionColor(emotion));
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
        type: "text",
        emotion: "neutral"
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setEmotionColor("bg-blue-500");
    }, 1500);
  }, [inputValue, assistantMode]);

  const startVoiceInput = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognition.current && isListening) {
      setIsListening(false);
      recognition.current.stop();
    }
  };

  const clearHistory = () => {
    setMessages([{
      id: "1",
      content: "Chat history cleared. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
      emotion: "neutral"
    }]);
    toast({
      title: "History cleared",
      description: "All conversation data has been removed."
    });
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

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-16 h-16 neomorphic floating-orb-glow fab-pulse mobile-optimized relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
              boxShadow: `
                0 0 30px hsl(var(--primary) / 0.5),
                8px 8px 16px rgba(0, 0, 0, 0.1),
                -8px -8px 16px rgba(255, 255, 255, 0.9),
                inset 0 1px 2px hsl(var(--background) / 0.2)
              `
            }}
            aria-label="Open Civic AI Assistant"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-30"
            />
            
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-2xl"
            >
              {SYMBOLIC_ICONS[currentIcon]}
            </motion.span>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={dragRef}
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: isMinimized ? 60 : "auto"
      }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      className={`fixed bottom-6 right-6 z-[60] rounded-2xl shadow-2xl overflow-hidden w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] ${
        isDark ? 'bg-background/95' : 'bg-background/95'
      } backdrop-blur-xl border border-border/50`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        background: isDark 
          ? `rgba(0, 0, 0, 0.85)` 
          : `rgba(255, 255, 255, 0.85)`,
        backdropFilter: 'blur(20px)',
        boxShadow: `
          0 20px 40px rgba(0, 0, 0, 0.3),
          inset 0 1px 2px rgba(255, 255, 255, 0.1),
          0 0 50px hsl(var(--primary) / 0.2)
        `
      }}
    >
      {/* Header with drag handle */}
      <div 
        className={`bg-gradient-to-r ${ASSISTANT_MODES[assistantMode].color} text-white p-4 flex items-center justify-between cursor-move`}
        onMouseDown={handleDragStart}
        role="banner"
        aria-label="AI Assistant Header"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative"
            animate={{ scale: isBlinking ? 0.8 : 1 }}
            transition={{ duration: 0.1 }}
          >
            <span className="text-lg">{ASSISTANT_MODES[assistantMode].avatar}</span>
            <motion.div
              className={`absolute -bottom-1 -right-1 w-3 h-1 rounded-full ${emotionColor} transition-colors duration-500`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm">{ASSISTANT_MODES[assistantMode].name}</h3>
            <p className="text-xs opacity-90">Online • Ready to help</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            className="text-white hover:bg-white/20 w-8 h-8 p-0"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 w-8 h-8 p-0"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 w-8 h-8 p-0"
            aria-label="Close assistant"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="flex flex-col h-[500px] max-h-[60vh]"
          >
            {/* Controls */}
            <div className="p-3 border-b bg-muted/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <Select value={assistantMode} onValueChange={(value: AssistantMode) => setAssistantMode(value)}>
                  <SelectTrigger className="w-40 h-8 text-xs bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ASSISTANT_MODES).map(([key, mode]) => (
                      <SelectItem key={key} value={key}>
                        {mode.avatar} {mode.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="h-8 w-8 p-0 hover:bg-destructive/20"
                    aria-label="Clear chat history"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVolumeEnabled(!volumeEnabled)}
                    className="h-8 w-8 p-0"
                    aria-label="Toggle sound"
                  >
                    {volumeEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              {/* Icon selector */}
              <div className="flex gap-2 justify-center">
                {Object.entries(SYMBOLIC_ICONS).map(([key, icon]) => (
                  <Button
                    key={key}
                    variant={currentIcon === key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentIcon(key as SymbolicIcon)}
                    className="h-8 w-8 p-0 text-lg"
                    aria-label={`Set ${key} icon`}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-2">
              <div className="space-y-4 pb-4" role="log" aria-label="Chat messages">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="w-7 h-7 border-2 border-primary/20">
                        <AvatarFallback className="text-xs bg-primary/10">
                          {message.sender === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div
                        className={`p-3 rounded-xl text-sm leading-relaxed backdrop-blur-sm ${
                          message.sender === "user"
                            ? "bg-primary/90 text-primary-foreground rounded-tr-sm"
                            : "bg-muted/70 rounded-tl-sm border border-border/30"
                        }`}
                        style={{
                          boxShadow: message.sender === "user" 
                            ? `inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)`
                            : `inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)`
                        }}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <div className="flex items-center justify-between mt-2 gap-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex gap-1">
                            {message.civicTag && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
                                {message.civicTag}
                              </Badge>
                            )}
                            {message.emotion && message.emotion !== "neutral" && (
                              <div className={`w-2 h-2 rounded-full ${getEmotionColor(message.emotion)}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-2">
                      <Avatar className="w-7 h-7 border-2 border-primary/20">
                        <AvatarFallback className="text-xs bg-primary/10">
                          <Bot className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted/70 p-3 rounded-xl rounded-tl-sm backdrop-blur-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-background/30 backdrop-blur-sm">
              <div className="flex gap-2">
                <Button
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  disabled={isTyping}
                  className={`h-10 w-10 p-0 rounded-full ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                  style={{
                    boxShadow: isListening 
                      ? '0 0 20px rgba(239, 68, 68, 0.5)'
                      : '0 2px 8px rgba(0, 0, 0, 0.15)'
                  }}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about CivilLedger..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 border-primary/20 bg-background/50 backdrop-blur-sm"
                  disabled={isTyping || isListening}
                  aria-label="Message input"
                />
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping || isListening}
                  className="h-10 px-4 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                  }}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-center text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Listening... Speak now
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedAIAssistant;