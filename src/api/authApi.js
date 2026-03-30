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

// ====================== LOGOUT ======================
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout API Error:", error.response?.data || error.message);
    throw error;
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