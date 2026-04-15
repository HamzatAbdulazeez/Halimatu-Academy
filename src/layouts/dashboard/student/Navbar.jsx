/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Bell, Menu, Crown, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/authApi";
import { notify } from "../../../utils/toast";
import { getImageUrl } from "../../../utils/imageHelper";

import {
    getNotifications,
    getNotificationCounts,
    markNotificationsAsRead,
} from "../../../api/notificationsApi";

import {
    getMyActiveSubscription,
} from "../../../api/plansApi";

export default function Navbar({ toggleSidebar }) {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [user, setUser] = useState(null);
    const [activeSubscription, setActiveSubscription] = useState(null);

    // Notifications
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const navigate = useNavigate();
    const userDropdownRef = useRef(null);
    const notifDropdownRef = useRef(null);

    // Load user
    useEffect(() => {
        const loadUserData = () => {
            try {
                const stored = localStorage.getItem("user");
                if (stored) setUser(JSON.parse(stored));
            } catch (err) {
                console.error("Failed to parse user:", err);
            }
        };
        loadUserData();
        window.addEventListener("storage", loadUserData);
        return () => window.removeEventListener("storage", loadUserData);
    }, []);

    // Fetch Active Subscription
    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const res = await getMyActiveSubscription().catch(() => null);
                const subData = res?.subscription || res?.data?.subscription || res?.data || res;
                setActiveSubscription(subData && typeof subData === 'object' ? subData : null);
            } catch (err) {
                console.error("Failed to fetch subscription:", err);
            }
        };
        fetchSubscription();
    }, []);

    // Fetch Notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const [countData, notifData] = await Promise.all([
                    getNotificationCounts().catch(() => ({ unread: 0 })),
                    getNotifications({ limit: 5 }).catch(() => [])
                ]);

                setUnreadCount(countData?.unread || 0);
                setNotifications(notifData?.notifications || notifData || []);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Safe plan name
    const planName = activeSubscription
        ? (activeSubscription.plan_name || activeSubscription.plan?.name || activeSubscription.name || "Basic Plan")
        : "No Plan";

    const isPremium = !!activeSubscription;

    const fullName = user
        ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.name || "Student"
        : "Student";

    const rawPic = user?.profile_picture || user?.profile?.profile_picture || user?.image || null;
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

            setUserDropdownOpen(false);
            setNotifDropdownOpen(false);

            setTimeout(() => {
                navigate("/login", { replace: true });
                window.location.reload();
            }, 800);

            setIsLoggingOut(false);
        }
    };

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

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
            if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
                setNotifDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <nav className="bg-white shadow-md p-6 flex items-center justify-between">
                {/* Left Side */}
                <button className="lg:hidden p-2 text-gray-600" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>

                <h1 className="text-base font-medium text-gray-700 lg:ml-4">
                    Halimatu Academy
                </h1>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Subscription Badge */}
                    <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-md text-sm font-medium text-black">
                        {isPremium && <Crown size={16} className="text-[#004aad]" />}
                        <span>{planName}</span>
                    </div>

                    {/* Notifications */}
                    <div className="relative" ref={notifDropdownRef}>
                        <div 
                            className="relative bg-[#004aad] p-2.5 rounded-full cursor-pointer hover:bg-[#003a8c] transition-all"
                            onClick={() => {
                                setNotifDropdownOpen(!notifDropdownOpen);
                                setUserDropdownOpen(false);
                            }}
                        >
                            <Bell size={20} className="text-white" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>

                        {/* Notification Dropdown */}
                        {notifDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-md  border border-gray-100 z-50 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={() => markAsRead(notifications[0]?.id)} 
                                            className="text-xs text-[#004aad] hover:underline"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
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
                                                        {notif.icon || <Bell className="text-[#004aad]" size={18} />}
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

                                <div className="p-3 border-t border-gray-100 text-center">
                                    <Link 
                                        to="/student/notifications" 
                                        className="text-[#004aad] text-sm hover:underline"
                                        onClick={() => setNotifDropdownOpen(false)}
                                    >
                                        View all notifications →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div className="relative" ref={userDropdownRef}>
                        <div 
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => {
                                setUserDropdownOpen(!userDropdownOpen);
                                setNotifDropdownOpen(false);  
                            }}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900 leading-none">{fullName}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{planName}</p>
                            </div>

                            {rawPic ? (
                                <img
                                    src={profilePic}
                                    alt={fullName}
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#004aad]/20 hover:ring-[#004aad] transition"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${initials}&background=004aad&color=fff`;
                                    }}
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-[#004aad] flex items-center justify-center text-white text-sm font-bold">
                                    {initials}
                                </div>
                            )}
                        </div>

                        {/* User Dropdown */}
                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-md  border border-gray-100 z-50 overflow-hidden py-1">
                                <Link 
                                    to="/student/subscription" 
                                    onClick={() => setUserDropdownOpen(false)}
                                    className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700"
                                >
                                    <Crown size={18} className="text-amber-500" />
                                    Manage Subscription
                                </Link>
                                <Link 
                                    to="/student/settings" 
                                    onClick={() => setUserDropdownOpen(false)}
                                    className="px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700"
                                >
                                    Account Settings
                                </Link>
                                <div className="border-t border-gray-100 my-1" />
                                <div
                                    onClick={handleLogout}
                                    className={`px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer text-sm font-medium ${isLoggingOut ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {isLoggingOut ? "Logging out..." : "Logout"}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}