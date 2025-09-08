import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Manufacturer, Supplier } from "@/types/suppliers";

interface EditSupplierDialogProps {
  supplier: Supplier | null;
  manufacturers: Manufacturer[];
  isOpen: boolean;
  createMode?: boolean;
  onClose: () => void;
}

export function EditSupplierDialog({
  supplier,
  manufacturers,
  isOpen,
  createMode = false,
  onClose
}: EditSupplierDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState(supplier?.name || "");
  const [description, setDescription] = useState(supplier?.description || "");
  const [selectedManufacturers, setSelectedManufacturers] = useState(supplier?.linkedManufacturerIds || []);

  const manufacturerOptions = manufacturers.map(manufacturer => ({
    label: manufacturer.name,
    value: manufacturer.id
  }));

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // This would integrate with your service layer
    toast({
      title: "Success",
      description: `Supplier ${createMode ? 'created' : 'updated'} successfully`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{createMode ? 'Create' : 'Edit'} Supplier</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-2">
            <Label>Linked Manufacturers</Label>
            <MultiSelect
              options={manufacturerOptions}
              selected={selectedManufacturers}
              onSelectedChange={setSelectedManufacturers}
              placeholder="Select manufacturers..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {createMode ? 'Create' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}