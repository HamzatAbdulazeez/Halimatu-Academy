import React from 'react';
import { ArrowRight, Languages, BookOpen, Users, FileCheck, Award } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";

const LearningPathSection = () => {
    const { t } = useLanguage();

    // Icons in the same order as the steps in translations
    const icons = [Languages, BookOpen, Users, FileCheck, Award];

    const steps = t.learningPath.steps.map((step, index) => ({
        number: step.number,
        title: step.title,
        description: step.description,
        icon: icons[index],
    }));

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 py-20 px-4">
            <div className="Resizer mx-auto space-y-16">

                {/* Header Section */}
                <div className="space-y-6" style={{ animation: 'fadeIn 0.8s ease-out' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient rounded-full"></div>
                        <h2 className="text-3xl font-bold text-black">{t.learningPath.header}</h2>
                    </div>

                    <p className="text-base text-black leading-relaxed max-w-2xl">
                        {t.learningPath.description}
                    </p>

                    <button className="inline-flex items-center gap-2 text-[#004aad] cursor-pointer text-base hover:gap-3 transition-all duration-300 group">
                        <span>{t.learningPath.button}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Learning Path Steps */}
                <div className="relative">
                    {/* Dotted Path Line */}
                    <div className="hidden md:block absolute left-0 md:left-1/2 top-0 bottom-0 w-px">
                        <div className="sticky top-1/2 h-full border-l-4 border-dotted border-[#004aad]"></div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`relative flex flex-col md:flex-row items-center cursor-pointer gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                style={{
                                    animation: `slideIn 0.6s ease-out ${index * 0.15}s backwards`
                                }}
                            >
                                {/* Content Card */}
                                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <div className="bg-white rounded-lg bg-linear-to-r from-emerald-50 to-teal-50 hover:shadow-xl transition-all duration-500 p-4 group hover:-translate-y-2">
                                        {/* Icon */}
                                        <div className={`inline-flex p-2 rounded-lg bg-linear-to-br ${step.color || 'from-blue-500 to-blue-700'} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                            <step.icon className="w-4 h-4 text-white" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg text-[#004aad] mb-2 transition-colors duration-300">
                                            {step.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-black leading-loose">
                                            {step.description}
                                        </p>

                                        {/* Decorative Line */}
                                        <div className={`mt-6 h-1 w-0 group-hover:w-20 bg-linear-to-r ${step.color || 'from-blue-500 to-blue-700'} rounded-full transition-all duration-700 ${index % 2 === 0 ? 'md:ml-auto' : ''}`}></div>
                                    </div>
                                </div>

                                {/* Number Badge */}
                                <div className="relative z-10 shrink-0">
                                    <div className="relative">
                                        {/* Outer Glow Ring */}
                                        <div className={`absolute inset-0 bg-linear-to-br ${step.color || 'from-blue-500 to-blue-700'} rounded-full opacity-20 blur-xl animate-pulse`}></div>

                                        {/* Number Circle */}
                                        <div className="relative w-18 h-18 bg-white rounded-full flex items-center justify-center border-2 border-[#004aad]">
                                            <span className="text-lg font-bold text-[#004aad]">
                                                {step.number}
                                            </span>
                                        </div>

                                        {/* Connecting Dots */}
                                        {index < steps.length - 1 && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 py-4">
                                                {[...Array(3)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 h-1 bg-[#004aad] rounded-full"
                                                        style={{
                                                            animation: `pulse 2s ease-in-out infinite ${i * 0.3}s`
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Empty Space for Alternating Layout */}
                                <div className="hidden md:block w-5/12"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translateX(${index => index % 2 === 0 ? '-50px' : '50px'});
                  }
                  to {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }

                @keyframes pulse {
                  0%, 100% {
                    opacity: 0.4;
                    transform: scale(1);
                  }
                  50% {
                    opacity: 1;
                    transform: scale(1.2);
                  }
                }
            `}</style>
        </div>
    );
};

export default LearningPathSection;