/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, ChevronRight, Search, Tag, CheckCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    createTopic,
    deleteTopic,
    getCourseTopics,
} from '../../../api/courseApi';
import { notify } from '../../../utils/toast';

import TopicsModal from './Components/topics/TopicsModal';
import CourseModal from './Components/topics/CourseModal';
import CourseCard from './Components/topics/CourseCard';
import DeleteModal from './Components/shared/DeleteModal';
import Toast from './Components/shared/Toast';

const AdminTopicsPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [topicsModal, setTopicsModal] = useState(null);
    const [courseModal, setCourseModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [savedToast, setSavedToast] = useState(null);

    const showToast = useCallback((msg) => {
        setSavedToast(msg);
        setTimeout(() => setSavedToast(null), 3000);
    }, []);

    // Fetch courses + topics
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllCourses();
                const list = Array.isArray(data) ? data.filter(Boolean) : [];

                const withTopics = await Promise.all(
                    list.map(async (course) => {
                        try {
                            const topics = await getCourseTopics(course.id);
                            return {
                                ...course,
                                whatYouLearn: Array.isArray(topics) ? topics : [],
                            };
                        } catch {
                            return { ...course, whatYouLearn: [] };
                        }
                    })
                );

                setCourses(withTopics);
            } catch (err) {
                console.error(err);
                notify.error('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Save Topics
    const handleSaveTopics = async (courseId, newTopics) => {
        setModalLoading(true);
        try {
            const course = courses.find(c => c.id === courseId);
            const oldTopics = course?.whatYouLearn ?? [];

            // Delete removed topics
            const newIds = new Set(newTopics.filter(t => t.id).map(t => t.id));
            const toDelete = oldTopics.filter(t => t.id && !newIds.has(t.id));

            for (const topic of toDelete) {
                await deleteTopic(topic.id);
            }

            // Create new topics
            const created = [];
            for (const item of newTopics) {
                if (item.id) {
                    created.push(item);
                    continue;
                }
                const title = (item.title ?? '').trim();
                if (!title) continue;
                const newTopic = await createTopic(courseId, title);
                created.push(newTopic);
            }

            // Refresh topics from server
            const freshTopics = await getCourseTopics(courseId).catch(() => created);

            setCourses(prev =>
                prev.map(c =>
                    c.id === courseId
                        ? { ...c, whatYouLearn: Array.isArray(freshTopics) ? freshTopics : created }
                        : c
                )
            );

            setTopicsModal(null);
            showToast('✅ Topics updated successfully!');
        } catch (err) {
            console.error(err);
            notify.error('Failed to update topics');
        } finally {
            setModalLoading(false);
        }
    };

    // Save Course (Create or Update)
    const handleSaveCourse = async (form) => {
        const isNew = courseModal?.isNew || false;
        setModalLoading(true);

        try {
            let savedCourse;

            if (isNew) {
                savedCourse = await createCourse(form);
                setCourses(prev => [...prev, { ...savedCourse, whatYouLearn: [] }]);
                showToast('✅ Course created successfully!');
            } else {
                savedCourse = await updateCourse(form.id, form);
                setCourses(prev =>
                    prev.map(c =>
                        c.id === form.id
                            ? { ...c, ...savedCourse, whatYouLearn: c.whatYouLearn || [] }
                            : c
                    )
                );
                showToast('✅ Course updated successfully!');
            }

            setCourseModal(null);
        } catch (err) {
            console.error('Course Save Error:', err?.response?.data || err);
            const errorMsg = err?.response?.data?.message || 'Something went wrong';
            notify.error(isNew ? `Failed to create course: ${errorMsg}` : `Failed to update course: ${errorMsg}`);
        } finally {
            setModalLoading(false);
        }
    };

    // Delete Course
    const handleDeleteCourse = async () => {
        if (!deleteModal) return;
        setModalLoading(true);
        try {
            await deleteCourse(deleteModal.id);
            setCourses(prev => prev.filter(c => c.id !== deleteModal.id));
            setDeleteModal(null);
            showToast('🗑️ Course deleted successfully.');
        } catch (err) {
            console.error(err);
            notify.error('Failed to delete course');
        } finally {
            setModalLoading(false);
        }
    };

    const totalTopics = courses.reduce((a, c) => a + (c.whatYouLearn?.length ?? 0), 0);

    const q = search.toLowerCase().trim();
    const filtered = courses.filter(c => {
        if (!c) return false;
        return (
            (c.title || c.name || '').toLowerCase().includes(q) ||
            (c.instructor || '').toLowerCase().includes(q) ||
            (c.category || '').toLowerCase().includes(q)
        );
    });

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-white px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">What You Will Learn</h1>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                            <Link to="/admin" className="text-[#004aad] hover:underline">Dashboard</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span>Course Management</span>
                            <ChevronRight className="w-3 h-3" />
                            What You Will Learn
                        </p>
                    </div>
                    <button
                        onClick={() => setCourseModal({ course: null, isNew: true })}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#004aad] text-white rounded-xl cursor-pointer hover:bg-[#003a8c] transition-colors font-semibold text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Course
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen pb-16">
                <div className="mx-auto px-4 py-8 space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-[#004aad]', bg: 'bg-blue-50' },
                            { label: 'Total Topics', value: totalTopics, icon: Tag, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { label: 'Avg Topics / Course', value: courses.length ? Math.round(totalTopics / courses.length) : 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        ].map(({ label, value, icon: Icon, color, bg }) => (
                            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
                                    <Icon className={`w-6 h-6 ${color}`} />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{value}</div>
                                    <div className="text-xs text-gray-400">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by course title, instructor or category..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                            />
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                        <Eye className="w-5 h-5 text-[#004aad] shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800">
                            Topics set here appear on the student's <strong>Enrolled Courses</strong> page under "What you will learn".
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-16 text-gray-400">
                            <div className="w-8 h-8 border-2 border-[#004aad] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm">Loading courses...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filtered.map(course => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onEdit={() => setCourseModal({ course, isNew: false })}
                                    onDelete={() => setDeleteModal(course)}
                                    onManageTopics={() => setTopicsModal(course)}
                                />
                            ))}

                            {/* Add New Course Button Card */}
                            <button
                                onClick={() => setCourseModal({ course: null, isNew: true })}
                                className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 hover:border-[#004aad] hover:bg-blue-50/30 transition-all group cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-gray-100 group-hover:bg-[#004aad]/10 rounded-2xl flex items-center justify-center transition-colors">
                                    <Plus className="w-7 h-7 text-gray-400 group-hover:text-[#004aad] transition-colors cursor-pointer" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-500 group-hover:text-[#004aad]">Add New Course</p>
                                    <p className="text-xs text-gray-400 mt-1">Click to add a new course with topics</p>
                                </div>
                            </button>

                            {filtered.length === 0 && courses.length > 0 && (
                                <div className="col-span-2 text-center py-16 text-gray-400">
                                    <BookOpen className="w-16 h-16 mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">No courses match your search.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {topicsModal && (
                <TopicsModal
                    course={topicsModal}
                    onSave={handleSaveTopics}
                    onClose={() => setTopicsModal(null)}
                    loading={modalLoading}
                />
            )}

            {courseModal && (
                <CourseModal
                    course={courseModal.course}
                    isNew={courseModal.isNew}
                    onSave={handleSaveCourse}
                    onClose={() => setCourseModal(null)}
                    loading={modalLoading}
                />
            )}

            {deleteModal && (
                <DeleteModal
                    title="Delete Course?"
                    message={`Are you sure you want to delete "${deleteModal.title || deleteModal.name}"? This will also remove all topics.`}
                    onConfirm={handleDeleteCourse}
                    onClose={() => setDeleteModal(null)}
                    loading={modalLoading}
                />
            )}

            <Toast message={savedToast} />
        </>
    );
};

export default AdminTopicsPage;