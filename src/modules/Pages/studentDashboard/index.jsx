import React from 'react';
import {
  FaBook, FaCheckCircle, FaClock, FaTrophy,
  FaCalendar, FaVideo, FaCertificate, FaPlay, FaDownload, FaFileAlt,
} from 'react-icons/fa';

import StatsCard from './components/StatsCard';
import EnrolledCourseCard from './components/EnrolledCourseCard';
import RecentActivityItem from './components/RecentActivityItem';
import UpcomingClassCard from './components/UpcomingClassCard';
import ProgressRing from './components/ProgressRing';

const studentData = {
  name: "Abdul",
  email: "abdul@example.com",
  studentId: "HSA-2025-042",
  course: "Islamic Studies Program",
  enrollmentDate: "September 15, 2025",
  overallProgress: 68
};

const stats = [
  {
    label: 'Courses Enrolled',
    value: '6',
    icon: <FaBook className="text-2xl" />,
    color: 'from-blue-500 to-blue-600',
    change: '+1 this month'
  },
  {
    label: 'Completed Courses',
    value: '3',
    icon: <FaCheckCircle className="text-2xl" />,
    color: 'from-green-500 to-green-600',
    change: '2 this semester'
  },
  {
    label: 'In Progress',
    value: '3',
    icon: <FaClock className="text-2xl" />,
    color: 'from-amber-500 to-orange-600',
    change: '68% average progress'
  },
];

const enrolledCourses = [
  {
    id: 1,
    title: 'Tawheed & Aqeedah Fundamentals',
    instructor: 'Shaykh Saalih al-Fawzaan',
    progress: 82,
    totalLessons: 24,
    completedLessons: 20,
    duration: '12 weeks',
    nextClass: 'Today, Jan 30, 2026 - 5:00 PM WAT',
    status: 'In Progress',
    thumbnail: 'https://images.unsplash.com/photo-1580130379624-3a069adbffc5?w=800&q=80'
  },
  {
    id: 2,
    title: 'Quranic Arabic – Level 1 (Reading & Tajweed)',
    instructor: 'Ustadha Farhat Hashmi',
    progress: 55,
    totalLessons: 22,
    completedLessons: 12,
    duration: '11 weeks',
    nextClass: 'Tomorrow, Jan 31, 2026 - 6:00 PM WAT',
    status: 'In Progress',
    thumbnail: 'https://images.unsplash.com/photo-1609816637235-f0b6d9c3e8c7?w=800&q=80'
  },
  {
    id: 3,
    title: 'Seerah of the Prophet ﷺ – Full Series',
    instructor: 'Shaykh Yasir Qadhi',
    progress: 100,
    totalLessons: 30,
    completedLessons: 30,
    duration: '15 weeks',
    completedDate: 'January 5, 2026',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
  },
 
  
];

const upcomingClasses = [
  {
    title: 'Tawheed & Aqeedah – Live Q&A',
    date: 'Today, January 30, 2026',
    time: '5:00 PM – 6:30 PM WAT',
    instructor: 'Shaykh Saalih al-Fawzaan (recorded + live discussion)',
    duration: '90 minutes',
    type: 'Live Session',
    link: '#join-class' // or real zoom/google meet link later
  },
  {
    title: 'Quranic Arabic – Reading Practice',
    date: 'Tomorrow, January 31, 2026',
    time: '6:00 PM – 7:15 PM WAT',
    instructor: 'Ustadha Farhat Hashmi',
    duration: '75 minutes',
    type: 'Interactive Class'
  },
];


// ──────────────────────────────────────────────

const StudentDashboard = () => {
  return (
    <div className="">
      <main className=" mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                <a href="/student/courses" className="text-[#053276] hover:underline font-medium">
                  View All →
                </a>
              </div>
              <div className="space-y-6">
                {enrolledCourses.map((course) => (
                  <EnrolledCourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-8">
            {/* Upcoming Classes */}
            <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Classes</h2>
              <div className="space-y-5">
                {upcomingClasses.map((cls, idx) => (
                  <UpcomingClassCard key={idx} classItem={cls} />
                ))}
              </div>
              <a
                href="/student/schedule"
                className="block mt-5 text-center text-[#053276] hover:underline font-medium"
              >
                View Full Schedule →
              </a>
            </section>

            {/* Overall Progress */}
            <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Progress</h2>
              <ProgressRing progress={studentData.overallProgress} />
              <p className="text-sm text-gray-600 mt-4">Overall Course Progress</p>
              <p className="text-xs text-gray-500 mt-2">Keep up the great work!</p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;