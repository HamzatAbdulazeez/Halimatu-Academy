import React from 'react';

const ProgressRing = ({ progress = 0 }) => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="14"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#053276"
          strokeWidth="14"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900">{progress}%</span>
        <span className="text-sm text-gray-600 mt-1">Progress</span>
      </div>
    </div>
  );
};

export default ProgressRing;