import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExpandableRFQRow } from "@/components/ExpandableRFQRow";
import { Search, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, X, Filter } from "lucide-react";
import { RFQRecord, LineItem } from "@/types/rfq";
import { useToast } from "@/hooks/use-toast";
import { useRFQs, useRFQStats, useUpdateLineItem } from "@/hooks/useRFQs";

// RFQ Filters interface
export interface RFQFilters {
  status?: string;
  client?: string;
  rfqNo?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function RFQTracker() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<RFQFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRFQs, setExpandedRFQs] = useState<Set<string>>(new Set());

  // Use RFQ hooks with proper typing
  const rfqFilters = {
    ...filters,
    search: searchTerm,
    // Map RFQ status to supplier FilterParams format if needed
    status: filters.status === 'all' ? undefined : filters.status
  };
  
  const { data: rfqsResponse, isLoading: rfqsLoading } = useRFQs(
    rfqFilters as any, // Type assertion for now since RFQ filters differ from supplier filters
    { field: 'publishDate', direction: 'desc' },
    { page: 1, limit: 100 } // Get all RFQs for now
  );
  
  const { data: statsResponse } = useRFQStats();
  const updateLineItemMutation = useUpdateLineItem();

  const rfqs = rfqsResponse?.success ? rfqsResponse.data?.data || [] : [];
  const stats = statsResponse?.success ? statsResponse.data : null;

  const handleFilterChange = (key: keyof RFQFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'all');
  const activeFilterCount = Object.values(filters).filter(value => value && value !== 'all').length;

  const handleToggleExpand = (rfqId: string) => {
    setExpandedRFQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rfqId)) {
        newSet.delete(rfqId);
      } else {
        newSet.add(rfqId);
      }
      return newSet;
    });
  };

  const handleUpdateLineItem = (rfqId: string, itemId: string, updates: Partial<LineItem>) => {
    updateLineItemMutation.mutate({
      rfqId,
      lineItemId: itemId,
      updates
    });
  };

  // Apply client-side filtering for immediate feedback (API filtering is also available)
  const filteredRFQs = rfqs.filter(rfq => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search filter (redundant with API but provides immediate feedback)
    const matchesSearch = !searchTerm || (
      rfq.rfqNo.toLowerCase().includes(searchLower) ||
      rfq.client.toLowerCase().includes(searchLower) ||
      rfq.lineItems.some(item => 
        item.manufacturer.toLowerCase().includes(searchLower) ||
        item.supplier.toLowerCase().includes(searchLower) ||
        item.itemId.toLowerCase().includes(searchLower)
      )
    );

    // Additional client-side filters for immediate feedback
    const matchesStatus = !filters.status || filters.status === 'all' || rfq.status === filters.status;
    const matchesClient = !filters.client || rfq.client.toLowerCase().includes(filters.client.toLowerCase());
    const matchesRFQNo = !filters.rfqNo || rfq.rfqNo.toLowerCase().includes(filters.rfqNo.toLowerCase());
    const matchesDateFrom = !filters.dateFrom || new Date(rfq.publishDate) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(rfq.publishDate) <= new Date(filters.dateTo);

    return matchesSearch && matchesStatus && matchesClient && matchesRFQNo && matchesDateFrom && matchesDateTo;
  });

  // Add isExpanded property to RFQs for display
  const displayRFQs = filteredRFQs.map(rfq => ({
    ...rfq,
    isExpanded: expandedRFQs.has(rfq.id)
  }));

  // Calculate stats (use API stats if available, fallback to local calculation)
  const totalRFQs = stats?.totalRFQs ?? rfqs.length;
  const openItems = stats ? (stats.totalLineItems - (stats.closedRFQs + stats.submittedRFQs)) : 
    rfqs.reduce((acc, rfq) => acc + rfq.lineItems.filter(item => item.status === "open").length, 0);
  const quotesReceived = rfqs.reduce((acc, rfq) => acc + rfq.lineItems.filter(item => item.status === "quote_received").length, 0);
  const itemsCompleted = rfqs.reduce((acc, rfq) => acc + rfq.lineItems.filter(item => item.status === "closed").length, 0);

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
                <p className="text-2xl font-bold text-foreground">{totalRFQs}</p>
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">RFQ Submissions</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {rfqsLoading ? 'Loading...' : `${filteredRFQs.length} of ${rfqs.length} RFQs shown`}
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Inline Filters Section */}
            {showFilters && (
              <div className="border-t pt-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={filters.status || 'all'}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      placeholder="Filter by client"
                      value={filters.client || ''}
                      onChange={(e) => handleFilterChange('client', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rfqNo">RFQ Number</Label>
                    <Input
                      id="rfqNo"
                      placeholder="Filter by RFQ #"
                      value={filters.rfqNo || ''}
                      onChange={(e) => handleFilterChange('rfqNo', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFrom">From Date</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateTo">To Date</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={handleClearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {rfqsLoading ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 animate-pulse">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">Loading RFQs...</h3>
              <p className="text-muted-foreground">Please wait while we fetch your data</p>
            </div>
          ) : filteredRFQs.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No RFQs found</h3>
              <p className="text-muted-foreground">
                {searchTerm || Object.values(filters).some(v => v) ? "Try adjusting your search terms or filters" : "Your RFQs will appear here"}
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
                  {displayRFQs.map((rfq) => (
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