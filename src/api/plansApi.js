import axiosInstance from './axiosInstance';
// ====================== GET PLANS ======================

// Temporary: Use admin endpoint so student can see all plans (including newly created ones)
export const getUserPlans = async () => {
    try {
      // For now, we call the admin endpoint so you can see the plans you created
      const response = await axiosInstance.get("/admin/plans");
      console.log("✅ getUserPlans called → returned from /admin/plans", response.data);
      return response.data;
    } catch (error) {
      console.error("Get User Plans Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  export const getUserPlansOriginal = async () => {
    try {
      const response = await axiosInstance.get("/user/plans");
      return response.data;
    } catch (error) {
      console.error("Get User Plans Error:", error.response?.data || error.message);
      throw error;
    }
  };

  // ====================== USER/ STUDENT PLANS  ======================
  export const getPlans = async () => {
    try {
      const response = await axiosInstance.get("/user/plans");
      console.log("✅ getPlans (Student) called successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Get Student Plans Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== GET SINGLE PLAN ======================

  export const getUserPlanById = async (planId) => {
    try {
      const response = await axiosInstance.get(`/user/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error("Get User Plan Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== GET MY SUBSCRIPTIONS ======================
  export const getMySubscriptions = async () => {
    try {
      const response = await axiosInstance.get("/user/my-subscriptions");
      return response.data;
    } catch (error) {
      console.error("Get My Subscriptions API Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== GET MY ACTIVE SUBSCRIPTION ======================
  export const getMyActiveSubscription = async () => {
    try {
      const response = await axiosInstance.get("/user/my-active-subscription");
      return response.data;
    } catch (error) {
      console.error("Get Active Subscription API Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== GET MY SUBSCRIPTION STATUS ======================
  export const getMySubscriptionStatus = async () => {
    try {
      const response = await axiosInstance.get("/user/my-subscription-status");
      return response.data;
    } catch (error) {
      console.error("Get Subscription Status API Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== INITIATE SUBSCRIPTION ======================
  export const initiateSubscription = async (payload) => {
    try {
      const response = await axiosInstance.post("/user/subscribe/initiate", payload);
      return response.data;
    } catch (error) {
      console.error("Initiate Subscription API Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== VERIFY PAYMENT ======================
  export const verifyPayment = async (payload) => {
    try {
      const response = await axiosInstance.post("/user/subscribe/verify", payload);
      return response.data;
    } catch (error) {
      console.error("Verify Payment API Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== ACTIVATE SUBSCRIPTION ======================
  export const activateSubscription = async (payload) => {
    try {
      const response = await axiosInstance.post("/user/subscribe/activate", payload);
      return response.data;
    } catch (error) {
      console.error("Activate Subscription API Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== CANCEL SUBSCRIPTION ======================
  export const cancelSubscriptionForUser = async (subscriptionId) => {
    try {
      const response = await axiosInstance.post(`/user/subscriptions/${subscriptionId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Cancel Subscription API Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== TOGGLE AUTO RENEW ======================
  export const toggleAutoRenew = async (subscriptionId) => {
    try {
      const response = await axiosInstance.post(`/user/subscriptions/${subscriptionId}/toggle-auto-renew`);
      return response.data;
    } catch (error) {
      console.error("Toggle Auto Renew API Error:", error.response?.data || error.message);
      throw error;
    }
  };

