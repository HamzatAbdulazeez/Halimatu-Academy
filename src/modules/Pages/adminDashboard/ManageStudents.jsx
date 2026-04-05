import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, 
  MoreHorizontal, X 
} from 'lucide-react';
import { getUsers, getUserStats, deleteUser, updateUser } from "../../../api/authApi"; 
import { notify } from "../../../utils/toast";

const ManageStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, verified: 0 });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([getUsers(), getUserStats()]);
      setStudents(Array.isArray(usersRes) ? usersRes : usersRes?.data || []);
      if (statsRes) setStats(statsRes);
    } catch {
      notify.error("Failed to load students data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ACTION HANDLERS ---
  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      notify.success(`${selectedUser.first_name} has been deleted successfully`);
      setIsDeleteModalOpen(false);
      fetchData();
    } catch {
      notify.error("Failed to delete student. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, selectedUser);
      notify.success("Student information updated successfully");
      setIsEditModalOpen(false);
      fetchData();
    } catch {
      notify.error("Failed to update student information");
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                         (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircle size={14} />;
      case 'suspended': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Manage Students</h1>
          <p className="text-gray-600 mt-2">View, edit, and manage all enrolled students</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: stats.total, color: "text-gray-900" },
          { label: "Active", value: stats.active, color: "text-green-600" },
          { label: "Inactive", value: stats.inactive, color: "text-gray-600" },
          { label: "Verified", value: stats.verified, color: "text-blue-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6  border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-black text-sm font-medium">{stat.label}</p>
            <p className={`text-4xl font-semibold mt-3 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6  border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#004aad] focus:bg-white transition-all outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#004aad] focus:bg-white transition-all outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl  border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-left font-semibold text-black">Student</th>
                <th className="px-6 py-5 text-left font-semibold text-black">Contact</th>
                <th className="px-6 py-5 text-left font-semibold text-black">Status</th>
                <th className="px-6 py-5 text-right font-semibold text-black pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-[#004aad] border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading students...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-gray-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-br from-[#004aad] to-blue-700 rounded-2xl flex items-center justify-center text-white font-semibold text-xl ">
                          {student.first_name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{student.student_id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">{student.email}</td>

                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium ${getStatusBadge(student.status)}`}>
                        {getStatusIcon(student.status)}
                        <span className="capitalize">{student.status}</span>
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => { setSelectedUser(student); setIsViewModalOpen(true); }}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-105"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(student); setIsEditModalOpen(true); }}
                          className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all hover:scale-105"
                          title="Edit Student"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(student); setIsDeleteModalOpen(true); }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-105"
                          title="Delete Student"
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

      {/* View Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-linear-to-br from-[#004aad] to-blue-700 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
                  {selectedUser.first_name?.[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{selectedUser.first_name} {selectedUser.last_name}</h3>
                  <p className="text-gray-500">{selectedUser.student_id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm">
                <div><strong className="text-gray-600">Email:</strong> {selectedUser.email}</div>
                <div><strong className="text-gray-600">Phone:</strong> {selectedUser.phone_number || '—'}</div>
                <div><strong className="text-gray-600">Country:</strong> {selectedUser.country || '—'}</div>
                <div><strong className="text-gray-600">Gender:</strong> {selectedUser.gender || '—'}</div>
                <div>
                  <strong className="text-gray-600">Status:</strong>{' '}
                  <span className={`capitalize inline-flex items-center gap-1.5 ${getStatusBadge(selectedUser.status)} px-3 py-1 rounded-full text-xs`}>
                    {getStatusIcon(selectedUser.status)} {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Improved */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Student</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad] outline-none"
                  value={selectedUser.first_name || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, first_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#004aad] focus:ring-1 focus:ring-[#004aad] outline-none"
                  value={selectedUser.status || 'active'}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#004aad] hover:bg-[#003a8f] text-white rounded-xl font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center">
            <div className="w-20 h-20 mx-auto bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <Trash2 size={40} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Student?</h2>
            <p className="text-gray-600 mb-8">
              Are you sure you want to permanently delete <br />
              <span className="font-semibold text-gray-900">
                {selectedUser.first_name} {selectedUser.last_name}
              </span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;