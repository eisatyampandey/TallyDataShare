import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home, 
  Upload, 
  FileText, 
  Table, 
  BarChart3, 
  Settings,
  TrendingUp,
  LogOut
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Upload Files", href: "/upload", icon: Upload },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Data Tables", href: "/data-tables", icon: Table },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0 sidebar-transition" data-testid="sidebar">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground" data-testid="text-app-name">TallySync</h1>
            <p className="text-xs text-muted-foreground" data-testid="text-app-subtitle">Excel Data Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2" data-testid="nav-main">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <a 
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm" data-testid="text-user-initials">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate" data-testid="text-user-name">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-user-email">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.location.href = "/api/logout"}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
