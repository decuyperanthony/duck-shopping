"use client";

import { useState, useEffect, useRef } from "react";
import type { ShoppingItemLocal } from "@/lib/types";

interface ItemRowProps {
  item: ShoppingItemLocal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ShoppingItemLocal) => void;
}

export function ItemRow({ item, onToggle, onDelete, onEdit }: ItemRowProps) {
  const [animating, setAnimating] = useState(false);
  const prevCompleted = useRef(item.completed);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (prevCompleted.current !== item.completed) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 500);
      prevCompleted.current = item.completed;
      return () => clearTimeout(timer);
    }
  }, [item.completed]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 group hover:bg-[var(--surface-hover)] transition-colors ${
        animating
          ? item.completed
            ? "animate-item-check"
            : "animate-item-uncheck"
          : ""
      }`}
    >
      <button
        onClick={() => onToggle(item.id)}
        className={`flex-shrink-0 w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all ${
          item.completed
            ? "bg-[var(--accent)] border-[var(--accent)]"
            : "border-[var(--border)] hover:border-[var(--accent)]"
        }`}
        aria-label={item.completed ? "Marquer non acheté" : "Marquer acheté"}
      >
        {item.completed && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8L6.5 11.5L13 4"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <button
        onClick={() => onToggle(item.id)}
        className="flex-1 min-w-0 text-left"
      >
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
      </button>
      <button
        onClick={() => onEdit(item)}
        className="flex-shrink-0 p-1 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        aria-label="Modifier"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 3.5L12.5 6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 p-1 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
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
