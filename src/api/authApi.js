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


// ====================== RESEND OTP ======================
export const resendOtp = async ({ email, purpose = "email_verification" }) => {
    try {
        const payload = {
            email: email?.trim().toLowerCase(),
            purpose,
        };

        const response = await axiosInstance.post("/auth/resend-otp", payload);
        return response.data;
    } catch (error) {
        console.error("Resend OTP API Error:", error.response?.data || error.message);
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





  