import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

//   const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    // make this a full-height flex container so sidebar + main align correctly
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-100">
      {/* Sidebar (desktop visible, mobile toggled) */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col">
        {/* Header receives handler to toggle */}
        <Header onMenuClick={toggleSidebar} />

        {/* Page content: keep transparent so background shows through */}
        <main className="flex-1 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
