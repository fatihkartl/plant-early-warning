// src/App.jsx
import BrandHeader from "./components/BrandHeader";
import ImageUploader from "./components/ImageUploader";

/*
  TR: Uygulama düzeni:
      - Üstte şeffaf header (BrandHeader)
      - Ortada yumuşak gradient arka plan
      - Ana bölümde başlık + açıklama + ImageUploader
      - Altta küçük telif notu
      - Erişilebilirlik (ARIA) ve semantik iyileştirmeler eklendi
  EN: App layout:
      - Transparent header (BrandHeader)
      - Soft gradient background
      - Main section with title + description + ImageUploader
      - Footer with small copyright
      - Added accessibility (ARIA) and semantic improvements
*/
export default function App() {
  // TR: Dev ortamında API BASE bilgisini göstermek için environment okuması (opsiyonel)
  // EN: Read API BASE in dev to display small helper (optional)
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";

  return (
    <div className="min-h-screen bg-soft-gradient dark:bg-soft-gradient-dark">
      <BrandHeader />

      {/* TR: Ana içerik alanı / EN: Main content area */}
      <main className="max-w-6xl mx-auto px-4">
        {/* TR: Bilgi şeridi (sadece geliştirmede faydalı) / EN: Helper bar (useful in development) */}
        <div
          className="mt-4 mb-2 text-xs text-gray-500 dark:text-gray-400 text-center"
          role="note"
          aria-live="polite"
        >
          API Base: <span className="font-mono">{apiBase}</span>{" "}
          · Health: <a
            href={`${apiBase}/api/db/health`}
            className="underline hover:no-underline"
            target="_blank"
            rel="noreferrer"
          >
            /api/db/health
          </a>
        </div>

        <section
          className="pt-10 sm:pt-14 pb-16 sm:pb-20"
          aria-label="Plant Disease Prediction"
        >
          <header className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bitki Hastalık Erken Uyarı Sistemi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
              Yaprak fotoğrafını yükle, <span className="font-semibold">AI</span> tanısın; anında
              olası hastalık ve güven skorlarını görüntüle.
            </p>
          </header>

          {/* TR: Fotoğraf yükleme ve sonuç gösterimi / EN: Uploader and result display */}
          <ImageUploader />
        </section>
      </main>

      {/* TR: Alt bilgi / EN: Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Dost Tarım Teknolojileri
      </footer>
    </div>
  );
}
