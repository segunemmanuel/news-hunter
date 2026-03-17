export const locations = [
  { name: 'United States',   flag: '🇺🇸', lat: 39.5,    lng: -98.35,   country: 'us', city: 'Washington D.C.' },
  { name: 'United Kingdom',  flag: '🇬🇧', lat: 54.0,    lng: -2.5,     country: 'gb', city: 'London' },
  { name: 'France',          flag: '🇫🇷', lat: 46.23,   lng: 2.21,     country: 'fr', city: 'Paris' },
  { name: 'Germany',         flag: '🇩🇪', lat: 51.17,   lng: 10.45,    country: 'de', city: 'Berlin' },
  { name: 'Japan',           flag: '🇯🇵', lat: 36.2,    lng: 138.25,   country: 'jp', city: 'Tokyo' },
  { name: 'Australia',       flag: '🇦🇺', lat: -25.27,  lng: 133.77,   country: 'au', city: 'Sydney' },
  { name: 'Brazil',          flag: '🇧🇷', lat: -14.24,  lng: -51.93,   country: 'br', city: 'São Paulo' },
  { name: 'India',           flag: '🇮🇳', lat: 20.59,   lng: 78.96,    country: 'in', city: 'New Delhi' },
  { name: 'Canada',          flag: '🇨🇦', lat: 56.13,   lng: -106.35,  country: 'ca', city: 'Ottawa' },
  { name: 'South Africa',    flag: '🇿🇦', lat: -30.56,  lng: 22.94,    country: 'za', city: 'Johannesburg' },
  { name: 'Russia',          flag: '🇷🇺', lat: 61.52,   lng: 105.32,   country: 'ru', city: 'Moscow' },
  { name: 'China',           flag: '🇨🇳', lat: 35.86,   lng: 104.20,   country: 'cn', city: 'Beijing' },
  { name: 'Italy',           flag: '🇮🇹', lat: 41.87,   lng: 12.57,    country: 'it', city: 'Rome' },
  { name: 'Spain',           flag: '🇪🇸', lat: 40.46,   lng: -3.75,    country: 'es', city: 'Madrid' },
  { name: 'Mexico',          flag: '🇲🇽', lat: 23.63,   lng: -102.55,  country: 'mx', city: 'Mexico City' },
  { name: 'South Korea',     flag: '🇰🇷', lat: 35.91,   lng: 127.77,   country: 'kr', city: 'Seoul' },
  { name: 'UAE',             flag: '🇦🇪', lat: 23.42,   lng: 53.85,    country: 'ae', city: 'Dubai' },
  { name: 'Argentina',       flag: '🇦🇷', lat: -38.42,  lng: -63.62,   country: 'ar', city: 'Buenos Aires' },
  { name: 'Nigeria',         flag: '🇳🇬', lat: 9.08,    lng: 8.68,     country: 'ng', city: 'Lagos' },
  { name: 'Egypt',           flag: '🇪🇬', lat: 26.82,   lng: 30.80,    country: 'eg', city: 'Cairo' },
  { name: 'Indonesia',       flag: '🇮🇩', lat: -0.79,   lng: 113.92,   country: 'id', city: 'Jakarta' },
  { name: 'Turkey',          flag: '🇹🇷', lat: 38.96,   lng: 35.24,    country: 'tr', city: 'Istanbul' },
  { name: 'Ukraine',         flag: '🇺🇦', lat: 48.38,   lng: 31.17,    country: 'ua', city: 'Kyiv' },
  { name: 'Netherlands',     flag: '🇳🇱', lat: 52.13,   lng: 5.29,     country: 'nl', city: 'Amsterdam' },
  { name: 'Sweden',          flag: '🇸🇪', lat: 60.13,   lng: 18.64,    country: 'se', city: 'Stockholm' },
  { name: 'Singapore',       flag: '🇸🇬', lat: 1.35,    lng: 103.82,   country: 'sg', city: 'Singapore' },
  { name: 'Portugal',        flag: '🇵🇹', lat: 39.40,   lng: -8.22,    country: 'pt', city: 'Lisbon' },
  { name: 'Thailand',        flag: '🇹🇭', lat: 15.87,   lng: 100.99,   country: 'th', city: 'Bangkok' },
]

// Arcs connecting major news hubs (purely visual)
export const newsArcs = [
  { src: 'United States',  dst: 'United Kingdom' },
  { src: 'United Kingdom', dst: 'France' },
  { src: 'France',         dst: 'Germany' },
  { src: 'United States',  dst: 'Japan' },
  { src: 'Japan',          dst: 'South Korea' },
  { src: 'India',          dst: 'UAE' },
  { src: 'Brazil',         dst: 'Argentina' },
  { src: 'Australia',      dst: 'Singapore' },
  { src: 'South Africa',   dst: 'Nigeria' },
  { src: 'China',          dst: 'India' },
].map(({ src, dst }) => {
  const s = locations.find(l => l.name === src)
  const d = locations.find(l => l.name === dst)
  return s && d ? { startLat: s.lat, startLng: s.lng, endLat: d.lat, endLng: d.lng } : null
}).filter(Boolean)
