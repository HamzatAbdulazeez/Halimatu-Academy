import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, X, Info, AlertTriangle } from "lucide-react";

const ALERT_CONFIG = {
  success: {
    duration: 5000,
    icon: CheckCircle2,
    colors: {
      border: "border-green-200",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "text-green-900",
      message: "text-green-700",
      bar: "bg-green-500",
      shadow: "shadow-green-500/20",
      closeHover: "hover:bg-green-100 hover:text-green-700",
    },
  },
  error: {
    duration: 8000,
    icon: AlertCircle,
    colors: {
      border: "border-red-200",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: "text-red-900",
      message: "text-red-700",
      bar: "bg-red-500",
      shadow: "shadow-red-500/20",
      closeHover: "hover:bg-red-100 hover:text-red-700",
    },
  },
  warning: {
    duration: 6000,
    icon: AlertTriangle,
    colors: {
      border: "border-amber-200",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      title: "text-amber-900",
      message: "text-amber-700",
      bar: "bg-amber-500",
      shadow: "shadow-amber-500/20",
      closeHover: "hover:bg-amber-100 hover:text-amber-700",
    },
  },
  info: {
    duration: 5000,
    icon: Info,
    colors: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "text-blue-900",
      message: "text-blue-700",
      bar: "bg-blue-500",
      shadow: "shadow-blue-500/20",
      closeHover: "hover:bg-blue-100 hover:text-blue-700",
    },
  },
};

const Alert = ({ alert, onClose, position = "top-center" }) => {
  const barRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  const config = ALERT_CONFIG[alert.type] || ALERT_CONFIG.info;
  const Icon = config.icon;
  const duration = alert.duration || config.duration;

  const handleClose = () => {
    setIsExiting(true);

    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 300);
  };

  useEffect(() => {
    if (!alert.show) {
      setIsEntering(false);
      return;
    }

    const enterTimer = setTimeout(() => setIsEntering(false), 100);

    // ✅ Start progress animation
    let animation;
    if (barRef.current) {
      animation = barRef.current.animate(
        [{ width: "100%" }, { width: "0%" }],
        {
          duration,
          easing: "linear",
          fill: "forwards",
        }
      );
    }

    // ✅ Reliable close timer (MAIN FIX)
    closeTimerRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimerRef.current);
      if (animation) animation.cancel();
    };
  }, [alert.show, alert.type, duration]);

  if (!alert.show) return null;

  const positionClasses = {
    "top-center": "top-6 left-1/2 -translate-x-1/2",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  return (
    <div
      className={`fixed z-50 w-full max-w-sm ${positionClasses[position]} px-4`}
      onMouseEnter={() => clearTimeout(closeTimerRef.current)}
      onMouseLeave={() => {
        closeTimerRef.current = setTimeout(handleClose, 2000); // resume shorter time
      }}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl border backdrop-blur-md
          transition-all duration-300 ease-out
          ${isEntering ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"}
          ${isExiting ? "opacity-0 translate-y-2 scale-95" : ""}
          ${config.colors.bg}
          ${config.colors.border}
          ${config.colors.shadow}
          shadow-2xl
        `}
        role="alert"
        aria-live="polite"
      >
        {/* Shimmer */}
        <div
          className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
          style={{ animation: isEntering ? "none" : "shimmer 2s infinite" }}
        />

        {/* Progress Bar */}
        <div
          ref={barRef}
          className={`absolute bottom-0 left-0 h-1 ${config.colors.bar}`}
          style={{ width: "100%" }}
        />

        {/* Top Accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${config.colors.bar} opacity-50`} />

        <div className="relative flex items-start gap-4 p-5">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${config.colors.iconBg} ${config.colors.iconColor} ${isEntering ? "" : "animate-icon-pulse"}`}
          >
            <Icon size={22} strokeWidth={2.5} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-1">
            <h3 className={`text-sm font-bold mb-1 tracking-tight ${config.colors.title}`}>
              {alert.title ||
                (alert.type === "success"
                  ? "Success"
                  : alert.type === "error"
                  ? "Error"
                  : alert.type === "warning"
                  ? "Warning"
                  : "Info")}
            </h3>

            <p className={`text-sm leading-relaxed ${config.colors.message}`}>
              {alert.message}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${config.colors.closeHover} hover:scale-110 active:scale-95`}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes icon-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-icon-pulse {
          animation: icon-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Alert;