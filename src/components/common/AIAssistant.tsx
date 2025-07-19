import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Zap,
  FileText,
  BarChart3,
  Shield
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "action" | "suggestion";
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your CivilLedger AI assistant. I can help you navigate the platform, understand policy execution, and analyze governance data. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "Check Policy Status", icon: FileText, action: "policy-status" },
    { label: "Fund Flow Analysis", icon: BarChart3, action: "fund-analysis" },
    { label: "Security Audit", icon: Shield, action: "security-audit" },
    { label: "Submit Report", icon: Zap, action: "submit-report" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const responses = {
      "policy": "I can help you track policy execution. Currently, there are 156 active schemes with an average execution rate of 94.2%. Would you like to see details for a specific policy?",
      "fund": "Fund flow analysis shows ₹2.5Cr total tracked with 98.2% transparency score. All transactions are logged on the blockchain. Would you like me to show recent fund movements?",
      "report": "To submit a report, click the 'Submit Report' button in the header or use the enhanced report modal for a guided experience with AI categorization.",
      "security": "Security status is excellent with 99.8% uptime. All smart contracts have been audited and are functioning normally. No security incidents detected in the last 30 days.",
      "help": "I can assist with: Policy tracking, Fund analysis, Report submission, Security monitoring, DAO voting, and Platform navigation. What would you like to explore?",
      "default": "I understand you're asking about governance and transparency. Could you please be more specific about what aspect of CivilLedger you'd like to explore?"
    };

    const message = userMessage.toLowerCase();
    if (message.includes("policy") || message.includes("scheme")) return responses.policy;
    if (message.includes("fund") || message.includes("money") || message.includes("budget")) return responses.fund;
    if (message.includes("report") || message.includes("complaint")) return responses.report;
    if (message.includes("security") || message.includes("audit")) return responses.security;
    if (message.includes("help") || message.includes("assist")) return responses.help;
    
    return responses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
        type: "text"
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const actionMessage: Message = {
      id: Date.now().toString(),
      content: `Help me with: ${action.replace("-", " ")}`,
      sender: "user",
      timestamp: new Date(),
      type: "action"
    };

    setMessages(prev => [...prev, actionMessage]);
    
    setTimeout(() => {
      const responses = {
        "policy-status": "Here's the current policy status: 156 active schemes, 94.2% average execution rate. Recent updates include 3 new infrastructure projects and 2 education initiatives.",
        "fund-analysis": "Fund Analysis Summary: Total allocated ₹2.5Cr, 87% disbursed, 13% pending. Top categories: Infrastructure (40%), Education (25%), Healthcare (20%), Others (15%).",
        "security-audit": "Security Audit Complete: All systems operational, 0 vulnerabilities detected, Last audit: 2 hours ago. Smart contracts verified and functioning normally.",
        "submit-report": "To submit a report, use the enhanced report modal which includes AI categorization, media upload, and blockchain logging. Would you like me to guide you through the process?"
      };

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[action as keyof typeof responses] || "I can help you with that. Please provide more details.",
        sender: "ai",
        timestamp: new Date(),
        type: "suggestion"
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-20 left-6 z-50 sm:bottom-6 sm:left-6"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-br from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: isMinimized ? 60 : "auto"
      }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      className="fixed bottom-20 left-6 z-[60] bg-background border rounded-xl shadow-2xl overflow-hidden w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] sm:bottom-6 sm:left-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">Online • Ready to help</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 w-8 h-8 p-0"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 w-8 h-8 p-0"
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
            {/* Quick Actions */}
            <div className="p-3 border-b bg-muted/50">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs h-8 justify-start hover:bg-primary/10"
                  >
                    <action.icon className="w-3 h-3 mr-1.5" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-2">
              <div className="space-y-4 pb-4">
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
                        className={`p-3 rounded-xl text-sm leading-relaxed ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.type === "suggestion" && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                              AI Suggestion
                            </Badge>
                          )}
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
                      <div className="bg-muted p-3 rounded-xl rounded-tl-sm">
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
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about CivilLedger..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 border-primary/20"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIAssistant;