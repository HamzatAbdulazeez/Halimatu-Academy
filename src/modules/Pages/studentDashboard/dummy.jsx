import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Link } from "react-router-dom";

const HSARegistrationFlow = () => {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({});
    const [selectedPlan, setSelectedPlan] = useState(null);

    return (
        <>
            {step === 1 && (
                <RegistrationForm
                    onNext={(data) => {
                        setUserData(data);
                        setStep(2);
                    }}
                />
            )}

            {step === 2 && (
                <SubscriptionPlans
                    userData={userData}
                    selectedPlan={selectedPlan}
                    setSelectedPlan={setSelectedPlan}
                    onSuccess={() => setStep(3)}
                    onBack={() => setStep(1)}
                />
            )}

            {step === 3 && <SuccessPage userData={userData} selectedPlan={selectedPlan} />}
        </>
    );
};

const RegistrationForm = ({ onNext }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agree, setAgree] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        country: '',
        gender: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.country || !formData.password) {
            alert('Please fill all required fields');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (!agree) {
            alert('Please accept terms and conditions');
            return;
        }
        onNext(formData);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl bg-white p-8 md:p-12 rounded-md">
                <div className="flex items-center justify-center min-h-20 w-full mb-6">
                    <Link to="/">
                        <img
                            src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
                            alt="Halimatu Academy Logo"
                            draggable="false"
                            className="w-24 h-auto"
                        />
                    </Link>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Personal Information</span>
                        <span className="text-sm text-gray-500">Step 1 of 2</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-[#004aad] h-3 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-black">Create Your Account</h2>
                    <p className="text-gray-600 mt-2">Begin your journey of Islamic knowledge with HALĪMATU SA'DIYYAH ISlamic Academy</p>
                </div>

                <form className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-black font-medium mb-4">First Name *</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none"
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-black font-medium mb-4">Last Name *</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none"
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-black font-medium mb-4">Email Address *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none"
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-black font-medium mb-4">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none"
                                placeholder="+234 000 000 0000"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-black font-medium mb-4">Country *</label>
                            <select
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                required
                                className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none bg-white">
                                <option value="">Select your country</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="USA">United States</option>
                                <option value="UK">United Kingdom</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-black font-medium mb-4">Date of Birth</label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                required
                                className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-black font-medium mb-4">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                required
                                className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none bg-white">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-black font-medium mb-4">Password *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none"
                                    placeholder="Create a strong password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters with letters and numbers</p>
                        </div>

                        <div>
                            <label className="block text-sm text-black font-medium mb-4">Confirm Password *</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full p-4 border border-gray-300 rounded-md text-sm outline-none"
                                    placeholder="Re-enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gray-200 p-4 rounded-xl">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-[#004aad]"
                            required
                        />
                        <p className="text-sm text-gray-700">
                            I agree to HALĪMATU SA'DIYYAH ISlamic Academy's{' '}
                            <a href="/terms" className="text-[#004aad] font-semibold underline" required>Terms of Service</a>
                            {' '}and{' '}
                            <a href="/privacy" className="text-[#004aad] font-semibold underline" required> Privacy Policy</a>
                        </p>
                    </div>
                </form>

                <button
                    onClick={handleSubmit}
                    type='submit'
                    className="w-full bg-[#004aad] text-white py-4 mt-6 cursor-pointer rounded-md transition-all duration-300 text-base"
                >
                    Continue to Subscription Plans →
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#004aad] font-semibold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

const SubscriptionPlans = ({ userData, selectedPlan, setSelectedPlan, onBack }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const plans = [
        {
            id: 'basic-6m',
            name: 'Basic Plan - 6 Months',
            price: 25000,
            displayPrice: '₦25,000',
            period: '/6 months',
            color: 'from-blue-600 to-indigo-600',
            popular: false,
            features: [
                'Qur\'an Reading Basics',
                'Arabic Foundation',
                'Access to core materials',
            ]
        },
        {
            id: 'basic-12m',
            name: 'Basic Plan - Full Year (Discounted)',
            price: 50000,
            displayPrice: '₦50,000',
            period: '/year',
            color: 'from-green-600 to-emerald-600',
            popular: true,
            features: [
                'All 6-month features',
                '50% savings vs monthly',
                'Full access to Qur\'an + Arabic',
                'Lifetime resource access',
                'Certificate',
            ]
        },
    ];

    const handlePayWithPaystack = async () => {
        if (!selectedPlan) {
            alert('Please select a plan first');
            return;
        }

        setIsProcessing(true);

        try {
            const payload = {
                email: userData.email.trim(),
                amount: selectedPlan.price * 100,
                reference: `hsa-reg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                metadata: {
                    first_name: userData.firstName || '',
                    last_name: userData.lastName || '',
                    phone: userData.phone || '',
                    plan_name: selectedPlan.name,
                    plan_id: selectedPlan.id,
                },
                callback_url: `${window.location.origin}/payment/success?plan=${selectedPlan.id}`,

            };

            const res = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY || 'sk_test_d9c5c69d0b2b7644f7fb5342487845bd2022d8a7'}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!result.status || !result.data?.authorization_url) {
                throw new Error(result.message || 'Could not initialize payment');
            }

            // Redirect to Paystack hosted checkout page
            window.location.href = result.data.authorization_url;
        } catch (err) {
            console.error('Payment init error:', err);
            alert('Failed to start payment: ' + (err.message || 'Please try again'));
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Choose Your Learning Plan</h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Get started with Qur'an Reading & Arabic – more courses coming soon!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`bg-white rounded-md cursor-pointer transition-all border-2 border-[#004aad] ${selectedPlan?.id === plan.id ? 'outline-none' : 'border-transparent'} relative overflow-hidden`}
                        >
                            {plan.popular && (
                                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 z-10">
                                    ★ Popular Choice
                                </div>
                            )}

                            <div className={`bg-linear-to-r ${plan.color} p-8 text-white`}>
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-extrabold">{plan.displayPrice}</span>
                                    <span className="text-xl ml-2 opacity-90">{plan.period}</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700">
                                            <CheckCircle className="text-[#004aad] mt-1 shrink-0" size={20} />
                                            <span className='text-black'>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-4 rounded-md cursor-pointer transition-all ${selectedPlan?.id === plan.id
                                        ? 'bg-[#004aad] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {selectedPlan?.id === plan.id ? 'Selected' : 'Select This Plan'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                    <button
                        onClick={onBack}
                        disabled={isProcessing}
                        className="px-10 py-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                        ← Back
                    </button>

                    <button
                        disabled={!selectedPlan || isProcessing}
                        onClick={handlePayWithPaystack}
                        className={`px-10 py-4 rounded-xl font-bold text-lg transition-all min-w-55 ${selectedPlan && !isProcessing
                            ? 'bg-linear-to-r from-[#004aad] to-teal-600 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isProcessing ? 'Redirecting...' : 'Pay with Paystack →'}
                    </button>
                </div>

                {isProcessing && (
                    <p className="text-center text-gray-600 mt-6 animate-pulse">
                        Redirecting to Paystack secure checkout...
                    </p>
                )}
            </div>
        </div>
    );
};

const SuccessPage = ({ userData, selectedPlan }) => (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-10 md:p-16 text-center">
            <div className="w-24 h-24 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle className="w-14 h-14 text-white" />
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-[#004aad] to-teal-600 bg-clip-text text-transparent">
                Welcome to HALĪMATU SA'DIYYAH ISlamic Academy!
            </h1>

            <p className="text-2xl text-gray-700 mb-10">
                Assalamu Alaikum, {userData.firstName || 'Student'} {userData.lastName || ''}!
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-10">
                <h3 className="text-2xl font-bold mb-6">Your Subscription</h3>
                <p className="text-xl font-semibold text-emerald-700">{selectedPlan?.name || 'Plan activated'}</p>
                <p className="text-lg mt-2">Payment completed successfully</p>
            </div>

            <div className="space-y-4 mb-12 text-left max-w-lg mx-auto">
                <div className="flex items-start gap-4">
                    <CheckCircle className="text-emerald-600 mt-1" size={24} />
                    <p className="text-gray-700">Full access granted to your chosen plan</p>
                </div>
                <div className="flex items-start gap-4">
                    <CheckCircle className="text-emerald-600 mt-1" size={24} />
                    <p className="text-gray-700">Confirmation & login details sent to {userData.email || 'your email'}</p>
                </div>
                <div className="flex items-start gap-4">
                    <CheckCircle className="text-emerald-600 mt-1" size={24} />
                    <p className="text-gray-700">Start learning right away In sha Allah</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                    to="/student/dashboard"
                    className="px-10 py-5 bg-linear-to-r from-[#004aad] to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition"
                >
                    Go to Dashboard →
                </Link>
                <Link
                    to="/courses"
                    className="px-10 py-5 border-2 border-[#004aad] text-[#004aad] rounded-xl font-bold text-lg hover:bg-emerald-50 transition"
                >
                    Browse Courses
                </Link>
            </div>

            <p className="mt-12 text-gray-600">
                May Allah make it easy and bless your path of knowledge 🤲
            </p>
        </div>
    </div>
);

export default HSARegistrationFlow;