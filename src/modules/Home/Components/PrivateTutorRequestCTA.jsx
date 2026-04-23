import React, { useState } from 'react';
import { UserCheck, ArrowRight, Users, Clock, Award } from 'lucide-react';
import PrivateTutorRequestModal from './PrivateTutorRequestModal';

const PrivateTutorRequestCTA = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className=" overflow-hidden">
            <div className='Resizer'>
            <div className="grid md:grid-cols-2 gap-0">
    
                    {/* Left Side - Visual & Info */}
                    <div className="bg-linear-to-br from-[#004aad] to-[#003a8c] p-10 md:p-12 text-white flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-6 w-fit">
                            <Users className="w-4 h-4" />
                            <span className="text-xs font-medium tracking-widest">ONE-ON-ONE LEARNING</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            Need a <span className="text-white/90">Private Tutor</span>?
                        </h2>

                        <p className="text-lg text-white/90 mb-8 max-w-md">
                            Get personalized Islamic education from qualified scholars tailored to your level, pace, and goals.
                        </p>

                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>Flexible Schedule</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                <span>Expert Teachers</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - CTA */}
                    <div className="p-10 md:p-12 flex flex-col justify-center bg-white">
                        <div className="max-w-lg mx-auto">
                            <div className="mb-8">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#004aad]/10 rounded-2xl mb-6">
                                    <UserCheck className="w-8 h-8 text-[#004aad]" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                    Personalized Tutoring
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    One-on-one sessions with experienced tutors. Perfect for focused learning in Qur'an, Tajweed, Arabic, Fiqh, and more.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group w-full flex items-center justify-center gap-3 bg-[#004aad] hover:bg-[#003a8c] text-white py-4 px-8 cursor-pointer rounded-md font-semibold transition-all active:scale-[0.985]"
                            >
                                Request Private Tutor Now
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-6">
                                Quick response • Free initial consultation • No commitment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
               
            </div>

            <PrivateTutorRequestModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
};

export default PrivateTutorRequestCTA;