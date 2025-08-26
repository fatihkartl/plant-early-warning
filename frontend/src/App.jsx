import BrandHeader from "./components/BrandHeader";
import ImageUploader from "./components/ImageUploader";

/* Uygulama düzeni:
   - Üstte şeffaf header
   - Altta yumuşak gradient arka plan
   - Ortada modern kart uploader
*/
export default function App() {
  return (
    <div className="min-h-screen bg-soft-gradient dark:bg-soft-gradient-dark">
      <BrandHeader />

      <main className="max-w-6xl mx-auto px-4">
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bitki Hastalık Erken Uyarı Sistemi
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Yaprak fotoğrafını yükle, AI tanısın; önerileri al.
            </p>
          </div>
          <ImageUploader />
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Dost Tarım Teknolojileri
      </footer>
    </div>
  );
}
