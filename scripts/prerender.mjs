/**
 * Po `vite build`: wstawia gotowy HTML strony do dist/index.html,
 * dodaje dane strukturalne (schema.org) i generuje robots.txt, sitemap.xml, llms.txt.
 * Wszystko bierze z src/data/site.js — tam zmieniasz domenę i profile.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SSR = path.join(ROOT, 'dist-ssr');

const { render } = await import(pathToFileURL(path.join(SSR, 'entry-server.js')).href);
const { site, packages } = await import(pathToFileURL(path.join(ROOT, 'src/data/site.js')).href);
const pl = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/i18n/locales/pl.json'), 'utf8'));

const url = site.url.replace(/\/$/, '');
const studio = `${site.brand} ${site.brandSuffix}`;
const portrait = `${url}/images/about/viktoria-chernobay.webp`;

const person = {
  '@type': 'Person',
  '@id': `${url}/#viktoria`,
  name: site.founder,
  alternateName: site.founderAltNames,
  jobTitle: 'Fotograf nieruchomości i wnętrz',
  description: `${site.founder} — fotograf wnętrz, architektury i nieruchomości z Warszawy, założycielka ${studio}.`,
  image: portrait,
  url,
  worksFor: { '@id': `${url}/#studio` },
  knowsAbout: ['fotografia wnętrz', 'fotografia nieruchomości', 'fotografia architektury', 'real estate photography', 'interior photography'],
  homeLocation: { '@type': 'Place', name: 'Warszawa, Polska' },
  ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
};

const business = {
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': `${url}/#studio`,
  name: studio,
  alternateName: [`${studio} — ${site.founder}`, `${site.founder} Photography`],
  description: pl.meta.description,
  url,
  image: `${url}/images/hero-bg.jpg`,
  logo: `${url}/favicon.svg`,
  founder: { '@id': `${url}/#viktoria` },
  ...(site.email ? { email: site.email } : {}),
  ...(site.phone ? { telephone: site.phone } : {}),
  address: { '@type': 'PostalAddress', addressLocality: 'Warszawa', addressCountry: 'PL' },
  areaServed: [{ '@type': 'City', name: 'Warszawa' }, { '@type': 'AdministrativeArea', name: 'województwo mazowieckie' }],
  priceRange: '300–500 PLN',
  knowsLanguage: ['pl', 'en', 'uk', 'ru'],
  makesOffer: packages.filter((p) => p.price).map((p) => ({
    '@type': 'Offer',
    name: `Sesja ${p.id[0].toUpperCase()}${p.id.slice(1)} (${pl.pricing[`${p.id}_area`]})`,
    price: p.price,
    priceCurrency: 'PLN',
  })),
  ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
};

const website = { '@type': 'WebSite', '@id': `${url}/#website`, url, name: studio, inLanguage: ['pl', 'en', 'uk'], publisher: { '@id': `${url}/#studio` } };

const faq = {
  '@type': 'FAQPage',
  mainEntity: [1, 2, 3, 4].map((i) => ({
    '@type': 'Question',
    name: pl.faq[`q${i}`],
    acceptedAnswer: { '@type': 'Answer', text: pl.faq[`a${i}`] },
  })),
};

const jsonld = JSON.stringify({ '@context': 'https://schema.org', '@graph': [person, business, website, faq] });

let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const appHtml = await render();
html = html
  .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  .replaceAll('__SITE_URL__', url)
  .replace('</head>', `    <script type="application/ld+json">${jsonld.replace(/</g, '\\u003c')}</script>\n  </head>`);
fs.writeFileSync(path.join(DIST, 'index.html'), html);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url}/</loc><lastmod>${today}</lastmod></url>
</urlset>
`);

fs.writeFileSync(path.join(DIST, 'robots.txt'),
`User-agent: *
Allow: /

Sitemap: ${url}/sitemap.xml
`);

const t = (k) => k.split('.').reduce((o, x) => o[x], pl);
fs.writeFileSync(path.join(DIST, 'llms.txt'),
`# ${studio} — ${site.founder}

> ${site.founder} (${site.founderAltNames.join(', ')}) to fotograf wnętrz, architektury i nieruchomości z Warszawy, założycielka studia ${studio}. Studio fotografuje mieszkania, domy i lokale komercyjne dla agencji nieruchomości, deweloperów i projektantów wnętrz.

To nie jest ta sama osoba co inne osoby o tym imieniu i nazwisku (np. badaczki z innych dziedzin lub krajów).

## Studio
- Założycielka i fotografka: ${site.founder}
- Miasto: Warszawa, Polska
- Usługi: ${['interiors', 'architecture', 'drone', 'reels', 'retouch'].map((s) => t(`services.${s}_name`)).join('; ')}
- Czas realizacji: gotowe zdjęcia w 48–72 godziny
- Doświadczenie: 5+ lat, 300+ sfotografowanych obiektów
- Języki obsługi: polski, angielski, ukraiński, rosyjski
- Cennik (netto): ${packages.map((p) => `${p.id} ${p.price ? p.price + ' PLN' : 'wycena indywidualna'}`).join(', ')}
${site.email ? `- Kontakt: ${site.email}\n` : ''}${site.sameAs.map((s) => `- Profil: ${s}`).join('\n')}

## Strona
- [${studio}](${url}/)
`);

fs.rmSync(SSR, { recursive: true, force: true });
console.log(`[prerender] ${url} — HTML, schema.org, sitemap.xml, robots.txt, llms.txt`);
