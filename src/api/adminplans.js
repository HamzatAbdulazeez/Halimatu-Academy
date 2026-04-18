import axiosInstance from './axiosInstance';

 // ──Admin Plans ──

 export const adminGetPlans = async () => {
    try {
      const res = await axiosInstance.get("/admin/plans");
      return res.data;
    } catch (error) {
      console.error("Admin Get Plans Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  export const adminGetPlanById = async (planId) => {
    try {
      const res = await axiosInstance.get(`/admin/plans/${planId}`);
      return res.data;
    } catch (error) {
      console.error("Admin Get Plan Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  export const adminCreatePlan = async (payload) => {
    try {
      const res = await axiosInstance.post("/admin/plans", payload);
      return res.data;
    } catch (error) {
      console.error("❌ Admin Create Plan Failed:", {
        status: error.response?.status,
        errors: error.response?.data?.errors || error.response?.data,
        payloadSent: payload
      });
      throw error;
    }
  };
  
  export const adminUpdatePlan = async (planId, payload) => {
    try {
      const res = await axiosInstance.put(`/admin/plans/${planId}`, payload);
      return res.data;
    } catch (error) {
      console.error("Admin Update Plan Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  export const adminDeletePlan = async (planId) => {
    try {
      const res = await axiosInstance.delete(`/admin/plans/${planId}`);
      return res.data;
    } catch (error) {
      console.error("Admin Delete Plan Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ── Admin Subscriptions ──
  export const getSubscriptions = async () => {
    const res = await axiosInstance.get("/admin/subscriptions");
    return res.data;
  };
  
  export const getSubscriptionStats = async () => {
    const res = await axiosInstance.get("/admin/subscriptions/stats");
    return res.data;
  };
  
  export const getSubscription = async (subscriptionId) => {
    const res = await axiosInstance.get(`/admin/subscriptions/${subscriptionId}`);
    return res.data;
  };
  
  export const cancelSubscription = async (subscriptionId) => {
    const res = await axiosInstance.post(`/admin/subscriptions/${subscriptionId}/cancel`);
    return res.data;
  };
  
  export const getUserSubscriptions = async (userId) => {
    const res = await axiosInstance.get(`/admin/users/${userId}/subscriptions`);
    return res.data;
  };