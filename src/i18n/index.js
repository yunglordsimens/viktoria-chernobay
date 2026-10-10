import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pl from './locales/pl.json';
import en from './locales/en.json';
import ua from './locales/ua.json';

const SUPPORTED = ['pl', 'en', 'ua'];

// Język z ustawień systemu/przeglądarki:
// polski → PL; ukraiński, rosyjski, białoruski → UA; wszystko inne → EN.
// Roboty wyszukiwarek zawsze dostają PL (to wersja zindeksowana i prerenderowana).
function detectLang() {
  if (typeof window === 'undefined') return 'pl';
  try {
    const saved = localStorage.getItem('lang');
    if (SUPPORTED.includes(saved)) return saved;
  } catch { /* prywatne okno */ }
  const ua = navigator.userAgent || '';
  if (/bot|crawl|spider|slurp|lighthouse|prerender/i.test(ua)) return 'pl';
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
  for (const l of langs) {
    const code = String(l).toLowerCase().split('-')[0];
    if (code === 'pl') return 'pl';
    if (code === 'uk' || code === 'ru' || code === 'be') return 'ua';
    if (code === 'en') return 'en';
  }
  return 'en';
}

const savedLang = detectLang();

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
