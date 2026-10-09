/**
 * Dane studia w jednym miejscu.
 * Zmień nazwę, kontakty albo ceny tutaj — reszta strony podchwyci to sama.
 */
export const site = {
  brand: 'Black Bay',
  brandSuffix: 'Studio',
  founder: 'Viktoria Chernobay',
  // Inne zapisy imienia — żeby wyszukiwarki i AI łączyły je z jedną osobą.
  founderAltNames: ['Wiktoria Czernobaj', 'Viktoriia Chernobai', 'Вікторія Чернобай', 'Виктория Чернобай'],
  city: 'Warszawa',
  // Adres strony bez ukośnika na końcu. Po podpięciu własnej domeny zmień tylko tutaj.
  url: 'https://viktoria-chernobay.vercel.app',
  // Profile w sieci (Instagram, Facebook, LinkedIn, Google Maps, Houzz…) — pełne linki.
  // Im więcej spójnych profili, tym szybciej Google i AI rozpoznają Viktorię.
  sameAs: [],
  // TODO: prawdziwe dane kontaktowe Viktorii
  email: 'hello@blackbay.studio',
  phone: '',
  instagram: '', // np. 'blackbay.studio' (bez @)
};

// Ceny netto w PLN. `null` = wycena indywidualna.
export const packages = [
  { id: 'minimal', price: 300, photos: 20 },
  { id: 'optimal', price: 400, photos: 30, popular: true },
  { id: 'maximum', price: 500, photos: 40 },
  { id: 'premium', price: null, photos: null },
];

export const designerDayPrice = 500;

// Usługi — `by` mówi, kto w studiu za nią odpowiada.
export const services = ['interiors', 'architecture', 'drone', 'reels', 'retouch'];

export const processSteps = ['brief', 'session', 'selection', 'delivery'];
