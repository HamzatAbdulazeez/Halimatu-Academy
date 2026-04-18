import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://halimatu.farmsglobal.org/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 60000, 
});

// Request Interceptor - Smart Token Handling
axiosInstance.interceptors.request.use(
  (config) => {
    // === SKIP TOKEN FOR LOGIN ENDPOINTS (Very Important) ===
    const isLoginRequest = 
      config.url?.includes("/login") || 
      config.url?.includes("/admin/login") ||
      config.url?.includes("/register");

    if (isLoginRequest) {
      // Do NOT attach any token for login requests
      return config;
    }

    // For admin routes - check admin tokens first
    if (config.url?.includes("/admin")) {
      const adminToken = 
        localStorage.getItem("adminToken") || 
        sessionStorage.getItem("adminToken");

      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
      return config;
    }

    // For regular student/user routes
    const userToken = 
      localStorage.getItem("token") || 
      sessionStorage.getItem("token");

    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = error.config?.url?.includes("/admin");

      if (isAdminRoute) {
        // Clear only admin session
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminRefreshToken");
        sessionStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("adminUser");

        // Redirect to admin login
        window.location.href = "/admin/login";
      } else {
        // Clear student/user session
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;