# Задание: завершить сайт фотографа недвижимости

## Вводные данные
- Исходный код React-компонента `App.jsx` уже содержит полную структуру сайта (Hero, портфолио, пакеты, отзывы, FAQ, контакты).
- Все визуальные элементы используют заглушки (иконка `ImageIcon`).
- Стилизация выполнена на Tailwind CSS.
- Проект должен быть собран на **Vite + React**.

## Твоя задача
Создать проект с нуля (Vite + React), перенести код, доработать и настроить всё так, чтобы сайт был полностью готов к деплою на Vercel. **Никакой самодеятельности, только по пунктам ниже**.

---

## 1. Инициализация проекта и перенос кода
- Создай проект: `npm create vite@latest realestate-photographer -- --template react`
- Установи зависимости: `npm install`
- Установи **Tailwind CSS** версии 3 (по инструкции для Vite: `npm install -D tailwindcss postcss autoprefixer`, `npx tailwindcss init -p`, настрой `tailwind.config.js` с `content: ['./index.html', './src/**/*.{js,jsx}']`, добавь директивы в `src/index.css`).
- Установи **Framer Motion**: `npm install framer-motion`
- Установи **React Intersection Observer** (или используй хуки Framer): `npm install react-intersection-observer`
- Установи иконки **lucide-react**: `npm install lucide-react`
- Полностью замени содержимое `src/App.jsx` на предоставленный код (приложен отдельно).
- В `src/App.jsx` добавь импорты для Framer Motion и хуков, если они ещё не были импортированы (в текущем коде их нет, нужно будет добавить).

## 2. Структура данных и изображения
- Создай папку `public/images/portfolio` и положи в неё 6 любых **бесплатных изображений интерьеров** из Unsplash (URL подставь позже через массив, пока можно просто создать пустые `.jpg`-заглушки, но я дам тебе массив позже). **Важное условие**: в коде ссылаться на них через относительные пути из папки `public`, чтобы после деплоя они подгружались.
- Создай файл `src/data/portfolio.js`, экспортирующий массив `portfolioItems` из текущего `App.jsx` (объекты с id, category, title, src, type, size, location). `src` сделай вида `/images/portfolio/wnetrza-1.jpg` (или webp).
- В `App.jsx` импортируй этот массив и удали локальное объявление.
- Аналогично вынеси:
  - `faqs` в `src/data/faqs.js`
  - `testimonials` в `src/data/testimonials.js`
  - `packages` (если понадобится) – можно оставить в компоненте, но лучше вынести.

## 3. Замена заглушек реальными изображениями
- В секции Hero: установи фоновое изображение (`/images/hero-bg.webp`) вместо пустого `<div className="absolute inset-0 ...">`. Используй атрибут `style={{ backgroundImage: 'url(/images/hero-bg.webp)' }}` или тег `<img>` с абсолютным позиционированием. Сохрани градиент поверх.
- В секции «Обо мне» (блок с `aspect-[3/4]`): добавь `<img src="/images/about.webp" className="absolute inset-0 w-full h-full object-cover" />` внутрь контейнера.
- В портфолио: вместо иконки `<ImageIcon>` вставь `<img src={item.src} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />`.
- В лайтбоксе: аналогично замени заглушку на `<img src={lightboxData.src} alt={lightboxData.title} className="..." />`.

**Важно**: для отзывов и других блоков изображений пока нет, оставь как есть.

## 4. Анимации (Framer Motion)
Добавь только те анимации, что перечислены ниже. Не придумывай лишнего.

### 4.1 Появление секций при скролле
Оберни каждую секцию в компонент `<motion.section>` (или создай обёртку `FadeInSection`). Для каждой секции (`o-mnie`, `portfolio`, `oferta`, `opinie`, FAQ, `kontakt`) примени:
```jsx
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>