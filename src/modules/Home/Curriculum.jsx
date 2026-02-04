import React, { useState } from 'react';
import { BookOpen, ChevronDown, Calendar, Clock, FileText, Award, CheckCircle, Sparkles, Download, PlayCircle } from 'lucide-react';
import BannerSection from './Components/Breadcrumb';


const CurriculumPage = () => {
    const [selectedLevel, setSelectedLevel] = useState(0);
    const [expandedSubject, setExpandedSubject] = useState(null);

    const levels = [
        {
            level: "Level 1",
            name: "Foundation",
            description: "Build a solid foundation in Islamic knowledge",
            duration: "12 Weeks",
            workload: "15 hours/week",
            color: "from-blue-500 to-cyan-500"
        },
        {
            level: "Level 2",
            name: "Intermediate",
            description: "Deepen your understanding of core concepts",
            duration: "12 Weeks",
            workload: "15 hours/week",
            color: "from-emerald-500 to-teal-500"
        },
        {
            level: "Level 3",
            name: "Advanced",
            description: "Master complex topics and applications",
            duration: "12 Weeks",
            workload: "15 hours/week",
            color: "from-purple-500 to-pink-500"
        },
        {
            level: "Level 4",
            name: "Expert",
            description: "Achieve mastery in Islamic sciences",
            duration: "12 Weeks",
            workload: "15 hours/week",
            color: "from-orange-500 to-amber-500"
        }
    ];

    const curriculum = [
        {
            subject: "Aqeedah (Islamic Creed)",
            icon: "📿",
            color: "from-indigo-500 to-purple-500",
            levels: [
                {
                    topics: ["The Concept of Tawheed", "The Six Pillars of Faith", "Belief in Allah", "Names and Attributes of Allah", "Belief in Angels"],
                    learningOutcomes: ["Understand the fundamental beliefs of Islam", "Recognize and avoid acts of Shirk", "Strengthen personal faith through knowledge"],
                    assessments: ["Weekly quizzes", "Essay on Tawheed", "Final exam"]
                },
                {
                    topics: ["Advanced Tawheed Studies", "Prophets and Messengers", "Divine Books", "The Day of Judgment", "Qadar (Divine Decree)"],
                    learningOutcomes: ["Deep understanding of Islamic creed", "Ability to explain complex theological concepts", "Apply Aqeedah in daily life"],
                    assessments: ["Research paper", "Oral presentation", "Comprehensive exam"]
                },
                {
                    topics: ["Contemporary Aqeedah Issues", "Comparative Religion", "Defending Islamic Beliefs", "Sectarian Differences", "Modern Challenges to Faith"],
                    learningOutcomes: ["Address modern theological questions", "Comparative analysis skills", "Defend Islamic beliefs intellectually"],
                    assessments: ["Debate participation", "Case studies", "Final project"]
                },
                {
                    topics: ["Scholarly Works Analysis", "Teaching Aqeedah", "Advanced Divine Attributes", "Philosophy and Aqeedah", "Research Methodologies"],
                    learningOutcomes: ["Teach others about Islamic creed", "Conduct independent research", "Master classical and contemporary texts"],
                    assessments: ["Thesis", "Teaching practicum", "Scholarly presentation"]
                }
            ]
        },
        {
            subject: "Tafsir (Quranic Exegesis)",
            icon: "📖",
            color: "from-teal-500 to-cyan-500",
            levels: [
                {
                    topics: ["Introduction to Tafsir", "Selected Surahs from Juz Amma", "Quranic Stories", "Basic Arabic Grammar for Quran", "Themes in the Quran"],
                    learningOutcomes: ["Basic understanding of Quranic interpretation", "Memorize and understand short Surahs", "Recognize common Quranic themes"],
                    assessments: ["Surah analysis", "Memorization test", "Written exam"]
                },
                {
                    topics: ["Makki vs Madani Revelations", "Reasons for Revelation", "Intermediate Tafsir Studies", "Quranic Sciences", "Selected Long Surahs"],
                    learningOutcomes: ["Understand context of revelation", "Apply various Tafsir methodologies", "Deep analysis of Quranic verses"],
                    assessments: ["Comparative Tafsir paper", "Presentation", "Midterm and final exams"]
                },
                {
                    topics: ["Classical Tafsir Works", "Linguistic Analysis", "Legal Verses", "Abrogation in Quran", "Quranic Miracles"],
                    learningOutcomes: ["Study classical Tafsir literature", "Advanced linguistic analysis", "Extract legal rulings from Quran"],
                    assessments: ["Research project", "Commentary writing", "Comprehensive exam"]
                },
                {
                    topics: ["Complete Tafsir Study", "Contemporary Issues in Tafsir", "Teaching Tafsir Methods", "Scholarly Research", "Specialization Topics"],
                    learningOutcomes: ["Complete understanding of Quranic exegesis", "Research and publish in Tafsir", "Teach Tafsir effectively"],
                    assessments: ["Major research thesis", "Public lecture", "Peer review"]
                }
            ]
        },
        {
            subject: "Hadith (Prophetic Traditions)",
            icon: "📜",
            color: "from-green-500 to-emerald-500",
            levels: [
                {
                    topics: ["Introduction to Hadith Sciences", "40 Hadith of Nawawi", "Categories of Hadith", "Chain of Narration", "Memorization Techniques"],
                    learningOutcomes: ["Understand Hadith terminology", "Memorize 40 essential Hadiths", "Recognize authentic Hadiths"],
                    assessments: ["Memorization test", "Hadith analysis", "Final exam"]
                },
                {
                    topics: ["Hadith Authentication", "Six Major Collections", "Narrator Criticism", "Hadith Compilation History", "Thematic Hadith Study"],
                    learningOutcomes: ["Evaluate Hadith authenticity", "Navigate major Hadith collections", "Understand narrator reliability"],
                    assessments: ["Authentication project", "Collection study", "Written exams"]
                },
                {
                    topics: ["Advanced Hadith Sciences", "Defective Hadiths", "Scholarly Methodologies", "Fiqh al-Hadith", "Contemporary Applications"],
                    learningOutcomes: ["Master Hadith authentication", "Apply Hadiths to modern issues", "Critical analysis skills"],
                    assessments: ["Research paper", "Case analysis", "Comprehensive exam"]
                },
                {
                    topics: ["Specialized Hadith Studies", "Teaching Hadith", "Research Methods", "Publishing Standards", "Expert-level Analysis"],
                    learningOutcomes: ["Conduct original Hadith research", "Teach Hadith sciences", "Contribute to academic discourse"],
                    assessments: ["Original research thesis", "Academic publication", "Teaching demonstration"]
                }
            ]
        },
        {
            subject: "Seerah (Prophetic Biography)",
            icon: "🕌",
            color: "from-amber-500 to-orange-500",
            levels: [
                {
                    topics: ["Birth and Early Life", "The First Revelation", "Meccan Period", "Migration to Madinah", "Major Battles"],
                    learningOutcomes: ["Understand Prophet's life chronologically", "Learn character traits of the Prophet ﷺ", "Apply lessons to daily life"],
                    assessments: ["Timeline project", "Character study essay", "Final exam"]
                },
                {
                    topics: ["Detailed Battle Studies", "Treaties and Diplomacy", "Social Reforms", "Family Life", "Companions' Stories"],
                    learningOutcomes: ["Analyze prophetic leadership", "Understand Islamic state formation", "Learn from companions' examples"],
                    assessments: ["Leadership analysis", "Comparative study", "Written exams"]
                },
                {
                    topics: ["Prophetic Methodology", "Crisis Management", "Advanced Character Study", "Scholarly Seerah Works", "Contemporary Lessons"],
                    learningOutcomes: ["Extract methodological principles", "Apply Seerah to modern challenges", "Deep character analysis"],
                    assessments: ["Methodology paper", "Modern application project", "Comprehensive exam"]
                },
                {
                    topics: ["Complete Seerah Mastery", "Teaching Seerah", "Research Methods", "Comparative Prophet Studies", "Academic Writing"],
                    learningOutcomes: ["Master complete Seerah knowledge", "Teach Seerah effectively", "Conduct academic research"],
                    assessments: ["Doctoral-level thesis", "Course development", "Public presentation"]
                }
            ]
        },
        {
            subject: "Fiqh (Islamic Jurisprudence)",
            icon: "⚖️",
            color: "from-emerald-500 to-teal-500",
            levels: [
                {
                    topics: ["Purification", "Prayer", "Fasting", "Zakat", "Basic Transaction Rules"],
                    learningOutcomes: ["Perform worship correctly", "Understand basic Islamic law", "Apply Fiqh in daily worship"],
                    assessments: ["Practical demonstrations", "Case studies", "Written exam"]
                },
                {
                    topics: ["Hajj and Umrah", "Marriage and Divorce", "Inheritance", "Business Transactions", "Food and Clothing Rules"],
                    learningOutcomes: ["Navigate family law", "Conduct halal business", "Understand inheritance distribution"],
                    assessments: ["Case analysis", "Calculation exercises", "Comprehensive exam"]
                },
                {
                    topics: ["Legal Theory (Usul al-Fiqh)", "Schools of Thought", "Ijtihad and Taqlid", "Contemporary Fiqh Issues", "Comparative Fiqh"],
                    learningOutcomes: ["Understand legal reasoning", "Compare madhahib", "Address modern Fiqh questions"],
                    assessments: ["Comparative research", "Fatwa analysis", "Final project"]
                },
                {
                    topics: ["Advanced Usul al-Fiqh", "Maqasid al-Shariah", "Fatwa Methodology", "Teaching Fiqh", "Specialized Research"],
                    learningOutcomes: ["Issue informed opinions", "Teach Fiqh at advanced levels", "Conduct original research"],
                    assessments: ["Research thesis", "Fatwa writing", "Teaching practicum"]
                }
            ]
        },
        {
            subject: "Tarbiyah Islamiyah (Islamic Ethics)",
            icon: "🤲",
            color: "from-pink-500 to-rose-500",
            levels: [
                {
                    topics: ["Good Character", "Purification of the Heart", "Adab (Etiquette)", "Rights and Responsibilities", "Social Interactions"],
                    learningOutcomes: ["Develop good character", "Improve interpersonal relations", "Practice Islamic etiquette"],
                    assessments: ["Self-reflection journal", "Practical implementation", "Essay"]
                },
                {
                    topics: ["Spiritual Diseases", "Remedies for the Soul", "Islamic Psychology", "Family Relations", "Community Service"],
                    learningOutcomes: ["Identify and cure spiritual ailments", "Strengthen family bonds", "Serve community effectively"],
                    assessments: ["Case studies", "Community project", "Research paper"]
                },
                {
                    topics: ["Advanced Spiritual Development", "Leadership Ethics", "Dawah Methodology", "Contemporary Challenges", "Counseling Basics"],
                    learningOutcomes: ["Lead with Islamic principles", "Give effective Dawah", "Provide basic Islamic counseling"],
                    assessments: ["Leadership project", "Dawah presentation", "Counseling scenarios"]
                },
                {
                    topics: ["Teaching Tarbiyah", "Advanced Counseling", "Community Leadership", "Research in Islamic Ethics", "Specialization"],
                    learningOutcomes: ["Teach Islamic ethics", "Provide professional counseling", "Lead Islamic organizations"],
                    assessments: ["Teaching demonstration", "Counseling certification", "Research thesis"]
                }
            ]
        },
        {
            subject: "Arabic Language",
            icon: "✍️",
            color: "from-violet-500 to-purple-500",
            levels: [
                {
                    topics: ["Arabic Alphabet", "Basic Grammar (Nahw)", "Essential Vocabulary", "Simple Sentences", "Quranic Reading"],
                    learningOutcomes: ["Read Arabic text", "Form basic sentences", "Understand Quranic vocabulary"],
                    assessments: ["Reading test", "Grammar exercises", "Vocabulary quiz"]
                },
                {
                    topics: ["Intermediate Grammar", "Morphology (Sarf)", "Quranic Arabic", "Conversation Practice", "Writing Skills"],
                    learningOutcomes: ["Understand Quranic grammar", "Engage in basic conversation", "Write in Arabic"],
                    assessments: ["Grammar test", "Conversation exam", "Writing assignment"]
                },
                {
                    topics: ["Advanced Grammar", "Classical Texts", "Poetry Analysis", "Advanced Conversation", "Translation Skills"],
                    learningOutcomes: ["Read classical Islamic texts", "Translate Arabic to English", "Advanced communication"],
                    assessments: ["Text analysis", "Translation project", "Oral exam"]
                },
                {
                    topics: ["Mastery of Arabic Grammar", "Research in Arabic", "Teaching Arabic", "Linguistic Analysis", "Specialization"],
                    learningOutcomes: ["Master Arabic language", "Teach Arabic effectively", "Conduct linguistic research"],
                    assessments: ["Linguistic thesis", "Teaching practicum", "Publication"]
                }
            ]
        }
    ];

    return (
        <>
            <BannerSection
                title="Comprehensive Islamic Curriculum"
                subtitle="Structured Islamic Education"
                backgroundImage="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768633927/Halimatu-Academy-Images/Islamic-Education-1_eufmf8.jpg"
            />
            <div className="bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="Resizer">

                    {/* Hero Section */}
                    <div className="relative overflow-hidden bg-[#004aad] via-[#004aad] to-cyan-800 text-white py-24 px-4">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        </div>

                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: 'radial-linear(circle, white 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}></div>

                        <div className="relative z-10  mx-auto text-center space-y-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-xl rounded-full">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-sm tracking-wider uppercase">Complete Curriculum</span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                                Comprehensive Islamic Curriculum
                            </h1>

                            <p className="text-base  text-white/90 leading-relaxed max-w-4xl mx-auto mb-14">
                                A structured four-level program covering seven fundamental Islamic sciences, designed to transform your understanding and practice of Islam
                            </p>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
                                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-slate-50"></path>
                                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-slate-50"></path>
                                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-slate-50"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Level Selector */}
                    <div className=" mx-auto px-4 -mt-12 relative z-20 mb-16">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {levels.map((level, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedLevel(index)}
                                    className={`relative group transition-all duration-500 ${selectedLevel === index ? 'scale-105' : ''
                                        }`}
                                >
                                    <div className={`absolute -inset-1 bg-linear-to-r ${level.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 ${selectedLevel === index ? 'opacity-30' : ''
                                        }`}></div>

                                    <div className={`relative bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-500 ${selectedLevel === index ? 'ring-2 ring-emerald-500 shadow-2xl' : ''
                                        }`}>
                                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-linear-to-br ${level.color} rounded-xl text-white font-bold text-xl mb-3 shadow-lg`}>
                                            {index + 1}
                                        </div>
                                        <h3 className="font-bold text-black mb-1">{level.level}</h3>
                                        <p className="text-sm text-[#004aad] font-semibold mb-2">{level.name}</p>
                                        <p className="text-xs text-black mb-3">{level.description}</p>
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>{level.duration}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Curriculum Content */}
                    <div className=" mx-auto px-4 pb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-black mb-4">
                                {levels[selectedLevel].level} Curriculum
                            </h2>
                            <div className="flex items-center justify-center gap-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#004aad]" />
                                    <span className="text-black">{levels[selectedLevel].workload}</span>
                                </div>
                                <div className="w-px h-6 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#004aad]" />
                                    <span className="text-black">{levels[selectedLevel].duration}</span>
                                </div>
                            </div>
                        </div>

                        {/* Subject Cards */}
                        <div className="space-y-6">
                            {curriculum.map((subject, subjectIndex) => {
                                const isExpanded = expandedSubject === subjectIndex;
                                const currentLevel = subject.levels[selectedLevel];

                                return (
                                    <div
                                        key={subjectIndex}
                                        className="bg-white rounded-md  overflow-hidden transition-all duration-500 hover:shadow-md"
                                    >
                                        <button
                                            onClick={() => setExpandedSubject(isExpanded ? null : subjectIndex)}
                                            className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`shrink-0 w-16 h-16 bg-linear-to-br ${subject.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                                                    {subject.icon}
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-lg font-bold text-gray-900">{subject.subject}</h3>
                                                    <p className="text-[#004aad] font-medium">{currentLevel.topics.length} Topics</p>
                                                </div>
                                            </div>
                                            <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                                }`} />
                                        </button>

                                        <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-5000 opacity-100' : 'max-h-0 opacity-0'
                                            } overflow-hidden`}>
                                            <div className="px-6 md:px-8 pb-8 space-y-8">
                                                <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>

                                                {/* Topics */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-gray-900">
                                                        <FileText className="w-5 h-5 text-emerald-600" />
                                                        <h4 className="font-bold text-lg">Topics Covered</h4>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-3">
                                                        {currentLevel.topics.map((topic, topicIndex) => (
                                                            <div key={topicIndex} className="flex items-start gap-3 p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl">
                                                                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                                                <span className="text-gray-700 font-medium">{topic}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Learning Outcomes */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-gray-900">
                                                        <Award className="w-5 h-5 text-purple-600" />
                                                        <h4 className="font-bold text-lg">Learning Outcomes</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {currentLevel.learningOutcomes.map((outcome, outcomeIndex) => (
                                                            <div key={outcomeIndex} className="flex items-start gap-3 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl">
                                                                <div className="w-2 h-2 bg-purple-600 rounded-full shrink-0 mt-2"></div>
                                                                <span className="text-gray-700">{outcome}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Assessments */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-gray-900">
                                                        <PlayCircle className="w-5 h-5 text-blue-600" />
                                                        <h4 className="font-bold text-lg">Assessment Methods</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        {currentLevel.assessments.map((assessment, assessmentIndex) => (
                                                            <div key={assessmentIndex} className="px-4 py-2 bg-linear-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full font-semibold text-sm">
                                                                {assessment}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                {/* <div className="flex flex-wrap gap-3 pt-4">
                                                    <button className="px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                                                        <Download className="w-5 h-5" />
                                                        Download Syllabus
                                                    </button>
                                                    <button className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300">
                                                        View Sample Lessons
                                                    </button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-16 text-center bg-[#004aad] rounded-md p-12 text-white">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Ready to Start Your Learning Journey?
                            </h3>
                            <p className="text-base mb-8 max-w-2xl mx-auto text-white/90">
                                Enroll now and begin your transformation through comprehensive Islamic education
                            </p>
                            <button className="px-10 py-4 bg-white text-[#004aad] rounded-full cursor-pointer text-base hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                Enroll Now !
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default CurriculumPage;