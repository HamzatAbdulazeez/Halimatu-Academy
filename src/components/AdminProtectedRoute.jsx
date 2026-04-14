import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) return <div className="h-screen w-full bg-indigo-900" />; 

  if (!user) return <Navigate to="/admin-login" replace />;

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;