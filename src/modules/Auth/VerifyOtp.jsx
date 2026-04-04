import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Loader2, CheckCircle, CheckCircle2, XCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import { notify } from "../../utils/toast";

// ─── Password rules ────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
    { id: "minLength", label: "At least 8 characters", test: (p) => p.length >= 8 },
    { id: "uppercase", label: "At least one uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
    { id: "lowercase", label: "At least one lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
    { id: "number", label: "At least one number (0–9)", test: (p) => /[0-9]/.test(p) },
    { id: "special", label: "At least one special character (# @ ! $ …)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const INITIAL_ERRORS = { otp_code: "", password: "", confirmPassword: "" };

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const [resetData, setResetData] = useState({
        email: "", otp_code: "", password: "", confirmPassword: "",
    });

    const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);
    const [touched, setTouched] = useState({});

    const location = useLocation();

    useEffect(() => {
        if (location.state?.email) {
            setResetData((prev) => ({ ...prev, email: location.state.email }));
        }
    }, [location.state]);

    // ─── Live password checklist ───────────────────────────────────────────────
    const passwordRuleResults = PASSWORD_RULES.map((rule) => ({
        ...rule,
        passed: rule.test(resetData.password),
    }));
    const allRulesPassed = passwordRuleResults.every((r) => r.passed);
    const showChecklist =
        passwordFocused ||
        (touched.password && resetData.password.length > 0 && !allRulesPassed);

    // ─── Validators ───────────────────────────────────────────────────────────
    const validateField = useCallback((name, value) => {
        switch (name) {
            case "otp_code":
                if (!value.trim()) return "OTP code is required.";
                if (!/^\d+$/.test(value)) return "OTP must contain numbers only.";
                if (value.length < 4) return "OTP code must be at least 4 digits.";
                if (value.length > 6) return "OTP code cannot exceed 6 digits.";
                return "";
            case "password":
                if (!value) return "Password is required.";
                if (value.length < 8) return "Password must be at least 8 characters.";
                if (!/[A-Z]/.test(value)) return "Password needs at least one uppercase letter (A–Z).";
                if (!/[a-z]/.test(value)) return "Password needs at least one lowercase letter (a–z).";
                if (!/[0-9]/.test(value)) return "Password needs at least one number (0–9).";
                if (!/[^A-Za-z0-9]/.test(value)) return "Password needs at least one special character (e.g. #, @, !).";
                return "";
            case "confirmPassword":
                if (!value) return "Please confirm your password.";
                return "";
            default:
                return "";
        }
    }, []);

    // ─── Handle input change ───────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;

        // OTP: digits only
        const sanitized = name === "otp_code" ? value.replace(/\D/g, "").slice(0, 6) : value;
        setResetData((prev) => ({ ...prev, [name]: sanitized }));

        if (touched[name]) {
            let err = validateField(name, sanitized);
            // Live confirm check when password changes
            if (name === "password") {
                const confirmErr = resetData.confirmPassword && sanitized !== resetData.confirmPassword
                    ? "Passwords do not match."
                    : "";
                setFieldErrors((prev) => ({ ...prev, password: err, confirmPassword: confirmErr }));
                return;
            }
            if (name === "confirmPassword") {
                err = !sanitized
                    ? "Please confirm your password."
                    : sanitized !== resetData.password
                        ? "Passwords do not match."
                        : "";
            }
            setFieldErrors((prev) => ({ ...prev, [name]: err }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        let err = validateField(name, value);
        if (name === "confirmPassword") {
            err = !value
                ? "Please confirm your password."
                : value !== resetData.password
                    ? "Passwords do not match."
                    : "";
        }
        setFieldErrors((prev) => ({ ...prev, [name]: err }));
    };

    // ─── Submit ────────────────────────────────────────────────────────────────
    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Force touch all
        setTouched({ otp_code: true, password: true, confirmPassword: true });

        const otpErr = validateField("otp_code", resetData.otp_code);
        const passErr = validateField("password", resetData.password);
        const confirmErr = !resetData.confirmPassword
            ? "Please confirm your password."
            : resetData.confirmPassword !== resetData.password
                ? "Passwords do not match."
                : "";

        setFieldErrors({ otp_code: otpErr, password: passErr, confirmPassword: confirmErr });

        if (!resetData.email) {
            notify.error("Email is required. Please go back to forgot password.");
            return;
        }
        if (otpErr) { notify.error(otpErr); return; }
        if (passErr) { notify.error(passErr); return; }
        if (confirmErr) { notify.error(confirmErr); return; }

        setLoading(true);

        try {
            await resetPassword({
                email: resetData.email,
                otp_code: resetData.otp_code,
                new_password: resetData.password,
            });

            notify.success("Password reset successfully! You can now log in.");
            setSuccess(true);

        } catch (err) {
            console.error("Reset password error:", err);

            // ── Network errors ─────────────────────────────────────────────────
            if (!err.response) {
                if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
                    notify.error("Network error. Please check your internet connection.");
                } else if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
                    notify.error("Request timed out. Please try again.");
                } else {
                    notify.error("Unable to reach the server. Please try again later.");
                }
                return;
            }

            const status = err.response?.status;
            const serverMessage = err.response?.data?.detail
                || err.response?.data?.message
                || err.response?.data?.error;

            switch (status) {
                case 400:
                    setFieldErrors((prev) => ({
                        ...prev,
                        otp_code: serverMessage || "Invalid OTP code. Please check and try again.",
                    }));
                    notify.error(serverMessage || "Invalid OTP code. Please check and try again.");
                    break;
                case 401:
                    setFieldErrors((prev) => ({
                        ...prev,
                        otp_code: serverMessage || "Incorrect OTP code. Please try again.",
                    }));
                    notify.error(serverMessage || "Incorrect OTP code. Please try again.");
                    break;
                case 404:
                    notify.error(serverMessage || "Account not found. Please check your email.");
                    break;
                case 410:
                    setFieldErrors((prev) => ({
                        ...prev,
                        otp_code: "This OTP has expired. Please request a new reset code.",
                    }));
                    notify.error("OTP has expired. Please go back and request a new reset code.");
                    break;
                case 422:
                    if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                        err.response.data.errors.forEach((fieldErr) => {
                            const msg = fieldErr.message || fieldErr.msg || JSON.stringify(fieldErr);
                            const field = fieldErr.field || fieldErr.path;
                            if (field && Object.prototype.hasOwnProperty.call(INITIAL_ERRORS, field)) {
                                setFieldErrors((prev) => ({ ...prev, [field]: msg }));
                            }
                            notify.error(msg);
                        });
                    } else {
                        notify.error(serverMessage || "Validation failed. Please review your input.");
                    }
                    break;
                case 429:
                    notify.error("Too many attempts. Please wait before trying again.");
                    break;
                case 500:
                    notify.error("Server error. Please try again later.");
                    break;
                case 502:
                case 503:
                case 504:
                    notify.error("The server is currently unavailable. Please try again shortly.");
                    break;
                default:
                    notify.error(serverMessage || err.message || "Failed to reset password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ─── Input class helper ────────────────────────────────────────────────────
    const inputClass = (field, extra = "") =>
        `w-full px-4 py-3 border rounded-lg outline-none transition ${extra} ${touched[field] && fieldErrors[field]
            ? "border-red-500 bg-red-50 focus:border-red-500"
            : "border-gray-300 focus:border-[#004aad]"
        }`;

    const FieldError = ({ field }) =>
        touched[field] && fieldErrors[field] ? (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <XCircle size={13} className="shrink-0" />
                {fieldErrors[field]}
            </p>
        ) : null;

    // ─── Success screen ────────────────────────────────────────────────────────
    if (success) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-10 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Password Reset Successful!</h1>
                    <p className="text-gray-600 mb-8">
                        Your password has been updated successfully.
                    </p>
                    <Link
                        to="/login"
                        className="block w-full bg-[#004aad] text-white py-3 rounded-lg font-medium hover:bg-[#003a8c] transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // ─── Reset Password Form ───────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8">

                {/* Logo */}
                <div className="flex justify-center mb-5">
                    <Link to="/">
                        <img
                            src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
                            alt="Halimatu Academy Logo"
                            draggable="false"
                            className="w-24 h-auto"
                        />
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600 text-sm">
                        Enter the OTP sent to your email and your new password.
                    </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6" noValidate>

                    {/* ── Email (read-only if pre-filled) ──────────────────────────── */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={resetData.email}
                            onChange={(e) => setResetData((prev) => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-gray-50 focus:border-[#004aad] transition"
                            placeholder="your@email.com"
                            disabled={!!resetData.email}
                        />
                    </div>

                    {/* ── OTP Code ─────────────────────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="otp_code"
                            value={resetData.otp_code}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputClass("otp_code")}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                        />
                        <FieldError field="otp_code" />
                    </div>

                    {/* ── New Password ──────────────────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={resetData.password}
                                onChange={handleChange}
                                onBlur={(e) => { setPasswordFocused(false); handleBlur(e); }}
                                onFocus={() => setPasswordFocused(true)}
                                className={inputClass("password", "pr-12")}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <FieldError field="password" />

                        {/* Live password checklist */}
                        {showChecklist && (
                            <ul className="mt-3 space-y-1.5 bg-gray-50 border border-gray-200 rounded-md p-3">
                                {passwordRuleResults.map((rule) => (
                                    <li
                                        key={rule.id}
                                        className={`flex items-center gap-2 text-xs transition-colors ${rule.passed ? "text-green-600" : "text-gray-500"
                                            }`}
                                    >
                                        {rule.passed
                                            ? <CheckCircle2 size={13} className="shrink-0 text-green-500" />
                                            : <XCircle size={13} className="shrink-0 text-gray-400" />
                                        }
                                        {rule.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* ── Confirm Password ──────────────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={resetData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={inputClass("confirmPassword", "pr-12")}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {/* Live match indicator */}
                        {touched.confirmPassword && resetData.confirmPassword.length > 0 && (
                            <p className={`mt-1.5 text-xs flex items-center gap-1 ${resetData.confirmPassword === resetData.password ? "text-green-600" : "text-red-600"
                                }`}>
                                {resetData.confirmPassword === resetData.password
                                    ? <><CheckCircle2 size={13} className="shrink-0" /> Passwords match</>
                                    : <><XCircle size={13} className="shrink-0" /> Passwords do not match</>
                                }
                            </p>
                        )}
                    </div>

                    {/* ── Submit ───────────────────────────────────────────────────── */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004aad] text-white py-3 px-4 rounded-lg hover:bg-[#003a8c] transition font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Resetting Password...</>
                        ) : "Reset Password"}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="text-[#004aad] hover:text-blue-700 underline text-sm"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}