import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../../api/authApi";

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Get email from previous page (Register or Forgot Password)
    useEffect(() => {
        const passedEmail = location.state?.email;
        if (passedEmail) {
            setEmail(passedEmail);
        } else {
            // Fallback: redirect back to register if no email
            navigate("/register");
        }
    }, [location.state, navigate]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email) {
            setError("Email is missing. Please register again.");
            setLoading(false);
            return;
        }

        if (!otp.trim() || otp.length < 4) {
            setError("Please enter a valid OTP code.");
            setLoading(false);
            return;
        }

        try {
            await verifyOtp({
                email: email,
                code: otp.trim(),
            });

            // Success → Show success message then redirect to login
            setSuccess(true);

            // Auto redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            const errorMsg = err.response?.data?.detail 
                          || err.response?.data?.message 
                          || err.message 
                          || "Invalid OTP. Please try again.";
            setError(errorMsg);
            console.error("OTP verification error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Success Screen
    if (success) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-10 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Verification Successful!
                    </h1>

                    <p className="text-gray-600 mb-8">
                        Your account has been verified successfully.<br />
                        You will be redirected to the login page shortly.
                    </p>

                    <Link
                        to="/login"
                        className="block w-full bg-[#004aad] text-white py-3 rounded-lg font-medium hover:bg-[#003a8c] transition"
                    >
                        Go to Login Now
                    </Link>
                </div>
            </div>
        );
    }

    // OTP Form
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8">
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

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Enter the OTP sent to<br />
                        <strong>{email}</strong>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-4 text-center text-2xl tracking-widest border border-gray-300 rounded-lg outline-none focus:border-[#004aad]"
                            placeholder="123456"
                            maxLength={6}
                            required
                        />
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Check your email for the 6-digit code
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004aad] text-white py-4 rounded-lg font-medium hover:bg-[#003a8c] transition flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify OTP"
                        )}
                    </button>
                </form>

                <div className="text-center mt-8 space-y-4">
                    <Link
                        to="/login"
                        className="text-[#004aad] hover:text-blue-700 underline block text-sm"
                    >
                        Back to Login
                    </Link>

                    <button
                        onClick={() => navigate("/register")}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                        Didn't receive code? Register again
                    </button>
                </div>
            </div>
        </div>
    );
}