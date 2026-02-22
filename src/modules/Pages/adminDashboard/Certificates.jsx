import React, { useState, } from 'react';
import { Award, Download, Eye, CheckCircle, XCircle, Clock, Search, Filter, BookOpen, Sparkles, ChevronDown, X, Send, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
const initialStudents = [
    {
        id: 1,
        name: 'Halimatu Abdullahi',
        course: "Basic Qur'an Reading & Arabic",
        completionDate: 'January 31, 2027',
        duration: '12 Months',
        totalHours: '120 Hours',
        grade: 'Excellent',
        instructor: 'Sheikh Muhammad Tariq',
        status: 'pending', // pending | issued | revoked
        certificateId: null,
        progress: 100,
    },
    {
        id: 2,
        name: 'Ibrahim Yusuf',
        course: 'Tajweed Mastery',
        completionDate: 'February 10, 2027',
        duration: '6 Months',
        totalHours: '72 Hours',
        grade: 'Very Good',
        instructor: 'Ustadha Fatima Al-Noor',
        status: 'issued',
        certificateId: 'ZAD-2027-TJW-00135',
        progress: 100,
    },
    {
        id: 3,
        name: 'Aisha Bello',
        course: 'Islamic Studies Fundamentals',
        completionDate: null,
        duration: '9 Months',
        totalHours: '90 Hours',
        grade: null,
        instructor: 'Sheikh Abdul Kareem',
        status: 'in-progress',
        certificateId: null,
        progress: 67,
    },
    {
        id: 4,
        name: 'Musa Abdulrahman',
        course: 'Arabic Language Advanced',
        completionDate: 'December 20, 2026',
        duration: '18 Months',
        totalHours: '200 Hours',
        grade: 'Good',
        instructor: 'Dr. Aminata Diallo',
        status: 'revoked',
        certificateId: 'ZAD-2026-ALA-00098',
        progress: 100,
    },
    {
        id: 5,
        name: 'Zainab Umar',
        course: "Basic Qur'an Reading & Arabic",
        completionDate: 'February 14, 2027',
        duration: '12 Months',
        totalHours: '120 Hours',
        grade: 'Excellent',
        instructor: 'Sheikh Muhammad Tariq',
        status: 'pending',
        certificateId: null,
        progress: 100,
    },
];

const generateCertId = (course) => {
    const code = course.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3);
    const num = String(Math.floor(Math.random() * 90000) + 10000);
    return `ZAD-2027-${code}-${num}`;
};

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
    issued: { label: 'Issued', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    revoked: { label: 'Revoked', color: 'bg-red-100 text-red-700', icon: XCircle },
    'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Lock },
};

