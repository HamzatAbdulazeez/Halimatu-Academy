import React from 'react';

const STATUS_STYLES = {
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    live: 'bg-red-50 text-red-700 border-red-200',
    completed: 'bg-gray-100 text-gray-500 border-gray-200',
    cancelled: 'bg-red-50 text-red-400 border-red-100',
};

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.scheduled}`}>
        {status === 'live' && (
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        )}
        {status}
    </span>
);

export default StatusBadge;