import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetData, setResetData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleResetPassword = () => {
        if (resetData.password !== resetData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        console.log("Password reset:", resetData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-lg p-8">
                <div className="flex justify-center mb-5 items-center">
                    <Link to="/">
                        <div className="w-32 h-8 bg-gray-300 rounded flex items-center justify-center">
                            <span className="text-black text-sm">LOGO</span>
                        </div>
                    </Link>
                </div>
                <div className="text-left mb-8">
                    <h1 className="text-2xl text-center font-bold text-gray-900 mb-2">
                        Reset Password
                    </h1>
                    <p className="text-black text-center">
                        Enter your new password below to reset your account password.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* New Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={resetData.password}
                                onChange={(e) =>
                                    setResetData({ ...resetData, password: e.target.value })
                                }
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={resetData.confirmPassword}
                                onChange={(e) =>
                                    setResetData({ ...resetData, confirmPassword: e.target.value })
                                }
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={handleResetPassword}
                        className="w-full bg-[#004aad] cursor-pointer text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-sm"
                    >
                        Reset Password
                    </button>

                    {/* Back to Login */}
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-[#004aad] hover:text-blue-700 underline text-sm"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
