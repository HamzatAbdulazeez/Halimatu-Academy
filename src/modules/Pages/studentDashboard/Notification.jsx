/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaCalendarAlt, FaTrophy, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { notify } from '../../../utils/toast';

import {
    getNotifications,
    markNotificationsAsRead,
    deleteNotification,
} from '../../../api/notificationsApi';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const data = await getNotifications({ limit: 50 });
                setNotifications(data?.notifications || data || []);
            } catch (err) {
                console.error(err);
                notify.error('Failed to load notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // Calculate unread count from actual data (most reliable)
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Filter notifications
    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.isRead;
        if (filter === 'reminders') return notif.type === 'class-reminder';
        if (filter === 'achievements') return notif.type === 'achievement';
        return true;
    });

    const markAsRead = async (id) => {
        try {
            await markNotificationsAsRead([id]);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            notify.error('Failed to mark as read');
        }
    };

    // Inside the component, after setNotifications(...)
useEffect(() => {
    console.log('📋 All Notifications from API:', notifications);
    console.log('📋 Unread count:', unreadCount);
    console.log('📋 Filtered:', filteredNotifications);
}, [notifications]);

    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
            if (unreadIds.length === 0) return;
    
            await markNotificationsAsRead(unreadIds);   // Pass array of IDs
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            notify.success('All notifications marked as read');
        } catch (err) {
            notify.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            notify.success('Notification deleted');
        } catch (err) {
            notify.error('Failed to delete notification');
        }
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
                <div className="mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <FaBell className="text-3xl text-[#004aad]" />
                            <div>
                                <h2 className="text-2xl font-semibold">Notifications</h2>
                                <p className="text-gray-600">
                                    {unreadCount} unread • Stay updated with classes & achievements
                                </p>
                            </div>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-5 py-2.5 bg-[#004aad] hover:bg-[#003a8c] text-white rounded-lg font-medium transition flex items-center gapmd"
                            >
                                <FaCheckCircle size={16} />
                                Mark All as Read
                            </button>
                        )}
                    </div>

                    {/* Filters - Your Original Design */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['All', 'Unread', 'Reminders', 'Achievements'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab.toLowerCase())}
                                className={`px-4 py-2 rounded-md text-sm cursor-pointer font-medium transition ${filter === tab.toLowerCase()
                                    ? 'bg-[#004aad] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tab}
                                {tab === 'Unread' && unreadCount > 0 && (
                                    <span className="ml-1.5 bg-white text-[#004aad] px-2 py-0.5 rounded-md text-xs">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Notifications List */}
                    {loading ? (
                        <div className="bg-white rounded-md p-10 text-center">
                            <p className="text-gray-500">Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="bg-white rounded-md p-10 text-center">
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
                        Notifications help you stay on track with your learning In shāʾ Allah
                    </p>
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;