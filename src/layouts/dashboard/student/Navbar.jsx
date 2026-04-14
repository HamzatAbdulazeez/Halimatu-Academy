/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/authApi";
import { notify } from "../../../utils/toast";
import { getImageUrl } from "../../../utils/imageHelper";

import {
    getNotifications,
    getNotificationCounts,
    markNotificationsAsRead,
} from "../../../api/notificationsApi";

export default function Navbar({ toggleSidebar }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [user, setUser] = useState(null);

    // Notifications state
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifLoading, setNotifLoading] = useState(false);

    const navigate = useNavigate();

    // Load user from localStorage
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

    // Load notification count + recent notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            setNotifLoading(true);
            try {
                const [countData, notifData] = await Promise.all([
                    getNotificationCounts().catch(() => ({ unread: 0 })),
                    getNotifications({ limit: 5 }).catch(() => [])
                ]);

                setUnreadCount(countData?.unread || 0);
                setNotifications(notifData?.notifications || notifData || []);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            } finally {
                setNotifLoading(false);
            }
        };

        fetchNotifications();

        // Refresh notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const rawPic =
        user?.profile_picture ||
        user?.profile?.profile_picture ||
        user?.image ||
        user?.avatar ||
        null;

    const profilePic = getImageUrl(rawPic);

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
            }, 800);

            setIsLoggingOut(false);
        }
    };

    // Mark notification as read when clicked
    const markAsRead = async (id) => {
        try {
            await markNotificationsAsRead([id]);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <nav className="bg-white shadow-md p-6 flex items-center justify-between">
                {/* Sidebar Toggle */}
                <button className="lg:hidden p-2 text-gray-600" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>

                {/* Title */}
                <h1 className="text-base font-normal text-[#7A7979] lg:ml-4">
                    Student Dashboard
                </h1>

                {/* Right Section */}
                <div className="flex items-center space-x-6">
                    {/* Notifications Bell with Real Count */}
                    <div 
                        className="relative bg-[#004aad] p-2.5 rounded-full cursor-pointer hover:bg-[#003a8c] transition-all"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <Bell size={20} className="text-white" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>

                    {/* Profile Avatar */}
                    <div className="relative">
                        {rawPic ? (
                            <img
                                src={profilePic}
                                alt="User"
                                className="w-10 h-10 rounded-full cursor-pointer object-cover ring-2 ring-[#004aad]/10 hover:ring-[#004aad]/30 transition"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${initials}&background=004aad&color=fff`;
                                }}
                            />
                        ) : (
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-10 h-10 rounded-full cursor-pointer bg-[#004aad] flex items-center justify-center text-white text-sm font-bold ring-2 ring-[#004aad]/10 hover:bg-[#003a8c] transition"
                            >
                                {initials}
                            </div>
                        )}

                        {/* User Dropdown */}
                        {isDropdownOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl z-50 border border-gray-100 overflow-hidden">
                                    <ul className="py-2">
                                        <Link to="/student/settings" onClick={() => setIsDropdownOpen(false)}>
                                            <li className="px-4 py-2.5 hover:bg-indigo-50 hover:text-[#004aad] transition cursor-pointer text-sm font-medium">
                                                Settings
                                            </li>
                                        </Link>
                                        <li
                                            onClick={handleLogout}
                                            className={`px-4 py-2.5 text-red-500 hover:bg-red-50 transition cursor-pointer text-sm font-bold mt-1 border-t border-gray-50 ${isLoggingOut ? "opacity-70 cursor-not-allowed" : ""}`}
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

            {/* Notification Dropdown */}
            {isDropdownOpen && (
                <div className="fixed top-16 right-6 bg-white rounded-2xl w-80 z-50 border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAsRead} 
                                className="text-xs text-[#004aad] hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-black/50">
                                No new notifications
                            </div>
                        ) : (
                            notifications.slice(0, 5).map((notif) => (
                                <div 
                                    key={notif.id}
                                    onClick={() => markAsRead(notif.id)}
                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition ${!notif.isRead ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-0.5">
                                            {notif.icon || <Bell className="text-[#004aad]" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notif.isRead ? 'font-semibold text-[#004aad]' : 'text-gray-700'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100  text-center">
                        <Link 
                            to="/student/notifications" 
                            className="text-[#004aad] text-sm hover:underline"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            View all notifications →
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}