import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; 
import { logoutUser } from "../../../api/authApi";
import { notify } from "../../../utils/toast";

import {
  FaHome, FaUsers, FaCog, FaBell,
  FaUserGraduate, FaCreditCard, FaCertificate,
  FaBookOpen, FaLink, FaListUl, FaChevronDown, FaShieldAlt,
} from "react-icons/fa";
import { UserCheck, LogOut } from "lucide-react";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isCourseActive = location.pathname.startsWith("/admin/course-management");
  const [courseOpen, setCourseOpen] = useState(isCourseActive);

  // 1. Get user role safely
  const userRole = user?.role 
    ? (typeof user.role === "object" ? user.role.name : user.role)
    : "Admin";

  const roleName = String(userRole).toLowerCase().trim();
  const userEmail = user?.email?.toLowerCase().trim();

  // 2. MASTER PERMISSIONS 
  // We check for the specific superadmin email OR the role name
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

  const handleSignOut = async () => {
    try {
      await logoutUser();
      notify.success("Logged out successfully");
    } catch {
      notify.info("Session cleared");
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/admin-login");
    }
  };

  return (
    <>
      <div
        className={`fixed lg:static top-0 left-0 h-screen bg-linear-to-b from-[#004aad] to-indigo-900 
          p-5 flex flex-col transition-transform duration-300 ease-in-out z-40 overflow-y-auto shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-72 w-72`}
      >
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          <SidebarItem to="/admin" icon={<FaHome />} text="Dashboard" onClick={handleLinkClick} end />

          {/* Students & Enrollments */}
          <SidebarItem to="/admin/students" icon={<FaUsers />} text="Manage Students" onClick={handleLinkClick} />
          <SidebarItem to="/admin/enrollments" icon={<FaUserGraduate />} text="Enrollments" onClick={handleLinkClick} />
          
          
          {/* Course Management - Visible to Super Admin, Admin, Content Moderator */}
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
                  <SidebarItem to="/admin/course-management/topics" icon={<FaListUl />} text="Courses & Topics" onClick={handleLinkClick} />
                  <SidebarItem to="/admin/course-management/links" icon={<FaLink />} text="Schedule & Links" onClick={handleLinkClick} />
                </div>
              </div>
            </div>
          )}

          <SidebarItem to="/admin/subscriptions" icon={<FaCreditCard />} text="Subscriptions" onClick={handleLinkClick} />
          <SidebarItem to="/admin/certificates" icon={<FaCertificate />} text="Certificates" onClick={handleLinkClick} />
          <SidebarItem to="/admin/tutor-requests" icon={<UserCheck />} text="Tutor Requests" onClick={handleLinkClick} />

          {/* Roles & Staff - Visible to Super Admin & Admin */}
          {isAdmin && (
            <>
              <SidebarItem to="/admin/roles" icon={<FaShieldAlt />} text="Roles & Permissions" onClick={handleLinkClick} />
              <SidebarItem to="/admin/staff" icon={<UserCheck size={20} />} text="Staff Management" onClick={handleLinkClick} />
            </>
          )}

          <SidebarItem to="/admin/notifications" icon={<FaBell />} text="Notifications" onClick={handleLinkClick} />

          {/* Settings - Strictly Super Admin */}
          {isSuperAdmin && (
            <SidebarItem to="/admin/settings" icon={<FaCog />} text="Settings" onClick={handleLinkClick} />
          )}
        </nav>

        {/* Profile & Logout */}
        <div className="mt-auto pt-6 border-t border-white/20 space-y-4">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className="max-w-37.5 truncate">
              <p className="font-medium text-white truncate text-sm">{user?.name || "Super Admin"}</p>
              <p className="text-[10px] text-white/70 uppercase tracking-widest font-medium">
                {isSuperAdmin ? "Super Admin" : userRole}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 
              text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 text-sm"
          >
            <LogOut size={18} />
            LOG OUT
          </button>
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