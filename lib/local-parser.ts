import type { NewItemInput } from "./types";
import type { CategoryId } from "./categories";

// ---------------------------------------------------------------------------
// Dictionnaire : mot-clé (normalisé sans accents, singulier) → catégorie
// On match aussi les pluriels grâce à la normalisation (retrait du "s" final)
// ---------------------------------------------------------------------------

const DICTIONARY: Record<string, CategoryId> = {
  // 🥖 Boulangerie
  pain: "boulangerie",
  baguette: "boulangerie",
  croissant: "boulangerie",
  brioche: "boulangerie",
  viennoiserie: "boulangerie",
  "pain de mie": "boulangerie",
  ficelle: "boulangerie",
  "pain complet": "boulangerie",
  "pain de campagne": "boulangerie",
  tartine: "boulangerie",
  "pain au chocolat": "boulangerie",
  chocolatine: "boulangerie",
  "pain aux raisins": "boulangerie",
  chausson: "boulangerie",
  "chausson aux pommes": "boulangerie",
  fougasse: "boulangerie",
  gaufre: "boulangerie",
  crepe: "boulangerie",

  // 🥩 Boucherie
  viande: "boucherie",
  poulet: "boucherie",
  boeuf: "boucherie",
  porc: "boucherie",
  agneau: "boucherie",
  steak: "boucherie",
  saucisse: "boucherie",
  merguez: "boucherie",
  lardon: "boucherie",
  jambon: "boucherie",
  dinde: "boucherie",
  veau: "boucherie",
  canard: "boucherie",
  lapin: "boucherie",
  escalope: "boucherie",
  "steak hache": "boucherie",
  entrecote: "boucherie",
  "cote de porc": "boucherie",
  "cote de boeuf": "boucherie",
  filet: "boucherie",
  "filet mignon": "boucherie",
  roti: "boucherie",
  bavette: "boucherie",
  andouillette: "boucherie",
  boudin: "boucherie",
  chipolata: "boucherie",
  nugget: "boucherie",
  "cordon bleu": "boucherie",
  hache: "boucherie",
  "viande hachee": "boucherie",

  // 🐟 Poissonnerie
  poisson: "poissonnerie",
  saumon: "poissonnerie",
  crevette: "poissonnerie",
  thon: "poissonnerie",
  cabillaud: "poissonnerie",
  moule: "poissonnerie",
  huitre: "poissonnerie",
  sardine: "poissonnerie",
  truite: "poissonnerie",
  "fruit de mer": "poissonnerie",
  "fruits de mer": "poissonnerie",
  calamar: "poissonnerie",
  gambas: "poissonnerie",
  crabe: "poissonnerie",
  homard: "poissonnerie",
  lieu: "poissonnerie",
  colin: "poissonnerie",
  sole: "poissonnerie",
  dorade: "poissonnerie",
  maquereau: "poissonnerie",
  surimi: "poissonnerie",
  anchois: "poissonnerie",

  // 🥬 Primeur
  fruit: "primeur",
  legume: "primeur",
  pomme: "primeur",
  banane: "primeur",
  tomate: "primeur",
  salade: "primeur",
  carotte: "primeur",
  courgette: "primeur",
  aubergine: "primeur",
  poivron: "primeur",
  oignon: "primeur",
  ail: "primeur",
  echalote: "primeur",
  "pomme de terre": "primeur",
  patate: "primeur",
  "haricot vert": "primeur",
  "haricots verts": "primeur",
  "petit pois": "primeur",
  "petits pois": "primeur",
  champignon: "primeur",
  concombre: "primeur",
  avocat: "primeur",
  citron: "primeur",
  orange: "primeur",
  poire: "primeur",
  peche: "primeur",
  abricot: "primeur",
  fraise: "primeur",
  framboise: "primeur",
  cerise: "primeur",
  raisin: "primeur",
  melon: "primeur",
  pasteque: "primeur",
  kiwi: "primeur",
  mangue: "primeur",
  ananas: "primeur",
  chou: "primeur",
  "chou-fleur": "primeur",
  brocoli: "primeur",
  epinard: "primeur",
  poireau: "primeur",
  endive: "primeur",
  radis: "primeur",
  navet: "primeur",
  betterave: "primeur",
  celeri: "primeur",
  fenouil: "primeur",
  artichaut: "primeur",
  asperge: "primeur",
  mais: "primeur",
  laitue: "primeur",
  mache: "primeur",
  roquette: "primeur",
  persil: "primeur",
  ciboulette: "primeur",
  basilic: "primeur",
  menthe: "primeur",
  coriandre: "primeur",
  clementine: "primeur",
  mandarine: "primeur",
  pamplemousse: "primeur",
  litchi: "primeur",
  grenade: "primeur",
  nectarine: "primeur",
  prune: "primeur",
  myrtille: "primeur",
  cassis: "primeur",
  groseille: "primeur",

  // 🧀 Fromagerie
  fromage: "fromagerie",
  camembert: "fromagerie",
  gruyere: "fromagerie",
  emmental: "fromagerie",
  mozzarella: "fromagerie",
  beurre: "fromagerie",
  creme: "fromagerie",
  "creme fraiche": "fromagerie",
  comte: "fromagerie",
  reblochon: "fromagerie",
  chevre: "fromagerie",
  roquefort: "fromagerie",
  brie: "fromagerie",
  raclette: "fromagerie",
  parmesan: "fromagerie",
  mascarpone: "fromagerie",
  ricotta: "fromagerie",
  feta: "fromagerie",
  "fromage rape": "fromagerie",
  "fromage blanc": "fromagerie",
  faisselle: "fromagerie",
  yaourt: "fromagerie",
  yogourt: "fromagerie",
  "petit suisse": "fromagerie",
  "petits suisses": "fromagerie",

  // 🏪 Epicerie
  pate: "epicerie",
  pates: "epicerie",
  riz: "epicerie",
  farine: "epicerie",
  sucre: "epicerie",
  huile: "epicerie",
  "huile d'olive": "epicerie",
  conserve: "epicerie",
  epice: "epicerie",
  cereale: "epicerie",
  sel: "epicerie",
  poivre: "epicerie",
  vinaigre: "epicerie",
  moutarde: "epicerie",
  ketchup: "epicerie",
  mayonnaise: "epicerie",
  mayo: "epicerie",
  confiture: "epicerie",
  miel: "epicerie",
  nutella: "epicerie",
  "pate a tartiner": "epicerie",
  semoule: "epicerie",
  lentille: "epicerie",
  "pois chiche": "epicerie",
  "pois chiches": "epicerie",
  "haricot rouge": "epicerie",
  "haricots rouges": "epicerie",
  "haricot blanc": "epicerie",
  quinoa: "epicerie",
  boulgour: "epicerie",
  couscous: "epicerie",
  nouille: "epicerie",
  spaghetti: "epicerie",
  tagliatelle: "epicerie",
  penne: "epicerie",
  fusilli: "epicerie",
  "sauce tomate": "epicerie",
  concentre: "epicerie",
  "concentre de tomate": "epicerie",
  "tomate pelee": "epicerie",
  "tomates pelees": "epicerie",
  olive: "epicerie",
  cornichon: "epicerie",
  capre: "epicerie",
  "levure": "epicerie",
  bicarbonate: "epicerie",
  maizena: "epicerie",
  chapelure: "epicerie",
  "bouillon cube": "epicerie",
  bouillon: "epicerie",
  curry: "epicerie",
  cumin: "epicerie",
  paprika: "epicerie",
  cannelle: "epicerie",
  muscade: "epicerie",
  curcuma: "epicerie",
  herbes: "epicerie",
  "herbes de provence": "epicerie",
  thym: "epicerie",
  laurier: "epicerie",
  oregano: "epicerie",
  oeuf: "epicerie",
  oeufs: "epicerie",

  // 🛒 Supermarché
  chips: "supermarche",
  gateau: "supermarche",
  biscuit: "supermarche",
  sauce: "supermarche",
  "plat prepare": "supermarche",
  pizza: "supermarche",
  quiche: "supermarche",
  tarte: "supermarche",
  wrap: "supermarche",
  sandwich: "supermarche",
  taboulé: "supermarche",
  houmous: "supermarche",
  guacamole: "supermarche",
  crackers: "supermarche",
  bretzel: "supermarche",
  "pop corn": "supermarche",
  bonbon: "supermarche",
  chocolat: "supermarche",
  "tablette de chocolat": "supermarche",
  "barre chocolatee": "supermarche",
  cereales: "supermarche",
  muesli: "supermarche",
  granola: "supermarche",
  compote: "supermarche",
  "fruits secs": "supermarche",
  amande: "supermarche",
  noix: "supermarche",
  noisette: "supermarche",
  cacahuete: "supermarche",
  pistache: "supermarche",

  // 🧊 Surgelés
  surgele: "surgeles",
  "pizza surgelee": "surgeles",
  glace: "surgeles",
  "legume surgele": "surgeles",
  "legumes surgeles": "surgeles",
  sorbet: "surgeles",
  "poisson pane": "surgeles",
  "frite": "surgeles",
  frites: "surgeles",
  cornet: "surgeles",
  "bac de glace": "surgeles",
  "croquette": "surgeles",

  // 🥤 Boissons
  eau: "boissons",
  jus: "boissons",
  "jus d'orange": "boissons",
  "jus de pomme": "boissons",
  "jus de fruit": "boissons",
  soda: "boissons",
  coca: "boissons",
  "coca-cola": "boissons",
  orangina: "boissons",
  limonade: "boissons",
  biere: "boissons",
  vin: "boissons",
  "vin rouge": "boissons",
  "vin blanc": "boissons",
  rose: "boissons",
  champagne: "boissons",
  cidre: "boissons",
  cafe: "boissons",
  the: "boissons",
  lait: "boissons",
  "lait demi ecreme": "boissons",
  "lait entier": "boissons",
  "lait ecreme": "boissons",
  "lait d'amande": "boissons",
  "lait d'avoine": "boissons",
  "lait de soja": "boissons",
  "lait de coco": "boissons",
  sirop: "boissons",
  smoothie: "boissons",
  "eau gazeuse": "boissons",
  "eau petillante": "boissons",
  perrier: "boissons",
  evian: "boissons",
  volvic: "boissons",
  "ice tea": "boissons",
  oasis: "boissons",
  sprite: "boissons",
  fanta: "boissons",
  schweppes: "boissons",
  whisky: "boissons",
  rhum: "boissons",
  vodka: "boissons",
  pastis: "boissons",
  aperol: "boissons",
  tisane: "boissons",
  infusion: "boissons",

  // 🧴 Hygiène
  savon: "hygiene",
  shampoing: "hygiene",
  shampooing: "hygiene",
  dentifrice: "hygiene",
  "papier toilette": "hygiene",
  pq: "hygiene",
  mouchoir: "hygiene",
  deodorant: "hygiene",
  "gel douche": "hygiene",
  "brosse a dent": "hygiene",
  "brosse a dents": "hygiene",
  rasoir: "hygiene",
  "mousse a raser": "hygiene",
  coton: "hygiene",
  "coton tige": "hygiene",
  "cotons tiges": "hygiene",
  serviette: "hygiene",
  "serviette hygienique": "hygiene",
  tampon: "hygiene",
  "creme solaire": "hygiene",
  "creme hydratante": "hygiene",
  "lait corporel": "hygiene",
  "apres shampoing": "hygiene",
  "fil dentaire": "hygiene",
  "bain de bouche": "hygiene",
  couche: "hygiene",
  lingette: "hygiene",

  // 🏠 Maison
  eponge: "maison",
  "sac poubelle": "maison",
  "sacs poubelle": "maison",
  lessive: "maison",
  "produit menager": "maison",
  "produits menagers": "maison",
  javel: "maison",
  "eau de javel": "maison",
  "liquide vaisselle": "maison",
  "produit vaisselle": "maison",
  sopalin: "maison",
  "essuie tout": "maison",
  "papier aluminium": "maison",
  aluminium: "maison",
  "film alimentaire": "maison",
  "film etirable": "maison",
  "papier cuisson": "maison",
  bougie: "maison",
  allumette: "maison",
  briquet: "maison",
  ampoule: "maison",
  pile: "maison",
  scotch: "maison",
  "sac congelation": "maison",
  "sacs congelation": "maison",
  serpillere: "maison",
  balai: "maison",
  desodorisant: "maison",
  "creme a recurer": "maison",
  "vinaigre blanc": "maison",
};

