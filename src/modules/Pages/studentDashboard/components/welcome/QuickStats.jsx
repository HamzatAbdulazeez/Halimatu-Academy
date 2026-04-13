import React from 'react';

const QuickStats = ({ enrolledCount, classesAttended, currentStreak, loading }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-black text-sm font-medium">Enrolled Courses</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            {loading ? '—' : enrolledCount}
                        </p>
                    </div>
                    <div className="text-4xl">📚</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Active programs</p>
            </div>

            <div className="bg-white rounded-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-black text-sm font-medium">Classes Attended</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{classesAttended}</p>
                    </div>
                    <div className="text-4xl">✅</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Total sessions</p>
            </div>

            <div className="bg-white rounded-md p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-black text-sm font-medium">Current Streak</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{currentStreak}</p>
                    </div>
                    <div className="text-4xl">🔥</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Days in a row</p>
            </div>
        </div>
    );
};

export default QuickStats;