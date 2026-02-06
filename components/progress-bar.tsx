"use client";

interface ProgressBarProps {
  completed: number;
  total: number;
  progress: number;
}

export function ProgressBar({ completed, total, progress }: ProgressBarProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-[var(--muted)]">
          {completed}/{total} articles
        </span>
        <span className="font-medium text-[var(--accent)]">{progress}%</span>
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
