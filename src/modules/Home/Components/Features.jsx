import { Shield, Laptop, Heart, Award, Users, GraduationCap } from "lucide-react";
import { GOLD, NAVY, NAVY_LIGHT, NAVY_MID, OFF_WHITE, WHITE } from "../../../i18n/tokens";

const features = [
  {
    icon: Shield,
    title: "Sound, Qualified Tutors",
    desc: "All our tutors are thoroughly vetted — qualified Islamic scholars and Arabic language experts with proven teaching experience.",
  },
  {
    icon: Laptop,
    title: "100% Online Classes",
    desc: "Join from anywhere in the world. All you need is an internet connection. No commute, no disruption to your routine.",
  },
  {
    icon: Heart,
    title: "Flexible Scheduling",
    desc: "Classes are arranged around your availability. Morning, evening, weekends — we work with your schedule.",
  },
  {
    icon: Award,
    title: "Discounted & Affordable",
    desc: "Quality Islamic education shouldn't cost a fortune. We offer competitive rates with yearly payment discounts available.",
  },
  {
    icon: Users,
    title: "Private Tutor Available",
    desc: "Prefer one-on-one attention? Our private tutor option gives you dedicated, personalized sessions with your own teacher.",
  },
  {
    icon: GraduationCap,
    title: "Ages 8 to 60",
    desc: "It's never too early or too late to learn. Our programs are tailored for children, youth, adults, and seniors alike.",
  },
];

export default function Features() {
  return (
    <section id="features" style={{ background: OFF_WHITE, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(10,22,40,0.07)",
              color: NAVY_MID,
              padding: "6px 20px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Why Choose Us
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: NAVY,
              margin: "0 0 16px",
            }}
          >
            Everything You Need
            <br />
            <span style={{ color: "#D4A017" }}>In One Academy</span>
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "#718096",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            We've built Halimatu Sa'diyyah Islamic Academy around your needs —
            flexibility, quality, and accessibility.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                style={{
                  background: WHITE,
                  borderRadius: 20,
                  padding: 36,
                  border: "1px solid rgba(10,22,40,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 60px rgba(10,22,40,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${NAVY}, ${NAVY_LIGHT})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <Icon size={24} color={GOLD} />
                </div>
                <h3
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: NAVY,
                    marginBottom: 12,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "#718096",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}