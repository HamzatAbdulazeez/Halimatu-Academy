import React, { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../api/authApi"; 
import { notify } from "../../utils/toast";

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyOtpPage() {
  const [otp, setOtp]         = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail]     = useState("");

  // Inline field error
  const [otpError, setOtpError] = useState("");
  const [touched, setTouched]   = useState(false);

  // Resend OTP state
  const [resendCooldown, setResendCooldown] = useState(0);   // seconds remaining
  const [resendLoading, setResendLoading]   = useState(false);
  const [resendCount, setResendCount]       = useState(0);   
  const cooldownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const passedEmail = location.state?.email;
    if (passedEmail) {
      setEmail(passedEmail);
    } else {
      notify.error("Session expired. Please register again.");
      navigate("/register");
    }
  }, [location.state, navigate]);

  // ─── Cooldown timer ──────────────────────────────────────────────────────
  const startCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(cooldownRef.current), []);

  // ─── Validate OTP ────────────────────────────────────────────────────────
  const validateOtp = (value) => {
    if (!value.trim())          return "OTP code is required.";
    if (!/^\d+$/.test(value))   return "OTP must contain numbers only.";
    if (value.length < 4)       return "OTP code must be at least 4 digits.";
    if (value.length > 6)       return "OTP code cannot exceed 6 digits.";
    return "";
  };

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
    if (touched) setOtpError(validateOtp(val));
  };

  const handleBlur = () => {
    setTouched(true);
    setOtpError(validateOtp(otp));
  };

  // ─── Resend OTP ──────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendLoading) return;

    if (resendCount >= 3) {
      notify.error("Maximum resend attempts reached. Please register again.");
      setTimeout(() => navigate("/register"), 2000);
      return;
    }

    setResendLoading(true);

    try {
      await resendOtp({ email }); // call your API
      notify.success("A new OTP has been sent to your email.");
      setOtp("");
      setOtpError("");
      setTouched(false);
      setResendCount((c) => c + 1);
      startCooldown();
    } catch (err) {
      console.error("Resend OTP error:", err);

      if (!err.response) {
        notify.error("Network error. Please check your internet connection.");
        return;
      }

      const status        = err.response?.status;
      const serverMessage = err.response?.data?.detail
                          || err.response?.data?.message
                          || err.response?.data?.error;

      switch (status) {
        case 404:
          notify.error("No account found for this email. Please register.");
          setTimeout(() => navigate("/register"), 2000);
          break;
        case 429:
          notify.error("Too many resend attempts. Please wait before trying again.");
          startCooldown();
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          notify.error("Server error. Please try again later.");
          break;
        default:
          notify.error(serverMessage || "Failed to resend OTP. Please try again.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setTouched(true);

    const err = validateOtp(otp);
    setOtpError(err);
    if (err) {
      notify.error(err);
      return;
    }

    if (!email) {
      notify.error("Email is missing. Please register again.");
      navigate("/register");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({ email, code: otp.trim() });
      notify.success("Email verified successfully! Redirecting to login...");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error("OTP verification error:", err);

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

      const status        = err.response?.status;
      const serverMessage = err.response?.data?.detail
                          || err.response?.data?.message
                          || err.response?.data?.error;

      switch (status) {
        case 400:
          setOtpError(serverMessage || "Invalid OTP. Please check and try again.");
          notify.error(serverMessage || "Invalid OTP. Please check and try again.");
          break;
        case 401:
          setOtpError(serverMessage || "Incorrect OTP code. Please try again.");
          notify.error(serverMessage || "Incorrect OTP code. Please try again.");
          break;
        case 404:
          notify.error(serverMessage || "No account found for this email. Please register.");
          setTimeout(() => navigate("/register"), 2000);
          break;
        case 410:
          setOtpError("This OTP has expired. Please request a new one.");
          notify.error("OTP has expired. Click 'Resend OTP' to get a new code.");
          break;
        case 429:
          notify.error("Too many attempts. Please wait a moment before trying again.");
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
          notify.error(serverMessage || err.message || "Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Success screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-10 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Verification Successful!</h1>
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

  // ─── OTP Form ────────────────────────────────────────────────────────────
  const canResend = resendCooldown === 0 && !resendLoading && resendCount < 3;

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600 text-sm">
            Enter the OTP sent to<br />
            <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-4 text-center text-2xl tracking-widest border rounded-lg outline-none transition ${
                touched && otpError
                  ? "border-red-500 bg-red-50 focus:border-red-500"
                  : "border-gray-300 focus:border-[#004aad]"
              }`}
              placeholder="123456"
              maxLength={6}
            />
            {touched && otpError ? (
              <p className="mt-1.5 text-xs text-red-600 text-center">{otpError}</p>
            ) : (
              <p className="text-xs text-gray-500 text-center mt-2">
                Check your email for the 6-digit code
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004aad] text-white py-4 rounded-lg font-medium hover:bg-[#003a8c] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
            ) : "Verify OTP"}
          </button>
        </form>

        {/* ── Resend OTP ── */}
        <div className="mt-6 text-center">
          {resendCooldown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in{" "}
              <span className="font-semibold text-[#004aad]">{resendCooldown}s</span>
            </p>
          ) : resendCount >= 3 ? (
            <p className="text-sm text-red-500">
              Maximum resend attempts reached.{" "}
              <button
                onClick={() => navigate("/register")}
                className="underline font-medium"
              >
                Register again
              </button>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={!canResend}
              className="inline-flex items-center gap-1.5 text-sm text-[#004aad] hover:text-[#003a8c] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {resendLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><RefreshCw className="w-4 h-4" /> Resend OTP</>
              )}
            </button>
          )}

          {/* Resend attempt indicator */}
          {resendCount > 0 && resendCount < 3 && (
            <p className="text-xs text-gray-400 mt-1">
              {3 - resendCount} resend attempt{3 - resendCount !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>

        <div className="text-center mt-6 space-y-3 border-t border-gray-200 pt-5">
          <Link to="/login" className="text-[#004aad] hover:text-blue-700 underline block text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

