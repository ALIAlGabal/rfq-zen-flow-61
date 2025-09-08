import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { FileText, Building2, Clock, CheckCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Dashboard() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const stats = [
    {
      title: "Active RFQs",
      value: "24",
      description: "Currently processing",
      icon: FileText,
      trend: "+12% from last month"
    },
    {
      title: "Total Suppliers",
      value: "156",
      description: "In database",
      icon: Building2,
      trend: "+5 new this month"
    },
    {
      title: "Pending Bids", 
      value: "8",
      description: "Awaiting response",
      icon: Clock,
      trend: "Due within 3 days"
    },
    {
      title: "Completed",
      value: "342",
      description: "This quarter",
      icon: CheckCircle,
      trend: "+18% from last quarter"
    }
  ];

  // RFQs with bid closing dates within 3 days
  const allUrgentRFQs = [
    { rfqNo: "RFQ-2024-005", supplier: "TechSuppliers Inc", bidDate: "2024-01-18", daysLeft: 1 },
    { rfqNo: "RFQ-2024-007", manufacturer: "AutoParts Co", bidDate: "2024-01-19", daysLeft: 2 },
    { rfqNo: "RFQ-2024-008", supplier: "ElectroComponents Ltd", bidDate: "2024-01-20", daysLeft: 3 },
    { rfqNo: "RFQ-2024-009", manufacturer: "IndustrialParts Inc", bidDate: "2024-01-18", daysLeft: 1 },
    { rfqNo: "RFQ-2024-010", supplier: "MachinerySupply Co", bidDate: "2024-01-19", daysLeft: 2 },
    { rfqNo: "RFQ-2024-011", manufacturer: "SteelWorks Ltd", bidDate: "2024-01-20", daysLeft: 3 },
    { rfqNo: "RFQ-2024-012", supplier: "ChemicalSuppliers Inc", bidDate: "2024-01-18", daysLeft: 1 },
    { rfqNo: "RFQ-2024-013", manufacturer: "PlasticParts Co", bidDate: "2024-01-19", daysLeft: 2 },
    { rfqNo: "RFQ-2024-014", supplier: "MetalComponents Ltd", bidDate: "2024-01-20", daysLeft: 3 },
  ];

  // Pagination logic
  const totalPages = Math.ceil(allUrgentRFQs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUrgentRFQs = allUrgentRFQs.slice(startIndex, endIndex);

  const sendReminder = (rfqNo: string, contactName: string) => {
    toast({
      title: "Reminder Sent",
      description: `Reminder sent for ${rfqNo} to ${contactName}`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">
          Overview of your RFQ processing system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="rounded-2xl shadow-sm border-0 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stat.description}
                </p>
                <p className="text-sm text-blue-600 font-medium mt-2">
                  {stat.trend}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Urgent RFQs - Closing Soon */}
      <Card className="rounded-2xl shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            RFQs Closing Soon
          </CardTitle>
          <p className="text-sm text-gray-600">Bid closing dates within 3 days</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentUrgentRFQs.map((rfq) => (
              <div key={rfq.rfqNo} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{rfq.rfqNo}</p>
                  <p className="text-sm text-gray-600">
                    {rfq.supplier ? `Supplier: ${rfq.supplier}` : `Manufacturer: ${rfq.manufacturer}`}
                  </p>
                  <p className="text-sm text-orange-600 font-medium">
                    Due: {rfq.bidDate} ({rfq.daysLeft} day{rfq.daysLeft !== 1 ? 's' : ''} left)
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => sendReminder(rfq.rfqNo, rfq.supplier || rfq.manufacturer)}
                  className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Send Reminder
                </Button>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Recent RFQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "RFQ-2024-001", client: "TechCorp", status: "open", date: "2024-01-15" },
                { id: "RFQ-2024-002", client: "ManufacturingCo", status: "submitted", date: "2024-01-14" },
                { id: "RFQ-2024-003", client: "BuildRight", status: "pending", date: "2024-01-13" }
              ].map((rfq) => (
                <div key={rfq.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-gray-900">{rfq.id}</p>
                    <p className="text-sm text-gray-600">{rfq.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{rfq.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <p className="font-semibold text-gray-900">Upload New RFQ</p>
                <p className="text-sm text-gray-600">Process a new request for quotation</p>
              </button>
              <button className="w-full p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <p className="font-semibold text-gray-900">Add Supplier</p>
                <p className="text-sm text-gray-600">Register a new supplier</p>
              </button>
              <button className="w-full p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <p className="font-semibold text-gray-900">Generate Report</p>
                <p className="text-sm text-gray-600">Create status report</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}