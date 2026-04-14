import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { notify } from '../../../utils/toast';
import { submitTutorRequest } from '../../../api/tutorApi';

const PrivateTutorRequestModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        student_level: '',
        preferred_schedule: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.message.trim()) newErrors.message = "Please tell us more about your request";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            notify.error("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            await submitTutorRequest(formData);
            
            notify.success("Your tutor request has been submitted successfully! We'll contact you soon In shāʾ Allah.");
            
            // Reset form
            setFormData({
                full_name: '', email: '', phone: '', subject: '', 
                student_level: '', preferred_schedule: '', message: ''
            });
            setErrors({});
            onClose();
        } catch (err) {
            const errorMsg = err?.response?.data?.detail?.[0]?.msg || 
                           err?.response?.data?.message || 
                           "Failed to submit request. Please try again.";
            
            notify.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Request Private Tutor</h2>
                        <p className="text-sm text-gray-500">We'll match you with a qualified teacher</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-70px)]">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={`w-full p-4 border rounded-md text-sm outline-none transition-colors border-gray-300 focus:border-[#004aad] ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Your full name"
                        />
                        {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-4 border rounded-md text-sm outline-none transition-colors border-gray-300 focus:border-[#004aad] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-md text-sm outline-none transition-colors border-gray-300 focus:border-[#004aad]"
                                placeholder="+234 XXX XXX XXXX"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Subject / Topic <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`w-full p-4 border rounded-md text-sm outline-none transition-colors border-gray-300 focus:border-[#004aad] ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g. Tajweed, Qur'an Memorization, Arabic Grammar"
                        />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Student Level</label>
                            <select
                                name="student_level"
                                value={formData.student_level}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-md text-sm outline-none transition-colors border-gray-300 focus:border-[#004aad]"
                            >
                                <option value="">Select level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="children">Children</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Schedule</label>
                            <input
                                type="text"
                                name="preferred_schedule"
                                value={formData.preferred_schedule}
                                onChange={handleChange}
                                className="w-full p-4 border rounded-md text-sm outline-none transition-colors border-gray-300 focus:border-[#004aad]"
                                placeholder="e.g. Weekends, Evenings"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Additional Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full p-4 border rounded-md text-sm outline-none transition-colors border-gray-300 focus:border-[#004aad] resize-y min-h-25 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Tell us more about your goals, current level, and expectations..."
                        />
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004aad] hover:bg-[#003a8c] disabled:bg-gray-400 text-white py-4 rounded-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            "Submitting Request..."
                        ) : (
                            <>
                                Submit Request <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PrivateTutorRequestModal;