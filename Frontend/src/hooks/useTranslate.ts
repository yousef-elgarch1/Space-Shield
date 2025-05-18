import { useTranslation } from 'react-i18next';

/**
 * A custom hook that provides translation functionality
 * @returns Translation functions and current language
 */
export function useTranslate() {
  const { t, i18n } = useTranslation();
  
  /**
   * Translate text with namespace (optional)
   * @param key The translation key
   * @param options Optional parameters for translation
   * @returns Translated text
   */
  const translate = (key: string, options?: any) => {
    return t(key, options);
  };
  
  /**
   * Get the current language
   * @returns Current language code
   */
  const getCurrentLanguage = () => {
    return i18n.language;
  };
  
  /**
   * Change the current language
   * @param lang Language code to change to
   */
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  return {
    t: translate,
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
  };
}

export default useTranslate;