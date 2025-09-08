import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Manufacturer, Supplier, Contact, Address } from "@/types/suppliers";
import { useCreateManufacturer, useUpdateManufacturer } from "@/hooks/useSuppliers";

interface EditManufacturerDialogProps {
  manufacturer: Manufacturer | null;
  suppliers: Supplier[];
  isOpen: boolean;
  createMode?: boolean;
  onClose: () => void;
}

export function EditManufacturerDialog({
  manufacturer,
  suppliers,
  isOpen,
  createMode = false,
  onClose
}: EditManufacturerDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateManufacturer();
  const updateMutation = useUpdateManufacturer();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  useEffect(() => {
    if (manufacturer && !createMode) {
      setName(manufacturer.name);
      setDescription(manufacturer.description || "");
      setIndustry(manufacturer.industry);
      setWebsite(manufacturer.website || "");
      setEmails(manufacturer.contacts.map(c => c.email));
      setSelectedSuppliers(manufacturer.linkedSupplierIds);
    } else {
      // Reset for create mode
      setName("");
      setDescription("");
      setIndustry("");
      setWebsite("");
      setEmails([""]);
      setSelectedSuppliers([]);
    }
  }, [manufacturer, createMode]);

  const supplierOptions = suppliers.map(supplier => ({
    label: supplier.name,
    value: supplier.id
  }));

  const addEmailField = () => setEmails([...emails, ""]);
  const removeEmailField = (index: number) => setEmails(emails.filter((_, i) => i !== index));
  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSave = async () => {
    const filteredEmails = emails.filter(email => email.trim() !== "");
    if (!name.trim() || filteredEmails.length === 0 || !industry.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const contacts: Contact[] = filteredEmails.map((email, index) => ({
      id: `contact-${Date.now()}-${index}`,
      name: "Contact Person",
      email: email.trim(),
      role: "Primary Contact",
      isPrimary: index === 0
    }));

    const address: Address = {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: ""
    };

    const manufacturerData = {
      name: name.trim(),
      description: description.trim(),
      industry: industry.trim(),
      website: website.trim(),
      address,
      contacts,
      linkedSupplierIds: selectedSuppliers,
      capabilities: [],
      certifications: [],
      status: 'active' as const
    };

    if (createMode) {
      createMutation.mutate(manufacturerData);
    } else if (manufacturer) {
      updateMutation.mutate({ 
        id: manufacturer.id, 
        updates: manufacturerData 
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{createMode ? "Create" : "Edit"} Manufacturer</DialogTitle>
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
            <Label htmlFor="industry">Industry *</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Aerospace & Defense"
            />
          </div>

          <div className="space-y-2">
            <Label>Email Addresses *</Label>
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  placeholder="Enter email address"
                  type="email"
                />
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEmailField}
              className="w-fit"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Email
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Linked Suppliers</Label>
            <MultiSelect
              options={supplierOptions}
              selected={selectedSuppliers}
              onSelectedChange={setSelectedSuppliers}
              placeholder="Select suppliers..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMode ? "Create" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}