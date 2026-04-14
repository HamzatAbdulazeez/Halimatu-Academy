import { Loader2 } from "lucide-react";

const LoadingState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
    <Loader2 className="w-10 h-10 text-[#004aad] animate-spin" />
    <p className="text-gray-400 text-sm">Loading your certificate…</p>
  </div>
);

export default LoadingState;