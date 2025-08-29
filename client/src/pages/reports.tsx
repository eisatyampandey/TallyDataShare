import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Reports() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Header 
          title="Reports" 
          subtitle="Generate and manage your data reports." 
        />
        <div className="p-6 overflow-y-auto h-full" data-testid="reports-content">
          <div className="mb-6">
            <Button data-testid="button-generate-report">
              <FileText className="w-4 h-4 mr-2" />
              Generate New Report
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report: any) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow" data-testid={`card-report-${report.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate" data-testid={`text-report-name-${report.id}`}>{report.name}</span>
                      <FileText className="w-5 h-5 text-primary" />
                    </CardTitle>
                    <p className="text-sm text-muted-foreground" data-testid={`text-report-description-${report.id}`}>
                      {report.description || "No description"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span data-testid={`text-report-date-${report.id}`}>
                          {new Date(report.generatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize" data-testid={`text-report-type-${report.id}`}>
                          {report.reportType}
                        </span>
                        <span className="text-sm text-muted-foreground uppercase" data-testid={`text-report-format-${report.id}`}>
                          {report.format}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4"
                        data-testid={`button-download-report-${report.id}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2" data-testid="text-no-reports">No Reports Found</h3>
                <p className="text-muted-foreground mb-4" data-testid="text-no-reports-description">
                  You haven't generated any reports yet. Upload some data and create your first report.
                </p>
                <Button data-testid="button-create-first-report">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Your First Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
