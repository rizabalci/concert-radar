# 🎸 Concert Radar

**AI-powered European concert finder from Vienna.**

Scans 27 cities across Europe using Claude's web search to find real upcoming concerts, with distance-based filtering, travel cost estimates, artist previews, and a favorites shortlist.

**[Live Demo →](https://rizabalci.github.io/concert-radar/)**

## Features

- **27 European cities** with real distances from Vienna
- **AI-powered web search** via Claude API finds confirmed upcoming concerts
- **Distance slider** (50km - 3,500km) with 4 travel tiers: Home / Day Trip / Weekend / Plan Around It
- **Travel cost estimates** per city (budget flights/trains from Vienna)
- **Artist descriptions** with genre, origin, and style info
- **Spotify & YouTube preview links** to discover artists before buying tickets
- **Favorites shortlist** - heart concerts and filter to saved only
- **Real-time search** with progress bar, batch scanning, and stop button
- **Filtering & sorting** by text search, genre, timeframe, distance, date, or city

## Tech Stack

- **React 18** with hooks
- **Vite** for build tooling
- **Claude API** (Sonnet) with web search tool
- **GitHub Pages** for hosting

## Getting Started

```bash
git clone https://github.com/rizabalci/concert-radar.git
cd concert-radar
npm install
npm run dev
```

Open `http://localhost:5173` and enter your [Anthropic API key](https://console.anthropic.com/settings/keys).

## Deploy to GitHub Pages

```bash
npm run build
npm run deploy
```

## How It Works

1. Select your max travel distance and preferred genre/timeframe
2. Hit "Scan" - the app batches eligible cities and sends them to Claude with web search enabled
3. Claude searches the web for real concert listings and returns structured JSON
4. Results stream in progressively as each batch completes
5. Filter, sort, favorite, and preview artists all in one view

## Screenshots

The app features a dark UI with color-coded travel tiers:
- 🟢 **Green** = Home (Vienna, 0km)
- 🔵 **Blue** = Day Trip / Overnight (up to ~400km)
- 🟡 **Yellow** = Weekend Trip (up to ~1000km)
- 🔴 **Red** = Plan Around It (1000km+)

## Author

**Riza Balci** — E-commerce consultant & AI builder based in Vienna.

- [LinkedIn](https://linkedin.com/in/rizabalci)
- [GitHub](https://github.com/rizabalci)

## License

MIT
