import BannerSection from './Components/Breadcrumb';
import { Target, Eye, Star, Users, BookOpen, Globe, Award, Sparkles, ArrowRight } from 'lucide-react';
import PrivateTutorRequestCTA from './Components/PrivateTutorRequestCTA';  

const AboutUs = () => {
    const objectives = [
        {
            title: "Authentic Islamic Knowledge",
            description: "Provide comprehensive Islamic education rooted in the Quran and Sunnah, taught by qualified scholars.",
            icon: "📚",
            color: "from-emerald-500 to-teal-500"
        },
        {
            title: "Accessible Education",
            description: "Break down barriers to Islamic learning by offering  high-quality education to Muslims globally.",
            icon: "🌍",
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Personal Development",
            description: "Foster personal growth and strengthen the connection between students and their faith.",
            icon: "🤲",
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "Community Building",
            description: "Create a supportive global community of learners who inspire and encourage one another.",
            icon: "🤝",
            color: "from-orange-500 to-amber-500"
        },
        {
            title: "Practical Application",
            description: "Ensure students can apply Islamic teachings in their daily lives with wisdom and understanding.",
            icon: "⭐",
            color: "from-rose-500 to-red-500"
        },
        {
            title: "Lifelong Learning",
            description: "Encourage continuous education and the pursuit of knowledge throughout one's life journey.",
            icon: "🎓",
            color: "from-indigo-500 to-violet-500"
        }
    ];

    return (
        <>
            <BannerSection
                title="About Us"
                subtitle="Transforming Lives Through Islamic Education"
                backgroundImage="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768923939/1195_1_m7slpm.png"
            />
            {/* Who We Are Section */}
            <div className="bg-white Resizer">
                <div className="section grid md:grid-cols-2 gap-10 items-center">
                    <div >
                        <img
                            src="https://res.cloudinary.com/dbmtogyef/image/upload/v1769958019/%D8%B1%D9%85%D8%B6%D8%A7%D9%86_%D9%83%D8%B1%D9%8A%D9%85_-_Ramadan_karim_lujzjv.jpg"
                            alt="Who We Are"
                            className="rounded-lg h-88 w-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-black leading-relaxed mb-4">
                            Who We Are
                        </h2>
                        <p className="text-black text-base leading-loose mb-4">
                            At HALĪMATU SA'DIYYAH ISlamic Academy, we're more than just an online learning platform — we're your trusted companion in the journey of Islamic knowledge and spiritual growth. Founded by dedicated scholars and educators, we bring authentic Islamic education to Muslims worldwide.
                        </p>
                        <p className="text-black text-base leading-loose mb-6">
                            Whether you're a beginner seeking to understand the fundamentals of Islam, a student looking to deepen your knowledge of Quran and Hadith, or someone striving to strengthen your faith, HALĪMATU SA'DIYYAH ISlamic Academy is your comprehensive platform for accessible, authentic, and transformative Islamic education.
                        </p>
                    
                    </div>
                </div>
            </div>

            {/* Our Message Section */}
            <div className='section bg-[#F9FAFB]'>
                <div className="Resizer">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6" style={{ animation: 'fadeIn 0.8s ease-out' }}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-9xl rounded-full border border-[#004aad]">
                                <Star className="w-4 h-4 text-[#004aad]" />
                                <span className="text-sm text-[#004aad] tracking-wider uppercase">Our Message</span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight">
                                A Message from the Heart
                            </h2>

                            <div className="space-y-2 text-base text-black leading-loose">
                                <p>
                                    In an age where access to authentic Islamic knowledge can be challenging, HALĪMATU SA'DIYYAH ISlamic Academy was born from a simple yet powerful vision: to make comprehensive Islamic education accessible to every Muslim, regardless of their location or circumstances.
                                </p>

                                <p>
                                    We believe that every Muslim has the right to understand their faith deeply, to connect with the teachings of the Quran and Sunnah, and to grow spiritually in a supportive environment. Our scholars and educators have dedicated themselves to creating a curriculum that is both academically rigorous and spiritually enriching.
                                </p>

                                <p>
                                    This journey is not just about acquiring knowledge—it's about transformation. It's about building a stronger relationship with Allah, understanding His guidance, and applying it in our daily lives. We invite you to join our global community of learners and embark on this blessed journey together.
                                </p>
                            </div>

                            {/* <div className="pt-4">
                                <button className="inline-flex items-center gap-2 text-[#004aad] text-base cursor-pointer hover:gap-3 transition-all duration-300 group">
                                    <span>Meet Our Scholars</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div> */}
                        </div>

                        <div className="relative" style={{ animation: 'fadeIn 0.8s ease-out 0.2s backwards' }}>
                            <img
                                src="https://res.cloudinary.com/dbmtogyef/image/upload/v1769958270/__e4fzye.jpg"
                                alt="Students learning"
                                className="relative h-130 w-full object-cover rounded-3xl"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-white rounded-md p-6 max-w-xs">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-linear-to-br from-[#004aad] to-blue-500 rounded-xl">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-black">2</p>
                                        <p className="text-sm text-black">Core Subjects</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mission & Vision Section */}
            <div className="bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-18">
                <div className="Resizer mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Mission */}
                        <div className="space-y-6" style={{ animation: 'slideUp 0.8s ease-out' }}>
                            <div className="inline-flex p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
                                <Target className="w-12 h-12 text-emerald-400" />
                            </div>

                            <h2 className="text-3xl font-bold">Our Mission</h2>

                            <div className="h-1 w-24 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"></div>

                            <p className="text-base text-gray-300 leading-relaxed">
                                To provide authentic, comprehensive, and accessible Islamic education that empowers Muslims worldwide to deepen their understanding of Islam, strengthen their faith, and apply Islamic teachings in their daily lives with wisdom and confidence.
                            </p>

                            <div className="space-y-3 pt-4">
                                {[
                                    "Deliver high-quality Islamic education",
                                    "Empower students with authentic knowledge",
                                    "Build a global learning community",
                                    "Foster spiritual and intellectual growth"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="p-1 bg-emerald-500/20 rounded-full mt-1">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="space-y-6" style={{ animation: 'slideUp 0.8s ease-out 0.2s backwards' }}>
                            <div className="inline-flex p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
                                <Eye className="w-12 h-12 text-purple-400" />
                            </div>

                            <h2 className="text-3xl font-bold">Our Vision</h2>

                            <div className="h-1 w-24 bg-linear-to-r from-purple-400 to-pink-400 rounded-full"></div>

                            <p className="text-base text-gray-300 leading-relaxed">
                                To become the world's leading platform for Islamic education, creating a generation of knowledgeable, confident Muslims who embody the teachings of Islam and contribute positively to their communities and the world.
                            </p>

                            <div className="space-y-3 pt-4">
                                {[
                                    "A world where Islamic knowledge is accessible to all",
                                    "Muslims confidently practicing their faith",
                                    "Strong, connected global Muslim community",
                                    "Continuous pursuit of beneficial knowledge"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="p-1 bg-purple-500/20 rounded-full mt-1">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Objectives Section */}
            <div className="Resizer mx-auto py-18">
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-[#004aad]">
                        <Sparkles className="w-5 h-5 text-[#004aad]" />
                        <span className="text-sm text-[#004aad] tracking-wider uppercase">Our Objectives</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold bg-black bg-clip-text text-transparent">
                        What We Aim to Achieve
                    </h2>

                    <p className="text-base text-black ">
                        Our comprehensive objectives guide every aspect of our educational approach
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {objectives.map((objective, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-md p-4 border border-[#004aad] cursor-pointer hover:-translate-y-2 transition-all duration-500"
                            style={{ animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards` }}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute -inset-0.5 bg-linear-to-r ${objective.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}></div>

                            <div className="relative space-y-4">
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl text-4xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    {objective.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg text-black group-hover:bg-linear-to-r group-hover:from-[#004aad] group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                    {objective.title}
                                </h3>

                                {/* Accent Line */}
                                <div className={`h-1 w-0 group-hover:w-20 bg-linear-to-r ${objective.color} rounded-full transition-all duration-700`}></div>

                                {/* Description */}
                                <p className="text-black leading-relaxed">
                                    {objective.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <PrivateTutorRequestCTA />
            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
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

export default AboutUs;

