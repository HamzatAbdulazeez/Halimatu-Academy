import { Award } from "lucide-react";
import { Link } from "react-router-dom";

const NoCertificateState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white px-4 text-center">
    <div className="w-20 h-20 bg-[#004aad]/10 rounded-full flex items-center justify-center">
      <Award className="w-10 h-10 text-[#004aad]" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">No Certificate Yet</h2>
      <p className="text-gray-400 text-sm max-w-xs">
        Enrol in a course and complete it to earn your first certificate.
      </p>
    </div>
    <Link
      to="/student"
      className="px-6 py-3 bg-[#004aad] text-white rounded-xl text-sm font-semibold hover:bg-[#003a8c] transition-colors"
    >
      Browse Courses
    </Link>
  </div>
);

export default NoCertificateState;