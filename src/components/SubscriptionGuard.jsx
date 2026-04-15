import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMySubscriptionStatus } from '../api/plansApi';

// Routes that are ALWAYS accessible — no subscription needed
const PUBLIC_STUDENT_ROUTES = [
  '/student/subscription',
  '/student/settings',
];

const SubscriptionGuard = ({ children }) => {
  const [isChecking, setIsChecking]                       = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const checkedRef = useRef(false);

  const isPublicRoute = PUBLIC_STUDENT_ROUTES.some(route =>
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    // Skip API call entirely for public routes
    if (isPublicRoute) {
      setIsChecking(false);
      return;
    }

    // Prevent duplicate calls on rapid re-renders
    if (checkedRef.current) return;
    checkedRef.current = true;

    const checkSubscription = async () => {
      // Wait for auth token (handles post-login race condition)
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
          res?.data?.is_active         ||
          res?.is_active               ||
          res?.data?.status === 'active' ||
          res?.status === 'active'     ||
          false;

        setHasActiveSubscription(isActive);

        if (!isActive) {
          navigate('/student/subscription', {
            replace: true,
            state: { from: location.pathname },
          });
        }
      } catch (err) {
        console.error('[SubscriptionGuard] Check failed:', err);
        navigate('/student/subscription', {
          replace: true,
          state: { from: location.pathname },
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPublicRoute)          return <>{children}</>;
  if (isChecking)             return <CheckingScreen />;
  if (hasActiveSubscription)  return <>{children}</>;
  return null; // redirect already fired above
};

const CheckingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin w-12 h-12 border-4 border-[#004aad]/20 border-t-[#004aad] rounded-full mx-auto" />
      <p className="mt-4 text-gray-500 text-sm">Checking your subscription...</p>
    </div>
  </div>
);

export default SubscriptionGuard;