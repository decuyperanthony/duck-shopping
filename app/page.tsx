"use client";

import { useState } from "react";
import { useShoppingList } from "@/lib/use-shopping-list";
import { CATEGORIES } from "@/lib/categories";
import { ProgressBar } from "@/components/progress-bar";
import { CategoryGroup } from "@/components/category-group";
import { AddItemDialog } from "@/components/add-item-dialog";
import { NavBar } from "@/components/nav-bar";
import { EmptyState } from "@/components/empty-state";
import { OnlineStatus } from "@/components/online-status";
import type { ShoppingItemLocal } from "@/lib/types";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItemLocal | null>(null);
  const {
    loading,
    addItem,
    toggleItem,
    deleteItem,
    updateItem,
    totalCount,
    completedCount,
    progress,
    groupedByCategory,
  } = useShoppingList();

  const categoriesWithItems = CATEGORIES.filter(
    (cat) => groupedByCategory[cat.id]?.length > 0
  );

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
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-[var(--foreground)]">
            Ma Liste de Courses
          </h1>
        </div>
        <OnlineStatus />
        {totalCount > 0 && (
          <div className="max-w-md mx-auto">
            <ProgressBar
              completed={completedCount}
              total={totalCount}
              progress={progress}
            />
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : totalCount === 0 ? (
          <EmptyState />
        ) : (
          <div className="py-2">
            {categoriesWithItems.map((cat) => (
              <CategoryGroup
                key={cat.id}
                categoryId={cat.id}
                items={groupedByCategory[cat.id]}
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
    </div>
  );
}
