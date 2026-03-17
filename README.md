# 🌍 News Hunter — Feel The World

A visually immersive news experience built on a real-time 3D globe. Click any country to surface the latest headlines, and watch the site shift mood — colour, particles, and music — based on whether the news is uplifting or heavy.

![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![globe.gl](https://img.shields.io/badge/globe.gl-Three.js-ff6600)

---

## Features

- **Photorealistic 3D globe** — NASA Blue Marble + topology textures, Milky Way background, atmosphere glow
- **28 country news pins** — pulsing markers with animated ring burst on click
- **Live news** — fetches top headlines from GNews or NewsAPI for the selected country
- **Clickable articles** — each card opens the full story in a new tab
- **Mood system** — sentiment analysis on headlines drives the entire UI:
  - 🎉 Happy → gold theme, confetti, C major arpeggios
  - 😔 Sad → blue theme, rain drops, A minor descent
  - 🌐 Neutral → cyan theme, sparkles, ambient drone
- **Animated news-flow arcs** between major cities
- **Procedural audio** via Web Audio API (no audio files required)
- **Demo mode** — rich mock news when no API key is configured

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your API key (see API Keys section below)
cp .env.example .env
# edit .env with your key

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Keys

The app works out of the box in demo mode. To get live headlines, add one of the following to your `.env` file:

### GNews (recommended)
Free tier: 100 requests/day — no credit card needed.

1. Sign up at [gnews.io](https://gnews.io)
2. Copy your API key
3. Add to `.env`:

```env
VITE_GNEWS_API_KEY=your_key_here
```

### NewsAPI
Free developer tier. **Note:** NewsAPI's free tier blocks direct browser requests, so it only works via the Vite dev proxy (`npm run dev`) — not in production builds.

1. Sign up at [newsapi.org](https://newsapi.org)
2. Copy your API key
3. Add to `.env`:

```env
VITE_NEWSAPI_KEY=your_key_here
```

> If both keys are present, GNews is used first.

---

## Project Structure

```
news-hunter/
├── src/
│   ├── App.vue                  # Root — state, mood theming, layout
│   ├── main.js
│   ├── components/
│   │   ├── GlobeScene.vue       # 3D globe (globe.gl + NASA textures)
│   │   ├── NewsPanel.vue        # Sliding article panel
│   │   └── MoodEffects.vue      # Canvas particles + floating emojis
│   ├── composables/
│   │   ├── useNews.js           # API fetching + fallback logic
│   │   └── useAudio.js          # Procedural Web Audio mood music
│   ├── utils/
│   │   ├── locations.js         # 28 country coords + arc pairs
│   │   ├── sentiment.js         # Keyword-based headline scoring
│   │   └── mockNews.js          # Realistic demo articles
│   └── styles/
│       └── global.css
├── .env                         # Your API keys (git-ignored)
├── .env.example                 # Key template
├── vite.config.js               # Dev proxies for CORS
└── package.json
```

---

## How the Mood System Works

1. News articles are fetched for the clicked country
2. Each headline + description is scored against a positive/negative keyword list (`utils/sentiment.js`)
3. The average score across all articles determines the overall mood (`happy` / `sad` / `neutral`)
4. The mood propagates to:
   - Globe atmosphere colour and arc/point colours
   - CSS variables (`--mood-primary`, `--mood-glow`) used site-wide
   - Canvas particle system (confetti vs rain vs sparkles)
   - Floating emoji bursts
   - Procedural Web Audio music loop

---

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Note: the NewsAPI proxy only works in dev — use GNews for production deployments.

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | [Vue 3](https://vuejs.org) (Composition API) |
| Build tool | [Vite 5](https://vitejs.dev) |
| Globe | [globe.gl](https://globe.gl) (Three.js) |
| Earth textures | [three-globe](https://github.com/vasturiano/three-globe) (NASA Blue Marble) |
| News | [GNews API](https://gnews.io) / [NewsAPI](https://newsapi.org) |
| Audio | Web Audio API (procedural) |
| Particles | Canvas 2D API |
