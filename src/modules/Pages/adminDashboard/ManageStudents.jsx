import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, Mail, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';

const ManageStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Abdullah Rahman',
      email: 'abdullah@email.com',
      phone: '+234 801 234 5678',
      plan: '12 Months',
      enrolled: 'Jan 15, 2027',
      status: 'active',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Fatima Hassan',
      email: 'fatima@email.com',
      phone: '+234 802 345 6789',
      plan: '6 Months',
      enrolled: 'Jan 20, 2027',
      status: 'active',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Omar Ali',
      email: 'omar@email.com',
      phone: '+234 803 456 7890',
      plan: '12 Months',
      enrolled: 'Jan 10, 2027',
      status: 'active',
      lastActive: '5 hours ago'
    },
    {
      id: 4,
      name: 'Aisha Mohamed',
      email: 'aisha@email.com',
      phone: '+234 804 567 8901',
      plan: '6 Months',
      enrolled: 'Dec 25, 2026',
      status: 'inactive',
      lastActive: '1 week ago'
    },
    {
      id: 5,
      name: 'Ibrahim Yusuf',
      email: 'ibrahim@email.com',
      phone: '+234 805 678 9012',
      plan: '12 Months',
      enrolled: 'Jan 25, 2027',
      status: 'active',
      lastActive: 'Just now'
    },
    {
      id: 6,
      name: 'Khadija Ahmed',
      email: 'khadija@email.com',
      phone: '+234 806 789 0123',
      plan: '6 Months',
      enrolled: 'Jan 5, 2027',
      status: 'suspended',
      lastActive: '3 days ago'
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs  flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Active
        </span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" /> Inactive
        </span>;
      case 'suspended':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Suspended
        </span>;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Manage Students</h1>
            <p className="text-black">View and manage all enrolled students</p>
          </div>
          <button className="px-6 py-3 bg-gradient cursor-pointer text-white rounded-md hover:shadow-lg transition-all">
            + Add Student
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-md p-6">
            <p className="text-black text-sm mb-1">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">1,234</p>
          </div>
          <div className="bg-white rounded-md p-6">
            <p className="text-black text-sm mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">1,089</p>
          </div>
          <div className="bg-white rounded-md p-6">
            <p className="text-black text-sm mb-1">Inactive</p>
            <p className="text-3xl font-bold text-gray-600">123</p>
          </div>
          <div className="bg-white rounded-md p-6">
            <p className="text-black text-sm mb-1">Suspended</p>
            <p className="text-3xl font-bold text-red-600">22</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#004aad] focus:outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:border-[#004aad] focus:outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-lg text-black">Student</th>
                  <th className="px-6 py-4 text-left text-lg text-black">Contact</th>
                  <th className="px-6 py-4 text-left text-lg text-black">Plan</th>
                  <th className="px-6 py-4 text-left text-lg text-black">Status</th>
                  <th className="px-6 py-4 text-left text-lg text-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient rounded-full flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">Enrolled: {student.enrolled}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-black">{student.email}</p>
                      <p className="text-sm text-gray-500">{student.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#004aad]">{student.plan}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-5 h-5 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-5 h-5 text-emerald-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredStudents.length} of {students.length} students
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-md ">
                1
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md  hover:bg-gray-200 transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md  hover:bg-gray-200 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageStudents;