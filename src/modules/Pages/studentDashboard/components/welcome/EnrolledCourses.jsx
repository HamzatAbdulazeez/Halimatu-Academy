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

    // Fetch detailed course info + progress for all enrolled courses
    useEffect(() => {
        if (!courses || courses.length === 0) return;

        const fetchAllCoursesData = async () => {
            const dataMap = {};

            for (const course of courses) {
                const courseId = course.course_id || course.id;

                try {
                    const [details, progress] = await Promise.all([
                        getCourseDetails(courseId).catch(() => course),
                        getCourseProgress(courseId).catch(() => null)
                    ]);

                    dataMap[courseId] = { 
                        details: details || course, 
                        progress 
                    };
                } catch (err) {
                    console.warn(`Failed to fetch data for course ${courseId}`, err);
                    dataMap[courseId] = { 
                        details: course, 
                        progress: null 
                    };
                }
            }

            setCourseData(dataMap);
        };

        fetchAllCoursesData();
    }, [courses]);

    // Open manual progress update modal
    const openProgressModal = (courseId) => {
        const courseInfo = courseData[courseId] || {};
        const currentProgress = courseInfo.progress?.progress_percentage 
                             || courseInfo.progress?.overall_progress 
                             || courseInfo.details?.progress 
                             || 0;

        setNewProgressValue(Math.round(currentProgress));
        setSelectedCourseForUpdate(courseId);
        setShowProgressModal(true);
    };

    // Toggle topic completion status
    const handleToggleTopicStatus = async (courseId, topicId, isCurrentlyDone) => {
        if (updating[topicId]) return;

        setUpdating(prev => ({ ...prev, [topicId]: true }));

        try {
            await markTopicComplete(topicId, { is_completed: !isCurrentlyDone });

            // Refresh progress after toggle
            const freshProgress = await getCourseProgress(courseId);

            setCourseData(prev => ({
                ...prev,
                [courseId]: { 
                    ...prev[courseId], 
                    progress: freshProgress 
                }
            }));

            notify.success(isCurrentlyDone ? "Topic unmarked" : "Topic marked as complete!");
        } catch (err) {
            console.error("Toggle topic error:", err);
            notify.error("Failed to update topic status.");
        } finally {
            setUpdating(prev => ({ ...prev, [topicId]: false }));
        }
    };

    // Manual overall progress update
    const handleManualProgressUpdate = async () => {
        if (!selectedCourseForUpdate) return;

        try {
            const response = await updateCourseProgress(selectedCourseForUpdate, { 
                progress: newProgressValue 
            });

            setCourseData(prev => ({
                ...prev,
                [selectedCourseForUpdate]: { 
                    ...prev[selectedCourseForUpdate], 
                    progress: response?.progress || response 
                }
            }));

            setShowProgressModal(false);
            notify.success("Course progress updated successfully!");
        } catch (err) {
            console.error("Progress update error:", err);
            notify.error("Failed to update progress.");
        }
    };

    return (
        <>
            <section className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">📚 My Enrolled Courses</h2>
                    <span className="text-sm text-gray-500">
                        {loading ? 'Loading...' : `${courses.length} Course${courses.length !== 1 ? 's' : ''}`}
                    </span>
                </div>

                <div className="space-y-8">
                    {loading ? (
                        <div className="text-center py-16 text-gray-400">
                            Loading your enrolled courses...
                        </div>
                    ) : courses.length > 0 ? (
                        courses.map((course) => {
                            const courseId = course.course_id || course.id;
                            const data = courseData[courseId] || {};
                            const details = data.details || course;

                            // Safely get progress percentage
                            const progressObj = data.progress || {};
                            const currentProgress = progressObj.progress_percentage 
                                                 || progressObj.overall_progress 
                                                 || details.progress 
                                                 || 0;

                            const topics = progressObj.topics || details.topics || [];

                            return (
                                <div key={courseId} className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Course Image */}
                                        <img
                                            src={getImageUrl(details.image) || getImageUrl(course.image) || course.thumbnail}
                                            alt={details.title || course.title}
                                            className="w-full md:w-60 h-60 object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />

                                        <div className="flex-1 p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                        {details.category || course.category || 'General'}
                                                    </span>
                                                    <h3 className="text-2xl font-bold mt-3 text-gray-900">
                                                        {details.title || course.title}
                                                    </h3>
                                                </div>

                                                <button
                                                    onClick={() => openProgressModal(courseId)}
                                                    className="text-xs px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
                                                >
                                                    ✏️ Update Progress
                                                </button>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mt-6">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Overall Progress</span>
                                                    <span className="font-bold text-emerald-600">{Math.round(currentProgress)}%</span>
                                                </div>
                                                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-600 transition-all duration-500"
                                                        style={{ width: `${currentProgress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Topics Section */}
                                            <div className="mt-8">
                                                <h4 className="font-semibold mb-3 text-gray-800">Course Topics</h4>
                                                <div className="space-y-3">
                                                    {topics.length > 0 ? (
                                                        topics.map((topic) => {
                                                            const isDone = topic.is_completed || topic.completed || false;

                                                            return (
                                                                <div
                                                                    key={topic.id}
                                                                    className={`flex justify-between items-center p-4 rounded-lg border transition-all ${
                                                                        isDone 
                                                                            ? 'bg-emerald-50 border-emerald-200' 
                                                                            : 'bg-white border-gray-100'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-xl">
                                                                            {isDone ? '✅' : '📖'}
                                                                        </span>
                                                                        <div>
                                                                            <p className={`font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                                                {topic.title || topic.name}
                                                                            </p>
                                                                            {isDone && (
                                                                                <span className="text-xs text-emerald-600 font-semibold">COMPLETED</span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => handleToggleTopicStatus(courseId, topic.id, isDone)}
                                                                        disabled={updating[topic.id]}
                                                                        className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                                                                            isDone 
                                                                                ? 'text-red-600 hover:bg-red-50 bg-gray-100' 
                                                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                                        }`}
                                                                    >
                                                                        {updating[topic.id] 
                                                                            ? "..." 
                                                                            : isDone 
                                                                                ? "Undo" 
                                                                                : "Mark Complete"
                                                                        }
                                                                    </button>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                                            <p className="text-gray-400">No topics available yet for this course.</p>
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
                        <div className="text-center py-16 text-gray-500">
                            You haven't enrolled in any courses yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Progress Update Modal */}
            {showProgressModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">Update Overall Progress</h3>
                        
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
                            <button 
                                onClick={() => setShowProgressModal(false)} 
                                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleManualProgressUpdate}
                                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EnrolledCourses;