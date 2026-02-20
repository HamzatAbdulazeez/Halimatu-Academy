import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Link } from "react-router-dom";

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
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email ||
        !formData.dateOfBirth || !formData.country || !formData.password) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agree) {
      setError('You must agree to the terms and conditions');
      return;
    }

    // Normally: send to backend here
    setRegistered(true);
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Account Created Successfully!
          </h1>

          <p className="text-xl text-gray-700 mb-8">
            Assalamu Alaikum, {formData.firstName} {formData.middleName ? formData.middleName + ' ' : ''}{formData.lastName}
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
            <p className="text-lg text-emerald-800">
              Your account is ready.
            </p>
          </div>

          <p className="text-gray-600 mb-6">
            Login details sent to <strong>{formData.email}</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/student"
              className="px-8 py-4 bg-[#004aad] text-white rounded-lg font-medium hover:bg-[#003a8c] transition"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border border-[#004aad] text-[#004aad] rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-10 text-gray-600">
            May Allah increase you in knowledge 🤲
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden">
        {/* Header with logo */}
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

        {/* Form */}
        <div className="p-8 md:p-12">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name fields */}
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  placeholder="e.g. Abdul"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={e => setFormData({...formData, middleName: e.target.value})}
                  placeholder="e.g. Ibrahim (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  placeholder="e.g. Muhammad"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
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
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="e.g. +234 803 123 4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
                />
              </div>
            </div>

            {/* DOB, Age, Gender, Country */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                  placeholder="YYYY-MM-DD"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder-gray-400"
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
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white text-gray-500"
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
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white text-gray-500"
                  required
                >
                  <option value="" disabled>Select your country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  {/* Add more as needed */}
                </select>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
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

            <button
              type="submit"
              className="w-full bg-[#004aad] text-white py-4 rounded-lg font-medium text-lg hover:bg-[#003a8c] transition mt-6"
            >
              Register
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