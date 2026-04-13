import React from 'react';

const formatTimeUntil = (minutes) => {
    if (!minutes || minutes < 0) return "Soon";
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Meeting link copied to clipboard!');
};

const ClassSchedule = ({ classes, loading }) => {
    return (
        <section className="bg-white rounded-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🕐 Upcoming Class Schedule</h2>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <p className="text-gray-400 py-10 text-center">Loading schedule...</p>
                ) : classes.length > 0 ? (
                    classes.map((cls) => (
                        <div
                            key={cls.id}
                            className={`border-l-4 ${cls.isToday
                                ? 'border-green-500 bg-green-50'
                                : 'border-blue-500 bg-white'
                                } border rounded-lg p-5 transition-shadow`}
                        >
                            <div className="flex items-start justify-between flex-wrap gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            Scheduled
                                        </span>
                                        {cls.isToday && (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold animate-pulse">
                                                📍 Today!
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {cls.title || cls.session_title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {cls.course_title || cls.courseTitle || cls.course_name} • {cls.instructor}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-700 mt-2 flex-wrap">
                                        <span>📅 {cls.start_date || cls.scheduledDate}</span>
                                        <span>⏰ {cls.time || cls.scheduledTime}</span>
                                        {cls.duration && <span>⏱️ {cls.duration}</span>}
                                    </div>
                                    {cls.minutesUntil != null && (
                                        <p className="text-sm text-blue-600 font-medium mt-2">
                                            Starts in {formatTimeUntil(cls.minutesUntil)}
                                        </p>
                                    )}
                                </div>
                                {(cls.meeting_link || cls.googleMeetLink) && (
                                    <div className="flex flex-col gap-2">
                                        <a
                                            href={cls.meeting_link || cls.googleMeetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#053276] text-white px-6 py-2 rounded-lg hover:bg-[#042050] transition-colors font-medium inline-flex items-center justify-center gap-2"
                                        >
                                            <span>Join on Google Meet</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                        <button
                                            onClick={() => copyToClipboard(cls.meeting_link || cls.googleMeetLink)}
                                            className="bg-gray-100 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                        >
                                            Copy Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 py-10 text-center">No upcoming classes scheduled.</p>
                )}
            </div>
        </section>
    );
};

export default ClassSchedule;