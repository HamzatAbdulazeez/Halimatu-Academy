import React, { useState, useEffect, useRef } from 'react';
import { Quote, Plus, Minus, Star } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";

const TestimonialsFAQs = () => {
    const { t } = useLanguage();

    const [openFAQ, setOpenFAQ] = useState(0);
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Use translated arrays directly
    const testimonials = t.testimonialsFAQs.testimonials;
    const faqs = t.testimonialsFAQs.faqs;

    // Duplicate for infinite scroll
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
                            <span className="text-sm text-[#004aad] tracking-wider uppercase">
                                {t.testimonialsFAQs.tagTestimonials}
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                            {t.testimonialsFAQs.headerTestimonials}
                        </h2>

                        <p className="text-base text-black max-w-3xl mx-auto">
                            {t.testimonialsFAQs.subheaderTestimonials}
                        </p>
                    </div>

                    {/* Testimonial Carousel */}
                    <div className="relative">
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
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-[#004aad]">
                            <span className="text-sm text-[#004aad] tracking-wider uppercase">
                                {t.testimonialsFAQs.tagFAQs}
                            </span>
                        </div>

                        <h2 className="text-xl font-bold bg-black bg-clip-text text-transparent">
                            {t.testimonialsFAQs.headerFAQs}
                        </h2>

                        <p className="text-base text-black max-w-2xl mx-auto">
                            {t.testimonialsFAQs.subheaderFAQs}
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="max-w-5xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-md transition-all duration-300 overflow-hidden"
                                style={{ animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards` }}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <span className="text-lg text-black pr-4">
                                        {faq.question}
                                    </span>
                                    <div className={`shrink-0 p-2 rounded-full bg-[#004aad] transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>
                                        {openFAQ === index ? (
                                            <Minus className="w-5 h-5 text-white" />
                                        ) : (
                                            <Plus className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
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