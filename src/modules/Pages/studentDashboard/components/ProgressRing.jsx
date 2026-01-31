import React from 'react';

const ProgressRing = ({
  progress = 0,
  size = 140,
  strokeWidth = 12,
  trackColor = '#e5e7eb',
  progressColor = '#004aad',
  showLabel = true,
  className = '',
}) => {
  // Clamp progress between 0 and 100
  const safeProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * safeProgress) / 100;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        className="w-full h-full -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Centered progress text */}
      {showLabel && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <span
            className="text-3xl md:text-4xl font-bold text-gray-900 leading-none"
          >
            {Math.round(safeProgress)}
          </span>
          <span className="text-xs md:text-sm text-gray-500 mt-1 font-medium">
            %
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;