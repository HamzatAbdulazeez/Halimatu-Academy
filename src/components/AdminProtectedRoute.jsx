import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtectedRoute = () => {
  const location = useLocation();
  
  // Check both session and local storage
  const adminToken = sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken");
  const adminData = JSON.parse(sessionStorage.getItem("adminUser") || localStorage.getItem("adminUser") || "null");

  // Logic: No token? Not an Admin.
  if (!adminToken) {
    console.warn("Unauthorized access attempt to /admin. Redirecting to login.");
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Double check role if your API provides it
  const role = (adminData?.role?.name || adminData?.role || "").toLowerCase();
  const validAdminRoles = ["admin", "superadmin", "administrator"];

  if (role && !validAdminRoles.includes(role)) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;