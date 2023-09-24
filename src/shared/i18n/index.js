import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import { createEvent, createStore } from 'effector';

const fallbackLng = 'en';
const lng = localStorage.getItem('lang') || fallbackLng;

const localeChanged = createEvent();
export const $locale = createStore(lng).on(localeChanged, (_, v) => v);

export const i18NextInit = () => {
  i18next.on('languageChanged', (lang) => {
    localStorage.setItem('lang', lang);
    localeChanged(lang);
  });
  return i18next.use(initReactI18next).init({
    resources: {
      en: {
        translation: en
      },
      fr: {
        translation: fr
      },
      es: {
        translation: es
      }
    },
    lng,
    fallbackLng,

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });
};
