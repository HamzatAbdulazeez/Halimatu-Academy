import React from 'react';

const StatsCard = ({ icon, value, label, change, color }) => (
  <div className="bg-white rounded-2xl p-6 transition-all duration-300 border border-gray-100">
    <div className={`w-14 h-14 bg-linear-to-br ${color} rounded-xl flex items-center justify-center text-white mb-4`}>
      {icon}
    </div>
    <p className="text-3xl font-bold text-black mb-6">{value}</p>
    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
    {/* <p className="text-xs text-gray-500">{change}</p> */}
  </div>
);

export default StatsCard;