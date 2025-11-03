import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import { useAppSelector } from "./features/auth/hooks";
import UsersList from "./pages/users/UsersList";
import UserDetail from "./pages/users/UserDetail";
import Profile from "./pages/profile/Profile";


const App: React.FC = () => {
  const token = useAppSelector((s) => s.auth.accessToken);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
  path="/"
  element={token ? <Dashboard /> : <Navigate to="/login" replace />}
/>

<Route path="/users" element={<UsersList />} />
<Route path="/users/:id" element={<UserDetail />} />
<Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default App;
