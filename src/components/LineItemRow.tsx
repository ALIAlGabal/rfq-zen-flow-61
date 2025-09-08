import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineItemStatusSelect } from "./LineItemStatusSelect";
import { Edit, Save, X } from "lucide-react";
import { LineItem, LineItemStatus } from "@/types/rfq";
import { useToast } from "@/hooks/use-toast";

interface LineItemRowProps {
  item: LineItem;
  onUpdate: (itemId: string, updates: Partial<LineItem>) => void;
}

export function LineItemRow({ item, onUpdate }: LineItemRowProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    supplier: item.supplier,
    email: item.email,
    qty: item.qty
  });

  const handleStatusChange = (status: LineItemStatus) => {
    onUpdate(item.id, { status });
    toast({
      title: "Status Updated",
      description: `Item ${item.lineNumber} status changed to ${status.replace('_', ' ')}`
    });
  };

  const handleSave = () => {
    onUpdate(item.id, editValues);
    setIsEditing(false);
    toast({
      title: "Item Updated",
      description: `Line item ${item.lineNumber} has been updated`
    });
  };

  const handleCancel = () => {
    setEditValues({
      supplier: item.supplier,
      email: item.email,
      qty: item.qty
    });
    setIsEditing(false);
  };

  return (
    <TableRow className="bg-muted/30">
      <TableCell className="pl-8 text-sm text-muted-foreground">
        {item.lineNumber}
      </TableCell>
      <TableCell className="text-sm font-mono">
        {item.itemId}
      </TableCell>
      <TableCell className="text-sm">
        {item.manufacturer}
      </TableCell>
      <TableCell className="text-sm">
        {isEditing ? (
          <Input
            value={editValues.supplier}
            onChange={(e) => setEditValues(prev => ({ ...prev, supplier: e.target.value }))}
            className="h-8 text-sm"
            placeholder="Supplier name"
          />
        ) : (
          item.supplier || "—"
        )}
      </TableCell>
      <TableCell className="text-sm">
        {isEditing ? (
          <Input
            type="email"
            value={editValues.email}
            onChange={(e) => setEditValues(prev => ({ ...prev, email: e.target.value }))}
            className="h-8 text-sm"
            placeholder="supplier@email.com"
          />
        ) : (
          item.email || "—"
        )}
      </TableCell>
      <TableCell>
        <LineItemStatusSelect
          status={item.status}
          onStatusChange={handleStatusChange}
          disabled={isEditing}
        />
      </TableCell>
      <TableCell className="text-sm text-center">
        {isEditing ? (
          <Input
            type="number"
            value={editValues.qty}
            onChange={(e) => setEditValues(prev => ({ ...prev, qty: parseInt(e.target.value) || 0 }))}
            className="h-8 w-16 text-center text-sm"
            min="0"
          />
        ) : (
          item.qty
        )}
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                className="h-7 px-2"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                className="h-7 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="h-7 px-2"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}