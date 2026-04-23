import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { GOLD, GOLD_DARK, NAVY, WHITE } from "../../../i18n/tokens";

const heroSlides = [
  {
    badge: "✦ Online Arabic & Islamic Classes",
    title: "Learn Qur'an & Arabic",
    subtitle: "From Home, With Expert Tutors",
    desc: "Give your child — or yourself — the gift of Qur'an and Arabic. Learn from qualified, experienced tutors without leaving home.",
    bg: `linear-gradient(135deg, #0A1628 0%, #0F2147 50%, #1A3466 100%)`,
  },
  {
    badge: "✦ 4-Year Structured Program",
    title: "A Complete Islamic",
    subtitle: "Education Journey",
    desc: "From Qur'an recitation to Tafsir and Taohid — our four-year curriculum gives you a comprehensive foundation in Islamic knowledge.",
    bg: `linear-gradient(135deg, #0F1B0A 0%, #163310 50%, #1E4A14 100%)`,
  },
  {
    badge: "✦ Private Tutor Available",
    title: "One-on-One Learning",
    subtitle: "Tailored Just for You",
    desc: "Request a private tutor for personalized, focused sessions. Whether you're a beginner or advanced learner, we have the right teacher for you.",
    bg: `linear-gradient(135deg, #1A0A28 0%, #2D1045 50%, #3D1766 100%)`,
  },
];

const quickBadges = [
  { icon: "👶", text: "Ages 8–60" },
  { icon: "🏠", text: "Learn from Home" },
  { icon: "👨‍🏫", text: "Private Tutor Available" },
  { icon: "💰", text: "Affordable Fees" },
];

export default function HeroBanner() {
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(
      // eslint-disable-next-line react-hooks/immutability
      () => goTo((slide + 1) % heroSlides.length),
      5500
    );
    return () => clearInterval(t);
  }, [slide]);

  const goTo = (idx) => {
    setAnimating(true);
    setTimeout(() => {
      setSlide(idx);
      setAnimating(false);
    }, 300);
  };

  const s = heroSlides[slide];

  return (
    <section
      id="home"
      style={{
        minHeight: "90vh",
        background: s.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.8s ease",
      }}
    >
      {/* Decorative rings */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "1px solid rgba(245,197,24,0.12)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: "1px solid rgba(245,197,24,0.18)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: "1px solid rgba(245,197,24,0.1)",
          pointerEvents: "none",
        }}
      />

      {/* Arabic text watermark */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 40,
          fontSize: 80,
          color: "rgba(245,197,24,0.06)",
          pointerEvents: "none",
          lineHeight: 1,
          direction: "rtl",
        }}
      >
        بِسْمِ اللَّهِ
      </div>

      {/* Slide Content */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 32px 80px",
          textAlign: "center",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(16px)" : "translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Arabic name */}
        <div
          style={{
            color: GOLD,
            fontSize: 28,
            marginBottom: 16,
            letterSpacing: 1,
            direction: "rtl",
          }}
        >
          أكاديمية حليمة السعدية الإسلامية
        </div>

        {/* Badge */}
        <div
          style={{
            display: "inline-block",
            background: "rgba(245,197,24,0.15)",
            border: "1px solid rgba(245,197,24,0.35)",
            color: GOLD,
            padding: "6px 20px",
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 1,
            marginBottom: 32,
          }}
        >
          {s.badge}
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 68px)",
            fontWeight: 900,
            color: WHITE,
            lineHeight: 1.1,
            margin: "0 0 8px",
            letterSpacing: -1,
          }}
        >
          {s.title}
        </h1>
        <h2
          style={{
            fontSize: "clamp(28px, 4.5vw, 52px)",
            fontWeight: 300,
            color: GOLD,
            lineHeight: 1.2,
            margin: "0 0 28px",
            letterSpacing: -0.5,
          }}
        >
          {s.subtitle}
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 620,
            margin: "0 auto 48px",
            lineHeight: 1.7,
          }}
        >
          {s.desc}
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#enroll"
            style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
              color: NAVY,
              padding: "16px 40px",
              borderRadius: 10,
              fontWeight: 900,
              fontSize: 16,
              textDecoration: "none",
              letterSpacing: 0.5,
              boxShadow: "0 8px 32px rgba(245,197,24,0.45)",
              display: "inline-block",
            }}
          >
            Enrol Now — Free Consultation
          </a>
          <a
            href="#courses"
            style={{
              background: "transparent",
              border: "2px solid rgba(255,255,255,0.3)",
              color: WHITE,
              padding: "16px 40px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            View Courses
          </a>
        </div>

        {/* Quick Badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginTop: 48,
            flexWrap: "wrap",
          }}
        >
          {quickBadges.map((b) => (
            <div
              key={b.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "8px 16px",
                borderRadius: 100,
                color: "rgba(255,255,255,0.85)",
                fontSize: 13,
              }}
            >
              <span style={{ fontSize: 14 }}>{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
        }}
      >
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === slide ? 32 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background:
                i === slide ? GOLD : "rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          color: "rgba(255,255,255,0.4)",
          fontSize: 11,
          letterSpacing: 2,
        }}
      >
        <span style={{ writingMode: "vertical-rl", textTransform: "uppercase" }}>
          Scroll
        </span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
}