import React, { useState, useCallback } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { notify } from "../../utils/toast";

// ─── Password rules ────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: "minLength", label: "At least 8 characters",                       test: (p) => p.length >= 8 },
  { id: "uppercase", label: "At least one uppercase letter (A–Z)",         test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "At least one lowercase letter (a–z)",         test: (p) => /[a-z]/.test(p) },
  { id: "number",    label: "At least one number (0–9)",                   test: (p) => /[0-9]/.test(p) },
  { id: "special",   label: "At least one special character (# @ ! $ …)",  test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword]       = useState(false);
  const [rememberMe, setRememberMe]           = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginData, setLoginData]             = useState({ email: "", password: "" });

  // Per-field inline error messages
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  // Track touched fields so we don't show errors before the user has typed
  const [touched, setTouched] = useState({ email: false, password: false });

  // Live password rule results
  const passwordRuleResults = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(loginData.password),
  }));
  const allRulesPassed = passwordRuleResults.every((r) => r.passed);

  // ─── Validate a single field, return error string ─────────────────────────
  const validateField = useCallback((name, value) => {
    if (name === "email") {
      if (!value.trim())                        return "Email address is required.";
      if (!EMAIL_REGEX.test(value.trim()))      return "Please enter a valid email address.";
      return "";
    }
    if (name === "password") {
      if (!value)                               return "Password is required.";
      if (value.length < 8)                     return "Password must be at least 8 characters.";
      if (!/[A-Z]/.test(value))                 return "Password needs at least one uppercase letter (A–Z).";
      if (!/[a-z]/.test(value))                 return "Password needs at least one lowercase letter (a–z).";
      if (!/[0-9]/.test(value))                 return "Password needs at least one number (0–9).";
      if (!/[^A-Za-z0-9]/.test(value))          return "Password needs at least one special character (e.g. #, @, !).";
      return "";
    }
    return "";
  }, []);

  // ─── Handle input change + live validation ────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  // ─── On blur → mark touched + validate ───────────────────────────────────
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();

    // Force-touch both fields so errors show
    setTouched({ email: true, password: true });

    const emailErr    = validateField("email",    loginData.email);
    const passwordErr = validateField("password", loginData.password);
    setFieldErrors({ email: emailErr, password: passwordErr });

    if (emailErr) {
      notify.error(emailErr);
      return;
    }
    if (passwordErr) {
      notify.error(passwordErr);
      return;
    }

    setLoading(true);

    try {
      const credentials = {
        email:    loginData.email.trim().toLowerCase(),
        password: loginData.password,
      };

      const res = await loginUser(credentials);

      if (!res) {
        notify.error("No response from server. Please try again later.");
        return;
      }

      const accessToken  = res.token || res.access_token || res.data?.token;
      const refreshToken = res.refresh_token             || res.data?.refresh_token;
      const user         = res.user                      || res.data?.user;

      if (!accessToken) {
        notify.error("Authentication failed: no access token received.");
        return;
      }
      if (!user) {
        notify.error("Authentication failed: user data missing from response.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("token", accessToken);
      } else {
        sessionStorage.setItem("token", accessToken);
      }
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      notify.success("Welcome back! Redirecting to your dashboard...");

      const role = user.role?.toLowerCase() || "student";
      setTimeout(() => {
        navigate(role === "admin" || role === "administrator" ? "/admin" : "/student");
      }, 1500);

    } catch (err) {
      console.error("Login error:", err);

      // ── No network response ──────────────────────────────────────────────
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
      const serverMessage = err.response?.data?.message
                          || err.response?.data?.error
                          || err.response?.data?.detail;

      switch (status) {

        case 400:
          // Generic bad request — show under whichever field the API mentions
          notify.error(serverMessage || "Invalid request. Please check your input.");
          break;

        case 401:
          // Wrong password
          setFieldErrors((prev) => ({
            ...prev,
            password: serverMessage || "Incorrect password. Please try again.",
          }));
          notify.error(serverMessage || "Incorrect email or password. Please try again.");
          break;

        case 403:
          notify.error(serverMessage || "Your account does not have permission to log in.");
          break;

        case 404:
          // Email not registered
          setFieldErrors((prev) => ({
            ...prev,
            email: serverMessage || "No account found with this email address.",
          }));
          notify.error(serverMessage || "No account found. Please check your email or register.");
          break;

        case 409:
          // Email already taken
          setFieldErrors((prev) => ({
            ...prev,
            email: serverMessage || "This email is already associated with another account.",
          }));
          notify.error(serverMessage || "Email already in use. Please log in or use a different email.");
          break;

        case 422:
          if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
            err.response.data.errors.forEach((fieldErr) => {
              const msg   = fieldErr.message || fieldErr.msg || JSON.stringify(fieldErr);
              const field = fieldErr.field   || fieldErr.path;
              if (field === "email" || field === "password") {
                setFieldErrors((prev) => ({ ...prev, [field]: msg }));
              }
              notify.error(msg);
            });
          } else {
            notify.error(serverMessage || "Validation failed. Please check your details.");
          }
          break;

        case 429:
          notify.error("Too many login attempts. Please wait a moment and try again.");
          break;

        case 500:
          notify.error("Server error. Please try again later or contact support.");
          break;

        case 502:
        case 503:
        case 504:
          notify.error("The server is currently unavailable. Please try again shortly.");
          break;

        default:
          notify.error(
            serverMessage || err.message || "Login failed. Please check your credentials and try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Dynamic input class based on error state ─────────────────────────────
  const inputClass = (field) =>
    `w-full p-4 border rounded-md text-sm outline-none transition ${
      touched[field] && fieldErrors[field]
        ? "border-red-500 focus:border-red-500 bg-red-50"
        : "border-gray-300 focus:border-[#004aad]"
    }`;

  // Show password checklist while focused OR if there are still failing rules after blur
  const showChecklist =
    passwordFocused ||
    (touched.password && loginData.password.length > 0 && !allRulesPassed);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg p-8">

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
              alt="Halimatu Academy Logo"
              className="w-24 h-auto"
            />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" noValidate>

          {/* ── Email ──────────────────────────────────────────────────────── */}
          <div>
            <label className="block text-sm text-black font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              className={inputClass("email")}
              value={loginData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            {touched.email && fieldErrors.email && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <XCircle size={13} className="shrink-0" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* ── Password ───────────────────────────────────────────────────── */}
          <div>
            <label className="block text-sm text-black font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className={inputClass("password")}
                value={loginData.password}
                onChange={handleChange}
                onBlur={(e) => { setPasswordFocused(false); handleBlur(e); }}
                onFocus={() => setPasswordFocused(true)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Inline error under password (e.g. from 401) */}
            {touched.password && fieldErrors.password && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <XCircle size={13} className="shrink-0" />
                {fieldErrors.password}
              </p>
            )}

            {/* ── Live password checklist ──────────────────────────────────── */}
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

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="group-hover:text-gray-800 transition-colors">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-[#004aad] hover:text-[#003a8c] hover:underline transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004aad] text-white py-3 rounded-md font-medium hover:bg-[#003a8c] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#004aad] font-semibold hover:underline transition-colors"
            >
              Register here
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}