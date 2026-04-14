import { AlertCircle } from "lucide-react";

const ErrorState = ({ message, onRetry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white px-4 text-center">
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
      <AlertCircle className="w-10 h-10 text-red-400" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Something went wrong</h2>
      <p className="text-gray-400 text-sm max-w-xs">{message}</p>
    </div>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-[#004aad] text-white rounded-xl text-sm font-semibold hover:bg-[#003a8c] transition-colors"
    >
      Try Again
    </button>
  </div>
);

export default ErrorState;