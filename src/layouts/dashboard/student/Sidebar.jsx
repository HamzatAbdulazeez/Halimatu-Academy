import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/authApi";
import Alert from "../../../components/Alert";
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

  const [alertConfig, setAlertConfig] = useState({
    show: false,
    message: "",
    type: "success",
    title: "",
  });

  // ✅ Prevent multiple clicks
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = {
    name: storedUser?.name || "Student",
    profile: {
      profile_picture: storedUser?.profile_picture || null,
    },
  };

  const handleSignOut = async () => {
    if (isLoggingOut) return;
  
    setIsLoggingOut(true);
  
    let apiSuccess = false;
  
    try {
      await logoutUser();
      apiSuccess = true;
    } catch (error) {
      console.warn("Logout API failed:", error?.response || error.message);
    }
  
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
  
    // ✅ Show correct message
    setAlertConfig({
      show: true,
      type: apiSuccess ? "success" : "warning",
      title: apiSuccess ? "Logged Out" : "Session Cleared",
      message: apiSuccess
        ? "Logged out successfully"
        : "Session expired. Logged out locally",
    });
  
    // Close sidebar (mobile)
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  
    // ✅ Force redirect (NO DELAY ISSUES)
    setTimeout(() => {
      navigate("/login", { replace: true });
      window.location.reload(); // 🔥 ensures full reset
    }, 1500);
  
    setIsLoggingOut(false);
  };

  return (
    <>
      {/* ✅ Correct Alert Usage */}
      {alertConfig.show && (
        <Alert
          alert={alertConfig}
          onClose={() =>
            setAlertConfig((prev) => ({ ...prev, show: false }))
          }
        />
      )}

      <div
        className={`fixed lg:static top-0 left-0 h-screen bg-linear-to-b from-[#004aad] to-indigo-900 
          p-5 flex flex-col transition-transform duration-300 ease-in-out z-40 overflow-y-auto shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-72 w-72`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <NavLink to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
              alt="Halimatu Academy Logo"
              className="h-24 w-auto object-contain drop-shadow-md"
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
              transition-all duration-200"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          <SidebarItem to="/student" icon={<FaHome />} text="Dashboard" end />
          <SidebarItem to="/student/certificates" icon={<FaCertificate />} text="Certificates" />
          <SidebarItem to="/student/subscription" icon={<FaCreditCard />} text="Subscription" />
          <SidebarItem to="/student/notifications" icon={<FaBell />} text="Notifications" />
          <SidebarItem to="/student/settings" icon={<FaCog />} text="Settings" />
        </nav>

        {/* User Section */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <NavLink
            to="/student/settings"
            className="flex items-center gap-3 hover:bg-white/10 p-3 rounded-xl transition-colors"
          >
            {user.profile.profile_picture ? (
              <img
                src={user.profile.profile_picture}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="max-w-[120px]">
              <p className="font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-white/70">View profile</p>
            </div>
          </NavLink>

         
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className={`mt-5 w-full flex items-center justify-center gap-3 
              bg-red-600/90 hover:bg-red-700 
              text-white py-3 px-4 rounded-xl font-medium 
              transition-all duration-200 shadow-sm cursor-pointer
              ${isLoggingOut ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <FaSignOutAlt className="text-lg" />
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

const SidebarItem = ({ to, icon, text, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 py-3.5 px-4 rounded-xl transition-all duration-200
      ${isActive ? "bg-white/15 text-white font-medium shadow-sm" : "text-white/90 hover:bg-white/10"}`
    }
  >
    <span className="text-xl">{icon}</span>
    <span>{text}</span>
  </NavLink>
);

export default Sidebar;