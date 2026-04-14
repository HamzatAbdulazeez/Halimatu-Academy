import { createContext, useContext, useEffect, useState } from "react";
import translations from "../i18n/translations";
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const current = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = current.dir;
  }, [language, current.dir]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: current,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
