import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  // Redirect if no email passed
  useEffect(() => {
    if (!email) {
      toast.error("No email found. Please register again.");
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with your actual verify OTP API call
      // const response = await verifyOtp(email, otpCode);

      console.log("Verifying OTP:", { email, otp: otpCode });

      // Simulate success for now (replace with real API call)
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success("Account verified successfully!");
      navigate('/student'); // or wherever your dashboard is

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setResendLoading(true);

    try {
      // TODO: Add your resend OTP API call here
      console.log("Resending OTP to:", email);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("New OTP sent to your email");
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#004aad] text-white px-8 py-10 text-center">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
              alt="Halimatu Academy Logo"
              className="w-20 h-auto mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold">Verify Your Account</h1>
          <p className="mt-2 text-blue-100">Enter the OTP sent to your email</p>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600">
              We sent a 6-digit code to<br />
              <strong>{email}</strong>
            </p>
          </div>

          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-xl focus:border-[#004aad] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-[#004aad] hover:bg-[#003a8c] text-white py-4 rounded-xl font-medium text-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center mt-6">
            <button
              onClick={handleResendOtp}
              disabled={countdown > 0 || resendLoading}
              className="text-[#004aad] hover:underline text-sm disabled:text-gray-400 disabled:no-underline"
            >
              {resendLoading ? "Sending..." : 
                countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </button>
          </div>

          {/* Back to Register */}
          <div className="text-center mt-8">
            <Link
              to="/register"
              className="text-gray-600 hover:text-[#004aad] text-sm"
            >
              ← Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;