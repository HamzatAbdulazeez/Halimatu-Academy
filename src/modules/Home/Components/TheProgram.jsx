import React, { useState } from 'react';
import { Star, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const ProgramSection = () => {
  const { t } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState(null);

  const subjects = t.programSection.subjects.map((subject, index) => ({
    ...subject,
    delay: `${index * 100}`, // stagger animation
    icon: index === 0 ? '✍️' : '🤲' // keep your icons
  }));

  return (
    <div className="bg-[#F9F9F8] p-8" dir={t.dir}>
      <div className="section Resizer mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full border border-[#004aad]">
            <Star className="w-5 h-5 text-[#004aad] animate-pulse" />
            <span className="text-sm text-[#004aad] tracking-wider uppercase">
              {t.programSection.headerBadge}
            </span>
            <Star className="w-5 h-5 text-[#004aad] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-black tracking-tight">
              {t.programSection.title}
            </h2>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-1 bg-linear-to-r from-transparent via-[#004aad] to-transparent rounded-full animate-pulse"></div>
            <Sparkles className="w-6 h-6 text-[#004aad] animate-bounce" />
            <div className="w-16 h-1 bg-linear-to-r from-transparent via-[#004aad] to-transparent rounded-full animate-pulse"></div>
          </div>

          <p className="text-base text-black max-w-3xl mx-auto leading-loose">
            {t.programSection.description}
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
                <div
                  className={`absolute inset-0 bg-linear-to-br ${subject.gradient || 'from-purple-500 to-indigo-600'} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Icon Header */}
                <div
                  className={`relative h-40 bg-linear-to-br ${subject.gradient || 'from-purple-500 to-indigo-600'} flex items-center justify-center overflow-hidden`}
                >
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
                    <div
                      className={`h-1 w-0 group-hover:w-16 bg-linear-to-r ${
                        subject.gradient || 'from-purple-500 to-indigo-600'
                      } rounded-full transition-all duration-500`}
                    ></div>
                  </div>

                  <p className="text-black text-sm leading-loose min-h-25">
                    {subject.description}
                  </p>

                  <button className="flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors group/btn">
                    <span>{t.programSection.learnMore}</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className={`absolute top-0 right-0 w-full h-full bg-linear-to-br ${
                      subject.gradient || 'from-purple-500 to-indigo-600'
                    } opacity-20 rounded-bl-full`}
                  ></div>
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
          0%,
          100% {
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
