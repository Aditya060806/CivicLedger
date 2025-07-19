import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PersonaSelector } from "./PersonaSelector";
import { AssistantPersona } from "./types/chat";
import { Languages, Trash2 } from "lucide-react";

interface ChatSettingsProps {
  isOpen: boolean;
  currentPersona: AssistantPersona;
  onPersonaChange: (persona: AssistantPersona) => void;
  language: "en" | "hi";
  onLanguageToggle: () => void;
  onClearChat: () => void;
}

export const ChatSettings = ({ 
  isOpen, 
  currentPersona, 
  onPersonaChange,
  language,
  onLanguageToggle,
  onClearChat 
}: ChatSettingsProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="p-4 bg-civic-gray-50 border-b"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
      >
        <div className="space-y-3">
          <PersonaSelector 
            currentPersona={currentPersona}
            onPersonaChange={onPersonaChange}
          />
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onLanguageToggle}
            >
              <Languages className="w-4 h-4 mr-1" />
              {language === "en" ? "हिंदी" : "English"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearChat}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);