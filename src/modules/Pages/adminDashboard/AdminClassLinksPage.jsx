import React, { useState, useEffect, useCallback } from 'react';
import { Video, Plus, ChevronRight, Search, Link2, AlertCircle, BookOpen, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
    getAllCoursesWithTopics,
    createClass,
    updateClass,
    deleteClass,
    getImageUrl,
} from '../../../api/courseApi';
import { notify } from '../../../utils/toast';

import ClassModal from './Components/classes/ClassModal';
import ClassesTable from './Components/classes/ClassesTable';
import Badge from './Components/shared/Badge';
import DeleteModal from './Components/shared/DeleteModal';
import Toast from './Components/shared/Toast';

const AdminClassLinksPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [expanded, setExpanded] = useState({ courseId: null, topicId: null });

    const [classModal, setClassModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const [savedToast, setSavedToast] = useState(null);

    const showToast = useCallback((msg) => {
        setSavedToast(msg);
        setTimeout(() => setSavedToast(null), 3000);
    }, []);

    // Fetch courses with topics and classes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllCoursesWithTopics();
                setCourses(data || []);
            } catch (err) {
                console.error(err);
                notify.error('Failed to load courses and classes');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Save Class (Create or Update)
    const handleSaveClass = async (topicId, form, isNew) => {
        setModalLoading(true);
        try {
            if (isNew) {
                const created = await createClass(topicId, form);
                setCourses(prev =>
                    prev.map(course =>
                        course.topics?.some(t => t.id === topicId)
                            ? {
                                  ...course,
                                  topics: course.topics.map(topic =>
                                      topic.id === topicId
                                          ? { ...topic, classes: [...(topic.classes ?? []), created] }
                                          : topic
                                  ),
                              }
                            : course
                    )
                );
                showToast('✅ Class added successfully!');
            } else {
                const updated = await updateClass(form.id, form);
                setCourses(prev =>
                    prev.map(course => ({
                        ...course,
                        topics: course.topics?.map(topic =>
                            topic.id === topicId
                                ? {
                                      ...topic,
                                      classes: topic.classes.map(cl =>
                                          cl.id === form.id ? updated : cl
                                      ),
                                  }
                                : topic
                        ) || [],
                    }))
                );
                showToast('✅ Class updated successfully!');
            }
            setClassModal(null);
        } catch (err) {
            console.error(err);
            notify.error(isNew ? 'Failed to add class' : 'Failed to update class');
        } finally {
            setModalLoading(false);
        }
    };

    // Delete Class
    const handleDeleteClass = async () => {
        if (!deleteModal) return;
        const { cls, topicId } = deleteModal;

        setModalLoading(true);
        try {
            await deleteClass(cls.id);
            setCourses(prev =>
                prev.map(course => ({
                    ...course,
                    topics: course.topics?.map(topic =>
                        topic.id === topicId
                            ? { ...topic, classes: topic.classes.filter(cl => cl.id !== cls.id) }
                            : topic
                    ) || [],
                }))
            );
            showToast('🗑️ Class deleted successfully.');
            setDeleteModal(null);
        } catch (err) {
            console.error(err);
            notify.error('Failed to delete class');
        } finally {
            setModalLoading(false);
        }
    };

    // FIXED STATS - Now correctly counts meeting_link
    const totalClasses = courses.reduce((acc, course) => {
        return acc + (course.topics?.reduce((a, topic) => a + (topic.classes?.length ?? 0), 0) ?? 0);
    }, 0);

    const linkedClasses = courses.reduce((acc, course) => {
        return acc + (course.topics?.reduce((a, topic) => {
            return a + (topic.classes?.filter(cls => cls.meeting_link || cls.meetLink).length ?? 0);
        }, 0) ?? 0);
    }, 0);

    const unlinkedClasses = totalClasses - linkedClasses;

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const term = search.toLowerCase().trim();
        if (!term) return true;
        const courseName = (course.title || course.name || '').toLowerCase();
        const instructor = (course.instructor || '').toLowerCase();
        return courseName.includes(term) || instructor.includes(term);
    });

    const toggleTopic = (courseId, topicId) => {
        setExpanded(prev => ({
            courseId: prev.courseId === courseId && prev.topicId === topicId ? null : courseId,
            topicId: prev.courseId === courseId && prev.topicId === topicId ? null : topicId,
        }));
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-white px-6 py-4 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Class Schedule & Links</h1>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                    <Link to="/admin" className="text-[#004aad] hover:underline">Dashboard</Link>
                    <ChevronRight className="w-3 h-3" />
                    Class Schedule & Links
                </p>
            </div>

            <div className="bg-gray-50 min-h-screen pb-16">
                <div className="mx-auto px-4 py-8 space-y-6">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Classes', value: totalClasses, icon: Video, color: 'text-[#004aad]', bg: 'bg-blue-50' },
                            { label: 'Links Set', value: linkedClasses, icon: Link2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Missing Links', value: unlinkedClasses, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map(({ label, value, icon: Icon, color, bg }) => (
                            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
                                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center`}>
                                    <Icon className={`w-7 h-7 ${color}`} />
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-gray-900">{value}</div>
                                    <div className="text-sm text-gray-500 mt-1">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses or instructors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-base focus:border-[#004aad] outline-none"
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    {loading ? (
                        <div className="bg-white rounded-2xl py-20 text-center">
                            <div className="w-9 h-9 border-4 border-[#004aad] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Loading courses, topics & classes...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredCourses.map((course) => {
                                const courseName = course.title || course.name || 'Untitled Course';

                                return (
                                    <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                                        {/* Course Header */}
                                        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 shrink-0">
                                                <img
                                                    src={getImageUrl(course.image)}
                                                    alt={courseName}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Badge text={course.category || 'General'} color="blue" />
                                                    <Badge text={`${course.duration_months || 0} months`} color="gray" />
                                                </div>
                                                <h3 className="font-semibold text-xl text-gray-900 truncate">{courseName}</h3>
                                                <p className="text-gray-500 text-sm">{course.instructor || 'No instructor'}</p>
                                            </div>
                                        </div>

                                        {/* Topics */}
                                        <div className="divide-y divide-gray-100">
                                            {(course.topics || []).map((topic) => {
                                                const isExpanded = expanded.courseId === course.id && expanded.topicId === topic.id;
                                                const classCount = topic.classes?.length ?? 0;
                                                const linkedCount = topic.classes?.filter(cls => 
                                                    cls.meeting_link || cls.meetLink
                                                ).length ?? 0;

                                                return (
                                                    <div key={topic.id}>
                                                        <div
                                                            className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                                            onClick={() => toggleTopic(course.id, topic.id)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <BookOpen className="w-5 h-5 text-gray-400" />
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{topic.title || 'Untitled Topic'}</p>
                                                                    <p className="text-sm text-gray-400">
                                                                        {classCount} class{classCount !== 1 ? 'es' : ''} • {linkedCount} with link
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setClassModal({ cls: null, topicId: topic.id, isNew: true });
                                                                    }}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-[#004aad] hover:bg-[#003a8c] text-white rounded-md text-sm font-medium  cursor-pointer transition-colors"
                                                                >
                                                                    <Plus className="w-4 h-4" /> Add Class
                                                                </button>
                                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                            </div>
                                                        </div>

                                                        {isExpanded && (
                                                            <div className="px-5 pb-5">
                                                                <ClassesTable
                                                                    classes={topic.classes ?? []}
                                                                    topicId={topic.id}
                                                                    onEdit={(cls) => setClassModal({ cls, topicId: topic.id, isNew: false })}
                                                                    onDelete={(cls) => setDeleteModal({ cls, topicId: topic.id })}
                                                                    onAddFirst={() => setClassModal({ cls: null, topicId: topic.id, isNew: true })}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {(!course.topics || course.topics.length === 0) && (
                                                <div className="p-8 text-center text-gray-400">
                                                    No topics created for this course yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredCourses.length === 0 && (
                                <div className="bg-white rounded-2xl py-20 text-center">
                                    <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                                    <p className="text-xl font-medium text-gray-600">No courses found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {classModal && (
                <ClassModal
                    cls={classModal.cls}
                    topicId={classModal.topicId}
                    isNew={classModal.isNew}
                    onSave={handleSaveClass}
                    onClose={() => setClassModal(null)}
                    loading={modalLoading}
                />
            )}

            {deleteModal && (
                <DeleteModal
                    title="Delete Class?"
                    message={`Delete "${deleteModal.cls.title || deleteModal.cls.name}"?`}
                    onConfirm={handleDeleteClass}
                    onClose={() => setDeleteModal(null)}
                    loading={modalLoading}
                />
            )}

            <Toast message={savedToast} />
        </>
    );
};

export default AdminClassLinksPage;