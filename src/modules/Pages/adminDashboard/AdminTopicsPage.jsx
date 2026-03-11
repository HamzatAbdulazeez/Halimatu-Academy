import React, { useState } from 'react';
import {
    BookMarked, Plus, Pencil, Trash2, Save, X,
    ChevronRight, Search, Eye, Check, Tag,
    CheckCircle, Settings, BookOpen, Image, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_COURSES = [
    {
        id: 1,
        name: 'Quranic Studies - Complete Foundation',
        instructor: 'Ustadha Halimatu Academy',
        category: 'Quranic Studies',
        duration: '1 Year Program',
        description: 'A comprehensive foundation course covering all aspects of Quranic studies from basic recitation to advanced tafsir.',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
        whatYouLearn: [
            'Tajweed Rules',
            'Quran Recitation',
            'Tafsir & Interpretation',
            'Memorization Techniques',
            'Quranic Arabic',
        ],
    },
    {
        id: 2,
        name: 'Arabic Language - Complete Mastery',
        instructor: 'Shaykh Ahmed Al-Masri',
        category: 'Arabic Language',
        duration: '1 Year Program',
        description: 'Master the Arabic language from grammar fundamentals to advanced conversational skills and Quranic vocabulary.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        whatYouLearn: [
            'Arabic Grammar (Nahw)',
            'Arabic Morphology (Sarf)',
            'Conversational Arabic',
            'Reading & Writing',
            'Quranic Vocabulary',
        ],
    },
];

const CATEGORIES = [
    'Quranic Studies',
    'Arabic Language',
    'Islamic Studies',
    'Tajweed',
    'Fiqh',
    'Hadith',
    'Seerah',
    'Other',
];

const DURATIONS = [
    '1 Month',
    '3 Months',
    '6 Months',
    '9 Months',
    '1 Year Program',
    '18 Months',
    '2 Years',
    'Self-Paced',
];

