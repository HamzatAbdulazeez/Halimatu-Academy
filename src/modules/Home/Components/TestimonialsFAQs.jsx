import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { GOLD, NAVY, WHITE } from "../../../i18n/tokens";

const testimonials = [
  {
    name: "Amina O.",
    role: "Parent, Lagos",
    text: "My daughter started Year 1 and her Qur'an recitation has improved tremendously in just 3 months. The tutors are so patient and encouraging. Alhamdulillah!",
    stars: 5,
  },
  {
    name: "Ibrahim K.",
    role: "Adult Learner, Abuja",
    text: "I'm 42 and always wanted to learn proper Arabic. The private tutor option was perfect for me. My tutor adapts everything to my schedule. Highly recommended.",
    stars: 5,
  },
  {
    name: "Fatima M.",
    role: "Parent, Kano",
    text: "The pricing is very fair and the quality is excellent. My son is in Year 2 now studying Tajwīd and he loves it. The online format works perfectly for us.",
    stars: 5,
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  const t = testimonials[idx];

  return (
    <section style={{ background: NAVY, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        {/* Label */}
        <div
          style={{
            display: "inline-block",
            background: "rgba(245,197,24,0.12)",
            border: "1px solid rgba(245,197,24,0.25)",
            color: GOLD,
            padding: "6px 20px",
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 56,
          }}
        >
          Student Stories
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(245,197,24,0.15)",
            borderRadius: 24,
            padding: "56px 48px",
          }}
        >
          {/* Stars */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              marginBottom: 28,
            }}
          >
            {Array(t.stars)
              .fill(0)
              .map((_, i) => (
                <Star key={i} size={20} fill={GOLD} color={GOLD} />
              ))}
          </div>

          <p
            style={{
              fontSize: 22,
              color: WHITE,
              lineHeight: 1.7,
              fontStyle: "italic",
              marginBottom: 36,
              letterSpacing: 0.2,
            }}
          >
            "{t.text}"
          </p>

          <div>
            <div style={{ color: GOLD, fontWeight: 800, fontSize: 16 }}>
              {t.name}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {t.role}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 28,
          }}
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                background:
                  i === idx ? GOLD : "rgba(255,255,255,0.2)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}