// Mots qui indiquent une note / précision (pas un article en soi)
const NOTE_KEYWORDS = [
  "bio",
  "sans gluten",
  "vegan",
  "vegetal",
  "allege",
  "light",
  "zero",
  "sans sucre",
  "sans sel",
  "demi sel",
  "extra",
  "fermier",
  "premier prix",
  "marque repere",
  "de saison",
  "frais",
  "fraiche",
  "entier",
  "ecreme",
  "demi ecreme",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Retire les accents et met en minuscules */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[']/g, "'")
    .trim();
}

/** Première lettre en majuscule */
function capitalize(str: string): string {
  const trimmed = str.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/** Sépare le texte de l'utilisateur en "morceaux" (un par article potentiel) */
function splitInput(raw: string): string[] {
  return raw
    .split(/[,\n]+|(?:\bet\b)/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Essaie d'extraire une quantité au début du segment : "3 baguettes" → { qty: 3, rest: "baguettes" } */
function extractQuantity(segment: string): { qty: number; rest: string } {
  // "3 baguettes", "3x baguettes", "x3 baguettes", "une baguette", "deux tomates"
  const numericMatch = segment.match(
    /^(\d+)\s*(?:x\s*)?(.+)$/i
  );
  if (numericMatch) {
    return { qty: parseInt(numericMatch[1], 10), rest: numericMatch[2].trim() };
  }

  const numericSuffix = segment.match(/^(.+?)\s*x\s*(\d+)$/i);
  if (numericSuffix) {
    return {
      qty: parseInt(numericSuffix[2], 10),
      rest: numericSuffix[1].trim(),
    };
  }

  // Mots-nombre français
  const wordNumbers: Record<string, number> = {
    un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5,
    six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
    douze: 12, quinze: 15, vingt: 20,
  };
  const wordMatch = segment.match(
    /^(un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|douze|quinze|vingt)\s+(.+)$/i
  );
  if (wordMatch) {
    return {
      qty: wordNumbers[wordMatch[1].toLowerCase()] ?? 1,
      rest: wordMatch[2].trim(),
    };
  }

  return { qty: 1, rest: segment };
}

/** Extrait les notes (bio, sans gluten, etc.) et retourne le texte nettoyé + la note */
function extractNotes(text: string): { cleaned: string; note: string } {
  const normalizedText = normalize(text);
  const foundNotes: string[] = [];

  for (const kw of NOTE_KEYWORDS) {
    if (normalizedText.includes(normalize(kw))) {
      foundNotes.push(kw);
    }
  }

  // Retire les mots-note du texte d'origine (version normalisée pour la comparaison)
  let cleaned = normalizedText;
  for (const kw of foundNotes) {
    cleaned = cleaned.replace(normalize(kw), "").trim();
  }

  return { cleaned, note: foundNotes.join(", ") };
}

/** Cherche la catégorie d'un texte nettoyé dans le dictionnaire */
function findCategory(cleaned: string): CategoryId {
  const norm = normalize(cleaned);

  // 1. Match exact (expressions complètes) — on trie par longueur décroissante
  //    pour matcher "pomme de terre" avant "pomme"
  const sortedKeys = Object.keys(DICTIONARY).sort(
    (a, b) => b.length - a.length
  );

  for (const key of sortedKeys) {
    if (norm === key || norm === key + "s" || norm === key + "x") {
      return DICTIONARY[key];
    }
  }

  // 2. Match partiel : le texte contient une clé connue
  for (const key of sortedKeys) {
    // Boundary match pour éviter les faux positifs
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?:^|\\s)${escaped}(?:s|x)?(?:\\s|$)`);
    if (re.test(norm)) {
      return DICTIONARY[key];
    }
  }

  // 3. Chaque mot individuellement
  const words = norm.split(/\s+/);
  for (const word of words) {
    const bare = word.replace(/s$/, "");
    if (DICTIONARY[bare]) return DICTIONARY[bare];
    if (DICTIONARY[word]) return DICTIONARY[word];
  }

  return "autre";
}

// Nettoyage des "du", "de la", "des", "le", "la", "les", "l'", "d'", "il me faut", "j'ai besoin de"
function stripFillers(text: string): string {
  return text
    .replace(
      /^(il me faut|j'ai besoin de?|je veux|je voudrais|il faut|on a besoin de?|acheter|prendre|racheter)\s+/i,
      ""
    )
    .replace(/\b(du|de la|de l'|des|le|la|les|l'|d'|de|un peu de|quelques)\b/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// API publique
// ---------------------------------------------------------------------------

export function parseLocal(input: string): NewItemInput[] {
  const segments = splitInput(input);
  const items: NewItemInput[] = [];

  for (const raw of segments) {
    // Retire les fillers ("du", "de la"…)
    const stripped = stripFillers(raw);
    if (!stripped) continue;

    // Quantité
    const { qty, rest } = extractQuantity(stripped);

    // Notes (bio, etc.)
    const { cleaned, note } = extractNotes(rest);
    if (!cleaned) continue;

    // Catégorie
    const category = findCategory(cleaned);

    // Titre = texte nettoyé avec majuscule (on garde la version sans fillers mais avec les mots-note retirés)
    // On reprend "rest" pour le titre lisible (avant nettoyage des notes)
    const title = capitalize(rest.replace(/\s+/g, " ").trim());

    items.push({ title, category, quantity: qty, note });
  }

  return items;
}
