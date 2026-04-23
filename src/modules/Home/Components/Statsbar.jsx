import { Clock, BookOpen, GraduationCap, Laptop } from "lucide-react";
import { GOLD, NAVY } from "../../../i18n/tokens";

const stats = [
  { icon: Clock, label: "Program Duration", value: "4 Years" },
  { icon: BookOpen, label: "Semester Length", value: "22 Weeks" },
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
        id="stats-grid" // Added the ID here so the media query works
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
              className="stats-item" // Added class for border control
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
        @media (max-width: 992px) {
          #stats-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
          }
          .stats-item {
            padding: 20px 16px !important;
          }
          /* Remove border from the 2nd and 4th items on mobile grid */
          .stats-item:nth-of-type(2n) {
            border-right: none !important;
          }
          /* Add a bottom border to the top row on mobile */
          .stats-item:nth-of-type(1), .stats-item:nth-of-type(2) {
            border-bottom: 1px solid rgba(245,197,24,0.15);
          }
        }
        
        @media (max-width: 480px) {
          #stats-grid { 
            grid-template-columns: 1fr !important; 
          }
          .stats-item {
            border-right: none !important;
            border-bottom: 1px solid rgba(245,197,24,0.15);
          }
          .stats-item:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  );
}