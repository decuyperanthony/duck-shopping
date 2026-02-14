import { NextResponse } from "next/server";
import { parseLocal } from "@/lib/local-parser";

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = body.prompt?.trim();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt manquant" }, { status: 400 });
  }

  const items = parseLocal(prompt);

  if (items.length === 0) {
    return NextResponse.json(
      { error: "Aucun article reconnu. Essayez avec des noms d'articles séparés par des virgules." },
      { status: 400 }
    );
  }

  return NextResponse.json({ items });
}
