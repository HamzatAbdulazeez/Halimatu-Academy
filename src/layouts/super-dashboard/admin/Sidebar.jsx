import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logoutUser } from "../../../api/authApi";
import { notify } from "../../../utils/toast";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaUserGraduate,
  FaCreditCard,
  FaCertificate,
  FaBookOpen,
  FaLink,
  FaListUl,
  FaChevronDown,
} from "react-icons/fa";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCourseActive = location.pathname.startsWith("/admin/course");
  const [courseOpen, setCourseOpen] = useState(isCourseActive);

  // Maintain Admin Data with persistent state
  const [adminInfo, setAdminInfo] = useState({
    name: "Admin User",
    role: "Super Admin",
    profile_picture: null,
  });

  // ✅ Fixed Effect: Listens for updates and uses the correct Admin keys
  useEffect(() => {
    const loadAdmin = () => {
      // Use the specific key you use for Admins (usually "adminUser" or "user")
      const stored = localStorage.getItem("adminUser") || localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);

          // Safeguard against [object Object] and nested name fields
          const rawName = parsed.name?.name || parsed.name || parsed.first_name || "Admin User";

          setAdminInfo({
            name: String(rawName),
            role: parsed.role || "Super Admin",
            profile_picture: parsed.profile_picture || parsed.profile?.profile_picture || null,
          });
        } catch (err) {
          console.error("Failed to parse admin data", err);
        }
      }
    };

    loadAdmin(); // Initial load

    // ✅ This makes the sidebar update INSTANTLY when you change the profile picture in Settings
    window.addEventListener("storage", loadAdmin);
    return () => window.removeEventListener("storage", loadAdmin);
  }, []);

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      notify.success("Admin logged out successfully.");
    } catch {
      console.warn("API logout failed, clearing local session.");
      notify.info("Session cleared locally.");
    } finally {
      // Complete cleanup
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("token"); // Clean up standard keys too
      localStorage.removeItem("user");
      sessionStorage.clear();

      if (window.innerWidth < 1024) toggleSidebar();
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
        {/* Logo Section */}
        <div className="flex justify-center mb-8 shrink-0">
          <NavLink to="/" onClick={handleLinkClick}>
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
          <SidebarItem to="/admin/students" icon={<FaUsers />} text="Manage Students" onClick={handleLinkClick} />
          <SidebarItem to="/admin/enrollments" icon={<FaUserGraduate />} text="Enrollments" onClick={handleLinkClick} />

          {/* Dropdown for Course Management */}
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
                <NavLink
                  to="/admin/course-management/links"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs transition-all duration-200
                    ${isActive ? "bg-white/15 text-white font-semibold" : "text-white/75 hover:bg-white/10 hover:text-white"}`
                  }
                >
                  <FaLink className="shrink-0" />
                  <span>Schedule & Links</span>
                </NavLink>

                <NavLink
                  to="/admin/course-management/topics"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs transition-all duration-200
                    ${isActive ? "bg-white/15 text-white font-semibold" : "text-white/75 hover:bg-white/10 hover:text-white"}`
                  }
                >
                  <FaListUl className="shrink-0" />
                  <span>Curriculum Topics</span>
                </NavLink>
              </div>
            </div>
          </div>

          <SidebarItem to="/admin/subscriptions" icon={<FaCreditCard />} text="Subscriptions" onClick={handleLinkClick} />
          <SidebarItem to="/admin/certificates" icon={<FaCertificate />} text="Certificates" onClick={handleLinkClick} />
          <SidebarItem to="/admin/notifications" icon={<FaBell />} text="Notifications" onClick={handleLinkClick} />
          <SidebarItem to="/admin/settings" icon={<FaCog />} text="Settings" onClick={handleLinkClick} />
        </nav>

        {/* Profile & Logout Section */}
        <div className="mt-auto pt-6 border-t border-white/20 space-y-4">
          <div className="flex items-center gap-3 p-2">
            {adminInfo.profile_picture ? (
              <img
                src={adminInfo.profile_picture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                {adminInfo.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="max-w-[150px] truncate">
              <p className="font-medium text-white truncate text-sm">{adminInfo.name}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">{adminInfo.role}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 cursor-pointer
              text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg text-sm"
          >
            <FaSignOutAlt />
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