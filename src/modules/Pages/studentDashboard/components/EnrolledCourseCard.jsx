import React from 'react';
import { FaDownload, FaPlayCircle, FaClock, FaCheckCircle , FaBook } from 'react-icons/fa';

const EnrolledCourseCard = ({ course }) => {
  const isCompleted = course.status === 'Completed';
  const isInProgress = course.status === 'In Progress' || course.progress > 0;
  const isNotStarted = course.progress === 0 && !isCompleted;

  // Optional: format time if you have estimated duration
  const formatTime = (minutes) => {
    if (!minutes) return '—';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#004aad]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail with overlay */}
        <div className="relative sm:w-48 md:w-56 flex-shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 sm:h-full object-cover"
          />
          
          {/* Overlay play button / status */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isCompleted ? (
              <FaCheckCircle className="text-green-400 text-6xl drop-shadow-lg" />
            ) : isNotStarted ? (
              <FaPlayCircle className="text-white text-6xl drop-shadow-lg" />
            ) : (
              <FaPlayCircle className="text-[#004aad] text-6xl drop-shadow-lg" />
            )}
          </div>

          {/* Status badge on image */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${
                isCompleted
                  ? 'bg-green-600 text-white'
                  : isInProgress
                  ? 'bg-[#004aad] text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {course.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#004aad] transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                by {course.instructor || 'HSA Academy'}
              </p>
            </div>

            {/* Small progress circle for mobile */}
            <div className="sm:hidden self-start">
              <div className="relative w-14 h-14">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={isCompleted ? '#10b981' : '#004aad'}
                    strokeWidth="3"
                    strokeDasharray={`${course.progress}, 100`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {course.progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar (desktop + tablet) */}
          <div className="mb-5 hidden sm:block">
            <div className="flex justify-between text-sm mb-1.5 text-gray-600">
              <span>Progress</span>
              <span className="font-medium text-gray-800">{course.progress}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isCompleted
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-[#004aad] to-indigo-600'
                }`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-5">
            <div className="flex items-center gap-1.5">
              <FaClock className="text-gray-500" />
              <span>{formatTime(course.estimatedDuration)} estimated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaBook className="text-gray-500" />
              <span>
                {course.completedLessons || 0}/{course.totalLessons || '?'} lessons
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-auto">
            {isCompleted ? (
              <button className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                <FaDownload />
                Download Certificate
              </button>
            ) : (
              <button className="w-full sm:w-auto px-6 py-3 bg-[#004aad] hover:bg-[#003a8c] text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                {isNotStarted ? (
                  <>
                    <FaPlayCircle />
                    Start Course
                  </>
                ) : (
                  <>
                    <FaPlayCircle />
                    Continue Learning
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;