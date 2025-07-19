import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Message, AssistantPersona, SessionStats } from "@/components/common/types/chat";
import { PERSONAS } from "@/components/common/PersonaSelector";
import { analyzeMessage, generateResponse, SECTION_CONTEXTS, QUICK_REPLIES } from "@/lib/civicAssistantUtils";

export const useCivicChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<AssistantPersona>(PERSONAS[0]);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [sessionStats, setSessionStats] = useState<SessionStats>({ 
    messages: 0, 
    sentiment: 0, 
    topics: [] 
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const currentSection = SECTION_CONTEXTS[location.pathname] || SECTION_CONTEXTS["/"];

  const handleSendMessage = useCallback((messageText: string) => {
    if (!messageText.trim()) return;

    const analysis = analyzeMessage(messageText);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      ...analysis
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Update session stats
    setSessionStats(prev => ({
      messages: prev.messages + 1,
      sentiment: (prev.sentiment + analysis.sentiment) / 2,
      topics: [...new Set([...prev.topics, analysis.intent])]
    }));

    setTimeout(() => {
      const { content, quickReplies } = generateResponse(messageText, analysis, currentPersona, currentSection);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
        emotion: analysis.emotion === "urgent" ? "urgent" : "positive",
        quickReplies
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }, [currentPersona, currentSection]);

  const handleQuickReply = useCallback((reply: string) => {
    // Auto-navigate for certain replies
    if (reply === "Show fund flow") navigate("/dashboard");
    if (reply === "Vote Now") navigate("/voting");
    if (reply === "File complaint") navigate("/citizen");
    
    handleSendMessage(reply);
  }, [handleSendMessage, navigate]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('civic-chat-history');
    setSessionStats({ messages: 0, sentiment: 0, topics: [] });
    toast({
      title: "Chat cleared",
      description: "All messages have been removed."
    });
  }, [toast]);

  // Initialize with greeting
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = "Good morning";
    if (hour >= 12 && hour < 18) greeting = "Good afternoon";
    if (hour >= 18) greeting = "Good evening";
    
    const initialMessage: Message = {
      id: "1",
      content: `${greeting}! I'm CivicSense, your ${currentPersona.name}. I see you're in ${currentSection.name}. How can I assist you today?`,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
      emotion: "positive",
      quickReplies: currentSection.actions || QUICK_REPLIES.slice(0, 4)
    };
    
    setMessages([initialMessage]);
  }, [currentPersona, currentSection]);

  return {
    messages,
    isTyping,
    currentPersona,
    setCurrentPersona,
    language,
    setLanguage,
    sessionStats,
    handleSendMessage,
    handleQuickReply,
    clearChat
  };
};