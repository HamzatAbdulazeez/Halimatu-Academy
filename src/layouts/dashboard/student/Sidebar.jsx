import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/authApi";
import { notify } from "../../../utils/toast";
import {
  FaHome,
  FaCertificate,
  FaBell,
  FaCog,
  FaSearch,
  FaCreditCard,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [studentInfo, setStudentInfo] = useState({
    name: "Student",
    profile_picture: null,
  });

  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const rawName = storedUser.name?.name || storedUser.name || "Student";
      setStudentInfo({
        name: String(rawName),
        profile_picture: storedUser.profile_picture || storedUser.profile?.profile_picture || null,
      });
    };

    loadUser(); // Initial load

    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logoutUser();
      notify.success("Logged out successfully!");
    } catch (error) {
      console.warn("Logout API failed:", error?.response || error.message);
      notify.error("Session cleared locally.");
    } finally {
      // Clear all local data
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      if (window.innerWidth < 1024) toggleSidebar();

      // Redirect after a short delay so user sees the toast
      setTimeout(() => {
        navigate("/login", { replace: true });
        window.location.reload();
      }, 1000);

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
        {/* Logo Section */}
        <div className="flex justify-center mb-8 shrink-0">
          <NavLink to="/" onClick={handleLinkClick}>
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
              alt="Academy Logo"
              className="h-20 w-auto object-contain drop-shadow-lg brightness-110"
              draggable="false"
            />
          </NavLink>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 
              text-white placeholder-white/60 outline-none focus:bg-white/20 focus:border-white/40 
              transition-all duration-200 text-sm"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          <SidebarItem to="/student" icon={<FaHome />} text="Dashboard" onClick={handleLinkClick} end />
          <SidebarItem to="/student/certificates" icon={<FaCertificate />} text="Certificates" onClick={handleLinkClick} />
          <SidebarItem to="/student/subscription" icon={<FaCreditCard />} text="Subscription" onClick={handleLinkClick} />
          <SidebarItem to="/student/notifications" icon={<FaBell />} text="Notifications" onClick={handleLinkClick} />
          <SidebarItem to="/student/settings" icon={<FaCog />} text="Settings" onClick={handleLinkClick} />
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <NavLink
            to="/student/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 hover:bg-white/10 p-3 rounded-xl transition-colors"
          >
            {studentInfo.profile_picture ? (
              <img
                src={studentInfo.profile_picture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                {studentInfo.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="max-w-[140px] truncate">
              <p className="font-medium text-white truncate text-sm">{studentInfo.name}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">Student Account</p>
            </div>
          </NavLink>

          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className={`mt-5 w-full flex items-center justify-center gap-3 
              bg-red-500 hover:bg-red-600 
              text-white py-3 px-4 rounded-xl font-bold 
              transition-all duration-200 shadow-lg text-sm
              ${isLoggingOut ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <FaSignOutAlt />
            {isLoggingOut ? "LOGGING OUT..." : "LOG OUT"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
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

export default Sidebar;