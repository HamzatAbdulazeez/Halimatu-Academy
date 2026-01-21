import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleForgotPassword = () => {
        console.log("Forgot password for:", email);
        // redirect to reset password
    };
    
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-md p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-5 items-center">
                        <Link to="/">
                            <div className="w-32 h-8 bg-gray-300 rounded flex items-center justify-center">
                                <span className="text-black text-sm">LOGO</span>
                            </div>
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-600">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg  outline-none"
                            placeholder="Enter your email address"
                        />
                    </div>

                    {/* Send Reset Link Button */}
                    <button
                        onClick={handleForgotPassword}
                        className="w-full bg-[#004aad] text-white py-3 px-4 rounded-lg hover:bg-blue-700 cursor-pointer text-sm"
                    >
                        Send Reset Link
                    </button>

                    {/* Back to Login */}
                    <div className="text-center mt-4">
                        <Link
                            to="/login"
                            className="text-[#004aad] underline hover:text-blue-700 font-medium text-sm"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
