import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssistantPersona } from "./types/chat";
import { Users, Shield, Zap } from "lucide-react";

export const PERSONAS: AssistantPersona[] = [
  {
    id: "citizen",
    name: "Citizen Mode",
    icon: Users,
    description: "Friendly, casual, helpful tone",
    tone: "friendly",
    color: "civic-blue"
  },
  {
    id: "policy",
    name: "Policy Officer",
    icon: Shield,
    description: "Professional, precise, data-driven tone",
    tone: "professional",
    color: "civic-green"
  },
  {
    id: "activist",
    name: "Reform Activist",
    icon: Zap,
    description: "Bold, motivational tone",
    tone: "motivational",
    color: "civic-orange"
  }
];

interface PersonaSelectorProps {
  currentPersona: AssistantPersona;
  onPersonaChange: (persona: AssistantPersona) => void;
}

export const PersonaSelector = ({ currentPersona, onPersonaChange }: PersonaSelectorProps) => (
  <div>
    <label className="text-xs font-medium text-civic-slate">AI Persona</label>
    <Select
      value={currentPersona.id}
      onValueChange={(value) => {
        const persona = PERSONAS.find(p => p.id === value);
        if (persona) onPersonaChange(persona);
      }}
    >
      <SelectTrigger className="w-full mt-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PERSONAS.map((persona) => (
          <SelectItem key={persona.id} value={persona.id}>
            <div className="flex items-center space-x-2">
              <persona.icon className="w-4 h-4" />
              <span>{persona.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);