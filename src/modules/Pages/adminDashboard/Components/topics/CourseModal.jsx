import React, { useState, useRef } from 'react';
import { BookOpen, Save, X, Image, Tag, AlertCircle, Upload, Link } from 'lucide-react';
import { getImageUrl } from '../../../../../api/courseApi';

const CATEGORIES = [
    'Quranic Studies', 'Arabic Language', 'Islamic Studies',
    'Tajweed', 'Fiqh', 'Hadith', 'Seerah', 'Other',
];

const STATUS_OPTIONS = ['draft', 'published', 'archived'];

const EMPTY_COURSE = {
    title:           '',
    instructor:      '',
    category:        'Quranic Studies',
    duration_months: '',
    price:           0,
    status:          'draft',
    description:     '',
    image:           '',
    imageFile:       null,
};

const CourseModal = ({ course, onSave, onClose, isNew, loading = false }) => {
    const [form, setForm] = useState(() => {
        if (isNew || !course) return { ...EMPTY_COURSE };
        return {
            id:              course.id,
            title:           course.title           ?? '',
            instructor:      course.instructor      ?? '',
            category:        course.category        ?? 'Quranic Studies',
            duration_months: course.duration_months ?? '',
            price:           course.price           ?? 0,
            status:          course.status          ?? 'draft',
            description:     course.description     ?? '',
            image:           course.image           ?? '',
            imageFile:       null,
        };
    });

    const [previewUrl, setPreviewUrl]         = useState(null);
    const [imagePreviewError, setImagePreviewError] = useState(false);
    const [imageMode, setImageMode]           = useState('upload'); 
    const fileInputRef = useRef(null);

    const set = (key, val) => {
        setForm(prev => ({ ...prev, [key]: val }));
        if (key === 'image') setImagePreviewError(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        set('imageFile', file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setImagePreviewError(false);
    };
    
    const displayImage = previewUrl
        || (form.image ? getImageUrl(form.image) : '');

    const isValid = form.title.trim().length > 0 && form.instructor.trim().length > 0;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden my-4">

                {/* Header */}
                <div className="bg-linear-to-r from-[#004aad] to-teal-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-md flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base">
                                {isNew ? 'Add New Course' : 'Edit Course'}
                            </h3>
                            <p className="text-white/70 text-xs">
                                {isNew ? 'Fill in the course details below' : 'Update the course information'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-md transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                    {/* Image section */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                <Image className="w-4 h-4" /> Course Image
                            </label>
                            {/* Toggle upload vs URL */}
                            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setImageMode('upload')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${imageMode === 'upload' ? 'bg-white text-[#004aad] shadow-sm' : 'text-gray-500'}`}
                                >
                                    <Upload className="w-3 h-3" /> Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode('url')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${imageMode === 'url' ? 'bg-white text-[#004aad] shadow-sm' : 'text-gray-500'}`}
                                >
                                    <Link className="w-3 h-3" /> URL
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        {displayImage && !imagePreviewError ? (
                            <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200 mb-3">
                                <img
                                    src={displayImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={() => setImagePreviewError(true)}
                                />
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
                                    ✓ {previewUrl ? 'New image' : 'Current image'}
                                </div>
                            </div>
                        ) : displayImage && imagePreviewError ? (
                            <div className="w-full h-24 rounded-md border-2 border-dashed border-red-200 bg-red-50 flex items-center justify-center gap-2 text-red-400 text-sm mb-3">
                                <AlertCircle className="w-4 h-4" /> Image couldn't be loaded
                            </div>
                        ) : (
                            <div className="w-full h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 text-gray-400 text-sm mb-3">
                                <Image className="w-6 h-6 opacity-40" />
                                <span className="text-xs">No image yet</span>
                            </div>
                        )}

                        {/* Upload mode */}
                        {imageMode === 'upload' && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-[#004aad] transition-colors w-full justify-center"
                                >
                                    <Upload className="w-4 h-4" />
                                    {form.imageFile ? 'Change Image' : 'Choose Image File'}
                                </button>
                                {form.imageFile && (
                                    <p className="text-xs text-emerald-600 mt-1.5">✓ {form.imageFile.name}</p>
                                )}
                            </>
                        )}

                        {/* URL mode */}
                        {imageMode === 'url' && (
                            <input
                                type="text"
                                value={form.image}
                                onChange={e => set('image', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-0 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                            />
                        )}
                    </div>

                    {/* Course Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Course Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            placeholder="e.g. Quranic Studies - Complete Foundation"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm outline-none focus:outline-none focus:ring-0 focus:ring-[#004aad]/30 focus:border-[#004aad]"
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
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-0 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                        />
                    </div>

                    {/* Category + Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={e => set('category', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-0 focus:ring-[#004aad]/30 focus:border-[#004aad] bg-white"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Duration <span className="text-gray-400 font-normal">(months)</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.duration_months}
                                onChange={e => set('duration_months', e.target.value)}
                                placeholder="e.g. 12"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-0 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                            />
                        </div>
                    </div>

                    {/* Price + Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Price <span className="text-gray-400 font-normal">(₦)</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.price}
                                onChange={e => set('price', e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-0 focus:ring-[#004aad]/30 focus:border-[#004aad]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                            <select
                                value={form.status}
                                onChange={e => set('status', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-0 focus:ring-[#004aad]/30 focus:border-[#004aad] bg-white capitalize"
                            >
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s} className="capitalize">{s}</option>
                                ))}
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
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-0 focus:ring-[#004aad]/30 focus:border-[#004aad] resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">{form.description.length} characters</p>
                    </div>

                    {/* Hint */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <Tag className="w-4 h-4 text-[#004aad] shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700">
                            After saving, click <strong>"Manage Topics"</strong> to add as many learning topics as you need.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => isValid && onSave(form)}
                        disabled={!isValid || loading}
                        className="px-5 py-2 bg-[#004aad] text-white rounded-md hover:bg-[#003a8c] transition-colors text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : isNew ? 'Add Course' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseModal;