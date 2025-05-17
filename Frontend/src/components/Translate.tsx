import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslateProps {
  id: string;
  values?: Record<string, any>;
}

/**
 * A component that translates text using i18next
 */
const Translate: React.FC<TranslateProps> = ({ id, values }) => {
  const { t } = useTranslation();
  
  return <>{t(id, values)}</>;
};

export default Translate;