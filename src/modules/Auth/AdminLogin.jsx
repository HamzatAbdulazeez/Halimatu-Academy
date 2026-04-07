import React, { useState, useCallback } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { notify } from "../../utils/toast";
import { adminLogin } from "../../api/authApi";

const PASSWORD_RULES = [
    { id: "minLength", label: "At least 8 characters", test: (p) => p.length >= 8 },
    { id: "uppercase", label: "At least one uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
    { id: "lowercase", label: "At least one lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
    { id: "number", label: "At least one number (0–9)", test: (p) => /[0-9]/.test(p) },
    { id: "special", label: "At least one special character (# @ ! $ …)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({ email: false, password: false });

    const passwordRuleResults = PASSWORD_RULES.map((rule) => ({
        ...rule,
        passed: rule.test(loginData.password),
    }));

    const allRulesPassed = passwordRuleResults.every((r) => r.passed);
    const showChecklist =
        passwordFocused || (touched.password && loginData.password.length > 0 && !allRulesPassed);

    const validateField = useCallback((name, value) => {
        if (name === "email") {
            if (!value.trim()) return "Email address is required.";
            if (!EMAIL_REGEX.test(value.trim())) return "Please enter a valid email address.";
            return "";
        }
        if (name === "password") {
            if (!value) return "Password is required.";
            if (value.length < 8) return "Password must be at least 8 characters.";
            if (!/[A-Z]/.test(value)) return "Missing uppercase letter.";
            if (!/[a-z]/.test(value)) return "Missing lowercase letter.";
            if (!/[0-9]/.test(value)) return "Missing a number.";
            if (!/[^A-Za-z0-9]/.test(value)) return "Missing special character.";
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

        const emailErr = validateField("email", loginData.email);
        const passwordErr = validateField("password", loginData.password);
        setFieldErrors({ email: emailErr, password: passwordErr });

        if (emailErr || passwordErr) {
            if (emailErr) notify.error(emailErr);
            if (passwordErr) setTimeout(() => notify.error(passwordErr), 100); // 100ms gap
            return;
        }

        setLoading(true);

        try {
            const res = await adminLogin({
                email: loginData.email.trim().toLowerCase(),
                password: loginData.password,
            });

            console.log("🔍 API Response Received:", res);

            const accessToken = res?.access_token || res?.token;
            const adminUser = res?.admin || {};

            if (!accessToken) {
                notify.error("Authentication failed: No access token.");
                return;
            }

            // Handle role as an object or string
            let roleName = "";
            if (adminUser.role && typeof adminUser.role === "object") {
                roleName = adminUser.role.name || adminUser.role.slug || "";
            } else {
                roleName = adminUser.role || "";
            }

            const role = String(roleName).toLowerCase().trim();
            const allowedRoles = ["admin", "administrator", "superadmin", "super_admin"];

            console.log("🔍 Extracted Role Name:", role);

            if (role && !allowedRoles.includes(role)) {
                notify.error(`Access Denied: Role "${role}" not authorized.`);
                return;
            }

            // Storage logic
            sessionStorage.setItem("adminToken", accessToken);
            sessionStorage.setItem("adminUser", JSON.stringify(adminUser));

            if (rememberMe) {
                localStorage.setItem("adminToken", accessToken);
                localStorage.setItem("adminUser", JSON.stringify(adminUser));
            }

            notify.success("Welcome, Administrator!");

            setTimeout(() => {
                navigate("/admin");
            }, 1200);

        } catch (err) {
            // ✅ FIX 2: Handle all possible API error shapes
            const data = err?.response?.data;

            if (Array.isArray(data?.errors)) {
                // e.g. { errors: ["Email not found", "Wrong password"] }
                data.errors.forEach((e) =>
                    notify.error(typeof e === "string" ? e : e?.message || "An error occurred.")
                );
            } else if (Array.isArray(data?.messages)) {
                // e.g. { messages: ["Invalid email", "Wrong password"] }
                data.messages.forEach((m) => notify.error(m));
            } else if (data?.message) {
                // e.g. { message: "Invalid credentials" }
                notify.error(data.message);
            } else if (data?.error) {
                // e.g. { error: "Unauthorized" }
                notify.error(data.error);
            } else if (typeof data === "string" && data.trim()) {
                // plain string response body
                notify.error(data);
            } else if (err?.message) {
                // network errors like "Network Error" or "timeout"
                notify.error(err.message);
            } else {
                notify.error("Invalid Admin Credentials.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-sm">

                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <img
                            src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
                            alt="Halimatu Academy Logo"
                            className="w-24 h-auto"
                        />
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#004aad]/10 text-[#004aad] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                        <ShieldCheck size={14} />
                        Secure Admin Access
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6" noValidate>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="superadmin@halimatu.com"
                            value={loginData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full p-4 border rounded-md text-sm outline-none transition ${
                                touched.email && fieldErrors.email
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-[#004aad]"
                            }`}
                        />
                        {/* Inline error message under email */}
                        {touched.email && fieldErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={loginData.password}
                                onChange={handleChange}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={(e) => {
                                    setPasswordFocused(false);
                                    handleBlur(e);
                                }}
                                className={`w-full p-4 border rounded-md text-sm outline-none transition ${
                                    touched.password && fieldErrors.password
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-[#004aad]"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Inline error message under password */}
                        {touched.password && fieldErrors.password && !showChecklist && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                        )}

                        {/* Password rules checklist */}
                        {showChecklist && (
                            <ul className="mt-3 space-y-1.5 bg-gray-50 border rounded-md p-3 text-[11px]">
                                {passwordRuleResults.map((rule) => (
                                    <li
                                        key={rule.id}
                                        className={`flex items-center gap-2 ${
                                            rule.passed ? "text-green-600" : "text-gray-400"
                                        }`}
                                    >
                                        {rule.passed ? (
                                            <CheckCircle2 size={12} />
                                        ) : (
                                            <XCircle size={12} />
                                        )}
                                        {rule.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label>Remember my session</label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004aad] hover:bg-[#003a8c] text-white py-4 rounded-md font-bold transition flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Sign In to Dashboard"
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    <Link to="/login" className="text-[#004aad] font-medium">
                        Student Portal
                    </Link>
                </p>
            </div>
        </div>
    );
}