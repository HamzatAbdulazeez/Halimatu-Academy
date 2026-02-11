import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaBook,
  FaCertificate,
  FaBell,
  FaCog,
  FaSearch,
  FaCreditCard,  
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const mockUser = {
    name: "Abdul",
    profile: {
      profile_picture: null,
    },
  };

  const handleSignOut = () => {
    alert("You have been logged out successfully.");
    if (window.innerWidth < 1024) {
      toggleSidebar();
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
        <div className="flex justify-center mb-8">
          <NavLink to="/" onClick={handleLinkClick}>
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
        <SidebarItem
  to="/student"
  icon={<FaHome className="text-xl" />}
  text="Dashboard"
  onClick={handleLinkClick}
  end
/>

          {/* <SidebarItem
            to="/student/courses"
            icon={<FaBook className="text-xl" />}
            text="My Courses"
            onClick={handleLinkClick}
          /> */}
          <SidebarItem
            to="/student/certificates"
            icon={<FaCertificate className="text-xl" />}
            text="Certificates"
            onClick={handleLinkClick}
          />
          <SidebarItem
            to="/student/subscription"
            icon={<FaCreditCard className="text-xl" />}
            text="Subscription & Billing"
            onClick={handleLinkClick}
          />
          <SidebarItem
            to="/student/notifications"
            icon={<FaBell className="text-xl" />}
            text="Notifications"
            onClick={handleLinkClick}
          />
          <SidebarItem
            to="/student/settings"
            icon={<FaCog className="text-xl" />}
            text="Settings"
            onClick={handleLinkClick}
          />
        </nav>

        {/* User Section */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <NavLink
            to="/student/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 hover:bg-white/10 p-3 rounded-xl transition-colors"
          >
            {mockUser?.profile?.profile_picture ? (
              <img
                src={mockUser.profile.profile_picture}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-xl">
                {mockUser?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}

            <div>
              <p className="font-medium text-white">{mockUser?.name}</p>
              <p className="text-xs text-white/70">View profile</p>
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
            ? "bg-white/15 text-white font-medium shadow-sm"
            : "text-white/90 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <span className="text-xl opacity-90">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
};


export default Sidebar;