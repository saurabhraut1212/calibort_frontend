import React from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-4">
          <h2 className="text-xl font-semibold">Welcome — Dashboard</h2>
          <p className="mt-2 text-sm text-gray-600">Users list and other screens will appear here (Module F2)</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
