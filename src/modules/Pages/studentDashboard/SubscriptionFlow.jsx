import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FaCheckCircle, FaCalendarAlt, FaCreditCard, FaHistory,
  FaToggleOn, FaToggleOff, FaTimes, FaShieldAlt, FaStar,
  FaExclamationCircle, FaSync, FaArrowRight, FaLock,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  getUserPlans,
  getMyActiveSubscription,
  getMySubscriptionStatus,
  getMySubscriptions,
  initiateSubscription,
  verifyPayment,
  activateSubscription,
  cancelSubscriptionForUser,
  toggleAutoRenew,
} from '../../../api/authApi';
import { notify } from '../../../utils/toast';

const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-NG', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return '—';
  }
};

const formatPrice = (amount) => {
  if (amount == null) return '—';
  return `₦${Number(amount).toLocaleString()}`;
};

const extractFlwConfig = (res) => {
  if (!res) return null;
  if (res?.data?.tx_ref) return res.data;
  if (res?.tx_ref) return res;
  if (res?.data?.data?.tx_ref) return res.data.data;
  return null;
};

const mapPlan = (plan) => {
  if (!plan) return null;
  return {
    id: plan.id || plan._id || plan.plan_id || plan.uuid,
    name: plan.name || 'Plan',
    period: plan.duration_label || (plan.duration_months === 6 ? '6 Months' : '12 Months'),
    durationMonths: plan.duration_months,
    price: plan.amount ?? plan.price ?? 0,
    displayPrice: formatPrice(plan.amount ?? plan.price),
    features: Array.isArray(plan.features) ? plan.features : [],
    popular: !!(plan.is_popular || plan.popular),
  };
};

const mapSubscription = (raw) => {
  if (!raw) return null;
  const s = raw?.subscription ?? raw?.data?.subscription ?? raw?.data ?? raw;
  return typeof s === 'object' && s !== null ? s : null;
};

