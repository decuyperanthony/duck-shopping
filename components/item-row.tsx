"use client";

import type { ShoppingItemLocal } from "@/lib/types";

interface ItemRowProps {
  item: ShoppingItemLocal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ItemRow({ item, onToggle, onDelete }: ItemRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 group hover:bg-[var(--surface-hover)] transition-colors">
      <button
        onClick={() => onToggle(item.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          item.completed
            ? "bg-[var(--accent)] border-[var(--accent)]"
            : "border-[var(--border)] hover:border-[var(--accent)]"
        }`}
        aria-label={item.completed ? "Marquer non acheté" : "Marquer acheté"}
      >
        {item.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm transition-all ${
            item.completed
              ? "line-through text-[var(--muted)]"
              : "text-[var(--foreground)]"
          }`}
        >
          {item.title}
        </span>
        {item.quantity > 1 && (
          <span className="ml-2 text-xs text-[var(--muted)] bg-[var(--surface)] px-1.5 py-0.5 rounded">
            x{item.quantity}
          </span>
        )}
        {item.note && (
          <p className="text-xs text-[var(--muted)] truncate mt-0.5">
            {item.note}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[var(--muted)] hover:text-[var(--danger)]"
        aria-label="Supprimer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 4L12 12M4 12L12 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
