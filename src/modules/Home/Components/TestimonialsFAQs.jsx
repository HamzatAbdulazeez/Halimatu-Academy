import React, { useState, useEffect, useRef } from 'react';
import { Quote, Plus, Minus, Star } from 'lucide-react';

const TestimonialsFAQs = () => {
    const [openFAQ, setOpenFAQ] = useState(0);
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    const testimonials = [
        {
            name: "Amina Hassan",
            location: "Lagos, Nigeria",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
            rating: 5,
            text: "HSA Academy has transformed my understanding of Islam. The structured curriculum and knowledgeable instructors made learning accessible and enjoyable.",
            course: "Year 1 Graduate"
        },
        {
            name: "Hamzat Abdullah",
            location: "Abuja, Nigeria",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
            rating: 5,
            text: "The flexibility of online learning combined with authentic Islamic knowledge is unmatched. I can study at my own pace while balancing work and family.",
            course: "Year 2 Student"
        },
        {
            name: "Fatima Ahmed",
            location: "Ibadan, Nigeria",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
            rating: 5,
            text: "The community aspect is incredible. I've connected with Muslims worldwide, and the weekly discussions have deepened my faith.",
            course: "Year 1 Student"
        },
        {
            name: "Ibrahim Mohamed",
            location: "Ilorin, Nigeria",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
            rating: 5,
            text: "As a revert, this program gave me the foundation I needed. The curriculum is comprehensive, and the support is amazing.",
            course: "Year 2 Graduate"
        },
        {
            name: "Khadija Ali",
            location: "Osogbo, Nigeria",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
            rating: 5,
            text: "Best decision I've made for my Islamic education. The quality of teaching and resources is outstanding.",
            course: "Year 1 Graduate"
        },
        {
            name: "Hassan Khan",
            location: "Zaria, Nigeria",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
            rating: 5,
            text: "The teachers are knowledgeable and patient. I've learned so much about the Quran and Hadith in just one year!",
            course: "Year 1 Student"
        },
        {
            name: "Aisha Rahman",
            location: "Kano, Nigeria",
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
            rating: 5,
            text: "The Arabic language course helped me understand the Quran in its original language. Truly transformative experience!",
            course: "Year 2 Student"
        }
    ];


    const faqs = [
        {
            question: "Is the program really free?",
            answer: "Yes! Zad Academy is completely free for all students. We believe Islamic education should be accessible to everyone, regardless of financial circumstances. There are no hidden fees or charges."
        },
        {
            question: "What are the language options available?",
            answer: "We offer the program in multiple languages including English, Arabic, French, Urdu, and Turkish. You can select your preferred language during registration and switch if needed."
        },
        {
            question: "How much time do I need to dedicate each week?",
            answer: "We recommend dedicating approximately 15 hours per week to get the most out of the program. This includes watching lectures, reading materials, participating in forums, and completing assignments. However, the program is flexible and you can study at your own pace."
        },
        {
            question: "Do I need any prerequisites to enroll?",
            answer: "No prerequisites are required! The program is designed for students of all levels, from beginners to those with some Islamic knowledge. Our curriculum starts with fundamentals and progressively builds your understanding."
        },
        
    ];

    // Duplicate testimonials for infinite scroll effect
    const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || isPaused) return;

        const scroll = () => {
            if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
                scrollContainer.scrollLeft = 0;
            } else {
                scrollContainer.scrollLeft += 1;
            }
        };

        const intervalId = setInterval(scroll, 30);
        return () => clearInterval(intervalId);
    }, [isPaused]);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? -1 : index);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
            <div className="Resizer mx-auto space-y-24">

                {/* Testimonials Section */}
                <div className="space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4" style={{ animation: 'fadeIn 0.8s ease-out' }}>
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-9xl rounded-full border border-[#004aad]">
                            <Star className="w-4 h-4 text-[#004aad]" />
                            <span className="text-sm text-[#004aad] tracking-wider uppercase">Student Success Stories</span>
                        </div>

                        <h2 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                            What Our Students Say
                        </h2>

                        <p className="text-base text-black max-w-3xl mx-auto">
                            Join thousands of satisfied students who have transformed their lives through Islamic education
                        </p>
                    </div>

                    {/* Testimonial Carousel */}
                    <div className="relative">

                        {/* Scrolling Container */}
                        <div
                            ref={scrollRef}
                            className="flex gap-6 overflow-x-hidden py-4"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            style={{ scrollBehavior: 'auto' }}
                        >
                            {duplicatedTestimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="shrink-0 w-96 bg-white rounded-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-8"
                                >
                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="relative w-16 h-16 rounded-full object-cover border-2 border-white"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-black text-lg">{testimonial.name}</h4>
                                            <p className="text-[#004aad] text-sm font-medium">{testimonial.course}</p>
                                            <p className="text-[#004aad] text-xs">{testimonial.location}</p>
                                        </div>
                                        <div className="bg-[#004aad] p-2 rounded-full">
                                            <Quote className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-[#004aad] text-[#004aad]" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-black leading-loose italic min-h-25">
                                        "{testimonial.text}"
                                    </p>


                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* FAQs Section */}
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4" style={{ animation: 'fadeIn 0.8s ease-out 0.2s backwards' }}>
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full  border border-[#004aad]">
                            <span className="text-sm  text-[#004aad] tracking-wider uppercase">Got Questions?</span>
                        </div>

                        <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h2>

                        <p className="text-base text-black max-w-2xl mx-auto">
                            Everything you need to know about Zad Academy
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="max-w-5xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-md  transition-all duration-300 overflow-hidden"
                                style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` }}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <span className="text-lg text-black pr-4">
                                        {faq.question}
                                    </span>
                                    <div className={`shrink-0 p-2 rounded-full bg-[#004aad] transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''
                                        }`}>
                                        {openFAQ === index ? (
                                            <Minus className="w-5 h-5 text-white" />
                                        ) : (
                                            <Plus className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 pt-2">
                                        <div className="w-full h-px bg-linear-to-r from-transparent via-[#004aad] to-transparent mb-4"></div>
                                        <p className="text-black leading-loose">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
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
      `}</style>
        </div>
    );
};

export default TestimonialsFAQs;