import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Edit, Mail, Building2, Factory, Search, Filter, Download, 
  MoreHorizontal, Trash2, Eye, ExternalLink, Users, TrendingUp, ChevronLeft, ChevronRight
} from "lucide-react";
import { EditManufacturerDialog } from "@/components/EditManufacturerDialog";
import { EditSupplierDialog } from "@/components/EditSupplierDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  useManufacturers, 
  useSuppliers, 
  useSupplierStats,
  useDeleteManufacturer,
  useDeleteSupplier,
  useBulkAction,
  useExportData
} from "@/hooks/useSuppliers";
import { Manufacturer, Supplier, FilterParams, SortParams, PaginationParams } from "@/types/suppliers";
import { 
  formatAddress, 
  getStatusColor, 
  getStatusLabel, 
  getPrimaryContact,
  getLinkedEntityNames,
  formatDate
} from "@/utils/supplierUtils";

export default function Suppliers() {
  const { toast } = useToast();
  
  // State for filters and pagination
  const [manufacturerFilters, setManufacturerFilters] = useState<FilterParams>({});
  const [supplierFilters, setSupplierFilters] = useState<FilterParams>({});
  const [manufacturerSort, setManufacturerSort] = useState<SortParams>({ field: 'name', direction: 'asc' });
  const [supplierSort, setSupplierSort] = useState<SortParams>({ field: 'name', direction: 'asc' });
  const [manufacturerPagination, setManufacturerPagination] = useState<PaginationParams>({ page: 1, limit: 10 });
  const [supplierPagination, setSupplierPagination] = useState<PaginationParams>({ page: 1, limit: 10 });
  
  // State for dialogs and selections
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isManufacturerDialogOpen, setIsManufacturerDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [createMode, setCreateMode] = useState<'manufacturer' | 'supplier' | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Data fetching
  const { data: manufacturersResponse, isLoading: manufacturersLoading, error: manufacturersError } = 
    useManufacturers(manufacturerFilters, manufacturerSort, manufacturerPagination);
  const { data: suppliersResponse, isLoading: suppliersLoading, error: suppliersError } = 
    useSuppliers(supplierFilters, supplierSort, supplierPagination);
  const { data: statsResponse, isLoading: statsLoading } = useSupplierStats();

  // Get all data for cross-references
  const { data: allManufacturersResponse } = useManufacturers({}, { field: 'name', direction: 'asc' }, { page: 1, limit: 1000 });
  const { data: allSuppliersResponse } = useSuppliers({}, { field: 'name', direction: 'asc' }, { page: 1, limit: 1000 });

  // Mutations
  const deleteManufacturer = useDeleteManufacturer();
  const deleteSupplier = useDeleteSupplier();
  const bulkAction = useBulkAction();
  const exportData = useExportData();

  const manufacturers = manufacturersResponse?.success ? manufacturersResponse.data?.data || [] : [];
  const suppliers = suppliersResponse?.success ? suppliersResponse.data?.data || [] : [];
  const allManufacturers = allManufacturersResponse?.success ? allManufacturersResponse.data?.data || [] : [];
  const allSuppliers = allSuppliersResponse?.success ? allSuppliersResponse.data?.data || [] : [];
  const stats = statsResponse?.success ? statsResponse.data : null;

  // Handlers
  const handleEditManufacturer = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
    setCreateMode(null);
    setIsManufacturerDialogOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setCreateMode(null);
    setIsSupplierDialogOpen(true);
  };

  const handleCreateNew = (type: 'manufacturer' | 'supplier') => {
    setCreateMode(type);
    if (type === 'manufacturer') {
      setEditingManufacturer(null);
      setIsManufacturerDialogOpen(true);
    } else {
      setEditingSupplier(null);
      setIsSupplierDialogOpen(true);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setManufacturerFilters(prev => ({ ...prev, search: term }));
    setSupplierFilters(prev => ({ ...prev, search: term }));
    setManufacturerPagination(prev => ({ ...prev, page: 1 }));
    setSupplierPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status: string, type: 'manufacturer' | 'supplier') => {
    const statusValue = status === 'all' ? undefined : status as any;
    if (type === 'manufacturer') {
      setManufacturerFilters(prev => ({ ...prev, status: statusValue }));
      setManufacturerPagination(prev => ({ ...prev, page: 1 }));
    } else {
      setSupplierFilters(prev => ({ ...prev, status: statusValue }));
      setSupplierPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const handleDelete = (id: string, type: 'manufacturer' | 'supplier') => {
    if (type === 'manufacturer') {
      deleteManufacturer.mutate(id);
    } else {
      deleteSupplier.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to delete",
        variant: "destructive",
      });
      return;
    }

    bulkAction.mutate({
      action: 'delete',
      ids: selectedItems
    });
    setSelectedItems([]);
  };

  const handleExport = (type: 'manufacturers' | 'suppliers' | 'all') => {
    exportData.mutate(type);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAll = (items: (Manufacturer | Supplier)[], checked: boolean) => {
    const ids = items.map(item => item.id);
    if (checked) {
      setSelectedItems(prev => [...new Set([...prev, ...ids])]);
    } else {
      setSelectedItems(prev => prev.filter(id => !ids.includes(id)));
    }
  };

  const renderManufacturerTable = () => {
    if (manufacturersLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
    }

    if (manufacturersError) {
      return (
        <div className="text-center py-8 text-red-600">
          Failed to load manufacturers. Please try again.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={manufacturers.length > 0 && manufacturers.every(m => selectedItems.includes(m.id))}
                  onCheckedChange={(checked) => handleSelectAll(manufacturers, checked as boolean)}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Linked Suppliers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manufacturers.map((manufacturer) => {
              const primaryContact = getPrimaryContact(manufacturer.contacts);
              const linkedSupplierNames = getLinkedEntityNames(manufacturer.linkedSupplierIds, allSuppliers);
              
              return (
                <TableRow key={manufacturer.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(manufacturer.id)}
                      onCheckedChange={(checked) => handleSelectItem(manufacturer.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{manufacturer.name}</div>
                      <div className="text-sm text-muted-foreground">{manufacturer.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{manufacturer.industry}</Badge>
                  </TableCell>
                  <TableCell>
                    {primaryContact ? (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{primaryContact.name}</div>
                        <div className="text-sm text-muted-foreground">{primaryContact.email}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No contact</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {linkedSupplierNames.slice(0, 2).map((name, idx) => (
                        <div key={idx} className="text-sm">{name}</div>
                      ))}
                      {linkedSupplierNames.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{linkedSupplierNames.length - 2} more
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(manufacturer.status)}>
                      {getStatusLabel(manufacturer.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditManufacturer(manufacturer)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(manufacturer.id, 'manufacturer')}
                        disabled={deleteManufacturer.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        {manufacturersResponse?.success && manufacturersResponse.data?.pagination && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((manufacturersResponse.data.pagination.page - 1) * manufacturersResponse.data.pagination.limit) + 1} to{' '}
              {Math.min(manufacturersResponse.data.pagination.page * manufacturersResponse.data.pagination.limit, manufacturersResponse.data.pagination.total)} of{' '}
              {manufacturersResponse.data.pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setManufacturerPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={manufacturersResponse.data.pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {manufacturersResponse.data.pagination.page} of {manufacturersResponse.data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setManufacturerPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={manufacturersResponse.data.pagination.page >= manufacturersResponse.data.pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSupplierTable = () => {
    if (suppliersLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
    }

    if (suppliersError) {
      return (
        <div className="text-center py-8 text-red-600">
          Failed to load suppliers. Please try again.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={suppliers.length > 0 && suppliers.every(s => selectedItems.includes(s.id))}
                  onCheckedChange={(checked) => handleSelectAll(suppliers, checked as boolean)}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Linked Manufacturers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => {
              const primaryContact = getPrimaryContact(supplier.contacts);
              const linkedManufacturerNames = getLinkedEntityNames(supplier.linkedManufacturerIds, allManufacturers);
              
              return (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(supplier.id)}
                      onCheckedChange={(checked) => handleSelectItem(supplier.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">{supplier.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{supplier.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {primaryContact ? (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{primaryContact.name}</div>
                        <div className="text-sm text-muted-foreground">{primaryContact.email}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No contact</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {linkedManufacturerNames.slice(0, 2).map((name, idx) => (
                        <div key={idx} className="text-sm">{name}</div>
                      ))}
                      {linkedManufacturerNames.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{linkedManufacturerNames.length - 2} more
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(supplier.status)}>
                      {getStatusLabel(supplier.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(supplier.id, 'supplier')}
                        disabled={deleteSupplier.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        {suppliersResponse?.success && suppliersResponse.data?.pagination && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((suppliersResponse.data.pagination.page - 1) * suppliersResponse.data.pagination.limit) + 1} to{' '}
              {Math.min(suppliersResponse.data.pagination.page * suppliersResponse.data.pagination.limit, suppliersResponse.data.pagination.total)} of{' '}
              {suppliersResponse.data.pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSupplierPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={suppliersResponse.data.pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {suppliersResponse.data.pagination.page} of {suppliersResponse.data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSupplierPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={suppliersResponse.data.pagination.page >= suppliersResponse.data.pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Suppliers & Manufacturers</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your supplier and manufacturer database
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => handleExport('all')}
            disabled={exportData.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => handleCreateNew('manufacturer')}
            className="bg-primary hover:bg-primary/90 px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Manufacturers</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalManufacturers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeManufacturers} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeSuppliers} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recently Added</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentlyAdded}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApproval}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <Card className="rounded-2xl shadow-sm border-0 bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search suppliers and manufacturers..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={handleBulkDelete}
                  disabled={bulkAction.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedItems.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="rounded-2xl shadow-sm border-0 bg-card">
        <CardContent className="p-8">
          <Tabs defaultValue="manufacturers" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid w-fit grid-cols-2 bg-muted p-1 rounded-xl">
                <TabsTrigger value="manufacturers" className="flex items-center rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Factory className="h-4 w-4 mr-2" />
                  Manufacturers
                </TabsTrigger>
                <TabsTrigger value="suppliers" className="flex items-center rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Suppliers
                </TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                <Select onValueChange={(value) => handleStatusFilter(value, 'manufacturer')}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="manufacturers" className="mt-6">
              {renderManufacturerTable()}
            </TabsContent>

            <TabsContent value="suppliers" className="mt-6">
              {renderSupplierTable()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditManufacturerDialog
        manufacturer={editingManufacturer}
        suppliers={allSuppliers}
        isOpen={isManufacturerDialogOpen}
        createMode={createMode === 'manufacturer'}
        onClose={() => {
          setIsManufacturerDialogOpen(false);
          setEditingManufacturer(null);
          setCreateMode(null);
        }}
      />

      <EditSupplierDialog
        supplier={editingSupplier}
        manufacturers={allManufacturers}
        isOpen={isSupplierDialogOpen}
        createMode={createMode === 'supplier'}
        onClose={() => {
          setIsSupplierDialogOpen(false);
          setEditingSupplier(null);
          setCreateMode(null);
        }}
      />
    </div>
  );
}