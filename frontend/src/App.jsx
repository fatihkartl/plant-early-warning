import ImageUploader from "./components/ImageUploader";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-8 text-center drop-shadow">
          Bitki Hastalık Erken Uyarı Sistemi
        </h1>
        <ImageUploader />
      </div>
    </div>
  );
}

export default App;
