import React, { useState } from "react";

// Fotoğraf yükleme ve önizleme için temel bir bileşen
// Basic component for image upload and preview
function ImageUploader({ onImageSelected }) {
  // Seçilen dosya (file) bilgisini state'te tutuyoruz
  // Store selected file in state
  const [selectedFile, setSelectedFile] = useState(null);
  // Görsel önizleme url'si için state
  // State for preview URL
  const [previewUrl, setPreviewUrl] = useState(null);

  // Dosya seçilince tetiklenen fonksiyon
  // Function called when file is selected
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Ana bileşene dosya bilgisini gönder (isteğe bağlı)
      if (onImageSelected) onImageSelected(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-md">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100"
      />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Yüklenen fotoğraf önizlemesi"
          className="max-h-64 rounded-xl border-2 border-green-300 shadow"
        />
      )}
      {selectedFile && (
        <p className="text-sm text-green-700 font-medium">
          Yüklenecek dosya: {selectedFile.name}
        </p>
      )}
    </div>
  );
}

export default ImageUploader;
