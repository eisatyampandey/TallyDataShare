import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import UploadZone from "@/components/dashboard/upload-zone";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function Upload() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Header 
          title="Upload Files" 
          subtitle="Upload your Excel and CSV files for processing." 
        />
        <div className="p-6 overflow-y-auto h-full" data-testid="upload-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <UploadZone />
            </div>
          </div>
          
          <div className="mt-8">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
