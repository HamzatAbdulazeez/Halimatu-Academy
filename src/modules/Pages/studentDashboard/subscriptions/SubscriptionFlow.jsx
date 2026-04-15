import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaShieldAlt, FaSync, FaCheckCircle } from 'react-icons/fa';

import {
  getPlans,
  getMyActiveSubscription,
  getMySubscriptionStatus,
  getMySubscriptions,
  initiateSubscription,
  verifyPayment,
  activateSubscription,
  cancelSubscriptionForUser,
  toggleAutoRenew,
} from '../../../../api/plansApi';

import { notify } from '../../../../utils/toast';
import { formatDate, formatPrice } from '../subscriptions/utils';

import CurrentSubscriptionCard from '../components/subscribe/CurrentSubscriptionCard';
import PlanCard from '../components/subscribe/PlanCard';
import BillingHistoryModal from '../components/subscribe/BillingHistoryModal';
import CancelSubscriptionModal from '../components/subscribe/CancelSubscriptionModal';

// Success banner shown immediately after payment completes
const SuccessBanner = ({ planLabel, onDismiss }) => (
  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
    <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={24} />
    <div className="flex-1">
      <p className="font-bold text-emerald-800 text-lg">Subscription Activated! 🎉</p>
      <p className="text-emerald-700 text-sm mt-1">
        You are now subscribed to <strong>{planLabel}</strong>. Full access has been granted to your account.
      </p>
    </div>
    <button
      onClick={onDismiss}
      className="text-emerald-400 hover:text-emerald-600 text-xl font-bold leading-none"
    >
      ×
    </button>
  </div>
);

