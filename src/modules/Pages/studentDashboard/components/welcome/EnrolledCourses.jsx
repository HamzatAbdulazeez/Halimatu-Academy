import React from 'react';
import { getImageUrl } from "../../../../../utils/imageHelper";

const EnrolledCourses = ({ courses, loading }) => {
    return (
        <section className="bg-white rounded-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">📚 My Enrolled Courses</h2>
                <span className="text-sm text-gray-500">
                    {loading ? '...' : `${courses.length} Active Course${courses.length !== 1 ? 's' : ''}`}
                </span>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <p className="text-gray-400 py-10 text-center">Loading courses...</p>
                ) : courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                                <img
                                    src={getImageUrl(course.image) || course.thumbnail}
                                    alt={course.title}
                                    className="w-full sm:w-48 h-48 object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div className="flex-1 p-5">
                                    <div className="mb-3">
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2">
                                            {course.category || 'Quranic Studies'}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Instructor: {course.instructor}
                                        </p>
                                        <p className="text-sm text-blue-600 font-medium">
                                            📅 {course.duration_months
                                                ? `${course.duration_months} Month Program`
                                                : course.duration || '1 Year Program'}
                                        </p>
                                    </div>
                                    {course.topics && course.topics.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-600 mb-2">What you will learn:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {course.topics.map((topic, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                                    >
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 py-10 text-center">
                        You have not enrolled in any courses yet.
                    </p>
                )}
            </div>
        </section>
    );
};

export default EnrolledCourses;