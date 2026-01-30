import { useState } from "react";

import {
  FaHome,
  FaBook,
  FaCalendar,
  FaVideo,
  FaCertificate,
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaSearch,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const handleClick = () => {
    window.scrollTo(0, 0);
    if (window.innerWidth < 768) {
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

    alert("Logged out successfully");
    toggleSidebar();
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-screen bg-linear-to-b from-[#004aad] to-indigo-900 p-5 flex flex-col transition-transform duration-300 z-40 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-72 w-64`}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <a href="/" onClick={handleClick}>
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
              alt="HSA Logo"
              className="h-28 w-auto"
            />
          </a>
        </div>

        {/* Search */}
        <div className="mt-5 mb-5 relative">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full p-3 pl-10 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:bg-white/20"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 space-y-2">
          <SidebarItem
            to="/student/dashboard"
            icon={<FaHome />}
            text="Dashboard"
            onClick={handleClick}
          />
          <SidebarItem
            to="/student/courses"
            icon={<FaBook />}
            text="My Courses"
            onClick={handleClick}
          />
          <SidebarItem
            to="/student/schedule"
            icon={<FaCalendar />}
            text="Class Schedule"
            onClick={handleClick}
          />
          <SidebarItem
            to="/student/projects"
            icon={<FaVideo />}
            text="My Projects"
            onClick={handleClick}
          />
          <SidebarItem
            to="/student/certificates"
            icon={<FaCertificate />}
            text="Certificates"
            onClick={handleClick}
          />
          <SidebarItem
            to="/student/notifications"
            icon={<FaBell />}
            text="Notifications"
            onClick={handleClick}
          />
          <SidebarItem
            to="/student/settings"
            icon={<FaCog />}
            text="Settings"
            onClick={handleClick}
          />
        </nav>

        {/* User Profile */}
        <a
          href="/customer/settings"
          className="mt-auto border-t border-white pt-5 flex items-center"
          onClick={handleClick}
        >
          {mockUser?.profile?.profile_picture ? (
            <img
              src={mockUser.profile.profile_picture}
              alt="User"
              className="w-12 h-12 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="w-12 h-12 mr-3 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
              {mockUser?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold leading-loose text-white">
              {mockUser?.name}
            </p>
            <p className="text-xs text-white">Account settings</p>
          </div>
        </a>

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          className="mt-6 cursor-pointer bg-gradient text-white py-3 px-4 rounded-md w-full flex items-center justify-center"
        >
          <FaSignOutAlt className="mr-2" /> Log Out
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

const SidebarItem = ({ to, icon, text, onClick }) => {
  return (
    <a
      href={to}
      onClick={onClick}
      className={`flex items-center py-3 px-3 rounded-md cursor-pointer transition-colors text-white hover:bg-gray-200 hover:text-black`}
    >
      <span className="mr-3">{icon}</span> {text}
    </a>
  );
};

export default Sidebar;