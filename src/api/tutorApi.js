import axiosInstance from './axiosInstance';

// ─── TUTOR REQUESTS API ─────────────────────────────────────────────────────

export const getAllTutorRequests = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `/admin/tutor-requests?${query}` : '/admin/tutor-requests';
    const res = await axiosInstance.get(url);
    return res.data;
};

export const getTutorRequestsStats = async () => {
    const res = await axiosInstance.get('/admin/tutor-requests/stats');
    return res.data;
};

export const getTutorRequestDetail = async (requestId) => {
    const res = await axiosInstance.get(`/admin/tutor-requests/${requestId}`);
    return res.data;
};

export const updateTutorRequestStatus = async (requestId, status) => {
    const res = await axiosInstance.put(`/admin/tutor-requests/${requestId}/status`, { status });
    return res.data;
};

export const deleteTutorRequest = async (requestId) => {
    const res = await axiosInstance.delete(`/admin/tutor-requests/${requestId}`);
    return res.data;
};

export const bulkDeleteTutorRequests = async (requestIds) => {
    const res = await axiosInstance.post('/admin/tutor-requests/bulk-delete', {
        request_ids: requestIds
    });
    return res.data;
};

export const submitTutorRequest = async (formData) => {
    const res = await axiosInstance.post('/public/tutor-request', formData);
    return res.data;
};
