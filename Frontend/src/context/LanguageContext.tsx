// src/context/LanguageContext.tsx
// This updates our context to ensure it properly triggers re-renders

import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../translations/translations';

// Define the available languages
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }
];

type LanguageCode = keyof typeof translations;

// Create the context with default values
type LanguageContextType = {
  currentLanguage: LanguageCode;
  changeLanguage: (code: LanguageCode) => void;
  languages: { code: string; name: string }[];
  t: (key: string) => string;
};

const defaultContext: LanguageContextType = {
  currentLanguage: 'en',
  changeLanguage: () => {},
  languages: languages,
  t: () => ''
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

// Create a provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get language from localStorage, fallback to browser language or default to 'en'
  const getBrowserLanguage = (): LanguageCode => {
    const browserLang = navigator.language.split('-')[0];
    return (translations[browserLang as LanguageCode] ? browserLang : 'en') as LanguageCode;
  };

  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
    () => (localStorage.getItem('appLanguage') as LanguageCode) || getBrowserLanguage()
  );

  // Create a version "key" to force component re-renders when language changes
  const [version, setVersion] = useState(0);

  const changeLanguage = (code: LanguageCode) => {
    setCurrentLanguage(code);
    // Increment version to force context consumers to re-render
    setVersion(prev => prev + 1);
    localStorage.setItem('appLanguage', code);
    // Update document language attribute
    document.documentElement.setAttribute('lang', code);
  };

  // Function to get translations
  const t = (key: string): string => {
    // Split the key by dots (e.g., 'common.save' => ['common', 'save'])
    const keys = key.split('.');
    
    // Get the translation for the current language
    const translationsForLanguage = translations[currentLanguage];
    
    // Navigate through the translation object
    let result: any = translationsForLanguage;
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // If translation not found, return the key
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return result;
  };

  // Set initial document language
  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLanguage);
  }, []);

  const value = {
    currentLanguage,
    changeLanguage,
    languages,
    t
  };

  // key={version} forces children to re-render when language changes
  return (
    <LanguageContext.Provider value={value}>
      <div key={version} className="language-provider">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

// Create a custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;