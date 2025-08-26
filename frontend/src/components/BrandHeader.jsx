import React from "react";
import DarkModeToggle from "./DarkModeToggle";

/* Üst başlık + marka alanı
   Top header + brand area */
export default function BrandHeader() {
  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-[#0f1623]/70 border-b border-gray-100 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-brand-500" />
          <h1 className="text-lg sm:text-xl font-semibold">
            Plant Disease Early Warning
          </h1>
        </div>
        <DarkModeToggle />
      </div>
    </header>
  );
}
