import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [loginData, setLoginData] = useState({
        emailOrPhone: "",
        password: "",
    });

    const handleLogin = () => {
        console.log("Login attempt:", loginData, rememberMe);
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
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin Login
                    </h1>
                    <p className="text-base text-black mt-2">
                        Sign in to access the admin dashboard
                    </p>
                </div>

                <form className="space-y-6">

                    {/* Email / Phone */}
                    <div>
                        <label className="block text-sm text-black font-medium mb-4">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none"
                            value={loginData.emailOrPhone}
                            required
                            onChange={(e) =>
                                setLoginData({
                                    ...loginData,
                                    emailOrPhone: e.target.value,
                                })
                            }
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
                                className="w-full p-4 pr-12 border border-gray-300 rounded-md text-sm outline-none"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        password: e.target.value,
                                    })
                                }
                                required
                            />
                            <button
                                type="button" typeof="submit"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full bg-[#004aad] cursor-pointer text-white py-3 rounded-md font-medium hover:bg-black transition"
                    >
                        Login as Admin
                    </button>
                </form>
            </div>
        </div>
    );
}
