import { openDB, type IDBPDatabase } from "idb";
import { v4 as uuidv4 } from "uuid";
import type { ShoppingItemLocal, NewItemInput, ServerItem, ListTemplate, TemplateItem } from "./types";
import { getCategoryById } from "./categories";

const DB_NAME = "duck-shopping";
const DB_VERSION = 2;
const STORE_NAME = "shopping_items";
const TEMPLATES_STORE = "templates";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("category", "category");
          store.createIndex("completed", "completed");
          store.createIndex("synced", "synced");
          store.createIndex("deleted", "deleted");
        }
        if (oldVersion < 2) {
          db.createObjectStore(TEMPLATES_STORE, { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllItems(): Promise<ShoppingItemLocal[]> {
  const db = await getDB();
  const items = await db.getAll(STORE_NAME);
  return items.filter((item) => !item.deleted) as ShoppingItemLocal[];
}

export async function addItem(input: NewItemInput): Promise<ShoppingItemLocal> {
  const db = await getDB();
  const now = new Date().toISOString();
  const item: ShoppingItemLocal = {
    id: uuidv4(),
    title: input.title,
    category: input.category,
    completed: false,
    quantity: input.quantity,
    note: input.note,
    createdAt: now,
    updatedAt: now,
    synced: false,
    deleted: false,
  };
  await db.put(STORE_NAME, item);
  return item;
}

export async function toggleItem(id: string): Promise<ShoppingItemLocal | null> {
  const db = await getDB();
  const item = (await db.get(STORE_NAME, id)) as ShoppingItemLocal | undefined;
  if (!item) return null;
  item.completed = !item.completed;
  item.updatedAt = new Date().toISOString();
  item.synced = false;
  await db.put(STORE_NAME, item);
  return item;
}

export async function updateItem(
  id: string,
  updates: Partial<Pick<ShoppingItemLocal, "title" | "category" | "quantity" | "note">>
): Promise<ShoppingItemLocal | null> {
  const db = await getDB();
  const item = (await db.get(STORE_NAME, id)) as ShoppingItemLocal | undefined;
  if (!item) return null;
  Object.assign(item, updates);
  item.updatedAt = new Date().toISOString();
  item.synced = false;
  await db.put(STORE_NAME, item);
  return item;
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDB();
  const item = (await db.get(STORE_NAME, id)) as ShoppingItemLocal | undefined;
  if (!item) return;
  if (item.serverId) {
    item.deleted = true;
    item.synced = false;
    item.updatedAt = new Date().toISOString();
    await db.put(STORE_NAME, item);
  } else {
    await db.delete(STORE_NAME, id);
  }
}

export async function clearCompleted(): Promise<void> {
  const db = await getDB();
  const items = (await db.getAll(STORE_NAME)) as ShoppingItemLocal[];
  const tx = db.transaction(STORE_NAME, "readwrite");
  for (const item of items) {
    if (item.completed) {
      if (item.serverId) {
        item.deleted = true;
        item.synced = false;
        item.updatedAt = new Date().toISOString();
        await tx.store.put(item);
      } else {
        await tx.store.delete(item.id);
      }
    }
  }
  await tx.done;
}

export async function clearAll(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

export async function getUnsyncedItems(): Promise<ShoppingItemLocal[]> {
  const db = await getDB();
  const items = (await db.getAll(STORE_NAME)) as ShoppingItemLocal[];
  return items.filter((item) => !item.synced);
}

export async function markSynced(id: string, serverId?: number): Promise<void> {
  const db = await getDB();
  const item = (await db.get(STORE_NAME, id)) as ShoppingItemLocal | undefined;
  if (!item) return;
  item.synced = true;
  if (serverId) item.serverId = serverId;
  await db.put(STORE_NAME, item);
}

// ─── Templates ───────────────────────────────────────────────

export async function getAllTemplates(): Promise<ListTemplate[]> {
  const db = await getDB();
  return (await db.getAll(TEMPLATES_STORE)) as ListTemplate[];
}

export async function saveTemplate(name: string, items: TemplateItem[]): Promise<ListTemplate> {
  const db = await getDB();
  const now = new Date().toISOString();
  const template: ListTemplate = {
    id: uuidv4(),
    name,
    items,
    createdAt: now,
    updatedAt: now,
  };
  await db.put(TEMPLATES_STORE, template);
  return template;
}

export async function deleteTemplate(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(TEMPLATES_STORE, id);
}

export async function updateTemplateName(id: string, name: string): Promise<void> {
  const db = await getDB();
  const template = (await db.get(TEMPLATES_STORE, id)) as ListTemplate | undefined;
  if (!template) return;
  template.name = name;
  template.updatedAt = new Date().toISOString();
  await db.put(TEMPLATES_STORE, template);
}

// ─── Server sync ─────────────────────────────────────────────

export async function upsertFromServer(serverItems: ServerItem[]): Promise<void> {
  const db = await getDB();
  const localItems = (await db.getAll(STORE_NAME)) as ShoppingItemLocal[];

  const serverIdSet = new Set(serverItems.map((si) => si.id));
  const localByServerId = new Map<number, ShoppingItemLocal>();

  for (const local of localItems) {
    if (local.serverId !== undefined) {
      localByServerId.set(local.serverId, local);
    }
  }

  const tx = db.transaction(STORE_NAME, "readwrite");

  for (const serverItem of serverItems) {
    const local = localByServerId.get(serverItem.id);

    if (!local) {
      // Not found locally → insert as new synced item
      const newItem: ShoppingItemLocal = {
        id: uuidv4(),
        serverId: serverItem.id,
        title: serverItem.title,
        category: getCategoryById(serverItem.category).id,
        completed: serverItem.completed,
        quantity: serverItem.quantity,
        note: serverItem.note ?? "",
        createdAt: serverItem.createdAt,
        updatedAt: serverItem.updatedAt,
        synced: true,
        deleted: false,
      };
      await tx.store.put(newItem);
    } else if (local.synced) {
      // Found locally and synced → update with server data
      const updated: ShoppingItemLocal = {
        ...local,
        title: serverItem.title,
        category: getCategoryById(serverItem.category).id,
        completed: serverItem.completed,
        quantity: serverItem.quantity,
        note: serverItem.note ?? "",
        updatedAt: serverItem.updatedAt,
      };
      await tx.store.put(updated);
    }
    // If found locally and NOT synced → skip (preserve pending local changes)
  }

  // Handle server-side deletions: local items with serverId not on server → remove
  for (const local of localItems) {
    if (local.serverId !== undefined && !serverIdSet.has(local.serverId) && !local.deleted) {
      await tx.store.delete(local.id);
    }
  }

  await tx.done;
}
