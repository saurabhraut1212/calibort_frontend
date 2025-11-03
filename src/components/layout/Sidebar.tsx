import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 hidden md:block border-r bg-white">
      <div className="p-4">
        <nav className="flex flex-col gap-2">
          <Link to="/" className="px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link to="/users" className="px-3 py-2 rounded hover:bg-gray-100">Users</Link>
          <Link to="/profile" className="px-3 py-2 rounded hover:bg-gray-100">Profile</Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
