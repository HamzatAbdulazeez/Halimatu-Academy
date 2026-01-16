import { useState } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleStudy = () => setIsStudyOpen(!isStudyOpen);

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
      isActive
        ? "text-[#004AAD]"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    }`;

  return (
    <div className="sticky top-0 z-50 bg-white">
      <header className="bg-white Resizer">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <div className="flex-shrink-0">
              <NavLink to="/">
                <div className="w-32 h-8 bg-gray-300 rounded flex items-center justify-center">
                  <span className="text-black text-sm">LOGO</span>
                </div>
              </NavLink>
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-4">

              <NavLink to="/" className={linkClasses}>
                {t.menu.home}
              </NavLink>

              <NavLink to="/about" className={linkClasses}>
                {t.menu.about}
              </NavLink>

              {/* STUDY PLAN */}
              <div className="relative">
                <button
                  onClick={toggleStudy}
                  className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 bg-gray-100 rounded-md"
                >
                  {t.menu.studyPlan}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isStudyOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md z-50">
                    <NavLink to="/curriculum" className={linkClasses}>
                      {t.menu.curriculum}
                    </NavLink>
                    <NavLink to="/schedule" className={linkClasses}>
                      {t.menu.schedule}
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink to="/faculty" className={linkClasses}>
                {t.menu.faculty}
              </NavLink>

              <NavLink to="/knowledge" className={linkClasses}>
                {t.menu.knowledge}
              </NavLink>

              <NavLink to="/registration" className={linkClasses}>
                {t.menu.registration}
              </NavLink>

              {/* LANGUAGE DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium bg-gray-100 rounded-md"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {language.toUpperCase()}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-2 w-24 bg-white rounded-md z-50">
                    {["en", "es", "ar"].map((lng) => (
                      <button
                        key={lng}
                        onClick={() => {
                          setLanguage(lng);
                          setIsLangOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        {lng.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* DESKTOP AUTH */}
            <div className="hidden lg:flex items-center space-x-3">
              <NavLink to="/login">
                <button className="text-[#101E55] px-8 py-2 text-sm font-medium border border-[#101E55] rounded-md hover:bg-gray-50">
                  {t.menu.login}
                </button>
              </NavLink>

              <NavLink to="/register">
                <button className="bg-gradient text-white px-8 py-2 text-sm font-medium rounded-md">
                  {t.menu.register}
                </button>
              </NavLink>
            </div>

            {/* MOBILE TOGGLE */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 p-2 rounded-md hover:bg-gray-100"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-25 lg:hidden">
            <div className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-xl p-4">

              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-bold">LOGO</span>
                <button onClick={toggleMenu}>
                  <X />
                </button>
              </div>

              <nav className="mt-4 space-y-2">
                <NavLink to="/" className={linkClasses}>{t.menu.home}</NavLink>
                <NavLink to="/about" className={linkClasses}>{t.menu.about}</NavLink>

                <button
                  onClick={toggleStudy}
                  className="flex justify-between items-center w-full px-3 py-2 bg-gray-100 rounded-md"
                >
                  {t.menu.studyPlan}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isStudyOpen && (
                  <div className="ml-4 space-y-1">
                    <NavLink to="/curriculum" className={linkClasses}>
                      {t.menu.curriculum}
                    </NavLink>
                    <NavLink to="/schedule" className={linkClasses}>
                      {t.menu.schedule}
                    </NavLink>
                  </div>
                )}

                <NavLink to="/faculty" className={linkClasses}>{t.menu.faculty}</NavLink>
                <NavLink to="/knowledge" className={linkClasses}>{t.menu.knowledge}</NavLink>
                <NavLink to="/registration" className={linkClasses}>{t.menu.registration}</NavLink>

                <div className="pt-4 border-t">
                  {["en", "es", "ar"].map((lng) => (
                    <button
                      key={lng}
                      onClick={() => {
                        setLanguage(lng);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      {lng.toUpperCase()}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