const SubscriptionPage = () => {
  /* UI States */
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isTogglingRenew, setIsTogglingRenew] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /* Data States */
  const [plans, setPlans] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [allSubscriptions, setAllSubscriptions] = useState([]);

  const [pageState, setPageState] = useState('loading'); // loading | error | ready

  const processingRef = useRef(false);

  /* Fetch All Data */
  const fetchData = useCallback(async () => {
    try {
      const [plansRes, activeRes, statusRes, allSubsRes] = await Promise.allSettled([
        getUserPlans(),
        getMyActiveSubscription(),
        getMySubscriptionStatus(),
        getMySubscriptions(),
      ]);

      if (plansRes.status === 'fulfilled') {
        const d = plansRes.value;
        const raw = d?.data?.plans ?? d?.plans ?? d?.data ?? d ?? [];
        setPlans(Array.isArray(raw) ? raw.map(mapPlan).filter(Boolean) : []);
      }

      if (activeRes.status === 'fulfilled') {
        setActiveSubscription(mapSubscription(activeRes.value));
      }

      if (statusRes.status === 'fulfilled') {
        const d = statusRes.value;
        setSubscriptionStatus(d?.data ?? d ?? null);
      }

      if (allSubsRes.status === 'fulfilled') {
        const d = allSubsRes.value;
        const hist = d?.data?.subscriptions ?? d?.subscriptions ?? d?.data ?? d ?? [];
        setAllSubscriptions(Array.isArray(hist) ? hist : []);
      }
    } catch (err) {
      console.error('[fetchData error]', err);
    }
  }, []);

  /* Initial Load */
  useEffect(() => {
    fetchData()
      .then(() => setPageState('ready'))
      .catch(() => setPageState('error'));
  }, [fetchData]);

  /* Payment Handler - Main Fix Area */
  const handlePaymentRedirect = useCallback(async (selectedPlan) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);

    try {
      const res = await initiateSubscription({ plan_id: selectedPlan.id });
      console.log('[initiateSubscription FULL RESPONSE]', JSON.stringify(res, null, 2));

      const paymentData = extractFlwConfig(res);

      if (!paymentData || !paymentData.tx_ref) {
        console.error('Backend returned no tx_ref. Full response:', res);
        notify.error('Payment could not be started. Backend did not return payment details. Please contact support.');
        return;
      }

      if (typeof window.FlutterwaveCheckout !== 'function') {
        notify.error('Payment system not ready. Please refresh the page.');
        return;
      }

      window.FlutterwaveCheckout({
        public_key: 'FLWPUBK_TEST-39ab6a4a6d75cab56a4e98abcbc5aeb4-X',
        tx_ref: paymentData.tx_ref,
        amount: paymentData.amount,
        currency: paymentData.currency || 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: paymentData.customer || {},
        customizations: {
          title: 'Halimatu Academy',
          description: `Payment for ${selectedPlan.name}`,
          logo: '',
        },

        callback: async (flwResponse) => {
          console.log('[FLW CALLBACK SUCCESS]', flwResponse);
        
          if (!['successful', 'completed'].includes(flwResponse?.status)) {
            notify.error('Payment not completed.');
            return;
          }
        
          try {
            console.log('=== STARTING POST-PAYMENT PROCESSING ===');
        
            // 1. Verify
            console.log('Step 1: Verifying payment...');
            const verifyRes = await verifyPayment({
              tx_ref: flwResponse.tx_ref,
              transaction_id: flwResponse.transaction_id,
            });
            console.log('Verify response:', verifyRes);
        
            // 2. Activate / Create Subscription
            console.log('Step 2: Activating/Creating subscription...');
            let activateRes;
            try {
              activateRes = await activateSubscription({
                tx_ref: flwResponse.tx_ref,
                transaction_id: flwResponse.transaction_id,
              });
              console.log('Activate response:', activateRes);
            } catch (actErr) {
              console.error('ActivateSubscription threw error:', actErr);
              activateRes = { error: actErr.response?.data || actErr.message };
            }
        
            // 3. Strong Polling with detailed logs
            let activated = false;
            for (let attempt = 1; attempt <= 12; attempt++) {
              console.log(`Polling attempt ${attempt}/12 | tx_ref: ${flwResponse.tx_ref}`);
              
              const statusCheck = await getMySubscriptionStatus();
              console.log(`Status check response (attempt ${attempt}):`, statusCheck);
        
              const isActive = 
                statusCheck?.data?.has_active_subscription === true ||
                statusCheck?.data?.is_active === true ||
                statusCheck?.has_active_subscription === true ||
                statusCheck?.is_active === true ||
                statusCheck?.data?.status === 'active';
        
              if (isActive) {
                activated = true;
                console.log('✅ SUCCESS: Active subscription found!');
                break;
              }
              await new Promise(r => setTimeout(r, 2500));
            }
        
            // Final refresh
            await fetchData();
        
            if (activated) {
              notify.success('🎉 Subscription activated successfully!');
            } else {
              notify.error(`Payment verified, but no active subscription found. 
                Backend returned subscription_id: null. 
                Check your backend logs for tx_ref: ${flwResponse.tx_ref}`);
            }
        
            if (typeof window.closePaymentModal === 'function') {
              window.closePaymentModal();
            }
        
          } catch (err) {
            console.error('Callback error:', err);
            notify.error('Something went wrong after payment. Contact support with tx_ref: ' + flwResponse.tx_ref);
          }
        },

        onClose: () => {
          console.log('Flutterwave modal closed by user');
        },
      });
    } catch (err) {
      console.error('[initiateSubscription error]', err);
      notify.error(err?.response?.data?.message || 'Failed to start payment. Please try again.');
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, [fetchData]);

  /* Cancel Subscription */
  const handleCancel = useCallback(async () => {
    const id = activeSubscription?.id || activeSubscription?._id;
    if (!id) return;
    setIsCancelling(true);
    try {
      const res = await cancelSubscriptionForUser(id);
      if (res?.status === 'success' || res?.success === true) {
        notify.success('Subscription cancelled successfully.');
        setShowCancelModal(false);
        await fetchData();
      } else {
        throw new Error('Cancellation not confirmed');
      }
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to cancel subscription.');
    } finally {
      setIsCancelling(false);
    }
  }, [activeSubscription, fetchData]);

  /* Toggle Auto-Renew */
  const handleToggleAutoRenew = useCallback(async () => {
    const id = activeSubscription?.id || activeSubscription?._id;
    if (!id) return;
    setIsTogglingRenew(true);
    try {
      const res = await toggleAutoRenew(id);
      if (res?.status === 'success' || res?.success === true) {
        notify.success(`Auto-renew ${activeSubscription?.auto_renew ? 'disabled' : 'enabled'}.`);
        await fetchData();
      }
    } catch (err) {
      notify.error('Failed to update auto-renew.');
    } finally {
      setIsTogglingRenew(false);
    }
  }, [activeSubscription, fetchData]);

  const handleRetry = useCallback(async () => {
    setPageState('loading');
    await fetchData();
    setPageState('ready');
  }, [fetchData]);

  /* Derived Values */
  const isSubscribed = !!(
    subscriptionStatus?.is_active ||
    subscriptionStatus?.status === 'active' ||
    activeSubscription
  );

  const activePlanId = activeSubscription?.plan_id || activeSubscription?.plan?.id;
  const nextBilling = formatDate(activeSubscription?.next_billing_date || activeSubscription?.end_date);
  const autoRenew = activeSubscription?.auto_renew ?? true;
  const planLabel = activeSubscription?.plan_name || activeSubscription?.plan?.name || '—';
  const paymentMethod = activeSubscription?.card?.last_4digits
    ? `•••• ${activeSubscription.card.last_4digits}`
    : null;

  /* Loading / Error Screen */
  if (pageState !== 'ready') {
    return (
      <>
        <div className="bg-white px-6 py-4 mb-6 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">Subscription & Billing</h1>
        </div>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          {pageState === 'error' ? (
            <>
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <FaExclamationCircle className="text-red-400" size={28} />
              </div>
              <p className="text-gray-700">Could not load subscription data</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 bg-[#004aad] text-white rounded-xl font-medium"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <div className="w-11 h-11 border-4 border-[#004aad]/20 border-t-[#004aad] rounded-full animate-spin" />
              <p className="text-gray-700">Loading your subscription...</p>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Billing History Modal */}
      {showBillingHistory && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setShowBillingHistory(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h3 className="text-lg font-bold">Billing History</h3>
                <p className="text-sm text-gray-500">
                  {allSubscriptions.length} transaction{allSubscriptions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button onClick={() => setShowBillingHistory(false)} className="text-gray-400 hover:text-gray-700">
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {allSubscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <FaHistory className="mx-auto text-gray-300" size={40} />
                  <p className="mt-4 text-gray-400">No billing history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allSubscriptions.map((sub, i) => (
                    <div key={sub.id || sub._id || i} className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#004aad]/10 rounded-lg flex items-center justify-center">
                          <FaCreditCard className="text-[#004aad]" />
                        </div>
                        <div>
                          <p className="font-medium">{sub.plan_name || 'Subscription'}</p>
                          <p className="text-xs text-gray-400">{formatDate(sub.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatPrice(sub.amount)}</p>
                        <span className="text-xs px-3 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {sub.status || 'paid'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
              <FaExclamationCircle className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Cancel Subscription?</h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              You will lose access at the end of the current billing period.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white px-6 py-4 mb-6 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">Subscription & Billing</h1>
        <p className="text-sm text-gray-400">
          <Link to="/student" className="text-[#004aad] hover:underline">Dashboard</Link> › Subscription & Billing
        </p>
      </div>

      <div className="min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Current Subscription Card */}
          <div className={`rounded-2xl p-8 mb-8 ${isSubscribed ? 'bg-gradient-to-br from-[#004aad] to-[#0060d6] text-white' : 'bg-white border'}`}>
            <div className="flex flex-col md:flex-row gap-6 justify-between">
              <div>
                <div className="flex gap-3 mb-4">
                  <span className={`px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${isSubscribed ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                    {isSubscribed ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  {isSubscribed && autoRenew && <span className="text-xs opacity-75 flex items-center gap-1"><FaSync size={10} /> Auto-renews</span>}
                </div>

                {isSubscribed ? (
                  <>
                    <h2 className="text-3xl font-black mb-3">{planLabel}</h2>
                    <div className="flex flex-wrap gap-x-8 text-sm">
                      <div className="flex items-center gap-2"><FaCalendarAlt /> Next: <strong>{nextBilling}</strong></div>
                      {paymentMethod && <div className="flex items-center gap-2"><FaCreditCard /> {paymentMethod}</div>}
                    </div>
                  </>
                ) : (
                  <h2 className="text-2xl font-bold">No Active Subscription</h2>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {isSubscribed && (
                  <>
                    <button
                      onClick={handleToggleAutoRenew}
                      disabled={isTogglingRenew}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white"
                    >
                      {isTogglingRenew ? <FaSync className="animate-spin" /> : autoRenew ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                      Auto-Renew {autoRenew ? 'On' : 'Off'}
                    </button>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white border border-white/20"
                    >
                      Cancel Plan
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowBillingHistory(true)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border ${isSubscribed ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FaHistory /> History
                </button>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{isSubscribed ? 'Upgrade Plan' : 'Choose a Plan'}</h2>
            <p className="text-gray-500 mt-1">
              {isSubscribed ? 'Get better value with longer commitment' : 'Unlock full access to all courses'}
            </p>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center border border-dashed">No plans available right now.</div>
          ) : (
            <div className={`grid gap-6 ${plans.length === 1 ? 'max-w-sm' : plans.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
              {plans.map((plan) => {
                const isCurrent = activePlanId === plan.id;
                const disabled = isCurrent || isProcessing;

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all ${plan.popular ? 'ring-2 ring-[#004aad] shadow-2xl' : 'hover:shadow-xl'}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 inset-x-0 flex justify-center z-10">
                        <div className="bg-[#004aad] text-white text-xs font-bold px-5 py-1 rounded-b-lg flex items-center gap-1">
                          <FaStar size={11} /> MOST POPULAR
                        </div>
                      </div>
                    )}

                    <div className={`p-8 ${plan.popular ? 'pt-12 bg-[#004aad]' : 'bg-gradient-to-br from-gray-900 to-gray-800'} text-white`}>
                      <p className="uppercase text-xs opacity-70 tracking-widest">{plan.period}</p>
                      <h3 className="text-2xl font-bold my-3">{plan.name}</h3>
                      <div className="text-4xl font-black">{plan.displayPrice}</div>
                    </div>

                    <div className="flex-1 p-6 bg-white flex flex-col">
                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <FaCheckCircle className="text-[#004aad] mt-0.5" size={16} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => !disabled && handlePaymentRedirect(plan)}
                        disabled={disabled}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 ${isCurrent
                          ? 'bg-emerald-100 text-emerald-700'
                          : disabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-[#004aad] text-white hover:bg-[#003a8c]'
                          : 'bg-gray-900 text-white hover:bg-black'
                        }`}
                      >
                        {isProcessing && !isCurrent ? (
                          <>Processing <FaSync className="animate-spin" /></>
                        ) : isCurrent ? (
                          <>Current Plan <FaCheckCircle /></>
                        ) : (
                          <>Get Started <FaArrowRight /></>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center text-xs text-gray-400 flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-1"><FaShieldAlt className="text-[#004aad]" /> Secured by Flutterwave</span>
            <span>·</span>
            <span className="flex items-center gap-1"><FaLock /> 256-bit SSL Encryption</span>
            <span>·</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;