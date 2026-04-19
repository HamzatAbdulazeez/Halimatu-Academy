import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { notify } from "../../../utils/toast";
import {
  FaHome,
  FaCertificate,
  FaBell,
  FaCog,
  FaSearch,
  FaCreditCard,
  FaLock,
} from "react-icons/fa";
import { LogOut, LogOut as LogOutAll } from "lucide-react";
import { getImageUrl } from "../../../utils/imageHelper";

const LOCKED_ITEMS = [
  { to: "/student", icon: <FaHome />, text: "Dashboard", end: true },
  { to: "/student/certificates", icon: <FaCertificate />, text: "Certificates", end: false },
  { to: "/student/notifications", icon: <FaBell />, text: "Notifications", end: false },
];

const ALWAYS_AVAILABLE = [
  { to: "/student/subscription", icon: <FaCreditCard />, text: "Subscription", end: false },
  { to: "/student/settings", icon: <FaCog />, text: "Settings", end: false },
];

const ALL_ITEMS = [
  { to: "/student", icon: <FaHome />, text: "Dashboard", end: true },
  { to: "/student/certificates", icon: <FaCertificate />, text: "Certificates", end: false },
  { to: "/student/subscription", icon: <FaCreditCard />, text: "Subscription", end: false },
  { to: "/student/notifications", icon: <FaBell />, text: "Notifications", end: false },
  { to: "/student/settings", icon: <FaCog />, text: "Settings", end: false },
];

const Sidebar = ({ isOpen, toggleSidebar, isSubscribed = true }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

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
        profile_picture:
          storedUser.profile_picture ||
          storedUser.profile?.profile_picture ||
          null,
      });
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.innerWidth < 1024) toggleSidebar();
  };

  // Formal Logout Handler
  const handleLogout = async (type = "single") => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setShowLogoutMenu(false);

    try {
      const endpoint = type === "all" ? "/user/logout-all" : "/user/logout";

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
            ? "Successfully logged out from all devices"
            : "Logged out successfully"
        );
      } else {
        notify.error(data.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.warn("Logout request failed:", error);
      notify.info("Session cleared locally.");
    } finally {
      // Clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      if (window.innerWidth < 1024) toggleSidebar();

      // Redirect
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 600);

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
        {/* Logo */}
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

        {/* Search Bar */}
        <div className={`relative mb-6 transition-opacity duration-300 ${!isSubscribed ? "opacity-40 pointer-events-none select-none" : ""}`}>
          <input
            type="text"
            placeholder="Search courses..."
            disabled={!isSubscribed}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20
              text-white placeholder-white/60 outline-none focus:bg-white/20 focus:border-white/40
              transition-all duration-200 text-sm"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {isSubscribed ? (
            ALL_ITEMS.map(({ to, icon, text, end }) => (
              <SidebarItem
                key={to}
                to={to}
                icon={icon}
                text={text}
                end={end}
                onClick={handleLinkClick}
              />
            ))
          ) : (
            <>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold px-1 pb-1">
                LOCKED FEATURES
              </p>
              {LOCKED_ITEMS.map(({ to, icon, text }) => (
                <div
                  key={to}
                  title="Subscribe to unlock this section"
                  className="flex items-center gap-3 py-3.5 px-4 rounded-xl text-white/30 cursor-not-allowed select-none"
                >
                  <span className="text-xl opacity-40">{icon}</span>
                  <span className="text-sm font-medium flex-1">{text}</span>
                  <FaLock className="text-white/25 text-[10px] shrink-0" />
                </div>
              ))}

              <div className="pt-4 pb-1">
                <div className="border-t border-white/10 mb-2" />
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold px-1">
                  AVAILABLE NOW
                </p>
              </div>

              {ALWAYS_AVAILABLE.map(({ to, icon, text, end }) => (
                <SidebarItem
                  key={to}
                  to={to}
                  icon={icon}
                  text={text}
                  end={end}
                  onClick={handleLinkClick}
                />
              ))}
            </>
          )}
        </nav>

        {/* Profile & Formal Logout Section */}
        <div className="mt-auto pt-6 border-t border-white/20 space-y-4">
          <NavLink
            to="/student/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            {studentInfo.profile_picture ? (
              <img
                src={getImageUrl(studentInfo.profile_picture)}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                {studentInfo.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="max-w-[9rem] truncate">
              <p className="font-medium text-white truncate text-sm">{studentInfo.name}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">
                Student Account
              </p>
            </div>
          </NavLink>

          {/* Formal Logout Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 
                text-white py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 text-sm border border-white/20"
            >
              <LogOut size={18} />
              {isLoggingOut ? "LOGGING OUT..." : "LOG OUT"}
            </button>

            {/* Dropdown Menu - Formal Style */}
            {showLogoutMenu && (
              <div className="absolute bottom-full right-0 mb-3 w-64 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 overflow-hidden">
                <button
                  onClick={() => handleLogout("single")}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50"
                >
                  <LogOut size={18} className="text-gray-500" />
                  <div>
                    <p className="font-medium">Log Out</p>
                    <p className="text-xs text-gray-500">Current session only</p>
                  </div>
                </button>

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={() => handleLogout("all")}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50 text-red-600 transition-colors disabled:opacity-50"
                >
                  <LogOutAll size={18} className="text-red-500" />
                  <div>
                    <p className="font-medium">Log Out All Devices</p>
                    <p className="text-xs text-gray-500">Sign out everywhere</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
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