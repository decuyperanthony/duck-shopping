"use client";

import { useState, useEffect, useCallback } from "react";
import type { ShoppingItemLocal, NewItemInput } from "./types";
import * as db from "./indexeddb";
import { startAutoSync, pullFromServer } from "./sync";
import type { CategoryId } from "./categories";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItemLocal[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const allItems = await db.getAllItems();
    setItems(allItems);
  }, []);

  useEffect(() => {
    const init = async () => {
      await refresh();
      setLoading(false);
      // Pull server data then refresh to merge remote items
      await pullFromServer();
      await refresh();
    };
    init();
    const stopSync = startAutoSync();
    return () => stopSync();
  }, [refresh]);

  const addItem = useCallback(
    async (input: NewItemInput) => {
      await db.addItem(input);
      await refresh();
    },
    [refresh]
  );

  const toggleItem = useCallback(
    async (id: string) => {
      await db.toggleItem(id);
      await refresh();
    },
    [refresh]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      await db.deleteItem(id);
      await refresh();
    },
    [refresh]
  );

  const updateItem = useCallback(
    async (
      id: string,
      updates: Partial<Pick<ShoppingItemLocal, "title" | "category" | "quantity" | "note">>
    ) => {
      await db.updateItem(id, updates);
      await refresh();
    },
    [refresh]
  );

  const clearCompleted = useCallback(async () => {
    await db.clearCompleted();
    await refresh();
  }, [refresh]);

  const clearAll = useCallback(async () => {
    await db.clearAll();
    await refresh();
  }, [refresh]);

  const totalCount = items.length;
  const completedCount = items.filter((i) => i.completed).length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const groupedByCategory = items.reduce(
    (acc, item) => {
      const cat = item.category as CategoryId;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<CategoryId, ShoppingItemLocal[]>
  );

  return {
    items,
    loading,
    addItem,
    toggleItem,
    deleteItem,
    updateItem,
    clearCompleted,
    clearAll,
    totalCount,
    completedCount,
    progress,
    groupedByCategory,
    refresh,
  };
}
