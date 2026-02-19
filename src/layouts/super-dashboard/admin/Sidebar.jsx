import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaSearch,
  FaUserGraduate,
  FaCreditCard,
  FaVideo,
  FaCertificate,
} from "react-icons/fa";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  // You can replace this with real auth/user context later
  const mockAdmin = {
    name: "Abdul (Admin)",
    role: "Super Admin",
    profile_picture: null,
  };

  const handleSignOut = () => {
    alert("Admin logged out successfully.");
    if (window.innerWidth < 1024) {
      toggleSidebar();
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
        <div className="flex justify-center mb-8">
          <NavLink to="/admin" onClick={handleLinkClick}>
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
              alt="Halimatu Academy Logo"
              className="h-20 w-auto object-contain drop-shadow-md"
            />
          </NavLink>
        </div>

        {/* Search (optional for admin) */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search users, courses..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 
              text-white placeholder-white/60 outline-none focus:bg-white/20 focus:border-white/40 
              transition-all duration-200"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
  <SidebarItem
    to="/admin"
    icon={<FaHome className="text-xl" />}
    text="Dashboard"
    onClick={handleLinkClick}
    end
  />

  <SidebarItem
    to="/admin/students"
    icon={<FaUsers className="text-xl" />}
    text="Manage Students"
    onClick={handleLinkClick}
  />

  {/* <SidebarItem
    to="/admin/instructors"
    icon={<FaChalkboardTeacher className="text-xl" />}
    text="Manage Instructors"
    onClick={handleLinkClick}
  /> */}

  {/* <SidebarItem
    to="/admin/courses"
    icon={<FaBook className="text-xl" />}
    text="Manage Courses"
    onClick={handleLinkClick}
  /> */}

  <SidebarItem
    to="/admin/enrollments"
    icon={<FaUserGraduate className="text-xl" />}
    text="Enrollments"
    onClick={handleLinkClick}
  />

  <SidebarItem
    to="/admin/subscriptions"
    icon={<FaCreditCard className="text-xl" />}
    text="Subscriptions & Plans"
    onClick={handleLinkClick}
  />

  <SidebarItem
    to="/admin/certificates"
    icon={<FaCertificate className="text-xl" />}
    text="Certificates"
    onClick={handleLinkClick}
  />


  <SidebarItem
    to="/admin/notifications"
    icon={<FaBell className="text-xl" />}
    text="Notifications"
    onClick={handleLinkClick}
  />

  <SidebarItem
    to="/admin/settings"
    icon={<FaCog className="text-xl" />}
    text="Settings"
    onClick={handleLinkClick}
  />
</nav>

        {/* User/Admin Section */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <NavLink
            to="/admin/profile"
            onClick={handleLinkClick}
            className="flex items-center gap-3 hover:bg-white/10 p-3 rounded-xl transition-colors"
          >
            {mockAdmin?.profile_picture ? (
              <img
                src={mockAdmin.profile_picture}
                alt="Admin"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-xl">
                {mockAdmin?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}

            <div>
              <p className="font-medium text-white">{mockAdmin?.name}</p>
              <p className="text-xs text-white/70">{mockAdmin?.role}</p>
            </div>
          </NavLink>

          <button
            onClick={handleSignOut}
            className="mt-5 w-full flex items-center justify-center gap-3 bg-red-600/90 hover:bg-red-700 
              text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-sm"
          >
            <FaSignOutAlt className="text-lg" />
            Log Out
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

const SidebarItem = ({ to, icon, text, onClick, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-4 rounded-xl transition-all duration-200
        ${
          isActive
            ? "bg-white/15 text-white font-medium shadow-sm border-l-4 border-white"
            : "text-white/90 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <span className="text-xl opacity-90">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
};

export default AdminSidebar;