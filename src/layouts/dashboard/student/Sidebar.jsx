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
  FaLock,
} from "react-icons/fa";
import { getImageUrl } from "../../../utils/imageHelper";

// ─── Nav config ───────────────────────────────────────────────────────────────

const LOCKED_ITEMS = [
  { to: "/student",               icon: <FaHome />,        text: "Dashboard",     end: true  },
  { to: "/student/certificates",  icon: <FaCertificate />, text: "Certificates",  end: false },
  { to: "/student/notifications", icon: <FaBell />,        text: "Notifications", end: false },
];

const ALWAYS_AVAILABLE = [
  { to: "/student/subscription",  icon: <FaCreditCard />, text: "Subscription", end: false },
  { to: "/student/settings",      icon: <FaCog />,        text: "Settings",     end: false },
];

const ALL_ITEMS = [
  { to: "/student",               icon: <FaHome />,        text: "Dashboard",     end: true  },
  { to: "/student/certificates",  icon: <FaCertificate />, text: "Certificates",  end: false },
  { to: "/student/subscription",  icon: <FaCreditCard />,  text: "Subscription",  end: false },
  { to: "/student/notifications", icon: <FaBell />,        text: "Notifications", end: false },
  { to: "/student/settings",      icon: <FaCog />,         text: "Settings",      end: false },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

/**
 * isSubscribed — pass false from SubscriptionGuard to show the locked state.
 * Defaults to true so existing usages are unaffected.
 */
const Sidebar = ({ isOpen, toggleSidebar, isSubscribed = true }) => {
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
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.clear();
      if (window.innerWidth < 1024) toggleSidebar();
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
        className={`fixed lg:static top-0 left-0 h-screen bg-gradient-to-b from-[#004aad] to-indigo-900
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

        {/* Search */}
        <div className={`relative mb-6 transition-opacity duration-300 ${!isSubscribed ? "opacity-40 pointer-events-none select-none" : ""}`}>
          <input
            type="text"
            placeholder="Search..."
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
            /* ── Fully unlocked ── */
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
            /* ── Locked state ── */
            <>
              {/* Section label */}
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold px-1 pb-1">
                Locked
              </p>

              {/* Greyed-out locked items */}
              {LOCKED_ITEMS.map(({ to, icon, text }) => (
                <div
                  key={to}
                  title="Subscribe to unlock this section"
                  className="flex items-center gap-3 py-3.5 px-4 rounded-xl
                    text-white/30 cursor-not-allowed select-none"
                >
                  <span className="text-xl opacity-40">{icon}</span>
                  <span className="text-sm font-medium flex-1">{text}</span>
                  <FaLock className="text-white/25 text-[10px] shrink-0" />
                </div>
              ))}

              {/* Divider + available label */}
              <div className="pt-3 pb-1">
                <div className="border-t border-white/10 mb-2" />
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold px-1">
                  Available now
                </p>
              </div>

              {/* Clickable unlocked items */}
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

        {/* User Profile */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <NavLink
            to="/student/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 hover:bg-white/10 p-3 rounded-xl transition-colors"
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

          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className={`mt-4 w-full flex items-center justify-center gap-3
              bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md font-bold
              transition-all duration-200 text-sm
              ${isLoggingOut ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <FaSignOutAlt />
            {isLoggingOut ? "LOGGING OUT..." : "LOG OUT"}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

// ─── SidebarItem ──────────────────────────────────────────────────────────────

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