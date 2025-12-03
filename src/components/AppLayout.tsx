import { Outlet } from "react-router-dom";
import Sidebar, { SidebarWithProvider } from "@/components/Sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Topbar from "@/components/Topbar";

const AppLayout = () => {
  return (
    <SidebarWithProvider>
      <div className="min-h-screen w-full flex bg-background overflow-x-hidden">
        <Sidebar />
        <SidebarInset className="flex-1 min-w-0 h-svh overflow-y-auto">
          <Topbar />
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarWithProvider>
  );
};

export default AppLayout;
