import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const LockedState = ({ data }) => (
  <div className="relative overflow-hidden">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#004aad]/20 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

    <div className="bg-white px-6 py-4 mb-6 border-b border-gray-100">
      <h1 className="text-2xl mb-4">Certificate</h1>
      <p className="text-gray-500 text-sm">
        <Link to="/student" className="text-[#004aad] hover:underline">Dashboard</Link>
        {" > "}Certificate
      </p>
    </div>

    <div className="relative bg-[#004aad] z-10 max-w-3xl mx-auto px-4 py-16 space-y-10 rounded-2xl">
      {/* Icon */}
      <div className="text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute w-40 h-40 rounded-full border border-white/30 animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute w-32 h-32 rounded-full border border-white/20 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
          <div className="w-28 h-28 bg-linear-to-br from-[#004aad]/30 to-slate-800 rounded-full border border-[#004aad]/40 flex items-center justify-center backdrop-blur-xl shadow-2xl">
            <Lock className="w-12 h-12 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Certificate <span className="text-[#4d8ef0]">Locked</span> 🔒
          </h1>
          <p className="text-white text-md max-w-xl mx-auto leading-relaxed">
            Your certificate is waiting for you. Complete{" "}
            <strong className="text-white">100%</strong> of your course — then
            the admin will review and officially issue it to you.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {data.progress != null && (
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between text-white/80 text-sm mb-2">
            <span>Course Progress</span>
            <span className="font-bold">{data.progress}%</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <p className="text-white/60 text-xs mt-2 text-right">
            {100 - data.progress}% remaining to unlock
          </p>
        </div>
      )}

      {/* Blurred preview */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10">
        <div className="blur-md opacity-30 pointer-events-none select-none bg-white p-10 text-center space-y-4">
          <div className="text-4xl font-bold text-[#004aad]">HSA ACADEMY</div>
          <div className="text-2xl text-gray-400">This is to certify that</div>
          <div className="text-5xl font-bold text-gray-800">{data.full_name || data.user_name}</div>
          <div className="text-xl text-gray-400">has successfully completed</div>
          <div className="text-2xl font-bold text-gray-700">{data.course_title}</div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-sm">
          <Lock className="w-12 h-12 text-slate-400 mb-3" />
          <p className="text-slate-300 font-semibold">
            Complete your course to reveal your certificate
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default LockedState;