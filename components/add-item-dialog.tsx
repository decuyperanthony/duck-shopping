"use client";

import { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import type { NewItemInput, ShoppingItemLocal } from "@/lib/types";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (input: NewItemInput) => void;
  editItem?: ShoppingItemLocal | null;
  onUpdate?: (
    id: string,
    updates: Partial<Pick<ShoppingItemLocal, "title" | "category" | "quantity" | "note">>
  ) => void;
}

export function AddItemDialog({
  open,
  onOpenChange,
  onAdd,
  editItem,
  onUpdate,
}: AddItemDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryId>("supermarche");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editItem;

  useEffect(() => {
    if (open && editItem) {
      setTitle(editItem.title);
      setCategory(editItem.category);
      setQuantity(editItem.quantity);
      setNote(editItem.note || "");
    } else if (open && !editItem) {
      setTitle("");
      setCategory("supermarche");
      setQuantity(1);
      setNote("");
    }
  }, [open, editItem]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && onUpdate) {
      onUpdate(editItem.id, {
        title: title.trim(),
        category,
        quantity,
        note: note.trim(),
      });
    } else {
      onAdd({ title: title.trim(), category, quantity, note: note.trim() });
    }

    setTitle("");
    setQuantity(1);
    setNote("");
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--card)] rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:rounded-2xl">
          <Dialog.Title className="text-lg font-semibold text-[var(--foreground)] mb-4">
            {isEditing ? "Modifier l\u2019article" : "Ajouter un article"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Article
              </label>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: Baguette, Lait, Pommes..."
                className="w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)] mb-2">
                Cat&eacute;gorie
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-center ${
                      category === cat.id
                        ? "border-[var(--accent)] bg-[var(--accent)]/10"
                        : "border-[var(--border)] hover:border-[var(--muted)]"
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="text-[10px] text-[var(--muted)] leading-tight">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-[var(--muted)] mb-1">
                  Quantit&eacute;
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-[var(--foreground)] font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Note (optionnel)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="ex: Bio, marque X..."
                className="w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors text-sm"
                >
                  Annuler
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {isEditing ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
