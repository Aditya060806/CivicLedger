import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import {
  MessageCircle, X, Send, Bot, User, Minimize2, Maximize2,
  Mic, MicOff, ThumbsUp, ThumbsDown, Upload, Search, Compass,
  AlertTriangle, HelpCircle, FileText, MapPin, BarChart3,
  ShieldCheck, Globe, Eye, Zap, Clock, Volume2, Settings,
  RotateCcw, Languages, Trash2, Sparkles, Brain, Lightbulb,
  TrendingUp, CheckCircle, Star, Heart, Smile, Frown, Meh,
  Users, Vote
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: 'positive' | 'neutral' | 'negative' | 'urgent' | 'excited';
  quickReplies?: string[];
}

const FAQ_SUGGESTIONS = [
  'How to track fund allocation?',
  'Where can I submit complaints?',
  'What are current voting proposals?',
  'How to check scheme eligibility?',
  'How to file anonymous alerts?',
  'What is project status?',
  'How to view audit reports?',
  'Where to find policy details?'
];

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const { toast } = useToast();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history
  useEffect(() => {
    const savedMessages = localStorage.getItem('civic-chat-history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('civic-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Hello! I'm your AI assistant for CivicLedger. I can help you navigate the platform, track funds, submit complaints, and participate in governance. How can I assist you today?`,
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'positive',
        quickReplies: ['Track funds', 'Submit complaint', 'View policies', 'Help with voting']
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('civic-chat-history');
    toast({
      title: 'Chat cleared',
      description: 'All messages have been removed.'
    });
  };

  const detectEmotion = (text: string): Message['emotion'] => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('urgent') || lowerText.includes('emergency')) {
      return 'urgent';
    }
    if (lowerText.includes('thank') || lowerText.includes('great') || lowerText.includes('good')) {
      return 'excited';
    }
    if (lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('wrong')) {
      return 'negative';
    }
    return 'positive';
  };

  const generateAIResponse = (userMessage: string): { content: string; quickReplies: string[]; emotion: Message['emotion'] } => {
    const message = userMessage.toLowerCase();
    
    const responses: Record<string, any> = {
      'fund': {
        content: `💰 **Fund Tracking Overview**\n\nCurrent fund allocation status:\n\n• **Total Funds**: ₹2.5Cr tracked\n• **Transparency**: 98.2%\n• **Active Schemes**: 15\n• **Recent Disbursements**: ₹45L\n\nAll transactions are blockchain-verified and transparent.`,
        quickReplies: ['Show scheme breakdown', 'Track specific funds', 'Export report', 'Set alerts'],
        emotion: 'positive' as const
      },
      'complaint': {
        content: `📝 **Complaint Submission**\n\nYou can submit complaints through our secure system:\n\n• **Anonymous**: 100% identity protection\n• **Trackable**: Real-time status updates\n• **Response Time**: Within 24 hours\n• **Follow-up**: Available if needed\n\nWhat type of issue would you like to report?`,
        quickReplies: ['Service quality', 'Fund misuse', 'Policy violation', 'Infrastructure issue'],
        emotion: 'neutral' as const
      },
      'policy': {
        content: `📋 **Policy Information**\n\nCurrent active policies:\n\n• **PM Awas Yojana**: Housing for all\n• **Digital India**: Technology infrastructure\n• **Swachh Bharat**: Clean India mission\n• **Jan Aushadhi**: Affordable medicines\n\nWhich policy would you like to know more about?`,
        quickReplies: ['PM Awas Yojana', 'Digital India', 'Swachh Bharat', 'Jan Aushadhi'],
        emotion: 'positive' as const
      },
      'vote': {
        content: `🗳️ **DAO Voting System**\n\nParticipate in decentralized governance:\n\n• **Current Proposals**: 3 active\n• **Your Voting Power**: Based on participation\n• **Transparency**: All votes on blockchain\n• **Results**: Real-time updates\n\nWould you like to see current proposals?`,
        quickReplies: ['View proposals', 'How to vote', 'Voting history', 'Proposal details'],
        emotion: 'positive' as const
      }
    };

    // Check for specific keywords
    for (const [key, response] of Object.entries(responses)) {
      if (message.includes(key)) {
        return response;
      }
    }

    // Default response
    return {
      content: `I understand you're asking about "${userMessage}". Let me help you with that. I can assist with fund tracking, complaints, policies, voting, and more. What specific aspect would you like to explore?`,
      quickReplies: ['Track funds', 'Submit complaint', 'View policies', 'Help with voting'],
      emotion: 'neutral' as const
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      emotion: detectEmotion(content)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: 'ai',
        timestamp: new Date(),
        emotion: aiResponse.emotion,
        quickReplies: aiResponse.quickReplies
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const getEmotionIcon = (emotion: Message['emotion']) => {
    switch (emotion) {
      case 'excited': return <Sparkles className="w-4 h-4 text-yellow-500" />;
      case 'positive': return <Smile className="w-4 h-4 text-green-500" />;
      case 'negative': return <Frown className="w-4 h-4 text-red-500" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEmotionColor = (emotion: Message['emotion']) => {
    switch (emotion) {
      case 'excited': return 'border-yellow-200 bg-yellow-50';
      case 'positive': return 'border-green-200 bg-green-50';
      case 'negative': return 'border-red-200 bg-red-50';
      case 'urgent': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-6 h-6" />
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                3
              </motion.div>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chat with AI Assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Assistant</h3>
              <p className="text-sm opacity-90">Your CivicLedger guide</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMinimized ? 'Maximize' : 'Minimize'}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close Chat</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'}>
                          {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-2xl px-4 py-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : `border ${getEmotionColor(message.emotion)}`}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {message.emotion && getEmotionIcon(message.emotion)}
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        {message.quickReplies && message.quickReplies.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.quickReplies.map((reply, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(reply)}
                                className="w-full text-left justify-start text-xs"
                              >
                                {reply}
                              </Button>
                            ))}
                          </div>
                        )}
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
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-gray-50">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onKeyDown={handleKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Type your message..."
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="h-8 w-8 p-0"
                      >
                        <Lightbulb className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Suggestions</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearChat}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear Chat</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-2 space-y-1"
                  >
                    {FAQ_SUGGESTIONS.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full justify-start text-left text-sm"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          {suggestion}
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>
    </TooltipProvider>
  );
};
