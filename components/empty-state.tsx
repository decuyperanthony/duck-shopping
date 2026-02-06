"use client";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
        Votre liste est vide
      </h2>
      <p className="text-sm text-[var(--muted)] max-w-xs">
        Appuyez sur le bouton <strong>+</strong> pour ajouter votre premier article
      </p>
    </div>
  );
}
