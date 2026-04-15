import axiosInstance from './axiosInstance';

// ─── NOTIFICATIONS API ─────────────────────────────────────────────────────

export const getNotifications = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `/user/notifications?${query}` : '/user/notifications';
    const res = await axiosInstance.get(url);
    return res.data;
};

export const getNotificationCounts = async () => {
    const res = await axiosInstance.get('/user/notifications/counts');
    return res.data;
};

export const markNotificationsAsRead = async (notificationIds = []) => {
    const res = await axiosInstance.post('/user/notifications/mark-read', {
        notification_ids: notificationIds
    });
    return res.data;
};

export const deleteAllNotifications = async () => {
    const res = await axiosInstance.delete('/user/notifications');
    return res.data;
};

export const deleteNotification = async (notificationId) => {
    const res = await axiosInstance.delete(`/user/notifications/${notificationId}`);
    return res.data;
};

export const createNotification = async (notificationData) => {
    const res = await axiosInstance.post('/user/notifications', notificationData);
    return res.data;
};