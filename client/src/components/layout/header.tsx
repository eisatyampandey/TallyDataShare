import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-card border-b border-border px-6 py-4" data-testid="header">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-page-title">{title}</h2>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <Button 
            onClick={() => setLocation("/upload")}
            data-testid="button-new-upload"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Upload
          </Button>
        </div>
      </div>
    </header>
  );
}
