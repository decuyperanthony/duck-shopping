"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavBarProps {
  onAddClick: () => void;
}

export function NavBar({ onAddClick }: NavBarProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] z-30 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 relative">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 px-4 py-1 ${
            pathname === "/"
              ? "text-[var(--accent)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          } transition-colors`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
          </svg>
          <span className="text-[10px] font-medium">Liste</span>
        </Link>

        <button
          onClick={onAddClick}
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-lg hover:opacity-90 active:scale-95 transition-all"
          aria-label="Ajouter un article"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <Link
          href="/settings"
          className={`flex flex-col items-center gap-0.5 px-4 py-1 ${
            pathname === "/settings"
              ? "text-[var(--accent)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          } transition-colors`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          <span className="text-[10px] font-medium">Réglages</span>
        </Link>
      </div>
    </nav>
  );
}
