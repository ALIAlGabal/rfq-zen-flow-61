import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Upload, 
  Building2, 
  FileText, 
  BarChart3, 
  Settings 
} from "lucide-react";

const navigation = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Upload RFQ", url: "/upload-rfq", icon: Upload },
  { title: "Suppliers & Manufacturers", url: "/suppliers", icon: Building2 },
  { title: "RFQ Tracker", url: "/rfq-tracker", icon: FileText },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function TopNavigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">RFQ Processor</span>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  end={item.url === "/"}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}