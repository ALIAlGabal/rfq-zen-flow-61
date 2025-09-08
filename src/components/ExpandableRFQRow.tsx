import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { LineItemRow } from "./LineItemRow";
import { LineItemStatusSelect } from "./LineItemStatusSelect";
import { ChevronDown, ChevronRight, Calendar, Building2, Clock } from "lucide-react";
import { RFQRecord, LineItem, LineItemStatus } from "@/types/rfq";
import { useToast } from "@/hooks/use-toast";

interface ExpandableRFQRowProps {
  rfq: RFQRecord;
  onToggleExpand: (rfqId: string) => void;
  onUpdateLineItem: (rfqId: string, itemId: string, updates: Partial<LineItem>) => void;
}

export function ExpandableRFQRow({ rfq, onToggleExpand, onUpdateLineItem }: ExpandableRFQRowProps) {
  const { toast } = useToast();
  
  const handleLineItemUpdate = (itemId: string, updates: Partial<LineItem>) => {
    onUpdateLineItem(rfq.id, itemId, updates);
  };

  const handleStatusChange = (itemId: string, status: LineItemStatus) => {
    handleLineItemUpdate(itemId, { status });
    toast({
      title: "Status Updated",
      description: `Item status changed to ${status.replace('_', ' ')}`
    });
  };

  // Calculate overall status based on line items
  const getOverallStatus = () => {
    if (rfq.lineItems.every(item => item.status === "closed")) return "closed";
    if (rfq.lineItems.some(item => item.status === "submitted")) return "submitted";
    if (rfq.lineItems.some(item => item.status === "quote_received")) return "pending";
    return "open";
  };

  const overallStatus = getOverallStatus();
  const itemsCount = rfq.lineItems.length;
  const openItems = rfq.lineItems.filter(item => item.status === "open").length;
  const quotesReceived = rfq.lineItems.filter(item => item.status === "quote_received").length;

  return (
    <>
      {/* Main RFQ Row */}
      <TableRow 
        className="hover:bg-muted/30 cursor-pointer transition-colors border-b" 
        onClick={() => onToggleExpand(rfq.id)}
      >
        <TableCell className="py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
              {rfq.isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <div>
              <div className="font-semibold text-foreground">{rfq.rfqNo}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {itemsCount} items
                </span>
                {openItems > 0 && (
                  <Badge variant="outline" className="h-5 text-xs">
                    {openItems} open
                  </Badge>
                )}
                {quotesReceived > 0 && (
                  <Badge variant="outline" className="h-5 text-xs bg-success/10 text-success border-success/20">
                    {quotesReceived} quotes
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </TableCell>
        
        <TableCell className="py-4">
          <div className="font-medium text-foreground">{rfq.client}</div>
        </TableCell>
        
        <TableCell className="py-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              Published: {rfq.publishDate}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Bid Due: {rfq.bidDate}
            </div>
          </div>
        </TableCell>
        
        <TableCell className="py-4">
          <StatusBadge status={overallStatus} />
        </TableCell>
        
        <TableCell className="py-4 text-sm text-muted-foreground">
          {rfq.lastUpdated}
        </TableCell>
        
        <TableCell className="py-4 text-right">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(rfq.id);
            }}
            className="text-xs"
          >
            {rfq.isExpanded ? "Collapse" : "View Items"}
          </Button>
        </TableCell>
      </TableRow>

      {/* Expanded Line Items */}
      {rfq.isExpanded && (
        <TableRow>
          <TableCell colSpan={6} className="p-0 bg-muted/20">
            <div className="p-4">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-foreground mb-2">Line Items</h4>
                <div className="border rounded-lg overflow-hidden bg-background">
                  <div className="grid grid-cols-8 gap-4 px-4 py-3 bg-muted/30 border-b text-xs font-medium text-muted-foreground">
                    <div>Line #</div>
                    <div>Item ID</div>
                    <div>Manufacturer</div>
                    <div>Supplier</div>
                    <div>Email</div>
                    <div>Status</div>
                    <div className="text-center">Qty</div>
                    <div className="text-center">Actions</div>
                  </div>
                  {rfq.lineItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-8 gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors text-sm">
                      <div className="font-medium">{item.lineNumber}</div>
                      <div className="font-mono text-muted-foreground">{item.itemId}</div>
                      <div>{item.manufacturer}</div>
                      <div>{item.supplier || "—"}</div>
                      <div className="text-muted-foreground">{item.email || "—"}</div>
                      <div>
                        <LineItemStatusSelect
                          status={item.status}
                          onStatusChange={(status) => handleStatusChange(item.id, status)}
                        />
                      </div>
                      <div className="text-center">{item.qty}</div>
                      <div className="text-center">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}