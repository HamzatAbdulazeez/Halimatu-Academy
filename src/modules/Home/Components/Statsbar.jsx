import { Clock, BookOpen, GraduationCap, Laptop } from "lucide-react";
import { GOLD, NAVY } from "../../../i18n/tokens";

const stats = [
  { icon: Clock, label: "Program Duration", value: "4 Years" },
  { icon: BookOpen, label: "Semester Length", value: "12 Weeks" },
  { icon: Laptop, label: "Mode", value: "Online Only" },
  { icon: GraduationCap, label: "Weekly Hours", value: "15 Hrs/Week" },
];

export default function StatsBar() {
  return (
    <section
      style={{
        background: NAVY,
        borderBottom: "1px solid rgba(245,197,24,0.2)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              style={{
                padding: "28px 24px",
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(245,197,24,0.15)"
                    : "none",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(245,197,24,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={22} color={GOLD} />
              </div>
              <div>
                <div
                  style={{
                    color: GOLD,
                    fontWeight: 800,
                    fontSize: 20,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}