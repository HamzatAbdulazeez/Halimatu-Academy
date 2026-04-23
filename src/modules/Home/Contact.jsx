import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, UserPlus, FileQuestion, Sparkles, CheckCircle, Globe, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import BannerSection from './Components/Breadcrumb';
import { notify } from '../../utils/toast';

import { submitContactForm } from '../../api/contactApi';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";

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
            await submitContactForm(formData);

            notify.success("Your message has been sent successfully! We'll get back to you soon In shāʾ Allāh.");

            setSubmitted(true);
            setFormData({
                full_name: '', email: '', phone: '', subject: '', category: 'general', message: ''
            });
            setErrors({});

            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            const errorMsg = err?.response?.data?.detail?.[0]?.msg ||
                err?.response?.data?.message ||
                "Failed to send message. Please try again.";
            notify.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            title: "Email Us",
            details: "info@hsaacademy.com",
            subDetails: "support@hsaacademy.com",
            link: "mailto:info@hsaacademy.com",
            color: "from-emerald-500 to-teal-500"
        },
        {
            icon: Phone,
            title: "Call Us",
            details: "08145489933",
            subDetails: "Mon-Fri, 9AM-5PM EST",
            link: "tel:+08145489933",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            details: "20, Ademola Alabi Str, Olusosun Ikeja Lagos.",
            subDetails: "Lagos, Nigeria",
            link: "#",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Clock,
            title: "Office Hours",
            details: "Monday - Friday",
            subDetails: "9:00 AM - 5:00 PM EST",
            link: "#",
            color: "from-orange-500 to-amber-500"
        }
    ];

    const categories = [
        {
            value: 'general',
            label: 'General Inquiry',
            icon: MessageSquare,
            color: 'text-emerald-600'
        },
        {
            value: 'enrollment',
            label: 'Enrollment Questions',
            icon: UserPlus,
            color: 'text-blue-600'
        },
        {
            value: 'technical',
            label: 'Technical Support',
            icon: HelpCircle,
            color: 'text-purple-600'
        },
        {
            value: 'curriculum',
            label: 'Curriculum Questions',
            icon: FileQuestion,
            color: 'text-orange-600'
        }
    ];

    const faqs = [
        {
            question: "How do I enroll in the program?",
            answer: "Visit our enrollment page and click 'Sign Up'. You'll need to create an account and select your preferred language."
        },
        {
            question: "What are the technical requirements?",
            answer: "You need a stable internet connection, a modern web browser, and either a computer, tablet, or smartphone."
        },
        {
            question: "How long does it take to get a response?",
            answer: "We typically respond to all inquiries within 24-48 hours during business days."
        }
    ];

    const socialLinks = [
        { icon: Facebook, href: "#", name: "Facebook", color: "hover:bg-blue-600" },
        { icon: Twitter, href: "#", name: "Twitter", color: "hover:bg-sky-500" },
        { icon: Instagram, href: "#", name: "Instagram", color: "hover:bg-pink-600" },
        { icon: Youtube, href: "#", name: "YouTube", color: "hover:bg-red-600" },
        { icon: Linkedin, href: "#", name: "LinkedIn", color: "hover:bg-blue-700" }
    ];

    return (
        <>
            <BannerSection
                title="Contact Us"
                subtitle="We're here to help and answer any questions you may have. Reach out to us and we'll respond as soon as we can."
                backgroundImage="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768973061/focused-young-children-studying-religious-texts-in-a-classroom-setting-photo_gwysn1.jpg"
            />
            <div>
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">

                    {/* Hero Section */}
                    <div className="relative overflow-hidden bg-[#004aad] text-white py-24 px-4">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        </div>

                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: 'radial-linear(circle, white 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}></div>

                        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-xl rounded-full">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-sm font-semibold tracking-wider uppercase">Get In Touch</span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                                We'd Love to Hear From You
                            </h1>

                            <p className="text-base text-white/90 leading-relaxed max-w-3xl mx-auto mb-14">
                                Have questions? We're here to help! Reach out to our team and we'll get back to you as soon as possible.
                            </p>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0">
                            <svg viewBox="0 0 1400 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
                                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1400,52.47V0Z" opacity=".25" className="fill-slate-50"></path>
                                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-slate-50"></path>
                                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-slate-50"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="Resizer mx-auto px-4 -mt-12 relative z-20 mb-16">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {contactInfo.map((info, index) => {
                                const Icon = info.icon;
                                return (
                                    <a
                                        key={index}
                                        href={info.link}
                                        className="group bg-white rounded-md p-6 transition-all duration-500"
                                        style={{ animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards` }}
                                    >
                                        <div className={`inline-flex p-4 bg-linear-to-br ${info.color} rounded-xl text-white mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-2">{info.title}</h3>
                                        <p className="text-[#004aad] font-semibold mb-1">{info.details}</p>
                                        <p className="text-black text-sm">{info.subDetails}</p>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="Resizer mx-auto px-4 pb-24">
                        <div className="grid lg:grid-cols-3 gap-12">

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-md p-8 md:p-12">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-black mb-3">
                                            Send Us a Message
                                        </h2>
                                        <p className="text-black text-base">
                                            Fill out the form below and our team will get back to you within 24-48 hours.
                                        </p>
                                    </div>

                                    {submitted ? (
                                        <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-[#004aad] rounded-3xl p-10 text-center space-y-4">
                                            <div className="inline-flex p-4 bg-emerald-100 rounded-full">
                                                <CheckCircle className="w-12 h-12 text-emerald-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900">Message Sent Successfully!</h3>
                                            <p className="text-gray-600">
                                                Thank you for contacting us. We'll get back to you as soon as possible.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="full_name"
                                                        value={formData.full_name}
                                                        onChange={handleChange}
                                                        required
                                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#004aad] focus:bg-white transition-all duration-300 ${errors.full_name ? 'border-red-500' : ''}`}
                                                        placeholder="Your name"
                                                    />
                                                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#004aad] focus:bg-white transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                                                        placeholder="your.email@example.com"
                                                    />
                                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Subject *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#004aad] focus:bg-white transition-all duration-300 ${errors.subject ? 'border-red-500' : ''}`}
                                                    placeholder="Brief description of your inquiry"
                                                />
                                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                    What can we help you with? *
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {categories.map((category) => {
                                                        const Icon = category.icon;
                                                        return (
                                                            <label key={category.value} className="cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="category"
                                                                    value={category.value}
                                                                    checked={formData.category === category.value}
                                                                    onChange={handleChange}
                                                                    className="peer sr-only"
                                                                />
                                                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md peer-checked:border-[#004aad] peer-checked:bg-[#004aad]/5 transition-all flex items-center gap-3">
                                                                    <Icon className={`w-5 h-5 ${category.color}`} />
                                                                    <span className="font-medium text-sm">{category.label}</span>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Message *
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    rows="6"
                                                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#004aad] focus:bg-white transition-all duration-300 resize-y min-h-35 ${errors.message ? 'border-red-500' : ''}`}
                                                    placeholder="Please provide details about your inquiry..."
                                                />
                                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full px-8 py-4 bg-[#004aad] text-white rounded-md text-base hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                                            >
                                                <Send className="w-5 h-5" />
                                                {loading ? "Sending Message..." : "Send Message"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">

                                {/* Quick FAQs */}
                                <div className="bg-white rounded-md p-8">
                                    <div className="flex items-center gap-2 mb-6">
                                        <HelpCircle className="w-6 h-6 text-emerald-600" />
                                        <h3 className="text-2xl font-bold text-gray-900">Quick FAQs</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="space-y-2">
                                                <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                                                {index < faqs.length - 1 && <div className="h-px bg-gray-200 mt-4"></div>}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 px-6 py-3 bg-gradient text-white rounded-md hover:bg-emerald-200 transition-all duration-300">
                                        View All FAQs
                                    </button>
                                </div>

                                {/* Social Media */}
                                <div className="bg-gradient rounded-md p-8 text-white">
                                    <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
                                    <p className="text-white/90 mb-6">
                                        Follow us on social media for updates, inspiration, and Islamic knowledge.
                                    </p>
                                    <div className="flex gap-3">
                                        {socialLinks.map((social, index) => {
                                            const Icon = social.icon;
                                            return (
                                                <a
                                                    key={index}
                                                    href={social.href}
                                                    aria-label={social.name}
                                                    className={`p-3 bg-white/20 backdrop-blur-md rounded-xl ${social.color} transition-all duration-300 hover:scale-110`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <style jsx>{`
@keyframes slideUp {
from {
opacity: 0;
transform: translateY(30px);
}
to {
opacity: 1;
transform: translateY(0);
}
}

@keyframes fadeIn {
from {
opacity: 0;
}
to {
opacity: 1;
}
}
`}</style>
                </div>
            </div>
        </>
    );
};

export default ContactUsPage;