// ─────────────────────────────────────────────────────────────────────────────
// TOPICS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const TopicsModal = ({ course, onSave, onClose }) => {
    const [topics, setTopics] = useState([...course.whatYouLearn]);
    const [newTopic, setNewTopic] = useState('');
    const [editIdx, setEditIdx] = useState(null);
    const [editVal, setEditVal] = useState('');

    const addTopic = () => {
        if (newTopic.trim()) {
            setTopics(prev => [...prev, newTopic.trim()]);
            setNewTopic('');
        }
    };
    const removeTopic = (idx) => setTopics(prev => prev.filter((_, i) => i !== idx));
    const startEdit = (idx) => { setEditIdx(idx); setEditVal(topics[idx]); };
    const saveEdit = () => {
        if (editVal.trim()) setTopics(prev => prev.map((t, i) => i === editIdx ? editVal.trim() : t));
        setEditIdx(null); setEditVal('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#004aad] to-[#0062e6] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <BookMarked className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base">What You Will Learn</h3>
                            <p className="text-white/70 text-xs truncate max-w-[260px]">{course.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                    {topics.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
                            No topics yet. Add your first topic below.
                        </div>
                    )}
                    {topics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                            <div className="w-6 h-6 bg-[#004aad]/10 text-[#004aad] rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                                {idx + 1}
                            </div>
                            {editIdx === idx ? (
                                <input
                                    value={editVal}
                                    onChange={e => setEditVal(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && saveEdit()}
                                    className="flex-1 px-2 py-1 border border-[#004aad] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/20"
                                    autoFocus
                                />
                            ) : (
                                <span className="flex-1 text-sm text-gray-800">{topic}</span>
                            )}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {editIdx === idx ? (
                                    <button onClick={saveEdit} className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-lg transition-colors">
                                        <Check className="w-3.5 h-3.5" />
                                    </button>
                                ) : (
                                    <button onClick={() => startEdit(idx)} className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <button onClick={() => removeTopic(idx)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-6 pb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTopic}
                            onChange={e => setNewTopic(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTopic()}
                            placeholder="Add a new topic..."
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                        />
                        <button
                            onClick={addTopic}
                            disabled={!newTopic.trim()}
                            className="px-4 py-2.5 bg-[#004aad] text-white rounded-xl hover:bg-[#003a8c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400">{topics.length} topic{topics.length !== 1 ? 's' : ''}</span>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm">
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(course.id, topics)}
                            className="px-5 py-2 bg-[#004aad] text-white rounded-xl hover:bg-[#003a8c] transition-colors text-sm font-semibold flex items-center gap-1.5"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// COURSE EDIT / ADD MODAL
// ─────────────────────────────────────────────────────────────────────────────
const CourseModal = ({ course, onSave, onClose, isNew }) => {
    const [form, setForm] = useState(course || {
        id: Date.now(),
        name: '',
        instructor: '',
        category: 'Quranic Studies',
        duration: '1 Year Program',
        description: '',
        image: '',
        whatYouLearn: [],
    });
    const [imagePreviewError, setImagePreviewError] = useState(false);

    const set = (key, val) => { setForm(prev => ({ ...prev, [key]: val })); setImagePreviewError(false); };
    const isValid = form.name.trim() && form.instructor.trim();

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#004aad] to-teal-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base">{isNew ? 'Add New Course' : 'Edit Course'}</h3>
                            <p className="text-white/70 text-xs">{isNew ? 'Fill in the course details below' : 'Update the course information'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                    {/* Image URL + Preview */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Image className="inline w-4 h-4 mr-1" />Course Image URL
                        </label>
                        <input
                            type="text"
                            value={form.image}
                            onChange={e => set('image', e.target.value)}
                            placeholder="https://example.com/image.jpg or Unsplash URL"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                        />
                        {/* Image preview */}
                        <div className="mt-3">
                            {form.image && !imagePreviewError ? (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src={form.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setImagePreviewError(true)}
                                    />
                                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
                                        ✓ Preview
                                    </div>
                                </div>
                            ) : form.image && imagePreviewError ? (
                                <div className="w-full h-24 rounded-xl border-2 border-dashed border-red-200 bg-red-50 flex items-center justify-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" /> Image URL is invalid or can't be loaded
                                </div>
                            ) : (
                                <div className="w-full h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center gap-2 text-gray-400 text-sm">
                                    <Image className="w-5 h-5" /> Paste an image URL to preview
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Course Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            placeholder="e.g. Quranic Studies - Complete Foundation"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                        />
                    </div>

                    {/* Instructor */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Instructor Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.instructor}
                            onChange={e => set('instructor', e.target.value)}
                            placeholder="e.g. Ustadha Halimatu Academy"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                        />
                    </div>

                    {/* Category + Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={e => set('category', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad] bg-white"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration</label>
                            <select
                                value={form.duration}
                                onChange={e => set('duration', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad] bg-white"
                            >
                                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            placeholder="Write a brief description of what this course covers..."
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad] resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">{form.description.length} characters</p>
                    </div>

                    {/* Note about topics */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <Tag className="w-4 h-4 text-[#004aad] shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700">
                            After saving, click <strong>"Manage Topics"</strong> on the course card to add "What You Will Learn" topics.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={() => isValid && onSave(form)}
                        disabled={!isValid}
                        className="px-5 py-2 bg-[#004aad] text-white rounded-xl hover:bg-[#003a8c] transition-colors text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                        <Save className="w-4 h-4" /> {isNew ? 'Add Course' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────
const DeleteCourseModal = ({ course, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Course?</h3>
            <p className="text-gray-500 text-sm">
                Are you sure you want to delete <strong>"{course.name}"</strong>? This will also remove all topics. This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm transition-colors">
                    Cancel
                </button>
                <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-semibold transition-colors">
                    Delete
                </button>
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const AdminTopicsPage = () => {
    const [courses, setCourses] = useState(INITIAL_COURSES);
    const [search, setSearch] = useState('');
    const [topicsModal, setTopicsModal] = useState(null);
    const [courseModal, setCourseModal] = useState(null); // { course, isNew }
    const [deleteModal, setDeleteModal] = useState(null); // course object
    const [savedToast, setSavedToast] = useState(null);

    const showToast = (msg) => { setSavedToast(msg); setTimeout(() => setSavedToast(null), 3000); };

    const handleSaveTopics = (courseId, topics) => {
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, whatYouLearn: topics } : c));
        setTopicsModal(null);
        showToast('✅ Topics updated successfully!');
    };

    const handleSaveCourse = (form) => {
        const isNew = courseModal.isNew;
        if (isNew) {
            setCourses(prev => [...prev, { ...form, whatYouLearn: [] }]);
            showToast('✅ Course added successfully!');
        } else {
            setCourses(prev => prev.map(c => c.id === form.id ? { ...c, ...form } : c));
            showToast('✅ Course updated successfully!');
        }
        setCourseModal(null);
    };

    const handleDeleteCourse = () => {
        setCourses(prev => prev.filter(c => c.id !== deleteModal.id));
        setDeleteModal(null);
        showToast('🗑️ Course deleted.');
    };

    const totalTopics = courses.reduce((a, c) => a + c.whatYouLearn.length, 0);

    const filtered = courses.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );

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
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#004aad] text-white rounded-xl hover:bg-[#003a8c] transition-colors font-semibold text-sm shadow-sm"
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
                                placeholder="Search by course name, instructor or category..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                            />
                        </div>
                    </div>

                    {/* Info banner */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                        <Eye className="w-5 h-5 text-[#004aad] shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800">
                            Topics set here appear on the student's <strong>Enrolled Courses</strong> page under "What you will learn". Use the <strong>Edit</strong> button to update course details (title, image, description) and <strong>Manage Topics</strong> to update the learning outcomes.
                        </p>
                    </div>

                    {/* Course cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filtered.map(course => (
                            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Course image */}
                                {course.image ? (
                                    <div className="relative h-36 overflow-hidden">
                                        <img
                                            src={course.image}
                                            alt={course.name}
                                            className="w-full h-full object-cover"
                                            onError={e => e.target.parentElement.style.display = 'none'}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        <div className="absolute bottom-3 left-3 flex gap-1.5">
                                            <span className="bg-white/90 backdrop-blur text-[#004aad] text-xs font-semibold px-2.5 py-1 rounded-full">
                                                {course.category}
                                            </span>
                                            <span className="bg-white/90 backdrop-blur text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                                📅 {course.duration}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-20 bg-gradient-to-r from-[#004aad]/10 to-teal-500/10 flex items-center justify-center">
                                        <BookOpen className="w-10 h-10 text-[#004aad]/20" />
                                    </div>
                                )}

                                {/* Card body */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-sm leading-tight">{course.name}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">👤 {course.instructor}</p>
                                            {course.description && (
                                                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{course.description}</p>
                                            )}
                                        </div>
                                        {/* Action buttons */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => setCourseModal({ course, isNew: false })}
                                                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
                                                title="Edit course details"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal(course)}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                                                title="Delete course"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Topics section */}
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                                <Tag className="w-3.5 h-3.5" /> Topics ({course.whatYouLearn.length})
                                            </span>
                                            <button
                                                onClick={() => setTopicsModal(course)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#004aad] text-white rounded-lg text-xs font-semibold hover:bg-[#003a8c] transition-colors"
                                            >
                                                <Settings className="w-3 h-3" /> Manage Topics
                                            </button>
                                        </div>

                                        {course.whatYouLearn.length === 0 ? (
                                            <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-xl">
                                                <p className="text-xs text-gray-400">No topics yet</p>
                                                <button
                                                    onClick={() => setTopicsModal(course)}
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
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-5 pb-3">
                                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                                        <Eye className="w-3 h-3" /> Visible to students on their enrolled courses page
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Add course card */}
                        <button
                            onClick={() => setCourseModal({ course: null, isNew: true })}
                            className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 hover:border-[#004aad] hover:bg-blue-50/30 transition-all group"
                        >
                            <div className="w-14 h-14 bg-gray-100 group-hover:bg-[#004aad]/10 rounded-2xl flex items-center justify-center transition-colors">
                                <Plus className="w-7 h-7 text-gray-400 group-hover:text-[#004aad] transition-colors" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-500 group-hover:text-[#004aad] transition-colors">Add New Course</p>
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
                </div>
            </div>

            {/* Modals */}
            {topicsModal && (
                <TopicsModal course={topicsModal} onSave={handleSaveTopics} onClose={() => setTopicsModal(null)} />
            )}
            {courseModal && (
                <CourseModal
                    course={courseModal.course}
                    isNew={courseModal.isNew}
                    onSave={handleSaveCourse}
                    onClose={() => setCourseModal(null)}
                />
            )}
            {deleteModal && (
                <DeleteCourseModal
                    course={deleteModal}
                    onConfirm={handleDeleteCourse}
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

export default AdminTopicsPage;