"use client";

import { useState } from "react";
import type { ShoppingItemLocal } from "@/lib/types";
import { getCategoryById } from "@/lib/categories";
import { ItemRow } from "./item-row";

interface CategoryGroupProps {
  categoryId: string;
  items: ShoppingItemLocal[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CategoryGroup({
  categoryId,
  items,
  onToggle,
  onDelete,
}: CategoryGroupProps) {
  const [open, setOpen] = useState(true);
  const category = getCategoryById(categoryId);
  const completedCount = items.filter((i) => i.completed).length;
  const allCompleted = completedCount === items.length;

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--surface-hover)] transition-colors"
      >
        <span
          className={`transition-transform text-xs text-[var(--muted)] ${
            open ? "rotate-90" : ""
          }`}
        >
          &#9654;
        </span>
        <span className="text-base">{category.emoji}</span>
        <span
          className={`text-sm font-medium ${
            allCompleted ? "text-[var(--muted)]" : "text-[var(--foreground)]"
          }`}
        >
          {category.label}
        </span>
        <span className="text-xs text-[var(--muted)] ml-auto">
          {completedCount}/{items.length}
        </span>
      </button>
      {open && (
        <div className="border-l-2 border-[var(--border)] ml-6">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
