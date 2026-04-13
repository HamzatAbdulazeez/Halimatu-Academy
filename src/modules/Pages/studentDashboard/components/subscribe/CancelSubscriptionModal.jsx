import { FaExclamationCircle } from 'react-icons/fa';

const CancelSubscriptionModal = ({ isOpen, isCancelling, onCancel, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
          <FaExclamationCircle className="text-red-500" size={24} />
        </div>
        <h3 className="text-lg font-bold text-center mb-2">Cancel Subscription?</h3>
        <p className="text-center text-gray-500 text-sm mb-6">
          You will lose access at the end of the current billing period.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl font-medium"
          >
            Keep Plan
          </button>
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium disabled:opacity-50"
          >
            {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;