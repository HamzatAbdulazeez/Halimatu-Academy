import React from 'react';
import { FaCalendar, FaClock } from 'react-icons/fa';

const UpcomingClassCard = ({ classItem }) => (
  <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-3 mb-3">
      <h3 className="font-semibold text-gray-900 text-base leading-tight">{classItem.title}</h3>
      <span className="px-2.5 py-1 bg-[#053276] text-white rounded text-xs font-medium whitespace-nowrap">
        {classItem.type}
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-3">by {classItem.instructor}</p>
    <div className="space-y-2 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <FaCalendar className="text-[#053276]" />
        <span>{classItem.date}</span>
      </div>
      <div className="flex items-center gap-2">
        <FaClock className="text-[#053276]" />
        <span>{classItem.time} • {classItem.duration}</span>
      </div>
    </div>
   
  </div>
);

export default UpcomingClassCard;