import { Phone, CheckCircle } from "lucide-react";
import { GOLD, GOLD_DARK, NAVY, NAVY_LIGHT, OFF_WHITE, WHITE, courses } from "../../../i18n/tokens";

const contactNumbers = [
  { label: "Call / WhatsApp", value: "08145489933", href: "tel:08145489933" },
  { label: "Alternative Number", value: "07010921347", href: "tel:07010921347" },
];

const perks = [
  "Flexible payment plans",
  "Start any time of year",
  "Free initial consultation",
];

const tutorOptions = ["Group Class", "Private Tutor"];

export default function Enroll() {
  return (
    <section id="enroll" style={{ background: OFF_WHITE, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(10,22,40,0.07)",
              color: "#0F2147",
              padding: "6px 20px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Get Started
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: NAVY,
              margin: "0 0 16px",
            }}
          >
            Ready to Begin Your Journey?
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "#718096",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Contact us today. We'll help you find the right course and the right
            tutor for your needs.
          </p>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
          }}
          className="enroll-grid"
        >
          {/* Contact Card */}
          <div
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
              borderRadius: 24,
              padding: 48,
              color: WHITE,
            }}
          >
            <h3
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: GOLD,
                marginBottom: 8,
              }}
            >
              Get in Touch
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                marginBottom: 36,
                fontSize: 15,
              }}
            >
              Reach out via phone and we'll answer all your questions.
            </p>

            {contactNumbers.map((c) => (
              <a
                key={c.value}
                href={c.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 16,
                  textDecoration: "none",
                  background: "rgba(245,197,24,0.1)",
                  border: "1px solid rgba(245,197,24,0.2)",
                  padding: "16px 20px",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: GOLD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Phone size={20} color={NAVY} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 2,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: WHITE }}
                  >
                    {c.value}
                  </div>
                </div>
              </a>
            ))}

            {/* Perks */}
            <div
              style={{
                marginTop: 32,
                paddingTop: 32,
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {perks.map((p) => (
                <div
                  key={p}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 12,
                    alignItems: "center",
                  }}
                >
                  <CheckCircle size={16} color={GOLD} />
                  <span
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {p}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrol Form */}
          <div
            style={{
              background: WHITE,
              borderRadius: 24,
              padding: 48,
              border: "1px solid rgba(10,22,40,0.08)",
            }}
          >
            <h3
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: NAVY,
                marginBottom: 8,
              }}
            >
              Enrol Today
            </h3>
            <p
              style={{
                color: "#718096",
                marginBottom: 32,
                fontSize: 15,
              }}
            >
              Choose your year and tutor type and we'll get you started right
              away.
            </p>

            {/* Course Picker */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: NAVY,
                  marginBottom: 8,
                  letterSpacing: 0.5,
                }}
              >
                SELECT YEAR / COURSE
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {courses.map((c) => (
                  <div
                    key={c.year}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: "1.5px solid rgba(10,22,40,0.12)",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                      color: NAVY,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = GOLD_DARK;
                      e.currentTarget.style.background = "#FEF9E7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(10,22,40,0.12)";
                      e.currentTarget.style.background = WHITE;
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#718096" }}>
                      {c.year}
                    </div>
                    {c.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Tutor Picker */}
            <div style={{ marginBottom: 32 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: NAVY,
                  marginBottom: 8,
                  letterSpacing: 0.5,
                }}
              >
                TUTOR PREFERENCE
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {tutorOptions.map((opt) => (
                  <div
                    key={opt}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: "1.5px solid rgba(10,22,40,0.12)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: NAVY,
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = GOLD_DARK;
                      e.currentTarget.style.background = "#FEF9E7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(10,22,40,0.12)";
                      e.currentTarget.style.background = WHITE;
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="tel:08145489933"
              style={{
                display: "block",
                textAlign: "center",
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                color: NAVY,
                padding: "18px",
                borderRadius: 12,
                fontWeight: 900,
                fontSize: 17,
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(245,197,24,0.35)",
                letterSpacing: 0.3,
              }}
            >
              📞 Call to Enrol Now
            </a>
            <p
              style={{
                textAlign: "center",
                fontSize: 13,
                color: "#718096",
                marginTop: 12,
              }}
            >
              Or WhatsApp: 08145489933 · 07010921347
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .enroll-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}