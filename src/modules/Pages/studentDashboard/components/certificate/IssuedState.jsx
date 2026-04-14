import { useState, useRef } from "react";
import {
  Award, Download, Share2, BookOpen, Sparkles,
  Facebook, Twitter, Linkedin, Mail,
  CheckCircle, X, ChevronRight, Shield, Star, GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { notify } from "../../../../../utils/toast";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const IssuedState = ({ data }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${data.full_name || data.user_name}-HSA-Certificate.pdf`);
      setDownloaded(true);
      notify.success("Certificate downloaded successfully!");
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("Download failed:", err);
      notify.error("Failed to download certificate. Please try again.");
    }
  };

  const certificateURL = `${window.location.origin}/verify/${data.certificate_id}`;

  const handleShare = (platform) => {
    const text = encodeURIComponent(
      `I just completed ${data.course_title} at HSA Academy! Check my certificate: ${certificateURL}`
    );
    const urls = {
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateURL)}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateURL)}`,
      Twitter: `https://twitter.com/intent/tweet?text=${text}`,
      Email: `mailto:?subject=My HSA Academy Certificate&body=${text}`,
    };
    window.open(urls[platform], "_blank");
    setShowShareModal(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(certificateURL);
    notify.success("Certificate link copied to clipboard!");
  };

  const firstName = (data.full_name || data.user_name || "").split(" ")[0];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f0f4ff] via-white to-[#f0fdf9] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#004aad]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Certificate</h1>
        <p className="text-gray-400 text-sm">
          <Link to="/student" className="text-[#004aad] hover:underline">Dashboard</Link>
          <ChevronRight className="inline w-3 h-3 mx-1" />Certificate
        </p>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Hero text */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-[#004aad]/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#004aad] animate-pulse" />
            <span className="text-sm text-[#004aad] font-semibold tracking-wide uppercase">
              Certificate of Completion
            </span>
            <Sparkles className="w-4 h-4 text-[#004aad] animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Congratulations, <span className="text-[#004aad]">{firstName}!</span> 🎓
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Your certificate has been officially issued by HSA Academy. Download
            and share your achievement!
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Officially Issued · {formatDate(data.issue_date)}
          </div>
        </div>

        {/* Certificate card */}
        <div
          ref={certificateRef}
          className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,74,173,0.15)] overflow-hidden"
          style={{ padding: "56px 64px" }}
        >
          {/* Corner decorations */}
          <div className="absolute top-6 left-6 w-16 h-16 border-l-4 border-t-4 border-[#004aad] rounded-tl-2xl opacity-40" />
          <div className="absolute top-6 right-6 w-16 h-16 border-r-4 border-t-4 border-[#004aad] rounded-tr-2xl opacity-40" />
          <div className="absolute bottom-6 left-6 w-16 h-16 border-l-4 border-b-4 border-[#004aad] rounded-bl-2xl opacity-40" />
          <div className="absolute bottom-6 right-6 w-16 h-16 border-r-4 border-b-4 border-[#004aad] rounded-br-2xl opacity-40" />
          <div className="absolute inset-10 border border-[#004aad]/10 rounded-2xl pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none select-none">
            <GraduationCap className="w-96 h-96 text-[#004aad]" />
          </div>

          <div className="relative z-10 text-center space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-linear-to-br from-[#004aad] to-teal-500 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                <BookOpen className="w-10 h-10 text-white -rotate-3" />
              </div>
            </div>

            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-[#004aad] tracking-tight">
                HSA Academy
              </h2>
              <p className="text-gray-400 text-xs mt-1 tracking-widest uppercase">
                Islamic Education For All
              </p>
            </div>

            <div className="flex items-center gap-4 max-w-xs mx-auto">
              <div className="flex-1 h-px bg-linear-to-r from-transparent to-[#004aad]/30" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <div className="flex-1 h-px bg-linear-to-l from-transparent to-[#004aad]/30" />
            </div>

            <div className="space-y-2">
              <p className="text-xl text-gray-500 font-light tracking-wide">This is to certify that</p>
              <h3
                className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {data.full_name || data.user_name}
              </h3>
              <p className="text-xl text-gray-500 font-light">
                has successfully completed the course
              </p>
            </div>

            <div className="inline-block bg-linear-to-br from-[#004aad]/5 to-teal-500/5 border-2 border-[#004aad]/20 rounded-2xl px-10 py-5 my-2">
              <h4 className="text-2xl md:text-3xl font-bold text-gray-900">{data.course_title}</h4>
            </div>

            {data.grade && (
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gray-200" />
                <p className="text-gray-600 text-base">
                  with a grade of{" "}
                  <span className="font-bold text-[#004aad] text-lg">{data.grade}</span>
                </p>
                <div className="h-px w-16 bg-gray-200" />
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-100 max-w-xl mx-auto">
              {[
                { label: "Completion Date", value: formatDate(data.issue_date) },
                { label: "Duration", value: data.duration || "—" },
                { label: "Certificate No.", value: data.certificate_number || data.certificate_id },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                  <p className="font-bold text-gray-900 text-sm">{value}</p>
                </div>
              ))}
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-16 pt-6 max-w-xl mx-auto">
              <div className="text-center">
                <div className="h-14 flex items-center justify-center mb-2">
                  <Award className="w-12 h-12 text-[#004aad]" />
                </div>
                <div className="w-48 h-px bg-gray-300 mx-auto mb-2" />
                <p className="font-semibold text-gray-800 text-sm">HSA Academy</p>
                <p className="text-gray-400 text-xs">Issuing Authority</p>
              </div>
              <div className="text-center">
                <div className="h-14 flex items-center justify-center mb-2">
                  <GraduationCap className="w-12 h-12 text-[#004aad]" />
                </div>
                <div className="w-48 h-px bg-gray-300 mx-auto mb-2" />
                <p className="font-semibold text-gray-800 text-sm">Dr. Abdullah Hassan</p>
                <p className="text-gray-400 text-xs">Dean, HSA Academy</p>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="pt-4 space-y-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                <Shield className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">Certificate ID:</span>
                <span className="font-mono font-bold text-gray-700 text-xs">{data.certificate_id}</span>
              </div>
              <p className="text-xs text-gray-300">Issued on {formatDate(data.issue_date)}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            className={`px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold text-base transition-all duration-300 ${
              downloaded
                ? "bg-emerald-500 text-white scale-95"
                : "bg-linear-to-r from-[#004aad] to-[#0062e6] text-white hover:shadow-[0_8px_30px_rgba(0,74,173,0.4)] hover:scale-105"
            }`}
          >
            {downloaded ? (
              <><CheckCircle className="w-5 h-5" /> Downloaded!</>
            ) : (
              <><Download className="w-5 h-5" /> Download Certificate</>
            )}
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-8 py-4 bg-white border-2 border-[#004aad] text-[#004aad] rounded-2xl hover:bg-[#004aad]/5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-base"
          >
            <Share2 className="w-5 h-5" /> Share Certificate
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Shield className="w-4 h-4" />
          <span>
            Verify at{" "}
            <span className="text-[#004aad] font-medium">
              {window.location.origin}/verify/{data.certificate_id}
            </span>
          </span>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-[#004aad] to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Share Your Achievement</h3>
              <p className="text-gray-500 text-sm">Let the world know about your accomplishment!</p>
            </div>
            <div className="space-y-3">
              {[
                { platform: "LinkedIn", Icon: Linkedin, bg: "bg-blue-700", light: "bg-blue-50 hover:bg-blue-100" },
                { platform: "Facebook", Icon: Facebook, bg: "bg-blue-600", light: "bg-blue-50 hover:bg-blue-100" },
                { platform: "Twitter", Icon: Twitter, bg: "bg-sky-500", light: "bg-sky-50 hover:bg-sky-100" },
                { platform: "Email", Icon: Mail, bg: "bg-gray-600", light: "bg-gray-50 hover:bg-gray-100" },
              ].map(({ platform, bg, light }) => (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  className={`w-full flex items-center gap-4 p-4 ${light} rounded-2xl transition-all duration-200`}
                >
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">Share on {platform}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-2">
              <span className="text-xs text-gray-500 truncate flex-1 font-mono">{certificateURL}</span>
              <button
                onClick={handleCopyLink}
                className="text-xs text-[#004aad] font-semibold shrink-0 hover:underline"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuedState;