import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FloatingCivicOrb } from "./FloatingCivicOrb";
import { AssistantAvatar } from "./AssistantAvatar";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSettings } from "./ChatSettings";
import { TypingIndicator } from "./TypingIndicator";
import { useCivicChat } from "@/hooks/useCivicChat";
import { QUICK_REPLIES } from "@/lib/civicAssistantUtils";
import {
  X,
  Minimize2,
  Maximize2,
  Settings,
  Move
} from "lucide-react";

export const EnhancedCivicAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
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
  } = useCivicChat();

  // Handle sending messages
  const onSendMessage = () => {
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
      setInputValue("");
    }
  };

  // Dragging functionality
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Idle detection
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setIsIdle(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) {
    return <FloatingCivicOrb onClick={() => setIsOpen(true)} isIdle={isIdle} />;
  }

  return (
    <motion.div
      className={`fixed z-50 ${isMinimized ? 'bottom-6 right-6' : ''}`}
      style={!isMinimized ? {
        bottom: 24,
        right: 24,
        transform: `translate(${position.x}px, ${position.y}px)`
      } : {}}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div
        className={`bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-2xl ${
          isMinimized ? 'w-80 h-14' : 'w-[420px] h-[650px]'
        } rounded-3xl overflow-hidden`}
        layoutId="assistant-window"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)"
        }}
      >
        {/* Enhanced Header */}
        <motion.div
          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white cursor-move relative overflow-hidden"
          onMouseDown={handleDragStart}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-purple-300" />
          
          <div className="flex items-center space-x-3 relative z-10">
            <AssistantAvatar emotion={messages[messages.length - 1]?.emotion} isTyping={isTyping} />
            <div className="min-w-0 flex-1">
              <motion.h3 
                className="font-semibold text-sm truncate"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                CivicSense AI ✨
              </motion.h3>
              <p className="text-xs opacity-90 truncate">{currentPersona.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-red-400/50 p-2 rounded-xl transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {!isMinimized && (
          <>
            {/* Settings Panel */}
            <ChatSettings
              isOpen={showSettings}
              currentPersona={currentPersona}
              onPersonaChange={setCurrentPersona}
              language={language}
              onLanguageToggle={() => setLanguage(language === "en" ? "hi" : "en")}
              onClearChat={clearChat}
            />

            {/* Enhanced Messages Area */}
            <ScrollArea className="flex-1 h-[450px] bg-gradient-to-b from-gray-50/50 to-white">
              <div className="space-y-1 p-6">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onQuickReply={handleQuickReply}
                    />
                  ))}
                </AnimatePresence>

                {/* Enhanced Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="flex items-center space-x-3">
                        <AssistantAvatar emotion="neutral" isTyping={true} />
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                          <TypingIndicator />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Enhanced Input Area */}
            <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="p-6 space-y-4">
                <ChatInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={onSendMessage}
                  isListening={isListening}
                  onStartVoiceInput={() => setIsListening(true)}
                  language={language}
                />

                {/* Enhanced Quick Replies */}
                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {QUICK_REPLIES.slice(0, 3).map((reply, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs h-8 px-3 rounded-full border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                      >
                        {reply}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced Session Stats */}
                <motion.div 
                  className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>{sessionStats.messages} messages</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span>Mood:</span>
                    <motion.div
                      className={`text-xs px-2 py-1 rounded-full ${
                        sessionStats.sentiment > 0 ? "bg-green-100 text-green-600" :
                        sessionStats.sentiment < 0 ? "bg-red-100 text-red-600" :
                        "bg-blue-100 text-blue-600"
                      }`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {sessionStats.sentiment > 0 ? "😊 Positive" : 
                       sessionStats.sentiment < 0 ? "😔 Negative" : "😐 Neutral"}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};