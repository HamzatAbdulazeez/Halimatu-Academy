import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import Alert from "../../components/Alert"; 


export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });



  const showAlert = (message, type) => setAlert({ show: true, message, type });
  const closeAlert = () => setAlert((prev) => ({ ...prev, show: false }));

  const handleLogin = async (e) => {
    e.preventDefault();
    closeAlert();

    if (!loginData.email || !loginData.password) {
      showAlert("Please enter both email and password.", "error");
      return;
    }

    setLoading(true);
    try {
      const credentials = {
        email: loginData.email.trim().toLowerCase(),
        password: loginData.password,
      };

      const res = await loginUser(credentials);

      if (!res) {
        showAlert("No response from server. Please try again later.", "error");
        return;
      }

      const accessToken = res.token || res.access_token || res.data?.token;
      const refreshToken = res.refresh_token || res.data?.refresh_token;
      const user = res.user || res.data?.user;

      if (!accessToken || !user) {
        showAlert("Invalid server response. Missing authentication data.", "error");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("token", accessToken);
      } else {
        sessionStorage.setItem("token", accessToken);
      }

      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      showAlert("Welcome back! Redirecting to your dashboard...", "success");

      const role = user.role?.toLowerCase() || "student";
      setTimeout(() => {
        navigate(role === "admin" || role === "administrator" ? "/admin" : "/student");
      }, 1500);

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials and try again.";
      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">

      <Alert alert={alert} onClose={closeAlert} />

      <div className="w-full max-w-md bg-white rounded-lg p-8">

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
              alt="Halimatu Academy Logo"
              className="w-24 h-auto"
            />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm text-black font-medium mb-4">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none focus:border-[#004aad] transition"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-black font-medium mb-4">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none focus:border-[#004aad] transition"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                           text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className="w-4 h-4 border-2 border-gray-300 rounded
                                peer-checked:bg-[#004aad] peer-checked:border-[#004aad]
                                transition-all duration-200">
                  <svg
                    className="w-3 h-3 text-white absolute top-1/2 left-1/2
                                -translate-x-1/2 -translate-y-1/2 opacity-0
                                peer-checked:opacity-100 transition-opacity"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="group-hover:text-gray-800 transition-colors">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-[#004aad] hover:text-[#003a8c] hover:underline transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004aad] text-white py-3 rounded-md font-medium hover:bg-[#003a8c] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#004aad] font-semibold hover:underline transition-colors">
              Register here
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}