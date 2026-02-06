import React from 'react';
import { Users, BookOpen, DollarSign, Award, TrendingUp, Video, UserCheck, Clock } from 'lucide-react';

const AdminDashboard = () => {
  // Sample data
  const stats = [
    {
      title: 'Total Students',
      value: '200',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Courses',
      value: '6',
      change: '100%',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Revenue',
      value: '₦567,890',
      change: '+23%',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Certificates Issued',
      value: '5',
      change: '+18%',
      icon: Award,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentEnrollments = [
    { id: 1, name: 'Abdullah Rahman', course: 'Basic Qur\'an Reading & Arabic', plan: '12 Months', date: 'Today' },
    { id: 2, name: 'Fatima Hassan', course: 'Hadith Studies', plan: '6 Months', date: 'Today' },
    { id: 3, name: 'Omar Ali', course: 'Tafsīr', plan: '12 Months', date: 'Yesterday' },
    { id: 4, name: 'Aisha Mohamed', course: 'Fiqh', plan: '6 Months', date: 'Yesterday' },
    { id: 5, name: 'Ibrahim Yusuf', course: 'Tawhīd', plan: '12 Months', date: '2 days ago' }
  ];

  const upcomingSessions = [
    { id: 1, course: 'Basic Qur\'an Reading', instructor: 'Sheikh Muhammad', time: 'Today, 3:00 PM', students: 45 },
    { id: 2, course: 'Hadith Studies', instructor: 'Sheikh Abdullah', time: 'Today, 5:00 PM', students: 38 },
    { id: 3, course: 'Tafsīr', instructor: 'Sheikh Omar', time: 'Tomorrow, 2:00 PM', students: 52 }
  ];

  return (
    <div className="">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">Welcome Back, Admin! 👋</h1>
            <p className="text-black">Here's what's happening with HSA Academy today</p>
          </div>
          
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-md p-6 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.color} text-black`} style={{ strokeWidth: 2.5 }} />
                  </div>
                  <span className={`text-sm font-semibold ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-black text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-black">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
        
          {/* Recent Enrollments */}
          <div className="lg:col-span-2 bg-white rounded-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#004aad]" />
                Recent Enrollments
              </h2>
              <a href="/admin/enrollments" className="text-[#004aad] font-semibold text-sm hover:underline">
                View All
              </a>
            </div>

            <div className="space-y-3">
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient rounded-full flex items-center justify-center text-white">
                      {enrollment.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-black">{enrollment.name}</p>
                      <p className="text-sm text-[#004aad]">{enrollment.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">{enrollment.plan}</p>
                    <p className="text-xs text-[#004aad]">{enrollment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Live Sessions */}
          <div className="bg-white rounded-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <Video className="w-5 h-5 text-[#004aad]" />
              <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
            </div>

            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">{session.course}</h3>
                  <p className="text-sm text-gray-600 mb-1">{session.instructor}</p>
                  <div className="flex items-center justify-between text-xs mt-3">
                    <span className="flex items-center gap-1 text-purple-700 font-semibold">
                      <Clock className="w-3 h-3" />
                      {session.time}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3 h-3" />
                      {session.students} students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

    
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <a href="/admin/students" className="bg-white rounded-md p-6 transition-all hover:-translate-y-1 text-center">
            <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Manage Students</h3>
          </a>
          <a href="/admin/courses" className="bg-white rounded-md p-6 transition-all hover:-translate-y-1 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Manage Courses</h3>
          </a>
          <a href="/admin/payments" className="bg-white rounded-md p-6 transition-all hover:-translate-y-1 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold text-gray-900">View Payments</h3>
          </a>
          <a href="/admin/certificates" className="bg-white rounded-md p-6 transition-all hover:-translate-y-1 text-center">
            <Award className="w-8 h-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Issue Certificates</h3>
          </a>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;