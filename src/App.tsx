import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/users/UsersList";
import Profile from "./pages/profile/Profile";
import { useAppSelector } from "./features/auth/hooks";
import UserDetail from "./pages/users/UserDetail";

const AppRoutes: React.FC = () => {
  const token = useAppSelector((s) => s.auth.accessToken);

  return (
  
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/"
          element={token ? <MainLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
      </Routes>
    
  );
};

export default AppRoutes;
