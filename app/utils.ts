// ─── Types ────────────────────────────────────────────────────────────────────
export type Coords = { latitude: number; longitude: number };

export type DayWeather = {
  date: string;
  max: number;
  min: number;
  code: number;
};

// ─── Weather code → emoji ─────────────────────────────────────────────────────
export function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

// ─── Fetch 7-day weather from Open Meteo ─────────────────────────────────────
export async function fetchWeather(lat: number, lon: number): Promise<DayWeather[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
    `&timezone=auto&forecast_days=7`;

  const res = await fetch(url);
  const data = await res.json();

  return data.daily.time.map((date: string, i: number) => ({
    date,
    max: Math.round(data.daily.temperature_2m_max[i]),
    min: Math.round(data.daily.temperature_2m_min[i]),
    code: data.daily.weathercode[i],
  }));
}

// ─── Geocode city name → coords ───────────────────────────────────────────────
export async function geocode(name: string): Promise<Coords | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results?.length) return null;
  return {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
  };
}

// ─── Themes ──────────────────────────────────────────────────────────────────
export const lightTheme = {
  bg: "#f0f4f8",
  card: "#ffffff",
  dayCard: "#e8f0fe",
  text: "#1a1a2e",
  subText: "#666666",
  accent: "#007AFF",
  border: "#cccccc",
  placeholder: "#aaaaaa",
};

export const darkTheme = {
  bg: "#1a1a2e",
  card: "#16213e",
  dayCard: "#0f3460",
  text: "#eaeaea",
  subText: "#aaaaaa",
  accent: "#4fa3e0",
  border: "#444444",
  placeholder: "#666666",
};