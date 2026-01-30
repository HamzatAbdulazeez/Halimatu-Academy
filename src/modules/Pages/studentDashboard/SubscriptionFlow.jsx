import React, { useState } from 'react';
import { 
  FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle, 
  FaCreditCard, FaShieldAlt, FaArrowRight, FaStar
} from 'react-icons/fa';

const RegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});

  const nextStep = (data) => {
    setUserData({ ...userData, ...data });
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <>
      {step === 1 && <RegistrationForm onNext={nextStep} />}
      {step === 2 && <SubscriptionPlans onNext={nextStep} onBack={prevStep} userData={userData} />}
      {step === 3 && <PaymentPage onComplete={() => setStep(4)} onBack={prevStep} userData={userData} />}
      {step === 4 && <SuccessPage userData={userData} />}
    </>
  );
};

// Step 1: Registration
const RegistrationForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms) {
      alert('Please agree to terms');
      return;
    }
    onNext(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Join Digifted Hub</h1>
          <p className="text-gray-600">Create your account to access premium courses</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Personal Information</span>
              <span className="text-sm text-gray-500">Step 1 of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#053276] h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" placeholder="john@example.com" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" placeholder="+234 XXX XXX XXXX" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1" />
              <label className="text-sm text-gray-700">I agree to Terms and Conditions</label>
            </div>

            <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-[#053276] to-indigo-700 text-white py-4 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2">
              Continue to Plans <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Plans
const SubscriptionPlans = ({ onNext, onBack, userData }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { id: 'basic', name: 'Basic Plan', price: '₦15,000', period: '/month', features: ['5 courses', 'Email support', 'Certificate'], color: 'from-blue-500 to-blue-600' },
    { id: 'pro', name: 'Professional', price: '₦35,000', period: '/month', popular: true, features: ['ALL courses', 'Live sessions', 'Priority support', '1-on-1 mentorship'], color: 'from-[#053276] to-indigo-700' },
    { id: 'premium', name: 'Premium', price: '₦75,000', period: '/month', features: ['Everything in Pro', 'Private coaching', 'Custom learning path', 'Job placement'], color: 'from-purple-500 to-purple-700' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Choose Your Plan</h1>
          <p className="text-gray-600">Select the perfect plan for your learning journey</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-800">Select Subscription Plan</span>
            <span className="text-sm text-gray-500">Step 2 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#053276] h-2 rounded-full" style={{ width: '66%' }}></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <div key={plan.id} onClick={() => setSelectedPlan(plan)}
              className={`bg-white rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 ${selectedPlan?.id === plan.id ? 'ring-4 ring-[#053276]' : ''} relative`}>
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <FaStar /> POPULAR
                </div>
              )}
              <div className={`bg-gradient-to-r ${plan.color} p-6 text-white rounded-t-xl`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm ml-2">{plan.period}</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold ${selectedPlan?.id === plan.id ? 'bg-[#053276] text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button onClick={onBack} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300">Back</button>
          <button onClick={() => selectedPlan && onNext({ ...userData, selectedPlan })} disabled={!selectedPlan}
            className={`flex-1 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${selectedPlan ? 'bg-gradient-to-r from-[#053276] to-indigo-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
            Continue to Payment <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Payment
const PaymentPage = ({ onComplete, onBack, userData }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); onComplete(); }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Secure payment to activate your subscription</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-800">Payment Information</span>
            <span className="text-sm text-gray-500">Step 3 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#053276] h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                <input type="text" placeholder="JOHN DOE"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry</label>
                  <input type="text" placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                  <input type="text" placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#053276]" />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <FaShieldAlt className="text-blue-600 mt-1" />
                <p className="text-sm text-gray-700">Your payment is secure and encrypted</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={onBack} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold">Back</button>
                <button onClick={handlePayment} disabled={isProcessing}
                  className={`flex-1 py-4 rounded-lg font-semibold text-white ${isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
                  {isProcessing ? 'Processing...' : `Pay ${userData.selectedPlan?.price}`}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-bold text-gray-800">{userData.selectedPlan?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-semibold">{userData.firstName} {userData.lastName}</p>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{userData.selectedPlan?.price}</span>
                </div>
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-[#053276]">{userData.selectedPlan?.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Success
const SuccessPage = ({ userData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-white text-5xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-600 mb-8">Welcome to Digifted Hub, {userData.firstName}!</p>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Your Subscription</h3>
          <p className="text-lg font-semibold text-[#053276]">{userData.selectedPlan?.name}</p>
          <p className="text-sm text-gray-600 mt-2">Billing: {userData.selectedPlan?.price}{userData.selectedPlan?.period}</p>
        </div>
        <div className="space-y-3">
          <p className="text-gray-700">✓ Account activated successfully</p>
          <p className="text-gray-700">✓ Welcome email sent to {userData.email}</p>
          <p className="text-gray-700">✓ Full access to all course materials</p>
        </div>
        <a href="/student/dashboard"
          className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-[#053276] to-indigo-700 text-white rounded-lg font-semibold hover:opacity-90">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default RegistrationFlow;