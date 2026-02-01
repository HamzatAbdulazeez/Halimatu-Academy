// src/components/GoogleTranslate.jsx
import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    if (window.googleTranslateElementInit) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ar",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // RTL / LTR handler
    const observer = new MutationObserver(() => {
      const html = document.documentElement;
      html.dir = html.lang === "ar" ? "rtl" : "ltr";
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }}
    />
  );
}
