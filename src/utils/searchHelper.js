/**
 * Utility for robust, normalized fuzzy search across the automotive fleet.
 * Handles hyphens, spaces, punctuation, partial names (e.g. 'rolls royce' -> 'Rolls-Royce Cullinan', 'gt3rs' -> 'Porsche 911 GT3 RS').
 */

export const normalizeSearchStr = (str) => {
  return (str || "")
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const matchesCarQuery = (car, rawQuery) => {
  if (!rawQuery || !rawQuery.trim()) return true;

  const q = normalizeSearchStr(rawQuery);
  const qCompact = q.replace(/\s+/g, "");

  const searchable = [
    car.name,
    car.brand,
    car.model,
    car.category,
    car.engine,
    car.drivetrain,
    car.fuelType,
    car.bodyType,
    car.stockStatus,
    ...(car.features || [])
  ].map(normalizeSearchStr);

  const fullText = searchable.join(" ");
  const fullTextCompact = fullText.replace(/\s+/g, "");

  // 1. Direct phrase or compact match
  if (fullText.includes(q) || fullTextCompact.includes(qCompact)) {
    return true;
  }

  // 2. Tokenized match (all words in query must exist in fullText)
  const tokens = q.split(" ").filter(Boolean);
  return tokens.every(token => fullText.includes(token) || fullTextCompact.includes(token));
};

export const POPULAR_SEARCH_OPTIONS = [
  { label: "Rolls-Royce", query: "Rolls-Royce", icon: "Crown" },
  { label: "Ferrari SF90", query: "Ferrari SF90", icon: "Zap" },
  { label: "Porsche GT3 RS", query: "GT3 RS", icon: "Flame" },
  { label: "Lamborghini Revuelto", query: "Revuelto", icon: "Zap" },
  { label: "Bugatti Chiron", query: "Bugatti", icon: "Sparkles" },
  { label: "V12 Engines", query: "V12", icon: "Flame" },
  { label: "Luxury SUVs", query: "SUV", icon: "Shield" },
  { label: "Electric Exotics", query: "Electric", icon: "BatteryCharging" },
  { label: "Mumbai Atelier", query: "Mumbai", icon: "MapPin" },
  { label: "Delhi Atelier", query: "Delhi", icon: "MapPin" }
];
