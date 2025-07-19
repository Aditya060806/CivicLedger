import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssistantAvatar } from "./AssistantAvatar";
import { Message } from "./types/chat";

interface ChatMessageProps {
  message: Message;
  onQuickReply: (reply: string) => void;
}

export const ChatMessage = ({ message, onQuickReply }: ChatMessageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
  >
    <div className={`flex items-start space-x-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
      {message.sender === "ai" && (
        <AssistantAvatar emotion={message.emotion} isTyping={false} />
      )}
      
      <div className="flex flex-col space-y-2">
        {/* Message Bubble */}
        <motion.div
          className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            message.sender === "user"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
              : "bg-white border border-gray-100 text-gray-800 rounded-bl-md"
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Message bubble pointer */}
          <div
            className={`absolute top-4 w-0 h-0 ${
              message.sender === "user"
                ? "right-[-8px] border-l-[8px] border-l-blue-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
                : "left-[-8px] border-r-[8px] border-r-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
            }`}
          />
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* Message metadata */}
          <div className={`flex items-center justify-between mt-2 pt-2 ${
            message.sender === "user" ? "border-t border-white/20" : "border-t border-gray-100"
          }`}>
            <span className={`text-xs ${
              message.sender === "user" ? "text-white/70" : "text-gray-500"
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            
            {message.sentiment !== undefined && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-xs px-2 py-1 rounded-full ${
                  message.sender === "user" ? "bg-white/20" : "bg-gray-100"
                }`}
              >
                {message.sentiment > 0 ? "😊" : message.sentiment < 0 ? "😔" : "😐"}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Replies */}
        {message.quickReplies && message.sender === "ai" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {message.quickReplies.map((reply, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickReply(reply)}
                  className="text-xs h-8 px-3 rounded-full border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                >
                  {reply}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  </motion.div>
);