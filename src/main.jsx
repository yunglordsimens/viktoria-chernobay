import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@fontsource-variable/unbounded'
import '@fontsource-variable/onest'
import './index.css'
import i18n from './i18n/index.js'

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Statyczny HTML jest po polsku: przy PL tylko go „ożywiamy”, przy innym języku renderujemy od nowa.
if (root.hasChildNodes() && i18n.language === 'pl') ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)
