export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "card" | "button";
  emotion?: "positive" | "neutral" | "negative" | "urgent";
  sentiment?: number;
  intent?: string;
  quickReplies?: string[];
  feedback?: "helpful" | "not-helpful" | null;
}

export interface AssistantPersona {
  id: string;
  name: string;
  icon: any;
  description: string;
  tone: string;
  color: string;
}

export interface SessionStats {
  messages: number;
  sentiment: number;
  topics: string[];
}

export interface SectionContext {
  name: string;
  actions: string[];
  keywords: string[];
}