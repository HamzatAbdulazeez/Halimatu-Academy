import React, { useState, useEffect } from 'react';
import { notify } from "../../../../../utils/toast";
import {
    getCourseDetails,
    getCourseProgress,
    markTopicComplete,
    updateCourseProgress
} from '../../../../../api/courseApi';

import { getImageUrl } from "../../../../../utils/imageHelper";

const EnrolledCourses = ({ courses, loading }) => {
    const [courseData, setCourseData] = useState({});
    const [updating, setUpdating] = useState({});
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [selectedCourseForUpdate, setSelectedCourseForUpdate] = useState(null);
    const [newProgressValue, setNewProgressValue] = useState(0);
    const [modalLoading] = useState(false);

    // Fetch course details + progress
    useEffect(() => {
        if (!courses || courses.length === 0) return;

        const fetchAllCoursesData = async () => {
            const dataMap = {};
            for (const course of courses) {
                try {
                    const [details, progress] = await Promise.all([
                        getCourseDetails(course.id).catch(() => course),
                        getCourseProgress(course.id).catch(() => null)
                    ]);
                    dataMap[course.id] = { details, progress };
                } catch {
                    dataMap[course.id] = { details: course, progress: null };
                }
            }
            setCourseData(dataMap);
        };

        fetchAllCoursesData();
    }, [courses]);


    // Open Progress Modal
    const openProgressModal = (courseId) => {
        const current = courseData[courseId]?.progress?.overall_progress || 0;
        setNewProgressValue(Math.round(current));
        setSelectedCourseForUpdate(courseId);
        setShowProgressModal(true);
    };

    const handleToggleTopicStatus = async (courseId, topicId, currentStatus) => {
        if (updating[topicId]) return;
        setUpdating(prev => ({ ...prev, [topicId]: true }));

        const isReverting = currentStatus === true; // Are we unchecking it?

        try {
            // 1. Call API with the opposite of current status
            await markTopicComplete(topicId, { is_completed: !isReverting });

            const freshProgress = await getCourseProgress(courseId);

            setCourseData(prev => ({
                ...prev,
                [courseId]: { ...prev[courseId], progress: freshProgress }
            }));

            notify.success(isReverting ? "Topic moved back to learning" : "Topic completed!");
        } catch (err) {
            console.error("Toggle Status Error:", err);
            notify.error("Failed to update status.");
        } finally {
            setUpdating(prev => ({ ...prev, [topicId]: false }));
        }
    };
    const handleManualProgressUpdate = async () => {
        try {
            const response = await updateCourseProgress(selectedCourseForUpdate, { 
                progress: newProgressValue 
            });
            
            
            setCourseData(prev => ({
                ...prev,
                [selectedCourseForUpdate]: { 
                    ...prev[selectedCourseForUpdate], 
                    progress: response.progress 
                }
            }));
            
            setShowProgressModal(false);
            notify.success("Overall progress synced!");
        } catch  {
            notify.error("Manual update failed.");
        }
    };

    return (
        <>
            <section className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">📚 My Enrolled Courses</h2>
                    <span className="text-sm text-gray-500">
                        {loading ? '...' : `${courses.length} Active`}
                    </span>
                </div>

                <div className="space-y-8">
                    {loading ? (
                        <p className="text-gray-400 py-12 text-center">Loading your courses...</p>
                    ) : courses.length > 0 ? (
                        courses.map((course) => {
                            const courseId = course.course_id || course.id;
                            const data = courseData[courseId] || {};
                            const currentProgress = typeof data.progress === 'object'
                                ? data.progress.progress_percentage
                                : (data.progress || course.progress || 0);

                           
                            const topics = data.progress?.topics || data.details?.topics || [];

                            return (
                                <div key={course.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        <img
                                            src={getImageUrl(course.image) || course.thumbnail}
                                            alt={course.title}
                                            className="w-full md:w-60 h-60 object-cover"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />

                                        <div className="flex-1 p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                        {course.category || 'Quranic Studies'}
                                                    </span>
                                                    <h3 className="text-2xl font-bold mt-3">{course.title}</h3>
                                                </div>

                                                <button
                                                    onClick={() => openProgressModal(course.id)}
                                                    className="text-xs px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
                                                >
                                                    ✏️ Update Progress
                                                </button>
                                            </div>

                                            <div className="mt-6">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Overall Progress</span>
                                                    <span className="font-bold text-emerald-600">{currentProgress}%</span>
                                                </div>
                                                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-600 transition-all duration-500 ease-out"
                                                        style={{ width: `${currentProgress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <h4 className="font-semibold mb-3 text-gray-800">Topics</h4>
                                                <div className="space-y-3">
                                                    {/* Check if topics exist and has items */}
                                                    {topics && topics.length > 0 ? (
                                                        topics.map((topic) => {
                                                            // Ensure we handle different naming conventions for 'completed'
                                                            const isDone = topic.is_completed || topic.completed;

                                                            return (
                                                                <div
                                                                    key={topic.id}
                                                                    className={`flex justify-between items-center p-4 rounded-lg border transition-all ${isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-xl">{isDone ? '✅' : '📖'}</span>
                                                                        <div>
                                                                            <p className={`font-medium ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                                                                {topic.title || topic.name}
                                                                            </p>
                                                                            {isDone && (
                                                                                <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                                                                                    Completed
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => handleToggleTopicStatus(courseId, topic.id, isDone)}
                                                                        disabled={updating[topic.id]}
                                                                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${isDone
                                                                                ? 'text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50'
                                                                                : 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm'
                                                                            }`}
                                                                    >
                                                                        {updating[topic.id] ? (
                                                                            <span className="flex items-center gap-1">
                                                                                <span className="animate-pulse">...</span>
                                                                            </span>
                                                                        ) : isDone ? (
                                                                            "Undo"
                                                                        ) : (
                                                                            "Mark Complete"
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        /* This is the part that was misplaced */
                                                        <div className="py-6 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                                            <p className="text-gray-400 text-sm">No topics available for this course yet.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center py-12 text-gray-500">You have not enrolled in any courses yet.</p>
                    )}
                </div>
            </section>

            {/* Progress Modal */}
            {showProgressModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-6">Update Overall Progress</h3>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={newProgressValue}
                            onChange={(e) => setNewProgressValue(Number(e.target.value))}
                            className="w-full accent-emerald-600 mb-6"
                        />
                        <div className="text-center text-6xl font-bold text-emerald-600 mb-8">
                            {newProgressValue}%
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowProgressModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
                                Cancel
                            </button>
                            <button
                                onClick={handleManualProgressUpdate}
                                disabled={modalLoading}
                                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl disabled:bg-gray-400"
                            >
                                {modalLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EnrolledCourses;