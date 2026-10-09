import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Instagram, Mail, Phone, ChevronRight, ChevronLeft, Menu, X, Plus, Minus, Image as ImageIcon } from 'lucide-react';
import { portfolioItems, categories } from './data/portfolio';
import { testimonials } from './data/testimonials';
import { site, packages, designerDayPrice, services, processSteps } from './data/site';

/* ─── Wordmark ─────────────────────────────────────────────── */
function Wordmark({ className = '' }) {
  return (
    <span className={`font-display leading-none ${className}`}>
      <span className="font-medium tracking-[-0.02em]">{site.brand}</span>
      <span className="font-light opacity-60"> {site.brandSuffix}</span>
    </span>
  );
}

/* ─── Language Switcher ─────────────────────────────────────── */
function LanguageSwitcher({ tone = 'light' }) {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const set = (lang) => {
    i18n.changeLanguage(lang);
    try { localStorage.setItem('lang', lang); } catch { /* prywatne okno */ }
  };
  const idle = tone === 'light' ? 'text-plaster/50 hover:text-plaster' : 'text-mist hover:text-ink';
  const active = tone === 'light' ? 'text-plaster' : 'text-ink';
  return (
    <div className="flex items-center gap-3 text-[12px] font-medium select-none">
      {['pl', 'en', 'ua'].map((lang) => (
        <button
          key={lang}
          onClick={() => set(lang)}
          aria-pressed={current === lang}
          className={`transition-colors ${current === lang ? `${active} underline underline-offset-4 decoration-brass` : idle}`}
        >
          {lang === 'ua' ? 'UA' : lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ─── SmartImage ────────────────────────────────────────────── */
function SmartImage({ src, alt, className = '', fit = 'cover', eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed || !src) {
    return (
      <div className={`${className} flex items-center justify-center bg-stone/40`}>
        <ImageIcon className="text-mist w-10 h-10" strokeWidth={1} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`${className} ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
    />
  );
}

/* ─── Viewfinder ───────────────────────────────────────────────
   Ramka wizjera i siatka trójpodziału — język fotografa architektury.
   Rysuje się raz przy wejściu na stronę.                        */
function Viewfinder() {
  const corner = 'absolute w-8 h-8 md:w-12 md:h-12 border-plaster/80';
  return (
    <div className="absolute inset-x-4 bottom-4 top-20 md:inset-x-8 md:bottom-8 md:top-28 pointer-events-none z-20" aria-hidden="true">
      <span className={`${corner} top-0 left-0 border-t border-l`} />
      <span className={`${corner} top-0 right-0 border-t border-r`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
      {[1, 2].map((i) => (
        <span
          key={`v${i}`}
          className="absolute top-0 bottom-0 w-px bg-plaster/15 origin-top animate-draw-y"
          style={{ left: `${(i * 100) / 3}%`, animationDelay: `${0.2 + i * 0.12}s` }}
        />
      ))}
      {[1, 2].map((i) => (
        <span
          key={`h${i}`}
          className="absolute left-0 right-0 h-px bg-plaster/15 origin-left animate-draw-x"
          style={{ top: `${(i * 100) / 3}%`, animationDelay: `${0.45 + i * 0.12}s` }}
        />
      ))}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5">
        <span className="absolute left-1/2 top-0 bottom-0 w-px bg-plaster/60" />
        <span className="absolute top-1/2 left-0 right-0 h-px bg-plaster/60" />
      </span>
    </div>
  );
}

function SectionHead({ id, title, subtitle, tone = 'dark', children }) {
  const titleColor = tone === 'dark' ? 'text-ink' : 'text-plaster';
  const subColor = tone === 'dark' ? 'text-graphite/80' : 'text-plaster/60';
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
      <div>
        <h2 id={id} className={`font-display font-light text-display ${titleColor}`}>{title}</h2>
        {subtitle && <p className={`mt-4 max-w-prose text-[15px] leading-relaxed ${subColor}`}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const pln = (n) => new Intl.NumberFormat('pl-PL').format(n);

/* ─── App ───────────────────────────────────────────────────── */
export default function App() {
  const { t, i18n } = useTranslation();
  const visibleProjects = portfolioItems.filter((p) => p.images.length > 0);
  const tabs = categories.filter((c) => visibleProjects.some((p) => p.category === c.id));
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(1);
  const [sent, setSent] = useState(false);

  const hasTestimonials = testimonials.length > 0;
  const designerPhoto = portfolioItems.find((p) => p.id === 'klobucka')?.images[11] ?? visibleProjects[0]?.src;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language === 'ua' ? 'uk' : i18n.language;
    document.title = t('meta.title');
  }, [i18n.language, t]);

  useEffect(() => {
    document.body.style.overflow = lightbox || menuOpen ? 'hidden' : '';
  }, [lightbox, menuOpen]);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const step = useCallback((d) => {
    setPhotoIndex((prev) => {
      const total = lightbox?.images.length ?? 0;
      return total ? (prev + d + total) % total : 0;
    });
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox, step]);

  // Formularz bez backendu: składa gotowy e-mail w programie pocztowym klienta.
  const onSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `${t('contact.field_name')}: ${f.get('name')}`,
      `${t('contact.field_email')}: ${f.get('email')}`,
      f.get('phone') ? `${t('contact.field_phone')}: ${f.get('phone')}` : null,
      '',
      f.get('message'),
    ].filter((l) => l !== null).join('\n');
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(t('contact.mail_subject'))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const nav = [
    { href: '#uslugi', label: t('nav.services') },
    { href: '#realizacje', label: t('nav.portfolio') },
    { href: '#cennik', label: t('nav.offer') },
    { href: '#studio', label: t('nav.studio') },
    { href: '#kontakt', label: t('nav.contact') },
  ];

  const onDark = !scrolled && !menuOpen;
  const filtered = visibleProjects.filter((p) => p.category === activeTab);

  return (
    <div className="min-h-screen">
      {/* ── Nav ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          onDark ? 'bg-transparent text-plaster' : 'bg-plaster/90 backdrop-blur-md text-ink border-b border-stone/70'
        }`}
      >
        <div className="max-w-site mx-auto h-16 md:h-20 flex items-center justify-between gap-6">
          <a href="#" className="text-[15px] md:text-base" aria-label={`${site.brand} ${site.brandSuffix}`}>
            <Wordmark />
          </a>
          <nav className="hidden lg:flex items-center gap-8 text-[13px]">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="opacity-80 hover:opacity-100 transition-opacity">{n.label}</a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-8">
            <LanguageSwitcher tone={onDark ? 'light' : 'dark'} />
            <a href="#kontakt" className={onDark ? 'btn-light !py-2.5' : 'btn-dark !py-2.5'}>{t('nav.reserve')}</a>
          </div>
          <button
            className="lg:hidden flex items-center gap-2 text-[13px]"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
            {menuOpen ? t('nav.close') : t('nav.menu')}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-plaster pt-24 px-[4vw] flex flex-col animate-fade-in lg:hidden">
          <nav className="flex flex-col">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="font-display font-light text-3xl text-ink py-4 border-b border-stone"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto pb-10 flex items-center justify-between">
            <LanguageSwitcher tone="dark" />
            <a href="#kontakt" onClick={() => setMenuOpen(false)} className="btn-dark">{t('nav.reserve')}</a>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative h-[100svh] min-h-[620px] bg-ink overflow-hidden">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          fetchpriority="high"
          className="absolute inset-0 w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/30" />
        <Viewfinder />

        <div className="relative z-30 h-full max-w-site mx-auto flex flex-col justify-end pb-16 md:pb-24">
          <h1
            className="font-display font-light text-hero text-plaster max-w-[14ch] animate-rise"
            style={{ animationDelay: '.5s' }}
          >
            {t('hero.title')}
          </h1>
          <div
            className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-rise"
            style={{ animationDelay: '.75s' }}
          >
            <p className="text-plaster/75 text-[15px] md:text-base leading-relaxed max-w-[46ch]">{t('hero.subtitle')}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#realizacje" className="btn-light">{t('hero.cta_portfolio')}</a>
              <a href="#cennik" className="btn-ghost-light">{t('hero.cta_offer')}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="bg-plaster py-20 md:py-32">
        <div className="max-w-site mx-auto grid lg:grid-cols-12 gap-12">
          <p className="lg:col-span-9 font-display font-light text-lead text-ink">{t('intro.statement')}</p>
          <dl className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-stone border-y border-stone mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-plaster py-6 sm:pr-6">
                <dt className="font-display font-light text-3xl md:text-4xl text-ink">{t(`intro.fact${i}_value`)}</dt>
                <dd className="mt-2 text-[14px] text-graphite/80">{t(`intro.fact${i}_label`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Usługi ── */}
      <section id="uslugi" aria-labelledby="uslugi-h" className="bg-paper py-20 md:py-28">
        <div className="max-w-site mx-auto">
          <SectionHead id="uslugi-h" title={t('services.title')} subtitle={t('services.subtitle')} />
          <ul className="border-t border-ink/80">
            {services.map((s) => (
              <li key={s} className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-2 py-7 md:py-9 border-b border-stone">
                <h3 className="md:col-span-4 font-display font-normal text-xl md:text-2xl text-ink tracking-[-0.01em]">
                  {t(`services.${s}_name`)}
                </h3>
                <p className="md:col-span-5 text-[15px] leading-relaxed text-graphite">{t(`services.${s}_desc`)}</p>
                <p className="md:col-span-3 text-[13px] text-mist md:text-right">
                  <span className="sr-only">{t('services.by_label')}: </span>
                  {t(`services.${s}_by`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Realizacje ── */}
      <section id="realizacje" aria-labelledby="realizacje-h" className="bg-plaster py-20 md:py-28">
        <div className="max-w-site mx-auto">
          <SectionHead id="realizacje-h" title={t('portfolio.title')} subtitle={t('portfolio.subtitle')}>
            {tabs.length > 1 && (
              <div role="tablist" className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-[13px] rounded-[2px] border transition-colors ${
                      activeTab === tab.id ? 'bg-ink text-plaster border-ink' : 'border-stone text-graphite hover:border-ink'
                    }`}
                  >
                    {t(tab.labelKey)}
                  </button>
                ))}
              </div>
            )}
          </SectionHead>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => { setLightbox(item); setPhotoIndex(0); }}
                className="group text-left"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone/40">
                  <SmartImage
                    src={item.src}
                    alt={`${item.title}, ${item.location}, fot. ${site.founder}`}
                    className="absolute inset-0 w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-display font-normal text-lg text-ink">{item.title}</h3>
                  <span className="text-[13px] text-mist shrink-0">{t('portfolio.photos', { count: item.images.length })}</span>
                </div>
                <p className="mt-1 text-[13px] text-graphite/80">
                  {[item.type, item.size, item.location, item.year].filter(Boolean).join(', ')}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          className="fixed inset-0 z-[100] bg-ink flex flex-col animate-fade-in"
        >
          <div className="max-w-site w-full mx-auto h-16 flex items-center justify-between text-plaster">
            <div className="text-[14px]">
              <span className="font-display">{lightbox.title}</span>
              <span className="text-plaster/50 ml-3">{photoIndex + 1} / {lightbox.images.length}</span>
            </div>
            <button onClick={closeLightbox} aria-label={t('portfolio.close')} className="p-2 -mr-2 text-plaster/70 hover:text-plaster">
              <X size={24} />
            </button>
          </div>
          <div className="relative flex-1 min-h-0 px-[4vw] pb-4">
            <SmartImage
              key={photoIndex}
              src={lightbox.images[photoIndex]}
              alt={`${lightbox.title}, ${photoIndex + 1}, fot. ${site.founder}`}
              fit="contain"
              eager
              className="w-full h-full animate-fade-in"
            />
            {lightbox.images.length > 1 && (
              <>
                <button onClick={() => step(-1)} aria-label={t('portfolio.prev')}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-ink/70 text-plaster hover:bg-ink">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={() => step(1)} aria-label={t('portfolio.next')}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-ink/70 text-plaster hover:bg-ink">
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
          {lightbox.images.length > 1 && (
            <div className="max-w-site w-full mx-auto flex gap-2 overflow-x-auto pb-5">
              {lightbox.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`${i + 1}`}
                  className={`shrink-0 w-16 h-11 overflow-hidden transition-opacity ${i === photoIndex ? 'opacity-100 ring-1 ring-brass-light' : 'opacity-40 hover:opacity-80'}`}
                >
                  <SmartImage src={img} alt="" className="w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Jak pracujemy ── */}
      <section aria-labelledby="proces-h" className="bg-ink text-plaster py-20 md:py-28">
        <div className="max-w-site mx-auto">
          <SectionHead id="proces-h" title={t('process.title')} tone="light" />
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {processSteps.map((s, i) => (
              <li key={s} className="border-t border-ink-line pt-6">
                <span className="font-display font-light text-5xl text-brass-light">{i + 1}</span>
                <h3 className="mt-6 font-display text-lg">{t(`process.${s}_name`)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-plaster/65">{t(`process.${s}_desc`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Cennik ── */}
      <section id="cennik" aria-labelledby="cennik-h" className="bg-paper py-20 md:py-28">
        <div className="max-w-site mx-auto">
          <SectionHead id="cennik-h" title={t('pricing.title')} subtitle={t('pricing.subtitle')} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-ink/80">
            {packages.map((p) => (
              <div
                key={p.id}
                className={`relative flex flex-col p-6 md:p-8 border-b border-stone lg:border-b-0 lg:[&:not(:last-child)]:border-r ${
                  p.popular ? 'bg-ink text-plaster border-ink' : 'text-ink'
                }`}
              >
                {p.popular && (
                  <span className="absolute top-0 right-0 bg-brass text-ink text-[12px] font-medium px-3 py-1">
                    {t('pricing.popular')}
                  </span>
                )}
                <h3 className="font-display text-2xl">{t(`pricing.${p.id}`, { defaultValue: p.id[0].toUpperCase() + p.id.slice(1) })}</h3>
                <p className={`mt-1 text-[14px] ${p.popular ? 'text-plaster/60' : 'text-mist'}`}>{t(`pricing.${p.id}_area`)}</p>

                <div className="mt-8 mb-6 min-h-[3.5rem] flex items-end">
                  {p.price ? (
                    <p className="font-display font-light text-5xl tracking-[-0.03em]">
                      {pln(p.price)}<span className="text-base ml-2 opacity-60">PLN</span>
                    </p>
                  ) : (
                    <p className="font-display font-light text-2xl leading-tight">{t('pricing.custom_quote')}</p>
                  )}
                </div>

                <p className={`text-[15px] font-medium ${p.popular ? '' : 'text-ink'}`}>
                  {p.photos ? t('pricing.photos', { count: p.photos }) : t('pricing.photos_custom')}
                </p>
                <p className={`mt-2 text-[14px] leading-relaxed flex-1 ${p.popular ? 'text-plaster/70' : 'text-graphite/85'}`}>
                  {t(`pricing.${p.id}_desc`)}
                </p>

                <a href="#kontakt" className={`mt-8 ${p.popular ? 'btn-light' : 'btn-ghost-dark'}`}>
                  {p.price ? t('pricing.book') : t('pricing.ask')}
                </a>
              </div>
            ))}
          </div>

          {/* Dodatki */}
          <div className="mt-16 grid lg:grid-cols-12 gap-8">
            <h3 className="lg:col-span-3 font-display text-xl text-ink">{t('pricing.extras_title')}</h3>
            <ul className="lg:col-span-9 border-t border-stone">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex justify-between gap-6 py-4 border-b border-stone text-[15px]">
                  <span className="text-graphite">{t(`pricing.extra${i}`)}</span>
                  <span className="text-ink font-medium shrink-0 text-right">{t(`pricing.extra${i}_price`)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Agencje + Designer Day */}
          <div className="mt-16 grid lg:grid-cols-2 gap-6">
            <div className="bg-ink text-plaster p-8 md:p-12 flex flex-col">
              <p className="text-[13px] text-brass-light">{t('pricing.agency_label')}</p>
              <h3 className="mt-4 font-display font-light text-3xl md:text-4xl">{t('pricing.agency_title')}</h3>
              <p className="mt-5 text-[15px] leading-relaxed text-plaster/70 max-w-prose flex-1">{t('pricing.agency_desc')}</p>
              <a href="#kontakt" className="btn-light mt-10 self-start">{t('pricing.agency_cta')}</a>
            </div>

            <div className="bg-plaster grid sm:grid-cols-2">
              <div className="relative min-h-[240px] sm:min-h-0">
                <SmartImage src={designerPhoto} alt="" className="absolute inset-0 w-full h-full" />
              </div>
              <div className="p-8 md:p-10 flex flex-col">
                <p className="text-[13px] text-brass">{t('pricing.designer_label')}</p>
                <h3 className="mt-4 font-display font-light text-3xl text-ink">{t('pricing.designer_name')}</h3>
                <p className="mt-4 text-[14px] leading-relaxed text-graphite flex-1">{t('pricing.designer_desc')}</p>
                <p className="mt-6 font-display font-light text-4xl text-ink">
                  {pln(designerDayPrice)}<span className="text-base ml-2 opacity-60">PLN*</span>
                </p>
                <p className="mt-2 text-[12px] text-mist">{t('pricing.designer_note')}</p>
                <a href="#kontakt" className="btn-dark mt-6 self-start">{t('pricing.designer_cta')}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Studio ── */}
      <section id="studio" aria-labelledby="studio-h" className="bg-plaster py-20 md:py-28">
        <div className="max-w-site mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <figure className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone/40">
              <SmartImage src="/images/about/viktoria-chernobay.webp" alt={`${site.founder}, fotograf wnętrz, ${site.brand} ${site.brandSuffix}`} className="absolute inset-0 w-full h-full" />
            </div>
            <figcaption className="mt-4 flex justify-between gap-4 text-[14px]">
              <span className="font-display text-ink">{site.founder}</span>
              <span className="text-mist">{t('studio.role')}</span>
            </figcaption>
          </figure>

          <div className="lg:col-span-7 lg:pt-4">
            <h2 id="studio-h" className="font-display font-light text-display text-ink">{t('studio.title')}</h2>
            <div className="mt-8 space-y-5 text-[16px] leading-[1.7] text-graphite max-w-prose">
              <p>{t('studio.p1')}</p>
              <p>{t('studio.p2')}</p>
            </div>

            <h3 className="mt-14 font-display text-lg text-ink">{t('studio.team_title')}</h3>
            <dl className="mt-5 border-t border-ink/80">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-2 gap-6 py-4 border-b border-stone text-[15px]">
                  <dt className="text-graphite">{t(`studio.team${i}_role`)}</dt>
                  <dd className="text-ink font-medium">{t(`studio.team${i}_who`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Opinie — tylko gdy są prawdziwe ── */}
      {hasTestimonials && (
        <section aria-labelledby="opinie-h" className="bg-paper py-20 md:py-28">
          <div className="max-w-site mx-auto">
            <SectionHead id="opinie-h" title={t('reviews.title')} />
            <div className="grid md:grid-cols-3 gap-10">
              {testimonials.map((r) => (
                <figure key={r.id} className="border-t border-ink/80 pt-6">
                  <blockquote className="text-[16px] leading-relaxed text-graphite">“{r.text}”</blockquote>
                  <figcaption className="mt-6 text-[14px]">
                    <span className="block text-ink font-medium">{r.name}</span>
                    <span className="text-mist">{r.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ + warunki ── */}
      <section aria-labelledby="faq-h" className="bg-paper py-20 md:py-28 border-t border-stone">
        <div className="max-w-site mx-auto grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-7">
            <h2 id="faq-h" className="font-display font-light text-display text-ink mb-10">{t('faq.title')}</h2>
            <div className="border-t border-ink/80">
              {[1, 2, 3, 4].map((i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="border-b border-stone">
                    <button
                      className="w-full flex justify-between items-center gap-6 py-6 text-left"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                    >
                      <span className="font-display text-[17px] text-ink">{t(`faq.q${i}`)}</span>
                      {open ? <Minus size={18} className="text-brass shrink-0" /> : <Plus size={18} className="text-mist shrink-0" />}
                    </button>
                    {open && <p className="pb-6 -mt-1 text-[15px] leading-relaxed text-graphite max-w-prose animate-fade-in">{t(`faq.a${i}`)}</p>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-5">
            <h3 className="font-display text-lg text-ink lg:mt-[5.25rem]">{t('faq.terms_title')}</h3>
            <ul className="mt-5 space-y-3 text-[14px] leading-relaxed text-graphite/90">
              {Array.from({ length: 8 }, (_, i) => (
                <li key={i} className="pl-4 relative">
                  <span className="absolute left-0 top-[0.7em] w-1.5 h-px bg-brass" aria-hidden="true" />
                  {t(`faq.t${i + 1}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Kontakt ── */}
      <section id="kontakt" aria-labelledby="kontakt-h" className="bg-ink text-plaster pt-20 md:pt-28 pb-10">
        <div className="max-w-site mx-auto">
          <div className="grid lg:grid-cols-12 gap-14">
            <div className="lg:col-span-5">
              <h2 id="kontakt-h" className="font-display font-light text-display">{t('contact.title')}</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-plaster/65 max-w-[40ch]">{t('contact.subtitle')}</p>
              <div className="mt-10 space-y-4 text-[15px]">
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-brass-light transition-colors">
                  <Mail size={18} className="text-plaster/50" />{site.email}
                </a>
                {site.phone && (
                  <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-brass-light transition-colors">
                    <Phone size={18} className="text-plaster/50" />{site.phone}
                  </a>
                )}
                {site.instagram && (
                  <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-brass-light transition-colors">
                    <Instagram size={18} className="text-plaster/50" />@{site.instagram}
                  </a>
                )}
              </div>
            </div>

            <form className="lg:col-span-6 lg:col-start-7 space-y-8" onSubmit={onSubmit}>
              <label className="block">
                <span className="text-[13px] text-plaster/60">{t('contact.field_name')}</span>
                <input name="name" type="text" placeholder={t('contact.field_name_ph')} className="field" required />
              </label>
              <div className="grid sm:grid-cols-2 gap-8">
                <label className="block">
                  <span className="text-[13px] text-plaster/60">{t('contact.field_email')}</span>
                  <input name="email" type="email" placeholder={t('contact.field_email_ph')} className="field" required />
                </label>
                <label className="block">
                  <span className="text-[13px] text-plaster/60">{t('contact.field_phone')}</span>
                  <input name="phone" type="tel" placeholder={t('contact.field_phone_ph')} className="field" />
                </label>
              </div>
              <label className="block">
                <span className="text-[13px] text-plaster/60">{t('contact.field_message')}</span>
                <textarea name="message" rows="3" placeholder={t('contact.field_message_ph')} className="field resize-none" required />
              </label>
              <label className="flex items-start gap-3 text-[13px] text-plaster/55 leading-snug">
                <input type="checkbox" required className="mt-0.5 accent-[#A87A52]" />
                {t('contact.rodo')}
              </label>
              <button type="submit" className="btn-light w-full sm:w-auto">{t('contact.submit')}</button>
              {sent && <p role="status" className="text-[14px] text-brass-light">{t('contact.sent')}</p>}
            </form>
          </div>

          <footer className="mt-24 pt-8 border-t border-ink-line flex flex-col md:flex-row justify-between gap-4 text-[13px] text-plaster/50">
            <Wordmark className="text-plaster text-[15px]" />
            <span>{t('footer.tagline')}</span>
            <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
