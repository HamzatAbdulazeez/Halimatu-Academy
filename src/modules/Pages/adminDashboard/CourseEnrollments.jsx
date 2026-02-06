import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, TrendingUp } from 'lucide-react';

const EnrollmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  const enrollments = [
    {
      id: 1,
      studentName: 'Abdullah Rahman',
      studentEmail: 'abdullah@email.com',
      course: 'Basic Qur\'an Reading & Arabic',
      plan: '12 Months',
      amount: '₦50,000',
      enrolled: 'Jan 31, 2027',
      expiresOn: 'Jan 31, 2028',
      status: 'active',
      progress: 45
    },
    {
      id: 2,
      studentName: 'Fatima Hassan',
      studentEmail: 'fatima@email.com',
      course: 'Hadith Studies',
      plan: '6 Months',
      amount: '₦25,000',
      enrolled: 'Feb 01, 2027',
      expiresOn: 'Aug 01, 2027',
      status: 'active',
      progress: 65
    },
    {
      id: 3,
      studentName: 'Omar Ali',
      studentEmail: 'omar@email.com',
      course: 'Tafsīr',
      plan: '12 Months',
      amount: '₦50,000',
      enrolled: 'Jan 28, 2027',
      expiresOn: 'Jan 28, 2028',
      status: 'active',
      progress: 78
    },
    {
      id: 4,
      studentName: 'Aisha Mohamed',
      studentEmail: 'aisha@email.com',
      course: 'Fiqh',
      plan: '6 Months',
      amount: '₦25,000',
      enrolled: 'Jan 15, 2027',
      expiresOn: 'Jul 15, 2027',
      status: 'active',
      progress: 30
    },
    {
      id: 5,
      studentName: 'Ibrahim Yusuf',
      studentEmail: 'ibrahim@email.com',
      course: 'Tawhīd',
      plan: '12 Months',
      amount: '₦50,000',
      enrolled: 'Feb 02, 2027',
      expiresOn: 'Feb 02, 2028',
      status: 'active',
      progress: 25
    },
    {
      id: 6,
      studentName: 'Khadija Ahmed',
      studentEmail: 'khadija@email.com',
      course: 'Sīrah',
      plan: '6 Months',
      amount: '₦25,000',
      enrolled: 'Dec 20, 2026',
      expiresOn: 'Jun 20, 2027',
      status: 'expiring',
      progress: 92
    }
  ];

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCourse === 'all' || enrollment.course === filterCourse;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>;
      case 'expiring':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Expiring Soon</span>;
      case 'expired':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Expired</span>;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Course Enrollments</h1>
          <p className="text-gray-600">Track all student course enrollments and subscriptions</p>
        </div>

       

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
                className="w-full pl-12 pr-4 py-3 border border-gray-200  rounded-xl focus:border-[#004aad] focus:outline-none transition-colors"
              />
            </div>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-3 border border-gray-200  rounded-xl focus:border-[#004aad] focus:outline-none transition-colors bg-white"
            >
              <option value="all">All Courses</option>
              <option value="Basic Qur'an Reading & Arabic">Qur'an & Arabic</option>
              <option value="Hadith Studies">Hadith</option>
              <option value="Tafsīr">Tafsīr</option>
              <option value="Fiqh">Fiqh</option>
              <option value="Tawhīd">Tawhīd</option>
              <option value="Sīrah">Sīrah</option>
            </select>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Enrollments Table */}
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
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{enrollment.studentName}</p>
                        <p className="text-sm text-gray-500">{enrollment.studentEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{enrollment.course}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-emerald-600">{enrollment.plan}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{enrollment.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {enrollment.enrolled}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {enrollment.expiresOn}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient h-2 rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(enrollment.status)}
                    </td>
                  </tr>
                ))}
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