const StudentSubscriptionPage = () => {
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isTogglingRenew, setIsTogglingRenew] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Tracks which plan id is being processed — null means none active
  const [processingPlanId, setProcessingPlanId] = useState(null);

  // Show the green success banner after a successful payment
  const [justSubscribed, setJustSubscribed] = useState(false);

  const [plans, setPlans] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [allSubscriptions, setAllSubscriptions] = useState([]);

  const [pageState, setPageState] = useState('loading');

  // Ref lock prevents same-tick double payment initiation
  const processingRef = useRef(false);

  // Track mounted state to avoid setState after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setPageState('loading');

    try {
      const plansRes = await getPlans();
      const raw = plansRes?.data?.plans ?? plansRes?.plans ?? plansRes?.data ?? plansRes ?? [];

      const mapped = Array.isArray(raw)
        ? raw
            .map(plan => ({
              id: String(plan.id),   // always string so === comparison is safe
              name: plan.name || 'Plan',
              period: plan.type || `${plan.duration_months} Months`,
              durationMonths: plan.duration_months,
              price: plan.discounted_price ?? plan.original_price ?? 0,
              displayPrice: formatPrice(plan.discounted_price ?? plan.original_price),
              features: Array.isArray(plan.features) ? plan.features : [],
              popular: plan.sort_order === 1,
              status: plan.status,
            }))
            .filter(p => p.status !== 'inactive')
        : [];

      if (!mountedRef.current) return;
      setPlans(mapped);

      const [activeRes, statusRes, allSubsRes] = await Promise.allSettled([
        getMyActiveSubscription(),
        getMySubscriptionStatus(),
        getMySubscriptions(),
      ]);

      if (!mountedRef.current) return;

      if (activeRes.status === 'fulfilled') {
        const s =
          activeRes.value?.subscription ??
          activeRes.value?.data?.subscription ??
          activeRes.value?.data ??
          activeRes.value;
        setActiveSubscription(s && typeof s === 'object' && s.id ? s : null);
      }

      if (statusRes.status === 'fulfilled') {
        setSubscriptionStatus(statusRes.value?.data ?? statusRes.value ?? null);
      }

      if (allSubsRes.status === 'fulfilled') {
        const d = allSubsRes.value;
        const list = d?.data?.subscriptions ?? d?.subscriptions ?? d?.data ?? d;
        setAllSubscriptions(Array.isArray(list) ? list : []);
      }

      // Always set ready — even on background refresh
      if (mountedRef.current) setPageState('ready');
    } catch (err) {
      console.error('[fetchData error]', err);
      if (!mountedRef.current) return;
      if (showLoading) setPageState('error');
      else notify.error('Failed to refresh. Please try again.');
    }
  }, []);

  // Wait for auth token before first fetch (fixes post-login race condition)
  useEffect(() => {
    const tryFetch = async () => {
      let token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        for (let i = 0; i < 8; i++) {
          await new Promise(r => setTimeout(r, 250));
          token = localStorage.getItem('token') || localStorage.getItem('access_token');
          if (token) break;
        }
      }
      if (mountedRef.current) fetchData();
    };
    tryFetch();
  }, [fetchData]);

  const handleRefreshPlans = async () => {
    setIsRefreshing(true);
    try {
      await fetchData(false);
      notify.success('Plans refreshed successfully');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePaymentRedirect = useCallback(async (selectedPlan) => {
    if (processingRef.current) {
      notify.error('A payment is already in progress. Please wait.');
      return;
    }

    processingRef.current = true;
    setProcessingPlanId(selectedPlan.id);

    console.group('🚀 Payment Flow Started');
    console.log('Selected Plan:', selectedPlan);

    try {
      console.log('1. Calling initiateSubscription...');
      const res = await initiateSubscription({ plan_id: selectedPlan.id });
      const paymentData = res?.data?.data || res?.data || res;

      console.log('Initiate Subscription Response:', res);
      console.log('Payment Data extracted:', paymentData);

      if (!paymentData?.tx_ref) {
        console.error('❌ No tx_ref received from backend');
        notify.error('Payment could not be started. No transaction reference returned.');
        return;
      }

      if (typeof window.FlutterwaveCheckout !== 'function') {
        console.error('❌ FlutterwaveCheckout not loaded on window');
        notify.error('Payment system not ready. Please refresh the page.');
        return;
      }

      console.log('2. Opening Flutterwave Checkout with tx_ref:', paymentData.tx_ref);

      window.FlutterwaveCheckout({
        public_key: 'FLWPUBK_TEST-39ab6a4a6d75cab56a4e98abcbc5aeb4-X', // ← Consider moving to env
        tx_ref: paymentData.tx_ref,
        amount: paymentData.amount,
        currency: paymentData.currency || 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: paymentData.customer || { email: 'user@example.com' }, // ensure email exists
        customizations: {
          title: 'Halimatu Academy',
          description: `Payment for ${selectedPlan.name}`,
          logo: '',
        },

        callback: async (flwResponse) => {
          console.group('✅ Flutterwave Callback Received');
          console.log('Full Flutterwave Response:', flwResponse);

          if (!['successful', 'completed'].includes(flwResponse?.status)) {
            console.warn('❌ Payment not successful:', flwResponse?.status);
            notify.error('Payment was not completed.');
            processingRef.current = false;
            setProcessingPlanId(null);
            console.groupEnd();
            return;
          }

          console.log('Payment status is successful. Starting backend activation...');

          try {
            notify.success('Payment received! Activating subscription...');

            // === VERIFY PAYMENT ===
            console.log('3. Calling verifyPayment...');
            const verifyRes = await verifyPayment({
              tx_ref: flwResponse.tx_ref,
              transaction_id: flwResponse.transaction_id,
            });
            console.log('Verify Payment Response:', verifyRes);

            // === ACTIVATE SUBSCRIPTION ===
            console.log('4. Calling activateSubscription...');
            const activateRes = await activateSubscription({
              tx_ref: flwResponse.tx_ref,
              transaction_id: flwResponse.transaction_id,
            });
            console.log('Activate Subscription Response:', activateRes);

            // === POLLING ===
            console.log('5. Starting polling for subscription status...');
            let activated = false;
            for (let i = 0; i < 10; i++) {
              await new Promise(r => setTimeout(r, 2000));
              console.log(`Polling attempt ${i + 1}/10...`);

              const statusRes = await getMySubscriptionStatus();
              console.log(`Status Response #${i + 1}:`, statusRes);

              const isActive =
                statusRes?.data?.is_active ||
                statusRes?.is_active ||
                statusRes?.data?.status === 'active' ||
                statusRes?.status === 'active';

              console.log(`Is subscription active? → ${isActive}`);

              if (isActive) {
                activated = true;
                console.log('✅ Subscription confirmed active!');
                break;
              }
            }

            // Final refresh
            console.log('6. Doing full data refresh...');
            await fetchData(false);

            if (mountedRef.current) {
              setJustSubscribed(true);
              notify.success(
                activated
                  ? '🎉 Subscription activated! You now have full access.'
                  : 'Payment successful! Your subscription will activate shortly.'
              );
            }
          } catch (err) {
            console.group('❌ Activation / Verification Error');
            console.error('[activation error]', err);
            console.error('Error response (if any):', err?.response?.data);
            console.error('Status code:', err?.response?.status);
            console.groupEnd();

            notify.error(
              `Payment successful but activation failed.\nRef: ${flwResponse.tx_ref}\n` +
              (err?.response?.data?.message || err?.message || 'Unknown error')
            );
          } finally {
            processingRef.current = false;
            setProcessingPlanId(null);
            console.groupEnd(); // end callback group
          }
        },

        onClose: () => {
          console.log('❌ Flutterwave modal closed by user');
          processingRef.current = false;
          setProcessingPlanId(null);
        },
      });
    } catch (err) {
      console.group('❌ Payment Initiation Error');
      console.error('[payment init error]', err);
      console.error('Error response data:', err?.response?.data);
      console.error('Status:', err?.response?.status);
      console.groupEnd();

      notify.error(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to start payment. Please try again.'
      );
    } finally {
      if (!window.FlutterwaveCheckout) {
        // only reset if checkout never opened
        processingRef.current = false;
        setProcessingPlanId(null);
      }
    }
  }, [fetchData]);

  const handleCancel = async () => {
    const id = activeSubscription?.id || activeSubscription?._id;
    if (!id) return;
    setIsCancelling(true);
    try {
      await cancelSubscriptionForUser(id);
      notify.success('Subscription cancelled successfully.');
      setShowCancelModal(false);
      setJustSubscribed(false);
      await fetchData(false);
    } catch {
      notify.error('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleToggleAutoRenew = async () => {
    const id = activeSubscription?.id || activeSubscription?._id;
    if (!id) return;
    // Capture BEFORE the API call — state won't have updated yet after fetch
    const currentAutoRenew = activeSubscription?.auto_renew ?? true;
    setIsTogglingRenew(true);
    try {
      await toggleAutoRenew(id);
      notify.success(`Auto-renew ${currentAutoRenew ? 'disabled' : 'enabled'}.`);
      await fetchData(false);
    } catch {
      notify.error('Failed to update auto-renew setting.');
    } finally {
      setIsTogglingRenew(false);
    }
  };

  // Derived values — all IDs coerced to string for reliable ===
  const isSubscribed = !!(
    subscriptionStatus?.is_active ||
    subscriptionStatus?.status === 'active' ||
    activeSubscription?.id
  );
  const activePlanId = String(
    activeSubscription?.plan_id || activeSubscription?.plan?.id || ''
  );
  const nextBilling = formatDate(
    activeSubscription?.next_billing_date || activeSubscription?.end_date
  );
  const autoRenew = activeSubscription?.auto_renew ?? true;
  const planLabel = activeSubscription?.plan_name || activeSubscription?.plan?.name || '—';
  const paymentMethod = activeSubscription?.card?.last_4digits
    ? `•••• ${activeSubscription.card.last_4digits}`
    : null;

  if (pageState === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin w-10 h-10 border-4 border-[#004aad]/20 border-t-[#004aad] rounded-full" />
        <p className="text-gray-500 text-sm">Loading your subscription...</p>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <FaExclamationCircle className="text-red-400" size={40} />
        <p className="text-gray-700 font-medium">Could not load subscription data</p>
        <p className="text-sm text-gray-400">Please check your connection and try again</p>
        <button
          onClick={() => fetchData(true)}
          className="px-6 py-2.5 bg-[#004aad] text-white rounded-xl hover:bg-[#003888] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">Subscription & Billing</h1>
        <p className="text-sm text-gray-400">
          <Link to="/student" className="text-[#004aad] hover:underline">Dashboard</Link>{' '}
          › Subscription & Billing
        </p>
      </div>

      <div className="bg-gray-50 min-h-screen ">
        <div className="mx-auto px-4 py-8 space-y-6">

          {/* Green success banner — shown right after payment */}
          {justSubscribed && (
            <SuccessBanner planLabel={planLabel} onDismiss={() => setJustSubscribed(false)} />
          )}

          <CurrentSubscriptionCard
            isSubscribed={isSubscribed}
            planLabel={planLabel}
            nextBilling={nextBilling}
            paymentMethod={paymentMethod}
            autoRenew={autoRenew}
            isTogglingRenew={isTogglingRenew}
            onToggleAutoRenew={handleToggleAutoRenew}
            onCancelClick={() => setShowCancelModal(true)}
            onShowHistory={() => setShowBillingHistory(true)}
          />

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {isSubscribed ? 'Your Plan & Upgrades' : 'Choose Your Plan'}
              </h2>
              <p className="text-gray-600">
                {isSubscribed
                  ? 'You are subscribed. Switch to a longer plan any time for better savings.'
                  : 'Select a plan to get full access to all features'}
              </p>
            </div>

            <button
              onClick={handleRefreshPlans}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:border-[#004aad] rounded-xl font-medium text-gray-700 hover:text-[#004aad] transition disabled:opacity-70"
            >
              <FaSync className={isRefreshing ? 'animate-spin' : ''} />
              Refresh Plans
            </button>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-center">
              <p className="text-gray-500 text-lg">No plans available at the moment.</p>
              <p className="text-sm text-gray-400 mt-2">
                Make sure your plans are set to &quot;Active&quot; in the Admin panel
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={activePlanId === plan.id}
                  isProcessing={processingPlanId === plan.id}
                  isDisabled={processingRef.current && processingPlanId !== plan.id}
                  onSelectPlan={handlePaymentRedirect}
                />
              ))}
            </div>
          )}

          <div className="mt-16 text-center text-xs text-gray-400 flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-1">
              <FaShieldAlt className="text-[#004aad]" /> Secured by Flutterwave
            </span>
            <span>·</span>
            <span>256-bit SSL Encryption</span>
            <span>·</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>

      <BillingHistoryModal
        isOpen={showBillingHistory}
        subscriptions={allSubscriptions}
        onClose={() => setShowBillingHistory(false)}
      />

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        isCancelling={isCancelling}
        onCancel={handleCancel}
        onClose={() => setShowCancelModal(false)}
      />
    </>
  );
};

export default StudentSubscriptionPage;