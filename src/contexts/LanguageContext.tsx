import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import translations from '../i18n/translations';
import type { Lang, Translations } from '../i18n/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function getDefaultLang(): Lang {
  const languages = navigator.languages ?? [navigator.language];
  return languages.some((l) => l?.toLowerCase().startsWith('pt')) ? 'pt' : 'en';
}

function getSavedLang(): Lang {
  const saved = localStorage.getItem('lang');
  if (saved === 'en' || saved === 'pt') return saved;
  return getDefaultLang();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getSavedLang);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }, [lang]);

  function handleSetLang(l: Lang) {
    localStorage.setItem('lang', l);
    setLang(l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook e provider convivem no mesmo arquivo por design
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
