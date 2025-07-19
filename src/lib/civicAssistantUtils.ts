import Sentiment from "sentiment";
import { Message, AssistantPersona, SectionContext } from "@/components/common/types/chat";

const sentiment = new Sentiment();

export const QUICK_REPLIES = [
  "Show fund flow",
  "Raise complaint", 
  "Explain scheme",
  "Track application",
  "Contact representative",
  "View audit reports"
];

export const SECTION_CONTEXTS: Record<string, SectionContext> = {
  "/": {
    name: "Home",
    actions: ["Explore Dashboard", "Submit Complaint", "Track Application"],
    keywords: ["home", "overview", "start", "help"]
  },
  "/dashboard": {
    name: "Dashboard", 
    actions: ["Show Analytics", "Fund Allocation", "Export Data"],
    keywords: ["analytics", "data", "charts", "metrics"]
  },
  "/citizen": {
    name: "Citizen Portal",
    actions: ["Track Scheme", "File Alert", "Check Eligibility"],
    keywords: ["citizen", "scheme", "eligibility", "application"]
  },
  "/voting": {
    name: "DAO Voting",
    actions: ["Current Proposals", "Vote Now", "Voting History"],
    keywords: ["vote", "dao", "proposal", "governance"]
  },
  "/policy-maker": {
    name: "Policy Maker",
    actions: ["Create Policy", "Budget Allocation", "Performance Metrics"],
    keywords: ["policy", "budget", "allocation", "metrics"]
  },
  "/auditor": {
    name: "Auditor Panel", 
    actions: ["Audit Report", "Risk Assessment", "Compliance Status"],
    keywords: ["audit", "compliance", "risk", "transparency"]
  },
  "/contractor": {
    name: "Contractor View",
    actions: ["Project Status", "Payment Schedule", "Quality Metrics"],
    keywords: ["project", "payment", "contract", "progress"]
  }
};

export const analyzeMessage = (text: string): { emotion: Message['emotion']; sentiment: number; intent: string } => {
  const analysis = sentiment.analyze(text);
  const lowerText = text.toLowerCase();
  
  let emotion: Message['emotion'] = "neutral";
  if (analysis.score > 2) emotion = "positive";
  else if (analysis.score < -2) emotion = "negative";
  if (lowerText.includes('urgent') || lowerText.includes('emergency')) emotion = "urgent";

  // Intent detection
  let intent = "general";
  if (lowerText.includes('fund') || lowerText.includes('money')) intent = "fund_inquiry";
  if (lowerText.includes('complaint') || lowerText.includes('report')) intent = "complaint";
  if (lowerText.includes('policy') || lowerText.includes('scheme')) intent = "policy_inquiry";
  if (lowerText.includes('vote') || lowerText.includes('dao')) intent = "voting";

  return { emotion, sentiment: analysis.score, intent };
};

export const generateResponse = (
  userMessage: string, 
  analysis: any, 
  currentPersona: AssistantPersona,
  currentSection: SectionContext
): { content: string; quickReplies: string[] } => {
  const { intent } = analysis;
  const personaTone = currentPersona.tone;
  const lowerMessage = userMessage.toLowerCase();
  
  // Enhanced response logic based on specific keywords and context
  if (lowerMessage.includes('fund') || lowerMessage.includes('money') || lowerMessage.includes('budget')) {
    const responses = {
      friendly: "I can help you track fund flows! Our platform shows real-time allocation of ₹2.5Cr with 98.2% transparency. Would you like to see specific breakdowns by scheme or region?",
      professional: "Current fund allocation: ₹2.5 Crore distributed across 12 schemes with 98.2% transparency index. Click 'Show fund flow' for detailed analytics and real-time tracking.",
      motivational: "Transparency is power! We're tracking ₹2.5Cr with almost perfect visibility - that's civic progress in action! Every rupee is accounted for!"
    };
    return {
      content: responses[personaTone],
      quickReplies: ["Show fund flow", "Export report", "Set alerts", "Track application"]
    };
  }

  if (lowerMessage.includes('complaint') || lowerMessage.includes('report') || lowerMessage.includes('issue')) {
    const responses = {
      friendly: "I'm here to help you file your complaint safely and anonymously. Your voice matters in our democracy! What type of issue would you like to report?",
      professional: "Complaint filing system available with blockchain-secured anonymity. Multiple categories supported for efficient routing to relevant authorities.",
      motivational: "Your complaint can drive real change! Our secure system ensures your voice is heard while protecting your identity. Every report counts!"
    };
    return {
      content: responses[personaTone],
      quickReplies: ["Raise complaint", "Track status", "Anonymous report", "Contact representative"]
    };
  }

  if (lowerMessage.includes('vote') || lowerMessage.includes('dao') || lowerMessage.includes('proposal')) {
    const responses = {
      friendly: "Ready to participate in democracy? I can show you current proposals and help you vote! Your participation makes a difference.",
      professional: "DAO governance interface provides current proposals with voting statistics, deadline information, and impact analysis for informed decision-making.",
      motivational: "Your vote is your power! Let's make democracy work - every voice counts in our collective future! Time to shape policy together!"
    };
    return {
      content: responses[personaTone],
      quickReplies: ["Vote Now", "View proposals", "Voting history", "Explain scheme"]
    };
  }

  if (lowerMessage.includes('scheme') || lowerMessage.includes('policy') || lowerMessage.includes('program')) {
    const responses = {
      friendly: "I'll break down any policy into simple terms. Which scheme or policy interests you? I can explain eligibility, benefits, and application process.",
      professional: "Policy documentation and impact analysis available. Specify policy area for detailed breakdown including implementation status and performance metrics.",
      motivational: "Knowledge is power! Understanding policies helps you advocate for better governance and access the benefits you deserve!"
    };
    return {
      content: responses[personaTone],
      quickReplies: ["Explain scheme", "Check eligibility", "Track application", "Contact representative"]
    };
  }

  if (lowerMessage.includes('track') || lowerMessage.includes('application') || lowerMessage.includes('status')) {
    const responses = {
      friendly: "I can help you track any application or process! Just let me know what you'd like to check the status of.",
      professional: "Application tracking system provides real-time status updates with timeline visibility and next steps information.",
      motivational: "Stay informed, stay empowered! Tracking your applications ensures transparency and accountability in governance!"
    };
    return {
      content: responses[personaTone],
      quickReplies: ["Track application", "Check status", "View timeline", "Contact support"]
    };
  }

  // Default response based on current section
  const sectionResponses = {
    friendly: `I'm CivicSense, your friendly ${currentPersona.name}! I see you're in ${currentSection.name}. How can I assist you today? I can help with queries, tracking, or connecting you with the right information.`,
    professional: `CivicSense AI ${currentPersona.name} at your service. Current context: ${currentSection.name}. I can provide assistance with information retrieval, process guidance, and system navigation.`,
    motivational: `Welcome to CivicSense! I'm your ${currentPersona.name}, here to empower your civic journey! You're in ${currentSection.name} - let's make governance work for you!`
  };
  
  return {
    content: sectionResponses[personaTone],
    quickReplies: currentSection.actions || QUICK_REPLIES.slice(0, 3)
  };
};