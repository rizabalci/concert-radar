# 🎸 Concert Radar

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://rizabalci.github.io/concert-radar/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff)](https://vitejs.dev/)
[![Claude API](https://img.shields.io/badge/Claude_API-Sonnet-cc785c)](https://docs.anthropic.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**AI-powered European concert finder from Vienna.**

Scans 27 cities across Europe using Claude's web search to find real upcoming concerts, with distance-based filtering, travel cost estimates, artist previews, and a favorites shortlist.

**[Live Demo →](https://rizabalci.github.io/concert-radar/)**

---

## How It Works

1. Select your max travel distance and preferred genre/timeframe
2. Hit **Scan** — the app batches eligible cities and sends them to Claude with web search enabled
3. Claude searches the web for real concert listings and returns structured JSON
4. Results stream in progressively as each batch completes
5. Filter, sort, favorite, and preview artists — all in one view

## Features

| Category | Details |
|---|---|
| **Demo mode** | Loads real sample concert data instantly — full app works with no API key needed |
| **Discovery** | 27 European cities, AI web search for real upcoming concerts, artist bios with genre & origin |
| **Distance** | Slider (50km–3,500km), 4 travel tiers: Home / Day Trip / Weekend / Plan Around It |
| **Travel** | Estimated cost per city (budget flights/trains from Vienna), transport mode & duration |
| **Preview** | Spotify artist page links, YouTube video links |
| **Shortlist** | Heart/favorite concerts, toggle favorites-only view, count badge |
| **Filters** | Text search (artist, city, venue, genre, bio), genre dropdown, timeframe, sort by distance/date/city |
| **UX** | Dark theme, color-coded tier borders, animated cards, progressive loading, stop button |

## Travel Tiers from Vienna

| Tier | Color | Range | Example Cities |
|---|---|---|---|
| 🟢 Home | Green | 0 km | Vienna |
| 🔵 Day Trip | Blue | < 400 km | Bratislava, Budapest, Prague, Munich |
| 🟡 Weekend | Yellow | 400–1000 km | Berlin, Milan, Krakow, Copenhagen |
| 🔴 Plan It | Red | > 1000 km | London, Paris, Barcelona, Istanbul |

## Tech Stack

- **React 18** — functional components, hooks, useMemo for filtering
- **Vite 5** — fast dev server and optimized production build
- **Claude API** — Sonnet model with web search tool for real-time concert data
- **GitHub Pages** — static hosting via gh-pages

## Getting Started

```bash
git clone https://github.com/rizabalci/concert-radar.git
cd concert-radar
npm install
npm run dev
```

Open `http://localhost:5173`. The app loads with **real sample concert data out of the box — no API key needed**. To run a fresh live search, enter your [Anthropic API key](https://console.anthropic.com/settings/keys). The key is stored in your browser's localStorage only — never sent anywhere except the Anthropic API.

## Deploy to GitHub Pages

```bash
npm run build
npm run deploy
```

Live at: `https://rizabalci.github.io/concert-radar/`

## Project Structure

```
concert-radar/
├── index.html          # Entry HTML with meta tags & favicon
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite config with GitHub Pages base path
├── src/
│   ├── main.jsx        # React entry point
│   └── App.jsx         # Full app (cities, tiers, search, UI)
├── README.md
├── LICENSE
└── .gitignore
```

## Privacy & Security

- API key is entered at runtime and stored in localStorage only
- No backend server — all API calls go directly from browser to Anthropic
- No tracking, no analytics, no cookies beyond the API key

## Author

**Riza Balci** — E-commerce consultant & AI-augmented workflow builder based in Vienna.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-rizabalci-0077b5)](https://linkedin.com/in/rizabalci)
[![GitHub](https://img.shields.io/badge/GitHub-rizabalci-333)](https://github.com/rizabalci)

## License

[MIT](./LICENSE)
