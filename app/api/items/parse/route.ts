import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY non configurée" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt manquant" },
      { status: 400 }
    );
  }

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const items = JSON.parse(text);

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Réponse invalide de Claude" },
        { status: 500 }
      );
    }

    return NextResponse.json({ items });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur lors de l'analyse : ${errorMessage}` },
      { status: 500 }
    );
  }
}
