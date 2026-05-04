import React, { useState, useCallback } from "react";
import { Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { notify } from "../../utils/toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe]     = useState(false);
    const [loading, setLoading]           = useState(false);
    const [loginData, setLoginData]       = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors]   = useState({ email: "", password: "" });
    const [touched, setTouched]           = useState({ email: false, password: false });

    const validateField = useCallback((name, value) => {
        if (name === "email") {
            if (!value.trim()) return "Email address is required.";
            if (!EMAIL_REGEX.test(value.trim())) return "Please enter a valid email address.";
            return "";
        }
        if (name === "password") {
            if (!value.trim()) return "Password is required.";
            return "";
        }
        return "";
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setTouched({ email: true, password: true });

        const emailErr    = validateField("email", loginData.email);
        const passwordErr = validateField("password", loginData.password);
        setFieldErrors({ email: emailErr, password: passwordErr });

        if (emailErr || passwordErr) {
            notify.error(emailErr || passwordErr);
            return;
        }

        setLoading(true);
        const normalizedEmail = loginData.email.trim().toLowerCase();

        let redirecting = false;

        try {
            const res = await loginUser({
                email: normalizedEmail,
                password: loginData.password,
            });

            const accessToken = res?.token || res?.access_token || res?.data?.token;
            const user        = res?.user  || res?.data?.user   || res?.data;

            if (accessToken && user) {
                if (rememberMe) localStorage.setItem("token", accessToken);
                else sessionStorage.setItem("token", accessToken);

                const refreshToken = res?.refresh_token || res?.data?.refresh_token;
                if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

                localStorage.setItem("user", JSON.stringify(user));

                notify.success("Welcome back!");
                const role = user.role?.toLowerCase() || "student";
                redirecting = true;
                setTimeout(() => {
                    navigate(role.includes("admin") ? "/admin" : "/student");
                }, 1000);
            }

        } catch (err) {
            const status  = err?.response?.status;
            const message = err?.response?.data?.message
                         || err?.response?.data?.error
                         || "Login failed. Please try again.";

            // ── 403 → email not verified ───────────────────────────────────
            if (status === 403) {
                redirecting = true;          // stop finally from clearing loader
                notify.error("Your email is not verified. Redirecting you to verify your account...");
                setTimeout(() => {
                    navigate("/verify-otp", {
                        state: { email: normalizedEmail, source: "login" },
                        replace: true,
                    });
                }, 2500);
                return;
            }

            // ── 401 → wrong password ───────────────────────────────────────
            if (status === 401) {
                setFieldErrors((prev) => ({ ...prev, password: message }));
            }

            notify.error(message);

        } finally {
            
            if (!redirecting) setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full p-4 border rounded-md text-sm outline-none transition ${
            touched[field] && fieldErrors[field]
                ? "border-red-500 bg-red-50"
                : "border-gray-300 focus:border-[#004aad]"
        }`;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-sm">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <img
                            src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
                            alt="Academy Logo"
                            className="w-24 h-auto"
                        />
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6" noValidate>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            className={inputClass("email")}
                            value={loginData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.email && fieldErrors.email && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <XCircle size={14} /> {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                className={inputClass("password")}
                                value={loginData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {touched.password && fieldErrors.password && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <XCircle size={14} /> {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="text-[#004aad] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004aad] hover:bg-[#003a8c] text-white py-3.5 rounded-md font-medium transition disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-[#004aad] font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}