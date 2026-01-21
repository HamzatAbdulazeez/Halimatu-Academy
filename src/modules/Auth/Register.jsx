import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agree, setAgree] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = () => {
        if (!agree) {
            alert("Please accept the terms and conditions");
            return;
        }
        console.log("Registration data:", formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-xl bg-white rounded-lg p-8">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <div className="w-32 h-8 bg-gray-300 rounded flex items-center justify-center">
                            <span className="text-black text-sm">LOGO</span>
                        </div>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Create Your Account
                    </h1>
                    <p className="text-black text-base mt-2">
                        Complete the form below to enroll in HSA Academy programs
                    </p>
                </div>

                <div className="space-y-5">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full p-4 border border-gray-300 rounded-md outline-none text-sm"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) =>
                                setFormData({ ...formData, fullName: e.target.value })
                            }
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full p-4 border border-gray-300 rounded-md outline-none text-sm"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>

                    {/* Phone & Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                className="w-full p-4 border border-gray-300 rounded-md outline-none text-sm"
                                placeholder="+234 805 530 2760"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Country
                            </label>
                            <select
                                className="w-full p-4 border border-gray-300 rounded-md outline-none text-sm bg-white"
                                value={formData.country}
                                onChange={(e) =>
                                    setFormData({ ...formData, country: e.target.value })
                                }
                            >
                                <option value="">Select country</option>
                                <option>Nigeria</option>
                                <option>United Kingdom</option>
                                <option>United States</option>
                                <option>Canada</option>
                                <option>Others</option>
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-4 pr-12 border border-gray-300 rounded-md outline-none text-sm"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full p-4 pr-12 border border-gray-300 rounded-md outline-none text-sm"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            className="mt-1"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                        <p className="text-sm text-gray-600">
                            I agree to the{" "}
                            <Link to="/terms" className="text-blue-600 underline">
                                Terms & Conditions
                            </Link>{" "}
                            and{" "}
                            <Link to="/privacy" className="text-blue-600 underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-[#004aad] text-white py-3 rounded-md font-medium hover:bg-black transition"
                    >
                        Complete Registration
                    </button>

                    {/* Login */}
                    <p className="text-center text-sm mt-4">
                        Already registered?{" "}
                        <Link
                            to="/login"
                            className="text-[#004aad] underline"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
