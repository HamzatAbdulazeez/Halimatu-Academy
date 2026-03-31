import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";  
import { handleApiError } from "../../api/handleApiError";
import Alert from "../../components/Alert";

const HSARegistration = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    city: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({ 
    show: false, 
    message: "", 
    type: "info",
    title: "" 
  });

  const showAlert = (message, type = "error", title = "") => {
    setAlert({ show: true, message, type, title });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    closeAlert();

    // Client-side validation
    if (!formData.firstName || !formData.lastName || !formData.email ||
        !formData.dateOfBirth || !formData.country || !formData.city || !formData.password) {
      showAlert("Please fill all required fields", "error", "Validation Error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match", "error", "Password Error");
      return;
    }

    if (formData.password.length < 8) {
      showAlert("Password must be at least 8 characters long", "error", "Password Error");
      return;
    }

    if (!agree) {
      showAlert("You must agree to the terms and conditions", "error", "Agreement Required");
      return;
    }

    setLoading(true);

    const registerPayload = {
      firstName: formData.firstName.trim(),
      middleName: formData.middleName.trim() || null,
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || null,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender || null,
      country: formData.country,
      city: formData.city.trim(),
      password: formData.password,
    };

    try {
      console.log("📤 Sending registration data:", registerPayload);

      const res = await registerUser(registerPayload);

      if (res.token) localStorage.setItem("token", res.token);
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

      showAlert("Account created successfully! Redirecting...", "success", "Registration Successful");
      setRegistered(true);

    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (registered) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl p-10 text-center">
          <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Created Successfully!</h1>
          <p className="text-base text-gray-700 mb-8">
            Assalamu Alaikum, {formData.firstName} {formData.middleName ? formData.middleName + ' ' : ''}{formData.lastName}
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
            <p className="text-lg text-emerald-800">
              Your account has been created.<br />An OTP has been sent to your email.
            </p>
          </div>
          <p className="text-gray-600 mb-6">Please check <strong>{formData.email}</strong></p>

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

  // Main Registration Form
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12 relative">
      
      {/* Alert Component */}
      <Alert 
        alert={alert} 
        onClose={closeAlert}
        position="top-center"
      />

      <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#004aad] text-white px-8 py-10 text-center">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
              alt="Halimatu Academy Logo"
              className="w-20 h-auto mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="mt-2 text-blue-100">Join Halimatu Academy – free registration</p>
        </div>

        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Abdul"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Muhammad"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. abdul@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +234 803 123 4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
                />
              </div>
            </div>

            {/* DOB, Age, Gender, Country, City */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed">
                  {formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : 'Calculated automatically'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white text-gray-500"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country <span className="text-red-500">*</span></label>
                <select
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white text-gray-500"
                  required
                >
                  <option value="" disabled>Select your country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Lagos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none pr-11 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-type your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none pr-11 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="mt-1.5 w-5 h-5 accent-[#004aad]"
              />
              <label htmlFor="agree" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                I agree to Halimatu Academy's{' '}
                <Link to="/terms" className="text-[#004aad] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#004aad] hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004aad] text-white py-4 rounded-lg font-medium text-lg hover:bg-[#003a8c] transition mt-6 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#004aad] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HSARegistration;