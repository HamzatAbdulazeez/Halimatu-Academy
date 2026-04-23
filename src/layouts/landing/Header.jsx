import { useState, useEffect, useRef } from "react";
import { NavLink , useLocation } from "react-router-dom";
import { Menu, X, Globe, ChevronDown, UserCheck } from "lucide-react";
import PrivateTutorRequestModal from "../../modules/Home/Components/PrivateTutorRequestModal";

const GOLD      = "#F5C518";
const GOLD_DARK = "#C9A000";
const NAVY      = "#0A1628";
const WHITE     = "#ffffff";



const STORAGE_KEY = "hs_academy_lang";
const links = [
  { label: "Home",       type: "route", to: "/"        },
  { label: "About Us",   type: "route", to: "/about"   },
  { label: "Courses",    type: "hash",  href: "#courses"  },
  { label: "Features",   type: "hash",  href: "#features" },
  { label: "Contact Us", type: "route", to: "/contact" },
];

/* ── Google Translate cookie helpers ── */
function setGTCookie(lng) {
  const val = `/en/${lng}`;
  document.cookie = `googtrans=${val};path=/`;
  document.cookie = `googtrans=${val};domain=${window.location.hostname};path=/`;
}
function clearGTCookie() {
  const past = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=;expires=${past};path=/`;
  document.cookie = `googtrans=;expires=${past};domain=${window.location.hostname};path=/`;
}
function getSaved() {
  return localStorage.getItem(STORAGE_KEY) || "en";
}

/* ── Shared link styles ── */
const desktopLinkStyle = {
  color: "rgba(255,255,255,0.85)",
  textDecoration: "none",
  fontSize: 15,
  fontWeight: 400,
  letterSpacing: 0.3,
  transition: "color 0.2s",
  whiteSpace: "nowrap",
};
const mobileLinkStyle = {
  display: "block",
  color: WHITE,
  textDecoration: "none",
  padding: "13px 0",
  fontSize: 15,
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  background: "none",
  border: "none",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
};

export default function Navbar() {
  const [open,         setOpen]       = useState(false);
  const [scrolled,     setScrolled]   = useState(false);
  const [langOpen,     setLangOpen]   = useState(false);
  const [currentLang,  setLang]       = useState(getSaved);
  const [tutorModal,   setTutorModal] = useState(false);
  const gtLoaded = useRef(false);

  const location = useLocation(); 
const isHomePage = location.pathname === "/";

  /* ── Scroll shadow ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Google Translate bootstrap ── */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame,
      .goog-te-balloon-frame,
      .goog-te-ftab-float,
      #goog-gt-tt,
      .goog-te-menu-value,
      .goog-te-gadget,
      .goog-logo-link { display: none !important; }
      body            { top: 0 !important; position: static !important; }
      .skiptranslate  { display: none !important; }
      iframe.skiptranslate { display: none !important; }
    `;
    document.head.appendChild(style);

    const saved = getSaved();
    if (saved !== "en") setGTCookie(saved);
    else clearGTCookie();

    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,ar", autoDisplay: false },
          "google_translate_element"
        );
        gtLoaded.current = true;
      };
      const s = document.createElement("script");
      s.id    = "google-translate-script";
      s.src   = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    } else {
      gtLoaded.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Language change ── */
  const handleLangChange = (lng) => {
    if (lng === currentLang) { setLangOpen(false); return; }
    localStorage.setItem(STORAGE_KEY, lng);
    setLang(lng);
    setLangOpen(false);
    if (lng === "en") { clearGTCookie(); } else { setGTCookie(lng); }
    window.location.reload();
  };

  /* ── Close lang dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("#lang-wrapper")) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Helper: render a desktop nav link ── */
  const DesktopLink = ({ link }) => {
    if (link.type === "route") {
      return (
        <NavLink
          to={link.to}
          style={({ isActive }) => ({
            ...desktopLinkStyle,
            color: isActive ? GOLD : "rgba(255,255,255,0.85)",
          })}
          onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
          onMouseLeave={(e) => {
            // keep gold if active — NavLink re-applies style prop anyway on next render
            e.currentTarget.style.color = "rgba(255,255,255,0.85)";
          }}
        >
          {link.label}
        </NavLink>
      );
    }
    return (
      <a
        href={link.href}
        style={desktopLinkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
      >
        {link.label}
      </a>
    );
  };

  /* ── Helper: render a mobile nav link ── */
  const MobileLink = ({ link }) => {
    if (link.type === "route") {
      return (
        <NavLink
          to={link.to}
          onClick={() => setOpen(false)}
          style={mobileLinkStyle}
        >
          {link.label}
        </NavLink>
      );
    }
    return (
      <a
        href={link.href}
        onClick={() => setOpen(false)}
        style={mobileLinkStyle}
      >
        {link.label}
      </a>
    );
  };

  /* ─────────────── RENDER ─────────────── */
  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />

      <nav
        style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    // If it's NOT the home page, OR if we have scrolled, show NAVY
    background: !isHomePage || scrolled ? NAVY : "transparent",
    transition: "background 0.4s ease",
    color: WHITE,
    // Show the border only when the background is solid
    borderBottom: !isHomePage || scrolled ? "1px solid rgba(245,197,24,0.2)" : "none",
  }}
      >
        {/* ── INNER ROW ── */}
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
          }}
        >
          {/* ── LOGO ── */}
          <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img
              src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
              alt="Halimatu Sa'diyyah Islamic Academy"
              style={{
                width: 52, height: 52,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ color: GOLD, fontWeight: 800, fontSize: 13, letterSpacing: 1, lineHeight: 2 }}>
                HALIMATU SA'DIYYAH
              </div>
              <div style={{ color: "#fff", fontSize: 10, letterSpacing: 0.5 }}>
                ISLAMIC ACADEMY
              </div>
            </div>
          </NavLink>

          {/* ── DESKTOP NAV LINKS ── */}
          <div className="desktop-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {links.map((l) => <DesktopLink key={l.label} link={l} />)}

            {/* Private Tutor button */}
            <button
              onClick={() => setTutorModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(245,197,24,0.12)",
                border: `1px solid ${GOLD}`,
                color: GOLD,
                padding: "8px 14px", borderRadius: 5,
                fontSize: 14, fontWeight: 400,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,197,24,0.22)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(245,197,24,0.12)")}
            >
              <UserCheck size={15} />
              Private Tutor
            </button>
          </div>

          {/* ── DESKTOP RIGHT: Lang + Auth + CTA ── */}
          <div className="desktop-right" style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* Language switcher */}
            <div id="lang-wrapper" style={{ position: "relative" }}>
              <button
                onClick={(e) => { e.stopPropagation(); setLangOpen((v) => !v); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: WHITE,
                  padding: "8px 12px", borderRadius: 5,
                  fontSize: 14, fontWeight: 400,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                <Globe size={14} />
                {currentLang === "en" ? "🇬🇧 EN" : "🇸🇦 AR"}
                <ChevronDown
                  size={12}
                  style={{ transform: langOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                />
              </button>

              {langOpen && (
                <div
                  style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0,
                    background: NAVY,
                    border: "1px solid rgba(245,197,24,0.25)",
                    borderRadius: 5, overflow: "hidden",
                    minWidth: 120,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    zIndex: 200,
                  }}
                >
                  {[
                    { code: "en", label: "🇬🇧 English" },
                    { code: "ar", label: "🇸🇦 العربية" },
                  ].map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => handleLangChange(code)}
                      style={{
                        display: "block", width: "100%",
                        padding: "11px 14px",
                        background: currentLang === code ? "rgba(245,197,24,0.12)" : "none",
                        border: "none",
                        color: currentLang === code ? GOLD : "rgba(255,255,255,0.85)",
                        fontSize: 13,
                        fontWeight: currentLang === code ? 700 : 500,
                        textAlign: "left", cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,197,24,0.1)"; e.currentTarget.style.color = GOLD; }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = currentLang === code ? "rgba(245,197,24,0.12)" : "none";
                        e.currentTarget.style.color = currentLang === code ? GOLD : "rgba(255,255,255,0.85)";
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login */}
            <NavLink to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  border: "1px solid rgba(255,255,255,0.4)", color: WHITE,
                  background: "none", padding: "8px 18px", borderRadius: 5,
                  fontSize: 14, fontWeight: 400, cursor: "pointer", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = WHITE; }}
              >
                Login
              </button>
            </NavLink>

            {/* Register */}
            <NavLink to="/register" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                  color: NAVY, border: "none",
                  padding: "8px 18px", borderRadius: 5,
                  fontSize: 14, fontWeight: 400, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(245,197,24,0.35)", whiteSpace: "nowrap",
                }}
              >
                Register
              </button>
            </NavLink>

          </div>

          {/* ── MOBILE TOGGLE ── */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="mobile-menu-btn"
            style={{ background: "none", border: "none", color: WHITE, cursor: "pointer", display: "none" }}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── MOBILE DROPDOWN ── */}
        {open && (
          <div style={{ background: NAVY, padding: "16px 24px 28px", borderTop: "1px solid rgba(245,197,24,0.2)" }}>

            {/* Nav links */}
            {links.map((l) => <MobileLink key={l.label} link={l} />)}

            {/* Private Tutor mobile */}
            <button
              onClick={() => { setTutorModal(true); setOpen(false); }}
              style={{
                ...mobileLinkStyle,
                color: GOLD,
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <UserCheck size={17} />
              Private Tutor
            </button>

            {/* Mobile lang */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {[
                { code: "en", label: "🇬🇧 English" },
                { code: "ar", label: "🇸🇦 العربية" },
              ].map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => handleLangChange(code)}
                  style={{
                    flex: 1, padding: "11px 8px", borderRadius: 5,
                    fontSize: 14, fontWeight: 400, cursor: "pointer",
                    border: `1px solid ${currentLang === code ? GOLD : "rgba(255,255,255,0.2)"}`,
                    background: currentLang === code ? "rgba(245,197,24,0.15)" : "rgba(255,255,255,0.05)",
                    color: currentLang === code ? GOLD : WHITE,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Mobile auth */}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <NavLink to="/login" style={{ flex: 1, textDecoration: "none" }} onClick={() => setOpen(false)}>
                <button
                  style={{
                    width: "100%", padding: "12px", borderRadius: 5,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    background: "none", border: "1px solid rgba(255,255,255,0.4)", color: WHITE,
                  }}
                >
                  Login
                </button>
              </NavLink>
              <NavLink to="/register" style={{ flex: 1, textDecoration: "none" }} onClick={() => setOpen(false)}>
                <button
                  style={{
                    width: "100%", padding: "12px", borderRadius: 5,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                    border: "none", color: NAVY,
                  }}
                >
                  Register
                </button>
              </NavLink>
            </div>

          </div>
        )}

        <style>{`
          @media (max-width: 1024px) {
            .desktop-nav     { display: none !important; }
            .desktop-right   { display: none !important; }
            .mobile-menu-btn { display: block !important; }
          }
        `}</style>
      </nav>

      {/* ── PRIVATE TUTOR MODAL ── */}
      <PrivateTutorRequestModal
        isOpen={tutorModal}
        onClose={() => setTutorModal(false)}
      />
    </>
  );
}