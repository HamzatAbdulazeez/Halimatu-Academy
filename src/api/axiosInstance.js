import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://halimatu.farmsglobal.org/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const isLoginRequest =
      config.url?.includes("/login") ||
      config.url?.includes("/admin/login") ||
      config.url?.includes("/register") ||
      config.url?.includes("/auth/refresh");

    if (isLoginRequest) return config;

    // Admin routes
    if (config.url?.includes("/admin")) {
      const adminToken =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");
      if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
      return config;
    }

    // Student/user routes
    const userToken =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");
    if (userToken) config.headers.Authorization = `Bearer ${userToken}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor with Auto-Refresh ────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAdminRoute = originalRequest?.url?.includes("/admin");
    const status = error.response?.status;

    // ── Handle 401 for student routes with auto-refresh ──
    if (status === 401 && !isAdminRoute && !originalRequest._retry) {
      // Don't retry refresh endpoint itself
      if (originalRequest.url?.includes("/auth/refresh")) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        localStorage.getItem("refresh_token") ||
        localStorage.getItem("refreshToken");

      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "https://halimatu.farmsglobal.org/api/auth/refresh",
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;

        // Save new tokens
        localStorage.setItem("token", newToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        // Update default header
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);


        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── Handle 401 for admin routes ──
    if (status === 401 && isAdminRoute) {
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminRefreshToken");
      sessionStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminUser");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;