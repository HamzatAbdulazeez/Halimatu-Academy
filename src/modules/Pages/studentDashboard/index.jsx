import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StudentWelcomeDashboard = () => {
  const [user, setUser] = useState(null);

  // ── Pull user from localStorage on mount ──────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user"); 
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    }
  }, []);

  // ── Derived display values ─────────────────────────────────────
  const fullName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : "Student";

  const initials = user
    ? ((user.first_name?.charAt(0) || "") + (user.last_name?.charAt(0) || "")).toUpperCase()
    : "S";

  const studentId  = user?.student_id    || "—";
  const email      = user?.email         || "—";
  const profilePic = user?.profile_picture || null;

  // ── Static course / schedule data (replace with API later) ────
  const enrolledCourses = [
    {
      id: 1,
      title: 'Quranic Studies - Complete Foundation',
      instructor: 'Ustadha Halimatu Academy',
      duration: '1 Year Program',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      category: 'Quranic Studies',
      topics: ['Tajweed Rules', 'Quran Recitation', 'Tafsir & Interpretation', 'Memorization Techniques', 'Quranic Arabic']
    },
    {
      id: 2,
      title: 'Arabic Language - Complete Mastery',
      instructor: 'Shaykh Ahmed Al-Masri',
      duration: '1 Year Program',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      category: 'Arabic Language',
      topics: ['Arabic Grammar (Nahw)', 'Arabic Morphology (Sarf)', 'Conversational Arabic', 'Reading & Writing', 'Quranic Vocabulary']
    }
  ];

  const classSchedule = [
    {
      id: 1,
      courseTitle: 'Quranic Studies',
      sessionTitle: 'Understanding Surah Al-Mulk',
      instructor: 'Ustadha Halimatu',
      scheduledDate: 'Saturday, February 14, 2026',
      scheduledTime: '4:00 PM WAT',
      duration: '90 minutes',
      googleMeetLink: 'https://meet.google.com/iym-uyfg-onv',
      minutesUntil: 4320,
      isToday: false
    },
    {
      id: 2,
      courseTitle: 'Arabic Language',
      sessionTitle: 'Arabic Grammar - Past Tense Verbs',
      instructor: 'Shaykh Ahmed Al-Masri',
      scheduledDate: 'Sunday, February 15, 2026',
      scheduledTime: '5:00 PM WAT',
      duration: '75 minutes',
      googleMeetLink: 'https://meet.google.com/afp-dtxj-dyy',
      minutesUntil: 5760,
      isToday: false
    }
  ];

  const learningStats = {
    classesAttended: 6,
    currentStreak: 3,
    enrollmentDate: user?.created_at
      ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "—",
    subscriptionType: '6 Months - Quranic Studies'
  };

  const formatTimeUntil = (minutes) => {
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

  return (
    <>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient text-white">
          <div className="py-8 px-4 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {/* Profile picture or initials avatar */}
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={fullName}
                    className="w-16 h-16 rounded-full border-4 border-white/30 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center text-xl font-bold text-white">
                    {initials}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold">
                  Welcome ,  {fullName}! 👋
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Ready to continue your Islamic learning journey?
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <p className="text-sm text-blue-100">Student ID</p>
                <p className="font-semibold">{studentId}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm font-medium">Enrolled Courses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">2</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Active programs</p>
            </div>

            <div className="bg-white rounded-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm font-medium">Classes Attended</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{learningStats.classesAttended}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Total sessions</p>
            </div>

            <div className="bg-white rounded-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black text-sm font-medium">Current Streak</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{learningStats.currentStreak}</p>
                </div>
                <div className="text-4xl">🔥</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Days in a row</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Enrolled Courses */}
              <section className="bg-white rounded-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">📚 My Enrolled Courses</h2>
                  <span className="text-sm text-gray-500">2 Active Courses</span>
                </div>
                <div className="space-y-6">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full sm:w-48 h-48 object-cover"
                        />
                        <div className="flex-1 p-5">
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2">
                              {course.category}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">Instructor: {course.instructor}</p>
                            <p className="text-sm text-blue-600 font-medium">📅 {course.duration}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">What you will learn:</p>
                            <div className="flex flex-wrap gap-2">
                              {course.topics.map((topic, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Class Schedule */}
              <section className="bg-white rounded-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">🕐 Upcoming Class Schedule</h2>
                </div>
                <div className="space-y-4">
                  {classSchedule.map((classItem) => (
                    <div
                      key={classItem.id}
                      className={`border-l-4 ${classItem.isToday ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-white'} border rounded-lg p-5 transition-shadow`}
                    >
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              Scheduled
                            </span>
                            {classItem.isToday && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold animate-pulse">
                                📍 Today!
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{classItem.sessionTitle}</h3>
                          <p className="text-sm text-gray-600 mb-1">{classItem.courseTitle} • {classItem.instructor}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-700 mt-2 flex-wrap">
                            <span>📅 {classItem.scheduledDate}</span>
                            <span>⏰ {classItem.scheduledTime}</span>
                            <span>⏱️ {classItem.duration}</span>
                          </div>
                          <p className="text-sm text-blue-600 font-medium mt-2">
                            Starts in {formatTimeUntil(classItem.minutesUntil)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <a
                            href={classItem.googleMeetLink}
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
                            onClick={() => copyToClipboard(classItem.googleMeetLink)}
                            className="bg-gray-100 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              {/* Subscription Info */}
              <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Subscription Details</h2>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                    <p className="font-bold text-lg text-gray-900">{learningStats.subscriptionType}</p>
                    <p className="text-xs text-gray-500 mt-2">✓ Access to Quranic Studies program</p>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-1">Subscription Status</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <p className="font-semibold text-green-700">Active</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Enrolled since {learningStats.enrollmentDate}
                    </p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-lg p-6">
                    <p className="text-sm text-blue-100 mb-2">💡 Upgrade to unlock Arabic Language course!</p>
                    <Link
                      to="/student/subscription"
                      className="block w-full bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center text-sm"
                    >
                      Upgrade Now →
                    </Link>
                  </div>
                </div>
              </section>

              {/* Daily Reminder */}
              <section className="bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-md p-6">
                <h2 className="text-xl font-bold mb-3">💡 Daily Reminder</h2>
                <p className="text-blue-100 text-sm mb-4">
                  &quot;Seek knowledge from the cradle to the grave.&quot;
                  <br />
                  <span className="text-xs italic">- Prophet Muhammad ﷺ</span>
                </p>
                <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium">🎯 Today&apos;s Goal</p>
                  <p className="text-xs text-blue-100 mt-1">
                    Complete at least one lesson and review yesterday&apos;s notes
                  </p>
                </div>
              </section>

              {/* Account Info */}
              <section className="bg-white rounded-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Account Info</h2>
                <div className="space-y-3 text-sm">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    {profilePic ? (
                      <img src={profilePic} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#004aad] flex items-center justify-center text-sm font-bold text-white">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{fullName}</p>
                      <p className="text-xs text-gray-400">{studentId}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900 text-xs break-all">{email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Enrolled Since</p>
                    <p className="font-semibold text-gray-900">{learningStats.enrollmentDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <p className="font-semibold text-green-700 capitalize">{user?.status || "Active"}</p>
                    </div>
                  </div>
                  <a
                    href="/settings"
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg transition-colors font-medium text-center mt-4"
                  >
                    Manage Account
                  </a>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentWelcomeDashboard;