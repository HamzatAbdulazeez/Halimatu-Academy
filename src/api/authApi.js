import axiosInstance from "./axiosInstance";

// ====================== REGISTER USER ======================
export const registerUser = async (formData) => {
    try {
        const payload = {
            first_name: formData.firstName?.trim(),
            middle_name: formData.middleName?.trim() || null,
            last_name: formData.lastName?.trim(),
            email: formData.email?.trim().toLowerCase(),
            phone_number: formData.phone?.trim() || null,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender || null,
            country: formData.country,
            city: formData.city?.trim(),
            password: formData.password,
            consent_agreement: true,
        };

        const response = await axiosInstance.post("/auth/register", payload);
        return response.data;
    } catch (error) {
        console.error("Register API Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== LOGIN USER ======================
export const loginUser = async (credentials) => {
    try {
        const payload = {
            email: credentials.email?.trim().toLowerCase(),
            password: credentials.password,
        };

        const response = await axiosInstance.post("/auth/login", payload);
        return response.data;
    } catch (error) {
        console.error("Login API Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== LOGOUT USER ======================
export const logoutUser = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("token");

    try {

        if (!refreshToken) {
            console.warn("No refresh token found, skipping API logout.");
            return { success: false, message: "No refresh token" };
        }

        const response = await axiosInstance.post(
            "/auth/logout",
            { refreshToken },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Logout API Error:",
            error?.response?.data || error.message
        );

        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "Logout failed on server, will clear session locally",
        };
    }
};


// ====================== GET CURRENT USER ======================
export const getMe = async () => {
    try {
        const response = await axiosInstance.get("/auth/user");
        return response.data;
    } catch (error) {
        console.error("GetMe API Error:", error.response?.data || error.message);
        throw error;
    }
};


// ====================== VERIFY OTP ======================
export const verifyOtp = async (verifyData) => {
    try {
        const payload = {
            email: verifyData.email?.trim().toLowerCase(),
            code: verifyData.code?.trim(),
        };

        const response = await axiosInstance.post("/auth/verify-otp", payload);
        return response.data;
    } catch (error) {
        console.error("Verify OTP API Error:", error.response?.data || error.message);
        throw error;
    }
};


// ====================== FORGOT PASSWORD ======================
export const forgotPassword = async (email) => {
    try {
        const payload = {
            email: email?.trim().toLowerCase(),
        };
        const response = await axiosInstance.post("/auth/forgot-password", payload);
        return response.data;
    } catch (error) {
        console.error("Forgot Password API Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== RESET PASSWORD ======================
export const resetPassword = async (resetPayload) => {
    try {
        const payload = {
            email: resetPayload.email?.trim().toLowerCase(),
            otp_code: resetPayload.otp_code?.trim(),
            new_password: resetPayload.new_password,
        };
        const response = await axiosInstance.post("/auth/reset-password", payload);
        return response.data;
    } catch (error) {
        console.error("Reset Password API Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== GET PROFILE ======================
export const getProfile = async () => {
    try {
        const response = await axiosInstance.get("/user/profile");
        return response.data;
    } catch (error) {
        console.error("Get Profile API Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== UPDATE PROFILE ======================
export const updateProfile = async (profileData) => {
    try {
        const payload = {
            first_name: profileData.first_name?.trim() || undefined,
            last_name: profileData.last_name?.trim() || undefined,
            phone_number: profileData.phone_number?.trim() || undefined,
            date_of_birth: profileData.date_of_birth || undefined,
            gender: profileData.gender || undefined,
            country: profileData.country?.trim() || undefined,
        };

        // Remove undefined keys so we don't send empty fields
        Object.keys(payload).forEach(
            (key) => payload[key] === undefined && delete payload[key]
        );

        const response = await axiosInstance.put("/user/profile", payload);
        return response.data;
    } catch (error) {
        console.error("Update Profile API Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== CHANGE PASSWORD ======================
export const changePassword = async (passwordData) => {
    try {
        const payload = {
            current_password: passwordData.current_password,
            new_password: passwordData.new_password,
            confirm_password: passwordData.confirm_password,
        };
        const response = await axiosInstance.post("/user/change-password", payload);
        return response.data;
    } catch (error) {
        console.error("Change Password API Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== UPLOAD PROFILE PICTURE ======================
export const uploadProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); 
      
      const response = await axiosInstance.post("/user/upload-profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // The backend returns { profile_picture: "/uploads/image.jpg" }
      const newPath = response.data.profile_picture;
  
      // Update Local Storage so the UI updates instantly
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...storedUser, profile_picture: newPath };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // This triggers the useEffect listener in your Sidebar components
      window.dispatchEvent(new Event("storage"));
  
      return response.data;
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ====================== REMOVE PROFILE PICTURE ======================
  export const removeProfilePicture = async () => {
    try {
      const response = await axiosInstance.delete("/user/profile-picture");
  
      // Clear from Local Storage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...storedUser, profile_picture: null };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      window.dispatchEvent(new Event("storage"));
  
      return response.data;
    } catch (error) {
      console.error("Remove Error:", error.response?.data || error.message);
      throw error;
    }
  };

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





// ====================== ADMIN LOGIN ======================
export const adminLogin = async (credentials) => {
    try {
        const payload = {
            email: credentials.email?.trim().toLowerCase(),
            password: credentials.password,
        };

       
        const response = await axiosInstance.post("/admin/login", payload);
        
        return response.data;
    } catch (error) {
        console.error("Admin Login API Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw error;
    }
};

// ====================== ADMIN LOGOUT ======================
export const adminLogout = async () => {
    const refreshToken = localStorage.getItem("adminRefreshToken") || 
                        sessionStorage.getItem("adminRefreshToken");
    const accessToken = localStorage.getItem("adminToken") || 
                       sessionStorage.getItem("adminToken");

    try {
        if (!refreshToken) {
            console.warn("No admin refresh token found, skipping API logout.");
            clearAdminSession();
            return { success: true, message: "Session cleared locally" };
        }

        const response = await axiosInstance.post(
            "/api/admin/logout",        // ← Change this if your endpoint is different
            { refreshToken },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        clearAdminSession();
        return response.data || { success: true };

    } catch (error) {
        console.error("Admin Logout API Error:", error?.response?.data || error.message);
        clearAdminSession();   // Always clear locally even if server fails
        return {
            success: false,
            message: error?.response?.data?.message || "Logged out locally",
        };
    }
};

// Helper function to clear admin session
const clearAdminSession = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminRefreshToken");
    sessionStorage.removeItem("adminUser");

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
};

// ====================== GET ALL USERS (ADMIN) ======================
export const getUsers = async () => {
    try {
       
        const response = await axiosInstance.get("/admin/users");
        return response.data;
    } catch (error) {
        console.error("Get Users API Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw error;
    }
};


// ====================== GET USER STATS (ADMIN) ======================
export const getUserStats = async () => {
    try {
        const response = await axiosInstance.get("/admin/users/stats");
        return response.data;
    } catch (error) {
        console.error("Get User Stats API Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== GET SINGLE USER (ADMIN) ======================
export const getUserById = async (userId) => {
    try {
        const response = await axiosInstance.get(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Get User Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== UPDATE USER (ADMIN) ======================
export const updateUser = async (userId, updateData) => {
    try {
        const response = await axiosInstance.put(`/admin/users/${userId}`, updateData);
        return response.data;
    } catch (error) {
        console.error("Update User Error:", error.response?.data || error.message);
        throw error;
    }
};

// ====================== DELETE USER (ADMIN) ======================
export const deleteUser = async (userId) => {
    try {
        const response = await axiosInstance.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Delete User Error:", error.response?.data || error.message);
        throw error;
    }
};

// ============================================================
// 🔐 ADMIN ROLES MANAGEMENT
// ============================================================

export const getAdminRoles = async () => {
    try {
        const response = await axiosInstance.get('/admin/roles');
        return response.data;
    } catch (error) {
        console.error("Get Roles Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAdminRoleById = async (roleId) => {
    try {
        const response = await axiosInstance.get(`/admin/roles/${roleId}`);
        return response.data;
    } catch (error) {
        console.error("Get Role Error:", error.response?.data || error.message);
        throw error;
    }
};

export const createAdminRole = async (roleName) => {
    try {
        const response = await axiosInstance.post('/admin/roles', { name: roleName });
        return response.data;
    } catch (error) {
        console.error("Create Role Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateAdminRole = async (roleId, updatedData) => {
    try {
        const response = await axiosInstance.put(`/admin/roles/${roleId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Update Role Error:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteAdminRole = async (roleId) => {
    try {
        const response = await axiosInstance.delete(`/admin/roles/${roleId}`);
        return response.data;
    } catch (error) {
        console.error("Delete Role Error:", error.response?.data || error.message);
        throw error;
    }
};

// ============================================================
// 🔑 PERMISSIONS MANAGEMENT
// ============================================================

export const getAllPermissions = async () => {
    try {
        const response = await axiosInstance.get('/admin/permissions');
        return response.data;
    } catch (error) {
        console.error("Get Permissions Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getRolePermissions = async (roleId) => {
    try {
        const response = await axiosInstance.get(`/admin/roles/${roleId}/permissions`);
        return response.data;
    } catch (error) {
        console.error("Get Role Permissions Error:", error.response?.data || error.message);
        throw error;
    }
};

export const assignPermissionsToRole = async (roleId, permissionIds) => {
    try {
        // Expects an array of permission IDs
        const response = await axiosInstance.post(`/admin/roles/${roleId}/permissions`, { 
            permission_ids: permissionIds 
        });
        return response.data;
    } catch (error) {
        console.error("Assign Permissions Error:", error.response?.data || error.message);
        throw error;
    }
};

// ============================================================
// 👤 ADMIN USER MANAGEMENT
// ============================================================

export const createAdmin = async (adminData) => {
    try {
        const response = await axiosInstance.post('/admin/admins', adminData);
        return response.data;
    } catch (error) {
        console.error("Create Admin Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAdmins = async () => {
    try {
        const response = await axiosInstance.get('/admin/admins');
        return response.data;
    } catch (error) {
        console.error("Get Admins Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getCurrentAdminProfile = async () => {
    try {
        const response = await axiosInstance.get('/admin/admins/me');
        return response.data;
    } catch (error) {
        console.error("Get Current Profile Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateAdmin = async (adminId, updatedData) => {
    try {
        const response = await axiosInstance.put(`/admin/admins/${adminId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Update Admin Error:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteAdmin = async (adminId) => {
    try {
        const response = await axiosInstance.delete(`/admin/admins/${adminId}`);
        return response.data;
    } catch (error) {
        console.error("Delete Admin Error:", error.response?.data || error.message);
        throw error;
    }
};

export const changeAdminPassword = async (adminId, passwordData) => {
    try {
        const response = await axiosInstance.post(`/admin/admins/${adminId}/change-password`, passwordData);
        return response.data;
    } catch (error) {
        console.error("Password Change Error:", error.response?.data || error.message);
        throw error;
    }
};

export const toggleAdminStatus = async (adminId) => {
    try {
        const response = await axiosInstance.post(`/admin/admins/${adminId}/toggle-status`);
        return response.data;
    } catch (error) {
        console.error("Toggle Status Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getDashboardStats = async () => {
    try {
      const response = await axiosInstance.get("/admin/dashboard/stats");
      return response.data?.data || response.data;
    } catch (error) {
      console.error("API Call Failed:", error.response?.data || error.message);
      throw error;
    }
  };


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


  