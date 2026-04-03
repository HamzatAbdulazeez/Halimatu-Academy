import { useState } from "react";
import { Bell, Menu, LogOut, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/authApi"; 
import { notify } from "../../../utils/toast";

export default function Navbar({ toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Pull real Admin data from storage
  const storedAdmin = JSON.parse(
    sessionStorage.getItem("adminUser") || localStorage.getItem("adminUser") || "{}"
  );

  const adminName = storedAdmin?.name || "Admin User";
  const adminEmail = storedAdmin?.email || "admin@halimatu.com";
  const adminImage = storedAdmin?.profile_picture || null;

  // 2. Handle Logout Logic
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      console.warn("Server logout failed, cleaning local session.");
    } finally {
      // Clear all admin-related storage
      sessionStorage.clear();
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      
      notify.success("Logged out successfully");
      navigate("/admin-login");
    }
  };

  return (
    <nav className="bg-white p-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Toggle & Title */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="text-sm font-medium text-gray-500 hidden sm:block">
          Admin Management Portal
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} className="text-[#004aad]" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
            2
          </span>
        </button>

        {/* Profile Section */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded-lg transition-all"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {adminImage ? (
              <img src={adminImage} alt="Admin" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#004aad] flex items-center justify-center text-white font-bold text-sm">
                {adminName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden md:block text-left mr-2">
              <p className="text-xs font-bold text-gray-900 leading-none">{adminName}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Super Admin</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Invisible backdrop to close dropdown when clicking outside */}
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
              
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-xl z-20 border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-150">
                {/* Admin Header Info */}
                <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">{adminName}</p>
                  <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
                </div>

                <ul className="py-2">
                  <Link to="/admin/settings" onClick={() => setIsDropdownOpen(false)}>
                    <li className="px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                      <Settings size={16} className="text-gray-400" />
                      Settings
                    </li>
                  </Link>
                  
                  <li 
                    className="px-5 py-2.5 hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 cursor-pointer transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}