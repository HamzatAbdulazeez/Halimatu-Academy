import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "#" },
    { name: "The Program", href: "#" },
    { name: "Learning Path", href: "#" },
    { name: "Contact", href: "#" },
  ];

  const resources = [
    { name: "Student Portal", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Study Materials", href: "#" },
  ];

  const contact = [
    { icon: Mail, text: "info@zadacademy.com", href: "mailto:info@zadacademy.com" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: "123 Education Street, Learning City, LC 12345", href: "#" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:bg-blue-600", name: "Facebook" },
    { icon: Twitter, href: "#", color: "hover:bg-sky-500", name: "Twitter" },
    { icon: Instagram, href: "#", color: "hover:bg-pink-600", name: "Instagram" },
    { icon: Linkedin, href: "#", color: "hover:bg-blue-700", name: "LinkedIn" }
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden">

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-linear(circle, white 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold mb-2 bg-white bg-clip-text text-transparent">
                  Stay Updated
                </h3>
                <p className="text-white">Subscribe to our newsletter for the latest updates and Islamic insights</p>
              </div>
              
              <div className="w-full md:w-auto">
                <div className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-3  backdrop-blur-md border border-white rounded-md text-white placeholder-white outline-none transition-all duration-300"
                  />
                  <button className="px-6 py-3 bg-[#004aad] rounded-md transition-all duration-300 flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline">Subscribe</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* About Column */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold bg-white bg-clip-text text-transparent">
                  HSA Academy
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Empowering Muslims worldwide with authentic Islamic education. Learn at your own pace with renowned scholars.
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Follow Us</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.name}
                        className={`p-3 bg-white/10 backdrop-blur-md rounded-full ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#004aad] transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-[#004aad] group-hover:w-4 transition-all duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Resources</h3>
              <ul className="space-y-3">
                {resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#004aad] transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-[#004aad] group-hover:w-4 transition-all duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Contact Us</h3>
              <ul className="space-y-4">
                {contact.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="flex items-start gap-3 text-gray-400 hover:text-[#004aad] transition-colors duration-300 group"
                      >
                        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-sm leading-relaxed">{item.text}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white">
              <p className="flex items-center gap-2">
                © {currentYear} HSA Academy. Made with 
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> 
                for the Muslim Ummah
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a href="#" className="hover:text-[#004aad] transition-colors duration-300">Privacy Policy</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-[#004aad] transition-colors duration-300">Terms of Service</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-[#004aad] transition-colors duration-300">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;