import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ChevronLeft, 
  Save, 
  Loader2, 
  Search 
} from 'lucide-react';

import { 
  getAllPermissions, 
  getRolePermissions, 
  assignPermissionsToRole,
  getAdminRoles 
} from "../../../../api/authApi";
import { notify } from "../../../../utils/toast";

const RolePermissions = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  
  const [roleName, setRoleName] = useState("");
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ── Load Data ──────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Get role name
      const roles = await getAdminRoles();
      const currentRole = roles.find(r => r.id.toString() === roleId);
      if (currentRole) setRoleName(currentRole.name);

      // Get all permissions
      const masterList = await getAllPermissions();
      setAllPermissions(Array.isArray(masterList) ? masterList : []);

      // Get current role permissions
      const activePermissions = await getRolePermissions(roleId);
      setSelectedIds(activePermissions.map(p => p.id));
      
    } catch (err) {
      notify.error("Failed to load permission data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Toggle Permission ───────────────────────────────────────────
  const handleToggle = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // ── Save Changes ───────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await assignPermissionsToRole(roleId, selectedIds);
      notify.success("Permissions updated successfully!");
      navigate('/admin/roles');
    } catch {
      notify.error("Failed to update permissions");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter permissions
  const filteredPermissions = allPermissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-[#004aad]" />
        <p className="text-gray-500 mt-4 font-medium">Loading permissions...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/roles')}
              className="p-3 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[#004aad]" />
                <h1 className="text-2xl font-bold text-black">
                  Manage Permissions
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                {roleName ? `Role: ${roleName}` : "Role Permissions"}
              </p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-[#004aad] hover:bg-[#003a8f] text-white rounded-xl font-semibold flex items-center gap-3 transition-all shadow-md disabled:opacity-70"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? "Saving Changes..." : "Save Permissions"}
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-md p-6  border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004aad] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="bg-white rounded-md overflow-hidden  border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase w-12"></th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Permission</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map((permission) => {
                    const isSelected = selectedIds.includes(permission.id);
                    return (
                      <tr 
                        key={permission.id}
                        onClick={() => handleToggle(permission.id)}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center">
                            {isSelected ? (
                              <div className="w-6 h-6 bg-[#004aad] text-white rounded-lg flex items-center justify-center">
                                ✓
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 rounded-lg" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className={`font-semibold ${isSelected ? 'text-[#004aad]' : 'text-gray-900'}`}>
                            {permission.name.replace(/_/g, ' ')}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-gray-600 text-sm">
                          Grants access to {permission.name.toLowerCase().replace(/_/g, ' ')} functionality.
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-20 text-center text-gray-500">
                      No permissions found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between text-sm text-gray-600">
            <p>
              {selectedIds.length} of {allPermissions.length} permissions selected
            </p>
            <p className="text-[#004aad] font-medium">
              Click any row to toggle permission
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RolePermissions;