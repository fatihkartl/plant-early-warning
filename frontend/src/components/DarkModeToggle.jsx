import React, { useEffect, useState } from "react";

/* Basit karanlık mod anahtarı
   Simple dark mode toggle */
export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Kullanıcı tercihini body’e uygula
    // Apply user preference to body
    const root = document.documentElement;
    if (enabled) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [enabled]);

  return (
    <button
      onClick={() => setEnabled(v => !v)}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition"
      aria-label="Toggle dark mode"
    >
      <span className="hidden sm:inline">{enabled ? "Dark" : "Light"}</span>
      <div className={`h-5 w-10 rounded-full ${enabled ? 'bg-brand-500' : 'bg-gray-300'} relative transition`}>
        <div className={`h-5 w-5 bg-white rounded-full shadow absolute top-0 ${enabled ? 'right-0' : 'left-0'} transition`}/>
      </div>
    </button>
  );
}
