import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Loader2, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/dashboard/activity"],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />;
      case "error":
        return <CheckCircle className="w-4 h-4 text-destructive" />;
      default:
        return <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-primary/10 text-primary" data-testid={`badge-status-completed`}>Complete</Badge>;
      case "processing":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 status-processing" data-testid={`badge-status-processing`}>Processing</Badge>;
      case "error":
        return <Badge variant="destructive" data-testid={`badge-status-error`}>Error</Badge>;
      default:
        return <Badge variant="outline" data-testid={`badge-status-pending`}>Pending</Badge>;
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <Card data-testid="card-recent-activity">
      <CardHeader>
        <CardTitle data-testid="text-recent-activity-title">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity: any) => (
              <div 
                key={activity.id} 
                className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                data-testid={`activity-item-${activity.id}`}
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate" data-testid={`text-filename-${activity.id}`}>
                    {activity.filename}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`text-status-${activity.id}`}>
                    {activity.status === "completed" 
                      ? `Processed ${activity.recordCount?.toLocaleString() || 0} records`
                      : activity.status === "processing"
                      ? "Processing data..."
                      : activity.status === "error"
                      ? "Processing failed"
                      : "Waiting to process"
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground" data-testid={`text-timestamp-${activity.id}`}>
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-sm font-medium text-foreground mb-2" data-testid="text-no-activity">
              No Recent Activity
            </h4>
            <p className="text-xs text-muted-foreground" data-testid="text-no-activity-description">
              Upload some files to see processing activity here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
