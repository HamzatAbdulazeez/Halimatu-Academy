import React, { useState } from 'react';
import { FaBell, FaCheckCircle, FaCalendarAlt, FaTrophy, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Mock notifications data - replace with real API fetch
const initialNotifications = [
    {
        id: 1,
        type: 'class-reminder',
        title: 'Upcoming Live Class',
        message: 'Quranic Arabic – Reading Practice starts in 1 hour (6:00 PM WAT today)',
        time: '10 minutes ago',
        isRead: false,
        link: '/student/live/quranic-arabic-reading',
        icon: <FaCalendarAlt className="text-[#004aad]" />,
    },
    {
        id: 2,
        type: 'achievement',
        title: 'Course Completed!',
        message: 'Congratulations! You finished Qur\'an Reading Basics. Your certificate is ready.',
        time: '2 days ago',
        isRead: false,
        link: '/certificate/quran-reading-basics',
        icon: <FaTrophy className="text-yellow-500" />,
    },
    {
        id: 3,
        type: 'update',
        title: 'New Feature Available',
        message: 'We added progress tracking rings and daily reminders. Check your dashboard!',
        time: '1 week ago',
        isRead: true,
        link: '/student/dashboard',
        icon: <FaInfoCircle className="text-blue-500" />,
    },
    {
        id: 4,
        type: 'class-reminder',
        title: 'Reminder: Arabic Vocabulary Session',
        message: 'Join tomorrow at 7:00 PM WAT for interactive practice.',
        time: '3 days ago',
        isRead: true,
        link: '/student/live/arabic-vocab',
        icon: <FaCalendarAlt className="text-[#004aad]" />,
    },
];

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'reminders' | 'achievements'

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.isRead;
        if (filter === 'reminders') return notif.type === 'class-reminder';
        if (filter === 'achievements') return notif.type === 'achievement';
        return true;
    });

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    return (
        <>
            <div className="bg-white px-6 py-4 mb-6">
                <h1 className="text-2xl font-medium mb-3">Notifications</h1>
                <p className="text-gray-500">
                    <Link to="/student" className="text-[#004aad] hover:underline">
                        Dashboard
                    </Link>{" "}
                    &gt; Notifications
                </p>
            </div>
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className=" mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <FaBell className="text-3xl text-[#004aad]" />
                            <div>

                                <p className="text-gray-600">
                                    {unreadCount} unread • Stay updated with classes & achievements
                                </p>
                            </div>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-5 py-2.5 bg-[#004aad] hover:bg-[#003a8c] text-white rounded-lg font-medium transition flex items-center gap-2 shadow-sm"
                            >
                                <FaCheckCircle size={16} />
                                Mark All as Read
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['All', 'Unread', 'Reminders', 'Achievements'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab.toLowerCase())}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === tab.toLowerCase()
                                    ? 'bg-[#004aad] text-white shadow'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tab}
                                {tab === 'Unread' && unreadCount > 0 && (
                                    <span className="ml-1.5 bg-white text-[#004aad] px-2 py-0.5 rounded-full text-xs">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Notifications List */}
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                            <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No notifications yet
                            </h3>
                            <p className="text-gray-500">
                                You'll be notified about upcoming classes, achievements, and updates
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredNotifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                                    className={`group bg-white rounded-lg border-l-4 ${notif.isRead ? 'border-gray-300' : 'border-[#004aad]'
                                        } p-5 hover:shadow-md transition-all cursor-pointer relative`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                            {notif.icon}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className={`font-semibold ${notif.isRead ? 'text-gray-800' : 'text-[#004aad]'}`}>
                                                    {notif.title}
                                                </h3>
                                                {!notif.isRead && (
                                                    <span className="px-2.5 py-1 bg-[#004aad]/10 text-[#004aad] text-xs font-medium rounded-full">
                                                        New
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-600 mt-1 mb-2">{notif.message}</p>

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt size={14} />
                                                    {notif.time}
                                                </span>

                                                {notif.link && (
                                                    <Link
                                                        to={notif.link}
                                                        className="text-[#004aad] hover:underline font-medium"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        View Details →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {!notif.isRead && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notif.id);
                                                }}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FaTimes size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="text-center text-gray-500 text-sm mt-10">
                        Notifications help you stay on track with your learning In shāʾ Allāh
                    </p>
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;