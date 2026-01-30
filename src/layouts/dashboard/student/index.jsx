import { useState, useEffect } from "react";
import Sidebar from "../student/Sidebar";
import Navbar from "../student/Navbar";
import { Outlet, useNavigate } from "react-router-dom";


export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Overlay for Mobile & Tablet */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed left-0 top-0 h-full bg-white z-50 w-64 transition-transform duration-300 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:relative lg:block`}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 bg-gray-100 h-full overflow-y-auto px-4 sm:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>

  );
}
