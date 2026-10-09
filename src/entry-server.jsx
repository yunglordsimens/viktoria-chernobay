import React from 'react';
import { renderToString } from 'react-dom/server';
import i18n from './i18n/index.js';
import App from './App.jsx';

// Statyczny HTML strony (po polsku) — dla Google, Binga i botów AI, które nie uruchamiają JS.
export async function render() {
  await i18n.changeLanguage('pl');
  return renderToString(<App />);
}
