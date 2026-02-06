import { Plus, Edit, Eye, Users, } from 'lucide-react';

const ManageView = () => {
    const courses = [
        {
            id: 1,
            title: 'Basic Qur\'an Reading & Arabic',
            icon: '📖',
            color: 'from-emerald-500 to-teal-500',
            instructor: 'Sheikh Muhammad Tariq',
            enrolled: 456,
            modules: 4,

            duration: '6-12 months',
            status: 'active',
            completionRate: 75
        },
        {
            id: 2,
            title: 'Hadith Studies',
            icon: '📜',
            color: 'from-blue-500 to-cyan-500',
            instructor: 'Sheikh Abdullah Rahman',
            enrolled: 342,
            modules: 4,

            duration: '6-12 months',
            status: 'active',
            completionRate: 68
        },
        {
            id: 3,
            title: 'Tafsīr (Quranic Exegesis)',
            icon: '📕',
            color: 'from-purple-500 to-pink-500',
            instructor: 'Sheikh Omar Khalid',
            enrolled: 298,
            modules: 4,

            duration: '6-12 months',
            status: 'active',
            completionRate: 72
        },
    ];

    return (
        <div className="">
            <div className="space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-black mb-2">Manage Courses</h1>
                        <p className="text-gray-600">All Islamic courses offered at HSA Academy</p>
                    </div>
                    <button className="px-6 py-3 bg-gradient text-white rounded-md hover:shadow-lg transition-all flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Course
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-md p-6">
                        <p className="text-black text-base mb-1">Total Courses</p>
                        <p className="text-3xl font-bold text-gray-900">6</p>
                    </div>
                    <div className="bg-white rounded-md p-6">
                        <p className="text-black text-base mb-1">Total Students</p>
                        <p className="text-3xl font-bold text-emerald-600">2,249</p>
                    </div>
                    <div className="bg-white rounded-md p-6">
                        <p className="text-black text-base mb-1">Total Lessons</p>
                        <p className="text-3xl font-bold text-blue-600">241</p>
                    </div>
                    <div className="bg-white rounded-md p-6">
                        <p className="text-black text-base mb-1">Avg. Completion</p>
                        <p className="text-3xl font-bold text-purple-600">74%</p>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            {/* Course Header */}
                            <div className={`bg-gradient-to-br ${course.color} p-6 text-white relative`}>
                                <div className="absolute top-4 right-4 text-6xl opacity-20">{course.icon}</div>
                                <div className="relative z-10">
                                    <div className="text-5xl mb-3">{course.icon}</div>
                                    <h3 className="text-xl font-bold">{course.title}</h3>
                                </div>
                            </div>

                            {/* Course Body */}
                            <div className="p-6 space-y-4">
                                {/* Instructor */}
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm">👤</span>
                                    </div>
                                    <span className="text-sm font-medium">{course.instructor}</span>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs text-gray-600">Students</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">{course.enrolled}</p>
                                    </div>

                                </div>

                                {/* Completion Rate */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600">Completion Rate</span>
                                        <span className="font-semibold text-emerald-600">{course.completionRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`bg-gradient-to-r ${course.color} h-2 rounded-full`}
                                            style={{ width: `${course.completionRate}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        Active
                                    </span>
                                    <span className="text-xs text-gray-500">{course.duration}</span>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    <button className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                    <button className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ManageView;