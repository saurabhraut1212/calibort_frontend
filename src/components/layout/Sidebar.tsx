import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/users", label: "Users" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <>
      {/* Desktop Sidebar - STICKY */}
      <aside className="w-64 hidden md:flex flex-col justify-between bg-gradient-to-b from-indigo-300 to-sky-400 text-white shadow-lg sticky top-0 h-screen overflow-y-auto">
        <div>
          <div className="p-5 text-center">
            <h2 className="text-2xl font-bold tracking-wide">Calibort</h2>
          </div>
          <nav className="flex flex-col p-4 gap-2">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  pathname === to
                    ? "bg-indigo-500 text-white shadow-md"
                    : "hover:bg-indigo-500/30 hover:text-white text-gray-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-white/80 py-3 border-t border-white/20">
          © {new Date().getFullYear()} Calibort. All rights reserved.
        </footer>
      </aside>

      {/* Mobile Sidebar (overlay + sliding panel) */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-40 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            className="w-64 bg-gradient-to-b from-indigo-400 to-indigo-500 text-white shadow-lg h-full p-5 flex flex-col justify-between"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'tween', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-wide">Calibort</h2>
                <button
                  className="text-white text-2xl hover:text-gray-200"
                  onClick={onClose}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {links.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      pathname === to
                        ? "bg-indigo-500 text-white shadow-md"
                        : "hover:bg-indigo-500/30 hover:text-white text-gray-100"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Footer */}
            <footer>
              © {new Date().getFullYear()} Calibort. All rights reserved.
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
