import React, { useState } from 'react';
import {
    Video, Plus, Pencil, Trash2, Save, X, ChevronRight,
    Search, Eye, EyeOff, Copy, Check, Clock, Calendar,
    CheckCircle, AlertCircle, Link2, BookOpen, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — replace with API calls in production
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_COURSES = [
    {
        id: 1,
        name: 'Quranic Studies - Complete Foundation',
        instructor: 'Ustadha Halimatu Academy',
        category: 'Quranic Studies',
        duration: '1 Year Program',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80',
        classes: [
            {
                id: 'c1',
                title: 'Understanding Surah Al-Mulk',
                date: 'Saturday, February 14, 2026',
                time: '4:00 PM WAT',
                duration: '90 minutes',
                meetLink: 'https://meet.google.com/abc-defg-hij',
                status: 'scheduled',
            },
            {
                id: 'c2',
                title: 'Tajweed Rules - Advanced',
                date: 'Saturday, February 21, 2026',
                time: '4:00 PM WAT',
                duration: '90 minutes',
                meetLink: '',
                status: 'scheduled',
            },
        ],
    },
    {
        id: 2,
        name: 'Arabic Language - Complete Mastery',
        instructor: 'Shaykh Ahmed Al-Masri',
        category: 'Arabic Language',
        duration: '1 Year Program',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        classes: [
            {
                id: 'c3',
                title: 'Arabic Grammar - Past Tense Verbs',
                date: 'Sunday, February 15, 2026',
                time: '5:00 PM WAT',
                duration: '75 minutes',
                meetLink: 'https://meet.google.com/xyz-uvwx-yz1',
                status: 'scheduled',
            },
        ],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ text, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        gray: 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
            {text}
        </span>
    );
};

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            title="Copy link"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
};

