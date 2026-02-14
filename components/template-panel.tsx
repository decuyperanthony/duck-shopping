"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { ListTemplate, TemplateItem, NewItemInput, ShoppingItemLocal } from "@/lib/types";
import { getCategoryById } from "@/lib/categories";

interface TemplatePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: ListTemplate[];
  currentItems: ShoppingItemLocal[];
  onLoadTemplate: (items: NewItemInput[]) => void;
  onSaveTemplate: (name: string, items: TemplateItem[]) => void;
  onDeleteTemplate: (id: string) => void;
}

export function TemplatePanel({
  open,
  onOpenChange,
  templates,
  currentItems,
  onLoadTemplate,
  onSaveTemplate,
  onDeleteTemplate,
}: TemplatePanelProps) {
  const [view, setView] = useState<"list" | "save">("list");
  const [templateName, setTemplateName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const hasItems = currentItems.length > 0;

  function handleSave() {
    if (!templateName.trim()) return;
    const items: TemplateItem[] = currentItems.map((item) => ({
      title: item.title,
      category: item.category,
      quantity: item.quantity,
      note: item.note,
    }));
    onSaveTemplate(templateName.trim(), items);
    setTemplateName("");
    setView("list");
  }

  function handleLoad(template: ListTemplate) {
    const items: NewItemInput[] = template.items.map((item) => ({
      title: item.title,
      category: item.category,
      quantity: item.quantity,
      note: item.note,
    }));
    onLoadTemplate(items);
    onOpenChange(false);
  }

  function handleDelete(id: string) {
    if (confirmDeleteId === id) {
      onDeleteTemplate(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setView("list");
      setTemplateName("");
      setConfirmDeleteId(null);
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--card)] rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:rounded-2xl">
          <Dialog.Title className="text-lg font-semibold text-[var(--foreground)] mb-4">
            {view === "save" ? "Sauvegarder comme modèle" : "Mes modèles"}
          </Dialog.Title>

          {view === "list" && (
            <div className="space-y-3">
              {/* Save current list as template */}
              {hasItems && (
                <button
                  onClick={() => setView("save")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span className="text-sm font-medium">
                    Sauvegarder la liste actuelle ({currentItems.length} article{currentItems.length > 1 ? "s" : ""})
                  </span>
                </button>
              )}

              {/* Template list */}
              {templates.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-sm text-[var(--muted)]">
                    Aucun modèle sauvegardé
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {hasItems
                      ? "Sauvegardez votre liste actuelle pour la réutiliser !"
                      : "Ajoutez des articles puis sauvegardez comme modèle"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onLoad={() => handleLoad(template)}
                      onDelete={() => handleDelete(template.id)}
                      isConfirmingDelete={confirmDeleteId === template.id}
                    />
                  ))}
                </div>
              )}

              {/* Close */}
              <div className="pt-2">
                <Dialog.Close asChild>
                  <button className="w-full py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors text-sm">
                    Fermer
                  </button>
                </Dialog.Close>
              </div>
            </div>
          )}

          {view === "save" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">
                  Nom du modèle
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="ex: Semaine avec les enfants"
                  autoFocus
                  className="w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                />
              </div>

              {/* Preview of items that will be saved */}
              <div>
                <p className="text-xs text-[var(--muted)] mb-2">
                  {currentItems.length} article{currentItems.length > 1 ? "s" : ""} seront sauvegardés :
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {currentItems.map((item) => {
                    const cat = getCategoryById(item.category);
                    return (
                      <div key={item.id} className="flex items-center gap-2 text-xs text-[var(--foreground)] py-0.5">
                        <span>{cat.emoji}</span>
                        <span>{item.title}</span>
                        {item.quantity > 1 && (
                          <span className="text-[var(--muted)]">x{item.quantity}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setView("list"); setTemplateName(""); }}
                  className="flex-1 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors text-sm"
                >
                  Retour
                </button>
                <button
                  onClick={handleSave}
                  disabled={!templateName.trim()}
                  className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function TemplateCard({
  template,
  onLoad,
  onDelete,
  isConfirmingDelete,
}: {
  template: ListTemplate;
  onLoad: () => void;
  onDelete: () => void;
  isConfirmingDelete: boolean;
}) {
  // Group items by category for a compact preview
  const categoryPreviews = template.items.reduce(
    (acc, item) => {
      const cat = getCategoryById(item.category);
      if (!acc[cat.emoji]) acc[cat.emoji] = 0;
      acc[cat.emoji]++;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[var(--foreground)] truncate">
            {template.name}
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {template.items.length} article{template.items.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Category emoji summary */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {Object.entries(categoryPreviews).map(([emoji, count]) => (
          <span key={emoji} className="text-xs bg-[var(--card)] px-1.5 py-0.5 rounded">
            {emoji} {count}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onLoad}
          className="flex-1 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Charger
        </button>
        <button
          onClick={onDelete}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
            isConfirmingDelete
              ? "border-red-500 text-red-400 bg-red-500/10"
              : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--danger)] hover:text-[var(--danger)]"
          }`}
        >
          {isConfirmingDelete ? "Confirmer" : "Suppr."}
        </button>
      </div>
    </div>
  );
}
