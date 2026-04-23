import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();

  // Show blank screen while restoring session from storage
  if (loading) return <div className="h-screen w-full bg-white" />;

  // Not logged in — kick to login, no layout rendered at all
  if (!user) return <Navigate to="/admin-login" replace />;

  // Logged in but wrong role
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;