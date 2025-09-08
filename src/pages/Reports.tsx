import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, FileText, Calendar, Filter } from "lucide-react";

interface ReportRecord {
  id: string;
  client: string;
  buyer: string;
  rfqDate: string;
  bcd: string;
  rfqNo: string;
  manufacturer: string;
  supplier: string;
  totalLineItems: number;
  status: "open" | "submitted" | "closed" | "pending";
}

export default function Reports() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [reports] = useState<ReportRecord[]>([
    {
      id: "1",
      client: "TechCorp Inc",
      buyer: "John Smith",
      rfqDate: "2024-01-15",
      bcd: "2024-01-25",
      rfqNo: "RFQ-2024-001",
      manufacturer: "ACME Manufacturing",
      supplier: "TechSupply Co",
      totalLineItems: 5,
      status: "open"
    },
    {
      id: "2",
      client: "ManufacturingCo Ltd", 
      buyer: "Sarah Johnson",
      rfqDate: "2024-01-14",
      bcd: "2024-01-24",
      rfqNo: "RFQ-2024-002",
      manufacturer: "SteelWorks Inc",
      supplier: "MetalSupplies Ltd",
      totalLineItems: 3,
      status: "submitted"
    },
    {
      id: "3",
      client: "BuildRight Solutions",
      buyer: "Mike Davis",
      rfqDate: "2024-01-13",
      bcd: "2024-01-23", 
      rfqNo: "RFQ-2024-003",
      manufacturer: "Precision Parts Ltd",
      supplier: "TechSupply Co",
      totalLineItems: 8,
      status: "pending"
    },
    {
      id: "4",
      client: "Industrial Systems",
      buyer: "Lisa Chen",
      rfqDate: "2024-01-10",
      bcd: "2024-01-20",
      rfqNo: "RFQ-2024-004",
      manufacturer: "ACME Manufacturing",
      supplier: "Industrial Parts Co",
      totalLineItems: 12,
      status: "closed"
    }
  ]);

  const clients = [...new Set(reports.map(r => r.client))];

  // Filter reports based on selected criteria
  const filteredReports = reports.filter(report => {
    const clientMatch = selectedClient === "all" || report.client === selectedClient;
    const statusMatch = selectedStatus === "all" || report.status === selectedStatus;
    
    let dateMatch = true;
    if (dateRange.from || dateRange.to) {
      const reportDate = new Date(report.rfqDate);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      
      if (fromDate && reportDate < fromDate) dateMatch = false;
      if (toDate && reportDate > toDate) dateMatch = false;
    }
    
    return clientMatch && statusMatch && dateMatch;
  });

  const handleResetFilters = () => {
    setSelectedClient("all");
    setSelectedStatus("all");
    setDateRange({ from: "", to: "" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Reports</h1>
        <p className="text-lg text-gray-600 mt-2">
          Generate and export comprehensive RFQ reports
        </p>
      </div>

      <Card className="rounded-2xl shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">Date From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Date To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client} value={client}>{client}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              className="border-gray-200 rounded-xl"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-gray-200 rounded-xl px-6">
                <Download className="h-4 w-4 mr-2" />
                Download Excel
              </Button>
              <Button variant="outline" className="border-gray-200 rounded-xl px-6">
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-gray-900">Report Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>RFQ Date</TableHead>
                  <TableHead>BCD</TableHead>
                  <TableHead>RFQ No</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Total Line Items</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.client}</TableCell>
                    <TableCell>{report.buyer}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {report.rfqDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {report.bcd}
                      </div>
                    </TableCell>
                    <TableCell>{report.rfqNo}</TableCell>
                    <TableCell>{report.manufacturer}</TableCell>
                    <TableCell>{report.supplier}</TableCell>
                    <TableCell className="text-center">{report.totalLineItems}</TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reports found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-gray-900">{reports.length}</div>
            <p className="text-sm text-gray-600 mt-1">Total Records</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-gray-900">
              {reports.reduce((sum, r) => sum + r.totalLineItems, 0)}
            </div>
            <p className="text-sm text-gray-600 mt-1">Total Line Items</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-gray-900">{clients.length}</div>
            <p className="text-sm text-gray-600 mt-1">Unique Clients</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}