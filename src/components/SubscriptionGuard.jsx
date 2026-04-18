import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMySubscriptionStatus } from '../api/plansApi';
import {
  FaLock,
  FaArrowRight,
  FaShieldAlt,
  FaPlayCircle,
  FaCertificate,
  FaBell,
} from 'react-icons/fa';

// ─── Context ──────────────────────────────────────────────────────────────────

const SubscriptionContext = createContext({
  isSubscribed: true,
  isChecking: false,
});

export const useSubscription = () => useContext(SubscriptionContext);

// ─── Constants ────────────────────────────────────────────────────────────────

const PUBLIC_STUDENT_ROUTES = [
  '/student/subscription',
  '/student/settings',
];

// ─── Subscription Wall ────────────────────────────────────────────────────────

export const SubscriptionWall = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const perks = [
    {
      icon: <FaPlayCircle />,
      label: 'Full course access',
      desc: 'Stream every lesson on any device, anytime',
    },
    {
      icon: <FaCertificate />,
      label: 'Earn certificates',
      desc: 'Download and share your achievements',
    },
    {
      icon: <FaBell />,
      label: 'Class notifications',
      desc: 'Never miss a live session or update',
    },
    {
      icon: <FaShieldAlt />,
      label: 'Priority support',
      desc: 'Get expert help whenever you need it',
    },
  ];

  return (
    <div
      className={`flex flex-col items-center justify-center
        px-4 py-16 min-h-full w-full
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      <div className="w-full max-w-xl">

        {/* Accent bar */}
        <div className="h-1 w-full rounded-t-2xl bg-linear-to-r from-[#004aad] via-blue-400 to-indigo-400" />

        {/* Card */}
        <div className="bg-white rounded-b-2xl  shadow-blue-900/10 border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-10 pb-7 text-center border-b border-gray-100 bg-linear-to-b from-blue-50/70 to-white">
            <div className="inline-flex items-center justify-center w-14 h-14
              rounded-2xl bg-linear-to-br from-[#004aad] to-indigo-600
              shadow-lg shadow-blue-500/25 mb-5">
              <FaLock className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
              Unlock Your Learning Journey
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              You're one step away from full access. Choose a plan to unlock
              your dashboard, courses, certificates, and everything else.
            </p>
          </div>

          {/* Perks grid */}
          <div className="grid grid-cols-2 gap-px bg-gray-100">
            {perks.map(({ icon, label, desc }) => (
              <div key={label} className="bg-white px-5 py-5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center
                  justify-center text-[#004aad] text-sm shrink-0 mt-0.5">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-8 py-8 flex flex-col items-center gap-3">
            <button
              onClick={() => navigate('/student/subscription')}
              className="w-full max-w-xs flex items-center justify-center gap-2
                bg-gradient-to-r from-[#004aad] to-indigo-600
                hover:from-[#003888] hover:to-indigo-700
                text-white font-bold py-3.5 px-8 rounded-xl
                shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35
                transition-all duration-200 text-sm tracking-wide group"
            >
              View Subscription Plans
              <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
              <FaShieldAlt className="text-gray-300" />
              Secured by Flutterwave · Cancel anytime
            </p>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Already subscribed?{' '}
          <button
            onClick={() => navigate('/student/subscription')}
            className="text-[#004aad] hover:underline font-semibold"
          >
            Manage your subscription
          </button>
        </p>
      </div>
    </div>
  );
};

// ─── Silent Loader ────────────────────────────────────────────────────────────

const SilentLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin w-10 h-10 border-[3px] border-[#004aad]/15
        border-t-[#004aad] rounded-full mx-auto" />
      <p className="mt-3 text-gray-400 text-xs tracking-wide">Just a moment...</p>
    </div>
  </div>
);

const SubscriptionGuard = ({ children }) => {
  const location  = useLocation();
  const isRunning = useRef(false);
  const prevPath  = useRef(location.pathname);

  // null = first check pending | true = active | false = inactive
  const [subState, setSubState] = useState(null);

  const isPublicRoute = PUBLIC_STUDENT_ROUTES.some(r =>
    location.pathname.startsWith(r)
  );

  const checkSubscription = useCallback(async () => {
    if (isRunning.current) return;
    isRunning.current = true;

    // Wait for auth token — handles post-login race condition
    let token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      for (let i = 0; i < 8; i++) {
        await new Promise(r => setTimeout(r, 250));
        token = localStorage.getItem('token') || localStorage.getItem('access_token');
        if (token) break;
      }
    }

    try {
      const res = await getMySubscriptionStatus();
      const isActive =
        res?.data?.is_active           ||
        res?.is_active                 ||
        res?.data?.status === 'active' ||
        res?.status === 'active'       ||
        false;
      setSubState(isActive);
    } catch (err) {
      console.error('[SubscriptionGuard] Check failed:', err);
      setSubState(false);
    } finally {
      isRunning.current = false;
    }
  }, []);

  useEffect(() => {
    const comingFromSub = prevPath.current.startsWith('/student/subscription');
    prevPath.current = location.pathname;

    // Returning from subscription page → force re-check (user may have just paid)
    if (comingFromSub && !isPublicRoute) {
      setSubState(null);
      isRunning.current = false;
      checkSubscription();
      return;
    }

    // Public routes don't need a check
    if (isPublicRoute) return;

    // Already confirmed active — skip API, navigate instantly
    if (subState === true) return;

    // First load or inactive — run check
    isRunning.current = false;
    checkSubscription();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Public routes — provide context but skip any gate ──
  if (isPublicRoute) {
    return (
      <SubscriptionContext.Provider value={{ isSubscribed: true, isChecking: false }}>
        {children}
      </SubscriptionContext.Provider>
    );
  }

  // ── First check pending — one-time silent loader ──
  if (subState === null) return <SilentLoader />;

  // ── Active — real layout with full access ──
  if (subState === true) {
    return (
      <SubscriptionContext.Provider value={{ isSubscribed: true, isChecking: false }}>
        {children}
      </SubscriptionContext.Provider>
    );
  }

  return (
    <SubscriptionContext.Provider value={{ isSubscribed: false, isChecking: false }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionGuard;