import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, DollarSign, Laptop, Users, BookOpen } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";
import { Link } from "react-router-dom";

const AcademyBanner = () => {
    const { t } = useLanguage(); // dynamic translations
    const [currentSlide, setCurrentSlide] = useState(0);

    // Use translations for slides
    const slides = t.banner.slides.map(slide => ({
        ...slide,
        gradient: slide.gradient || "from-purple-600 to-pink-700"
    }));
    const stats = [
        { icon: Calendar, title: t.stats?.duration || "2 semesters (1 years)", subtitle: t.stats?.durationLabel || "Program Duration", color: "bg-emerald-500" },
        { icon: Clock, title: t.stats?.semesterLength || "12 weeks", subtitle: t.stats?.semesterLengthLabel || "Semester Length", color: "bg-[#004aad] to-[#101e55]" },
        { icon: DollarSign, title: t.stats?.cost || "Paid", subtitle: t.stats?.costLabel || "Online", color: "bg-purple-500" },
        { icon: BookOpen, title: t.stats?.perWeek || "Per Week", subtitle: t.stats?.perWeekLabel || "15 Hours", color: "bg-orange-500" },

    ];

    // auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="w-full Resizer mx-auto p-4 space-y-2 mt-18">
            {/* Banner Section */}
            <div className="relative overflow-hidden rounded-md">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                    >
                        <div className={`bg-linear-to-r ${slide.gradient} text-white`}>
                            <div className="grid md:grid-cols-2 gap-8 items-center min-h-125">
                                {/* Left Content */}
                                <div className="md:p-12 sm:p-6 p-6 space-y-6">
                                    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                        {slide.badge}
                                    </div>
                                    <h1 className="text-4xl font-bold leading-tight">{slide.title}</h1>
                                    <h2 className="text-3xl font-light text-white/90">{slide.subtitle}</h2>
                                    <p className="text-base text-white/90 leading-relaxed">{slide.description}</p>
                                    <div className="flex gap-4 pt-4">
                                        <Link to={"/register"} className="hidden md:inline-block">
                                            <button className="px-8 py-3 bg-white text-gray-900 cursor-pointer rounded-md hover:bg-gray-100 transition-colors">
                                                {slide.ctaPrimary}
                                            </button>
                                        </Link>
                                        <Link to={"/about"}>
                                            <button className="hidden md:block px-8 py-3 cursor-pointer border border-white text-white rounded-md hover:bg-white/30 transition-colors">
                                                {slide.ctaSecondary}
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Right Image */}
                                <div className="relative w-full md:w-auto h-64 md:h-full min-h-0 md:min-h-125 overflow-hidden rounded-2xl">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-l from-transparent to-black/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 border-b border-[#004aad] rounded-b-md pt-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center space-y-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                            >
                                <div className={`${stat.color} p-4 rounded-2xl`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{stat.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AcademyBanner;
