import React from 'react';
import {
  FaBook, FaCheckCircle, FaClock, FaStopwatch
} from 'react-icons/fa';

import StatsCard from './components/StatsCard';
import EnrolledCourseCard from './components/EnrolledCourseCard';
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
    value: '2',
    icon: <FaBook className="text-2xl" />,
    color: 'from-blue-500 to-blue-600',
    change: '+1 this month'
  },
  {
    label: 'Completed Courses',
    value: '1',
    icon: <FaCheckCircle className="text-2xl" />,
    color: 'from-green-500 to-green-600',
    change: 'Qur\'an Reading Basics'
  },
  {
    label: 'In Progress',
    value: '1',
    icon: <FaClock className="text-2xl" />,
    color: 'from-amber-500 to-orange-600',
    change: '62% average progress'
  },
  {
    label: 'Learning Hours',
    value: '18',
    icon: <FaStopwatch className="text-2xl" />,
    color: 'from-purple-500 to-purple-600',
    change: '+4 this month'
  },
];

const enrolledCourses = [

  {
    id: 1,
    title: 'Qur\'an Reading Basics',
    slug: '/courses/quran-reading-basics',
    instructor: 'HSA Academy Team',
    progress: 100,
    totalLessons: 15,
    completedLessons: 15,
    estimatedDuration: 450, // ~7.5 hours
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'

  },
  {
    id: 2,
    title: 'Quranic Arabic – Level 1 (Reading & Tajweed)',
    slug: '/courses/quranic-arabic-level-1',
    instructor: 'Ustadha Halimatu Academy',
    progress: 55,
    totalLessons: 22,
    completedLessons: 12,
    estimatedDuration: 660,
    status: 'In Progress',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80'
  },
  {
    id: 3,
    title: 'Seerah of the Prophet ﷺ – Full Series',
    slug: '/courses/seerah-of-the-prophet',
    instructor: 'Shaykh Yasir Qadhi (adapted)',
    progress: 100,
    totalLessons: 30,
    completedLessons: 30,
    estimatedDuration: 900,
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80'
  },
];

export const upcomingClasses = [

  {
    id: 2,
    title: 'Qur\'an Recitation & Tajweed Correction Session',
    date: 'Saturday, February 7, 2026',
    time: '4:00 PM – 5:30 PM WAT',
    instructor: 'Ustadha Halimatu Academy',
    duration: '90 minutes',
    type: 'Live Correction Class',
    link: '/student/live/tajweed-correction-feb7',
    isToday: false,
  },
  {
    id: 3,
    title: 'Arabic Foundation – Vocabulary & Basic Grammar',
    date: 'Wednesday, February 11, 2026',
    time: '7:00 PM – 8:15 PM WAT',
    instructor: 'HSA Arabic Team',
    duration: '75 minutes',
    type: 'Interactive Workshop',
    link: '/student/live/arabic-foundation-feb11',
    isToday: false,
  },
  {
    id: 4,
    title: 'Tawheed Revision – Common Misconceptions',
    date: 'Sunday, February 15, 2026',
    time: '5:30 PM – 7:00 PM WAT',
    instructor: 'Shaykh (recorded) + HSA Moderator',
    duration: '90 minutes',
    type: 'Live Q&A & Discussion',
    link: '/student/live/tawheed-revision-feb15',
    isToday: false,
  }
];


// ──────────────────────────────────────────────

const StudentDashboard = () => {
  return (
    <div className="">
      <main className=" mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <section className="bg-white rounded-md p-6 md:p-8">
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
            <section className="bg-white rounded-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Classes</h2>
              <div className="space-y-5">
                {upcomingClasses.map((cls, idx) => (
                  <UpcomingClassCard key={idx} classItem={cls} />
                ))}
              </div>
              {/* <a
                href="/student/schedule"
                className="block mt-5 text-center text-[#053276] hover:underline font-medium"
              >
                View Full Schedule →
              </a> */}
            </section>

            {/* Overall Progress */}
            <section className="bg-white rounded-md p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-80">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Learning Progress
              </h2>

              <ProgressRing
                progress={studentData?.overallProgress || 0}
                size={160}
                strokeWidth={14}
                className="mb-6"
              />

              <p className="text-base font-medium text-gray-700">
                Overall Course Progress
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {studentData?.overallProgress >= 75
                  ? "You're doing amazingly well! Keep going 🤲"
                  : "Keep up the great work — you're getting there!"}
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;