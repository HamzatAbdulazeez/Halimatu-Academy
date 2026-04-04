import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Globe, LayoutDashboard } from "lucide-react"; // Added LayoutDashboard
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function Header() {
  const { language, setLanguage } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // --- AUTH LOGIC ---
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    dashboardUrl: "/login"
  });

  useEffect(() => {
    const checkAuth = () => {
      // Check for Admin tokens
      const adminToken = sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken");
      // Check for Student tokens
      const studentToken = localStorage.getItem("token");

      if (adminToken) {
        setAuthState({
          isLoggedIn: true,
          isAdmin: true,
          dashboardUrl: "/admin"
        });
      } else if (studentToken) {
        setAuthState({
          isLoggedIn: true,
          isAdmin: false,
          dashboardUrl: "/student"
        });
      } else {
        setAuthState({
          isLoggedIn: false,
          isAdmin: false,
          dashboardUrl: "/login"
        });
      }
    };

    checkAuth();
    // Listen for storage changes in other tabs
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsStudyOpen(false);
    setIsLangOpen(false);
  };

  // Google Translate Logic (Preserved exactly as you had it)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-gadget { display: none !important; }
      body { top: 0 !important; position: static !important; }
      .skiptranslate { display: none !important; }
      iframe.skiptranslate { display: none !important; }
    `;
    document.head.appendChild(style);

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: "en,ar",
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, "google_translate_element");
    };
  }, []);

  const changeGoogleLanguage = (lng) => {
    setLanguage(lng);
    setTimeout(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = lng === 'en' ? '' : lng;
        select.dispatchEvent(new Event('change'));
      }
    }, 100);
  };

  const linkClasses = ({ isActive }) =>
    `flex-shrink-0 min-w-[90px] text-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? "text-[#004AAD]" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    }`;

  const mobileLink = "block w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50";

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <div className="fixed top-0 z-50 w-full bg-white notranslate border-b border-gray-100">
        <header>
          <div className="Resizer px-4 sm:px-6">
            <div className="flex items-center justify-between h-20">

              {/* LOGO */}
              <div className="flex items-center">
                <NavLink to="/" onClick={closeAll}>
                  <img
                    src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
                    alt="Logo"
                    className="w-24 h-auto"
                  />
                </NavLink>
              </div>

              {/* DESKTOP NAV */}
              <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
                <NavLink to="/" className={linkClasses}>Home</NavLink>
                <NavLink to="/about" className={linkClasses}>About Us</NavLink>

                {/* STUDY PLAN */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => { setIsStudyOpen(!isStudyOpen); setIsLangOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${isStudyOpen ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"}`}
                  >
                    Study Plan
                    <ChevronDown className={`h-4 w-4 transition-transform ${isStudyOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isStudyOpen && (
                    <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">
                      <NavLink to="/curriculum" onClick={() => setIsStudyOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        <div className="font-medium">Curriculum</div>
                      </NavLink>
                      <NavLink to="/schedule" onClick={() => setIsStudyOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        <div className="font-medium">Schedule</div>
                      </NavLink>
                    </div>
                  )}
                </div>

                <NavLink to="/knowledge-series" className={linkClasses}>Knowledge Series</NavLink>
                <NavLink to="/faqs" className={linkClasses}>FAQs</NavLink>
                <NavLink to="/contact" className={linkClasses}>Contact Us</NavLink>

                {/* LANGUAGE */}
                <div className="relative shrink-0">
                  <button onClick={() => { setIsLangOpen(!isLangOpen); setIsStudyOpen(false); }} className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-gray-100 rounded-md">
                    <Globe className="h-4 w-4" />
                    {language.toUpperCase()}
                  </button>
                  {isLangOpen && (
                    <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-md shadow z-50">
                      {["en", "ar"].map((lng) => (
                        <button key={lng} onClick={() => { changeGoogleLanguage(lng); setIsLangOpen(false); }} className="block w-full px-3 py-2 text-sm text-left hover:bg-gray-50">
                          {lng.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </nav>

              {/* DESKTOP AUTH - CONDITIONAL RENDERING */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                {authState.isLoggedIn ? (
                  <NavLink to={authState.dashboardUrl}>
                    <button className="min-w-32 px-5 py-2 text-sm bg-[#004AAD] text-white rounded-md flex items-center justify-center gap-2">
                      <LayoutDashboard size={16} />
                      Dashboard
                    </button>
                  </NavLink>
                ) : (
                  <>
                    <NavLink to="/login">
                      <button className="min-w-24 px-5 py-2 text-sm border border-[#101E55] rounded-md">Login</button>
                    </NavLink>
                    <NavLink to="/register">
                      <button className="min-w-28 px-5 py-2 text-sm bg-gradient text-white rounded-md">Register</button>
                    </NavLink>
                  </>
                )}
              </div>

              {/* MOBILE TOGGLE */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
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
                    <img src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png" alt="Logo" className="w-20 h-auto" />
                  </NavLink>
                  <button onClick={closeAll}><X /></button>
                </div>

                <nav className="mt-4 space-y-4">
                  <NavLink to="/" className={mobileLink} onClick={closeAll}>Home</NavLink>
                  <NavLink to="/about" className={mobileLink} onClick={closeAll}>About Us</NavLink>

                  {/* AUTH MOBILE - CONDITIONAL RENDERING */}
                  <div className="pt-3 space-y-2">
                    {authState.isLoggedIn ? (
                      <NavLink to={authState.dashboardUrl} onClick={closeAll}>
                        <button className="w-full px-4 py-3 bg-[#004AAD] text-white rounded-md text-sm flex items-center justify-center gap-2">
                          <LayoutDashboard size={18} />
                          Go to Dashboard
                        </button>
                      </NavLink>
                    ) : (
                      <>
                        <NavLink to="/login" onClick={closeAll}>
                          <button className="w-full px-4 py-3 border border-gray-400 rounded-md text-sm">Login</button>
                        </NavLink>
                        <NavLink to="/register" onClick={closeAll}>
                          <button className="w-full px-4 py-3 bg-gradient text-white rounded-md text-sm">Register</button>
                        </NavLink>
                      </>
                    )}
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