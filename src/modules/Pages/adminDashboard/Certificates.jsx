import React, { useState, useEffect } from 'react';
import { Award, Eye, CheckCircle, XCircle, Clock, Search, BookOpen, Sparkles, X, Send, Lock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notify } from '../../../utils/toast';

import {
    getAllCertificates,
    getCertificateStats,
    getPendingCertificates,
    getIssuedCertificates,
    getRevokedCertificates,
    issueCertificate,
    revokeCertificate,
    deleteCertificate,
} from '../../../api/courseApi';

const AdminCertificatePage = () => {
    const [certificates, setCertificates] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [previewCert, setPreviewCert] = useState(null);
    const [issueTarget, setIssueTarget] = useState(null);
    const [revokeTarget, setRevokeTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Fetch Certificates based on filter
    useEffect(() => {
        const fetchCertificates = async () => {
            setLoading(true);
            try {
                let data;
                if (filterStatus === 'pending') {
                    data = await getPendingCertificates();
                } else if (filterStatus === 'issued') {
                    data = await getIssuedCertificates();
                } else if (filterStatus === 'revoked') {
                    data = await getRevokedCertificates();
                } else {
                    data = await getAllCertificates();
                }

                setCertificates(data?.certificates || data || []);

                // Load stats
                const statsData = await getCertificateStats().catch(() => ({}));
                setStats(statsData);
            } catch  {
                console.error("Certificate fetch error:",);
                notify.error('Failed to load certificates');
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [filterStatus]);

    // Search filter
    const filtered = certificates.filter(cert => {
        const name = (cert.user?.name || cert.student_name || '').toLowerCase();
        const course = (cert.course?.title || '').toLowerCase();
        return name.includes(search.toLowerCase()) || course.includes(search.toLowerCase());
    });

    const handleIssue = async (id) => {
        try {
            await issueCertificate(id);
            setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: 'issued' } : c));
            notify.success('Certificate issued successfully!');
            setIssueTarget(null);
        } catch  {
            notify.error('Failed to issue certificate');
        }
    };

    const handleRevoke = async (id) => {
        try {
            await revokeCertificate(id);
            setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: 'revoked' } : c));
            notify.success('Certificate revoked successfully');
            setRevokeTarget(null);
        } catch  {
            notify.error('Failed to revoke certificate');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCertificate(id);
            setCertificates(prev => prev.filter(c => c.id !== id));
            notify.success('Certificate deleted successfully');
            setDeleteTarget(null);
        } catch  {
            notify.error('Failed to delete certificate');
        }
    };

    const statusConfig = {
        pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
        issued: { label: 'Issued', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
        revoked: { label: 'Revoked', color: 'bg-red-100 text-red-700', icon: XCircle },
        'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Lock },
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-white px-6 py-4 mb-6 border-b border-gray-100">
                <h1 className="text-2xl mb-4">Certificate Management</h1>
                <p className="text-gray-500 text-sm">
                    <Link to="/admin" className="text-[#004aad] hover:underline">Dashboard</Link> › Certificate Management
                </p>
            </div>

            <div className="pb-12">
                <div className="mx-auto space-y-6">

                    {/* Your Original Stats Design */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Certificates', value: stats.total || certificates.length, color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
                            { label: 'Certificates Issued', value: stats.issued || 0, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' },
                            { label: 'Pending Approval', value: stats.pending || 0, color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
                            { label: 'Revoked', value: stats.revoked || 0, color: 'bg-red-50 text-red-700', border: 'border-red-200' },
                        ].map(({ label, value, color, border }, i) => (
                            <div key={i} className={`bg-white rounded-2xl border ${border} p-5`}>
                                <p className="text-sm text-gray-500 mb-1">{label}</p>
                                <p className={`text-3xl font-bold ${color.split(' ')[1]}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters  */}
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

                            {/* Filter Buttons */}
                            <div className="flex gap-2 flex-wrap">
                                {['all', 'pending', 'issued', 'revoked', 'in-progress'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                                            filterStatus === status 
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
                                    {loading ? (
                                        <tr><td colSpan={7} className="py-12 text-center text-gray-400">Loading certificates...</td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={7} className="py-12 text-center text-gray-400">No certificates found</td></tr>
                                    ) : (
                                        filtered.map((cert, idx) => {
                                            const cfg = statusConfig[cert.status] || statusConfig.pending;
                                            const StatusIcon = cfg.icon;
                                            return (
                                                <tr key={cert.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-[#004aad] text-white flex items-center justify-center font-bold text-sm">
                                                                {(cert.user?.name || '').split(' ').map(n => n[0]).join('').slice(0,2)}
                                                            </div>
                                                            <span className="font-medium text-gray-900">{cert.user?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 max-w-45 truncate">{cert.course?.title}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-24">
                                                                <div className="h-full rounded-full bg-[#004aad]" style={{width: `${cert.progress || 0}%`}} />
                                                            </div>
                                                            <span className="text-xs text-gray-500 font-medium">{cert.progress || 0}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {cert.completion_date ? new Date(cert.completion_date).toLocaleDateString() : '—'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {cfg.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                                        {cert.certificate_id || '—'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => setPreviewCert(cert)} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600" title="Preview">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            {cert.status === 'pending' && (
                                                                <button onClick={() => setIssueTarget(cert)} className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600" title="Issue">
                                                                    <Send className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {cert.status === 'issued' && (
                                                                <button onClick={() => setRevokeTarget(cert)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600" title="Revoke">
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => setDeleteTarget(cert)} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500" title="Delete">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {previewCert && <CertificatePreviewModal student={previewCert} onClose={() => setPreviewCert(null)} />}
            {issueTarget && <IssueModal student={issueTarget} onConfirm={handleIssue} onClose={() => setIssueTarget(null)} />}
            {revokeTarget && <RevokeModal student={revokeTarget} onConfirm={handleRevoke} onClose={() => setRevokeTarget(null)} />}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                        <h3 className="text-xl font-bold mb-4">Delete Certificate?</h3>
                        <p className="text-gray-500 mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border rounded-xl">Cancel</button>
                            <button onClick={() => handleDelete(deleteTarget.id)} className="flex-1 py-3 bg-red-600 text-white rounded-xl">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminCertificatePage;