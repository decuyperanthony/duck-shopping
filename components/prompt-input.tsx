"use client";

import { useState, useRef } from "react";
import type { NewItemInput } from "@/lib/types";

interface PromptInputProps {
  onItemsParsed: (items: NewItemInput[]) => void;
}

export function PromptInput({ onItemsParsed }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError("");
    setErrorCode("");

    try {
      const res = await fetch("/api/items/parse", {
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
          placeholder="Ex: il me faut du pain, 3 bières et du café bio..."
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
