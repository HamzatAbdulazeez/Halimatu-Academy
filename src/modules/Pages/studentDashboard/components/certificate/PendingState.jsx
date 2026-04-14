import { Clock, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const PendingState = ({ data }) => (
  <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 px-6 pt-6">
      <p className="text-amber-700 text-sm">
        <Link to="/student" className="text-amber-600 hover:underline">Dashboard</Link>
        <ChevronRight className="inline w-3 h-3 mx-1" />Certificate
      </p>
    </div>

    <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 space-y-8 text-center">
      {/* Spinner icon */}
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute w-40 h-40 rounded-full border-2 border-amber-200 animate-spin" style={{ animationDuration: "8s" }} />
        <div className="absolute w-32 h-32 rounded-full border border-amber-300/50 animate-spin" style={{ animationDuration: "5s", animationDirection: "reverse" }} />
        <div className="w-28 h-28 bg-white rounded-full border-2 border-amber-200 flex items-center justify-center shadow-xl">
          <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
        </div>
      </div>

      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-300 rounded-full text-amber-700 text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          Awaiting Admin Review
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Almost There! 🎉</h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto">
          You've completed{" "}
          <strong className="text-gray-800">{data.course_title}</strong>. Your
          certificate is now with the academy admin for official review and
          issuance.
        </p>
      </div>

      {/* Progress steps */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-xl p-8 text-left space-y-5">
        <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Course Completed!</p>
            <p className="text-sm text-gray-400">100% — All lessons and assessments done</p>
          </div>
          <div className="ml-auto text-emerald-600 font-bold text-lg">100%</div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Course Enrolled", sub: data.course_title, done: true, time: "Completed" },
            { label: "Course Completed", sub: "All lessons & assessments passed", done: true, time: "Done ✓" },
            { label: "Admin Review", sub: "Certificate under review by academy admin", done: false, time: "In Progress", active: true },
            { label: "Certificate Issued", sub: "You will be notified once ready", done: false, time: "Pending" },
          ].map((item, idx) => (
            <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl ${item.active ? "bg-amber-50 border border-amber-100" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.done ? "bg-emerald-500" : item.active ? "bg-amber-500 animate-pulse" : "bg-gray-200"}`}>
                {item.done ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : item.active ? (
                  <Clock className="w-4 h-4 text-white" />
                ) : (
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${item.done ? "text-gray-400 line-through" : item.active ? "text-amber-800" : "text-gray-400"}`}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-400 truncate">{item.sub}</p>
              </div>
              <span className={`text-xs font-medium shrink-0 ${item.done ? "text-emerald-500" : item.active ? "text-amber-600" : "text-gray-300"}`}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm">What happens next?</p>
          <p className="text-amber-700 text-sm mt-1 leading-relaxed">
            The HSA Academy admin will verify your completion records and
            officially issue your certificate. This typically takes{" "}
            <strong>1–3 business days</strong>. You'll receive a notification
            once it's ready to download.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default PendingState;