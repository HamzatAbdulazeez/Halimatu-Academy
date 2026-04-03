import { Navigate, Outlet } from "react-router-dom";

const StudentProtectedRoute = () => {
  // Check both storage types for the standard student token
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "null");

  
  if (!token) {
    // No token? Send them to the main login page
    return <Navigate to="/login" replace />;
  }

  // Optional: Add a role check if your system strictly separates them
  const role = user?.role?.toLowerCase() || "";
  if (role === "admin" || role === "administrator") {
    // If an admin tries to hit /student, send them back to their own dashboard
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default StudentProtectedRoute;