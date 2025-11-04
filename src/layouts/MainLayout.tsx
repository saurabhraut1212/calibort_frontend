import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-100">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
