import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { shoppingItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    const items = await db.select().from(shoppingItems);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const [item] = await db
      .insert(shoppingItems)
      .values({
        title: body.title,
        category: body.category,
        quantity: body.quantity ?? 1,
        note: body.note ?? null,
      })
      .returning();
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, ...updates } = body;
    updates.updatedAt = new Date();
    const [item] = await db
      .update(shoppingItems)
      .set(updates)
      .where(eq(shoppingItems.id, id))
      .returning();
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db
      .delete(shoppingItems)
      .where(eq(shoppingItems.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }
}
