import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <ShieldX className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page.<br />
          Please contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={() => navigate('/admin')}
          className="bg-[#004aad] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#003a8f]"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;