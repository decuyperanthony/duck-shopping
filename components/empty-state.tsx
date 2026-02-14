"use client";

interface EmptyStateProps {
  hasTemplates?: boolean;
  onOpenTemplates?: () => void;
}

export function EmptyState({ hasTemplates, onOpenTemplates }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
        Votre liste est vide
      </h2>
      <p className="text-sm text-[var(--muted)] max-w-xs">
        Appuyez sur le bouton <strong>+</strong> pour ajouter votre premier article
      </p>
      {hasTemplates && onOpenTemplates && (
        <button
          onClick={onOpenTemplates}
          className="mt-4 px-4 py-2.5 rounded-lg border border-[var(--accent)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)]/10 transition-colors"
        >
          Charger un modèle
        </button>
      )}
    </div>
  );
}
