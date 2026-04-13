import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar } from 'lucide-react';
import { notify } from '../../../utils/toast';

import {
    getAllEnrollments,
    getEnrollmentSummary,
} from '../../../api/courseApi';

const EnrollmentsPage = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('all');

    // Fetch Enrollments + Summary
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [enrollData, summaryData] = await Promise.all([
                    getAllEnrollments(),
                    getEnrollmentSummary().catch(() => null)
                ]);

                setEnrollments(enrollData?.enrollments || []);
                setSummary(summaryData);
            } catch (err) {
                console.error(err);
                notify.error('Failed to load enrollments. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter logic
    const filteredEnrollments = enrollments.filter(enrollment => {
        const user = enrollment.user || {};
        const course = enrollment.course || {};

        const matchesSearch = 
            (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.title || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterCourse === 'all' || course.title === filterCourse;

        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>;
            case 'expiring':
            case 'expiring_soon':
                return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Expiring Soon</span>;
            case 'expired':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Expired</span>;
            case 'completed':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Completed</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">{status || 'Unknown'}</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="">
            <div className="space-y-8">
                
                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1 sm:mb-2">Course Enrollments</h1>
                    <p className="text-gray-600">Track all student course enrollments and subscriptions</p>
                </div>

                {/* Summary Stats */}
                {summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white rounded-md p-6 border-l-4 border-blue-500">
                            <p className="text-sm text-gray-600">Total Enrollments</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{summary.total_enrollments || enrollments.length}</p>
                        </div>
                        <div className="bg-white rounded-md p-6 border-l-4 border-green-500">
                            <p className="text-sm text-gray-600">Active Enrollments</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{summary.active_enrollments || 0}</p>
                        </div>
                        <div className="bg-white rounded-md p-6 border-l-4 border-orange-500">
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{summary.completed_enrollments || 0}</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-md p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by student name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004aad] focus:outline-none transition-colors"
                            />
                        </div>
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:border-[#004aad] focus:outline-none transition-colors bg-white"
                        >
                            <option value="all">All Courses</option>
                            {[...new Set(enrollments.map(e => e.course?.title).filter(Boolean))].map(title => (
                                <option key={title} value={title}>{title}</option>
                            ))}
                        </select>
                        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-lg text-black">Student</th>
                                    <th className="px-6 py-4 text-left text-lg text-black">Course</th>
                                    <th className="px-6 py-4 text-left text-lg text-black">Plan</th>
                                    <th className="px-6 py-4 text-left text-lg text-black">Amount</th>
                                    <th className="px-6 py-4 text-left text-lg text-black">Enrolled</th>
                                    <th className="px-6 py-4 text-left text-lg text-black">Expires</th>
                                    <th className="px-6 py-4 text-left text-lg text-black">Progress</th>
                                    <th className="px-6 py-4 text-left text-lg text-black">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-16 text-center text-gray-500">
                                            Loading enrollments...
                                        </td>
                                    </tr>
                                ) : filteredEnrollments.length > 0 ? (
                                    filteredEnrollments.map((enrollment) => {
                                        const user = enrollment.user || {};
                                        const course = enrollment.course || {};
                                        return (
                                            <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-gray-900">{course.title}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-emerald-600">
                                                        {course.duration_months ? `${course.duration_months} Months` : '—'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        ₦{course.price?.toLocaleString() || '—'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(enrollment.enrolled_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(enrollment.completed_at) || '—'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-24">
                                                        <div className="flex items-center justify-between text-xs mb-1">
                                                            <span className="font-semibold">{enrollment.progress || 0}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-gradient h-2 rounded-full"
                                                                style={{ width: `${enrollment.progress || 0}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(enrollment.status)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-16 text-center text-gray-500">
                                            No enrollments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {filteredEnrollments.length} of {enrollments.length} enrollments
                        </p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">
                                1
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentsPage;