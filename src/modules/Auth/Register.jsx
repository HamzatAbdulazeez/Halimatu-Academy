import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, CheckCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { notify } from "../../utils/toast";

// ─── Password rules ────────────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: "minLength", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "uppercase", label: "At least one uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "At least one lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { id: "number", label: "At least one number (0–9)", test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "At least one special character (# @ ! $ …)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;


// ─── Helper: calculate age from DOB string ─────────────────────────────────────
const calculateAge = (dob) => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const INITIAL_FORM = {
  firstName: '', middleName: '', lastName: '',
  email: '', phone: '',
  dateOfBirth: '', gender: '',
  country: '', city: '',
  password: '', confirmPassword: '',
};

const INITIAL_ERRORS = {
  firstName: '', lastName: '', email: '', phone: '',
  dateOfBirth: '', country: '', city: '',
  password: '', confirmPassword: '',
};

export default function HSARegistration() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Per-field inline errors
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);
  // Track which fields have been touched
  const [touched, setTouched] = useState({});

  // ─── Live password checklist ───────────────────────────────────────────────
  const passwordRuleResults = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(formData.password),
  }));
  const allPasswordRulesPassed = passwordRuleResults.every((r) => r.passed);
  const showChecklist =
    passwordFocused ||
    (touched.password && formData.password.length > 0 && !allPasswordRulesPassed);

  // ─── Validate a single field ───────────────────────────────────────────────
  const validateField = useCallback((name, value) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required.";
        if (value.trim().length < 2) return "First name must be at least 2 characters.";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required.";
        if (value.trim().length < 2) return "Last name must be at least 2 characters.";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required.";
        if (!EMAIL_REGEX.test(value.trim())) return "Please enter a valid email address.";
        return "";
      case "phone": {
        if (!value) return "";
        const cleaned = value.replace(/[\s\-().]/g, '');
        // Accept: 08XXXXXXXXX, +234XXXXXXXXX, 234XXXXXXXXX
        const localNG = /^0[7-9][01]\d{8}$/;
        const intl = /^\+?[1-9]\d{6,14}$/;
        if (!localNG.test(cleaned) && !intl.test(cleaned))
          return "Enter a valid number, e.g. 08155302760 or +2348155302760";
        return "";
      }
      case "dateOfBirth": {
        if (!value) return "Date of birth is required.";
        const age = calculateAge(value);
        if (age < 5) return "You must be at least 5 years old to register.";
        if (age > 120) return "Please enter a valid date of birth.";
        return "";
      }
      case "country":
        if (!value) return "Please select your country.";
        return "";
      case "city":
        if (!value.trim()) return "City is required.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(value)) return "Password needs at least one uppercase letter (A–Z).";
        if (!/[a-z]/.test(value)) return "Password needs at least one lowercase letter (a–z).";
        if (!/[0-9]/.test(value)) return "Password needs at least one number (0–9).";
        if (!/[^A-Za-z0-9]/.test(value)) return "Password needs at least one special character (e.g. #, @, !).";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password.";
        // We compare against the current formData, but also accept value passed directly
        return "";
      default:
        return "";
    }
  }, []);

  // ─── Handle input change ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      let err = validateField(name, value);
      // Special case: re-validate confirmPassword when password changes
      if (name === "password" && touched.confirmPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          password: err,
          confirmPassword:
            formData.confirmPassword && value !== formData.confirmPassword
              ? "Passwords do not match."
              : "",
        }));
        return;
      }
      if (name === "confirmPassword") {
        err = !value
          ? "Please confirm your password."
          : value !== formData.password
            ? "Passwords do not match."
            : "";
      }
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  // ─── On blur ───────────────────────────────────────────────────────────────
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let err = validateField(name, value);
    if (name === "confirmPassword") {
      err = !value
        ? "Please confirm your password."
        : value !== formData.password
          ? "Passwords do not match."
          : "";
    }
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  // ─── Validate ALL fields before submit ────────────────────────────────────
  const validateAll = () => {
    const errors = { ...INITIAL_ERRORS };
    const fields = ["firstName", "lastName", "email", "phone", "dateOfBirth", "country", "city", "password"];
    fields.forEach((f) => { errors[f] = validateField(f, formData[f]); });

    // confirmPassword
    errors.confirmPassword = !formData.confirmPassword
      ? "Please confirm your password."
      : formData.confirmPassword !== formData.password
        ? "Passwords do not match."
        : "";



    // Mark all as touched
    const allTouched = {};
    Object.keys(INITIAL_ERRORS).forEach((k) => { allTouched[k] = true; });
    setTouched(allTouched);
    setFieldErrors(errors);
    return errors;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateAll();
    const firstError = Object.values(errors).find((v) => v);

    if (firstError) {
      notify.error(firstError);
      return;
    }

    if (!agree) {
      notify.error("You must agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

   

    setLoading(true);

    const registerPayload = {
      firstName: formData.firstName.trim(),
      middleName: formData.middleName.trim() || null,
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: (() => {
        if (!formData.phone.trim()) return null;
        const cleaned = formData.phone.trim().replace(/[\s\-().]/g, '');
        if (/^0[7-9][01]\d{8}$/.test(cleaned)) return '+234' + cleaned.slice(1);
        return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
      })(),
      dateOfBirth: formData.dateOfBirth,
     gender: formData.gender || null,
      country: formData.country,
      city: formData.city.trim(),
      password: formData.password,
    };
    
    console.log("Sending payload:", JSON.stringify(registerPayload, null, 2));
    try {
      const res = await registerUser(registerPayload);

      if (res?.token) localStorage.setItem("token", res.token);
      if (res?.user) localStorage.setItem("user", JSON.stringify(res.user));

      notify.success("Account created successfully! Please check your email for the OTP.");
      setRegistered(true);

    } catch (err) {
      console.error("Registration error:", err);
    
      if (!err.response) {
        if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
          // Server likely registered but timed out on email — treat as success
          notify.success("Account created! Please check your email for OTP.");
          setRegistered(true);
          return;
        }
        if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
          notify.error("Network error. Please check your internet connection.");
        } else {
          notify.error("Unable to reach the server. Please try again later.");
        }
        return;
      }
    
      const status = err.response?.status;
    
      const serverMessage = err.response?.data?.message
        || err.response?.data?.error
        || err.response?.data?.detail;
    
      switch (status) {
        case 400:
          notify.error(serverMessage || "Invalid registration data. Please review your details.");
          break;
    
        case 409: {
          // Only show conflict error if server explicitly said 409
          // Check if it's email or phone conflict
          const isPhoneConflict = serverMessage?.toLowerCase().includes("phone");
          const isEmailConflict = serverMessage?.toLowerCase().includes("email") || !isPhoneConflict;
    
          if (isPhoneConflict) {
            setFieldErrors((prev) => ({
              ...prev,
              phone: "This phone number is already registered.",
            }));
            notify.error("This phone number is already linked to an account. Please use a different one.");
          } else if (isEmailConflict) {
            setFieldErrors((prev) => ({
              ...prev,
              email: "This email is already registered. Please log in instead.",
            }));
            notify.error("An account with this email already exists. Please log in.");
          } else {
            notify.error(serverMessage || "Account already exists. Please log in.");
          }
          break;
        }
    
        case 422:
          if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
            err.response.data.errors.forEach((fieldErr) => {
              const msg = fieldErr.message || fieldErr.msg || JSON.stringify(fieldErr);
              const field = fieldErr.field || fieldErr.path;
              if (field && Object.prototype.hasOwnProperty.call(INITIAL_ERRORS, field)) {
                setFieldErrors((prev) => ({ ...prev, [field]: msg }));
              }
              notify.error(msg);
            });
          } else {
            notify.error(serverMessage || "Validation failed. Please review your details.");
          }
          break;
    
        case 429:
          notify.error("Too many registration attempts. Please wait a moment and try again.");
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
          notify.error(serverMessage || err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Input class helper ────────────────────────────────────────────────────
  const inputClass = (field, extra = "") =>
    `w-full px-4 py-3 border rounded-lg outline-none placeholder-gray-400 transition ${extra} ${touched[field] && fieldErrors[field]
      ? "border-red-500 focus:border-red-500 bg-red-50"
      : "border-gray-300 focus:border-[#004aad]"
    }`;

  // ─── Field error hint ──────────────────────────────────────────────────────
  const FieldError = ({ field }) =>
    touched[field] && fieldErrors[field] ? (
      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
        <XCircle size={13} className="shrink-0" />
        {fieldErrors[field]}
      </p>
    ) : null;

  // ─── Success screen ────────────────────────────────────────────────────────
  if (registered) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl p-10 text-center">
          <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Created Successfully!</h1>
          <p className="text-base text-gray-700 mb-8">
            Assalamu Alaikum,{" "}
            {formData.firstName}{formData.middleName ? ` ${formData.middleName}` : ""} {formData.lastName}
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
            <p className="text-lg text-emerald-800">
              Your account has been created.<br />An OTP has been sent to your email.
            </p>
          </div>
          <p className="text-gray-600 mb-6">
            Please check <strong>{formData.email}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/verify-otp"
              state={{ email: formData.email }}
              className="px-8 py-4 bg-[#004aad] text-white rounded-lg font-medium hover:bg-[#003a8c] transition"
            >
              Verify OTP Now
            </Link>
          </div>
          <p className="mt-10 text-gray-600">May Allah increase you in knowledge 🤲</p>
        </div>
      </div>
    );
  }

  // ─── Main registration form ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-md overflow-hidden">

        {/* Header */}
        <div className="bg-[#004aad] text-white px-8 py-10 text-center">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
              alt="Academy Logo"
              className="w-20 h-auto mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="mt-2 text-blue-100">Join Halimatu Academy – free registration</p>
        </div>

        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* ── Name ───────────────────────────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Abdul"
                  className={inputClass("firstName")}
                />
                <FieldError field="firstName" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Muhammad"
                  className={inputClass("lastName")}
                />
                <FieldError field="lastName" />
              </div>
            </div>

            {/* ── Contact ─────────────────────────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. abdul@example.com"
                  className={inputClass("email")}
                  autoComplete="email"
                />
                <FieldError field="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 text-xs font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. +2348031234567"
                  className={inputClass("phone")}
                />
                <FieldError field="phone" />
              </div>
            </div>

            {/* ── DOB, Age, Gender, Country, City ─────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("dateOfBirth")}
                />
                <FieldError field="dateOfBirth" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed select-none">
                  {formData.dateOfBirth ? `${calculateAge(formData.dateOfBirth)} years old` : "Calculated automatically"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white text-gray-600 focus:border-[#004aad] transition"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg outline-none bg-white transition ${touched.country && fieldErrors.country
                    ? "border-red-500 bg-red-50 text-gray-600"
                    : "border-gray-300 text-gray-600 focus:border-[#004aad]"
                    }`}
                >
                  <option value="" disabled>Select your country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
                <FieldError field="country" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Lagos"
                  className={inputClass("city")}
                />
                <FieldError field="city" />
              </div>
            </div>

            {/* ── Passwords ───────────────────────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={(e) => { setPasswordFocused(false); handleBlur(e); }}
                    onFocus={() => setPasswordFocused(true)}
                    placeholder="At least 8 characters"
                    className={inputClass("password", "pr-11")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FieldError field="password" />

                {/* Live password checklist */}
                {showChecklist && (
                  <ul className="mt-3 space-y-1.5 bg-gray-50 border border-gray-200 rounded-md p-3">
                    {passwordRuleResults.map((rule) => (
                      <li
                        key={rule.id}
                        className={`flex items-center gap-2 text-xs transition-colors ${rule.passed ? "text-green-600" : "text-gray-500"
                          }`}
                      >
                        {rule.passed
                          ? <CheckCircle2 size={13} className="shrink-0 text-green-500" />
                          : <XCircle size={13} className="shrink-0 text-gray-400" />
                        }
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Re-type your password"
                    className={inputClass("confirmPassword", "pr-11")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FieldError field="confirmPassword" />

                {/* Live match indicator */}
                {touched.confirmPassword && formData.confirmPassword && (
                  <p className={`mt-1.5 text-xs flex items-center gap-1 ${formData.confirmPassword === formData.password ? "text-green-600" : "text-red-600"
                    }`}>
                    {formData.confirmPassword === formData.password
                      ? <><CheckCircle2 size={13} className="shrink-0" /> Passwords match</>
                      : <><XCircle size={13} className="shrink-0" /> Passwords do not match</>
                    }
                  </p>
                )}
              </div>
            </div>

            {/* ── Terms ───────────────────────────────────────────────────────── */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1.5 w-5 h-5 accent-[#004aad]"
              />
              <label htmlFor="agree" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                I agree to Halimatu Academy's{" "}
                <Link to="/terms" className="text-[#004aad] hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-[#004aad] hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* ── Submit ──────────────────────────────────────────────────────── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004aad] text-white py-4 rounded-lg font-medium text-lg hover:bg-[#003a8c] transition mt-6 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
              ) : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-[#004aad] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}