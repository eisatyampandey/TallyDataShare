import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import UploadZone from "@/components/dashboard/upload-zone";
import RecentActivity from "@/components/dashboard/recent-activity";
import ProcessingChart from "@/components/dashboard/processing-chart";
import QuickStats from "@/components/dashboard/quick-stats";
import DataTablePreview from "@/components/dashboard/data-table-preview";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Header 
          title="Dashboard" 
          subtitle="Welcome back! Here's your data overview." 
        />
        <div className="p-6 overflow-y-auto h-full" data-testid="dashboard-content">
          <MetricsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <UploadZone />
            <RecentActivity />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ProcessingChart />
            </div>
            <QuickStats />
          </div>

          <DataTablePreview />
        </div>
      </main>
    </div>
  );
}
