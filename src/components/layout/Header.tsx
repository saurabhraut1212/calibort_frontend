import React from "react";
import { useAppDispatch, useAppSelector } from "../../features/auth/hooks";
import { clearAuth } from "../../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = useAppSelector((s) => s.auth.userEmail);

  const getPageTitle = (): string => {
    const path = location.pathname.toLowerCase();

    if (path === "/" || path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/users/")) return "User Details";
    if (path.startsWith("/users")) return "Users";
    if (path.startsWith("/profile")) return "Profile";

    return "Calibort System";
  };

  const pageTitle = getPageTitle();

  return (
   <header className="bg-indigo-50/80 backdrop-blur-sm border-b border-indigo-100 shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">

      <div className="flex items-center gap-3">
        <button
          className="md:hidden px-3 py-2 border rounded-md hover:bg-gray-100 transition"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ☰
        </button>

     
        <h1 className="text-xl font-semibold text-indigo-600 tracking-wide">
          {pageTitle}
        </h1>
      </div>

     
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700 font-medium hidden sm:block">{email}</div>
        <button
          onClick={() => {
            dispatch(clearAuth());
            navigate("/login");
          }}
          className="px-4 py-1.5 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
