import React, { useState, useRef, } from 'react';
import {
    Award, Download, Share2, BookOpen, Sparkles,
    Facebook, Twitter, Linkedin, Mail, Lock,
    CheckCircle, Clock, AlertCircle, X, ChevronRight,
    Shield, Star, GraduationCap, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// SIMULATED DATA — In production, fetch this from your backend API:
// GET /api/student/certificate/:studentId
//
// certificateStatus options:
//   'locked'   → Student hasn't finished the course yet
//   'pending'  → Course done, waiting for admin to issue
//   'issued'   → Admin issued the certificate ✅
//   'revoked'  → Admin revoked it
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_API_RESPONSE = {
    certificateStatus: 'locked', // 🔁 Change to: 'locked' | 'pending' | 'issued' | 'revoked'
    courseProgress: 67,
    studentName: 'Halimatu Abdullahi',
    courseName: "Basic Qur'an Reading & Arabic",
    completionDate: null,
    issueDate: null,
    certificateId: null,
    instructor: 'Sheikh Muhammad Tariq',
    grade: null,
    duration: '12 Months',
    totalHours: '120 Hours',
};

// ─────────────────────────────────────────────────────────────────────────────
// LOCKED STATE
// ─────────────────────────────────────────────────────────────────────────────
const LockedState = ({ data }) => {

    return (
        <div className="relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#004aad]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />


 <div className="bg-white px-6 py-4 mb-6 border-b border-gray-100">
                <h1 className="text-2xl mb-4">Certificate</h1>
                <p className="text-gray-500 text-sm">
                    <Link to="/student" className="text-[#004aad] hover:underline">Dashboard</Link>
                    {' > '}Certificate
                </p>
            </div>

            <div className="relative bg-[#004aad] z-10 max-w-3xl mx-auto px-4 py-16 space-y-10 rounded-2xl">

                <div className="text-center space-y-6">
                    <div className="relative inline-flex items-center justify-center">
                        <div className="absolute w-40 h-40 rounded-full border border-white/30 animate-ping" style={{ animationDuration: '3s' }} />
                        <div className="absolute w-32 h-32 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                        <div className="w-28 h-28 bg-linear-to-br from-[#004aad]/30 to-slate-800 rounded-full border border-[#004aad]/40 flex items-center justify-center backdrop-blur-xl shadow-2xl">
                            <Lock className="w-12 h-12 text-white" />
                        </div>
                        
                    </div>

                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            Certificate <span className="text-[#4d8ef0]">Locked</span> 🔒
                        </h1>
                        <p className="text-white text-md max-w-xl mx-auto leading-relaxed">
                            Your certificate is waiting for you. Complete <strong className="text-white">100%</strong> of your course — then the admin will review and officially issue it to you.
                        </p>
                    </div>
                </div>

                {/* Blurred certificate preview teaser */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10">
                    <div className="blur-md opacity-30 pointer-events-none select-none bg-white p-10 text-center space-y-4">
                        <div className="text-4xl font-bold text-[#004aad]">HALĪMATU SA'DIYYAH ISLAMIC ACADEMY</div>
                        <div className="text-2xl text-gray-400">This is to certify that</div>
                        <div className="text-5xl font-bold text-gray-800">{data.studentName}</div>
                        <div className="text-xl text-gray-400">has successfully completed</div>
                        <div className="text-2xl font-bold text-gray-700">{data.courseName}</div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-sm">
                        <Lock className="w-12 h-12 text-slate-400 mb-3" />
                        <p className="text-slate-300 font-semibold">Complete your course to reveal your certificate</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// PENDING STATE
// ─────────────────────────────────────────────────────────────────────────────
const PendingState = ({ data }) => {
    return (
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

                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute w-40 h-40 rounded-full border-2 border-amber-200 animate-spin" style={{ animationDuration: '8s' }} />
                    <div className="absolute w-32 h-32 rounded-full border border-amber-300/50 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />
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
                        You've completed <strong className="text-gray-800">{data.courseName}</strong>. Your certificate is now with the academy admin for official review and issuance.
                    </p>
                </div>

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
                            { label: 'Course Enrolled', sub: data.courseName, done: true, time: 'Completed' },
                            { label: 'Course Completed', sub: 'All lessons & assessments passed', done: true, time: 'Done ✓' },
                            { label: 'Admin Review', sub: 'Certificate under review by academy admin', done: false, time: 'In Progress', active: true },
                            { label: 'Certificate Issued', sub: 'You will be notified once ready', done: false, time: 'Pending' },
                        ].map((item, idx) => (
                            <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl ${item.active ? 'bg-amber-50 border border-amber-100' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.done ? 'bg-emerald-500' : item.active ? 'bg-amber-500 animate-pulse' : 'bg-gray-200'}`}>
                                    {item.done ? <CheckCircle className="w-4 h-4 text-white" /> :
                                        item.active ? <Clock className="w-4 h-4 text-white" /> :
                                            <span className="w-2 h-2 bg-gray-400 rounded-full" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm ${item.done ? 'text-gray-400 line-through' : item.active ? 'text-amber-800' : 'text-gray-400'}`}>{item.label}</p>
                                    <p className="text-xs text-gray-400 truncate">{item.sub}</p>
                                </div>
                                <span className={`text-xs font-medium flex-shrink-0 ${item.done ? 'text-emerald-500' : item.active ? 'text-amber-600' : 'text-gray-300'}`}>{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-800 text-sm">What happens next?</p>
                        <p className="text-amber-700 text-sm mt-1 leading-relaxed">
                            The HSA Academy admin will verify your completion records and officially issue your certificate. This typically takes <strong>1–3 business days</strong>. You'll receive a notification once it's ready to download.
                        </p>
                    </div>
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-amber-100 shadow-lg">
                    <div className="blur-sm opacity-40 pointer-events-none select-none bg-white p-8 text-center space-y-3">
                        <div className="text-3xl font-bold text-[#004aad]">HSA Academy</div>
                        <div className="text-lg text-gray-400">This is to certify that</div>
                        <div className="text-4xl font-bold text-gray-800">{data.studentName}</div>
                        <div className="text-lg text-gray-400">has successfully completed</div>
                        <div className="text-xl font-bold text-gray-700">{data.courseName}</div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]">
                        <Clock className="w-10 h-10 text-amber-500 mb-2 animate-pulse" />
                        <p className="text-amber-700 font-semibold">Your certificate is being prepared...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// REVOKED STATE
// ─────────────────────────────────────────────────────────────────────────────
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
                    Your certificate for <strong className="text-gray-700">{data.courseName}</strong> has been revoked by the academy administration. Please contact support for more information.
                </p>
            </div>
            <div className="bg-white border border-red-100 rounded-2xl p-6 text-left space-y-3 shadow-sm">
                <p className="font-semibold text-gray-800 flex items-center gap-2"><Shield className="w-4 h-4 text-red-500" /> What to do:</p>
                <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />Contact your instructor or academy support for clarification.</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />If this is an error, submit an appeal via email.</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />Keep your course completion records as proof.</li>
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

// ─────────────────────────────────────────────────────────────────────────────
// ISSUED STATE — Full beautiful certificate
// ─────────────────────────────────────────────────────────────────────────────
const IssuedState = ({ data }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const certificateRef = useRef(null);

    const handleDownload = async () => {
        if (!certificateRef.current) return;
        try {
            const { default: html2canvas } = await import('html2canvas');
            const { default: jsPDF } = await import('jspdf');
            const canvas = await html2canvas(certificateRef.current, { scale: 2, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${data.studentName}-HSA-Certificate.pdf`);
            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 3000);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const certificateURL = `${window.location.origin}/verify/${data.certificateId}`;
    const handleShare = (platform) => {
        const text = encodeURIComponent(`I just completed ${data.courseName} at HSA Academy! Check my certificate: ${certificateURL}`);
        const urls = {
            LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateURL)}`,
            Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateURL)}`,
            Twitter: `https://twitter.com/intent/tweet?text=${text}`,
            Email: `mailto:?subject=My HSA Academy Certificate&body=${text}`,
        };
        window.open(urls[platform], '_blank');
        setShowShareModal(false);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f0f4ff] via-white to-[#f0fdf9] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#004aad]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 bg-white border-b border-gray-100 px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">My Certificate</h1>
                <p className="text-gray-400 text-sm">
                    <Link to="/student" className="text-[#004aad] hover:underline">Dashboard</Link>
                    <ChevronRight className="inline w-3 h-3 mx-1" />Certificate
                </p>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-8">

                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-[#004aad]/20 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[#004aad] animate-pulse" />
                        <span className="text-sm text-[#004aad] font-semibold tracking-wide uppercase">Certificate of Completion</span>
                        <Sparkles className="w-4 h-4 text-[#004aad] animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Congratulations, <span className="text-[#004aad]">{data.studentName.split(' ')[0]}!</span> 🎓
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Your certificate has been officially issued by HSA Academy. Download and share your achievement!
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Officially Issued · {data.issueDate}
                    </div>
                </div>

                {/* ──── THE CERTIFICATE ──── */}
                <div
                    ref={certificateRef}
                    className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,74,173,0.15)] overflow-hidden"
                    style={{ padding: '56px 64px' }}
                >
                    <div className="absolute top-6 left-6 w-16 h-16 border-l-4 border-t-4 border-[#004aad] rounded-tl-2xl opacity-40" />
                    <div className="absolute top-6 right-6 w-16 h-16 border-r-4 border-t-4 border-[#004aad] rounded-tr-2xl opacity-40" />
                    <div className="absolute bottom-6 left-6 w-16 h-16 border-l-4 border-b-4 border-[#004aad] rounded-bl-2xl opacity-40" />
                    <div className="absolute bottom-6 right-6 w-16 h-16 border-r-4 border-b-4 border-[#004aad] rounded-br-2xl opacity-40" />
                    <div className="absolute inset-10 border border-[#004aad]/10 rounded-2xl pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none select-none">
                        <GraduationCap className="w-96 h-96 text-[#004aad]" />
                    </div>

                    <div className="relative z-10 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-linear-to-br from-[#004aad] to-teal-500 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                                <BookOpen className="w-10 h-10 text-white -rotate-3" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-5xl md:text-6xl font-bold text-[#004aad] tracking-tight">HSA Academy</h2>
                            <p className="text-gray-400 text-xs mt-1 tracking-widest uppercase">Islamic Education For All</p>
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
                                {data.studentName}
                            </h3>
                            <p className="text-xl text-gray-500 font-light">has successfully completed the course</p>
                        </div>

                        <div className="inline-block bg-linear-to-br from-[#004aad]/5 to-teal-500/5 border-2 border-[#004aad]/20 rounded-2xl px-10 py-5 my-2">
                            <h4 className="text-2xl md:text-3xl font-bold text-gray-900">{data.courseName}</h4>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <div className="h-px w-16 bg-gray-200" />
                            <p className="text-gray-600 text-base">
                                with a grade of{' '}
                                <span className="font-bold text-[#004aad] text-lg">{data.grade}</span>
                            </p>
                            <div className="h-px w-16 bg-gray-200" />
                        </div>

                        <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-100 max-w-xl mx-auto">
                            {[
                                { label: 'Completion Date', value: data.completionDate },
                                { label: 'Duration', value: data.duration },
                                { label: 'Total Hours', value: data.totalHours },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                                    <p className="font-bold text-gray-900 text-sm">{value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-16 pt-6 max-w-xl mx-auto">
                            <div className="text-center">
                                <div className="h-14 flex items-center justify-center mb-2">
                                    <span className="text-3xl text-gray-300" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                        {data.instructor.split(' ').slice(-1)[0]}
                                    </span>
                                </div>
                                <div className="w-48 h-px bg-gray-300 mx-auto mb-2" />
                                <p className="font-semibold text-gray-800 text-sm">{data.instructor}</p>
                                <p className="text-gray-400 text-xs">Course Instructor</p>
                            </div>
                            <div className="text-center">
                                <div className="h-14 flex items-center justify-center mb-2">
                                    <Award className="w-12 h-12 text-[#004aad]" />
                                </div>
                                <div className="w-48 h-px bg-gray-300 mx-auto mb-2" />
                                <p className="font-semibold text-gray-800 text-sm">Dr. Abdullah Hassan</p>
                                <p className="text-gray-400 text-xs">Dean, HSA Academy</p>
                            </div>
                        </div>

                        <div className="pt-4 space-y-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                                <Shield className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-gray-500">Certificate ID:</span>
                                <span className="font-mono font-bold text-gray-700 text-xs">{data.certificateId}</span>
                            </div>
                            <p className="text-xs text-gray-300">Issued on {data.issueDate}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleDownload}
                        className={`px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold text-base transition-all duration-300 ${downloaded
                            ? 'bg-emerald-500 text-white scale-95'
                            : 'bg-linear-to-r from-[#004aad] to-[#0062e6] text-white hover:shadow-[0_8px_30px_rgba(0,74,173,0.4)] hover:scale-105'
                            }`}
                    >
                        {downloaded
                            ? <><CheckCircle className="w-5 h-5" /> Downloaded!</>
                            : <><Download className="w-5 h-5" /> Download Certificate</>
                        }
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
                    <span>Verify at <span className="text-[#004aad] font-medium">{window.location.origin}/verify/{data.certificateId}</span></span>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
                        <button onClick={() => setShowShareModal(false)} className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                                { platform: 'LinkedIn', Icon: Linkedin, bg: 'bg-blue-700', light: 'bg-blue-50 hover:bg-blue-100' },
                                { platform: 'Facebook', Icon: Facebook, bg: 'bg-blue-600', light: 'bg-blue-50 hover:bg-blue-100' },
                                { platform: 'Twitter', Icon: Twitter, bg: 'bg-sky-500', light: 'bg-sky-50 hover:bg-sky-100' },
                                { platform: 'Email', Icon: Mail, bg: 'bg-gray-600', light: 'bg-gray-50 hover:bg-gray-100' },
                            ].map(({ platform,bg, light }) => (
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
                                onClick={() => navigator.clipboard?.writeText(certificateURL)}
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE — Routes to correct state based on API response
// ─────────────────────────────────────────────────────────────────────────────
const StudentCertificatePage = () => {
    // ── PRODUCTION: Replace mock with real API call ──────────────────────────
    // const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // useEffect(() => {
    //   fetch('/api/student/certificate', {
    //     headers: { Authorization: `Bearer ${yourAuthToken}` }
    //   })
    //     .then(r => r.json())
    //     .then(d => { setData(d); setLoading(false); });
    // }, []);
    // if (loading) return <div>Loading...</div>;
    // ────────────────────────────────────────────────────────────────────────

    const data = MOCK_API_RESPONSE;

    switch (data.certificateStatus) {
        case 'issued':  return <IssuedState data={data} />;
        case 'pending': return <PendingState data={data} />;
        case 'revoked': return <RevokedState data={data} />;
        case 'locked':
        default:        return <LockedState data={data} />;
    }
};

export default StudentCertificatePage;
