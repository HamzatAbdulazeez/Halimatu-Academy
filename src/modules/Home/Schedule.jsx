import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, BookOpen, Users, Download, Bell, ChevronLeft, ChevronRight, Sparkles, Filter } from 'lucide-react';
import BannerSection from './Components/Breadcrumb';

const SchedulePage = () => {
    const [selectedWeek, setSelectedWeek] = useState(0);
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [viewMode, setViewMode] = useState('week'); // week or month

    const [currentTime, setCurrentTime] = useState(new Date());
      
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000); // Updates every second
  
      return () => clearInterval(timer);
    }, []);
  
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
  
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    };

    const levels = [
        { value: 'all', label: 'All Levels', color: 'from-gray-500 to-gray-700' },
        { value: 'level1', label: 'Level 1', color: 'from-blue-500 to-cyan-500' },
        { value: 'level2', label: 'Level 2', color: 'from-emerald-500 to-teal-500' },
        { value: 'level3', label: 'Level 3', color: 'from-purple-500 to-pink-500' },
        { value: 'level4', label: 'Level 4', color: 'from-orange-500 to-amber-500' }
    ];

    const subjects = {
        aqeedah: { name: 'Aqeedah', icon: '📿', color: 'from-indigo-500 to-purple-500' },
        tafsir: { name: 'Tafsir', icon: '📖', color: 'from-teal-500 to-cyan-500' },
        hadith: { name: 'Hadith', icon: '📜', color: 'from-green-500 to-emerald-500' },
        seerah: { name: 'Seerah', icon: '🕌', color: 'from-amber-500 to-orange-500' },
        fiqh: { name: 'Fiqh', icon: '⚖️', color: 'from-emerald-500 to-teal-500' },
        tarbiyah: { name: 'Tarbiyah', icon: '🤲', color: 'from-pink-500 to-rose-500' },
        arabic: { name: 'Arabic', icon: '✍️', color: 'from-violet-500 to-purple-500' }
    };

    const weekDays = [
        { day: 'Monday', date: 'Jan 20, 2026' },
        { day: 'Tuesday', date: 'Jan 21, 2026' },
        { day: 'Wednesday', date: 'Jan 22, 2026' },
        { day: 'Thursday', date: 'Jan 23, 2026' },
        { day: 'Friday', date: 'Jan 24, 2026' },
        { day: 'Saturday', date: 'Jan 25, 2026' },
        { day: 'Sunday', date: 'Jan 26, 2026' }
    ];

    const schedule = [
        {
            day: 0, // Monday
            time: '9:00 AM - 10:30 AM',
            subject: 'aqeedah',
            level: 'level1',
            title: 'Introduction to Tawheed',
            instructor: 'Sheikh Abdullah Rahman',
            type: 'Live Lecture',
            room: 'Virtual Room A'
        },
        {
            day: 0,
            time: '11:00 AM - 12:30 PM',
            subject: 'arabic',
            level: 'level1',
            title: 'Arabic Alphabet & Basic Grammar',
            instructor: 'Dr. Fatima Hassan',
            type: 'Interactive Session',
            room: 'Virtual Room B'
        },
        {
            day: 1, // Tuesday
            time: '9:00 AM - 10:30 AM',
            subject: 'tafsir',
            level: 'level2',
            title: 'Surah Al-Baqarah Commentary',
            instructor: 'Sheikh Omar Khalid',
            type: 'Live Lecture',
            room: 'Virtual Room A'
        },
        {
            day: 1,
            time: '2:00 PM - 3:30 PM',
            subject: 'fiqh',
            level: 'level1',
            title: 'Purification & Prayer Basics',
            instructor: 'Sheikh Ahmed Ali',
            type: 'Practical Workshop',
            room: 'Virtual Room C'
        },
        {
            day: 2, // Wednesday
            time: '10:00 AM - 11:30 AM',
            subject: 'hadith',
            level: 'level1',
            title: '40 Hadith - Part 1',
            instructor: 'Dr. Ibrahim Yusuf',
            type: 'Live Lecture',
            room: 'Virtual Room A'
        },
        {
            day: 2,
            time: '1:00 PM - 2:30 PM',
            subject: 'seerah',
            level: 'level2',
            title: 'The Meccan Period',
            instructor: 'Sheikh Muhammad Tariq',
            type: 'Interactive Session',
            room: 'Virtual Room B'
        },
        {
            day: 3, // Thursday
            time: '9:00 AM - 10:30 AM',
            subject: 'arabic',
            level: 'level2',
            title: 'Intermediate Grammar & Morphology',
            instructor: 'Dr. Fatima Hassan',
            type: 'Live Lecture',
            room: 'Virtual Room B'
        },
        {
            day: 3,
            time: '3:00 PM - 4:30 PM',
            subject: 'tarbiyah',
            level: 'level1',
            title: 'Islamic Character & Ethics',
            instructor: 'Sheikh Khalid Mahmoud',
            type: 'Discussion',
            room: 'Virtual Room C'
        },
        {
            day: 4, // Friday
            time: '10:00 AM - 11:30 AM',
            subject: 'fiqh',
            level: 'level3',
            title: 'Advanced Fiqh Issues',
            instructor: 'Sheikh Ahmed Ali',
            type: 'Live Lecture',
            room: 'Virtual Room A'
        },
        {
            day: 5, // Saturday
            time: '9:00 AM - 10:30 AM',
            subject: 'tafsir',
            level: 'level1',
            title: 'Understanding Juz Amma',
            instructor: 'Sheikh Omar Khalid',
            type: 'Live Lecture',
            room: 'Virtual Room A'
        },
        {
            day: 5,
            time: '2:00 PM - 3:30 PM',
            subject: 'hadith',
            level: 'level3',
            title: 'Hadith Authentication Methods',
            instructor: 'Dr. Ibrahim Yusuf',
            type: 'Workshop',
            room: 'Virtual Room B'
        },
        {
            day: 6, // Sunday
            time: '10:00 AM - 11:30 AM',
            subject: 'seerah',
            level: 'level1',
            title: 'Early Life of the Prophet ﷺ',
            instructor: 'Sheikh Muhammad Tariq',
            type: 'Live Lecture',
            room: 'Virtual Room A'
        }
    ];

    const filteredSchedule = schedule.filter(item =>
        selectedLevel === 'all' || item.level === selectedLevel
    );

    const upcomingEvents = [
        {
            date: 'Jan 28, 2026',
            title: 'Midterm Exams Begin',
            type: 'Assessment',
            color: 'from-red-500 to-rose-500'
        },
        {
            date: 'Feb 1, 2026',
            title: 'Guest Lecture: Contemporary Fiqh',
            type: 'Special Event',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            date: 'Feb 5, 2026',
            title: 'Q&A Session with Scholars',
            type: 'Interactive',
            color: 'from-blue-500 to-cyan-500'
        }
    ];

    return (
        <>
        <BannerSection
                title="Islamic Learning Schedule"
                subtitle="Organize Your Classes and Study Sessions"
                backgroundImage="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768633927/Halimatu-Academy-Images/Islamic-Education-1_eufmf8.jpg"
            />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

                {/* Hero Section */}
                <div className="relative overflow-hidden bg-[#004aad] text-white py-20 px-4">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}></div>

                    <div className="relative z-10 Resizer mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left space-y-4">
                                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-xl rounded-full">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="text-sm font-semibold tracking-wider uppercase">Class Schedule</span>
                                </div>

                                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                                    Your Learning Schedule
                                </h1>

                                <p className="text-base text-white/90 leading-relaxed max-w-2xl">
                                    Stay organized with your classes, lectures, and study sessions
                                </p>
                            </div>

                            <div className="flex gap-4">
                               
                                <button className="px-6 py-3 bg-white text-[#004aad] rounded-full hover transition-all duration-300 flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    Set Reminders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="Resizer mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <span className="font-semibold text-gray-900">Filter by Level:</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {levels.map((level) => (
                                    <button
                                        key={level.value}
                                        onClick={() => setSelectedLevel(level.value)}
                                        className={`px-6 py-2 rounded-md text-base transition-all duration-300 ${selectedLevel === level.value
                                                ? `bg-linear ${level.color} text-white text-base scale-105`
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {level.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="Resizer mx-auto px-4 pb-24">
                    <div className="grid lg:grid-cols-4 gap-8">

                        {/* Weekly Schedule */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Week Navigation */}
                            <div className="bg-white rounded-2xl p-6">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setSelectedWeek(selectedWeek - 1)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                                    </button>

                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-900">Week {selectedWeek + 1}</h2>
                                        <p className="text-gray-600">January 20 - January 26, 2026</p>
                                    </div>

                                    <button
                                        onClick={() => setSelectedWeek(selectedWeek + 1)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Schedule Grid */}
                            <div className="space-y-6">
                                {weekDays.map((dayInfo, dayIndex) => {
                                    const dayClasses = filteredSchedule.filter(item => item.day === dayIndex);

                                    if (dayClasses.length === 0 && selectedLevel !== 'all') return null;

                                    return (
                                        <div key={dayIndex} className="bg-white rounded-2xl overflow-hidden">
                                            {/* Day Header */}
                                            <div className="bg-linear px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white">{dayInfo.day}</h3>
                                                        <p className="text-emerald-100 text-sm">{dayInfo.date}</p>
                                                    </div>
                                                    <Calendar className="w-6 h-6 text-white/80" />
                                                </div>
                                            </div>

                                            {/* Classes */}
                                            <div className="p-6 space-y-4">
                                                {dayClasses.length === 0 ? (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                        <p>No classes scheduled for this day</p>
                                                    </div>
                                                ) : (
                                                    dayClasses.map((classItem, classIndex) => {
                                                        const subject = subjects[classItem.subject];
                                                        return (
                                                            <div
                                                                key={classIndex}
                                                                className="group relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                                            >
                                                                <div className={`absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b ${subject.color} rounded-l-xl`}></div>

                                                                <div className="pl-4 space-y-3">
                                                                    {/* Class Header */}
                                                                    <div className="flex items-start justify-between gap-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-12 h-12 bg-gradient-to-br ${subject.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                                                                                {subject.icon}
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                                                    {classItem.title}
                                                                                </h4>
                                                                                <p className="text-emerald-600 font-medium text-sm">{subject.name}</p>
                                                                            </div>
                                                                        </div>
                                                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                                                            {levels.find(l => l.value === classItem.level)?.label}
                                                                        </span>
                                                                    </div>

                                                                    {/* Class Details */}
                                                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                                                        <div className="flex items-center gap-2 text-gray-600">
                                                                            <Clock className="w-4 h-4 text-emerald-600" />
                                                                            <span className="font-medium">{classItem.time}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-gray-600">
                                                                            <Users className="w-4 h-4 text-blue-600" />
                                                                            <span>{classItem.instructor}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-gray-600">
                                                                            <Video className="w-4 h-4 text-purple-600" />
                                                                            <span>{classItem.type}</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Action Button */}
                                                                    <button className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                                                                        <Video className="w-4 h-4" />
                                                                        Join Class
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Current Time */}
                            <div className="bg-gradient rounded-md p-6 text-white text-center">
                                <Clock className="w-12 h-12 mx-auto mb-3" />
                                <div className="text-4xl font-bold mb-2">{formatTime(currentTime)}</div>
                                <div className="text-emerald-100">{formatDate(currentTime)}</div>
                            </div>

                            {/* Upcoming Events */}
                            <div className="bg-white rounded-md p-6 space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Bell className="w-6 h-6 text-emerald-600" />
                                    Upcoming Events
                                </h3>
                                <div className="space-y-4">
                                    {upcomingEvents.map((event, index) => (
                                        <div key={index} className="relative">
                                            <div className={`absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b ${event.color} rounded-full`}></div>
                                            <div className="pl-4 space-y-1">
                                                <div className="text-xs text-gray-500 font-medium">{event.date}</div>
                                                <div className="font-bold text-gray-900">{event.title}</div>
                                                <div className="text-xs text-emerald-600 font-semibold">{event.type}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl p-6 space-y-4">
                                <h3 className="text-xl font-bold text-gray-900">This Week</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                                        <span className="text-gray-700 font-medium">Total Classes</span>
                                        <span className="text-2xl font-bold text-blue-600">12</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                                        <span className="text-gray-700 font-medium">Completed</span>
                                        <span className="text-2xl font-bold text-emerald-600">8</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                                        <span className="text-gray-700 font-medium">Upcoming</span>
                                        <span className="text-2xl font-bold text-purple-600">4</span>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="bg-white rounded-2xl p-6 space-y-4">
                                <h3 className="text-xl font-bold text-gray-900">Subjects</h3>
                                <div className="space-y-2">
                                    {Object.entries(subjects).map(([key, subject]) => (
                                        <div key={key} className="flex items-center gap-3">
                                            <div className={`w-8 h-8 bg-gradient-to-br ${subject.color} rounded-lg flex items-center justify-center text-lg`}>
                                                {subject.icon}
                                            </div>
                                            <span className="text-gray-700 font-medium text-sm">{subject.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
            </div>
        </>
    );
};

export default SchedulePage;