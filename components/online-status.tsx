"use client";

import { useState, useEffect } from "react";

export function OnlineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="bg-amber-600/20 border border-amber-600/30 text-amber-400 text-xs text-center py-1.5 px-4">
      Mode hors-ligne — les modifications seront synchronisées automatiquement
    </div>
  );
}
