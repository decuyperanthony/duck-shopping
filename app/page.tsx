"use client";

import { useMemo, useState } from "react";
import { useShoppingList } from "@/lib/use-shopping-list";
import { useTemplates } from "@/lib/use-templates";
import { CATEGORIES } from "@/lib/categories";
import { ProgressBar } from "@/components/progress-bar";
import { CategoryGroup } from "@/components/category-group";
import { AddItemDialog } from "@/components/add-item-dialog";
import { TemplatePanel } from "@/components/template-panel";
import { NavBar } from "@/components/nav-bar";
import { EmptyState } from "@/components/empty-state";
import { OnlineStatus } from "@/components/online-status";
import type { ShoppingItemLocal, NewItemInput } from "@/lib/types";
import { PromptInput } from "@/components/prompt-input";
import { SearchBar } from "@/components/search-bar";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templatePanelOpen, setTemplatePanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItemLocal | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function toggleSearch() {
    setSearchOpen((prev) => {
      const next = !prev;
      if (!next) setSearchQuery("");
      return next;
    });
  }
  const {
    items,
    loading,
    addItem,
    toggleItem,
    deleteItem,
    updateItem,
    uncheckAll,
    totalCount,
    completedCount,
    progress,
    groupedByCategory,
  } = useShoppingList();
  const { templates, saveTemplate, deleteTemplate } = useTemplates();

  const handlePromptItems = async (items: Parameters<typeof addItem>[0][]) => {
    for (const item of items) {
      await addItem(item);
    }
  };

  const handleLoadTemplate = async (templateItems: NewItemInput[]) => {
    for (const item of templateItems) {
      await addItem(item);
    }
  };

  const filteredGrouped = useMemo(() => {
    if (!searchQuery) return groupedByCategory;
    const result: typeof groupedByCategory = {};
    for (const cat of CATEGORIES) {
      const list = groupedByCategory[cat.id];
      if (!list) continue;
      const matched = list.filter(
        (it) =>
          it.title.toLowerCase().includes(searchQuery) ||
          it.note.toLowerCase().includes(searchQuery)
      );
      if (matched.length) result[cat.id] = matched;
    }
    return result;
  }, [groupedByCategory, searchQuery]);

  const categoriesWithItems = CATEGORIES.filter(
    (cat) => filteredGrouped[cat.id]?.length > 0
  );

  const noSearchResults = searchQuery.length > 0 && categoriesWithItems.length === 0;

  function handleEdit(item: ShoppingItemLocal) {
    setEditingItem(item);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setEditingItem(null);
    }
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--foreground)]">
            Ma Liste de Courses
          </h1>
          <div className="flex items-center gap-1">
            {totalCount > 0 && (
              <button
                onClick={toggleSearch}
                className={`p-2 rounded-lg transition-colors ${
                  searchOpen
                    ? "text-[var(--accent)] bg-[var(--surface)]"
                    : "text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface)]"
                }`}
                aria-label="Rechercher"
                title="Rechercher"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setTemplatePanelOpen(true)}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-colors"
              aria-label="Mes modèles"
              title="Mes modèles"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                <path d="M9 10h6" />
                <path d="M9 14h4" />
              </svg>
            </button>
          </div>
        </div>
        {searchOpen && totalCount > 0 && (
          <div className="max-w-md mx-auto">
            <SearchBar onSearch={setSearchQuery} autoFocus />
          </div>
        )}
        <OnlineStatus />
        {totalCount > 0 && (
          <div className="max-w-md mx-auto">
            <ProgressBar
              completed={completedCount}
              total={totalCount}
              progress={progress}
              onUncheckAll={uncheckAll}
            />
          </div>
        )}
      </header>

      {/* AI Prompt */}
      <div className="max-w-md mx-auto">
        <PromptInput onItemsParsed={handlePromptItems} />
      </div>

      {/* Content */}
      <main className="max-w-md mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : totalCount === 0 ? (
          <EmptyState
            hasTemplates={templates.length > 0}
            onOpenTemplates={() => setTemplatePanelOpen(true)}
          />
        ) : noSearchResults ? (
          <div className="text-center py-12 px-4 text-sm text-[var(--muted)]">
            Aucun article ne correspond à ta recherche.
          </div>
        ) : (
          <div className="py-2">
            {categoriesWithItems.map((cat) => (
              <CategoryGroup
                key={cat.id}
                categoryId={cat.id}
                items={filteredGrouped[cat.id]}
                onToggle={toggleItem}
                onDelete={deleteItem}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <NavBar onAddClick={() => { setEditingItem(null); setDialogOpen(true); }} />

      {/* Add/Edit Item Dialog */}
      <AddItemDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onAdd={addItem}
        editItem={editingItem}
        onUpdate={updateItem}
      />

      {/* Template Panel */}
      <TemplatePanel
        open={templatePanelOpen}
        onOpenChange={setTemplatePanelOpen}
        templates={templates}
        currentItems={items}
        onLoadTemplate={handleLoadTemplate}
        onSaveTemplate={saveTemplate}
        onDeleteTemplate={deleteTemplate}
      />
    </div>
  );
}
