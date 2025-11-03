import React from "react";
import { useAppDispatch, useAppSelector } from "../../features/auth/hooks";
import { clearAuth } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector((s) => s.auth.userEmail);

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="md:hidden px-2 py-1 border rounded">☰</button>
        <h1 className="text-lg font-semibold">Calibort</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700">{email}</div>
        <button
          onClick={() => {
            dispatch(clearAuth());
            navigate("/login");
          }}
          className="px-3 py-1 border rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
