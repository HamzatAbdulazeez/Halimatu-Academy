import React, { useState, useRef } from 'react';
import { Award, Download, Share2, BookOpen, Sparkles, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';

const CertificatePage = () => {
    const [showShareModal, setShowShareModal] = useState(false);
    const certificateRef = useRef(null);

    const certificateData = {
        studentName: 'Halimatu Abdullahi',
        courseName: "Basic Qur'an Reading & Arabic",
        completionDate: 'January 31, 2027',
        issueDate: 'February 5, 2027',
        certificateId: 'ZAD-2027-QRA-00142',
        instructor: 'Sheikh Muhammad Tariq',
        grade: 'Excellent',
        duration: '12 Months',
        totalHours: '120 Hours'
    };

    // Download certificate as PDF
    const handleDownload = async () => {
        if (!certificateRef.current) return;
        const canvas = await html2canvas(certificateRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${certificateData.studentName}-Certificate.pdf`);
    };

    const certificateURL = `${window.location.origin}/verify/${certificateData.certificateId}`;

    // Social sharing
    const handleShare = (platform) => {
        const text = encodeURIComponent(`I just completed ${certificateData.courseName} at HSA Academy! Check my certificate: ${certificateURL}`);
        let shareURL = '';

        switch (platform) {
            case 'LinkedIn':
                shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateURL)}`;
                break;
            case 'Facebook':
                shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateURL)}`;
                break;
            case 'Twitter':
                shareURL = `https://twitter.com/intent/tweet?text=${text}`;
                break;
            case 'Email':
                shareURL = `mailto:?subject=My Certificate Achievement&body=${text}`;
                break;
            default:
                return;
        }

        window.open(shareURL, '_blank');
        setShowShareModal(false);
    };

    return (
        <>
            <div className="bg-white px-6 py-4 mb-6">
                <h1 className="text-2xl font-medium mb-3">Certificate</h1>
                <p className="text-gray-500">
                    <Link to="/student" className="text-[#004aad] hover:underline">
                        Dashboard
                    </Link>{" "}
                    &gt; Certificate
                </p>
            </div>
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-xl rounded-md border border-[#004aad]">
                            <Sparkles className="w-5 h-5 text-[#004aad] animate-pulse" />
                            <span className="text-sm text-[#004aad] tracking-wider uppercase">Certificate of Completion</span>
                        </div>
                        <h1 className="text-4xl font-bold text-black">Your Achievement</h1>
                        <p className="text-base text-black max-w-2xl mx-auto">
                            Congratulations on completing your course! Download and share your certificate
                        </p>
                    </div>

                    {/* Certificate Display */}
                    <div ref={certificateRef} className="relative bg-white rounded-3xl shadow-2xl overflow-hidden p-12 md:p-16">
                        {/* Border & Decorations */}
                        <div className="absolute inset-8 border-4 border-[#004aad] rounded-2xl opacity-20"></div>
                        <div className="absolute inset-10 border-2 border-[#004aad] rounded-xl opacity-30"></div>
                        <div className="relative z-10 text-center space-y-6">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-gradient rounded-full flex items-center justify-center shadow-xl">
                                    <BookOpen className="w-10 h-10 text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-6xl font-bold bg-gradient from-[#004aad] to-teal-600 bg-clip-text text-transparent mb-2">HSA Academy</h2>
                            <p className="text-gray-600 text-lg">Islamic Education For All</p>

                            <div className="py-4">
                                <p className="text-2xl text-gray-700 mb-2">This is to certify that</p>
                                <h3 className="text-4xl md:text-6xl font-bold text-gray-900 my-4">{certificateData.studentName}</h3>
                                <p className="text-2xl text-gray-700 mb-6">has successfully completed</p>
                                <div className="inline-block bg-white border-1 border-[#004aad] rounded-2xl px-8 py-4 mb-6">
                                    <h4 className="text-2xl md:text-3xl font-bold text-black">{certificateData.courseName}</h4>
                                </div>
                                <p className="text-lg text-gray-600 mb-4">
                                    with a grade of <span className="font-bold text-[#004aad]">{certificateData.grade}</span>
                                </p>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-b border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Completion Date</p>
                                    <p className="font-bold text-gray-900">{certificateData.completionDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Duration</p>
                                    <p className="font-bold text-gray-900">{certificateData.duration}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Hours</p>
                                    <p className="font-bold text-gray-900">{certificateData.totalHours}</p>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                                <div className="text-center">
                                    <div className="mb-3">
                                        <div className="w-48 h-16 mx-auto mb-2 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-gray-400" style={{ fontFamily: 'cursive' }}>M. Tariq</span>
                                        </div>
                                        <div className="w-48 h-px bg-gray-400 mx-auto"></div>
                                    </div>
                                    <p className="font-semibold text-gray-900">{certificateData.instructor}</p>
                                    <p className="text-sm text-gray-500">Course Instructor</p>
                                </div>
                                <div className="text-center">
                                    <div className="mb-3">
                                        <div className="w-48 h-16 mx-auto mb-2 flex items-center justify-center">
                                            <Award className="w-12 h-12 text-[#004aad]" />
                                        </div>
                                        <div className="w-48 h-px bg-gray-400 mx-auto"></div>
                                    </div>
                                    <p className="font-semibold text-gray-900">Dr. Abdullah Hassan</p>
                                    <p className="text-sm text-gray-500">Dean, HSA Academy</p>
                                </div>
                            </div>

                            <div className="pt-6">
                                <p className="text-sm text-gray-500">
                                    Certificate ID: <span className="font-mono font-semibold text-gray-700">{certificateData.certificateId}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-2">Issued on {certificateData.issueDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleDownload}
                            className="px-8 py-4 bg-gradient text-white cursor-pointer rounded-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Download Certificate
                        </button>
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="px-8 py-4 bg-white border border-[#004aad] cursor-pointer text-[#004aad] rounded-md hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-5 h-5" />
                            Share Certificate
                        </button>
                    </div>

                    {/* Share Modal */}
                    {showShareModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    ✕
                                </button>

                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Share2 className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Achievement</h3>
                                    <p className="text-gray-600">Let others know about your accomplishment!</p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleShare('LinkedIn')}
                                        className="w-full flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                                            <Linkedin className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-gray-900">Share on LinkedIn</span>
                                    </button>

                                    <button
                                        onClick={() => handleShare('Facebook')}
                                        className="w-full flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <Facebook className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-gray-900">Share on Facebook</span>
                                    </button>

                                    <button
                                        onClick={() => handleShare('Twitter')}
                                        className="w-full flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                                            <Twitter className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-gray-900">Share on Twitter</span>
                                    </button>

                                    <button
                                        onClick={() => handleShare('Email')}
                                        className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-gray-900">Share via Email</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CertificatePage;
