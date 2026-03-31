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
      return response.data;
    } catch (error) {
      console.error("Upload Profile Picture API Error:", error.response?.data || error.message);
      throw error;
    }
  };


  // ====================== REMOVE PROFILE PICTURE ======================
export const removeProfilePicture = async () => {
    try {
      const response = await axiosInstance.delete("/user/profile-picture");
      return response.data;
    } catch (error) {
      console.error("Remove Profile Picture API Error:", error.response?.data || error.message);
      throw error;
    }
  };
