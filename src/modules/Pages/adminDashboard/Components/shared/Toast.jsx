import React from 'react';

const Toast = ({ message }) => {
    if (!message) return null;
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium">
                {message}
            </div>
        </div>
    );
};

export default Toast;