import 'react-i18next';
import translationEN from './translations/locales/en/translation.json';

// React i18next module augmentation
declare module 'react-i18next' {
  interface CustomTypeOptions {
    // Custom resources type
    resources: {
      translation: typeof translationEN;
    };
    // Other custom types
    defaultNS: 'translation';
    allowObjectInHTMLChildren: true;
  }
}