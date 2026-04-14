import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, UserPlus, Search, Edit, Key, Trash2, Eye, Loader2, X
} from 'lucide-react';

import {
  getAdmins,
  getAdminRoles,
  createAdmin,
  updateAdmin,          
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: ''
  });

  const [passwordData, setPasswordData] = useState({
    password: ''
  });

  // Load Admins + Roles
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [adminsRes, rolesRes] = await Promise.all([
        getAdmins(),
        getAdminRoles()
      ]);

      setAdmins(Array.isArray(adminsRes) ? adminsRes : adminsRes?.data || []);
      setRoles(Array.isArray(rolesRes) ? rolesRes : rolesRes?.data || []);
    } catch (err) {
      notify.error("Failed to load administrators");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create New Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createAdmin(formData);
      notify.success("New admin created successfully");
      setShowCreateModal(false);
      setFormData({ name: '', email: '', role_id: '' });
      loadData();
    } catch (err) {
      notify.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Admin (including role assignment)
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    setIsUpdating(true);
    try {
      await updateAdmin(selectedAdmin.id, {
        name: formData.name,
        email: formData.email,
        role_id: formData.role_id
      });
      notify.success("Admin updated successfully");
      setShowEditModal(false);
      loadData();
    } catch (err) {
      notify.error(err.response?.data?.message || "Failed to update admin");
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (adminId) => {
    try {
      await toggleAdminStatus(adminId);
      notify.success("Status updated");
      setAdmins(prev => prev.map(admin =>
        admin.id === adminId ? { ...admin, is_active: !admin.is_active } : admin
      ));
    } catch (err) {
      notify.error("Failed to update status");
    }
  };

  // Delete Admin
  const handleDelete = async (adminId, adminName) => {
    if (!window.confirm(`Delete ${adminName}? This action cannot be undone.`)) return;

    try {
      await deleteAdmin(adminId);
      notify.success(`${adminName} deleted successfully`);
      setAdmins(prev => prev.filter(a => a.id !== adminId));
    } catch (err) {
      notify.error("Failed to delete admin");
    }
  };

  // Open Edit Modal (with pre-filled data)
  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      role_id: admin.role_id || admin.role?.id || ''
    });
    setShowEditModal(true);
  };

  // Open Password Modal
  const openPasswordModal = (admin) => {
    setSelectedAdmin(admin);
    setPasswordData({ password: '' });
    setShowPasswordModal(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.password || passwordData.password.length < 6) {
      return notify.error("Password must be at least 6 characters");
    }

    setIsChangingPassword(true);
    try {
      await changeAdminPassword(selectedAdmin.id, { password: passwordData.password });
      notify.success(`Password changed for ${selectedAdmin.name}`);
      setShowPasswordModal(false);
    } catch (err) {
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
              <h1 className="text-3xl font-bold text-black">Manage Admins</h1>
            </div>
            <p className="text-gray-600 mt-1">Add, edit and manage system administrators</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#004aad] hover:bg-[#003a8f] text-white rounded-xl font-semibold transition-all"
          >
            <UserPlus size={20} />
            Add New Admin
          </button>
        </div>

        {/* Search/Filter */}
        <div className="bg-white rounded-md p-6 border border-gray-100">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004aad] focus:outline-none"
            />
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-md overflow-hidden border border-gray-100">
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
                    </td>
                  </tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-gray-500">No administrators found</td>
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
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 rounded-2xl text-sm">
                          <Shield size={16} />
                          {admin.role?.name || "No Role"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => handleToggleStatus(admin.id)}
                          className={`px-4 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                            admin.is_active 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {admin.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(admin)}
                            className="p-3 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"
                            title="Edit Admin & Assign Role"
                          >
                            <Edit size={20} />
                          </button>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Add New Admin</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-[#004aad]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-[#004aad]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assign Role</label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-[#004aad] bg-white"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Initial Password</label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-[#004aad]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 border rounded-2xl font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#004aad] text-white rounded-2xl font-semibold hover:bg-[#003a8f] disabled:opacity-70">
                  {isSubmitting ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================== EDIT ADMIN MODAL (Role Assignment) ====================== */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Edit Admin</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateAdmin} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-[#004aad]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-[#004aad]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assign Role</label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-[#004aad] bg-white"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 border rounded-2xl font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating} className="flex-1 py-4 bg-[#004aad] text-white rounded-2xl font-semibold hover:bg-[#003a8f] disabled:opacity-70">
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================== CHANGE PASSWORD MODAL ====================== */}
      {showPasswordModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-6">
              <div>
                <p className="mb-4 text-gray-600">
                  Changing password for <span className="font-semibold">{selectedAdmin.name}</span>
                </p>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData({ password: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-[#004aad]"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-4 border rounded-2xl font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isChangingPassword} className="flex-1 py-4 bg-[#004aad] text-white rounded-2xl font-semibold hover:bg-[#003a8f] disabled:opacity-70">
                  {isChangingPassword ? "Updating..." : "Update Password"}
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