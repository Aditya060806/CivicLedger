import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "under-review" | "approved" | "rejected" | "active" | "paused" | "draft" | "resolved" | "open" | "submitted" | "awarded" | "completed";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { color: "bg-civic-gold/10 text-civic-gold border-civic-gold/20", label: "Pending" };
      case "under-review":
        return { color: "bg-civic-blue/10 text-civic-blue border-civic-blue/20", label: "Under Review" };
      case "approved":
        return { color: "bg-civic-green/10 text-civic-green border-civic-green/20", label: "Approved" };
      case "rejected":
        return { color: "bg-civic-red/10 text-civic-red border-civic-red/20", label: "Rejected" };
      case "active":
        return { color: "bg-civic-green/10 text-civic-green border-civic-green/20", label: "Active" };
      case "paused":
        return { color: "bg-civic-orange/10 text-civic-orange border-civic-orange/20", label: "Paused" };
      case "draft":
        return { color: "bg-civic-slate/10 text-civic-slate border-civic-slate/20", label: "Draft" };
      case "resolved":
        return { color: "bg-civic-green/10 text-civic-green border-civic-green/20", label: "Resolved" };
      case "open":
        return { color: "bg-civic-teal/10 text-civic-teal border-civic-teal/20", label: "Open" };
      case "submitted":
        return { color: "bg-civic-blue/10 text-civic-blue border-civic-blue/20", label: "Submitted" };
      case "awarded":
        return { color: "bg-civic-purple/10 text-civic-purple border-civic-purple/20", label: "Awarded" };
      case "completed":
        return { color: "bg-civic-green/10 text-civic-green border-civic-green/20", label: "Completed" };
      default:
        return { color: "bg-civic-slate/10 text-civic-slate border-civic-slate/20", label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={cn(config.color, "font-medium border text-xs", className)} variant="outline">
      {config.label}
    </Badge>
  );
};