/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notify } from '../../../utils/toast';

import {
    getAllContactMessages,
    getContactMessagesStats,
    updateContactMessageStatus,
    deleteContactMessage,
} from '../../../api/contactApi';

const AdminContactMessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [messagesData, statsData] = await Promise.all([
                    getAllContactMessages(),
                    getContactMessagesStats().catch(() => ({}))
                ]);

                setMessages(messagesData?.messages || messagesData || []);
                setStats(statsData);
            } catch (err) {
                console.error(err);
                notify.error('Failed to load contact messages');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter
    const filteredMessages = messages.filter(msg => {
        const name = (msg.full_name || msg.name || '').toLowerCase();
        const email = (msg.email || '').toLowerCase();
        const subject = (msg.subject || '').toLowerCase();

        const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                             email.includes(searchTerm.toLowerCase()) ||
                             subject.includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || msg.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const handleStatusUpdate = async (messageId, newStatus) => {
        try {
            await updateContactMessageStatus(messageId, newStatus);
            setMessages(prev => prev.map(msg =>
                msg.id === messageId ? { ...msg, status: newStatus } : msg
            ));
            notify.success(`Message marked as ${newStatus}`);
        } catch (err) {
            notify.error('Failed to update status');
        }
    };

    const handleDelete = async (messageId) => {
        if (!window.confirm('Delete this contact message?')) return;

        try {
            await deleteContactMessage(messageId);
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
            notify.success('Message deleted successfully');
        } catch (err) {
            notify.error('Failed to delete message');
        }
    };

    const openDetail = (msg) => {
        setSelectedMessage(msg);
        setShowDetailModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'unread':
                return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Unread</span>;
            case 'read':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Read</span>;
            case 'replied':
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Replied</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{status || 'New'}</span>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Contact Messages</h1>
                <p className="text-gray-500 text-sm mt-1">Manage all messages received from the contact form</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Total Messages</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total || messages.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Unread</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.unread || 0}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-500">Replied</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.replied || 0}</p>
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
                        <option value="all">All Messages</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Subject</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="py-12 text-center text-gray-500">Loading messages...</td></tr>
                            ) : filteredMessages.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-gray-500">No contact messages found</td></tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <tr key={msg.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-5 font-medium">{msg.full_name}</td>
                                        <td className="px-6 py-5 text-gray-600">{msg.email}</td>
                                        <td className="px-6 py-5 text-gray-700">{msg.subject}</td>
                                        <td className="px-6 py-5 text-gray-600">
                                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(msg.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => openDetail(msg)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {msg.status === 'unread' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(msg.id, 'read')}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                                    >
                                                        Mark as Read
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(msg.id)}
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
            {showDetailModal && selectedMessage && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="px-8 py-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Contact Message Detail</h2>
                            <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{selectedMessage.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{selectedMessage.email}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Subject</p>
                                <p className="font-medium text-lg">{selectedMessage.subject}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Message</p>
                                <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 leading-relaxed">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        handleStatusUpdate(selectedMessage.id, 'read');
                                        setShowDetailModal(false);
                                    }}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-2xl"
                                >
                                    Mark as Read
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedMessage.id);
                                        setShowDetailModal(false);
                                    }}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-2xl"
                                >
                                    Delete Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContactMessagesPage;