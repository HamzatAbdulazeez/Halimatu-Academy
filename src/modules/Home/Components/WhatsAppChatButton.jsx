import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WhatsAppFloat = () => {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = "+2348145489933";
  const message = "Hello! I'm interested in learning Islamic Education.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip */}
        <div
          className={`absolute left-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          Chat with us on WhatsApp
          <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-gray-900"></div>
        </div>

        {/* Main Button */}
        <div className="relative">
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          
          {/* Button */}
          <div className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110">
            <MessageCircle size={32} className="fill-current" />
          </div>

          {/* Notification Badge (optional) */}
          <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            1
          </div>
        </div>
      </a>

      {/* Mobile-friendly version - slightly smaller */}
      <style>{`
        @media (max-width: 640px) {
          .group {
            bottom: 1rem;
            left: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppFloat;