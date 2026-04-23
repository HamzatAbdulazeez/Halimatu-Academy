import { GOLD, GOLD_DARK, NAVY, WHITE } from "../../../i18n/tokens";

const benefits = [
  {
    emoji: "🎯",
    title: "Fully Personalized",
    text: "Curriculum tailored to your exact level and goals",
  },
  {
    emoji: "⏰",
    title: "Your Schedule",
    text: "Book sessions whenever it works for you",
  },
  {
    emoji: "🚀",
    title: "Faster Progress",
    text: "Learn at your own pace without waiting for others",
  },
  {
    emoji: "💬",
    title: "Direct Feedback",
    text: "Immediate correction and encouragement from your tutor",
  },
];

export default function PrivateTutor() {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 60%, #B8860B 100%)`,
        padding: "80px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
        className="private-tutor-grid"
      >
        {/* Left — CTA */}
        <div>
          <div
            style={{
              display: "inline-block",
              background: "rgba(10,22,40,0.15)",
              color: NAVY,
              padding: "6px 16px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Exclusive Offering
          </div>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: NAVY,
              margin: "0 0 20px",
              lineHeight: 1.15,
            }}
          >
            Want a
            <br />
            Private Tutor?
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(10,22,40,0.75)",
              lineHeight: 1.8,
              marginBottom: 32,
            }}
          >
            Get undivided attention with our one-on-one private tutor option.
            Classes are scheduled entirely around you — your pace, your time,
            your goals.
          </p>
          <a
            href="#enroll"
            style={{
              display: "inline-block",
              background: NAVY,
              color: GOLD,
              padding: "16px 36px",
              borderRadius: 10,
              fontWeight: 900,
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(10,22,40,0.25)",
            }}
          >
            Request Private Tutor →
          </a>
        </div>

        {/* Right — Benefits Card */}
        <div
          style={{
            background: NAVY,
            borderRadius: 24,
            padding: 40,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3
            style={{
              color: GOLD,
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 24,
            }}
          >
            Private Tutor Benefits
          </h3>
          {benefits.map((b) => (
            <div
              key={b.title}
              style={{ display: "flex", gap: 16, marginBottom: 20 }}
            >
              <div style={{ fontSize: 22, flexShrink: 0 }}>{b.emoji}</div>
              <div>
                <div
                  style={{ color: WHITE, fontWeight: 700, fontSize: 15 }}
                >
                  {b.title}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {b.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .private-tutor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}