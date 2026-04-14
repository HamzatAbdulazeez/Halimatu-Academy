
import React, { useState, useEffect } from 'react';
import { Video, Save, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import CopyButton from './CopyButton';

const ClassModal = ({ cls, topicId, onSave, onClose, isNew, loading = false }) => {
    const [form, setForm] = useState({
        id: null,                    // ← Important for updates
        name: '',
        meeting_link: '',
        meeting_password: '',
        start_date: '',
        end_date: '',
        status: 'scheduled',
    });

    const [linkVisible, setLinkVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Pre-fill form when editing or creating
    useEffect(() => {
        if (cls) {
            setForm({
                id: cls.id || null,
                name: cls.name || cls.title || '',
                meeting_link: cls.meeting_link || cls.meetLink || '',
                meeting_password: cls.meeting_password || '',
                start_date: cls.start_date ? cls.start_date.slice(0, 16) : '',  
                end_date: cls.end_date ? cls.end_date.slice(0, 16) : '',
                status: cls.status || 'scheduled',
            });
        } else {
            // Reset for new class
            setForm({
                id: null,
                name: '',
                meeting_link: '',
                meeting_password: '',
                start_date: '',
                end_date: '',
                status: 'scheduled',
            });
        }
        setErrorMsg('');
    }, [cls]);

    const updateForm = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errorMsg) setErrorMsg('');
    };

    const isValid = form.name?.trim() && form.start_date?.trim();

    const handleSave = async () => {
        if (!topicId) {
            setErrorMsg("Topic ID is missing. Please refresh the page.");
            return;
        }
        if (!isValid) {
            setErrorMsg("Class Name and Start Date & Time are required.");
            return;
        }

        setErrorMsg('');
        try {
            await onSave(topicId, form, isNew);
            onClose();                    // Close only if successful
        } catch (err) {
            const serverError = err?.response?.data?.message ||
                               err?.response?.data?.errors ||
                               err?.response?.data ||
                               'Failed to save class. Please check your input.';

            const errorText = typeof serverError === 'object'
                ? Object.values(serverError).flat().join(' • ')
                : String(serverError);

            setErrorMsg(errorText);
            console.error('Update Error:', err.response?.data);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">

                {/* Header */}
                <div className="bg-linear-to-r from-teal-600 to-[#004aad] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">{isNew ? 'Add New Class' : 'Edit Class'}</h3>
                            <p className="text-white/70 text-xs">Set class details and Google Meet link</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {errorMsg && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>{errorMsg}</div>
                        </div>
                    )}

                    {/* Class Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Class Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => updateForm('name', e.target.value)}
                            placeholder="e.g. Understanding Surah Al-Mulk"
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#004aad]"
                        />
                    </div>

                    {/* Start Date & Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Start Date & Time <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={form.start_date}
                            onChange={e => updateForm('start_date', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#004aad]"
                        />
                    </div>

                    {/* End Date & Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            End Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            value={form.end_date}
                            onChange={e => updateForm('end_date', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#004aad]"
                        />
                    </div>

                    {/* Meet Link */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Google Meet Link
                        </label>
                        <div className="relative">
                            <input
                                type={linkVisible ? 'text' : 'password'}
                                value={form.meeting_link}
                                onChange={e => updateForm('meeting_link', e.target.value)}
                                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                className="w-full px-4 py-3 pr-20 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#004aad] font-mono"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => setLinkVisible(!linkVisible)}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    {linkVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {form.meeting_link && <CopyButton text={form.meeting_link} />}
                            </div>
                        </div>
                    </div>

                    {/* Meeting Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Meeting Password (optional)
                        </label>
                        <input
                            type="text"
                            value={form.meeting_password}
                            onChange={e => updateForm('meeting_password', e.target.value)}
                            placeholder="Enter password if required"
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#004aad]"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 bg-gray-50 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2.5 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isValid || loading}
                        className="px-6 py-2.5 bg-[#004aad] text-white rounded-2xl cursor-pointer hover:bg-[#003a8c] disabled:opacity-50 flex items-center gap-2 font-medium"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : isNew ? 'Add Class' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassModal;