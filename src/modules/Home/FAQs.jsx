import BannerSection from './Components/Breadcrumb';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Minus, } from 'lucide-react';
import { useState } from 'react';

const FAQs = () => {
    const { t } = useLanguage();

    const [openFAQ, setOpenFAQ] = useState(0);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? -1 : index);
    };

     // Use translated arrays directly
    const faqs = t.testimonialsFAQs.faqs;


    return (
        <>
            <BannerSection
                title="FAQs"
                subtitle="Frequently Asked Questions"
                backgroundImage="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768923939/1195_1_m7slpm.png"
            />
            {/* Who We Are Section */}
            <section className='bg-[#F4F8FC]'>
            <div className=" Resizer">
                {/* FAQs Section */}
                <div className="py-20 space-y-12">
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
            </section>
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
        </>
    );
};

export default FAQs;

