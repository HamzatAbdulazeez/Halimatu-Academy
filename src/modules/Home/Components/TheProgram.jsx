import React, { useState } from 'react';
import { Star, ChevronRight, Sparkles } from 'lucide-react';

const ProgramSection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const subjects = [
        // {
        //     title: "Aqeedah",
        //     description: "Study the fundamental beliefs and pillars of Islamic faith, understanding the concept of Tawheed and the articles of faith.",
        //     gradient: "from-blue-500 to-blue-700",
        //     icon: "📿",
        //     delay: "0"
        // },
        // {
        //     title: "Seerah",
        //     description: "Learn the comprehensive biography of Prophet Muhammad ﷺ, his life, teachings, and exemplary character.",
        //     gradient: "from-amber-500 to-orange-600",
        //     icon: "🕌",
        //     delay: "100"
        // },
        // {
        //     title: "Fiqh",
        //     description: "Become acquainted with all types of worship, from purification to Hajj, covering financial transactions, medical issues, family matters, oaths, and vows.",
        //     gradient: "from-emerald-500 to-teal-600",
        //     icon: "⚖️",
        //     delay: "200"
        // },
        // {
        //     title: "Tafsir",
        //     description: "Explore the interpretation and explanation of the Quran, understanding its meanings, context, and application in daily life.",
        //     gradient: "from-teal-500 to-cyan-600",
        //     icon: "📖",
        //     delay: "300"
        // },
        // {
        //     title: "Hadith",
        //     description: "Study the sayings and actions of Prophet Muhammad ﷺ, learning their authenticity, meanings, and practical applications.",
        //     gradient: "from-green-500 to-emerald-600",
        //     icon: "📜",
        //     delay: "400"
        // },
        {
            title: "Arabic Language",
            description: "Master the fundamentals of Arabic grammar and vocabulary to better understand the Quran and Islamic texts.",
            gradient: "from-purple-500 to-indigo-600",
            icon: "✍️",
            delay: "500"
        },
        {
            title: "Quranic",
            description: "Learn the etiquettes and moral character taught in Islam, developing excellence in behavior and interpersonal relations.",
            gradient: "from-pink-500 to-rose-600",
            icon: "🤲",
            delay: "600"
        }
    ];

    return (
        <div className="bg-[#F9F9F8] p-8">
            <div className="section Resizer mx-auto space-y-12">
                {/* Header Section */}


                <div className="text-center space-y-6 animate-fade-in">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full border border-[#004aad]">
                        <Star className="w-5 h-5 text-[#004aad] animate-pulse" />
                        <span className="text-sm  text-[#004aad] tracking-wider uppercase">Islamic Curriculum</span>
                        <Star className="w-5 h-5 text-[#004aad] animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-black tracking-tight">
                            The Program
                        </h2>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1 bg-linear-to-r from-transparent via-[#004aad] to-transparent rounded-full animate-pulse"></div>
                        <Sparkles className="w-6 h-6 text-[#004aad] animate-bounce" />
                        <div className="w-16 h-1 bg-linear-to-r from-transparent via-[#004aad] to-transparent rounded-full animate-pulse"></div>
                    </div>

                    <p className="text-base text-black max-w-3xl mx-auto leading-loose">
                        HSA Academy provides a comprehensive Islamic curriculum consisting of seven core subjects, designed to foster a deeper understanding of Islam.
                    </p>
                </div>

                {/* Subjects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {subjects.map((subject, index) => (
                        <div
                            key={index}
                            style={{ animationDelay: `${subject.delay}ms` }}
                            className="animate-slide-up"
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="group relative bg-white rounded-md overflow-hidden cursor-pointer hover:shadow-1xl transition-all duration-500 hover:-translate-y-3 h-full">
                                {/* Animated Background Gradient */}
                                <div className={`absolute inset-0 bg-linear-to-br ${subject.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                {/* Icon Header */}
                                <div className={`relative h-40 bg-linear-to-br ${subject.gradient} flex items-center justify-center overflow-hidden`}>
                                    {/* Animated Background Pattern */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
                                    </div>

                                    {/* Icon with Animation */}
                                    <div className="relative z-10 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                                        <span className="text-7xl filter drop-shadow-lg animate-float">
                                            {subject.icon}
                                        </span>
                                    </div>

                                    {/* Sparkle Effect */}
                                    {hoveredCard === index && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="w-8 h-8 text-white animate-ping" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-[#004aad] group-hover:text-black transition-colors duration-300">
                                            {subject.title}
                                        </h3>
                                        <div className={`h-1 w-0 group-hover:w-16 bg-linear-to-r ${subject.gradient} rounded-full transition-all duration-500`}></div>
                                    </div>

                                    <p className="text-black text-sm leading-loose min-h-25">
                                        {subject.description}
                                    </p>

                                    <button className="flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors group/btn">
                                        <span>Learn More</span>
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                                    </button>
                                </div>

                                {/* Corner Decoration */}
                                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className={`absolute top-0 right-0 w-full h-full bg-linear-to-br ${subject.gradient} opacity-20 rounded-bl-full`}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default ProgramSection;