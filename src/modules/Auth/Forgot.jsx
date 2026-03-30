import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle, ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { forgotPassword, resetPassword } from "../../api/authApi";

export default function ForgotPasswordPage() {

    const [step, setStep] = useState(1); // 1 | 2 | 3

    // Step 1
    const [email, setEmail] = useState("");

    // Step 2
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Shared
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ── Step 1: Send reset code ──────────────────────────────────────
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email.trim());
            setStep(2); // move to code + password step
        } catch (err) {
            const errorMessage =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Failed to send reset code. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ── Code input helpers ───────────────────────────────────────────
    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const updated = [...code];
        updated[index] = value.slice(-1);
        setCode(updated);
        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`)?.focus();
        }
    };

    const handleCodeKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            document.getElementById(`code-${index - 1}`)?.focus();
        }
    };

    const handleCodePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const updated = ["", "", "", "", "", ""];
        pasted.split("").forEach((char, i) => { updated[i] = char; });
        setCode(updated);
        document.getElementById(`code-${Math.min(pasted.length, 5)}`)?.focus();
    };

    const fullCode = code.join("");

    // ── Step 2: Verify code + set new password ───────────────────────
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (fullCode.length !== 6) {
            setError("Please enter the full 6-digit code from your email.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await resetPassword({
                email: email.trim(),
                otp_code: fullCode,
                new_password: password,
            });
            setStep(3);
        } catch (err) {
            const errorMessage =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Invalid or expired code. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ── Shared: Logo + Back link ─────────────────────────────────────
    const Logo = () => (
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
    );

    const ErrorBox = () =>
        error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center text-sm">
                {error}
            </div>
        ) : null;

    // ════════════════════════════════════════════════════════════════
    // STEP 3 — Success
    // ════════════════════════════════════════════════════════════════
    if (step === 3) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-10 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Password Reset!</h1>
                    <p className="text-gray-600 mb-8">
                        Your password has been successfully updated.<br />
                        You can now log in with your new password.
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

    // ════════════════════════════════════════════════════════════════
    // STEP 2 — Enter code + new password
    // ════════════════════════════════════════════════════════════════
    if (step === 2) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8">
                    <Logo />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <KeyRound className="w-7 h-7 text-[#004aad]" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
                        <p className="text-gray-600 text-sm">
                            We sent a 6-digit code to{" "}
                            <span className="font-semibold text-gray-800">{email}</span>
                        </p>
                    </div>

                    <ErrorBox />

                    <form onSubmit={handleResetPassword} className="space-y-6">

                        {/* ── 6-digit code boxes ── */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                Enter Reset Code
                            </label>
                            <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`code-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(i, e.target.value)}
                                        onKeyDown={(e) => handleCodeKeyDown(i, e)}
                                        className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none focus:border-[#004aad] focus:ring-2 focus:ring-blue-100 transition"
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 text-center mt-2">
                                Code is valid for 10 minutes · Check spam if you don't see it
                            </p>
                        </div>

                        {/* ── New Password ── */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] focus:ring-2 focus:ring-blue-100 transition pr-12"
                                    placeholder="At least 8 characters"
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

                        {/* ── Confirm Password ── */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] focus:ring-2 focus:ring-blue-100 transition pr-12"
                                    placeholder="Re-enter your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && (
                                <p className={`text-xs mt-1 ${password === confirmPassword ? "text-emerald-600" : "text-red-500"}`}>
                                    {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                                </p>
                            )}
                        </div>

                        {/* ── Submit ── */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#004aad] text-white py-3 px-4 rounded-lg hover:bg-[#003a8c] transition font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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

                    {/* Resend / go back */}
                    <div className="text-center mt-6 space-y-3">
                        <p className="text-sm text-gray-500">
                            Didn't receive the code?{" "}
                            <button
                                onClick={() => {
                                    setCode(["", "", "", "", "", ""]);
                                    setError("");
                                    handleSendCode({ preventDefault: () => {} });
                                }}
                                className="text-[#004aad] font-medium hover:underline"
                            >
                                Resend
                            </button>
                        </p>
                        <button
                            onClick={() => { setStep(1); setError(""); setCode(["", "", "", "", "", ""]); }}
                            className="inline-flex items-center gap-2 text-[#004aad] hover:text-blue-700 font-medium text-sm"
                        >
                            <ArrowLeft size={18} />
                            Use a different email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════
    // STEP 1 — Enter email
    // ════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8">
                <div className="text-center mb-8">
                    <Logo />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                    <p className="text-gray-600 text-sm">
                        Enter your registered email and we'll send you a reset code.
                    </p>
                </div>

                <ErrorBox />

                <form onSubmit={handleSendCode} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] focus:ring-2 focus:ring-blue-100 transition"
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
                                Sending Code...
                            </>
                        ) : (
                            "Send Reset Code"
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