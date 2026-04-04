import { useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/authApi";
import { notify } from "../../../utils/toast";

export default function Navbar({ toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    };

    loadUserData();

    window.addEventListener("storage", loadUserData);
    return () => window.removeEventListener("storage", loadUserData);
  }, []);

  const profilePic =
    user?.profile_picture ||
    user?.profile?.profile_picture ||
    user?.image ||
    user?.avatar ||
    null;

  const initials = (
    (user?.first_name?.charAt(0) || user?.name?.charAt(0) || "") +
    (user?.last_name?.charAt(0) || "")
  ).toUpperCase() || "U";

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logoutUser();
      notify.success("Logged out successfully");
    } catch (error) {
      console.warn("Logout API failed:", error);
      notify.info("Session cleared locally");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      setIsDropdownOpen(false);

      setTimeout(() => {
        navigate("/login", { replace: true });
        window.location.reload();
      }, 1000);

      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md p-6 flex items-center justify-between">
        {/* Sidebar Toggle */}
        <button
          className="lg:hidden p-2 text-gray-600"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Title */}
        <h1 className="text-base font-normal text-[#7A7979] lg:ml-4">
          Student Dashboard
        </h1>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative bg-[#004aad] p-2 rounded-full cursor-pointer hover:bg-[#003a8c] transition">
            <Bell size={20} className="text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
              4
            </span>
          </div>

          {/* Profile Avatar */}
          <div className="relative">
            {profilePic ? (
              <img
                src={profilePic}
                alt="User"
                className="w-10 h-10 rounded-full cursor-pointer object-cover ring-2 ring-[#004aad]/10 hover:ring-[#004aad]/30 transition"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
            ) : (
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full cursor-pointer bg-[#004aad] flex items-center justify-center text-white text-sm font-bold ring-2 ring-[#004aad]/10 hover:bg-[#003a8c] transition"
              >
                {initials}
              </div>
            )}

            {/* Dropdown */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>

                <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl z-50 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-4 bg-gray-50/50 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {[user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Student"}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || ""}</p>
                  </div>

                  <ul className="py-2">
                    <Link to="/student/settings" onClick={() => setIsDropdownOpen(false)}>
                      <li className="px-4 py-2.5 hover:bg-indigo-50 hover:text-[#004aad] transition cursor-pointer text-sm font-medium">
                        Settings
                      </li>
                    </Link>
                    <li
                      onClick={handleLogout}
                      className={`px-4 py-2.5 text-red-500 hover:bg-red-50 transition cursor-pointer text-sm font-bold mt-1 border-t border-gray-50 ${isLoggingOut ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}