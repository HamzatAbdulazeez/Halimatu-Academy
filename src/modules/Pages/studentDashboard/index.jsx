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
    value: '5',
    icon: <FaBook className="text-2xl" />,
    color: 'from-blue-500 to-blue-600',
    change: '+2 this semester'
  },
  {
    label: 'Completed Courses',
    value: '2',
    icon: <FaCheckCircle className="text-2xl" />,
    color: 'from-green-500 to-green-600',
    change: 'Last month'
  },
  {
    label: 'In Progress',
    value: '3',
    icon: <FaClock className="text-2xl" />,
    color: 'from-orange-500 to-orange-600',
    change: '72% avg progress'
  },
  {
    label: 'Certificates Earned',
    value: '2',
    icon: <FaTrophy className="text-2xl" />,
    color: 'from-purple-500 to-purple-600',
    change: 'View all'
  }
];

const enrolledCourses = [
  {
    id: 1,
    title: 'Tawheed & Aqeedah Fundamentals',
    instructor: 'Shaykh AbdulRahman al-Sudais',
    progress: 78,
    totalLessons: 28,
    completedLessons: 22,
    duration: '14 weeks',
    nextClass: 'Jan 29, 2026 - 4:00 PM WAT',
    status: 'In Progress',
    thumbnail: 'https://images.unsplash.com/photo-1580130379624-3a069adbffc5?w=800&q=80'
  },
  {
    id: 2,
    title: 'Quranic Arabic Level 1',
    instructor: 'Ustadha Aisha al-Farsi',
    progress: 42,
    totalLessons: 20,
    completedLessons: 8,
    duration: '10 weeks',
    nextClass: 'Jan 30, 2026 - 6:30 PM WAT',
    status: 'In Progress',
    thumbnail: 'https://images.unsplash.com/photo-1609816637235-f0b6d9c3e8c7?w=800&q=80'
  },
  {
    id: 3,
    title: 'Seerah of the Prophet ﷺ',
    instructor: 'Shaykh Yasir Qadhi',
    progress: 100,
    totalLessons: 18,
    completedLessons: 18,
    duration: '9 weeks',
    completedDate: 'Dec 20, 2025',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
  },
  {
    id: 4,
    title: 'Fiqh of Worship',
    instructor: 'Dr. Bilal Philips',
    progress: 100,
    totalLessons: 16,
    completedLessons: 16,
    duration: '8 weeks',
    completedDate: 'Nov 10, 2025',
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1580130379624-3a069adbffc5?w=800&q=80'
  }
];

const upcomingClasses = [
  {
    title: 'Tafseer Juz 30 (Live)',
    date: 'Tomorrow, Jan 28, 2026',
    time: '5:00 PM WAT',
    instructor: 'Shaykh Muhammad al-Shareef',
    duration: '90 minutes',
    type: 'Live Tafseer'
  },
  {
    title: 'Quranic Arabic Grammar Review',
    date: 'Jan 30, 2026',
    time: '6:30 PM WAT',
    instructor: 'Ustadha Aisha al-Farsi',
    duration: '60 minutes',
    type: 'Interactive Session'
  },
  {
    title: 'Hadith Sciences – 40 Hadith Nawawi',
    date: 'Feb 1, 2026',
    time: '4:00 PM WAT',
    instructor: 'Shaykh AbdulNasir Jangda',
    duration: '120 minutes',
    type: 'Lecture'
  }
];

const recentActivities = [
  {
    action: 'Completed lesson',
    detail: 'Pillars of Salah',
    course: 'Fiqh of Worship',
    time: '3 hours ago',
    icon: <FaCheckCircle className="text-green-500 text-xl" />
  },
  {
    action: 'Submitted assignment',
    detail: 'Tawheed Essay – Week 6',
    course: 'Tawheed & Aqeedah',
    time: 'Yesterday',
    icon: <FaFileAlt className="text-blue-500 text-xl" />
  },
  {
    action: 'Earned certificate',
    detail: 'Fiqh of Worship',
    course: 'Completed Course',
    time: 'Dec 20, 2025',
    icon: <FaTrophy className="text-purple-500 text-xl" />
  },
  {
    action: 'Started new module',
    detail: 'Sarf Level 2 – Verb Patterns',
    course: 'Quranic Arabic Level 1',
    time: '2 days ago',
    icon: <FaPlay className="text-orange-500 text-xl" />
  }
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

            {/* Recent Activity */}
            <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity, idx) => (
                  <RecentActivityItem key={idx} activity={activity} />
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