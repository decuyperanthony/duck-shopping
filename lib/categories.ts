export const CATEGORIES = [
  { id: "boulangerie", label: "Boulangerie", emoji: "🥖" },
  { id: "boucherie", label: "Boucherie", emoji: "🥩" },
  { id: "poissonnerie", label: "Poissonnerie", emoji: "🐟" },
  { id: "primeur", label: "Primeur", emoji: "🥬" },
  { id: "fromagerie", label: "Fromagerie", emoji: "🧀" },
  { id: "epicerie", label: "Epicerie", emoji: "🏪" },
  { id: "supermarche", label: "Supermarché", emoji: "🛒" },
  { id: "surgeles", label: "Surgelés", emoji: "🧊" },
  { id: "boissons", label: "Boissons", emoji: "🥤" },
  { id: "hygiene", label: "Hygiène", emoji: "🧴" },
  { id: "maison", label: "Maison", emoji: "🏠" },
  { id: "autre", label: "Autre", emoji: "📦" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
