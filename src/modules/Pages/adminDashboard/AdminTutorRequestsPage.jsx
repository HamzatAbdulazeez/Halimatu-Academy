/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, Eye, UserCheck, XCircle, Trash2, Calendar, Mail, Phone, BookOpen } from 'lucide-react';
import { notify } from '../../../utils/toast';

import {
    getAllTutorRequests,
    getTutorRequestsStats,
    updateTutorRequestStatus,
    deleteTutorRequest,
} from '../../../api/tutorApi';

const AdminTutorRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [requestsData, statsData] = await Promise.all([
                    getAllTutorRequests(),
                    getTutorRequestsStats().catch(() => ({}))
                ]);

                setRequests(requestsData?.requests || requestsData || []);
                setStats(statsData);
            } catch (err) {
                console.error(err);
                notify.error('Failed to load tutor requests');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter
    const filteredRequests = requests.filter(req => {
        const name = (req.full_name || '').toLowerCase();
        const email = (req.email || '').toLowerCase();
        const subject = (req.subject || '').toLowerCase();

        const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                             email.includes(searchTerm.toLowerCase()) ||
                             subject.includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || req.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            await updateTutorRequestStatus(requestId, newStatus);
            setRequests(prev => prev.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            ));
            notify.success(`Request updated to ${newStatus}`);
        } catch (err) {
            notify.error('Failed to update status');
        }
    };

    const handleDelete = async (requestId) => {
        if (!window.confirm('Delete this tutor request permanently?')) return;

        try {
            await deleteTutorRequest(requestId);
            setRequests(prev => prev.filter(req => req.id !== requestId));
            notify.success('Tutor request deleted successfully');
        } catch (err) {
            notify.error('Failed to delete request');
        }
    };

    const openDetail = (req) => {
        setSelectedRequest(req);
        setShowDetailModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pending</span>;
            case 'approved':
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Approved</span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">Tutor Requests</h1>
                <p className="text-gray-500 text-sm mt-1">Manage all private tutor requests from students</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Total Requests</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total || requests.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending || 0}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.approved || 0}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 py-3 border border-gray-200 rounded-xl focus:border-[#004aad] focus:outline-none"
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-5 py-3 border border-gray-200 rounded-xl focus:border-[#004aad]"
                    >
                        <option value="all">All Requests</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Student</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Subject</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Level</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Requested On</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="py-12 text-center text-gray-500">Loading tutor requests...</td></tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-gray-500">No tutor requests found</td></tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="font-medium text-gray-900">{req.full_name}</p>
                                                <p className="text-sm text-gray-500">{req.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-700">{req.subject}</td>
                                        <td className="px-6 py-5 text-gray-600">{req.student_level || '—'}</td>
                                        <td className="px-6 py-5 text-gray-600">
                                            {req.created_at ? new Date(req.created_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(req.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => openDetail(req)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {req.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req.id, 'approved')}
                                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                        >
                                                            <UserCheck size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req.id, 'rejected')}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(req.id)}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="px-8 py-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">Tutor Request Details</h2>
                            <button 
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div>
                                <h3 className="text-sm text-gray-500 mb-1">Student Name</h3>
                                <p className="text-xl font-semibold">{selectedRequest.full_name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm text-gray-500 mb-1">Email</h3>
                                    <p className="font-medium">{selectedRequest.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm text-gray-500 mb-1">Phone</h3>
                                    <p className="font-medium">{selectedRequest.phone || '—'}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500 mb-1">Subject / Topic</h3>
                                <p className="font-medium text-lg">{selectedRequest.subject}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500 mb-1">Student Level</h3>
                                <p className="font-medium">{selectedRequest.student_level || 'Not specified'}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500 mb-1">Preferred Schedule</h3>
                                <p className="font-medium">{selectedRequest.preferred_schedule || 'Not specified'}</p>
                            </div>

                            <div>
                                <h3 className="text-sm text-gray-500 mb-2">Message</h3>
                                <div className="bg-gray-50 p-5 rounded-2xl text-gray-700 leading-relaxed">
                                    {selectedRequest.message || 'No additional message provided.'}
                                </div>
                            </div>

                            <div className="pt-4 border-t flex gap-3">
                                {selectedRequest.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleStatusUpdate(selectedRequest.id, 'approved');
                                                setShowDetailModal(false);
                                            }}
                                            className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700 transition"
                                        >
                                            Approve Request
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleStatusUpdate(selectedRequest.id, 'rejected');
                                                setShowDetailModal(false);
                                            }}
                                            className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 transition"
                                        >
                                            Reject Request
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTutorRequestsPage;