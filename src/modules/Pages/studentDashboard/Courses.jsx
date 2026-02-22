import React, { useState, } from "react";
import {
    BookOpen,
    ChevronDown,
    PlayCircle,
    Lock,
    CheckCircle,
    Layers,
    BarChart3,
} from "lucide-react";
import { Link } from 'react-router-dom';


const CoursesPage = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [openModule, setOpenModule] = useState(null);

    const courses = [
        {
            id: 1,
            title: "Basic Qur'an Reading & Arabic",
            progress: 65,
            lastLesson: "Writing Practice",
            modules: [
                {
                    id: 1,
                    title: "Introduction to Arabic Letters",
                    lessons: [
                        { id: 1, title: "Arabic Alphabets", completed: true },
                        { id: 2, title: "Letter Pronunciation", completed: true },
                        { id: 3, title: "Writing Practice" },
                    ],
                },
                {
                    id: 2,
                    title: "Basic Qur'an Reading Rules",
                    lessons: [
                        { id: 4, title: "Harakat (Vowels)", locked: true },
                        { id: 5, title: "Joining Letters", locked: true },
                    ],
                },
            ],
        },
        {
            id: 2,
            title: "Islamic Studies for Beginners",
            progress: 100,
            lastLesson: "Articles of Faith",
            modules: [
                {
                    id: 3,
                    title: "Introduction to Islam",
                    lessons: [
                        { id: 6, title: "Five Pillars of Islam", completed: true },
                        { id: 7, title: "Articles of Faith", completed: true },
                    ],
                },
            ],
        },
    ];

    // useEffect(() => {
    //     if (selectedCourse && selectedCourse.modules.length) {
    //         setOpenModule(selectedCourse.modules[0].id);
    //     }
    // }, [selectedCourse]);

    const getModuleProgress = (module) => {
        const total = module.lessons.length;
        const completed = module.lessons.filter(l => l.completed).length;
        return Math.round((completed / total) * 100);
    };

    return (
        <>
            <div className="bg-white px-6 py-4 mb-6">
                <h1 className="text-2xl font-medium mb-3">Courses</h1>
                <p className="text-gray-500">
                    <Link to="/student" className="text-[#004aad] hover:underline">
                        Dashboard
                    </Link>{" "}
                    &gt; Courses
                </p>
            </div>
            <div className="min-h-screen bg-white p-6">
                {/* Header */}
                <div className="mb-8">
                   
                    <p className="text-black">
                        Continue learning where you stopped
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* COURSES LIST */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <h2 className="font-semibold mb-4">Enrolled Courses</h2>

                        <div className="space-y-3">
                            {courses.map((course) => {
                                const active = selectedCourse?.id === course.id;

                                return (
                                    <button
                                        key={course.id}
                                        onClick={() => setSelectedCourse(course)}
                                        className={`w-full p-4 rounded-xl border transition text-left
                    ${active
                                                ? "border-emerald-600 bg-emerald-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <p className="font-medium text-gray-900">
                                            {course.title}
                                        </p>

                                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                            <span>{course.progress}% complete</span>
                                            <span>{course.modules.length} modules</span>
                                        </div>

                                        <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                            <div
                                                className="h-full bg-emerald-600 rounded-full"
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* COURSE DETAILS */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        {!selectedCourse ? (
                            <div className="text-center text-gray-500 py-28">
                                Select a course to view its content
                            </div>
                        ) : (
                            <>
                                {/* Course Header */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedCourse.title}
                                    </h2>

                                    <div className="mt-4 grid sm:grid-cols-3 gap-4">
                                        <Stat
                                            icon={<Layers />}
                                            label="Modules"
                                            value={selectedCourse.modules.length}
                                        />
                                        <Stat
                                            icon={<BookOpen />}
                                            label="Lessons"
                                            value={selectedCourse.modules.reduce(
                                                (a, m) => a + m.lessons.length,
                                                0
                                            )}
                                        />
                                        <Stat
                                            icon={<BarChart3 />}
                                            label="Progress"
                                            value={`${selectedCourse.progress}%`}
                                        />
                                    </div>

                                    {/* Resume */}
                                    {selectedCourse.progress < 100 && (
                                        <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                            <p className="text-sm text-gray-700">
                                                Continue from:
                                                <span className="font-semibold text-emerald-700 ml-1">
                                                    {selectedCourse.lastLesson}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Modules */}
                                <div className="space-y-4">
                                    {selectedCourse.modules.map((module) => {
                                        const isOpen = openModule === module.id;
                                        const moduleProgress = getModuleProgress(module);

                                        return (
                                            <div
                                                key={module.id}
                                                className="border border-gray-200 rounded-xl overflow-hidden"
                                            >
                                                {/* Module Header */}
                                                <button
                                                    onClick={() =>
                                                        setOpenModule(isOpen ? null : module.id)
                                                    }
                                                    className="w-full p-4 bg-gray-50 flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {module.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {moduleProgress}% completed
                                                        </p>
                                                    </div>
                                                    <ChevronDown
                                                        className={`transition ${isOpen ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>

                                                {/* Lessons */}
                                                {isOpen && (
                                                    <div className="divide-y">
                                                        {module.lessons.map((lesson) => (
                                                            <div
                                                                key={lesson.id}
                                                                className="p-7 flex items-center justify-between hover:bg-gray-50"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {lesson.completed ? (
                                                                        <CheckCircle className="text-emerald-600" size={18} />
                                                                    ) : lesson.locked ? (
                                                                        <Lock className="text-gray-400" size={18} />
                                                                    ) : (
                                                                        <PlayCircle className="text-emerald-600" size={18} />
                                                                    )}

                                                                    <span
                                                                        className={`text-sm ${lesson.locked
                                                                                ? "text-gray-400"
                                                                                : "text-gray-800"
                                                                            }`}
                                                                    >
                                                                        {lesson.title}
                                                                    </span>
                                                                </div>

                                                                {/* {!lesson.locked && (
                                <button className="text-sm font-medium text-emerald-600 hover:underline">
                                  {lesson.completed ? "Review" : "Start"}
                                </button>
                              )} */}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const Stat = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default CoursesPage;
