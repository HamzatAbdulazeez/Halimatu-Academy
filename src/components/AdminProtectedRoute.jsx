import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#004aad] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  const userRole = typeof user.role === "object"
    ? (user.role.name || user.role.slug || "").toLowerCase().trim()
    : String(user.role || "").toLowerCase().trim();

  const allowed = allowedRoles.map(r => r.toLowerCase().trim());

  if (!allowed.includes(userRole)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;