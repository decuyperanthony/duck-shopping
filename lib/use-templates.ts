"use client";

import { useState, useEffect, useCallback } from "react";
import type { ListTemplate, TemplateItem } from "./types";
import * as db from "./indexeddb";

export function useTemplates() {
  const [templates, setTemplates] = useState<ListTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await db.getAllTemplates();
    // Sort by most recently created first
    all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setTemplates(all);
  }, []);

  useEffect(() => {
    const init = async () => {
      await refresh();
      setLoading(false);
    };
    init();
  }, [refresh]);

  const saveTemplate = useCallback(
    async (name: string, items: TemplateItem[]) => {
      await db.saveTemplate(name, items);
      await refresh();
    },
    [refresh]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      await db.deleteTemplate(id);
      await refresh();
    },
    [refresh]
  );

  const renameTemplate = useCallback(
    async (id: string, name: string) => {
      await db.updateTemplateName(id, name);
      await refresh();
    },
    [refresh]
  );

  return {
    templates,
    loading,
    saveTemplate,
    deleteTemplate,
    renameTemplate,
    refresh,
  };
}
