import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginUser } from "../../api/authApi";

export default function LoginPage() {
    const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    console.log("🔵 Sending login request:", {
      email: loginData.email.trim().toLowerCase(),
      password: "********" // Don't log actual password
    });

    try {
      const credentials = {
        email: loginData.email.trim().toLowerCase(),
        password: loginData.password,
      };

      const res = await loginUser(credentials);
      console.log("🟢 Login response:", res);

      // Check response structure
      if (!res) {
        toast.error("No response from server");
        return;
      }

      // Handle different response structures
      const token = res.token || res.data?.token || res.access_token;
      const user = res.user || res.data?.user;

      console.log("🟢 Extracted token:", token ? "Yes" : "No");
      console.log("🟢 Extracted user:", user ? "Yes" : "No");

      if (!token || !user) {
        console.error("Response structure:", res);
        toast.error("Invalid server response. Check console.");
        return;
      }

      // Save token
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Welcome back! 👋");

      // Navigate based on role
      const role = user.role?.toLowerCase() || "student";
      console.log("🟢 User role:", role);

      setTimeout(() => {
        if (role === "admin" || role === "administrator") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
      }, 1000);

    } catch (err) {
      console.error("🔴 Login error:", err);
      console.error("🔴 Error response:", err.response);
      console.error("🔴 Error message:", err.message);

      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || "Login failed. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-lg p-8">

                {/* Logo */}
                <div className="flex items-center justify-center min-h-20 w-full">
                    <Link to="/">
                        <img
                            src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
                            alt="Halimatu Academy Logo"
                            draggable="false"
                            className="w-24 h-auto mb-4"
                        />
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Login</h1>
                    <p className="text-base text-black mt-2">
                        Sign in to access your dashboard
                    </p>
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
                                className="w-full p-4 pr-12 border border-gray-300 rounded-md text-sm outline-none focus:border-[#004aad] transition"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me + Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004aad] text-white py-3 rounded-md font-medium hover:bg-[#003a8c] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-sm text-gray-500">Or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-sm mt-4">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-[#004aad] underline hover:text-blue-700">
                            Register here
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}