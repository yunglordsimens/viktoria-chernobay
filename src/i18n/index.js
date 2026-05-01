import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pl from './locales/pl.json';
import en from './locales/en.json';
import ua from './locales/ua.json';

const savedLang = localStorage.getItem('lang') || 'pl';

i18n.use(initReactI18next).init({
  resources: {
    pl: { translation: pl },
    en: { translation: en },
    ua: { translation: ua },
  },
  lng: savedLang,
  fallbackLng: 'pl',
  interpolation: { escapeValue: false },
});

export default i18n;
