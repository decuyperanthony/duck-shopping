"use client";

interface ProgressBarProps {
  completed: number;
  total: number;
  progress: number;
  onUncheckAll?: () => void;
}

export function ProgressBar({ completed, total, progress, onUncheckAll }: ProgressBarProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-[var(--muted)]">
          {completed}/{total} articles
        </span>
        <div className="flex items-center gap-2">
          {completed > 0 && onUncheckAll && (
            <button
              onClick={onUncheckAll}
              className="text-xs px-2 py-1 rounded-md text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-colors"
              title="Tout décocher"
            >
              Tout décocher
            </button>
          )}
          <span className="font-medium text-[var(--accent)]">{progress}%</span>
        </div>
      </div>
      <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
