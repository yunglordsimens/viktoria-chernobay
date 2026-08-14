import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18n from './i18n/index.js';
import {
  Instagram,
  Mail,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Star,
  ChevronDown,
  ChevronUp,
  Camera,
  Building,
  Image as ImageIcon,
} from 'lucide-react';
import { portfolioItems, categories } from './data/portfolio';
import { testimonials } from './data/testimonials';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

/* ─── Language Switcher ─────────────────────────────────────── */
function LanguageSwitcher() {
  const { i18n: i18nInstance } = useTranslation();
  const current = i18nInstance.language;

  const toggle = (lang) => {
    i18nInstance.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div className="flex items-center gap-1 text-[11px] tracking-widest uppercase select-none">
      {['pl', 'en', 'ua'].map((lang, i, arr) => (
        <React.Fragment key={lang}>
          <button
            onClick={() => toggle(lang)}
            className={`px-1 transition-colors ${current === lang ? 'text-white font-bold' : 'text-neutral-600 hover:text-neutral-300'}`}
          >
            {lang.toUpperCase()}
          </button>
          {i < arr.length - 1 && <span className="text-neutral-700">|</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── SmartImage ────────────────────────────────────────────────
   Pokazuje neutralny placeholder, dopóki plik nie istnieje.
   Dzięki temu brak zdjęcia nie psuje layoutu.               */
function SmartImage({ src, alt, className, fit = 'cover' }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center bg-neutral-900`}>
        <ImageIcon className="text-neutral-800 w-12 h-12" strokeWidth={1} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`${className} ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
    />
  );
}

/* ─── App ───────────────────────────────────────────────────── */
export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const portfolioTabs = categories.map((c) => ({ id: c.id, label: t(c.labelKey) }));

  // Sekcja "Opinie" i jej link w menu pojawiają się dopiero, gdy są prawdziwe opinie.
  const hasTestimonials = testimonials.length > 0;

  const openLightbox = (item) => {
    setLightboxData(item);
    setPhotoIndex(0);
  };

  const closeLightbox = useCallback(() => setLightboxData(null), []);

  const step = useCallback((delta) => {
    setPhotoIndex((prev) => {
      const total = lightboxData?.images.length ?? 0;
      if (!total) return 0;
      return (prev + delta + total) % total;
    });
  }, [lightboxData]);

  // Nawigacja klawiaturą w lightboxie
  useEffect(() => {
    if (!lightboxData) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxData, closeLightbox, step]);

  const packages = [
    { id: 'minimal', price: '300', features: ['pricing.minimal_f1', 'pricing.minimal_f2'] },
    { id: 'optimal', price: '400', popular: true, features: ['pricing.optimal_f1', 'pricing.optimal_f2', 'pricing.optimal_f3'] },
    { id: 'maximum', price: '500', features: ['pricing.maximum_f1', 'pricing.maximum_f2'] },
    { id: 'premium', price: null, features: ['pricing.premium_f1', 'pricing.premium_f2', 'pricing.premium_f3'] },
  ];

  // Warunki współpracy — pełna lista z oferty
  const terms = Array.from({ length: 10 }, (_, i) => t(`faq.t${i + 1}`));

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
  ];

  const filteredPortfolio = portfolioItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-white selection:text-black scroll-smooth">

      {/* ── Navbar ── */}
      <nav className="fixed w-full top-0 z-50 bg-neutral-950/70 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="text-sm tracking-[0.2em] text-white uppercase flex flex-col z-50">
            <span className="font-bold">Photographer</span>
            <span className="text-[10px] text-neutral-500">Name</span>
          </a>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8 text-[11px] tracking-widest uppercase">
            <a href="#portfolio" className="hover:text-white transition-colors">{t('nav.portfolio')}</a>
            <a href="#o-mnie" className="hover:text-white transition-colors">{t('nav.about')}</a>
            <a href="#oferta" className="hover:text-white transition-colors">{t('nav.offer')}</a>
            {hasTestimonials && <a href="#opinie" className="hover:text-white transition-colors">{t('nav.reviews')}</a>}
            <a href="#kontakt" className="hover:text-white transition-colors">{t('nav.contact')}</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <a href="#kontakt" className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-white hover:text-neutral-400 transition-colors">
              {t('nav.reserve')} <ChevronRight size={14} />
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden z-50 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile fullscreen menu */}
        <div className={`fixed inset-0 bg-neutral-950/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <a href="#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-xl tracking-[0.2em] uppercase text-white hover:text-neutral-400">{t('nav.portfolio')}</a>
          <a href="#o-mnie" onClick={() => setIsMobileMenuOpen(false)} className="text-xl tracking-[0.2em] uppercase text-white hover:text-neutral-400">{t('nav.about')}</a>
          <a href="#oferta" onClick={() => setIsMobileMenuOpen(false)} className="text-xl tracking-[0.2em] uppercase text-white hover:text-neutral-400">{t('nav.offer')}</a>
          {hasTestimonials && <a href="#opinie" onClick={() => setIsMobileMenuOpen(false)} className="text-xl tracking-[0.2em] uppercase text-white hover:text-neutral-400">{t('nav.reviews')}</a>}
          <a href="#kontakt" onClick={() => setIsMobileMenuOpen(false)} className="text-xl tracking-[0.2em] uppercase text-white hover:text-neutral-400">{t('nav.contact')}</a>
          <LanguageSwitcher />
          <a href="#kontakt" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 px-8 py-3 border border-white text-white tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-colors">
            {t('nav.reserveBtn')}
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="h-[90vh] min-h-[600px] relative flex items-center justify-center text-center px-4 pt-20">
        <div className="absolute inset-0 bg-neutral-900 overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem] mx-2 md:mx-6">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/70 to-neutral-950 z-10" />
        </div>

        <div className="relative z-20 space-y-8 max-w-4xl mx-auto animate-fade-in-up">
          <div className="text-neutral-400 tracking-[0.4em] text-[10px] md:text-xs uppercase flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-neutral-600"></span>
            {t('hero.tagline')}
            <span className="w-8 h-[1px] bg-neutral-600"></span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tighter leading-[1.1] whitespace-pre-line">
            {t('hero.title')}
          </h1>
          <p className="text-sm md:text-base text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <a href="#portfolio" className="bg-white text-black px-8 py-4 rounded-full text-xs tracking-widest uppercase font-bold hover:bg-neutral-200 hover:scale-105 transition-all">
              {t('hero.cta_portfolio')}
            </a>
            <a href="#oferta" className="border border-white/20 text-white px-8 py-4 rounded-full text-xs tracking-widest uppercase hover:bg-white/5 hover:border-white/40 transition-all">
              {t('hero.cta_offer')}
            </a>
          </div>
        </div>
      </section>

      {/* ── O mnie ── */}
      <motion.section id="o-mnie" {...fadeInUp} className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[3/4] md:aspect-square bg-neutral-900 rounded-2xl overflow-hidden group">
            <SmartImage
              src="/images/about/viktoria-chernobay.webp"
              alt="Viktoria Chernobay"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="space-y-8">
            <div className="text-[10px] tracking-widest text-neutral-500 uppercase">{t('about.label')}</div>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-tight whitespace-pre-line">
              {t('about.title')}
            </h2>
            <div className="space-y-4 text-sm text-neutral-400 font-light leading-relaxed">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl text-white font-light mb-2">{t('about.stat1_value')}</div>
                <div className="text-[10px] tracking-widest text-neutral-500 uppercase">{t('about.stat1_label')}</div>
              </div>
              <div>
                <div className="text-3xl text-white font-light mb-2">{t('about.stat2_value')}</div>
                <div className="text-[10px] tracking-widest text-neutral-500 uppercase">{t('about.stat2_label')}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Portfolio ── */}
      <motion.section id="portfolio" {...fadeInUp} className="py-24 md:py-32 overflow-hidden bg-neutral-900/30">
        <div className="px-6 md:px-12 max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">{t('portfolio.title')}</h2>
            <p className="text-sm text-neutral-500 font-light max-w-sm">{t('portfolio.subtitle')}</p>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] tracking-[0.2em] uppercase">
            {portfolioTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 transition-all duration-300 ${activeTab === tab.id ? 'text-white border-b border-white' : 'text-neutral-600 hover:text-neutral-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-6 md:px-12 max-w-7xl mx-auto">
          {filteredPortfolio.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => openLightbox(item)}
              className={`relative group overflow-hidden rounded-xl bg-neutral-900 cursor-pointer ${item.aspect}`}
            >
              <SmartImage
                src={item.src}
                alt={item.title}
                className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700"
              />

              {/* Licznik zdjęć w galerii */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white/90 text-[10px] tracking-widest px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <ImageIcon size={11} strokeWidth={1.5} /> {item.images.length}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-neutral-400 text-[10px] tracking-widest uppercase mb-2">
                    <Building size={12} /> {item.type}
                  </div>
                  <h3 className="text-white text-xl font-light mb-1">{item.title}</h3>
                  <p className="text-neutral-400 text-xs">
                    {[item.size, item.location, item.year].filter(Boolean).join(' • ')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Lightbox ── */}
      {lightboxData && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-12 animate-fade-in">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10">
            <X size={32} />
          </button>

          <div className="max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full max-h-[70vh] aspect-[4/3] bg-neutral-900 flex items-center justify-center rounded-lg overflow-hidden">
              <SmartImage
                key={photoIndex}
                src={lightboxData.images[photoIndex]}
                alt={`${lightboxData.title} — ${photoIndex + 1}`}
                fit="contain"
                className="w-full h-full animate-fade-in"
              />

              {lightboxData.images.length > 1 && (
                <>
                  <button
                    onClick={() => step(-1)}
                    aria-label="Poprzednie zdjęcie"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/70 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={() => step(1)}
                    aria-label="Następne zdjęcie"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/70 flex items-center justify-center transition-all"
                  >
                    <ChevronRight size={22} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white/80 text-[11px] tracking-widest px-3 py-1 rounded-full">
                    {photoIndex + 1} / {lightboxData.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Miniatury */}
            {lightboxData.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-1">
                {lightboxData.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setPhotoIndex(i)}
                    className={`shrink-0 w-16 h-12 rounded overflow-hidden border transition-all ${i === photoIndex ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-75'}`}
                  >
                    <SmartImage src={img} alt="" className="w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <h3 className="text-2xl font-light text-white mb-2">{lightboxData.title}</h3>
              <div className="flex gap-4 justify-center text-sm text-neutral-400">
                {[lightboxData.type, lightboxData.size, lightboxData.location, lightboxData.year]
                  .filter(Boolean)
                  .map((val, i, arr) => (
                    <React.Fragment key={val}>
                      <span>{val}</span>
                      {i < arr.length - 1 && <span>•</span>}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Oferta ── */}
      <motion.section id="oferta" {...fadeInUp} className="py-24 px-6 md:px-12 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">{t('pricing.title')}</h2>
            <p className="text-sm text-neutral-500 font-light">{t('pricing.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-8 rounded-2xl transition-colors flex flex-col relative group ${
                  pkg.popular
                    ? 'bg-neutral-900 border border-neutral-700 hover:border-neutral-500 shadow-2xl lg:-translate-y-4'
                    : 'bg-neutral-950 border border-white/5 hover:border-white/20'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold whitespace-nowrap">
                    {t('pricing.popular')}
                  </div>
                )}

                <div className={`text-[10px] tracking-widest uppercase mb-4 ${pkg.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {t(`pricing.${pkg.id}_label`)}
                </div>
                <h3 className="text-2xl text-white font-light mb-2">{t(`pricing.${pkg.id}_name`)}</h3>

                <div className="text-4xl font-light text-white mb-8 group-hover:scale-105 transition-transform origin-left">
                  {pkg.price ? (
                    <>{pkg.price} <span className="text-lg text-neutral-600">PLN</span></>
                  ) : (
                    <span className="text-2xl text-neutral-300">{t('pricing.custom_quote')}</span>
                  )}
                </div>

                <ul className="space-y-4 text-sm font-light flex-1">
                  {pkg.features.map((key) => (
                    <li key={key} className={`flex gap-3 ${pkg.popular ? 'text-white' : ''}`}>
                      <CheckCircle2 size={18} className={`shrink-0 ${pkg.popular ? 'text-white' : 'text-neutral-600'}`} />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-[10px] tracking-widest uppercase text-neutral-600 mb-6">
            {t('pricing.netto')}
          </p>

          {/* Designer Day */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mt-6 overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex-1 relative z-10">
              <div className="inline-block border border-white/20 text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-6">
                {t('pricing.designer_badge')}
              </div>
              <h3 className="text-3xl md:text-4xl font-light text-white mb-4">{t('pricing.designer_name')}</h3>
              <ul className="text-neutral-400 font-light text-sm max-w-md space-y-3">
                {['designer_f1', 'designer_f2', 'designer_f3'].map((k) => (
                  <li key={k} className="flex gap-3">
                    <CheckCircle2 size={18} className="text-neutral-600 shrink-0 mt-0.5" />
                    {t(`pricing.${k}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-left md:text-right shrink-0 w-full md:w-auto relative z-10">
              <div className="text-5xl font-light text-white mb-2">500 <span className="text-xl">PLN*</span></div>
              <p className="text-[10px] tracking-widest text-neutral-500 uppercase">{t('pricing.designer_note')}</p>
              <a href="#kontakt" className="inline-block mt-6 w-full md:w-auto bg-white text-black px-8 py-3 text-xs tracking-widest uppercase rounded-full font-bold hover:bg-neutral-200 transition-colors text-center">
                {t('pricing.designer_cta')}
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Opinie — renderuje się tylko, gdy są prawdziwe opinie ── */}
      {hasTestimonials && (
      <motion.section id="opinie" {...fadeInUp} className="py-24 px-6 md:px-12 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">{t('reviews.title')}</h2>
            <p className="text-sm text-neutral-500 font-light">{t('reviews.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-neutral-900 border border-white/5 p-8 rounded-2xl flex flex-col relative">
                <div className="flex gap-1 mb-6 text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm text-neutral-300 font-light leading-relaxed mb-8 flex-1 italic">"{testimonial.text}"</p>
                <div className="border-t border-white/5 pt-6 mt-auto">
                  <div className="text-white text-sm font-medium">{testimonial.name}</div>
                  <div className="text-neutral-500 text-[10px] tracking-wider uppercase mt-1">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
      )}

      {/* ── FAQ ── */}
      <motion.section {...fadeInUp} className="py-24 px-6 md:px-12 border-t border-white/5 bg-neutral-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm tracking-[0.2em] uppercase text-white mb-12 text-center">{t('faq.title')}</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 bg-neutral-950 rounded-xl overflow-hidden transition-all duration-300">
                <button
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-white text-sm font-light">{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={18} className="text-neutral-500" /> : <ChevronDown size={18} className="text-neutral-500" />}
                </button>
                <div className={`px-6 text-sm text-neutral-400 font-light overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>

          {/* Warunki współpracy */}
          <div className="border border-white/10 bg-neutral-950 rounded-xl p-6 md:p-8 mt-8">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white mb-6">{t('faq.terms_title')}</p>
            <ul className="space-y-4 text-sm text-neutral-400 font-light">
              {terms.map((term, i) => (
                <li key={i} className="flex gap-3 leading-relaxed">
                  <span className="text-neutral-700 shrink-0 select-none">—</span>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* ── Kontakt ── */}
      <motion.section id="kontakt" {...fadeInUp} className="pt-24 pb-12 px-6 md:px-12 bg-neutral-900 rounded-t-[3rem] md:rounded-t-[6rem] mx-2 md:mx-6 mb-2">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <div className="space-y-8">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-8">
                <Camera size={24} className="text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight">
                {t('contact.title')}
              </h2>
              <p className="text-neutral-400 font-light max-w-sm">{t('contact.subtitle')}</p>

              <div className="space-y-4 pt-8 border-t border-white/10 text-sm tracking-wider font-light">
                <a href="mailto:hello@fotograf.pl" className="flex items-center gap-4 text-neutral-400 hover:text-white transition-colors">
                  <Mail size={18} className="text-neutral-600" />hello@fotograf.pl
                </a>
                <a href="#" className="flex items-center gap-4 text-neutral-400 hover:text-white transition-colors">
                  <Instagram size={18} className="text-neutral-600" />@twoj_instagram
                </a>
              </div>
            </div>

            <div className="bg-neutral-950 p-8 rounded-3xl border border-white/5">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2">{t('contact.field_name')}</label>
                  <input type="text" placeholder={t('contact.field_name_ph')} className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2">{t('contact.field_email')}</label>
                    <input type="email" placeholder={t('contact.field_email_ph')} className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2">{t('contact.field_phone')}</label>
                    <input type="tel" placeholder={t('contact.field_phone_ph')} className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-2">{t('contact.field_message')}</label>
                  <textarea rows="4" placeholder={t('contact.field_message_ph')} className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors resize-none" required></textarea>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="rodo" className="mt-1" required />
                  <label htmlFor="rodo" className="text-xs text-neutral-500 font-light leading-snug">{t('contact.rodo')}</label>
                </div>

                <button type="submit" className="w-full bg-white text-black py-4 rounded-xl text-xs tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                  {t('contact.submit')} <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-widest uppercase text-neutral-600">
            <p>{t('footer.rights')}</p>
            <p>{t('footer.tagline')}</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
