import React, { useState } from 'react';
import {
    FaBook, FaCalendar, FaVideo, FaCertificate,
    FaBell,
    FaCheckCircle, FaClock, FaTrophy,
    FaFileAlt, FaPlay, FaDownload, FaBars, FaTimes
} from 'react-icons/fa';


// Main Dashboard Component
const StudentDashboard = () => {

    const studentData = {
        name: "John Doe",
        email: "john.doe@email.com",
        studentId: "DGF-2024-001",
        course: "Professional Video Production",
        enrollmentDate: "Jan 15, 2024",
        overallProgress: 65
    };

    const stats = [
        {
            label: 'Courses Enrolled',
            value: '4',
            icon: <FaBook className="text-2xl" />,
            color: 'from-blue-500 to-blue-600',
            change: '+1 this month'
        },
        {
            label: 'Completed Courses',
            value: '2',
            icon: <FaCheckCircle className="text-2xl" />,
            color: 'from-green-500 to-green-600',
            change: '+1 this week'
        },
        {
            label: 'In Progress',
            value: '2',
            icon: <FaClock className="text-2xl" />,
            color: 'from-orange-500 to-orange-600',
            change: '50% avg progress'
        },
        {
            label: 'Certificates Earned',
            value: '2',
            icon: <FaTrophy className="text-2xl" />,
            color: 'from-purple-500 to-purple-600',
            change: 'View all'
        }
    ];

    const enrolledCourses = [
        {
            id: 1,
            title: 'Professional Video Production',
            instructor: 'David Johnson',
            progress: 65,
            totalLessons: 24,
            completedLessons: 16,
            duration: '12 weeks',
            nextClass: 'Jan 28, 2024 - 2:00 PM',
            status: 'In Progress',
            thumbnail: 'https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769225600/DigiftedHub/0305_638146212701526352_fdegiu.jpg'
        },
        {
            id: 2,
            title: 'Photography Masterclass',
            instructor: 'Sarah Williams',
            progress: 45,
            totalLessons: 20,
            completedLessons: 9,
            duration: '8 weeks',
            nextClass: 'Jan 29, 2024 - 10:00 AM',
            status: 'In Progress',
            thumbnail: 'https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769226386/DigiftedHub/istockphoto-1062278194-612x612_k7nnza.jpg'
        },
        {
            id: 3,
            title: 'Audio Engineering Basics',
            instructor: 'Michael Brown',
            progress: 100,
            totalLessons: 15,
            completedLessons: 15,
            duration: '6 weeks',
            completedDate: 'Jan 15, 2024',
            status: 'Completed',
            thumbnail: 'https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769225600/DigiftedHub/0305_638146212701526352_fdegiu.jpg'
        },
        {
            id: 4,
            title: 'Digital Marketing Fundamentals',
            instructor: 'Emily Davis',
            progress: 100,
            totalLessons: 18,
            completedLessons: 18,
            duration: '10 weeks',
            completedDate: 'Dec 20, 2023',
            status: 'Completed',
            thumbnail: 'https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769226386/DigiftedHub/istockphoto-1062278194-612x612_k7nnza.jpg'
        }
    ];

    const upcomingClasses = [
        {
            title: 'Advanced Camera Techniques',
            date: 'Jan 28, 2024',
            time: '2:00 PM',
            instructor: 'David Johnson',
            duration: '2 hours',
            type: 'Live Session'
        },
        {
            title: 'Portrait Photography Workshop',
            date: 'Jan 29, 2024',
            time: '10:00 AM',
            instructor: 'Sarah Williams',
            duration: '3 hours',
            type: 'Workshop'
        },
        {
            title: 'Video Editing Masterclass',
            date: 'Jan 30, 2024',
            time: '3:00 PM',
            instructor: 'David Johnson',
            duration: '2.5 hours',
            type: 'Live Session'
        }
    ];

    const recentActivities = [
        {
            action: 'Completed module',
            detail: 'Color Grading Basics',
            course: 'Video Production',
            time: '2 hours ago',
            icon: <FaCheckCircle className="text-green-500" />
        },
        {
            action: 'Submitted project',
            detail: 'Product Photography Assignment',
            course: 'Photography Masterclass',
            time: '1 day ago',
            icon: <FaFileAlt className="text-blue-500" />
        },
        {
            action: 'Earned certificate',
            detail: 'Audio Engineering Basics',
            course: 'Completed Course',
            time: '2 days ago',
            icon: <FaTrophy className="text-purple-500" />
        },
        {
            action: 'Started new lesson',
            detail: 'Advanced Camera Techniques',
            course: 'Video Production',
            time: '3 days ago',
            icon: <FaPlay className="text-orange-500" />
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
               

                {/* Dashboard Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                                    <p className="text-xs text-gray-500">{stat.change}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Courses */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Enrolled Courses */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
                                    <a href="/student/courses" className="text-sm text-[#053276] hover:underline font-semibold">
                                        View All
                                    </a>
                                </div>

                                <div className="space-y-4">
                                    {enrolledCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#053276] transition-colors"
                                        >
                                            <div className="flex gap-4">
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 mb-1">{course.title}</h3>
                                                            <p className="text-sm text-gray-600">by {course.instructor}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'Completed'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {course.status}
                                                        </span>
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="flex items-center justify-between text-sm mb-1">
                                                            <span className="text-gray-600">Progress</span>
                                                            <span className="font-semibold text-gray-800">{course.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-[#053276] to-indigo-600 h-2 rounded-full transition-all"
                                                                style={{ width: `${course.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            {course.completedLessons}/{course.totalLessons} lessons
                                                        </span>
                                                        {course.status === 'In Progress' ? (
                                                            <button className="px-4 py-2 bg-[#053276] text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-semibold">
                                                                Continue Learning
                                                            </button>
                                                        ) : (
                                                            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-semibold flex items-center gap-2">
                                                                <FaDownload /> Certificate
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                                <div className="space-y-4">
                                    {recentActivities.map((activity, idx) => (
                                        <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0 border-gray-200">
                                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                {activity.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">{activity.action}</p>
                                                <p className="text-sm text-gray-600">{activity.detail}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.course} • {activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar Info */}
                        <div className="space-y-6">
                            {/* Upcoming Classes */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Upcoming Classes</h2>
                                <div className="space-y-4">
                                    {upcomingClasses.map((class_, idx) => (
                                        <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-bold text-gray-800 text-sm">{class_.title}</h3>
                                                <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                                                    {class_.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">by {class_.instructor}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <FaCalendar className="text-xs" />
                                                <span>{class_.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                                                <FaClock className="text-xs" />
                                                <span>{class_.time} ({class_.duration})</span>
                                            </div>
                                            <button className="w-full mt-3 px-4 py-2 bg-[#053276] text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-semibold">
                                                Join Class
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <a href="/student/schedule" className="block mt-4 text-center text-sm text-[#053276] hover:underline font-semibold">
                                    View Full Schedule
                                </a>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
                                <div className="space-y-3">
                                    <button className="w-full px-4 py-3 bg-gradient-to-r from-[#053276] to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2">
                                        <FaBook /> Browse Courses
                                    </button>
                                    <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2">
                                        <FaCertificate /> View Certificates
                                    </button>
                                    <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2">
                                        <FaVideo /> My Projects
                                    </button>
                                </div>
                            </div>

                            {/* Performance Chart */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Progress</h2>
                                <div className="text-center">
                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                        <svg className="transform -rotate-90 w-32 h-32">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="#e5e7eb"
                                                strokeWidth="12"
                                                fill="none"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="#053276"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 56}`}
                                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - studentData.overallProgress / 100)}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-gray-800">{studentData.overallProgress}%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">Overall Course Progress</p>
                                    <p className="text-xs text-gray-500 mt-1">Keep up the great work!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;