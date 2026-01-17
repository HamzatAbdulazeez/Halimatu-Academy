import React, { Component } from 'react'
import { BookOpen, } from 'lucide-react';

export class IslamicQuote extends Component {
    render() {
        return (
            <>
                {/* Islamic Quote Section */}
                <div className="relative bg-[#004aad] rounded-t-xl p-12  overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    <div className="relative z-10 mx-auto text-center space-y-6">
                        <BookOpen className="w-16 h-16 text-white/80 mx-auto animate-float" />

                        <div className="text-8xl text-white/60 leading-none">"</div>

                        <p className="text-lg md:text-2xl text-white font-light leading-relaxed -mt-8">
                            The Messenger of Allah ﷺ said:
                        </p>

                        <p className="text-xl md:text-2xl text-white font-semibold leading-relaxed italic px-8">
                            "Whoever takes a path upon which to obtain knowledge, Allah makes the path to Paradise easy for him."
                        </p>

                        <div className="flex items-center justify-center gap-2 pt-4">
                            <div className="w-12 h-0.5 bg-white/60 rounded-full"></div>
                            <p className="text-white/90 text-lg font-medium">Sahih Muslim</p>
                            <div className="w-12 h-0.5 bg-white/60 rounded-full"></div>
                        </div>
                    </div>
                </div>
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
            </>
        )
    }
}

export default IslamicQuote