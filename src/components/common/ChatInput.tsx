import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isListening: boolean;
  onStartVoiceInput: () => void;
  language: "en" | "hi";
}

export const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  isListening, 
  onStartVoiceInput,
  language 
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const recognition = useRef<any>(null);
  const { toast } = useToast();

  // Initialize speech recognition
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
          onChange(transcript);
          onSend();
        };

        recognition.current.onerror = () => {
          toast({
            title: "Voice input error",
            description: "Please try again or check microphone permissions."
          });
        };
      }
    }
  }, [language, onChange, onSend, toast]);

  const startVoiceInput = () => {
    if (recognition.current && !isListening) {
      recognition.current.start();
      onStartVoiceInput();
    }
  };

  return (
    <div className="flex items-center space-x-3 p-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
      <div className="flex-1 relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message... (Ctrl+Shift+C to toggle)"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
          className="border-none bg-transparent focus:ring-0 focus:border-none shadow-none px-4 py-3 text-sm placeholder:text-gray-400"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={startVoiceInput}
          disabled={!recognition.current}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full transition-all duration-200 ${
            isListening 
              ? "text-red-500 bg-red-50 animate-pulse hover:bg-red-100" 
              : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
          }`}
        >
          {isListening ? <VolumeX className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
      </div>
      <Button
        onClick={onSend}
        disabled={!value.trim()}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 h-10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};