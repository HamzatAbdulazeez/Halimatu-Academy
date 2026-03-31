import { useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/authApi";
import Alert from "../../../components/Alert";

export default function Navbar({ toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);

  const [alertConfig, setAlertConfig] = useState({
    show: false,
    message: "",
    type: "success",
    title: "",
  });

  const navigate = useNavigate();

  // ── Pull user from localStorage ──────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const userData = JSON.parse(stored);
        setTimeout(() => setUser(userData), 0);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    }
  }, []);

  // ── Derived values ───────────────────────────────────────────
  const profilePic = user?.profile_picture || null;
  const initials = (
    (user?.first_name?.charAt(0) || "") +
    (user?.last_name?.charAt(0) || "")
  ).toUpperCase() || "U";

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    let apiSuccess = false;

    try {
      const res = await logoutUser();
      apiSuccess = res?.success !== false;
    } catch (error) {
      console.warn("Logout API failed:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.clear();

    setIsDropdownOpen(false);

    setAlertConfig({
      show: true,
      type: apiSuccess ? "success" : "warning",
      title: apiSuccess ? "Logged Out" : "Session Cleared",
      message: apiSuccess
        ? "Logged out successfully"
        : "Session expired. Logged out locally",
    });

    setTimeout(() => {
      navigate("/login", { replace: true });
      window.location.reload();
    }, 1500);

    setIsLoggingOut(false);
  };

  return (
    <>
      {alertConfig.show && (
        <Alert
          alert={alertConfig}
          onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
        />
      )}

      <nav className="bg-white shadow-md p-6 flex items-center justify-between">
        {/* Sidebar Toggle */}
        <button
          className="md:block lg:hidden p-2 text-gray-600"
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
          <div className="relative bg-[#004aad] p-2 rounded-full">
            <Bell size={20} className="text-white" />
            <span className="absolute -top-1 -right-1 bg-[#004aad] text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
              4
            </span>
          </div>

          {/* Profile Avatar */}
          <div className="relative">
            {profilePic ? (
              <img
                src={profilePic}
                alt="User"
                className="w-9 h-9 rounded-full cursor-pointer object-cover ring-2 ring-[#004aad]/20"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
            ) : (
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 rounded-full cursor-pointer bg-[#004aad] flex items-center justify-center text-white text-sm font-bold ring-2 ring-[#004aad]/20"
              >
                {initials}
              </div>
            )}

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                {/* User info at top of dropdown */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {[user?.first_name, user?.last_name].filter(Boolean).join(" ") || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
                </div>
                <ul className="py-2">
                  <Link to="/student/settings">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                      Settings
                    </li>
                  </Link>
                  <li
                    onClick={handleLogout}
                    className={`px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer text-sm ${
                      isLoggingOut ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}