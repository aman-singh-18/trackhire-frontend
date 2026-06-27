import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="h-screen w-screen bg-slate-950 flex overflow-hidden font-sans antialiased">
      {/* Fixed Sidebar component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Navbar />

        {/* Scrollable Workspace Container */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;  