import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; 
import { notify } from "../../../utils/toast";

import {
  FaHome, FaUsers, FaCog, FaBell,
  FaUserGraduate, FaCreditCard, FaCertificate,
  FaBookOpen, FaLink, FaListUl, FaChevronDown, FaShieldAlt,
} from "react-icons/fa";
import { UserCheck, LogOut, MessageSquare, LogOut as LogOutAll } from "lucide-react";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout: contextLogout } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isCourseActive = location.pathname.startsWith("/admin/course-management");
  const [courseOpen, setCourseOpen] = useState(isCourseActive);

  // User role logic (unchanged)
  const userRole = user?.role 
    ? (typeof user.role === "object" ? user.role.name : user.role)
    : "Admin";

  const roleName = String(userRole).toLowerCase().trim();
  const userEmail = user?.email?.toLowerCase().trim();

  const isSuperAdmin = 
    userEmail === "superadmin@halimatu.com" || 
    roleName === "super admin" || 
    roleName === "superadmin";

  const isAdmin = isSuperAdmin || roleName === "admin";
  const isContentModerator = isSuperAdmin || isAdmin || roleName === "content moderator";

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.innerWidth < 1024) toggleSidebar();
  };

  // Improved Logout Handler
  const handleLogout = async (type = "single") => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    setShowLogoutMenu(false);

    try {
      const endpoint = type === "all" 
        ? "/api/admin/logout-all" 
        : "/api/admin/logout";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        notify.success(
          type === "all" 
            ? "Logged out from all devices successfully" 
            : "Logged out successfully"
        );
      } else {
        notify.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      notify.info("Session cleared locally");
    } finally {
      // Always clean up client-side
      localStorage.clear();
      sessionStorage.clear();
      
      // Call context logout if available
      if (contextLogout) contextLogout();
      
      navigate("/admin-login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div
        className={`fixed lg:static top-0 left-0 h-screen bg-linear-to-b from-[#004aad] to-indigo-900 
          p-5 flex flex-col transition-transform duration-300 ease-in-out z-40 overflow-y-auto shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-72 w-72`}
      >
        {/* Logo - unchanged */}
        <div className="flex justify-center mb-8 shrink-0">
          <NavLink to="/admin" onClick={handleLinkClick}>
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
              alt="Halimatu Academy Logo"
              className="h-20 w-auto object-contain drop-shadow-lg brightness-110"
              draggable="false"
            />
          </NavLink>
        </div>

        {/* Navigation - unchanged */}
        <nav className="flex-1 space-y-1.5">
          {/* ... your existing nav items ... */}
          <SidebarItem to="/admin" icon={<FaHome size={20} />} text="Dashboard" onClick={handleLinkClick} end />
          <SidebarItem to="/admin/students" icon={<FaUsers size={20} />} text="Manage Students" onClick={handleLinkClick} />
          <SidebarItem to="/admin/enrollments" icon={<FaUserGraduate size={20} />} text="Enrollments" onClick={handleLinkClick} />

          {isContentModerator && (
            <div>
              <button
                onClick={() => setCourseOpen((prev) => !prev)}
                className={`w-full flex items-center gap-3 py-3.5 px-4 rounded-xl transition-all duration-200
                  ${isCourseActive ? "bg-white/15 text-white border-l-4 border-white" : "text-white/90 hover:bg-white/10 hover:text-white"}`}
              >
                <FaBookOpen className="text-xl opacity-90" />
                <span className="flex-1 text-left text-sm font-medium">Course Management</span>
                <FaChevronDown className={`text-xs opacity-70 transition-transform duration-300 ${courseOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${courseOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                <div className="ml-4 pl-4 border-l-2 border-white/20 space-y-1">
                  <SidebarItem to="/admin/course-management/topics" icon={<FaListUl size={20} />} text="Courses & Topics" onClick={handleLinkClick} />
                  <SidebarItem to="/admin/course-management/links" icon={<FaLink size={20} />} text="Schedule & Links" onClick={handleLinkClick} />
                </div>
              </div>
            </div>
          )}

          <SidebarItem to="/admin/subscriptions" icon={<FaCreditCard size={20} />} text="Subscriptions" onClick={handleLinkClick} />
          <SidebarItem to="/admin/certificates" icon={<FaCertificate size={20} />} text="Certificates" onClick={handleLinkClick} />
          <SidebarItem to="/admin/tutor-requests" icon={<UserCheck size={20} />} text="Tutor Requests" onClick={handleLinkClick} />
          <SidebarItem to="/admin/contact-messages" icon={<MessageSquare size={20} />} text="Contact Messages" onClick={handleLinkClick} />

          {isAdmin && (
            <>
              <SidebarItem to="/admin/roles" icon={<FaShieldAlt size={20} />} text="Roles & Permissions" onClick={handleLinkClick} />
              <SidebarItem to="/admin/staff" icon={<UserCheck size={20} />} text="Staff Management" onClick={handleLinkClick} />
            </>
          )}

          {isSuperAdmin && (
            <SidebarItem to="/admin/settings" icon={<FaCog size={20} />} text="Settings" onClick={handleLinkClick} />
          )}
        </nav>

        {/* Profile & Logout Section - UPDATED */}
        <div className="mt-auto pt-6 border-t border-white/20 space-y-4">
          <div className="flex items-center gap-3 p-2 relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className="max-w-37.5 truncate flex-1">
              <p className="font-medium text-white truncate text-sm">{user?.name || "Super Admin"}</p>
              <p className="text-[10px] text-white/70 uppercase tracking-widest font-medium">
                {isSuperAdmin ? "Super Admin" : userRole}
              </p>
            </div>

            {/* Logout Dropdown Trigger */}
            <button
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              disabled={isLoggingOut}
            >
              <LogOut size={20} />
            </button>

            {/* Logout Menu */}
            {showLogoutMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                <button
                  onClick={() => handleLogout("single")}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 text-gray-700 disabled:opacity-50"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>

                <button
                  onClick={() => handleLogout("all")}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 text-red-600 disabled:opacity-50"
                >
                  <LogOutAll size={18} />
                  <span>Log Out All Devices</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 lg:hidden z-30 backdrop-blur-sm" onClick={toggleSidebar} />
      )}
    </>
  );
};

const SidebarItem = ({ to, icon, text, onClick, end = false }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 py-3.5 px-4 rounded-xl transition-all duration-200
      ${isActive
        ? "bg-white/15 text-white font-bold border-l-4 border-white shadow-inner"
        : "text-white/90 hover:bg-white/10 hover:text-white"}`
    }
  >
    <span className="text-xl opacity-90">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </NavLink>
);

export default AdminSidebar;