import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { forgotPassword } from "../../api/authApi";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [sentToEmail, setSentToEmail] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email.trim()) {
            setError("Please enter your email address");
            setLoading(false);
            return;
        }

        try {
            await forgotPassword(email);

            // Success
            setSentToEmail(email.trim());
            setSuccess(true);
            setError("");

        } catch (err) {
            const errorMessage = err.response?.data?.detail 
                              || err.response?.data?.message 
                              || err.message 
                              || "Failed to send reset link. Please try again.";

            setError(errorMessage);
            console.error("Forgot password error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Success Screen
    if (success) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md mx-auto bg-white rounded-2xl  p-10 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Reset Link Sent!
                    </h1>

                    <p className="text-gray-600 mb-8">
                        We have sent a password reset link to<br />
                        <strong>{sentToEmail}</strong>
                    </p>

                    <p className="text-sm text-gray-500 mb-8">
                        Please check your email (including spam/junk folder) and follow the instructions.
                    </p>

                    <div className="space-y-4">
                        <Link
                            to="/login"
                            className="block w-full bg-[#004aad] text-white py-3 rounded-lg font-medium hover:bg-[#003a8c] transition"
                        >
                            Back to Login
                        </Link>

                        <button
                            onClick={() => {
                                setSuccess(false);
                                setEmail("");
                                setError("");
                            }}
                            className="w-full text-[#004aad] font-medium py-3 hover:bg-gray-50 rounded-lg transition"
                        >
                            Try another email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main Form
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8">
                <div className="text-center mb-8">
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

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Enter your registered email and we'll send you a reset link.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none "
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004aad] text-white py-3 px-4 rounded-lg hover:bg-[#003a8c] transition font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending Reset Link...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-[#004aad] hover:text-blue-700 font-medium text-sm"
                    >
                        <ArrowLeft size={18} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}