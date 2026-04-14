import React, { useState, useEffect } from 'react';
import { getStudentEnrolledCourses, getCourseProgress } from '../../../../../api/courseApi';

const QuickStats = ({ enrolledCount, classesAttended, loading: parentLoading }) => {
    const [overallProgress, setOverallProgress] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        const calculateRealProgress = async () => {
            if (!enrolledCount || enrolledCount === 0) {
                setOverallProgress(0);
                setTotalCompleted(0);
                return;
            }

            setCalculating(true);
            try {
                const courses = await getStudentEnrolledCourses().catch(() => []);

                if (courses.length === 0) {
                    setOverallProgress(0);
                    return;
                }

                const progressPromises = courses.map(course =>
                    getCourseProgress(course.id).catch(() => ({ overall_progress: 0, completed_topics: 0 }))
                );

                const allProgress = await Promise.all(progressPromises);

                let totalProg = 0;
                let totalComp = 0;

                allProgress.forEach(p => {
                    totalProg += p.overall_progress || 0;
                    totalComp += p.completed_topics || 0;
                });

                const avgProgress = Math.round(totalProg / allProgress.length);

                setOverallProgress(avgProgress);
                setTotalCompleted(totalComp);
            } catch (err) {
                console.error("Failed to calculate overall progress:", err);
                setOverallProgress(0);
            } finally {
                setCalculating(false);
            }
        };

        calculateRealProgress();
    }, [enrolledCount]);

    const isLoading = parentLoading || calculating;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Enrolled Courses */}
            <div className="bg-white rounded-2xl p-4 border-l-4 border-blue-500 ">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Enrolled Courses</p>
                        <p className="text-4xl font-bold text-gray-900 mt-3">
                            {isLoading ? '—' : enrolledCount}
                        </p>
                    </div>
                    <div className="text-4xl">📚</div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Active programs</p>
            </div>

            

            {/* Real Overall Progress */}
            <div className="bg-white rounded-2xl p-4 border-l-4 border-emerald-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Overall Progress</p>
                        <p className="text-4xl font-bold text-emerald-600 mt-3">
                            {isLoading ? '—' : `${overallProgress}%`}
                        </p>
                    </div>
                    <div className="text-4xl">📈</div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    {totalCompleted} topics completed
                </p>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
            </div>

            {/* Classes Attended (Still Static - will be dynamic later) */}
            <div className="bg-white rounded-2xl p-4 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Classes Attended</p>
                        <p className="text-4xl font-bold text-gray-900 mt-3">{classesAttended}</p>
                    </div>
                    <div className="text-4xl">✅</div>
                </div>
                <p className="text-xs text-gray-500 mt-4">Total sessions</p>
                <p className="text-[10px] text-amber-500 mt-1">* Coming soon</p>
            </div>
        </div>
    );
};

export default QuickStats;