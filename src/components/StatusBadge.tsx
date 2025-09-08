import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "open" | "submitted" | "closed" | "pending" | "quote_received";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    open: "bg-success/10 text-success border-success/20",
    submitted: "bg-primary/10 text-primary border-primary/20", 
    closed: "bg-muted text-muted-foreground border-border",
    pending: "bg-warning/10 text-warning border-warning/20",
    quote_received: "bg-primary/10 text-primary border-primary/20"
  };

  const labels = {
    open: "Open",
    submitted: "Submitted", 
    closed: "Closed",
    pending: "Pending",
    quote_received: "Quote Received"
  };

  return (
    <Badge variant="outline" className={cn(variants[status], "font-medium", className)}>
      {labels[status]}
    </Badge>
  );
}