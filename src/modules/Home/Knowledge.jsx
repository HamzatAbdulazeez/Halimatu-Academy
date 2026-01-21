
import BannerSection from './Components/Breadcrumb';
import React, { useState } from 'react';
import { BookOpen, CheckCircle, Users, Award, Globe, Sparkles, Play, ChevronRight } from 'lucide-react';

const KnowledgeSeriesSection = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: BookOpen,
            title: "Content and Design",
            description: "Featuring a modern and user-friendly design, our content incorporates vibrant colors, charts, shapes, and textures. This visually engaging design enhances the learning experience, making the content more accessible and enjoyable.",
            color: "from-emerald-500 to-teal-500"
        },
        {
            icon: Users,
            title: "Expert Scholarship",
            description: "Written and reviewed by renowned Islamic scholars with decades of teaching experience. Each book undergoes rigorous academic review to ensure authenticity and accuracy in presenting Islamic knowledge.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Globe,
            title: "Multilingual Accessibility",
            description: "Available in multiple languages including Arabic, English, French, Urdu, and Turkish, making authentic Islamic knowledge accessible to Muslims worldwide regardless of their linguistic background.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Award,
            title: "Structured Learning Path",
            description: "Carefully designed progression across four levels, ensuring students build a solid foundation before advancing to more complex topics. Each level builds upon previous knowledge systematically.",
            color: "from-orange-500 to-amber-500"
        }
    ];

    const subjects = [
        { name: "Aqeedah", icon: "📿", color: "bg-blue-500" },
        { name: "Tafsir", icon: "📖", color: "bg-teal-500" },
        { name: "Hadith", icon: "📜", color: "bg-green-500" },
        { name: "Seerah", icon: "🕌", color: "bg-amber-500" },
        { name: "Fiqh", icon: "⚖️", color: "bg-emerald-500" },
        { name: "Tarbiyah Islamiyah", icon: "🤲", color: "bg-rose-500" },
        { name: "Arabic Language", icon: "✍️", color: "bg-purple-500" }
    ];

    const levels = [
        { level: "Level 1", description: "Foundation", students: "Beginner" },
        { level: "Level 2", description: "Intermediate", students: "Developing" },
        { level: "Level 3", description: "Advanced", students: "Proficient" },
        { level: "Level 4", description: "Expert", students: "Mastery" }
    ];

    return (

        <>
            <BannerSection
                title="Knowledge Center"
                subtitle="Explore our comprehensive resources, articles, and tutorials designed to enhance your learning journey and deepen your understanding of Islamic studies."
                backgroundImage="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768633927/Halimatu-Academy-Images/Islamic-Education-1_eufmf8.jpg"
            />
            <div className="bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
                <div className="Resizer mx-auto space-y-18">

                    {/* Header Section */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full">
                            <Sparkles className="w-5 h-5 text-[#004aad] animate-pulse" />
                            <span className="text-sm text-[#004aad] tracking-wider uppercase">Educational Excellence</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold bg-black bg-clip-text text-transparent">
                                HSA Knowledge Series
                        </h1>

                        <p className="text-base text-black leading-loose ">
                            Spanning four levels, each tailored to cover the seven fundamental subjects of Aqeedah, Tafsir, Hadith, Seerah, Fiqh, Tarbiyah Islamiyah, and the Arabic Language, our book series stands as a testament to both accessibility and depth. Universally embraced, it has become a cornerstone in educational institutions worldwide.
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* Left Side - Features */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-black mb-2">
                                    Distinctive Features of the Book Series
                                </h2>
                                <div className="w-18 h-0.5 bg-[#004aad] rounded-full"></div>
                            </div>

                            {/* Feature Cards */}
                            <div className="space-y-4">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    const isActive = activeFeature === index;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setActiveFeature(index)}
                                            className={`group cursor-pointer bg-white rounded-md transition-all duration-500 overflow-hidden ${isActive ? '' : ''
                                                }`}
                                        >
                                            <div className="p-6 space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={`shrink-0 p-3 bg-linear-to-br ${feature.color} rounded-xl text-white group-hover:scale-110 transition-transform duration-500`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-bold text-black mb-2 group-hover:text-[#004aad] transition-colors">
                                                            {feature.title}
                                                        </h3>
                                                        <div className={`transition-all duration-500 ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                            } overflow-hidden`}>
                                                            <p className="text-black leading-loose">
                                                                {feature.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isActive ? 'rotate-90 text-emerald-600' : ''
                                                        }`} />
                                                </div>
                                            </div>
                                            <div className={`h-1 bg-linear-to-r ${feature.color} transform transition-all duration-500 ${isActive ? 'scale-x-100' : 'scale-x-0'
                                                } origin-left`}></div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Subjects Covered */}
                            <div className="bg-white rounded-lg p-8 space-y-6">
                                <h3 className="text-lg font-bold text-black flex items-center gap-2">
                                    <BookOpen className="w-7 h-7 text-emerald-600" />
                                    Seven Core Subjects
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {subjects.map((subject, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-md transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className={`p-2 ${subject.color} rounded-lg text-white text-xl`}>
                                                {subject.icon}
                                            </div>
                                            <span className="font-semibold text-black text-sm">{subject.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Video and Levels */}
                        <div className="space-y-8 lg:sticky lg:top-8">
                            {/* Video Section */}
                            <div className="relative group">
                                <div className="absolute -inset-1  rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

                                <div className="relative bg-white rounded-lg overflow-hidden">
                                    {/* Video Placeholder */}
                                    <div className="relative aspect-video bg-linear-to-br from-black to-gray-800">
                                        <img
                                            src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80"
                                            alt="Zad Knowledge Series"
                                            className="w-full h-full object-cover opacity-60"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button className="group/play p-6 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                                                <Play className="w-12 h-12 text-white fill-white" />
                                            </button>
                                        </div>
                                        <div className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-full flex items-center gap-2">
                                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                            Watch Introduction
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-3">
                                        <h3 className="text-xl font-bold text-black">
                                            Discover the HSA Book Series
                                        </h3>
                                        <p className="text-gray-600">
                                            Watch this comprehensive overview of our acclaimed book series and understand how it transforms Islamic education.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Learning Levels */}
                            <div className="bg-white rounded-lg p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-black">Learning Levels</h3>
                                    <Award className="w-8 h-8 text-amber-500" />
                                </div>

                                <div className="space-y-4">
                                    {levels.map((level, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                            style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` }}
                                        >
                                            <div className="flex items-center gap-4 p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                                                <div className="shrink-0 w-12 h-12 bg-linear-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-black text-lg">{level.level}</h4>
                                                    <p className="text-emerald-700 font-medium text-sm">{level.description}</p>
                                                </div>
                                                <div className="hidden sm:block px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-600">
                                                    {level.students}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button className="w-full px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Explore Book Series
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center bg-white rounded-lg p-12">
                        <h3 className="text-3xl font-bold text-black mb-4">
                            Ready to Start Your Learning Journey?
                        </h3>
                        <p className="text-base text-black mb-8 max-w-2xl mx-auto">
                            Access our comprehensive book series and join thousands of students worldwide
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="px-8 py-3 bg-[#004aad] text-white rounded-full text-base hover:shadow-xl hover:scale-105 transition-all duration-300">
                                Download Free Sample
                            </button>
                            <button className="px-8 py-4 bg-white border border-[#004aad] text-[#004aad] rounded-full hover:bg-emerald-50 transition-all duration-300">
                                View Full Catalog
                            </button>
                        </div>
                    </div>

                </div>

                <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
            </div>
        </>
    );
};

export default KnowledgeSeriesSection;