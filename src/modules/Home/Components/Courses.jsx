import { useState } from "react";
import { GOLD, GOLD_DARK, NAVY, WHITE, courses } from "../../../i18n/tokens";

export default function Courses() {
  const [active, setActive] = useState(0);

  return (
    <section id="courses" style={{ background: NAVY, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(245,197,24,0.12)",
              border: "1px solid rgba(245,197,24,0.25)",
              color: GOLD,
              padding: "6px 20px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Our Curriculum
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: WHITE,
              margin: "0 0 16px",
            }}
          >
            4-Year Program Overview
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.6)",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            A structured, progressive curriculum from foundational to advanced
            Islamic sciences.
          </p>
        </div>

        {/* Year Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 40,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {courses.map((c, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                padding: "12px 28px",
                borderRadius: 10,
                border: `2px solid ${
                  i === active ? GOLD : "rgba(255,255,255,0.15)"
                }`,
                background: i === active ? GOLD : "transparent",
                color:
                  i === active ? NAVY : "rgba(255,255,255,0.7)",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.25s ease",
                letterSpacing: 0.3,
              }}
            >
              {c.year}
            </button>
          ))}
        </div>

        {/* Active Course Panel */}
        {courses.map(
          (c, i) =>
            i === active && (
              <div
                key={i}
                style={{
                  background: `linear-gradient(135deg, ${c.color} 0%, rgba(255,255,255,0.03) 100%)`,
                  borderRadius: 20,
                  border: "1px solid rgba(245,197,24,0.2)",
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                }}
                className="course-panel"
              >
                {/* Left — Description */}
                <div style={{ padding: "48px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{c.icon}</div>
                  <div
                    style={{
                      display: "inline-block",
                      background: "rgba(245,197,24,0.15)",
                      color: GOLD,
                      padding: "4px 14px",
                      borderRadius: 100,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 16,
                    }}
                  >
                    {c.year} of 4
                  </div>
                  <h3
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      color: WHITE,
                      margin: "0 0 16px",
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.7,
                      marginBottom: 32,
                    }}
                  >
                    {c.desc}
                  </p>
                  <a
                    href="#enroll"
                    style={{
                      display: "inline-block",
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                      color: NAVY,
                      padding: "14px 32px",
                      borderRadius: 10,
                      fontWeight: 900,
                      fontSize: 15,
                      textDecoration: "none",
                    }}
                  >
                    Start {c.year} →
                  </a>
                </div>

                {/* Right — Topics */}
                <div
                  style={{
                    padding: "48px",
                    background: "rgba(0,0,0,0.2)",
                    borderLeft: "1px solid rgba(245,197,24,0.1)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: GOLD,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginBottom: 28,
                    }}
                  >
                    What You'll Study
                  </h4>
                  {c.topics.map((t, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "16px 0",
                        borderBottom:
                          j < c.topics.length - 1
                            ? "1px solid rgba(255,255,255,0.07)"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "rgba(245,197,24,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: 13,
                          color: GOLD,
                          fontWeight: 800,
                        }}
                      >
                        {j + 1}
                      </div>
                      <span
                        style={{
                          fontSize: 15,
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .course-panel { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}