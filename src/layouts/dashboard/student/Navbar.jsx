import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/authApi";
import Alert from "../../../components/Alert";

export default function Navbar({ toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    show: false,
    message: "",
    type: "success",
    title: "",
  });

  const navigate = useNavigate();

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
      {/* ✅ Alert */}
      {alertConfig.show && (
        <Alert
          alert={alertConfig}
          onClose={() =>
            setAlertConfig((prev) => ({ ...prev, show: false }))
          }
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

          {/* Profile */}
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/women/2.jpg"
              alt="User"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                <ul className="py-2">
                  <Link to="/student/settings">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Settings
                    </li>
                  </Link>

                  {/* ✅ Logout */}
                  <li
                    onClick={handleLogout}
                    className={`px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer ${
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