import axiosInstance from './axiosInstance';

// ====================== STUDENT / USER PROFILE APIs ======================

// Get current student/user profile
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Get User Profile Error:", error.response?.data || error.message);
    throw error;
  }
};

// Update student/user profile (separated first_name & last_name)
export const updateUserProfile = async (profileData) => {
  try {
    const payload = {
      first_name: profileData.first_name?.trim() || undefined,
      last_name: profileData.last_name?.trim() || undefined,
      phone_number: profileData.phone_number?.trim() || undefined,
      date_of_birth: profileData.date_of_birth || undefined,
      gender: profileData.gender || undefined,
      country: profileData.country?.trim() || undefined,
    };

    // Remove undefined values
    Object.keys(payload).forEach(key => 
      payload[key] === undefined && delete payload[key]
    );

    const response = await axiosInstance.put("/user/profile", payload);
    return response.data;
  } catch (error) {
    console.error("Update User Profile Error:", error.response?.data || error.message);
    throw error;
  }
};

// Change student/user password
export const changeUserPassword = async (passwordData) => {
  try {
    const payload = {
      current_password: passwordData.current_password,
      new_password: passwordData.new_password,
      confirm_password: passwordData.confirm_password,
    };

    const response = await axiosInstance.post("/user/change-password", payload);
    return response.data;
  } catch (error) {
    console.error("Change User Password Error:", error.response?.data || error.message);
    throw error;
  }
};

// Upload student profile picture
export const uploadUserProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("/user/upload-profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Update localStorage and trigger sidebar refresh
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...storedUser, profile_picture: response.data.profile_picture };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage"));

    return response.data;
  } catch (error) {
    console.error("Upload User Profile Picture Error:", error.response?.data || error.message);
    throw error;
  }
};

// Remove student profile picture
export const removeUserProfilePicture = async () => {
  try {
    const response = await axiosInstance.delete("/user/profile-picture");

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...storedUser, profile_picture: null };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage"));

    return response.data;
  } catch (error) {
    console.error("Remove User Profile Picture Error:", error.response?.data || error.message);
    throw error;
  }
};

// ====================== ADMIN PROFILE APIs ======================

// Get Admin Profile - Returns null if endpoint doesn't exist yet (405/404)
export const getAdminProfile = async () => {
    try {
      const response = await axiosInstance.get('/admin/profile/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 405 || error.response?.status === 404) {
        console.warn("GET /admin/profile/me is not available yet.");
        return null;
      }
      console.error("Get Admin Profile Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // Update Admin Profile - This is the main working endpoint
  export const updateAdminProfile = async (data) => {
    try {
      const payload = {
        name: data.name?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
      };
  
      // Remove undefined fields
      Object.keys(payload).forEach(key => 
        payload[key] === undefined && delete payload[key]
      );
  
      const response = await axiosInstance.put('/admin/profile/me', payload);
      return response.data;
    } catch (error) {
      console.error("Update Admin Profile Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // Change Admin Password
  export const changeAdminPassword = async (passwordData) => {
    try {
      const payload = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      };
  
      const response = await axiosInstance.post('/admin/profile/change-password', payload);
      return response.data;
    } catch (error) {
      console.error("Change Admin Password Error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // Upload Profile Picture (optional for now)
  export const uploadAdminProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
  
      const response = await axiosInstance.post('/admin/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Upload Profile Picture Error:", error.response?.data || error.message);
      throw error;
    }
  };

export default {
  // User/Student
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  uploadUserProfilePicture,
  removeUserProfilePicture,

  // Admin
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  uploadAdminProfilePicture,
};