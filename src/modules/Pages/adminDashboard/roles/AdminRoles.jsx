import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Download, Eye, Edit, Trash2, 
  Plus, ShieldCheck, Calendar, Loader2, X, AlertTriangle, Lock 
} from 'lucide-react';

import { getAdminRoles, createAdminRole, updateAdminRole, deleteAdminRole } from "../../../../api/authApi";
import { notify } from "../../../../utils/toast";

const AdminRolesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [selectedRole, setSelectedRole] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newRoleName, setNewRoleName] = useState('');
  const [editRoleName, setEditRoleName] = useState('');

  // Fetch Roles
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminRoles();
      // Handle different API response structures
      setRoles(Array.isArray(data) ? data : data?.data || []);
    } catch {
      notify.error("Failed to load roles from server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Create Role
  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return notify.error("Role name is required");

    setIsCreating(true);
    try {
      await createAdminRole(newRoleName.trim());
      notify.success(`Role "${newRoleName}" created successfully`);
      setNewRoleName('');
      setShowCreateModal(false);
      fetchRoles();
    } catch (err) {
      notify.error(err.response?.data?.message || "Could not create role");
    } finally {
      setIsCreating(false);
    }
  };

  // Update Role
  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!editRoleName.trim() || !selectedRole) return;

    setIsUpdating(true);
    try {
      await updateAdminRole(selectedRole.id, { name: editRoleName.trim() });
      notify.success(`Role updated successfully`);
      setIsEditModalOpen(false);
      fetchRoles();
    } catch (err) {
      notify.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Role
  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    setIsDeleting(true);
    try {
      await deleteAdminRole(selectedRole.id);
      notify.success(`Role "${selectedRole.name}" has been deleted`);
      setIsDeleteModalOpen(false);
      fetchRoles();
    } catch {
      notify.error("Failed to delete role");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal Handlers
  const openViewModal = (role) => { setSelectedRole(role); setIsViewModalOpen(true); };
  const openEditModal = (role) => { setSelectedRole(role); setEditRoleName(role.name); setIsEditModalOpen(true); };
  const openDeleteModal = (role) => { setSelectedRole(role); setIsDeleteModalOpen(true); };

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#004aad]" />
              <h1 className="text-2xl sm:text-3xl font-bold text-black">Admin Roles</h1>
            </div>
            <p className="text-gray-600">Manage administrative access levels and system roles</p>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-[#004aad] hover:bg-[#003a8f] cursor-pointer text-white rounded-sm text-sm flex items-center justify-center gap-2 transition-all "
          >
            <Plus className="w-5 h-5" />
            New Role
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-md p-6 border border-gray-100 ">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-md outline-none transition-all"
              />
            </div>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-md overflow-hidden border border-gray-100 ">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Role Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Permissions</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Created Date</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-[#004aad]" />
                        <p className="text-gray-400">Syncing with database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-gray-500">No roles found</td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#004aad]/10 text-[#004aad] rounded-xl flex items-center justify-center font-bold text-lg">
                            {role.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{role.name}</p>
                            <p className="text-xs text-gray-400 font-mono">ID: {role.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => navigate(`/admin/roles/${role.id}/permissions`)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#004aad] rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100 cursor-pointer"
                        >
                          <Lock size={12} /> Manage Permissions
                        </button>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {role.created_at ? new Date(role.created_at).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openViewModal(role)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Eye size={18} /></button>
                          <button onClick={() => openEditModal(role)} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"><Edit size={18} /></button>
                          <button onClick={() => openDeleteModal(role)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 size={18} /></button>
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

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">Create New Role</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateRole} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Instructor"
                  className="w-full p-4 border border-gray-200 rounded-md outline-none focus:border-[#004aad]"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3.5 bg-gray-100 rounded-sm text-sm">Cancel</button>
                <button type="submit" disabled={isCreating} className="flex-1 py-3.5 bg-[#004aad] text-white rounded-sm text-sm flex items-center justify-center gap-2">
                  {isCreating ? <Loader2 className="animate-spin" size={20} /> : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">Role Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-[#004aad] text-white rounded-lg flex items-center justify-center font-bold text-xl">
                    {selectedRole.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedRole.name}</h4>
                    <p className="text-sm text-gray-500">ID: {selectedRole.id}</p>
                  </div>
               </div>
               <div className="flex justify-between items-center text-sm px-2">
                 <span className="text-gray-500">Date Created</span>
                 <span className="font-medium">{new Date(selectedRole.created_at).toLocaleDateString()}</span>
               </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2 bg-white border border-gray-200 rounded-md text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Role</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleUpdateRole} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                <input
                  type="text"
                  value={editRoleName}
                  onChange={(e) => setEditRoleName(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-md focus:border-[#004aad] outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 rounded-sm text-sm">Cancel</button>
                <button type="submit" disabled={isUpdating} className="flex-1 py-3.5 bg-[#004aad] text-white rounded-sm text-sm flex items-center justify-center">
                  {isUpdating ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && selectedRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl text-center p-8">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-8">This will permanently delete the <span className="font-bold text-gray-800">"{selectedRole.name}"</span> role. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-md text-sm font-bold">Cancel</button>
              <button onClick={handleDeleteRole} disabled={isDeleting} className="flex-1 py-3 bg-red-600 text-white rounded-md text-sm font-bold flex items-center justify-center">
                {isDeleting ? <Loader2 className="animate-spin" size={20} /> : "Delete Role"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminRolesPage;