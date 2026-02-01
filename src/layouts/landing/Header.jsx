import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function Header() {
  const { language, setLanguage } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsStudyOpen(false);
    setIsLangOpen(false);
  };

  // Initialize Google Translate
  useEffect(() => {
    // Add CSS to hide Google Translate bar and widget
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide Google Translate bar at top */
      .goog-te-banner-frame {
        display: none !important;
      }
      
      /* Hide Google Translate widget */
      .goog-te-gadget {
        display: none !important;
      }
      
      /* Remove top margin/padding added by Google Translate */
      body {
        top: 0 !important;
        position: static !important;
      }
      
      /* Hide the iframe container */
      .skiptranslate {
        display: none !important;
      }
      
      /* Additional cleanup */
      iframe.skiptranslate {
        display: none !important;
      }

      /* Allow manual translations to work alongside Google Translate */
      .manual-translate {
        translate: no;
      }
    `;
    document.head.appendChild(style);

    // Add meta tag to prevent auto-translation (but allow manual trigger)
    const meta = document.createElement('meta');
    meta.name = 'google';
    meta.content = 'notranslate';
    document.head.appendChild(meta);

    // Add Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Initialize Google Translate widget
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ar",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
        },
        "google_translate_element"
      );
    };

    return () => {
      // Cleanup
      if (meta.parentNode) {
        meta.parentNode.removeChild(meta);
      }
    };
  }, []);

  // Function to change language via Google Translate
  const changeGoogleLanguage = (lng) => {
    // Update your context first (for manual translations on Homepage)
    setLanguage(lng);

    // Wait a brief moment for context to update, then trigger Google Translate
    setTimeout(() => {
      const select = document.querySelector('.goog-te-combo');
      if (!select) {
        console.warn('Google Translate not ready yet. Please wait a moment and try again.');
        return;
      }

      // For English: reset to original (empty value means original language)
      // For Arabic: translate to 'ar'
      const targetValue = lng === 'en' ? '' : lng;
      
      if (select.value !== targetValue) {
        select.value = targetValue;
        select.dispatchEvent(new Event('change'));
      }
    }, 100);
  };

  const linkClasses = ({ isActive }) =>
    `flex-shrink-0 min-w-[90px] text-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? "text-[#004AAD]"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    }`;

  const mobileLink =
    "block w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50";

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <div className="fixed top-0 z-50 w-full bg-white notranslate">
        <header>
          <div className="Resizer px-4 sm:px-6">
            <div className="flex items-center justify-between h-20">

              {/* LOGO */}
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <NavLink to="/" onClick={closeAll}>
                    <img
                      src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
                      alt=""
                      draggable="false"
                      className="w-24 h-auto"
                    />
                  </NavLink>
                </div>
              </div>

              {/* DESKTOP NAV */}
              <nav className="hidden lg:flex items-center gap-2 xl:gap-4">

                <NavLink to="/" className={linkClasses}>
                  Home
                </NavLink>

                <NavLink to="/about" className={linkClasses}>
                  About Us
                </NavLink>

                {/* STUDY PLAN */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => {
                      setIsStudyOpen(!isStudyOpen);
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition
        ${isStudyOpen ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"}
      `}
                  >
                    Study Plan
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isStudyOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isStudyOpen && (
                    <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">
                      <NavLink
                        to="/curriculum"
                        onClick={() => setIsStudyOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <div className="font-medium">Curriculum</div>
                        <p className="text-xs text-gray-500">
                          View course structure & modules
                        </p>
                      </NavLink>

                      <NavLink
                        to="/schedule"
                        onClick={() => setIsStudyOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <div className="font-medium">Schedule</div>
                        <p className="text-xs text-gray-500">
                          Class timetable & timelines
                        </p>
                      </NavLink>
                    </div>
                  )}
                </div>

                <NavLink to="/knowledge-series" className={linkClasses}>
                  Knowledge Series
                </NavLink>

                <NavLink to="/faqs" className={linkClasses}>
                  FAQs
                </NavLink>

                <NavLink to="/contact" className={linkClasses}>
                  Contact Us
                </NavLink>

                {/* LANGUAGE */}
                <div className="relative shrink-0 min-w-20.5">
                  <button
                    onClick={() => {
                      setIsLangOpen(!isLangOpen);
                      setIsStudyOpen(false);
                    }}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-gray-100 rounded-md"
                  >
                    <Globe className="h-4 w-4" />
                    {language.toUpperCase()}
                  </button>

                  {isLangOpen && (
                    <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-md shadow z-50">
                      {["en", "ar"].map((lng) => (
                        <button
                          key={lng}
                          onClick={() => {
                            changeGoogleLanguage(lng);
                            setIsLangOpen(false);
                          }}
                          className="block w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                        >
                          {lng.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </nav>

              {/* DESKTOP AUTH */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                <NavLink to="/login">
                  <button className="min-w-24 px-5 py-2 text-sm border border-[#101E55] rounded-md">
                    Login
                  </button>
                </NavLink>

                <NavLink to="/register">
                  <button className="min-w-28 px-5 py-2 text-sm bg-gradient text-white rounded-md">
                    Register
                  </button>
                </NavLink>
              </div>

              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/30 lg:hidden">
              <div className="fixed top-0 right-0 h-full w-80 bg-white p-4 shadow-xl">

                <div className="flex justify-between items-center border-b border-gray-400 pb-3">
                  <NavLink to="/" onClick={closeAll}>
                    <img
                      src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1769389099/Halimatu-Academy-Images/logo_3_1_bmduex.png"
                      alt=""
                      draggable="false"
                      className="w-20 h-auto"
                    />
                  </NavLink>
                  <button onClick={closeAll}>
                    <X />
                  </button>
                </div>

                <nav className="mt-4 space-y-4">

                  <NavLink to="/" className={mobileLink} onClick={closeAll}>
                    Home
                  </NavLink>
                  <NavLink to="/about" className={mobileLink} onClick={closeAll}>
                    About Us
                  </NavLink>

                  {/* STUDY PLAN MOBILE */}
                  <button
                    onClick={() => setIsStudyOpen(!isStudyOpen)}
                    className="w-full flex justify-between items-center px-3 py-2 bg-gray-100 rounded-md"
                  >
                    Study Plan
                    <ChevronDown
                      className={`h-4 w-4 transition ${
                        isStudyOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isStudyOpen && (
                    <div className="ml-4 space-y-1">
                      <NavLink
                        to="/curriculum"
                        className={mobileLink}
                        onClick={closeAll}
                      >
                        Curriculum
                      </NavLink>
                      <NavLink
                        to="/schedule"
                        className={mobileLink}
                        onClick={closeAll}
                      >
                        Schedule
                      </NavLink>
                    </div>
                  )}

                  <NavLink
                    to="/knowledge-series"
                    className={mobileLink}
                    onClick={closeAll}
                  >
                    Knowledge Series
                  </NavLink>

                  <NavLink to="/faqs" className={mobileLink} onClick={closeAll}>
                    FAQs
                  </NavLink>

                  <NavLink to="/contact" className={mobileLink} onClick={closeAll}>
                    Contact Us
                  </NavLink>

                  {/* AUTH MOBILE */}
                  <div className="pt-3 space-y-4">
                    <NavLink to="/login" onClick={closeAll}>
                      <button className="w-full px-4 py-3 border border-gray-400 rounded-md text-sm mb-4">
                        Login
                      </button>
                    </NavLink>

                    <NavLink to="/register" onClick={closeAll}>
                      <button className="w-full px-4 py-3 bg-gradient text-white rounded-md text-sm">
                        Register
                      </button>
                    </NavLink>
                  </div>

                  {/* LANGUAGE MOBILE */}
                  <div className="pt-3">
                    <p className="px-4 mb-2 text-xs text-gray-500 uppercase">
                      Language
                    </p>
                    <div className="grid grid-cols-2 gap-2 px-4">
                      {["en", "ar"].map((lng) => (
                        <button
                          key={lng}
                          onClick={() => {
                            changeGoogleLanguage(lng);
                            closeAll();
                          }}
                          className={`py-2 rounded-md text-sm font-medium ${
                            language === lng
                              ? "bg-gray-200"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {lng.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          )}
        </header>
      </div>
    </>
  );
}
