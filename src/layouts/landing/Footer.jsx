import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, Heart } from 'lucide-react';
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Map string icons back to components
  const iconMap = {
    Mail,
    Phone,
    MapPin,
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden">

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>

      <div className="relative z-10">

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* About Column */}
            <div className="space-y-6">
              <div className="space-y-4">
                <img
                  src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
                  alt="Halimatu Academy Logo"
                  draggable="false"
                  className="w-34 h-auto mb-4"
                />
                <p className="text-gray-400 leading-relaxed">
                  {t.footer.aboutDescription}
                </p>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  {t.footer.followUs}
                </h4>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: "#", color: "hover:bg-blue-600", name: "Facebook" },
                    { icon: Twitter, href: "#", color: "hover:bg-sky-500", name: "Twitter" },
                    { icon: Instagram, href: "#", color: "hover:bg-pink-600", name: "Instagram" },
                    { icon: Linkedin, href: "#", color: "hover:bg-blue-700", name: "LinkedIn" }
                  ].map((social, index) => {
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
              <h3 className="text-xl font-bold text-white">{t.footer.quickLinksTitle}</h3>
              <ul className="space-y-3">
                {t.footer.quickLinks.map((link, index) => (
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
              <h3 className="text-xl font-bold text-white">{t.footer.resourcesTitle}</h3>
              <ul className="space-y-3">
                {t.footer.resources.map((link, index) => (
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
              <h3 className="text-xl font-bold text-white">{t.footer.contactTitle}</h3>
              <ul className="space-y-4">
                {t.footer.contact.map((item, index) => {
                  const Icon = iconMap[item.icon];
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
            <p className="text-center text-sm flex items-center justify-center gap-2">
              {t.footer.copyright(currentYear)}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;