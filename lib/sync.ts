"use client";

import { getUnsyncedItems, markSynced, getAllItems } from "./indexeddb";

let syncInProgress = false;

export async function syncToServer(): Promise<boolean> {
  if (syncInProgress) return false;
  if (!navigator.onLine) return false;

  syncInProgress = true;
  try {
    const unsynced = await getUnsyncedItems();
    if (unsynced.length === 0) return true;

    const response = await fetch("/api/items/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: unsynced }),
    });

    if (!response.ok) return false;

    const result = await response.json();
    if (result.synced) {
      for (const item of result.synced) {
        await markSynced(item.localId, item.serverId);
      }
    }
    return true;
  } catch {
    return false;
  } finally {
    syncInProgress = false;
  }
}

export function startAutoSync(intervalMs = 30000): () => void {
  const interval = setInterval(() => {
    syncToServer();
  }, intervalMs);

  const handleOnline = () => {
    syncToServer();
  };
  window.addEventListener("online", handleOnline);

  return () => {
    clearInterval(interval);
    window.removeEventListener("online", handleOnline);
  };
}

export async function exportItemsAsJSON(): Promise<string> {
  const items = await getAllItems();
  const exportData = items.map(({ id, title, category, completed, quantity, note, createdAt }) => ({
    id,
    title,
    category,
    completed,
    quantity,
    note,
    createdAt,
  }));
  return JSON.stringify(exportData, null, 2);
}