const StatusBadge = ({ status }) => {
    const cfg = {
        scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
        live: 'bg-red-50 text-red-700 border-red-200',
        completed: 'bg-gray-100 text-gray-500 border-gray-200',
        cancelled: 'bg-red-50 text-red-400 border-red-100',
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${cfg[status] || cfg.scheduled}`}>
            {status === 'live' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
            {status}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Class Edit / Add Modal
// ─────────────────────────────────────────────────────────────────────────────
const ClassModal = ({ cls, courseId, onSave, onClose, isNew }) => {
    const [form, setForm] = useState(cls || {
        id: `c${Date.now()}`,
        title: '',
        date: '',
        time: '',
        duration: '',
        meetLink: '',
        status: 'scheduled',
    });
    const [linkVisible, setLinkVisible] = useState(false);
    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
    const isValid = form.title.trim() && form.date.trim() && form.time.trim();

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="bg-linear-to-r from-teal-600 to-[#004aad] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base">{isNew ? 'Add New Class' : 'Edit Class'}</h3>
                            <p className="text-white/70 text-xs">Set class details and Google Meet link</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class Title <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            placeholder="e.g. Understanding Surah Al-Mulk"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                <Calendar className="inline w-3.5 h-3.5 mr-1" />Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.date}
                                onChange={e => set('date', e.target.value)}
                                placeholder="Saturday, Feb 14, 2026"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                <Clock className="inline w-3.5 h-3.5 mr-1" />Time <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.time}
                                onChange={e => set('time', e.target.value)}
                                placeholder="4:00 PM WAT"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            <Clock className="inline w-3.5 h-3.5 mr-1" />Duration
                        </label>
                        <input
                            type="text"
                            value={form.duration}
                            onChange={e => set('duration', e.target.value)}
                            placeholder="e.g. 90 minutes"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            <Video className="inline w-3.5 h-3.5 mr-1 text-[#004aad]" />Google Meet Link
                        </label>
                        <div className="relative">
                            <input
                                type={linkVisible ? 'text' : 'password'}
                                value={form.meetLink}
                                onChange={e => set('meetLink', e.target.value)}
                                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                className="w-full px-4 py-2.5 pr-20 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad] font-mono"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button type="button" onClick={() => setLinkVisible(!linkVisible)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                                    {linkVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                {form.meetLink && <CopyButton text={form.meetLink} />}
                            </div>
                        </div>
                        {form.meetLink ? (
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Link set — students will see "Join on Google Meet"
                            </p>
                        ) : (
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> No link yet — students won't see the Join button
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                        <div className="flex gap-2 flex-wrap">
                            {['scheduled', 'live', 'completed', 'cancelled'].map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => set('status', s)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${form.status === s ? 'bg-[#004aad] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={() => isValid && onSave(courseId, form, isNew)}
                        disabled={!isValid}
                        className="px-5 py-2 bg-[#004aad] text-white rounded-xl hover:bg-[#003a8c] transition-colors text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                        <Save className="w-4 h-4" /> {isNew ? 'Add Class' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Delete Confirm Modal
// ─────────────────────────────────────────────────────────────────────────────
const DeleteModal = ({ message, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Class?</h3>
            <p className="text-gray-500 text-sm">{message}</p>
            <div className="flex gap-2 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm transition-colors">Cancel</button>
                <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-semibold transition-colors">Delete</button>
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const AdminClassLinksPage = () => {
    const [courses, setCourses] = useState(INITIAL_COURSES);
    const [search, setSearch] = useState('');
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [classModal, setClassModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [savedToast, setSavedToast] = useState(null);

    const showToast = (msg) => { setSavedToast(msg); setTimeout(() => setSavedToast(null), 3000); };

    const handleSaveClass = (courseId, cls, isNew) => {
        setCourses(prev => prev.map(c => {
            if (c.id !== courseId) return c;
            if (isNew) return { ...c, classes: [...c.classes, cls] };
            return { ...c, classes: c.classes.map(cl => cl.id === cls.id ? cls : cl) };
        }));
        setClassModal(null);
        showToast(isNew ? '✅ Class added successfully!' : '✅ Class updated successfully!');
    };

    const handleDeleteClass = () => {
        const { courseId, classId } = deleteModal;
        setCourses(prev => prev.map(c =>
            c.id === courseId ? { ...c, classes: c.classes.filter(cl => cl.id !== classId) } : c
        ));
        setDeleteModal(null);
        showToast('🗑️ Class deleted.');
    };

    const totalClasses = courses.reduce((a, c) => a + c.classes.length, 0);
    const linkedClasses = courses.reduce((a, c) => a + c.classes.filter(cl => cl.meetLink).length, 0);
    const unlinkedClasses = totalClasses - linkedClasses;

    const filtered = courses.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* Breadcrumb */}
            <div className="bg-white px-6 py-4 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Class Schedule & Links</h1>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                    <Link to="/admin" className="text-[#004aad] hover:underline">Dashboard</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/admin/course-management/links" className="text-[#004aad] hover:underline">Course Management</Link>
                    <ChevronRight className="w-3 h-3" />
                    Class Schedule & Links
                </p>
            </div>

            <div className="bg-gray-50 pb-16">
                <div className="mx-auto px-4 py-8 space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Classes', value: totalClasses, icon: Video, color: 'text-[#004aad]', bg: 'bg-blue-50' },
                            { label: 'Links Set', value: linkedClasses, icon: Link2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Missing Links', value: unlinkedClasses, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
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
                                placeholder="Search courses or instructors..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-4.5 border border-gray-200 rounded-xl text-sm outline-none"
                            />
                        </div>
                    </div>

                    {/* Course accordions */}
                    <div className="space-y-4">
                        {filtered.map(course => (
                            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                {/* Course header */}
                                <div
                                    className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                                >
                                    <img
                                        src={course.image}
                                        alt={course.name}
                                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                                        onError={e => e.target.style.display = 'none'}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge text={course.category} color="blue" />
                                            <Badge text={course.duration} color="gray" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 truncate">{course.name}</h3>
                                        <p className="text-sm text-gray-400">{course.instructor}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-sm font-bold text-gray-900">{course.classes.length} class{course.classes.length !== 1 ? 'es' : ''}</div>
                                            <div className="text-xs text-gray-400">{course.classes.filter(c => c.meetLink).length} with link</div>
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); setClassModal({ cls: null, courseId: course.id, isNew: true }); }}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-[#004aad] text-white rounded-xl text-xs font-semibold hover:bg-[#003a8c] transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Class
                                        </button>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedCourse === course.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {/* Classes table */}
                                {expandedCourse === course.id && (
                                    <div className="border-t border-gray-100">
                                        {course.classes.length === 0 ? (
                                            <div className="text-center py-10 text-gray-400">
                                                <Video className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                                <p className="text-sm">No classes yet.</p>
                                                <button
                                                    onClick={() => setClassModal({ cls: null, courseId: course.id, isNew: true })}
                                                    className="mt-2 text-sm text-[#004aad] hover:underline font-medium"
                                                >
                                                    + Add first class
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-gray-50 text-left">
                                                            <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Class</th>
                                                            <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Date & Time</th>
                                                            <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Google Meet Link</th>
                                                            <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Status</th>
                                                            <th className="px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {course.classes.map((cls, idx) => (
                                                            <tr key={cls.id} className={`border-t border-gray-50 hover:bg-gray-50/50 transition-colors ${idx % 2 !== 0 ? 'bg-gray-50/30' : ''}`}>
                                                                <td className="px-5 py-4">
                                                                    <p className="font-semibold text-gray-900">{cls.title}</p>
                                                                    {cls.duration && <p className="text-xs text-gray-400 mt-0.5">⏱ {cls.duration}</p>}
                                                                </td>
                                                                <td className="px-5 py-4 hidden md:table-cell">
                                                                    <p className="text-gray-700">📅 {cls.date}</p>
                                                                    <p className="text-gray-400 text-xs mt-0.5">🕐 {cls.time}</p>
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    {cls.meetLink ? (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
                                                                            <span className="font-mono text-xs text-gray-600 truncate max-w-40">{cls.meetLink}</span>
                                                                            <CopyButton text={cls.meetLink} />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <div className="w-2 h-2 bg-gray-300 rounded-full shrink-0" />
                                                                            <span className="text-xs text-gray-400 italic">No link set</span>
                                                                            <button
                                                                                onClick={() => setClassModal({ cls, courseId: course.id, isNew: false })}
                                                                                className="text-xs text-[#004aad] hover:underline font-medium"
                                                                            >
                                                                                + Add link
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <StatusBadge status={cls.status} />
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <div className="flex items-center justify-center gap-1.5">
                                                                        <button
                                                                            onClick={() => setClassModal({ cls, courseId: course.id, isNew: false })}
                                                                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
                                                                            title="Edit"
                                                                        >
                                                                            <Pencil className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setDeleteModal({ courseId: course.id, classId: cls.id, message: `Delete "${cls.title}"? Students will lose access to this class entry.` })}
                                                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <BookOpen className="w-16 h-16 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No courses match your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {classModal && (
                <ClassModal
                    cls={classModal.cls}
                    courseId={classModal.courseId}
                    isNew={classModal.isNew}
                    onSave={handleSaveClass}
                    onClose={() => setClassModal(null)}
                />
            )}
            {deleteModal && (
                <DeleteModal
                    message={deleteModal.message}
                    onConfirm={handleDeleteClass}
                    onClose={() => setDeleteModal(null)}
                />
            )}

            {/* Toast */}
            {savedToast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium">
                        {savedToast}
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminClassLinksPage;
