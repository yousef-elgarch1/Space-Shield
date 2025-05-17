import React from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import '../translations/i18n'; // Import i18n initialization

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides the language context to the application
 */
const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
};

export default I18nProvider;