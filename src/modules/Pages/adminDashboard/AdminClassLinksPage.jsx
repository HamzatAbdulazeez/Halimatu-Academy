/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
    Video, Plus, ChevronRight, Search, Link2, AlertCircle,
    BookOpen, ChevronDown, Award, CheckCircle, X, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

import {
    getAllCoursesWithTopics,
    createClass,
    updateClass,
    deleteClass,
    assignCourseToPlan,
    getImageUrl,
} from '../../../api/courseApi';

import { adminGetPlans } from '../../../api/adminplans';
import { notify } from '../../../utils/toast';

import ClassModal from './Components/classes/ClassModal';
import ClassesTable from './Components/classes/ClassesTable';
import Badge from './Components/shared/Badge';
import DeleteModal from './Components/shared/DeleteModal';

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 flex items-center gap-4 sm:gap-5">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
        </div>
        <div>
            <div className="text-3xl sm:text-4xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
        </div>
    </div>
);

// ─── Assign Plan Modal ────────────────────────────────────────────────────────
const AssignPlanModal = ({ courseName, plans, loading, onAssign, onClose }) => {
    const [selectedPlanId, setSelectedPlanId] = useState('');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-linear-to-r from-[#004aad] to-[#003a8c] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-base">Assign to Plan</h2>
                            <p className="text-white/70 text-xs">Link course to a subscription plan</p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={loading}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <BookOpen className="w-4 h-4 text-[#004aad] shrink-0" />
                        <p className="text-sm text-blue-800 font-medium truncate">{courseName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Subscription Plan
                        </label>

                        {plans.length === 0 ? (
                            <div className="w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 text-center">
                                <Award className="w-6 h-6 mx-auto opacity-40 mb-1" />
                                No subscription plans found. Create a plan first.
                            </div>
                        ) : (
                            <select
                                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:border-[#004aad] focus:outline-none bg-white disabled:opacity-60"
                                value={selectedPlanId}
                                onChange={e => setSelectedPlanId(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">-- Choose a plan --</option>
                                {plans.map(plan => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name || plan.title} — ₦{(
                                            plan.discounted_price || plan.original_price || plan.price || 0
                                        ).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        )}

                        {selectedPlanId && (
                            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Existing subscribers on this plan will be enrolled automatically.
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button onClick={onClose} disabled={loading}
                        className="flex-1 py-2.5 border border-gray-200 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button
                        onClick={() => selectedPlanId && onAssign(selectedPlanId)}
                        disabled={!selectedPlanId || loading || plans.length === 0}
                        className="flex-1 py-2.5 bg-linear-to-r from-[#004aad] to-[#003a8c] text-white rounded-2xl text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Assigning...
                            </>
                        ) : (
                            <><Award className="w-4 h-4" /> Assign Plan</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Topic Row ────────────────────────────────────────────────────────────────
const TopicRow = ({ topic, courseId, expanded, onToggle, onAddClass, onEditClass, onDeleteClass }) => {
    const isExpanded  = expanded.courseId === courseId && expanded.topicId === topic.id;
    const classCount  = topic.classes?.length ?? 0;
    const linkedCount = topic.classes?.filter(cls =>
        cls.meeting_link || cls.meetLink || cls.meetingLink
    ).length ?? 0;

    return (
        <div>
            <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => onToggle(courseId, topic.id)}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <BookOpen className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                            {topic.title || topic.name || 'Untitled Topic'}
                        </p>
                        <p className="text-sm text-gray-400">
                            {classCount} class{classCount !== 1 ? 'es' : ''} • {linkedCount} with link
                            {linkedCount < classCount && (
                                <span className="ml-2 text-amber-500 font-medium">
                                    ({classCount - linkedCount} missing)
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    <button
                        onClick={e => { e.stopPropagation(); onAddClass(topic.id); }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#004aad] hover:bg-[#003a8c] text-white rounded-xl text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Class
                    </button>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 sm:px-5 pb-5">
                    <ClassesTable
                        classes={topic.classes ?? []}
                        topicId={topic.id}
                        onEdit={cls => onEditClass(cls, topic.id)}
                        onDelete={cls => onDeleteClass(cls, topic.id)}
                        onAddFirst={() => onAddClass(topic.id)}
                    />
                </div>
            )}
        </div>
    );
};

// ─── Course Row ───────────────────────────────────────────────────────────────
const CourseRow = ({ course, expanded, onToggleTopic, onAssignPlan, onAddClass, onEditClass, onDeleteClass }) => {
    const courseName    = course.title || course.name || 'Untitled Course';
    const assignedPlans = course.plans ?? course.assignedPlans ?? [];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-start border-b border-gray-100">
                {/* Thumbnail */}
                <div className="w-full sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 shrink-0">
                    <img
                        src={getImageUrl(course.image)}
                        alt={courseName}
                        className="w-full h-48 sm:h-full object-cover"
                        loading="lazy"
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge text={course.category || 'General'} color="blue" />
                        <Badge text={`${course.duration_months || 0} months`} color="gray" />
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                            course.status === 'published'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                        }`}>
                            {course.status || 'draft'}
                        </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{courseName}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{course.instructor || 'No instructor'}</p>

                    {assignedPlans.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            <span className="text-xs text-gray-400 self-center">Plans:</span>
                            {assignedPlans.map(plan => (
                                <span key={plan.id}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-full font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    {plan.name || plan.title}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Assign Button */}
                <button
                    onClick={() => onAssignPlan(course.id, courseName)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 w-full sm:w-auto bg-linear-to-r from-[#004aad] to-[#003a8c] text-white rounded-xl text-sm font-medium hover:brightness-110 transition-all shrink-0"
                >
                    <Award className="w-4 h-4" />
                    {assignedPlans.length > 0 ? 'Add Another Plan' : 'Assign to Plan'}
                </button>
            </div>

            {/* Topics */}
            <div className="divide-y divide-gray-100">
                {(course.topics || []).length > 0 ? (
                    course.topics.map(topic => (
                        <TopicRow
                            key={topic.id}
                            topic={topic}
                            courseId={course.id}
                            expanded={expanded}
                            onToggle={onToggleTopic}
                            onAddClass={onAddClass}
                            onEditClass={onEditClass}
                            onDeleteClass={onDeleteClass}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        No topics created for this course yet.
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminClassLinksPage = () => {
    const [courses,      setCourses]      = useState([]);
    const [plans,        setPlans]        = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [refreshing,   setRefreshing]   = useState(false);
    const [search,       setSearch]       = useState('');
    const [expanded,     setExpanded]     = useState({ courseId: null, topicId: null });
    const [classModal,   setClassModal]   = useState(null);
    const [deleteModal,  setDeleteModal]  = useState(null);
    const [assignModal,  setAssignModal]  = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchAll = useCallback(async (opts = {}) => {
        const isRefresh = opts.refresh ?? false;
        if (isRefresh) setRefreshing(true); else setLoading(true);
        try {
            const [coursesData, plansData] = await Promise.all([
                getAllCoursesWithTopics().catch(() => []),
                adminGetPlans().catch(() => []),
            ]);
            setCourses(Array.isArray(coursesData) ? coursesData : []);
            setPlans(Array.isArray(plansData) ? plansData : []);
        } catch {
            notify.error('Failed to load data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const toggleTopic = (courseId, topicId) => {
        setExpanded(prev =>
            prev.courseId === courseId && prev.topicId === topicId
                ? { courseId: null, topicId: null }
                : { courseId, topicId }
        );
    };

    // ── Class CRUD ──
    const handleSaveClass = async (topicId, form, isNew) => {
        if (!topicId) return notify.error('Topic ID is missing');
        setModalLoading(true);
        try {
            if (isNew) {
                const created = await createClass(topicId, form);
                setCourses(prev => prev.map(course => ({
                    ...course,
                    topics: course.topics?.map(topic =>
                        topic.id === topicId
                            ? { ...topic, classes: [...(topic.classes ?? []), created] }
                            : topic
                    ) ?? [],
                })));
                notify.success('Class added successfully!');
            } else {
                const updated = await updateClass(form.id, form);
                setCourses(prev => prev.map(course => ({
                    ...course,
                    topics: course.topics?.map(topic =>
                        topic.id === topicId
                            ? { ...topic, classes: topic.classes?.map(cl => cl.id === form.id ? updated : cl) ?? [] }
                            : topic
                    ) ?? [],
                })));
                notify.success('Class updated successfully!');
            }
            setClassModal(null);
        } catch {
            notify.error(isNew ? 'Failed to add class' : 'Failed to update class');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteClass = async () => {
        if (!deleteModal) return;
        const { cls, topicId } = deleteModal;
        setModalLoading(true);
        try {
            await deleteClass(cls.id);
            setCourses(prev => prev.map(course => ({
                ...course,
                topics: course.topics?.map(topic =>
                    topic.id === topicId
                        ? { ...topic, classes: topic.classes?.filter(cl => cl.id !== cls.id) ?? [] }
                        : topic
                ) ?? [],
            })));
            notify.success('Class deleted successfully.');
            setDeleteModal(null);
        } catch {
            notify.error('Failed to delete class');
        } finally {
            setModalLoading(false);
        }
    };

    // ── Assign Plan — handles "already assigned" gracefully ──
    const handleAssignPlan = async (selectedPlanId) => {
        if (!selectedPlanId)        return notify.error('Please select a plan');
        if (!assignModal?.courseId) return notify.error('No course selected');

        setModalLoading(true);
        try {
            await assignCourseToPlan(assignModal.courseId, selectedPlanId);
            notify.success('Course assigned! Existing subscribers enrolled.');
            setAssignModal(null);
            await fetchAll({ refresh: true });
        } catch (err) {
            const msg = (
                err?.response?.data?.message ||
                err?.response?.data?.detail  ||
                ''
            ).toLowerCase();

            if (msg.includes('already')) {
                // Not really an error — plan was already linked
                notify.success('This plan is already assigned to the course.');
                setAssignModal(null);
            } else {
                notify.error('Failed to assign course to plan. Please try again.');
            }
        } finally {
            setModalLoading(false);
        }
    };

    // ── Stats ──
    const totalClasses   = courses.reduce((acc, c) => acc + (c.topics?.reduce((a, t) => a + (t.classes?.length ?? 0), 0) ?? 0), 0);
    const linkedClasses  = courses.reduce((acc, c) => acc + (c.topics?.reduce((a, t) => a + (t.classes?.filter(cl => cl.meeting_link || cl.meetLink || cl.meetingLink).length ?? 0), 0) ?? 0), 0);
    const unlinkedClasses = totalClasses - linkedClasses;

    const filteredCourses = courses.filter(course => {
        const term = search.toLowerCase().trim();
        if (!term) return true;
        return (course.title || course.name || '').toLowerCase().includes(term)
            || (course.instructor || '').toLowerCase().includes(term);
    });

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Class Schedule & Links</h1>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                        <Link to="/admin" className="text-[#004aad] hover:underline">Dashboard</Link>
                        <ChevronRight className="w-3 h-3" />
                        Class Schedule & Links
                    </p>
                </div>
                <button
                    onClick={() => fetchAll({ refresh: true })}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div className="bg-gray-50 min-h-screen pb-16">
                <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard label="Total Classes"  value={totalClasses}    icon={Video}       color="text-[#004aad]"   bg="bg-blue-50"    />
                        <StatCard label="Links Set"      value={linkedClasses}   icon={Link2}       color="text-emerald-600" bg="bg-emerald-50" />
                        <StatCard label="Missing Links"  value={unlinkedClasses} icon={AlertCircle} color="text-amber-600"   bg="bg-amber-50"   />
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses or instructors..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#004aad] outline-none"
                            />
                            {search && (
                                <button onClick={() => setSearch('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Courses */}
                    {loading ? (
                        <div className="bg-white rounded-2xl py-20 text-center">
                            <div className="w-9 h-9 border-4 border-[#004aad] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Loading courses, topics & classes...</p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="bg-white rounded-2xl py-20 text-center">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                            <p className="text-lg font-semibold text-gray-500">
                                {search ? `No results for "${search}"` : 'No courses found'}
                            </p>
                            {search && (
                                <button onClick={() => setSearch('')}
                                    className="mt-3 text-sm text-[#004aad] hover:underline">
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredCourses.map(course => (
                                <CourseRow
                                    key={course.id}
                                    course={course}
                                    expanded={expanded}
                                    onToggleTopic={toggleTopic}
                                    onAssignPlan={(id, name) => setAssignModal({ courseId: id, courseName: name })}
                                    onAddClass={topicId => setClassModal({ cls: null, topicId, isNew: true })}
                                    onEditClass={(cls, topicId) => setClassModal({ cls, topicId, isNew: false })}
                                    onDeleteClass={(cls, topicId) => setDeleteModal({ cls, topicId })}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

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
                    message={`Delete "${deleteModal.cls.title || deleteModal.cls.name}"? Students will lose access.`}
                    onConfirm={handleDeleteClass}
                    onClose={() => setDeleteModal(null)}
                    loading={modalLoading}
                />
            )}

            {assignModal && (
                <AssignPlanModal
                    courseName={assignModal.courseName}
                    plans={plans}
                    loading={modalLoading}
                    onAssign={handleAssignPlan}
                    onClose={() => setAssignModal(null)}
                />
            )}
        </>
    );
};

export default AdminClassLinksPage;