import React from 'react';
import { getImageUrl } from '../../../../../api/courseApi';
import { BookOpen, Pencil, Trash2, Tag, Settings, CheckCircle, Eye, Globe, EyeOff } from 'lucide-react';

const STATUS_STYLES = {
    published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    draft:     'bg-amber-100  text-amber-700  border-amber-200',
    archived:  'bg-gray-100   text-gray-500   border-gray-200',
};

const CourseCard = ({ course, onEdit, onDelete, onManageTopics, onTogglePublish }) => {
    const status    = course.status || 'draft';
    const isPublished = status === 'published';

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">

            {/* Course image */}
            {course.image ? (
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={getImageUrl(course.image)}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={e => e.target.parentElement.style.display = 'none'}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                    {/* Status badge on image */}
                    <div className="absolute top-3 right-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[status]}`}>
                            {status}
                        </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                        {course.category && (
                            <span className="bg-white/90 backdrop-blur text-[#004aad] text-xs font-semibold px-2.5 py-1 rounded-full">
                                {course.category}
                            </span>
                        )}
                        {course.duration_months ? (
                            <span className="bg-white/90 backdrop-blur text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                📅 {course.duration_months} month{course.duration_months !== 1 ? 's' : ''}
                            </span>
                        ) : null}
                    </div>
                </div>
            ) : (
                <div className="relative h-20 bg-linear-to-r from-[#004aad]/10 to-teal-500/10 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-[#004aad]/20" />
                    <div className="absolute top-3 right-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[status]}`}>
                            {status}
                        </span>
                    </div>
                </div>
            )}

            {/* Card body */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{course.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">👤 {course.instructor}</p>
                        {course.description && (
                            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{course.description}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            onClick={onEdit}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors cursor-pointer"
                            title="Edit course details"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors cursor-pointer"
                            title="Delete course"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Publish / Unpublish button */}
                <button
                    onClick={() => onTogglePublish(course.id, isPublished ? 'draft' : 'published')}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all mb-3 ${
                        isPublished
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                >
                    {isPublished
                        ? <><EyeOff className="w-3.5 h-3.5" /> Unpublish Course</>
                        : <><Globe className="w-3.5 h-3.5" /> Publish Course (Students can't see it yet)</>
                    }
                </button>

                {/* Topics section */}
                <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Topics ({course.whatYouLearn?.length ?? course.total_topics ?? 0})
                        </span>
                        <button
                            onClick={onManageTopics}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#004aad] text-white rounded-lg cursor-pointer text-xs font-semibold hover:bg-[#003a8c] transition-colors"
                        >
                            <Settings className="w-3 h-3" /> Manage Topics
                        </button>
                    </div>

                    {!course.whatYouLearn?.length ? (
                        <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="text-xs text-gray-400">No topics yet</p>
                            <button
                                onClick={onManageTopics}
                                className="text-xs text-[#004aad] hover:underline mt-0.5 font-medium"
                            >
                                + Add topics
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {course.whatYouLearn.map((topic, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg font-medium">
                                    <CheckCircle className="w-3 h-3 text-[#004aad] shrink-0" />
                                    {typeof topic === 'string' ? topic : (topic.title ?? topic.name ?? '')}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="px-5 pb-3">
                <p className="text-xs text-gray-300 flex items-center gap-1.5">
                    <Eye className="w-3 h-3" />
                    {isPublished
                        ? 'Visible to enrolled students'
                        : 'Not visible to students — publish to make it live'}
                </p>
            </div>
        </div>
    );
};

export default CourseCard;