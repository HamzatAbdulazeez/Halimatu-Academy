import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Award, Video, UserCheck, Clock, DollarSign, UserX } from 'lucide-react';
import { getUserStats, getUsers } from "../../../api/authApi";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]); 
  const [statsData, setStatsData] = useState({ active: 0, verified: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);

  const storedAdmin = JSON.parse(
    sessionStorage.getItem("adminUser") || localStorage.getItem("adminUser") || "{}"
  );
  const adminName = storedAdmin?.first_name || "Admin";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          getUserStats(),
          getUsers()
        ]);

        // 1. Handle Users Data
        const userData = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];
        setStudents(userData);

        // 2. Handle Stats Data (Added inactive here)
        setStatsData({
          active: statsRes?.active || 0,
          verified: statsRes?.verified || 0,
          inactive: statsRes?.inactive || 0 
        });

      } catch (err) {
        console.error("Dashboard sync error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Total Students',
      value: students.length, 
      change: '+12%', 
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Students',
      value: statsData.active,
      change: '100%',
      icon: BookOpen,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Inactive Students',
      value: statsData.inactive,
      change: '0%', 
      icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Verified Users',
      value: statsData.verified,
      change: '+18%',
      icon: Award,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentEnrollments = [...students]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">Welcome Back, {adminName}! 👋</h1>
            <p className="text-black text-sm">Monitor your academy's growth and student activity</p>
          </div>
        </div>

        {/* Stats Grid - Updated to grid-cols-4 for the new card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-md p-6 border border-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} style={{ strokeWidth: 2.5 }} />
                  </div>
                  <span className={`text-sm font-semibold ${stat.title === 'Inactive Students' ? 'text-red-600' : 'text-green-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-black">
                  {loading ? "..." : stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Enrollments Table */}
          <div className="lg:col-span-2 bg-white rounded-md p-6 border border-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#004aad]" />
                Recent Enrollments
              </h2>
              <a href="/admin/students" className="text-[#004aad] font-semibold text-sm hover:underline">View All</a>
            </div>

            <div className="space-y-3">
              {recentEnrollments.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#004aad] rounded-full flex items-center justify-center text-white font-bold">
                      {user.first_name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-black">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">{user.country || 'N/A'}</p>
                    <p className="text-[10px] text-[#004aad] uppercase font-bold">{user.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessions Placeholder */}
          <div className="bg-white rounded-md p-6 border border-gray-50">
             <div className="flex items-center gap-2 mb-6">
              <Video className="w-5 h-5 text-[#004aad]" />
              <h2 className="text-xl font-bold text-gray-900">Live Sessions</h2>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
              <p className="text-sm text-blue-800 font-medium">No live sessions currently scheduled.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <a href="/admin/students" className="bg-white rounded-md p-6 text-center border border-gray-100 hover:shadow-md transition-all">
            <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Manage Students</h3>
          </a>
          <div className="bg-white rounded-md p-6 text-center border border-gray-100">
            <DollarSign className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Revenue Tracking</h3>
          </div>
          <div className="bg-white rounded-md p-6 text-center border border-gray-100">
            <Award className="w-8 h-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Certificates</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;