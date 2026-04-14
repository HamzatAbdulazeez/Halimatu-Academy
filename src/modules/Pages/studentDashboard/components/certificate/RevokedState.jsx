import { AlertCircle, ChevronRight, Shield, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const RevokedState = ({ data }) => (
  <div className="min-h-screen bg-linear-to-br from-red-50 via-rose-50 to-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-72 h-72 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 px-6 pt-6">
      <p className="text-red-400 text-sm">
        <Link to="/student" className="text-red-500 hover:underline">Dashboard</Link>
        <ChevronRight className="inline w-3 h-3 mx-1" />Certificate
      </p>
    </div>

    <div className="relative z-10 max-w-xl mx-auto px-4 py-20 space-y-8 text-center">
      <div className="w-28 h-28 bg-red-100 rounded-full border-4 border-red-200 flex items-center justify-center mx-auto shadow-xl">
        <AlertCircle className="w-14 h-14 text-red-500" />
      </div>

      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full text-red-600 text-sm font-medium mb-4">
          Certificate Revoked
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Certificate Revoked</h1>
        <p className="text-gray-500 leading-relaxed">
          Your certificate for{" "}
          <strong className="text-gray-700">{data.course_title}</strong> has
          been revoked by the academy administration. Please contact support for
          more information.
        </p>
      </div>

      <div className="bg-white border border-red-100 rounded-2xl p-6 text-left space-y-3 shadow-sm">
        <p className="font-semibold text-gray-800 flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-500" /> What to do:
        </p>
        <ul className="space-y-2 text-sm text-gray-500">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
            Contact your instructor or academy support for clarification.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
            If this is an error, submit an appeal via email.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
            Keep your course completion records as proof.
          </li>
        </ul>
      </div>

      <a
        href="mailto:support@hsaacademy.com"
        className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 hover:shadow-lg transition-all font-semibold"
      >
        <Mail className="w-5 h-5" /> Contact Support
      </a>
    </div>
  </div>
);

export default RevokedState;