// ─── Certificate Preview Modal ────────────────────────────────────────────────
const CertificatePreviewModal = ({ student, onClose }) => {
    const certId = student.certificateId || 'ZAD-2027-PRV-PREVIEW';
    const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 relative my-8">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#004aad]" /> Certificate Preview
                </h2>

                {/* Certificate */}
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden p-10">
                    <div className="absolute inset-6 border-4 border-[#004aad] rounded-xl opacity-20 pointer-events-none"></div>
                    <div className="absolute inset-8 border-2 border-[#004aad] rounded-lg opacity-15 pointer-events-none"></div>

                    <div className="relative z-10 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-linear-to-br from-[#004aad] to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-[#004aad]">HALĪMATU SA'DIYYAH ISLAMIC ACADEMY</h2>
                        <p className="text-gray-500 text-sm">Islamic Education For All</p>
                        <div className="py-3">
                            <p className="text-lg text-gray-600 mb-1">This is to certify that</p>
                            <h3 className="text-4xl font-bold text-gray-900 my-3">{student.name}</h3>
                            <p className="text-lg text-gray-600 mb-3">has successfully completed</p>
                            <div className="inline-block border-2 border-[#004aad] rounded-xl px-6 py-3 mb-3">
                                <h4 className="text-xl font-bold text-gray-900">{student.course}</h4>
                            </div>
                            {student.grade && (
                                <p className="text-base text-gray-600">
                                    with a grade of <span className="font-bold text-[#004aad]">{student.grade}</span>
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200 text-sm">
                            <div>
                                <p className="text-gray-400 mb-1">Completion Date</p>
                                <p className="font-bold text-gray-800">{student.completionDate || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Duration</p>
                                <p className="font-bold text-gray-800">{student.duration}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Total Hours</p>
                                <p className="font-bold text-gray-800">{student.totalHours}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="text-center">
                                <span className="text-2xl font-bold text-gray-300 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                    {student.instructor.split(' ').pop()}
                                </span>
                                <div className="w-40 h-px bg-gray-300 mx-auto mt-2 mb-1"></div>
                                <p className="font-semibold text-gray-800 text-sm">{student.instructor}</p>
                                <p className="text-gray-400 text-xs">Course Instructor</p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <Award className="w-10 h-10 text-[#004aad]" />
                                </div>
                                <div className="w-40 h-px bg-gray-300 mx-auto mt-2 mb-1"></div>
                                <p className="font-semibold text-gray-800 text-sm">Dr. Abdullah Hassan</p>
                                <p className="text-gray-400 text-xs">Dean, HALĪMATU SA'DIYYAH ISlamic Academy</p>
                            </div>
                        </div>

                        <div className="pt-3">
                            <p className="text-xs text-gray-400">
                                Certificate ID: <span className="font-mono font-semibold text-gray-600">{certId}</span>
                            </p>
                            <p className="text-xs text-gray-300 mt-1">Issued on {issueDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Issue Confirm Modal ──────────────────────────────────────────────────────
const IssueModal = ({ student, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Issue Certificate?</h3>
            <p className="text-gray-500 mb-6">
                You are about to issue a certificate to <strong>{student.name}</strong> for completing <strong>{student.course}</strong>.
                This action will notify the student.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onConfirm(student.id)}
                    className="flex-1 py-3 bg-[#004aad] text-white rounded-xl hover:bg-[#003a8c] transition-colors font-semibold"
                >
                    Issue Certificate
                </button>
            </div>
        </div>
    </div>
);

// ─── Revoke Confirm Modal ─────────────────────────────────────────────────────
const RevokeModal = ({ student, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Revoke Certificate?</h3>
            <p className="text-gray-500 mb-6">
                This will revoke the certificate issued to <strong>{student.name}</strong>. The student will lose access to download or share it.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onConfirm(student.id)}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                    Revoke Certificate
                </button>
            </div>
        </div>
    </div>
);

// ─── Main Admin Page ──────────────────────────────────────────────────────────
const AdminCertificatePage = () => {
    const [students, setStudents] = useState(initialStudents);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [previewStudent, setPreviewStudent] = useState(null);
    const [issueTarget, setIssueTarget] = useState(null);
    const [revokeTarget, setRevokeTarget] = useState(null);

    const handleIssue = (id) => {
        setStudents(prev => prev.map(s =>
            s.id === id
                ? { ...s, status: 'issued', certificateId: generateCertId(s.course) }
                : s
        ));
        setIssueTarget(null);
    };

    const handleRevoke = (id) => {
        setStudents(prev => prev.map(s =>
            s.id === id ? { ...s, status: 'revoked' } : s
        ));
        setRevokeTarget(null);
    };

    const filtered = students.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.course.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || s.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: students.length,
        issued: students.filter(s => s.status === 'issued').length,
        pending: students.filter(s => s.status === 'pending').length,
        inProgress: students.filter(s => s.status === 'in-progress').length,
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-white px-6 py-4 mb-6 border-b border-gray-100">
                <h1 className="text-2xl mb-4">Certificate Management</h1>
                <p className="text-gray-500 text-sm">
                    <Link to="/admin" className="text-[#004aad] hover:underline">Dashboard</Link>
                    {' > '}Certificate Management
                </p>
            </div>

            <div className="pb-12">
                <div className="mx-auto space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Students', value: stats.total, color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
                            { label: 'Certificates Issued', value: stats.issued, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' },
                            { label: 'Pending Approval', value: stats.pending, color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
                            { label: 'In Progress', value: stats.inProgress, color: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
                        ].map(({ label, value, color, border }) => (
                            <div key={label} className={`bg-white rounded-2xl border ${border} p-5`}>
                                <p className="text-sm text-gray-500 mb-1">{label}</p>
                                <p className={`text-3xl font-bold ${color.split(' ')[1]}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search student or course..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {['all', 'pending', 'issued', 'revoked', 'in-progress'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${filterStatus === status
                                            ? 'bg-[#004aad] text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status === 'all' ? 'All' : status.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Student</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Course</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Progress</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Completion</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Certificate ID</th>
                                        <th className="text-center px-6 py-4 font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-12 text-gray-400">
                                                No students found.
                                            </td>
                                        </tr>
                                    ) : filtered.map((student, idx) => {
                                        const cfg = statusConfig[student.status];
                                        const StatusIcon = cfg.icon;
                                        return (
                                            <tr key={student.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-[#004aad] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate">{student.course}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-24">
                                                            <div
                                                                className="h-full rounded-full bg-[#004aad] transition-all"
                                                                style={{ width: `${student.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-medium">{student.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {student.completionDate || <span className="text-gray-300 italic">Not yet</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {student.certificateId
                                                        ? <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{student.certificateId}</span>
                                                        : <span className="text-gray-300 text-xs italic">—</span>
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {/* Preview — always available */}
                                                        <button
                                                            onClick={() => setPreviewStudent(student)}
                                                            title="Preview Certificate"
                                                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {/* Issue — only for pending + 100% */}
                                                        {student.status === 'pending' && student.progress === 100 && (
                                                            <button
                                                                onClick={() => setIssueTarget(student)}
                                                                title="Issue Certificate"
                                                                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                                                            >
                                                                <Send className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Revoke — only for issued */}
                                                        {student.status === 'issued' && (
                                                            <button
                                                                onClick={() => setRevokeTarget(student)}
                                                                title="Revoke Certificate"
                                                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* In Progress — disabled */}
                                                        {student.status === 'in-progress' && (
                                                            <span title="Student has not completed the course yet" className="p-2 rounded-lg bg-gray-100 text-gray-300 cursor-not-allowed">
                                                                <Lock className="w-4 h-4" />
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                            <span>Showing {filtered.length} of {students.length} students</span>
                            <span className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-gray-400" /> Cannot issue until course completed</span>
                            </span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#004aad]" /> Actions Guide
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                                <div className="p-1.5 bg-blue-50 rounded-lg mt-0.5"><Eye className="w-4 h-4 text-blue-600" /></div>
                                <div><strong>Preview</strong> — View the certificate pattern for any student at any stage.</div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="p-1.5 bg-emerald-50 rounded-lg mt-0.5"><Send className="w-4 h-4 text-emerald-600" /></div>
                                <div><strong>Issue</strong> — Only available when a student has completed 100% of the course and status is Pending.</div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="p-1.5 bg-red-50 rounded-lg mt-0.5"><XCircle className="w-4 h-4 text-red-600" /></div>
                                <div><strong>Revoke</strong> — Revoke an already issued certificate; student will lose access immediately.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {previewStudent && (
                <CertificatePreviewModal student={previewStudent} onClose={() => setPreviewStudent(null)} />
            )}
            {issueTarget && (
                <IssueModal student={issueTarget} onConfirm={handleIssue} onClose={() => setIssueTarget(null)} />
            )}
            {revokeTarget && (
                <RevokeModal student={revokeTarget} onConfirm={handleRevoke} onClose={() => setRevokeTarget(null)} />
            )}
        </>
    );
};

export default AdminCertificatePage;
