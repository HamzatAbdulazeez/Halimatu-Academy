import { CheckCircle } from "lucide-react";
import { GOLD, GOLD_DARK, NAVY, NAVY_LIGHT, NAVY_MID, OFF_WHITE, WHITE } from "../../../i18n/tokens";

const promises = [
  "Sound, qualified Islamic tutors",
  "Structured curriculum for all levels",
  "Flexible scheduling around your life",
  "Private one-on-one sessions available",
  "Affordable with yearly payment plans",
];

const quickStats = [
  { value: "100+", label: "Students Enrolled" },
  { value: "4+", label: "Years Experience" },
  { value: "100%", label: "Online & Flexible" },
];

export default function About() {
  return (
    <section className="about-section" style={{ background: OFF_WHITE, padding: "80px" }}>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
        className="about-grid"
      >
        {/* Left — Text */}
        <div className="about-text-container">
          <div
            style={{
              display: "inline-block",
              background: "rgba(10,22,40,0.08)",
              color: NAVY_MID,
              padding: "6px 16px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            About Us
          </div>

          <h2
            className="about-title"
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: NAVY,
              lineHeight: 1.4,
              margin: "0 0 24px",
            }}
          >
            Knowledge is Light.
            <br />
            <span style={{ color: GOLD_DARK }}>We Carry the Torch.</span>
          </h2>

          <p
            style={{
              fontSize: 17,
              color: "#000",
              lineHeight: 1.8,
              marginBottom: 24,
            }}
          >
            Halimatu Sa'diyyah Islamic Academy was founded with one mission — to
            make authentic Islamic and Arabic education accessible to every
            Muslim, wherever they are in the world.
          </p>
          <p
            style={{
              fontSize: 17,
              color: "#000",
              lineHeight: 1.8,
              marginBottom: 36,
            }}
          >
            Our qualified tutors are passionate about nurturing a love for the
            Qur'an, Arabic language, and Islamic sciences. Whether you are 8 or
            60, a beginner or an advanced learner, there is a place for you
            here.
          </p>

          <div className="stats-row" style={{ display: "flex", gap: 40 }}>
            {quickStats.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: NAVY,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{ fontSize: 13, color: "#000", marginTop: 4 }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Card */}
        <div style={{ position: "relative" }} className="about-card-wrapper">
          <div
            className="about-card"
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
              borderRadius: 24,
              padding: 48,
              color: WHITE,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative ring */}
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: "2px solid rgba(245,197,24,0.2)",
              }}
            />
            <div style={{ fontSize: 40, marginBottom: 24 }}>🕌</div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: GOLD,
                marginBottom: 16,
              }}
            >
              Our Promise to You
            </h3>
            {promises.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 15,
                  marginBottom: 24,
                  color: "#fff",
                }}
              >
                <CheckCircle
                  size={18}
                  color={GOLD}
                  style={{ flexShrink: 0, marginTop: 2 }}
                />
                <span
                  style={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Floating badge */}
          <div
            className="floating-badge"
            style={{
              position: "absolute",
              bottom: -40,
              left: -20,
              background: GOLD,
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "0 8px 32px rgba(245,197,24,0.4)",
              lineHeight: 2,
            }}
          >
            <div
              style={{ fontSize: 24, fontWeight: 800, color: NAVY }}
            >
              Ages
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: NAVY,
                lineHeight: 1,
              }}
            >
              8–60
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .about-section { padding: 60px 40px !important; }
          .about-grid { gap: 40px !important; }
        }

        @media (max-width: 768px) {
          .about-section { padding: 60px 24px !important; }
          .about-grid { 
            grid-template-columns: 1fr !important; 
            gap: 60px !important; 
          }
          .about-title { 
            font-size: 32px !important; 
            text-align: center; 
          }
          .about-text-container { 
            text-align: center; 
          }
          .stats-row { 
            justify-content: center; 
            gap: 20px !important; 
          }
          .about-card { padding: 32px !important; }
          .about-card-wrapper { margin-bottom: 40px; }
          
          .floating-badge {
            left: 50% !important;
            transform: translateX(-50%);
            bottom: -30px !important;
            width: fit-content;
            white-space: nowrap;
          }
        }
      `}</style>
    </section>
  );
}