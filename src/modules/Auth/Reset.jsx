import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { resetPassword } from "../../api/authApi";

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [resetData, setResetData] = useState({
        email: "",
        otp_code: "",
        password: "",
        confirmPassword: "",
    });

    const location = useLocation();

    // Get email from navigation state (if coming from Forgot Password or OTP page)
    useEffect(() => {
        if (location.state?.email) {
            setResetData(prev => ({ ...prev, email: location.state.email }));
        }
    }, [location.state]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (!resetData.email) {
            setError("Email is required. Please go back to forgot password.");
            return;
        }
        if (!resetData.otp_code) {
            setError("Please enter the OTP code sent to your email.");
            return;
        }
        if (resetData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        if (resetData.password !== resetData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                email: resetData.email,
                otp_code: resetData.otp_code,
                new_password: resetData.password,
            };

            await resetPassword(payload);

            setSuccess(true);
            setError("");

        } catch (err) {
            const errorMsg = err.response?.data?.detail 
                          || err.response?.data?.message 
                          || err.message 
                          || "Failed to reset password. Please try again.";
            setError(errorMsg);
            console.error("Reset password error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Success Screen
    if (success) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Password Reset Successful!
                    </h1>

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

    // Reset Password Form
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-center mb-5">
                    <Link to="/">
                        <div className="w-32 h-8 bg-gray-300 rounded flex items-center justify-center">
                            <span className="text-black text-sm">LOGO</span>
                        </div>
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Enter the OTP sent to your email and your new password.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-6">
                    {/* Email (read-only if passed from previous page) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={resetData.email}
                            onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-gray-50"
                            placeholder="your@email.com"
                            required
                            disabled={!!resetData.email}   // Disable if pre-filled
                        />
                    </div>

                    {/* OTP Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            value={resetData.otp_code}
                            onChange={(e) => setResetData({ ...resetData, otp_code: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#004aad]"
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            required
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={resetData.password}
                                onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#004aad]"
                                placeholder="Enter new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={resetData.confirmPassword}
                                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#004aad]"
                                placeholder="Confirm new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004aad] text-white py-3 px-4 rounded-lg hover:bg-[#003a8c] transition font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Resetting Password...
                            </>
                        ) : (
                            "Reset Password"
                        )}
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