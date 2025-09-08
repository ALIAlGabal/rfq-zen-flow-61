import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineItemStatus } from "@/types/rfq";

interface LineItemStatusSelectProps {
  status: LineItemStatus;
  onStatusChange: (status: LineItemStatus) => void;
  disabled?: boolean;
}

const statusConfig = {
  open: { label: "Open", variant: "secondary" as const, color: "bg-blue-100 text-blue-800" },
  quote_received: { label: "Quote Received", variant: "default" as const, color: "bg-yellow-100 text-yellow-800" },
  submitted: { label: "Submitted", variant: "default" as const, color: "bg-green-100 text-green-800" },
  closed: { label: "Closed", variant: "outline" as const, color: "bg-gray-100 text-gray-800" }
};

export function LineItemStatusSelect({ status, onStatusChange, disabled = false }: LineItemStatusSelectProps) {
  const config = statusConfig[status];

  return (
    <Select value={status} onValueChange={onStatusChange} disabled={disabled}>
      <SelectTrigger className="w-32">
        <SelectValue>
          <Badge className={`${config.color} border-0`}>
            {config.label}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">
          <Badge className="bg-blue-100 text-blue-800 border-0">Open</Badge>
        </SelectItem>
        <SelectItem value="quote_received">
          <Badge className="bg-yellow-100 text-yellow-800 border-0">Quote Received</Badge>
        </SelectItem>
        <SelectItem value="submitted">
          <Badge className="bg-green-100 text-green-800 border-0">Submitted</Badge>
        </SelectItem>
        <SelectItem value="closed">
          <Badge className="bg-gray-100 text-gray-800 border-0">Closed</Badge>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}