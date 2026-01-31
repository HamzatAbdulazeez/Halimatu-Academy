import React, { useState } from 'react';
import { FaCheckCircle, FaCrown, FaCalendarAlt, FaCreditCard, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SubscriptionPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const user = {
    subscribed: true,
    plan: 'basic-6m', // 'basic-6m' | 'basic-12m' | null
    nextBilling: 'February 28, 2026',
    paymentMethod: '**** **** **** 4242 (Visa)',
  };

  const plans = [
    {
      id: 'basic-6m',
      name: 'Basic Plan',
      period: '6 Months',
      price: 25000,
      displayPrice: '₦25,000',
      features: [
        'Qur\'an Reading Basics',
        'Arabic Foundation',
        'Access to core materials',
        'Community support',
      ],
      popular: false,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'basic-12m',
      name: 'Full Year Plan',
      period: '12 Months',
      price: 50000,
      displayPrice: '₦50,000',
      features: [
        'All Basic Plan features',
        'Better value (equivalent to two 6-month periods)',
        'Lifetime resource access',
        'Certificate upon completion',
        'Priority support',
      ],
      popular: true,
      color: 'from-green-600 to-emerald-600',
    },
  ];

  const handlePaymentRedirect = async (selectedPlan) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const payload = {
        email: 'user@example.com', // ← get from real user context
        amount: selectedPlan.price * 100, // kobo
        reference: `hsa-upgrade-${Date.now()}`,
        metadata: {
          user_id: 'user-id-here', // real user id
          current_plan: user.plan,
          new_plan: selectedPlan.id,
          upgrade: user.subscribed ? true : false,
        },
        callback_url: `${window.location.origin}/subscription/success?ref=${encodeURIComponent('upgrade-' + Date.now())}`,
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
        throw new Error(result.message || 'Failed to start upgrade');
      }

      // Redirect to Paystack hosted page
      window.location.href = result.data.authorization_url;
    } catch (err) {
      console.error('Upgrade error:', err);
      alert('Could not start upgrade: ' + (err.message || 'Please try again'));
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white px-6 py-4 mb-6">
        <h1 className="text-2xl font-medium mb-3"> Subscription & Billing</h1>
        <p className="text-gray-500">
          <Link to="/student" className="text-[#004aad] hover:underline">
            Dashboard
          </Link>{" "}
          &gt;  Subscription & Billing
        </p>
      </div>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className=" mx-auto">
          {/* Header */}
          <div className="mb-6">
           
            <p className="text-lg text-black">
              Manage your Halimatu Academy access and unlock more Islamic knowledge
            </p>
          </div>

          {/* Current Subscription Status */}
          <div className="bg-white rounded-md shadow-md p-6 md:p-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">
                  Current Plan: {user.subscribed ? 'Active Subscription' : 'Not Subscribed'}
                </h2>
                {user.subscribed && (
                  <>
                    <p className="text-black mb-1">
                      <span className="font-medium">Plan:</span> {user.plan === 'basic-12m' ? 'Full Year' : 'Basic 6 Months'}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaCalendarAlt className="text-[#004aad]" />
                      Next billing: {user.nextBilling}
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user.subscribed ? (
                  <button
                    onClick={() => handlePaymentRedirect(plans.find(p => p.id === 'basic-12m'))}
                    disabled={user.plan === 'basic-12m' || isProcessing}
                    className={`px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-md ${user.plan === 'basic-12m'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#004aad] hover:bg-[#003a8c] text-white'
                      }`}
                  >
                    <FaCrown size={18} />
                    {isProcessing ? 'Redirecting...' : 'Upgrade to Full Year'}
                  </button>
                ) : (
                  <button
                    onClick={() => handlePaymentRedirect(plans[0])}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-[#004aad] hover:bg-[#003a8c] text-white rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-md"
                  >
                    Subscribe Now
                  </button>
                )}

                <button className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2">
                  <FaHistory size={18} />
                  Billing History
                </button>
              </div>
            </div>

            {user.subscribed && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-black">
                  <FaCreditCard className="text-[#004aad]" />
                  <span>Payment Method: {user.paymentMethod}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Update payment method or cancel subscription in settings
                </p>
              </div>
            )}
          </div>

          {/* Plans Comparison */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Choose Your Learning Path
              </h2>
              <p className="text-gray-600">
                Unlock full access to Qur'an Reading & Arabic courses
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border ${plan.popular ? 'border-[#004aad] shadow-xl' : 'border-gray-200'
                    } overflow-hidden bg-white transition-all hover:shadow-2xl`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-[#004aad] text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                      Popular Choice
                    </div>
                  )}

                  <div className={`bg-gradient-to-r ${plan.color} p-8 text-white`}>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-3xl font-extrabold">
                      {plan.displayPrice}
                      <span className="text-xl font-normal opacity-90">/{plan.period.toLowerCase()}</span>
                    </p>
                  </div>

                  <div className="p-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-[#004aad] mt-1 shrink-0" size={20} />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePaymentRedirect(plan)}
                      disabled={user.plan === plan.id || isProcessing}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition ${user.plan === plan.id
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : plan.popular
                          ? 'bg-[#004aad] text-white hover:bg-[#003a8c] shadow-lg'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                      {isProcessing
                        ? 'Redirecting...'
                        : user.plan === plan.id
                          ? 'Current Plan'
                          : user.subscribed
                            ? 'Upgrade Now'
                            : 'Subscribe Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-gray-500 text-sm mt-10">
            All plans include secure payments via Paystack. Cancel anytime. Questions? Contact support@halimatuacademy.com
          </p>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;