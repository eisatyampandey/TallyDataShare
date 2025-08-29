import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Download, Share, Table as TableIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function DataTables() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: tables, isLoading } = useQuery({
    queryKey: ["/api/tables"],
  });

  const filteredTables = tables?.filter((table: any) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleExport = async (tableId: string, format: string) => {
    try {
      const response = await fetch(`/api/tables/${tableId}/export?format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `table_export.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Header 
          title="Data Tables" 
          subtitle="View and manage your processed data tables." 
        />
        <div className="p-6 overflow-y-auto h-full" data-testid="data-tables-content">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TableIcon className="w-5 h-5 mr-2" />
                  Data Tables
                </CardTitle>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-tables"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                      <div className="w-8 h-8 bg-muted rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-muted rounded"></div>
                        <div className="w-8 h-8 bg-muted rounded"></div>
                        <div className="w-8 h-8 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredTables.length > 0 ? (
                <div className="data-table-container">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead data-testid="header-table-name">Table Name</TableHead>
                        <TableHead data-testid="header-records">Records</TableHead>
                        <TableHead data-testid="header-last-updated">Last Updated</TableHead>
                        <TableHead data-testid="header-status">Status</TableHead>
                        <TableHead className="text-right" data-testid="header-actions">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTables.map((table: any) => (
                        <TableRow key={table.id} className="hover:bg-muted/20" data-testid={`row-table-${table.id}`}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <TableIcon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm" data-testid={`text-table-name-${table.id}`}>
                                  {table.name}
                                </p>
                                <p className="text-xs text-muted-foreground" data-testid={`text-table-description-${table.id}`}>
                                  {table.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell data-testid={`text-record-count-${table.id}`}>
                            {table.recordCount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground" data-testid={`text-last-updated-${table.id}`}>
                            {new Date(table.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={table.isActive ? "default" : "secondary"}
                              data-testid={`badge-status-${table.id}`}
                            >
                              {table.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                data-testid={`button-view-${table.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleExport(table.id, 'xlsx')}
                                data-testid={`button-download-${table.id}`}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                data-testid={`button-share-${table.id}`}
                              >
                                <Share className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <TableIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-no-tables">No Data Tables Found</h3>
                  <p className="text-muted-foreground mb-4" data-testid="text-no-tables-description">
                    {searchTerm ? "No tables match your search criteria." : "Upload some files to start creating data tables."}
                  </p>
                  {!searchTerm && (
                    <Button data-testid="button-upload-first-file">
                      Upload Your First File
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
