import React from 'react';

const QuickActionButton = ({ icon, children, gradientFrom, gradientTo }) => (
  <button
    className={`w-full py-3.5 px-5 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white rounded-xl hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-3 shadow-sm`}
  >
    {icon} {children}
  </button>
);

export default QuickActionButton;