// Kategorie portfolio — wyprowadzone z realnej struktury projektów.
export const categories = [
  { id: 'mieszkania', labelKey: 'portfolio.tab_mieszkania' },
  { id: 'domy', labelKey: 'portfolio.tab_domy' },
  { id: 'komercyjne', labelKey: 'portfolio.tab_komercyjne' },
];

const BASE = '/images/portfolio';

/**
 * Buduje listę zdjęć galerii: 01.webp, 02.webp, ...
 * `count` = liczba zdjęć w folderze projektu. Zaktualizuj po wgraniu plików.
 */
const gallery = (dir, count) =>
  Array.from({ length: count }, (_, i) => `${BASE}/${dir}/${String(i + 1).padStart(2, '0')}.webp`);

/**
 * Każdy projekt = jeden folder ze zdjęciami.
 * Nazewnictwo folderów odpowiada archiwum: ROK_TYP_LOKALIZACJA.
 * `size` jest opcjonalne — uzupełnij metraż, gdy będzie znany.
 */
const projects = [
  // ---------- MIESZKANIA ----------
  { id: 'karolkowa',        category: 'mieszkania', title: 'Karolkowa',          type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-karolkowa',           count: 6, aspect: 'aspect-[4/3]' },
  { id: 'klobucka',         category: 'mieszkania', title: 'Kłobucka',           type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-klobucka',            count: 6, aspect: 'aspect-[3/4]' },
  { id: 'komputerowa',      category: 'mieszkania', title: 'Komputerowa',        type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-komputerowa',         count: 6, aspect: 'aspect-[4/3]' },
  { id: 'kasprzaka',        category: 'mieszkania', title: 'Marcina Kasprzaka',  type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-marcina-kasprzaka',   count: 6, aspect: 'aspect-[3/4]' },
  { id: 'solec',            category: 'mieszkania', title: 'Solec',              type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-solec',               count: 6, aspect: 'aspect-[4/3]' },
  { id: 'twarda',           category: 'mieszkania', title: 'Twarda',             type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-twarda',              count: 6, aspect: 'aspect-[3/4]' },
  { id: 'apartament-2024',  category: 'mieszkania', title: 'Apartament',         type: 'Mieszkanie', location: 'Warszawa', year: 2024, dir: 'mieszkania/2024-apartament',          count: 6, aspect: 'aspect-[4/3]' },
  { id: 'zdziechowskiego',  category: 'mieszkania', title: 'Zdziechowskiego',    type: 'Mieszkanie', location: 'Warszawa', year: 2024, dir: 'mieszkania/2024-zdziechowskiego',     count: 6, aspect: 'aspect-[3/4]' },
  { id: 'szarych-szeregow', category: 'mieszkania', title: 'Szarych Szeregów',   type: 'Mieszkanie', location: 'Warszawa', year: 2024, dir: 'mieszkania/2024-szarych-szeregow',    count: 6, aspect: 'aspect-[4/3]' },
  { id: 'lazurowa',         category: 'mieszkania', title: 'Lazurowa',           type: 'Mieszkanie', location: 'Warszawa', year: 2025, dir: 'mieszkania/2025-lazurowa',            count: 6, aspect: 'aspect-[3/4]' },
  { id: 'konstancin',       category: 'mieszkania', title: 'Konstancin-Jeziorna', type: 'Mieszkanie', location: 'Konstancin-Jeziorna', year: 2026, dir: 'mieszkania/2026-konstancin-jeziorna', count: 6, aspect: 'aspect-[4/3]' },

  // ---------- DOMY ----------
  { id: 'dabrowka',   category: 'domy', title: 'Dąbrówka',            type: 'Dom',  location: 'Dąbrówka',  year: 2023, dir: 'domy/2023-dabrowka',             count: 6, aspect: 'aspect-[4/3]' },
  { id: 'tukana',     category: 'domy', title: 'Tukana',              type: 'Dom',  location: 'Warszawa',  year: 2023, dir: 'domy/2023-tukana',               count: 6, aspect: 'aspect-[3/4]' },
  { id: 'ksiazenice', category: 'domy', title: 'Książenice',          type: 'Dom',  location: 'Książenice', year: 2024, dir: 'domy/2024-ksiazenice',          count: 6, aspect: 'aspect-[4/3]' },
  { id: 'legionowo',  category: 'domy', title: 'Wymarzona, Legionowo', type: 'Dom', location: 'Legionowo', year: 2025, dir: 'domy/2025-legionowo-wymarzona',  count: 6, aspect: 'aspect-[3/4]' },

  // ---------- KOMERCYJNE ----------
  { id: 'domaniewska',  category: 'komercyjne', title: 'Domaniewska',     type: 'Biuro',            location: 'Warszawa', year: 2023, dir: 'komercyjne/2023-domaniewska',           count: 6, aspect: 'aspect-[4/3]' },
  { id: 'jerozolimskie', category: 'komercyjne', title: 'Jerozolimskie',  type: 'Biuro',            location: 'Warszawa', year: 2023, dir: 'komercyjne/2023-jerozolimskie',         count: 6, aspect: 'aspect-[3/4]' },
  { id: 'salon-charkow', category: 'komercyjne', title: 'Salon Piękności', type: 'Salon Piękności', location: 'Charków',  year: 2020, dir: 'komercyjne/2020-salon-piekna-charkow',  count: 6, aspect: 'aspect-[4/3]' },
];

export const portfolioItems = projects.map((p) => {
  const images = gallery(p.dir, p.count);
  return { ...p, images, src: images[0] };
});
