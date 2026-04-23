import { Phone } from "lucide-react";
import { GOLD, GOLD_DARK, NAVY, WHITE, courses } from "../../i18n/tokens";
import { Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, Heart } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
  return (
    <footer
      style={{
        background: "#060E1A",
        borderTop: "1px solid rgba(245,197,24,0.15)",
        padding: "60px 24px 32px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 60,
            marginBottom: 56,
            paddingBottom: 56,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
          <a href="#home" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
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
              <div style={{ color: GOLD, fontWeight: 500, fontSize: 13, letterSpacing: 1, lineHeight: 2 }}>
                HALIMATU SA'DIYYAH
              </div>
              <div style={{ color: "#fff", fontSize: 10, letterSpacing: 0.5 }}>
                ISLAMIC ACADEMY
              </div>
            </div>
          </a>
            <p
              style={{
                color: "#fff",
                fontSize: 14,
                lineHeight: 1.8,
                maxWidth: 320,
                marginTop: 16,
              }}
            >
              Bringing authentic Islamic education to every home. Online Arabic
              & Islamic classes for ages 8–60, with qualified tutors and
              flexible scheduling.
            </p>
            <div className="flex gap-6">
                  {[
                    { icon: Facebook, href: "#", color: "hover:bg-blue-600", name: "Facebook" },
                    { icon: Twitter, href: "#", color: "hover:bg-sky-500", name: "Twitter" },
                    { icon: Instagram, href: "https://www.instagram.com/halimatusadiyyah_academy1?igsh=MWhiM3o3aTFzeWY4NA==", color: "hover:bg-pink-600", name: "Instagram" },
                    { icon: Linkedin, href: "#", color: "hover:bg-blue-700", name: "LinkedIn" }
                  ].map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.name}
                        className={`p-3 bg-white mt-7 backdrop-blur-md rounded-full ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
          </div>

          {/* Courses Links */}
          <div>
            <h4
              style={{
                color: WHITE,
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: 1,
                marginBottom: 20,
                textTransform: "uppercase",
              }}
            >
              Courses
            </h4>
            {courses.map((c) => (
              <a
                key={c.year}
                href="#courses"
                style={{
                  display: "block",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 14,
                  marginBottom: 12,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.target.style.color = "#fff")
                }
              >
                {c.year}: {c.title}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                color: WHITE,
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: 1,
                marginBottom: 20,
                textTransform: "uppercase",
              }}
            >
              Contact
            </h4>
            <div
              style={{
                color: "#fff",
                fontSize: 14,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Phone size={14} />
              08145489933
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: 14,
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Phone size={14} />
              07010921347
            </div>
            <a
              href="tel:08145489933"
              style={{
                display: "inline-block",
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                color: NAVY,
                padding: "12px 24px",
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              Enrol Now
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: 13,
              margin: 0,
            }}
          >
            © {currentYear} Halimatu Sa'diyyah Islamic Academy. All rights reserved.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: 12,
              margin: 0,
            }}
          >
            Knowledge is Light · Online Arabic & Islamic Education
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </footer>
  );
}