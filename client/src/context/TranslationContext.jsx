import React, { createContext, useState, useCallback } from 'react';
import { translations, languages } from '../i18n';

export const TranslationContext = createContext(null);

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = useCallback((key) => {
    return translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
  }, [lang]);

  const cycleLang = useCallback(() => {
    setLang((prev) => {
      const idx = languages.indexOf(prev);
      return languages[(idx + 1) % languages.length];
    });
  }, []);

  return (
    <TranslationContext.Provider value={{ lang, setLang, cycleLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
}
