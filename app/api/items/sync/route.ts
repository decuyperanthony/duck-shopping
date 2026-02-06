import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { shoppingItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const db = getDb();
    const { items } = await request.json();
    const synced: { localId: string; serverId: number }[] = [];

    for (const item of items) {
      if (item.deleted && item.serverId) {
        await db
          .delete(shoppingItems)
          .where(eq(shoppingItems.id, item.serverId));
        synced.push({ localId: item.id, serverId: item.serverId });
      } else if (item.serverId) {
        const [updated] = await db
          .update(shoppingItems)
          .set({
            title: item.title,
            category: item.category,
            completed: item.completed,
            quantity: item.quantity,
            note: item.note,
            updatedAt: new Date(),
          })
          .where(eq(shoppingItems.id, item.serverId))
          .returning();
        if (updated) {
          synced.push({ localId: item.id, serverId: updated.id });
        }
      } else if (!item.deleted) {
        const [created] = await db
          .insert(shoppingItems)
          .values({
            title: item.title,
            category: item.category,
            completed: item.completed,
            quantity: item.quantity,
            note: item.note,
          })
          .returning();
        synced.push({ localId: item.id, serverId: created.id });
      }
    }

    return NextResponse.json({ synced });
  } catch {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }
}
