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
    `flex-shrink-0 min-w-[90px] text-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? "text-[#004AAD]"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    }`;

  /* MOBILE LINKS – full width */
  const mobileLink =
    "block w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50";

  return (
    <div className="sticky top-0 z-50 bg-white">
      <header className="bg-white">
        <div className="Resizer px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">

            {/* LOGO */}
            <NavLink to="/" className="shrink-0">
              <div className="w-32 h-8 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-black text-sm">LOGO</span>
              </div>
            </NavLink>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-4">

              <NavLink to="/" className={linkClasses}>
                {t.menu.home}
              </NavLink>

              <NavLink to="/about" className={linkClasses}>
                {t.menu.about}
              </NavLink>

              {/* STUDY PLAN */}
              <div className="relative shrink-0">
                <button
                  onClick={toggleStudy}
                  className="w-full flex justify-center items-center gap-1 px-3 py-2 text-sm font-medium bg-gray-100 rounded-md"
                >
                  {t.menu.studyPlan}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isStudyOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white z-50">
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

              <NavLink to="/registration" className={linkClasses}>
                {t.menu.registration}
              </NavLink>

              {/* LANGUAGE */}
              <div className="relative shrink-0 min-w-[90px]">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="w-full flex justify-center items-center gap-1 px-3 py-2 text-sm font-medium bg-gray-100 rounded-md"
                >
                  <Globe className="h-4 w-4" />
                  {language.toUpperCase()}
                </button>

                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-md shadow z-50">
                    {["en", "es", "ar"].map((lng) => (
                      <button
                        key={lng}
                        onClick={() => {
                          setLanguage(lng);
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
                <button className="min-w-25 px-6 py-2 text-sm border border-[#101E55] rounded-md">
                  {t.menu.login}
                </button>
              </NavLink>

              <NavLink to="/register">
                <button className="min-w-30 px-6 py-2 text-sm bg-gradient text-white rounded-md">
                  {t.menu.register}
                </button>
              </NavLink>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={toggleMenu}
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

              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-bold">LOGO</span>
                <button onClick={toggleMenu}><X /></button>
              </div>

              <nav className="mt-4 space-y-2">
                <NavLink to="/" className={mobileLink}>{t.menu.home}</NavLink>
                <NavLink to="/about" className={mobileLink}>{t.menu.about}</NavLink>

                <button
                  onClick={toggleStudy}
                  className="w-full flex justify-between items-center px-3 py-2 bg-gray-100 rounded-md"
                >
                  {t.menu.studyPlan}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isStudyOpen && (
                  <div className="ml-4 space-y-1">
                    <NavLink to="/curriculum" className={mobileLink}>
                      {t.menu.curriculum}
                    </NavLink>
                    <NavLink to="/schedule" className={mobileLink}>
                      {t.menu.schedule}
                    </NavLink>
                  </div>
                )}

                <NavLink to="/faculty" className={mobileLink}>{t.menu.faculty}</NavLink>
                <NavLink to="/registration" className={mobileLink}>{t.menu.registration}</NavLink>

                <div className="pt-4 border-t space-y-1">
                  {["en", "es", "ar"].map((lng) => (
                    <button
                      key={lng}
                      onClick={() => {
                        setLanguage(lng);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left hover:bg-gray-50"
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
