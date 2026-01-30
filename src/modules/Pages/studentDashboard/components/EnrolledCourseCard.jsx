import React from 'react';
import { FaDownload } from 'react-icons/fa';

const EnrolledCourseCard = ({ course }) => {
  const isCompleted = course.status === 'Completed';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#053276]/50 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-5">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full sm:w-32 h-32 object-cover rounded-xl"
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600">by {course.instructor}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                isCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {course.status}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-800">{course.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#053276] to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <span className="text-gray-600">
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
            {isCompleted ? (
              <button className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 text-sm">
                <FaDownload /> Download Certificate
              </button>
            ) : (
              <button className="px-5 py-2.5 bg-[#053276] text-white rounded-lg hover:bg-[#053276]/90 transition-colors font-medium text-sm">
                Continue Learning
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;