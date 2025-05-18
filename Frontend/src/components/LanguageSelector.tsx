// src/components/LanguageSelector.tsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <div className={`language-selector ${className}`}>
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value as any)}
        className="w-full bg-space-dark-blue bg-opacity-50 text-space-light-gray border border-space-satellite-blue border-opacity-20 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-space-satellite-blue"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-space-dark-blue">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;