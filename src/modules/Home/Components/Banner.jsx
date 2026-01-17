import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, DollarSign, Laptop, Users, BookOpen } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";

const AcademyBanner = () => {
    const { t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Hsa Academy Program",
            subtitle: "Learn the Basics of Islam",
            description: "Embark on a 2-year learning journey with Hsa Academy's free online program. Learn the core principles, beliefs, and teachings of Islam taught by renowned scholars, all from the comfort of your own home.",
            image: "https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768633927/Halimatu-Academy-Images/Islamic-Education-1_eufmf8.jpg",
            gradient: "from-emerald-600 to-teal-700"
        },
        {
            title: "Comprehensive Curriculum",
            subtitle: "Structured Islamic Education",
            description: "Our carefully designed curriculum covers Quran recitation, Islamic jurisprudence, prophetic biography, and Islamic ethics. ",
            image: "https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768632270/Halimatu-Academy-Images/images-4-1_r7jgos.jpg",
            gradient: "bg-[#004aad] to-[#101e55]"
        },
        {
            title: "Learn at Your Pace",
            subtitle: "Flexible Online Learning",
            description: "Study whenever and wherever suits you best. Access recorded lectures, downloadable resources, and join live sessions with scholars. Balance your learning with your daily commitments seamlessly.",
            image: "https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768634979/Halimatu-Academy-Images/q_bzkmjv.jpg",
            gradient: "from-purple-600 to-pink-700"
        }
    ];

    const stats = [
        {
            icon: Calendar,
            title: "4 semesters (2 years)",
            subtitle: "Program Duration",
            color: "bg-emerald-500"
        },
        {
            icon: Clock,
            title: "12 weeks",
            subtitle: "Semester Length",
            color: "bg-[#004aad] to-[#101e55]"
        },
        {
            icon: DollarSign,
            title: "Free",
            subtitle: "Online",
            color: "bg-purple-500"
        },
        {
            icon: BookOpen,
            title: "Per Week",
            subtitle: "15 Hours",
            color: "bg-orange-500"
        },
        {
            icon: Users,
            title: "18 January",
            subtitle: "Start of Next Semester",
            color: "bg-pink-500"
        },
        {
            icon: Laptop,
            title: "44 Days",
            subtitle: "Registration starts in",
            color: "bg-[#101e55] to-[#004aad]"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full Resizer mx-auto p-4 space-y-2">
            {/* Banner Section */}
            <div className="relative overflow-hidden rounded-md">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
                            }`}
                    >
                        <div className={`bg-linear-to-r ${slide.gradient} text-white`}>
                            <div className="grid md:grid-cols-2 gap-8 items-center min-h-125">
                                {/* Left Content */}
                                <div className="md:p-12 sm:p-6 p-6 space-y-6">
                                    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                        Featured Program
                                    </div>
                                    <h1 className="text-4xl font-bold leading-tight">{slide.title}</h1>
                                    <h2 className="text-3xl font-light text-white/90">{slide.subtitle}</h2>
                                    <p className="text-base text-white/90 leading-relaxed">{slide.description}</p>
                                    <div className="flex gap-4 pt-4">
                                        <button className="px-8 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors">
                                            Enroll Now
                                        </button>
                                        <button className="px-8 py-3  border border-white text-white rounded-md hover:bg-white/30 transition-colors">
                                            Learn More
                                        </button>
                                    </div>
                                </div>

                                {/* Right Image */}
                                <div className="relative w-full md:w-auto h-64 md:h-full min-h-0 md:min-h-125 overflow-hidden rounded-2xl">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="absolute inset-01 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-l from-transparent to-black/20"></div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 ">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 border-b border-[#004aad] rounded-b-md pt-4">
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