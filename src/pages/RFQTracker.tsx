import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExpandableRFQRow } from "@/components/ExpandableRFQRow";
import { Search, Filter, FileText, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { RFQRecord, LineItem } from "@/types/rfq";
import { useToast } from "@/hooks/use-toast";

export default function RFQTracker() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [rfqs, setRfqs] = useState<RFQRecord[]>([
    {
      id: "1",
      rfqNo: "RFQ-2024-001",
      client: "TechCorp Inc",
      publishDate: "2024-01-15",
      bidDate: "2024-01-25",
      status: "open",
      lastUpdated: "2024-01-16",
      isExpanded: false,
      lineItems: [
        {
          id: "li-1-1",
          lineNumber: "LI001",
          itemId: "901366446",
          manufacturer: "CLA-VAL COMPANY",
          supplier: "",
          email: "info@cla-val.com",
          status: "open",
          qty: 5
        },
        {
          id: "li-1-2", 
          lineNumber: "LI002",
          itemId: "901366447",
          manufacturer: "ABB",
          supplier: "XYZ Supplier",
          email: "sales@xyz.com",
          status: "quote_received",
          qty: 10
        },
        {
          id: "li-1-3",
          lineNumber: "LI003", 
          itemId: "901366448",
          manufacturer: "ABB",
          supplier: "ABC Supplier",
          email: "abc@abc.com",
          status: "open",
          qty: 3
        }
      ]
    },
    {
      id: "2", 
      rfqNo: "RFQ-2024-002",
      client: "ManufacturingCo Ltd",
      publishDate: "2024-01-14",
      bidDate: "2024-01-24",
      status: "submitted",
      lastUpdated: "2024-01-20",
      isExpanded: false,
      lineItems: [
        {
          id: "li-2-1",
          lineNumber: "LI001",
          itemId: "BOLT-M8-100", 
          manufacturer: "ACME Manufacturing",
          supplier: "TechSupply Co",
          email: "orders@techsupply.com",
          status: "submitted",
          qty: 100
        },
        {
          id: "li-2-2",
          lineNumber: "LI002",
          itemId: "WASHER-M8",
          manufacturer: "ACME Manufacturing", 
          supplier: "TechSupply Co",
          email: "orders@techsupply.com",
          status: "submitted",
          qty: 100
        }
      ]
    },
    {
      id: "3",
      rfqNo: "RFQ-2024-003", 
      client: "BuildRight Solutions",
      publishDate: "2024-01-13",
      bidDate: "2024-01-23",
      status: "pending",
      lastUpdated: "2024-01-18",
      isExpanded: false,
      lineItems: [
        {
          id: "li-3-1",
          lineNumber: "LI001",
          itemId: "PLATE-STEEL-10MM",
          manufacturer: "SteelWorks Inc",
          supplier: "MetalSupplies Ltd",
          email: "sales@metalsupplies.com",
          status: "quote_received",
          qty: 10
        }
      ]
    },
    {
      id: "4",
      rfqNo: "RFQ-2024-004",
      client: "Industrial Systems",
      publishDate: "2024-01-10",
      bidDate: "2024-01-20",
      status: "closed",
      lastUpdated: "2024-01-21",
      isExpanded: false,
      lineItems: [
        {
          id: "li-4-1",
          lineNumber: "LI001",
          itemId: "BRACKET-L90",
          manufacturer: "Precision Parts Ltd",
          supplier: "Industrial Parts Co",
          email: "info@industrialparts.com",
          status: "closed",
          qty: 25
        },
        {
          id: "li-4-2",
          lineNumber: "LI002",
          itemId: "SCREW-M6-50", 
          manufacturer: "Precision Parts Ltd",
          supplier: "Industrial Parts Co",
          email: "info@industrialparts.com",
          status: "closed",
          qty: 50
        }
      ]
    },
    {
      id: "5",
      rfqNo: "RFQ-2024-005",
      client: "MetalWorks Corp",
      publishDate: "2024-01-12",
      bidDate: "2024-01-22",
      status: "open",
      lastUpdated: "2024-01-17",
      isExpanded: false,
      lineItems: [
        {
          id: "li-5-1",
          lineNumber: "LI001",
          itemId: "ROD-STEEL-8MM",
          manufacturer: "SteelWorks Inc",
          supplier: "",
          email: "",
          status: "open",
          qty: 20
        }
      ]
    }
  ]);

  const handleToggleExpand = (rfqId: string) => {
    setRfqs(prev => prev.map(rfq => 
      rfq.id === rfqId 
        ? { ...rfq, isExpanded: !rfq.isExpanded }
        : rfq
    ));
  };

  const handleUpdateLineItem = (rfqId: string, itemId: string, updates: Partial<LineItem>) => {
    setRfqs(prev => prev.map(rfq => 
      rfq.id === rfqId 
        ? {
            ...rfq,
            lineItems: rfq.lineItems.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : rfq
    ));
  };

  const filteredRFQs = rfqs.filter(rfq => {
    const searchLower = searchTerm.toLowerCase();
    return (
      rfq.rfqNo.toLowerCase().includes(searchLower) ||
      rfq.client.toLowerCase().includes(searchLower) ||
      rfq.lineItems.some(item => 
        item.manufacturer.toLowerCase().includes(searchLower) ||
        item.supplier.toLowerCase().includes(searchLower) ||
        item.itemId.toLowerCase().includes(searchLower)
      )
    );
  });

  // Calculate stats
  const totalItems = rfqs.reduce((acc, rfq) => acc + rfq.lineItems.length, 0);
  const quotesReceived = rfqs.reduce((acc, rfq) => acc + rfq.lineItems.filter(item => item.status === "quote_received").length, 0);
  const itemsCompleted = rfqs.reduce((acc, rfq) => acc + rfq.lineItems.filter(item => item.status === "closed").length, 0);
  const openItems = rfqs.reduce((acc, rfq) => acc + rfq.lineItems.filter(item => item.status === "open").length, 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-background to-muted/30 -mx-6 -mt-6 px-6 pt-6 pb-8 border-b">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">RFQ Tracker</h1>
          <p className="text-muted-foreground">
            Track status and manage all your RFQ submissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total RFQs</p>
                <p className="text-2xl font-bold text-foreground">{rfqs.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-l-4 border-l-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Items</p>
                <p className="text-2xl font-bold text-foreground">{openItems}</p>
              </div>
              <div className="h-8 w-8 bg-warning/10 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quotes Received</p>
                <p className="text-2xl font-bold text-foreground">{quotesReceived}</p>
              </div>
              <div className="h-8 w-8 bg-success/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-l-4 border-l-muted-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{itemsCompleted}</p>
              </div>
              <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">RFQ Submissions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredRFQs.length} of {rfqs.length} RFQs shown
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search RFQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-background"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredRFQs.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No RFQs found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Your RFQs will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="font-semibold">RFQ Details</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Dates</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Last Updated</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRFQs.map((rfq) => (
                    <ExpandableRFQRow
                      key={rfq.id}
                      rfq={rfq}
                      onToggleExpand={handleToggleExpand}
                      onUpdateLineItem={handleUpdateLineItem}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}