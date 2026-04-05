import React, { useState, useEffect, useCallback } from 'react';
import {
    UserPlus, Search, Shield, Power, Key, Trash2, Loader2, X, AlertCircle
} from 'lucide-react';
import {
    getAdmins,
    getAdminRoles,
    createAdmin,
    toggleAdminStatus,
    deleteAdmin,
    changeAdminPassword
} from "../../../../api/authApi";
import { notify } from "../../../../utils/toast";

const ManageAdminsPage = () => {
    const [admins, setAdmins] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: ''
    });

    const [newPassword, setNewPassword] = useState('');

    // ── Load Data ──────────────────────────────────────────────────
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [adminsData, rolesData] = await Promise.all([
                getAdmins(),
                getAdminRoles()
            ]);
            setAdmins(Array.isArray(adminsData) ? adminsData : adminsData?.data || []);
            setRoles(Array.isArray(rolesData) ? rolesData : rolesData?.data || []);
        } catch {
            notify.error("Failed to load staff data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ── Create Admin ───────────────────────────────────────────────
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.role_id) {
            return notify.error("Please fill all required fields");
        }

        setIsSubmitting(true);
        try {
            await createAdmin(formData);
            notify.success("New admin account created successfully");
            setShowCreateModal(false);
            setFormData({ name: '', email: '', password: '', role_id: '' });
            loadData();
        } catch (err) {
            notify.error(err.response?.data?.message || "Failed to create admin");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Toggle Status ──────────────────────────────────────────────
    const handleToggleStatus = async (adminId) => {
        try {
            await toggleAdminStatus(adminId);
            notify.success("Admin status updated");
            setAdmins(prev => prev.map(admin =>
                admin.id === adminId ? { ...admin, is_active: !admin.is_active } : admin
            ));
        } catch {
            notify.error("Failed to update status");
        }
    };

    // ── Delete Admin ───────────────────────────────────────────────
    const handleDelete = async (adminId, adminName) => {
        if (!window.confirm(`Are you sure you want to permanently delete ${adminName}?`)) return;

        try {
            await deleteAdmin(adminId);
            notify.success(`${adminName} has been deleted`);
            setAdmins(prev => prev.filter(a => a.id !== adminId));
        } catch {
            notify.error("Failed to delete admin account");
        }
    };

    // ── Change Password ────────────────────────────────────────────
    const openPasswordModal = (admin) => {
        setSelectedAdmin(admin);
        setNewPassword('');
        setShowPasswordModal(true);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            return notify.error("Password must be at least 6 characters");
        }

        setIsChangingPassword(true);
        try {
            await changeAdminPassword(selectedAdmin.id, { password: newPassword });
            notify.success(`Password for ${selectedAdmin.name} updated successfully`);
            setShowPasswordModal(false);
            setNewPassword('');
        } catch {
            notify.error("Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="">
            <div className="space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-[#004aad]" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-black">Manage Admins</h1>
                        </div>
                        <p className="text-gray-600">Add and manage dashboard administrators and their roles</p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#004aad] hover:bg-[#003a8f] text-white rounded-xl font-semibold transition-all shadow-md"
                    >
                        <UserPlus size={20} />
                        Add New Admin
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004aad] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Admin</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center">
                                            <Loader2 className="w-10 h-10 animate-spin text-[#004aad] mx-auto" />
                                            <p className="text-gray-500 mt-3">Loading administrators...</p>
                                        </td>
                                    </tr>
                                ) : filteredAdmins.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center text-gray-500">
                                            No administrators found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAdmins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-[#004aad]/10 text-[#004aad] rounded-2xl flex items-center justify-center font-bold text-xl">
                                                        {admin.name?.charAt(0) || 'A'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{admin.name}</p>
                                                        <p className="text-sm text-gray-500">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                                                    <Shield size={16} />
                                                    {admin.role?.name || "No Role Assigned"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <button
                                                    onClick={() => handleToggleStatus(admin.id)}
                                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${admin.is_active
                                                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                            : "bg-red-100 text-red-700 border border-red-200"
                                                        }`}
                                                >
                                                    <Power size={14} />
                                                    {admin.is_active ? "ACTIVE" : "INACTIVE"}
                                                </button>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openPasswordModal(admin)}
                                                        className="p-3 hover:bg-amber-50 text-amber-600 rounded-xl transition-colors"
                                                        title="Change Password"
                                                    >
                                                        <Key size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(admin.id, admin.name)}
                                                        className="p-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                                                        title="Delete Admin"
                                                    >
                                                        <Trash2 size={20} />
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
            </div>

            {/* ====================== CREATE ADMIN MODAL ====================== */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Add New Admin</h3>
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:border-[#004aad] focus:ring-1 outline-none"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:border-[#004aad] focus:ring-1 outline-none"
                                    placeholder="staff@academy.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Role</label>
                                <select
                                    required
                                    value={formData.role_id}
                                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:border-[#004aad] focus:ring-1 outline-none bg-white"
                                >
                                    <option value="">Select a role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Password</label>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:border-[#004aad] focus:ring-1 outline-none"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3.5 bg-[#004aad] hover:bg-[#003a8f] text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create Admin"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ====================== CHANGE PASSWORD MODAL ====================== */}
            {showPasswordModal && selectedAdmin && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Change Password</h3>
                            <button 
                                onClick={() => setShowPasswordModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword} className="p-6 space-y-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Changing password for <span className="font-semibold text-gray-900">{selectedAdmin.name}</span>
                                </p>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:border-[#004aad] focus:ring-1 outline-none"
                                    placeholder="Enter new password"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="flex-1 py-3.5 bg-[#004aad] hover:bg-[#003a8f] text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isChangingPassword ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAdminsPage;