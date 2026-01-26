import React from "react";
import { BookOpen } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext"; 

const IslamicQuote = () => {
  const { t } = useLanguage(); 

  return (
    <>
      {/* Islamic Quote Section */}
      <div className="relative rounded-t-xl overflow-hidden" dir={t.dir}>

        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768662635/Halimatu-Academy-Images/Cultivating-Young-Minds_-The-Importance-of-Early-Islamic-Education_iknvus.png')",
          }}
        />

        {/* BLACK OVERLAY */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* OPTIONAL ANIMATED LIGHT PATTERN */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 p-10 md:p-16 text-center space-y-6 max-w-4xl mx-auto">

          <BookOpen className="w-14 h-14 md:w-16 md:h-16 text-white/80 mx-auto animate-float" />

          <div className="text-7xl md:text-8xl text-white/60 leading-none">"</div>

          <p className="text-base md:text-lg text-white font-light leading-relaxed -mt-6">
            {t.islamicQuote.messenger}
          </p>

          <p className="text-lg md:text-2xl text-white leading-loose italic px-4 md:px-8">
            {t.islamicQuote.quote}
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="w-10 h-0.5 bg-white/60 rounded-full"></div>
            <p className="text-white/90 text-base md:text-lg font-medium">
              {t.islamicQuote.source}
            </p>
            <div className="w-10 h-0.5 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default IslamicQuote;
