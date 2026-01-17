import { Laptop, BookOpen } from 'lucide-react';

const ZadAcademyBanner = () => {

  return (
    <div className="w-full Resizer mx-auto p-4 space-y-4">

      {/* About Us Section */}
      <div className="section rounded-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 bg-linear-to-br from-gray-50 to-white">
          {/* Left - Image */}
          <div className="relative h-full min-h-80 overflow-hidden">
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1768643049/Halimatu-Academy-Images/The-Laila-Dogonyaro-Islamic-Centre-Abuja_tbfeea.jpg"
              alt="Students learning"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-emerald-600/20 to-transparent"></div>
            {/* Floating Stats Cards */}
            <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <p className="text-3xl font-bold text-emerald-600">100+</p>
                <p className="text-sm text-black">Active Students</p>
              </div>
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <p className="text-3xl font-bold text-blue-600">10+</p>
                <p className="text-sm text-black">Expert Scholars</p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="md:p-12 sm:p-6 p-6 space-y-4 flex flex-col justify-center">
            <div className="inline-block w-fit">
              <span className="px-4 py-2 bg-gradient text-white rounded-full text-sm">
                About Us
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Transforming Lives Through Islamic Education
            </h2>
            
            <p className="text-base text-black leading-loose">
              HSA Academy is a pioneering online Islamic education platform dedicated to making authentic Islamic knowledge accessible to Muslims worldwide.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Authentic Curriculum</h3>
                <p className="text-sm text-gray-600">Based on classical Islamic texts and teachings</p>
              </div>
              
              
              <div className="space-y-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Laptop className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Flexible Learning</h3>
                <p className="text-sm text-gray-600">Study at your own pace, anytime, anywhere</p>
              </div>
            
            </div>

            <div className="pt-4">
              <button className="px-8 py-3 bg-gradient cursor-pointer text-white rounded-md hover:scale-105 transition-all">
                Discover Our Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZadAcademyBanner;