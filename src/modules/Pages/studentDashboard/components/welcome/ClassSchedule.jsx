import React from 'react';

const formatTimeUntil = (minutes) => {
    if (!minutes || minutes < 0) return "Starting soon";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
};

const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('✅ Meeting link copied to clipboard!');
};

const ClassSchedule = ({ classes = [], loading }) => {
    return (
        <section className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🕐 Upcoming Classes</h2>
                <span className="text-sm text-gray-500">
                    {loading ? '...' : `${classes.length} scheduled`}
                </span>
            </div>

            <div className="space-y-5">
                {loading ? (
                    <p className="text-gray-400 py-12 text-center">Loading your class schedule...</p>
                ) : classes.length > 0 ? (
                    classes.map((cls) => {
                        const meetingLink = cls.meeting_link || cls.googleMeetLink || cls.link;
                        const isToday = cls.isToday || false;

                        return (
                            <div
                                key={cls.id}
                                className={`border-l-4 ${
                                    isToday 
                                        ? 'border-emerald-500 bg-emerald-50' 
                                        : 'border-blue-500 bg-white'
                                } border rounded-xl p-6 hover:shadow-md transition-all`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                                    {/* Left Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                                            <span className="px-4 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                Live Class
                                            </span>
                                            {isToday && (
                                                <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold animate-pulse">
                                                    📍 Today
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {cls.title || cls.session_title || "Class Session"}
                                        </h3>

                                        <p className="text-gray-600 mb-4">
                                            {cls.course_title || cls.courseTitle || cls.course_name} • {cls.instructor || "Instructor"}
                                        </p>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                📅 <span>{cls.start_date || cls.scheduledDate || "TBD"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                ⏰ <span>{cls.time || cls.scheduledTime || "TBD"}</span>
                                            </div>
                                            {cls.duration && (
                                                <div className="flex items-center gap-2">
                                                    ⏱️ <span>{cls.duration}</span>
                                                </div>
                                            )}
                                        </div>

                                        {cls.minutesUntil != null && (
                                            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-4 py-1.5 rounded-lg">
                                                ⏳ Starts in {formatTimeUntil(cls.minutesUntil)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Join Buttons */}
                                    {meetingLink && (
                                        <div className="flex flex-col gap-3 lg:min-w-[180px]">
                                            <a
                                                href={meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#1a73e8] hover:bg-[#185abc] text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                            >
                                                Join Google Meet
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7M5 12h14" />
                                                </svg>
                                            </a>

                                            <button
                                                onClick={() => copyToClipboard(meetingLink)}
                                                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                                            >
                                                📋 Copy Link
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-12 text-center">
                        <div className="text-6xl mb-4">🗓️</div>
                        <p className="text-gray-500 text-lg">No upcoming classes scheduled yet.</p>
                        <p className="text-sm text-gray-400 mt-2">
                            New classes will appear here once your instructor schedules them.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ClassSchedule;