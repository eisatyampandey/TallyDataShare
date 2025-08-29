import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, Database, PieChart, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const metricsData = [
    {
      title: "Total Files Processed",
      value: metrics?.totalFiles?.toLocaleString() || "0",
      change: "+12%",
      icon: FileSpreadsheet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Data Records",
      value: metrics?.totalRecords ? `${(metrics.totalRecords / 1000).toFixed(1)}K` : "0",
      change: "+8.5%",
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Reports Generated",
      value: metrics?.reportsGenerated?.toLocaleString() || "0",
      change: "+23%",
      icon: PieChart,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Processing Time",
      value: metrics?.avgProcessingTime ? `${metrics.avgProcessingTime.toFixed(1)}s` : "0s",
      change: "-15%",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
      isImprovement: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-20 ml-2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="metrics-cards">
      {metricsData.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.change.startsWith("+");
        const isImprovement = metric.isImprovement ? !isPositive : isPositive;
        
        return (
          <Card key={metric.title} className="hover:shadow-md transition-shadow" data-testid={`card-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium" data-testid={`text-${metric.title.toLowerCase().replace(/\s+/g, '-')}-label`}>
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground" data-testid={`text-${metric.title.toLowerCase().replace(/\s+/g, '-')}-value`}>
                    {metric.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${metric.color} w-6 h-6`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={`font-medium ${isImprovement ? 'text-primary' : 'text-destructive'} flex items-center`}>
                  {isImprovement ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
