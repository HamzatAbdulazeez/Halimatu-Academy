import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Loader2, CheckCircle, CheckCircle2, XCircle,
  ArrowLeft, Eye, EyeOff, KeyRound,
} from "lucide-react";
import { forgotPassword, resetPassword } from "../../api/authApi";
import { notify } from "../../utils/toast";

// ─── Password rules ────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: "minLength", label: "At least 8 characters",                      test: (p) => p.length >= 8 },
  { id: "uppercase", label: "At least one uppercase letter (A–Z)",        test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "At least one lowercase letter (a–z)",        test: (p) => /[a-z]/.test(p) },
  { id: "number",    label: "At least one number (0–9)",                  test: (p) => /[0-9]/.test(p) },
  { id: "special",   label: "At least one special character (# @ ! $ …)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Shared API error handler ──────────────────────────────────────────────────
const handleApiError = (err, fallback = "Something went wrong. Please try again.") => {
  if (!err.response) {
    if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
      notify.error("Network error. Please check your internet connection.");
    } else if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      notify.error("Request timed out. Please try again.");
    } else {
      notify.error("Unable to reach the server. Please try again later.");
    }
    return null;
  }
  return err.response?.data?.detail || err.response?.data?.message || err.response?.data?.error || fallback;
};

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1 | 2 | 3

  // Step 1
  const [email, setEmail]         = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  // Step 2 — code boxes
  const [code, setCode]                         = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError]               = useState("");
  const [codeTouched, setCodeTouched]           = useState(false);

  // Step 2 — new password
  const [password, setPassword]                 = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [passwordFocused, setPasswordFocused]   = useState(false);
  const [passwordTouched, setPasswordTouched]   = useState(false);
  const [confirmTouched, setConfirmTouched]     = useState(false);
  const [passwordError, setPasswordError]       = useState("");
  const [confirmError, setConfirmError]         = useState("");

  const [loading, setLoading] = useState(false);

  // ─── Live password checklist ───────────────────────────────────────────────
  const passwordRuleResults = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));
  const allRulesPassed = passwordRuleResults.every((r) => r.passed);
  const showChecklist =
    passwordFocused || (passwordTouched && password.length > 0 && !allRulesPassed);

  // ─── Validators ───────────────────────────────────────────────────────────
  const validateEmail = useCallback((val) => {
    if (!val.trim())                   return "Email address is required.";
    if (!EMAIL_REGEX.test(val.trim())) return "Please enter a valid email address.";
    return "";
  }, []);

  const validatePassword = useCallback((val) => {
    if (!val)                        return "Password is required.";
    if (val.length < 8)              return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(val))          return "Password needs at least one uppercase letter (A–Z).";
    if (!/[a-z]/.test(val))          return "Password needs at least one lowercase letter (a–z).";
    if (!/[0-9]/.test(val))          return "Password needs at least one number (0–9).";
    if (!/[^A-Za-z0-9]/.test(val))   return "Password needs at least one special character (e.g. #, @, !).";
    return "";
  }, []);

  const validateConfirm = (val, pw) => {
    if (!val)               return "Please confirm your password.";
    if (val !== pw)         return "Passwords do not match.";
    return "";
  };

  const validateCode = (c) => {
    const full = c.join("");
    if (full.length === 0) return "Please enter the 6-digit code sent to your email.";
    if (full.length < 6)   return "Code must be 6 digits. Please complete all boxes.";
    return "";
  };

  // ─── Step 1: Send reset code ───────────────────────────────────────────────
  const handleSendCode = async (e) => {
    e?.preventDefault?.();
    setEmailTouched(true);

    const err = validateEmail(email);
    setEmailError(err);
    if (err) { notify.error(err); return; }

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      notify.success("Reset code sent! Please check your email.");
      setStep(2);
    } catch (err) {
      console.error("Forgot password error:", err);
      const status  = err.response?.status;
      const message = handleApiError(err, "Failed to send reset code. Please try again.");
      if (!message) return; // network error already toasted

      switch (status) {
        case 404:
          setEmailError(message || "No account found with this email address.");
          notify.error(message || "No account found with this email. Please register first.");
          break;
        case 429:
          notify.error("Too many requests. Please wait a moment before trying again.");
          break;
        case 500:
          notify.error("Server error. Please try again later.");
          break;
        default:
          notify.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Code input helpers ───────────────────────────────────────────────────
  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...code];
    updated[index] = value.slice(-1);
    setCode(updated);
    if (codeTouched) setCodeError(validateCode(updated));
    if (value && index < 5) document.getElementById(`code-${index + 1}`)?.focus();
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted  = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setCode(updated);
    if (codeTouched) setCodeError(validateCode(updated));
    document.getElementById(`code-${Math.min(pasted.length, 5)}`)?.focus();
  };

  // ─── Step 2: Reset password ────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Force touch all fields
    setCodeTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);

    const codeErr    = validateCode(code);
    const passErr    = validatePassword(password);
    const confirmErr = validateConfirm(confirmPassword, password);

    setCodeError(codeErr);
    setPasswordError(passErr);
    setConfirmError(confirmErr);

    if (codeErr)    { notify.error(codeErr);    return; }
    if (passErr)    { notify.error(passErr);    return; }
    if (confirmErr) { notify.error(confirmErr); return; }

    setLoading(true);
    try {
      await resetPassword({
        email:        email.trim(),
        otp_code:     code.join(""),
        new_password: password,
      });
      notify.success("Password reset successfully! You can now log in.");
      setStep(3);
    } catch (err) {
      console.error("Reset password error:", err);
      const status  = err.response?.status;
      const message = handleApiError(err, "Invalid or expired code. Please try again.");
      if (!message) return;

      switch (status) {
        case 400:
          setCodeError(message || "Invalid reset code. Please check and try again.");
          notify.error(message || "Invalid reset code. Please check and try again.");
          break;
        case 401:
          setCodeError(message || "Incorrect code. Please try again.");
          notify.error(message || "Incorrect code. Please try again.");
          break;
        case 410:
          setCodeError("This code has expired. Please request a new one.");
          notify.error("Reset code has expired. Please request a new one.");
          break;
        case 404:
          notify.error(message || "Account not found. Please try again.");
          break;
        case 429:
          notify.error("Too many attempts. Please wait before trying again.");
          break;
        case 500:
          notify.error("Server error. Please try again later.");
          break;
        default:
          notify.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Shared components ────────────────────────────────────────────────────
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

          <form onSubmit={handleResetPassword} className="space-y-6" noValidate>

            {/* ── 6-digit code boxes ─────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter Reset Code
              </label>
              <div
                className="flex justify-center gap-2"
                onPaste={handleCodePaste}
              >
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
                    onBlur={() => { setCodeTouched(true); setCodeError(validateCode(code)); }}
                    className={`w-12 h-12 text-center text-xl font-bold border rounded-lg outline-none transition ${
                      codeTouched && codeError
                        ? "border-red-500 bg-red-50 focus:border-red-500"
                        : "border-gray-300 focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                ))}
              </div>
              {codeTouched && codeError ? (
                <p className="text-xs text-red-600 text-center mt-2 flex items-center justify-center gap-1">
                  <XCircle size={13} className="shrink-0" />{codeError}
                </p>
              ) : (
                <p className="text-xs text-gray-400 text-center mt-2">
                  Code is valid for 10 minutes · Check spam if you don't see it
                </p>
              )}
            </div>

            {/* ── New Password ───────────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordTouched) setPasswordError(validatePassword(e.target.value));
                    if (confirmTouched)  setConfirmError(validateConfirm(confirmPassword, e.target.value));
                  }}
                  onBlur={() => { setPasswordTouched(true); setPasswordFocused(false); setPasswordError(validatePassword(password)); }}
                  onFocus={() => setPasswordFocused(true)}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition pr-12 ${
                    passwordTouched && passwordError
                      ? "border-red-500 bg-red-50 focus:border-red-500"
                      : "border-gray-300 focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder="At least 8 characters"
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
              {passwordTouched && passwordError && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <XCircle size={13} className="shrink-0" />{passwordError}
                </p>
              )}

              {/* Live password checklist */}
              {showChecklist && (
                <ul className="mt-3 space-y-1.5 bg-gray-50 border border-gray-200 rounded-md p-3">
                  {passwordRuleResults.map((rule) => (
                    <li
                      key={rule.id}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        rule.passed ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {rule.passed
                        ? <CheckCircle2 size={13} className="shrink-0 text-green-500" />
                        : <XCircle      size={13} className="shrink-0 text-gray-400"  />
                      }
                      {rule.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Confirm Password ───────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmTouched) setConfirmError(validateConfirm(e.target.value, password));
                  }}
                  onBlur={() => { setConfirmTouched(true); setConfirmError(validateConfirm(confirmPassword, password)); }}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition pr-12 ${
                    confirmTouched && confirmError
                      ? "border-red-500 bg-red-50 focus:border-red-500"
                      : "border-gray-300 focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder="Re-enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Live match indicator */}
              {confirmTouched && confirmPassword.length > 0 && (
                <p className={`mt-1.5 text-xs flex items-center gap-1 ${
                  confirmPassword === password ? "text-green-600" : "text-red-600"
                }`}>
                  {confirmPassword === password
                    ? <><CheckCircle2 size={13} className="shrink-0" /> Passwords match</>
                    : <><XCircle      size={13} className="shrink-0" /> Passwords do not match</>
                  }
                </p>
              )}
            </div>

            {/* ── Submit ─────────────────────────────────────────────────── */}
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

          {/* Resend / go back */}
          <div className="text-center mt-6 space-y-3">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              <button
                onClick={() => { setCode(["","","","","",""]); setCodeError(""); handleSendCode({ preventDefault: () => {} }); }}
                className="text-[#004aad] font-medium hover:underline"
              >
                Resend
              </button>
            </p>
            <button
              onClick={() => { setStep(1); setCode(["","","","","",""]); setCodeError(""); setPasswordError(""); setConfirmError(""); }}
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

        <form onSubmit={handleSendCode} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailTouched) setEmailError(validateEmail(e.target.value));
              }}
              onBlur={() => { setEmailTouched(true); setEmailError(validateEmail(email)); }}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                emailTouched && emailError
                  ? "border-red-500 bg-red-50 focus:border-red-500"
                  : "border-gray-300 focus:border-[#004aad] focus:ring-2 focus:ring-blue-100"
              }`}
              placeholder="Enter your email address"
              autoComplete="email"
            />
            {emailTouched && emailError && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <XCircle size={13} className="shrink-0" />{emailError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004aad] text-white py-3 px-4 rounded-lg hover:bg-[#003a8c] transition font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Sending Code...</>
            ) : "Send Reset Code"}
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