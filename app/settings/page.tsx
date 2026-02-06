"use client";

import { useState, useCallback } from "react";
import { NavBar } from "@/components/nav-bar";
import { AddItemDialog } from "@/components/add-item-dialog";
import { useShoppingList } from "@/lib/use-shopping-list";
import { exportItemsAsJSON } from "@/lib/sync";

export default function SettingsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "data">("general");
  const { clearCompleted, clearAll, addItem, totalCount, completedCount } =
    useShoppingList();
  const [confirmClear, setConfirmClear] = useState<"completed" | "all" | null>(
    null
  );

  const handleExport = useCallback(async () => {
    const json = await exportItemsAsJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `liste-courses-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleClearCompleted = useCallback(async () => {
    if (confirmClear === "completed") {
      await clearCompleted();
      setConfirmClear(null);
    } else {
      setConfirmClear("completed");
      setTimeout(() => setConfirmClear(null), 3000);
    }
  }, [confirmClear, clearCompleted]);

  const handleClearAll = useCallback(async () => {
    if (confirmClear === "all") {
      await clearAll();
      setConfirmClear(null);
    } else {
      setConfirmClear("all");
      setTimeout(() => setConfirmClear(null), 3000);
    }
  }, [confirmClear, clearAll]);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-20 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-[var(--foreground)]">
            Réglages
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-[var(--surface)] p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "general"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Général
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "data"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Données
          </button>
        </div>

        {activeTab === "general" && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
              <h3 className="text-sm font-medium text-[var(--muted)] mb-3">
                Statistiques
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-[var(--accent)]">
                    {totalCount}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Total articles</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {completedCount}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Achetés</p>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
              <h3 className="text-sm font-medium text-[var(--muted)] mb-2">
                À propos
              </h3>
              <p className="text-sm text-[var(--foreground)]">
                Ma Liste de Courses v1.0
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">
                PWA offline-first — vos données sont stockées localement et
                synchronisées quand vous êtes en ligne.
              </p>
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="space-y-4">
            {/* Export */}
            <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
              <h3 className="text-sm font-medium text-[var(--muted)] mb-2">
                Exporter
              </h3>
              <p className="text-xs text-[var(--muted)] mb-3">
                Téléchargez votre liste au format JSON.
              </p>
              <button
                onClick={handleExport}
                className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Exporter en JSON
              </button>
            </div>

            {/* Clear */}
            <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
              <h3 className="text-sm font-medium text-[var(--muted)] mb-3">
                Nettoyer
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleClearCompleted}
                  className={`w-full py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    confirmClear === "completed"
                      ? "border-amber-500 text-amber-400 bg-amber-500/10"
                      : "border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {confirmClear === "completed"
                    ? "Confirmer la suppression"
                    : "Supprimer les articles achetés"}
                </button>
                <button
                  onClick={handleClearAll}
                  className={`w-full py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    confirmClear === "all"
                      ? "border-red-500 text-red-400 bg-red-500/10"
                      : "border-[var(--danger)] text-[var(--danger)] hover:bg-red-500/10"
                  }`}
                >
                  {confirmClear === "all"
                    ? "Confirmer la suppression totale"
                    : "Supprimer toute la liste"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <NavBar onAddClick={() => setDialogOpen(true)} />
      <AddItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={addItem}
      />
    </div>
  );
}
