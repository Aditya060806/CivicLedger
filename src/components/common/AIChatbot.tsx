import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";
import { 
  MessageCircle, 
  Send, 
  X, 
  Brain, 
  User, 
  Loader2,
  Minimize2,
  Maximize2,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  contextData?: any;
}

interface SuggestionChip {
  text: string;
  emoji: string;
  response: string;
}

export const AIChatbot = ({ isOpen, onToggle, contextData }: AIChatbotProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: "Hello! 👋 I'm your CivilLedger AI assistant. I can help explain policies, answer questions about fund flows, and provide insights about governance processes. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips: SuggestionChip[] = [
    {
      text: "How does fund tracking work?",
      emoji: "💰",
      response: "Great question! 💰 CivilLedger tracks all fund movements through smart contracts. Each transaction is recorded on the blockchain, ensuring complete transparency. You can view real-time fund flows, utilization rates, and beneficiary distribution in the dashboard. Every rupee is traceable! 📊"
    },
    {
      text: "What is blockchain governance?",
      emoji: "🔗",
      response: "Excellent! 🔗 CivilLedger uses blockchain technology to ensure transparency and immutability. Smart contracts automatically execute policies when predefined conditions are met, eliminating human intervention and reducing corruption. All transactions are publicly verifiable! ✅"
    },
    {
      text: "How to report an issue?",
      emoji: "🚨",
      response: "Important question! 🚨 To report an issue, use the floating action button (red flag icon) on the bottom right. Your report will be encrypted, stored on IPFS, and recorded on the blockchain with a unique ID. All reports are reviewed by auditors within 24-48 hours. Your voice matters! 📢"
    }
  ];

  const getContextualResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (contextData?.type === "policy" && (message.includes("policy") || message.includes("scheme"))) {
      return `📋 Based on the current policy "${contextData.name}", this scheme has allocated ₹${(contextData.fundAllocated / 100000).toFixed(1)}L and has served ${contextData.beneficiaries} beneficiaries. The execution follows a smart contract model ensuring transparency and automated fund disbursement when conditions are met! 🎯`;
    }
    
    if (message.includes("fund") || message.includes("money") || message.includes("budget")) {
      return "💰 CivilLedger tracks all fund movements through smart contracts. Each transaction is recorded on the blockchain, ensuring complete transparency. You can view real-time fund flows, utilization rates, and beneficiary distribution in the dashboard. Every rupee is traceable! 📊";
    }
    
    if (message.includes("report") || message.includes("complaint") || message.includes("issue")) {
      return "🚨 To report an issue, use the floating action button (red flag icon) on the bottom right. Your report will be encrypted, stored on IPFS, and recorded on the blockchain with a unique ID. All reports are reviewed by auditors within 24-48 hours. Your voice matters! 📢";
    }
    
    if (message.includes("vote") || message.includes("dao") || message.includes("voting")) {
      return "🗳️ DAO voting allows citizens to participate in governance decisions. Each vote is recorded on the blockchain, and decisions are automatically executed through smart contracts when consensus is reached. You can participate in active proposals in the DAO Voting section. Democracy in action! 🎯";
    }
    
    if (message.includes("blockchain") || message.includes("smart contract")) {
      return "🔗 CivilLedger uses blockchain technology to ensure transparency and immutability. Smart contracts automatically execute policies when predefined conditions are met, eliminating human intervention and reducing corruption. All transactions are publicly verifiable! ✅";
    }
    
    if (message.includes("hello") || message.includes("hi") || message.includes("help")) {
      return "👋 Hello! I can help you understand CivilLedger's features. Try asking about policies, fund flows, reporting issues, DAO voting, or how blockchain ensures transparency in governance. I'm here to help! 😊";
    }
    
    const fallbacks = [
      "🤔 That's an interesting question about governance! CivilLedger ensures transparency through blockchain technology. Could you be more specific about what aspect you'd like to know?",
      "👋 I'm here to help with CivilLedger! You can ask me about policies, fund tracking, reporting issues, or how our blockchain-based governance works. What interests you most? 💡",
      "🎯 Great question! CivilLedger uses smart contracts to automate governance processes. What specific area would you like me to explain further? I'm all ears! 👂"
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSuggestionClick = (suggestion: SuggestionChip) => {
    setShowSuggestions(false);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: suggestion.text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: suggestion.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const copyMessage = useCallback(async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
        duration: 2000,
      });
      
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy message",
        variant: "destructive",
      });
    }
  }, [toast]);

  const clearConversation = useCallback(() => {
    setMessages([{
      id: "welcome",
      type: "ai",
      content: "Hello! 👋 I'm your CivilLedger AI assistant. How can I help you today?",
      timestamp: new Date()
    }]);
    setShowSuggestions(true);
    toast({
      title: "Conversation cleared",
      description: "Starting fresh!",
    });
  }, [toast]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setShowSuggestions(false);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    const currentInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getContextualResponse(currentInput),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }
  }, [messages, isTyping]);

  const chatVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transformOrigin: "bottom right"
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring" as const, 
        stiffness: 400, 
        damping: 25 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-20 right-4 z-50 sm:bottom-6 sm:right-6"
          variants={chatVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <GlassCard className={cn(
            "w-[95vw] max-w-md shadow-2xl border-primary/20 overflow-hidden bg-background/95 backdrop-blur-xl",
            isMinimized ? "h-16" : "h-[75vh] max-h-[600px] min-h-[450px]"
          )}>
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-foreground">CivilLedger AI</h3>
                    <Badge variant="secondary" className="px-2 py-0 text-xs bg-accent/10 text-accent border-accent/20">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Enhanced
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Policy Expert Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {!isMinimized && messages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearConversation}
                    className="w-8 h-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    title="Clear conversation"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 p-0"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Suggestion Chips */}
                <AnimatePresence>
                  {showSuggestions && messages.length === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 border-b border-border"
                    >
                      <p className="text-xs text-muted-foreground mb-3 font-medium">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestionChips.map((suggestion, index) => (
                          <motion.button
                            key={suggestion.text}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-xs transition-all duration-200 border border-primary/20 font-medium hover:scale-105"
                          >
                            <span>{suggestion.emoji}</span>
                            <span className="max-w-[150px] truncate">{suggestion.text}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages with proper scrolling */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1 px-4 py-2">
                    <div className="space-y-4 pb-4">
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={cn(
                              "flex group",
                              message.type === "user" ? "justify-end" : "justify-start"
                            )}
                          >
                            <div className={cn(
                              "max-w-[85%] rounded-2xl p-3 text-sm relative",
                              message.type === "user" 
                                ? "bg-primary text-primary-foreground ml-8" 
                                : "bg-muted text-foreground mr-8"
                            )}>
                              {/* Copy button for AI messages */}
                              {message.type === "ai" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyMessage(message.content, message.id)}
                                  className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  title="Copy message"
                                >
                                  {copiedMessageId === message.id ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              )}
                              
                              <div className="flex items-start space-x-2">
                                <div className={cn(
                                  "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                                  message.type === "ai" 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-background text-foreground"
                                )}>
                                  {message.type === "ai" ? (
                                    <Brain className="w-3.5 h-3.5" />
                                  ) : (
                                    <User className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <p className="leading-relaxed whitespace-pre-wrap break-words">
                                    {message.content}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs opacity-70">
                                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {message.type === "ai" && (
                                      <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                                        <Sparkles className="w-2 h-2 mr-1" />
                                        AI
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Typing Indicator */}
                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="flex justify-start"
                          >
                            <div className="bg-muted rounded-2xl p-3 flex items-center space-x-3 max-w-[85%] mr-8">
                              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                                <Brain className="w-3.5 h-3.5 text-primary-foreground" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-foreground font-medium">AI is thinking...</span>
                                <div className="flex space-x-1">
                                  {[0, 1, 2].map((i) => (
                                    <motion.div 
                                      key={i}
                                      className="w-1.5 h-1.5 bg-primary rounded-full"
                                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-background">
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about policies, funds, or governance... 💬"
                      className="flex-1 text-sm border-primary/20 bg-background"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isTyping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center mt-3">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <HelpCircle className="w-3 h-3 mr-1" />
                      Powered by CivilLedger AI ✨
                    </span>
                  </div>
                </div>
              </>
            )}
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};