import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

export default function QuickStats() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const stats = [
    {
      label: "Success Rate",
      value: metrics?.successRate || 0,
      color: "bg-primary",
    },
    {
      label: "Error Rate", 
      value: metrics?.errorRate || 0,
      color: "bg-destructive",
    },
    {
      label: "Data Quality",
      value: 96.2, // Static for now
      color: "bg-primary",
    },
  ];

  const fileTypes = [
    { type: "Excel (.xlsx)", percentage: 78 },
    { type: "CSV", percentage: 18 },
    { type: "Legacy (.xls)", percentage: 4 },
  ];

  if (isLoading) {
    return (
      <Card className="animate-pulse" data-testid="card-quick-stats-loading">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                </div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-quick-stats">
      <CardHeader>
        <CardTitle data-testid="text-quick-stats-title">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground" data-testid={`text-${stat.label.toLowerCase().replace(/\s+/g, '-')}-label`}>
                  {stat.label}
                </span>
                <span className="text-sm font-medium text-foreground" data-testid={`text-${stat.label.toLowerCase().replace(/\s+/g, '-')}-value`}>
                  {stat.value.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={stat.value} 
                className="h-2"
                data-testid={`progress-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              />
            </div>
          ))}

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3" data-testid="text-file-types-title">
              File Types Processed
            </h4>
            <div className="space-y-2">
              {fileTypes.map((fileType) => (
                <div key={fileType.type} className="flex justify-between text-sm">
                  <span className="text-muted-foreground" data-testid={`text-file-type-${fileType.type.toLowerCase().replace(/[().\s]+/g, '-')}`}>
                    {fileType.type}
                  </span>
                  <span className="font-medium text-foreground" data-testid={`text-file-percentage-${fileType.type.toLowerCase().replace(/[().\s]+/g, '-')}`}>
                    {fileType.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
