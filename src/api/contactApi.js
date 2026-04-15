import axiosInstance from './axiosInstance';

// ─── CONTACT MESSAGES API ───────────────────────────────────────────────────

export const getAllContactMessages = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `/admin/contact-messages?${query}` : '/admin/contact-messages';
    const res = await axiosInstance.get(url);
    return res.data;
};

export const getContactMessagesStats = async () => {
    const res = await axiosInstance.get('/admin/contact-messages/stats');
    return res.data;
};

export const getContactMessageDetail = async (messageId) => {
    const res = await axiosInstance.get(`/admin/contact-messages/${messageId}`);
    return res.data;
};

export const updateContactMessageStatus = async (messageId, status) => {
    const res = await axiosInstance.put(`/admin/contact-messages/${messageId}/status`, { status });
    return res.data;
};

export const deleteContactMessage = async (messageId) => {
    const res = await axiosInstance.delete(`/admin/contact-messages/${messageId}`);
    return res.data;
};

export const bulkDeleteContactMessages = async (messageIds) => {
    const res = await axiosInstance.post('/admin/contact-messages/bulk-delete', {
        message_ids: messageIds
    });
    return res.data;
};

export const submitContactForm = async (formData) => {
    const res = await axiosInstance.post('/public/contact', formData);
    return res.data;
};