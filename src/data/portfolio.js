// Kategorie portfolio — wyprowadzone z realnej struktury projektów.
export const categories = [
  { id: 'mieszkania', labelKey: 'portfolio.tab_mieszkania' },
  { id: 'domy', labelKey: 'portfolio.tab_domy' },
  { id: 'komercyjne', labelKey: 'portfolio.tab_komercyjne' },
];

// Manifest generowany automatycznie przez scripts/generate-portfolio.mjs
// (uruchamiany przed `npm run dev` i `npm run build`).
import manifest from './portfolio.generated.json';

/**
 * Każdy projekt = jeden folder ze zdjęciami.
 * Liczba zdjęć jest wykrywana automatycznie — nie trzeba jej tu wpisywać.
 * `size` jest opcjonalne — uzupełnij metraż, gdy będzie znany.
 */
const projects = [
  // ---------- MIESZKANIA ----------
  { id: 'karolkowa',        category: 'mieszkania', title: 'Karolkowa',          type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-karolkowa', aspect: 'aspect-[4/3]' },
  { id: 'klobucka',         category: 'mieszkania', title: 'Kłobucka',           type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-klobucka', aspect: 'aspect-[3/4]' },
  { id: 'komputerowa',      category: 'mieszkania', title: 'Komputerowa',        type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-komputerowa', aspect: 'aspect-[4/3]' },
  { id: 'kasprzaka',        category: 'mieszkania', title: 'Marcina Kasprzaka',  type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-marcina-kasprzaka', aspect: 'aspect-[3/4]' },
  { id: 'solec',            category: 'mieszkania', title: 'Solec',              type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-solec', aspect: 'aspect-[4/3]' },
  { id: 'twarda',           category: 'mieszkania', title: 'Twarda',             type: 'Mieszkanie', location: 'Warszawa', year: 2023, dir: 'mieszkania/2023-twarda', aspect: 'aspect-[3/4]' },
  { id: 'apartament-2024',  category: 'mieszkania', title: 'Apartament',         type: 'Mieszkanie', location: 'Warszawa', year: 2024, dir: 'mieszkania/2024-apartament', aspect: 'aspect-[4/3]' },
  { id: 'zdziechowskiego',  category: 'mieszkania', title: 'Zdziechowskiego',    type: 'Mieszkanie', location: 'Warszawa', year: 2024, dir: 'mieszkania/2024-zdziechowskiego', aspect: 'aspect-[3/4]' },
  { id: 'szarych-szeregow', category: 'mieszkania', title: 'Szarych Szeregów',   type: 'Mieszkanie', location: 'Warszawa', year: 2024, dir: 'mieszkania/2024-szarych-szeregow', aspect: 'aspect-[4/3]' },
  { id: 'lazurowa',         category: 'mieszkania', title: 'Lazurowa',           type: 'Mieszkanie', location: 'Warszawa', year: 2025, dir: 'mieszkania/2025-lazurowa', aspect: 'aspect-[3/4]' },
  { id: 'konstancin',       category: 'mieszkania', title: 'Konstancin-Jeziorna', type: 'Mieszkanie', location: 'Konstancin-Jeziorna', year: 2026, dir: 'mieszkania/2026-konstancin-jeziorna', aspect: 'aspect-[4/3]' },

  // ---------- DOMY ----------
  { id: 'dabrowka',   category: 'domy', title: 'Dąbrówka',            type: 'Dom',  location: 'Dąbrówka',  year: 2023, dir: 'domy/2023-dabrowka', aspect: 'aspect-[4/3]' },
  { id: 'tukana',     category: 'domy', title: 'Tukana',              type: 'Dom',  location: 'Warszawa',  year: 2023, dir: 'domy/2023-tukana', aspect: 'aspect-[3/4]' },
  { id: 'ksiazenice', category: 'domy', title: 'Książenice',          type: 'Dom',  location: 'Książenice', year: 2024, dir: 'domy/2024-ksiazenice', aspect: 'aspect-[4/3]' },
  { id: 'legionowo',  category: 'domy', title: 'Wymarzona, Legionowo', type: 'Dom', location: 'Legionowo', year: 2025, dir: 'domy/2025-legionowo-wymarzona', aspect: 'aspect-[3/4]' },

  // ---------- KOMERCYJNE ----------
  { id: 'domaniewska',  category: 'komercyjne', title: 'Domaniewska',     type: 'Biuro',            location: 'Warszawa', year: 2023, dir: 'komercyjne/2023-domaniewska', aspect: 'aspect-[4/3]' },
  { id: 'jerozolimskie', category: 'komercyjne', title: 'Jerozolimskie',  type: 'Biuro',            location: 'Warszawa', year: 2023, dir: 'komercyjne/2023-jerozolimskie', aspect: 'aspect-[3/4]' },
  { id: 'salon-charkow', category: 'komercyjne', title: 'Salon Piękności', type: 'Salon Piękności', location: 'Charków',  year: 2020, dir: 'komercyjne/2020-salon-piekna-charkow', aspect: 'aspect-[4/3]' },
];

export const portfolioItems = projects.map((p) => {
  const images = manifest[p.dir] ?? [];
  return { ...p, images, src: images[0] };
});

// Projekty bez wgranych zdjęć — pomocne przy uzupełnianiu galerii.
export const emptyProjects = portfolioItems.filter((p) => p.images.length === 0);
