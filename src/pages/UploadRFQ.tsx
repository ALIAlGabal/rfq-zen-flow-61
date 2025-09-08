import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Upload, FileSpreadsheet, Eye, Edit, Plus, Trash2, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useManufacturers, useSuppliers } from "@/hooks/useSuppliers";
import { Checkbox } from "@/components/ui/checkbox";

interface RFQResult {
  id: number;
  manufacturer: string;
  supplier: string;
  emails: string[];
  itemsCount: number;
  items: Array<{
    lineItem: string;
    itemId: string;
    qty: number;
    manufacturer: string;
    supplier: string;
  }>;
}

interface CustomCollection {
  id: number;
  type: "manufacturer" | "supplier";
  selectedEntityId: string;
  name: string;
  selectedContactIds: string[];
  items: Array<{
    lineItem: string;
    itemId: string;
    qty: number;
  }>;
}

export default function UploadRFQ() {
  const [uploaded, setUploaded] = useState(false);
  const [results, setResults] = useState<RFQResult[]>([]);
  const [customCollections, setCustomCollections] = useState<CustomCollection[]>([]);
  const [bidClosingDate, setBidClosingDate] = useState<Date>();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch manufacturers and suppliers data
  const { data: manufacturersData } = useManufacturers({}, { field: 'name', direction: 'asc' }, { page: 1, limit: 100 });
  const { data: suppliersData } = useSuppliers({}, { field: 'name', direction: 'asc' }, { page: 1, limit: 100 });

  const manufacturers = manufacturersData?.data?.data || [];
  const suppliers = suppliersData?.data?.data || [];

  const templates = [
    { id: "standard", name: "Standard RFQ Template" },
    { id: "automotive", name: "Automotive Parts Template" },
    { id: "electronics", name: "Electronics Components Template" },
    { id: "construction", name: "Construction Materials Template" },
    { id: "custom", name: "Custom Template" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload an Excel file (.xlsx or .xls)");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      toast.success(`File "${file.name}" selected successfully`);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = async () => {
    if (!selectedFile || !bidClosingDate || !selectedTemplate) {
      toast.error("Please select a file, set bid closing date, and choose a template");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate file upload and processing results
      setResults([
        {
          id: 1,
          manufacturer: "ACME Manufacturing",
          supplier: "TechSupply Co",
          emails: ["orders@techsupply.com", "procurement@techsupply.com"],
          itemsCount: 5,
          items: [
            { lineItem: "LI001", itemId: "BOLT-M8-100", qty: 100, manufacturer: "ACME Manufacturing", supplier: "TechSupply Co" },
            { lineItem: "LI002", itemId: "WASHER-M8", qty: 100, manufacturer: "ACME Manufacturing", supplier: "TechSupply Co" },
            { lineItem: "LI003", itemId: "NUT-M8", qty: 100, manufacturer: "ACME Manufacturing", supplier: "TechSupply Co" },
            { lineItem: "LI004", itemId: "SCREW-M6-50", qty: 50, manufacturer: "ACME Manufacturing", supplier: "TechSupply Co" },
            { lineItem: "LI005", itemId: "BRACKET-L90", qty: 25, manufacturer: "ACME Manufacturing", supplier: "TechSupply Co" }
          ]
        },
        {
          id: 2,
          manufacturer: "SteelWorks Inc",
          supplier: "MetalSupplies Ltd",
          emails: ["sales@metalsupplies.com"],
          itemsCount: 3,
          items: [
            { lineItem: "LI006", itemId: "PLATE-STEEL-10MM", qty: 10, manufacturer: "SteelWorks Inc", supplier: "MetalSupplies Ltd" },
            { lineItem: "LI007", itemId: "ROD-STEEL-8MM", qty: 20, manufacturer: "SteelWorks Inc", supplier: "MetalSupplies Ltd" },
            { lineItem: "LI008", itemId: "SHEET-AL-2MM", qty: 5, manufacturer: "SteelWorks Inc", supplier: "MetalSupplies Ltd" }
          ]
        }
      ]);
      
      setUploaded(true);
      toast.success(`RFQ file "${selectedFile.name}" processed successfully!`);
    } catch (error) {
      toast.error("Failed to process the file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const addCustomCollection = () => {
    const newCollection: CustomCollection = {
      id: Date.now(),
      type: "manufacturer",
      selectedEntityId: "",
      name: "",
      selectedContactIds: [],
      items: []
    };
    setCustomCollections([...customCollections, newCollection]);
  };

  const updateCustomCollection = (id: number, updates: Partial<CustomCollection>) => {
    setCustomCollections(collections =>
      collections.map(collection => {
        if (collection.id === id) {
          const updatedCollection = { ...collection, ...updates };
          
          // If entity selection changes, update the name and reset contacts
          if (updates.selectedEntityId !== undefined) {
            const entities = updatedCollection.type === 'manufacturer' ? manufacturers : suppliers;
            const selectedEntity = entities.find(entity => entity.id === updates.selectedEntityId);
            if (selectedEntity) {
              updatedCollection.name = selectedEntity.name;
              updatedCollection.selectedContactIds = [];
            }
          }
          
          return updatedCollection;
        }
        return collection;
      })
    );
  };

  const removeCustomCollection = (id: number) => {
    setCustomCollections(collections => collections.filter(c => c.id !== id));
  };

  const addItemToCollection = (collectionId: number) => {
    const newItem = {
      lineItem: "",
      itemId: "",
      qty: 1
    };
    updateCustomCollection(collectionId, {
      items: [...(customCollections.find(c => c.id === collectionId)?.items || []), newItem]
    });
  };

  const removeItemFromCollection = (collectionId: number, itemIndex: number) => {
    const collection = customCollections.find(c => c.id === collectionId);
    if (collection) {
      const updatedItems = collection.items.filter((_, index) => index !== itemIndex);
      updateCustomCollection(collectionId, { items: updatedItems });
    }
  };

  const updateCollectionItem = (collectionId: number, itemIndex: number, field: string, value: string | number) => {
    const collection = customCollections.find(c => c.id === collectionId);
    if (collection) {
      const updatedItems = collection.items.map((item, index) =>
        index === itemIndex ? { ...item, [field]: value } : item
      );
      updateCustomCollection(collectionId, { items: updatedItems });
    }
  };

  const updateCollectionContact = (collectionId: number, contactId: string, checked: boolean) => {
    const collection = customCollections.find(c => c.id === collectionId);
    if (collection) {
      const updatedContactIds = checked 
        ? [...collection.selectedContactIds, contactId]
        : collection.selectedContactIds.filter(id => id !== contactId);
      updateCustomCollection(collectionId, { selectedContactIds: updatedContactIds });
    }
  };

  const getSelectedEntity = (collection: CustomCollection) => {
    const entities = collection.type === 'manufacturer' ? manufacturers : suppliers;
    return entities.find(entity => entity.id === collection.selectedEntityId);
  };

  const getSelectedEntityContacts = (collection: CustomCollection) => {
    const entity = getSelectedEntity(collection);
    return entity?.contacts || [];
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Upload & Split RFQ</h1>
        <p className="text-lg text-gray-600 mt-2">
          Upload Excel files to automatically process and split RFQs by manufacturer and supplier
        </p>
      </div>

      {!uploaded ? (
        <div className="space-y-6">
          <Card className="w-full max-w-3xl mx-auto rounded-2xl shadow-sm border-0 bg-white">
            <CardContent className="p-16">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                onClick={handleUploadClick}
              >
                <FileSpreadsheet className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {selectedFile ? "File Selected" : "Drop RFQ Excel file here or click to upload"}
                </h3>
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg max-w-md mx-auto">
                      <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-700 font-medium">{selectedFile.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="h-6 w-6 p-0 text-blue-600 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600 text-lg">
                      File ready for processing
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 mb-6 text-lg">
                    Supports .xlsx, .xls files up to 10MB
                  </p>
                )}
                {!selectedFile && (
                  <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base font-medium">
                    <Upload className="h-5 w-5 mr-2" />
                    Choose File
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* RFQ Configuration */}
          <Card className="w-full max-w-3xl mx-auto rounded-2xl shadow-sm border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">RFQ Configuration</CardTitle>
              <p className="text-gray-600">Set bid closing date and select template for your RFQ</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bid Closing Date */}
                <div className="space-y-2">
                  <Label htmlFor="bid-date">Bid Closing Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bidClosingDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bidClosingDate ? format(bidClosingDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={bidClosingDate}
                        onSelect={setBidClosingDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-gray-500">
                    Select when bids should be submitted by
                  </p>
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                  <Label htmlFor="template">RFQ Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Template determines the format and fields for your RFQ
                  </p>
                </div>
              </div>

              {/* Process Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={processFile}
                  disabled={!selectedFile || !bidClosingDate || !selectedTemplate || isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Process RFQ
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-8">
          <Card className="rounded-2xl shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-900">Processing Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Email(s)</TableHead>
                    <TableHead>Items Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.manufacturer}</TableCell>
                      <TableCell>{result.supplier}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {result.emails.map((email, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground">{email}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{result.itemsCount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Items
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Items for {result.manufacturer} → {result.supplier}</DialogTitle>
                              </DialogHeader>
                              <div className="max-h-96 overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>LI#</TableHead>
                                      <TableHead>Item ID</TableHead>
                                      <TableHead>Qty</TableHead>
                                      <TableHead>Manufacturer</TableHead>
                                      <TableHead>Supplier</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {result.items.map((item, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell>{item.lineItem}</TableCell>
                                        <TableCell>{item.itemId}</TableCell>
                                        <TableCell>
                                          <Input 
                                            type="number" 
                                            defaultValue={item.qty} 
                                            className="w-20"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Input 
                                            defaultValue={item.manufacturer}
                                            className="min-w-40"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Input 
                                            defaultValue={item.supplier}
                                            className="min-w-40"
                                          />
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              <div className="flex justify-end mt-4">
                                <Button>Save Changes</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Custom Collections Section */}
          <Card className="rounded-2xl shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold text-foreground">Additional Collections</CardTitle>
                <Button onClick={addCustomCollection} className="bg-primary hover:bg-primary-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Collection
                </Button>
              </div>
              <p className="text-muted-foreground">Create custom collections with specific manufacturers or suppliers</p>
            </CardHeader>
            <CardContent>
              {customCollections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No custom collections yet. Click "Add Collection" to create one.
                </div>
              ) : (
                <div className="space-y-6">
                  {customCollections.map((collection) => (
                    <Card key={collection.id} className="border border-border">
                      <CardContent className="p-6">
                          <div className="space-y-4">
                          {/* Collection Header */}
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-2 gap-4 flex-1">
                              <div>
                                <Label htmlFor={`type-${collection.id}`}>Type</Label>
                                <Select
                                  value={collection.type}
                                  onValueChange={(value: "manufacturer" | "supplier") =>
                                    updateCustomCollection(collection.id, { 
                                      type: value,
                                      selectedEntityId: "",
                                      name: "",
                                      selectedContactIds: []
                                    })
                                  }
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white z-50">
                                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                                    <SelectItem value="supplier">Supplier</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor={`entity-${collection.id}`}>
                                  {collection.type === 'manufacturer' ? 'Manufacturer' : 'Supplier'}
                                </Label>
                                <Select
                                  value={collection.selectedEntityId}
                                  onValueChange={(value) =>
                                    updateCustomCollection(collection.id, { selectedEntityId: value })
                                  }
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder={`Select ${collection.type}`} />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white z-50">
                                    {(collection.type === 'manufacturer' ? manufacturers : suppliers)
                                      .filter(entity => entity.status === 'active')
                                      .map((entity) => (
                                        <SelectItem key={entity.id} value={entity.id}>
                                          {entity.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeCustomCollection(collection.id)}
                              className="ml-4 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Contacts Section */}
                          {collection.selectedEntityId && (
                            <div>
                              <Label>Select Contacts</Label>
                              <div className="mt-2 space-y-3 max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                                {getSelectedEntityContacts(collection).length > 0 ? (
                                  getSelectedEntityContacts(collection).map((contact) => (
                                    <div key={contact.id} className="flex items-center space-x-3 p-2 bg-white rounded border">
                                      <Checkbox
                                        id={`contact-${collection.id}-${contact.id}`}
                                        checked={collection.selectedContactIds.includes(contact.id)}
                                        onCheckedChange={(checked) =>
                                          updateCollectionContact(collection.id, contact.id, checked as boolean)
                                        }
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-sm">{contact.name}</span>
                                          <span className="text-xs text-gray-500">({contact.role})</span>
                                          {contact.isPrimary && (
                                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                                              Primary
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-600 truncate">{contact.email}</div>
                                        {contact.phone && (
                                          <div className="text-xs text-gray-500">{contact.phone}</div>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-sm text-gray-500 text-center py-4">
                                    No contacts available for this {collection.type}
                                  </div>
                                )}
                              </div>
                              {collection.selectedContactIds.length > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                  {collection.selectedContactIds.length} contact(s) selected
                                </div>
                              )}
                            </div>
                          )}

                          {/* Items Section */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <Label>Items</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addItemToCollection(collection.id)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                              </Button>
                            </div>
                            {collection.items.length === 0 ? (
                              <div className="text-center py-4 text-muted-foreground bg-muted rounded-lg">
                                No items added yet
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {collection.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="grid grid-cols-4 gap-3 items-center p-3 border border-border rounded-lg">
                                    <div>
                                      <Label className="text-xs">Line Item</Label>
                                      <Input
                                        value={item.lineItem}
                                        onChange={(e) =>
                                          updateCollectionItem(collection.id, itemIndex, "lineItem", e.target.value)
                                        }
                                        placeholder="LI001"
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Item ID</Label>
                                      <Input
                                        value={item.itemId}
                                        onChange={(e) =>
                                          updateCollectionItem(collection.id, itemIndex, "itemId", e.target.value)
                                        }
                                        placeholder="PART-123"
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Quantity</Label>
                                      <Input
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) =>
                                          updateCollectionItem(collection.id, itemIndex, "qty", parseInt(e.target.value) || 0)
                                        }
                                        min="1"
                                        className="mt-1"
                                      />
                                    </div>
                                    <div className="flex justify-end">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeItemFromCollection(collection.id, itemIndex)}
                                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-0 bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Ready to send RFQs</h3>
                  <p className="text-muted-foreground mt-1">
                    {results.length + customCollections.length} collections ready to send
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" className="px-6">Cancel</Button>
                  <Button variant="secondary" className="px-6">Save Draft</Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                    onClick={() => {
                      // Clear the uploaded file after sending
                      if (selectedFile) {
                        handleRemoveFile();
                        toast.success("RFQs sent successfully! File has been removed.");
                        // Reset the form
                        setUploaded(false);
                        setResults([]);
                        setCustomCollections([]);
                        setBidClosingDate(undefined);
                        setSelectedTemplate("");
                      }
                    }}
                  >
                    Approve & Send All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}