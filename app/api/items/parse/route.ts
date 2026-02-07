import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const SYSTEM_PROMPT = `Tu es un assistant qui extrait des articles de courses à partir d'un message en langage naturel.

Catégories disponibles (utilise EXACTEMENT ces ids) :
- "boulangerie" : pain, baguette, croissants, brioche, viennoiseries
- "boucherie" : viande, poulet, boeuf, porc, agneau, steak, saucisses
- "poissonnerie" : poisson, saumon, crevettes, thon, fruits de mer
- "primeur" : fruits, légumes, pommes, bananes, tomates, salade, carottes
- "fromagerie" : fromage, camembert, gruyère, mozzarella, beurre, crème
- "epicerie" : pâtes, riz, farine, sucre, huile, conserves, épices, céréales
- "supermarche" : produits généraux, chips, gâteaux, sauces, plats préparés
- "surgeles" : surgelés, pizzas surgelées, glaces, légumes surgelés
- "boissons" : eau, jus, soda, bière, vin, café, thé, lait
- "hygiene" : savon, shampoing, dentifrice, papier toilette, mouchoirs
- "maison" : éponges, sacs poubelle, lessive, produits ménagers
- "autre" : tout ce qui ne rentre pas dans les autres catégories

Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans explication. Le format est :
[{"title": "Nom de l'article", "category": "id_categorie", "quantity": 1, "note": ""}]

Règles :
- Mets une majuscule au début du titre
- Si une quantité est mentionnée (ex: "3 baguettes"), utilise-la
- Si une précision est donnée (ex: "bio", "marque X"), mets-la dans note
- Choisis la catégorie la plus pertinente
- Le café et le thé vont dans "boissons"
- Le lait va dans "boissons"
- Le beurre et la crème vont dans "fromagerie"`;

type Provider = "anthropic" | "openai";

interface ProviderConfig {
  provider: Provider;
  apiKey: string;
}

function getAvailableProviders(): ProviderConfig[] {
  const explicit = process.env.AI_PROVIDER as Provider | undefined;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const providers: ProviderConfig[] = [];

  if (explicit === "openai") {
    if (openaiKey) providers.push({ provider: "openai", apiKey: openaiKey });
    if (anthropicKey) providers.push({ provider: "anthropic", apiKey: anthropicKey });
  } else if (explicit === "anthropic") {
    if (anthropicKey) providers.push({ provider: "anthropic", apiKey: anthropicKey });
    if (openaiKey) providers.push({ provider: "openai", apiKey: openaiKey });
  } else {
    // Auto-detect: add all available, anthropic first
    if (anthropicKey) providers.push({ provider: "anthropic", apiKey: anthropicKey });
    if (openaiKey) providers.push({ provider: "openai", apiKey: openaiKey });
  }

  return providers;
}

async function parseWithAnthropic(
  apiKey: string,
  prompt: string
): Promise<string> {
  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

async function parseWithOpenAI(
  apiKey: string,
  prompt: string
): Promise<string> {
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1024,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

async function parseWithProvider(
  config: ProviderConfig,
  prompt: string
): Promise<string> {
  return config.provider === "anthropic"
    ? parseWithAnthropic(config.apiKey, prompt)
    : parseWithOpenAI(config.apiKey, prompt);
}

function isCreditsError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const creditPatterns = [
    "credit balance is too low",
    "insufficient_quota",
    "exceeded your current quota",
    "rate_limit_exceeded",
  ];
  return creditPatterns.some((p) => msg.toLowerCase().includes(p.toLowerCase()));
}

function getUserFriendlyError(err: unknown, provider: Provider, triedFallback: boolean): string {
  if (isCreditsError(err)) {
    const providerName = provider === "anthropic" ? "Anthropic" : "OpenAI";
    const base = `Crédits ${providerName} insuffisants.`;

    if (triedFallback) {
      return `${base} Les deux providers (Anthropic et OpenAI) sont à court de crédits. Rechargez vos crédits sur console.anthropic.com ou platform.openai.com.`;
    }

    if (provider === "anthropic") {
      return `${base} Rechargez vos crédits sur console.anthropic.com, ou configurez une clé OpenAI (OPENAI_API_KEY) comme alternative.`;
    }
    return `${base} Rechargez vos crédits sur platform.openai.com, ou configurez une clé Anthropic (ANTHROPIC_API_KEY) comme alternative.`;
  }

  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes("401") || msg.includes("authentication") || msg.includes("invalid.*key")) {
    return `Clé API ${provider === "anthropic" ? "Anthropic" : "OpenAI"} invalide. Vérifiez votre clé dans les variables d'environnement.`;
  }

  if (msg.includes("timeout") || msg.includes("ECONNREFUSED") || msg.includes("fetch failed")) {
    return "Impossible de joindre le service IA. Vérifiez votre connexion internet.";
  }

  return `Erreur du service IA : ${msg}`;
}

export async function POST(request: Request) {
  const providers = getAvailableProviders();
  if (providers.length === 0) {
    return NextResponse.json(
      {
        error:
          "Aucune clé API configurée. Ajoutez ANTHROPIC_API_KEY ou OPENAI_API_KEY dans vos variables d'environnement.",
        errorCode: "NO_API_KEY",
      },
      { status: 500 }
    );
  }

  const body = await request.json();
  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt manquant" }, { status: 400 });
  }

  let lastError: unknown;
  let lastProvider: ProviderConfig = providers[0];
  let triedFallback = false;

  for (let i = 0; i < providers.length; i++) {
    const config = providers[i];
    lastProvider = config;
    triedFallback = i > 0;

    try {
      const text = await parseWithProvider(config, prompt);
      const items = JSON.parse(text);

      if (!Array.isArray(items)) {
        return NextResponse.json(
          { error: "Réponse invalide du service IA" },
          { status: 500 }
        );
      }

      return NextResponse.json({ items });
    } catch (err) {
      lastError = err;

      // Only fallback to next provider on credit/billing errors
      if (isCreditsError(err) && i < providers.length - 1) {
        continue;
      }

      break;
    }
  }

  const userMessage = getUserFriendlyError(lastError, lastProvider.provider, triedFallback);
  const status = isCreditsError(lastError) ? 402 : 500;

  return NextResponse.json(
    {
      error: userMessage,
      errorCode: isCreditsError(lastError) ? "INSUFFICIENT_CREDITS" : "API_ERROR",
    },
    { status }
  );
}
