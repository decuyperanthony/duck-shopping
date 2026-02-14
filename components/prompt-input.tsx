"use client";

import { useState, useRef, useEffect } from "react";
import type { NewItemInput } from "@/lib/types";

type ParseMode = "local" | "ai";

const STORAGE_KEY = "duck-parse-mode";

interface PromptInputProps {
  onItemsParsed: (items: NewItemInput[]) => void;
}

export function PromptInput({ onItemsParsed }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [mode, setMode] = useState<ParseMode>("local");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persister le choix du mode
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ParseMode | null;
    if (saved === "local" || saved === "ai") setMode(saved);
  }, []);

  function toggleMode() {
    const next: ParseMode = mode === "local" ? "ai" : "local";
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    setError("");
    setErrorCode("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setErrorCode("");

    const endpoint =
      mode === "local" ? "/api/items/parse-local" : "/api/items/parse";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'analyse");
        setErrorCode(data.errorCode || "");
        return;
      }

      onItemsParsed(data.items);
      setPrompt("");
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3">
      <div className="flex items-center justify-end mb-1.5">
        <button
          type="button"
          onClick={toggleMode}
          className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full transition-colors border"
          style={{
            borderColor: mode === "ai" ? "var(--accent)" : "var(--border)",
            color: mode === "ai" ? "var(--accent)" : "var(--muted)",
            background: mode === "ai" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
          }}
        >
          {mode === "ai" ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 0 4 2 2 0 0 0-2 2v1a2 2 0 0 1-2 2v1a4 4 0 0 1-8 0v-1a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2 2 2 0 0 1 0-4 2 2 0 0 0 2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z"/>
              </svg>
              Mode IA
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              Mode local
            </>
          )}
        </button>
      </div>
      <div className="relative flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={
            mode === "local"
              ? "pain, 3 baguettes, lait bio, PQ"
              : "il me faut du pain, du lait et café"
          }
          rows={1}
          disabled={loading}
          className="flex-1 px-3 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none text-sm leading-relaxed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--accent)] text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
          aria-label="Envoyer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <div className={`mt-2 rounded-lg px-3 py-2 text-xs ${
          errorCode === "INSUFFICIENT_CREDITS"
            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
            : errorCode === "NO_API_KEY"
              ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
        }`}>
          {error}
        </div>
      )}
    </form>
  );
}
