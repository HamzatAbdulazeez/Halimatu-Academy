import React from 'react';

const RecentActivityItem = ({ activity }) => (
  <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
      {activity.icon}
    </div>
    <div className="flex-1">
      <p className="font-medium text-gray-900">{activity.action}</p>
      <p className="text-sm text-gray-600 mt-0.5">{activity.detail}</p>
      <p className="text-xs text-gray-500 mt-1">
        {activity.course} • {activity.time}
      </p>
    </div>
  </div>
);

export default RecentActivityItem;