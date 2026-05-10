"use client";

import { useEffect, useRef, useState } from "react";
import type { ShoppingItemLocal } from "@/lib/types";
import { getCategoryById } from "@/lib/categories";
import { ItemRow } from "./item-row";

const STORAGE_KEY = "duck-collapsed-categories";

function getCollapsedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistCollapsed(id: string, collapsed: boolean) {
  try {
    const set = new Set(getCollapsedIds());
    if (collapsed) set.add(id);
    else set.delete(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {}
}

interface CategoryGroupProps {
  categoryId: string;
  items: ShoppingItemLocal[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ShoppingItemLocal) => void;
}

export function CategoryGroup({
  categoryId,
  items,
  onToggle,
  onDelete,
  onEdit,
}: CategoryGroupProps) {
  const [open, setOpen] = useState(true);
  const category = getCategoryById(categoryId);
  const completedCount = items.filter((i) => i.completed).length;
  const allCompleted = completedCount === items.length;

  const prevAllCompletedRef = useRef<boolean | null>(null);
  const prevItemCountRef = useRef<number>(items.length);

  useEffect(() => {
    if (getCollapsedIds().includes(categoryId)) setOpen(false);
  }, [categoryId]);

  useEffect(() => {
    if (
      items.length > 0 &&
      allCompleted &&
      prevAllCompletedRef.current === false
    ) {
      setOpen(false);
      persistCollapsed(categoryId, true);
    }
    prevAllCompletedRef.current = allCompleted;
  }, [allCompleted, items.length, categoryId]);

  useEffect(() => {
    if (items.length > prevItemCountRef.current) {
      setOpen(true);
      persistCollapsed(categoryId, false);
    }
    prevItemCountRef.current = items.length;
  }, [items.length, categoryId]);

  function toggleOpen() {
    setOpen((prev) => {
      const next = !prev;
      persistCollapsed(categoryId, !next);
      return next;
    });
  }

  const sortedItems = [...items].sort(
    (a, b) =>
      Number(a.completed) - Number(b.completed) ||
      a.title.localeCompare(b.title, "fr")
  );

  return (
    <div className="mb-2">
      <button
        onClick={toggleOpen}
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
          {sortedItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
