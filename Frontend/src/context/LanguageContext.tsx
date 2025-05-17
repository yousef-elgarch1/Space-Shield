import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../translations/i18n';

// Define the available languages
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }
];

// Create the context with default values
type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (code: string) => void;
  languages: { code: string; name: string }[];
};

const defaultContext: LanguageContextType = {
  currentLanguage: 'en',
  changeLanguage: () => {},
  languages: languages
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

// Create a provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
      // Optionally save to localStorage
      localStorage.setItem('i18nextLng', lng);
      // Update document language attribute
      document.documentElement.setAttribute('lang', lng);
      // Update direction for RTL languages if needed
      // document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const value = {
    currentLanguage,
    changeLanguage,
    languages
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Create a custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;