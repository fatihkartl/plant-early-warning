import React, { useState, useRef, useCallback } from "react";

/* Modern drag&drop image uploader
   - Kart, yumuşak gölge, pastel brand renkleri
   - Drag over highlight
   - Clear (Remove) butonu
*/
export default function ImageUploader({ onImageSelected }) {
  const [file, setFile] = useState(null);           // Seçilen dosya / Selected file
  const [preview, setPreview] = useState(null);     // Önizleme URL / Preview URL
  const [dragOver, setDragOver] = useState(false);  // Drag highlight state
  const inputRef = useRef(null);

  // Dosya set et / Set file
  const setFileAndPreview = useCallback((f) => {
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    onImageSelected && onImageSelected(f); // üst bileşene ilet / bubble to parent
  }, [onImageSelected]);

  // Input change
  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFileAndPreview(f);
  };

  // Drag events
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) setFileAndPreview(f);
  };

  // Temizle / Clear
  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "rounded-2xl p-6 sm:p-8 cursor-pointer transition shadow-soft border",
          "bg-[var(--bg-app)]",
          "border-gray-100 hover:shadow-xl dark:border-white/10",
          dragOver ? "ring-4 ring-brand-300" : "ring-0"
        ].join(" ")}
        aria-label="Upload image"
      >
        {/* İç alan / inner area */}
        <div className="flex flex-col items-center gap-5">
          {/* Önizleme yoksa ikon, varsa görsel */}
          {!preview ? (
            <div className="h-24 w-24 rounded-2xl bg-brand-100 flex items-center justify-center">
              {/* Plus icon */}
              <svg width="40" height="40" viewBox="0 0 24 24" className="text-brand-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </div>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-72 object-contain rounded-xl border border-gray-100 dark:border-white/10"
            />
          )}

          {/* Başlık & alt metin / title & helper */}
          <div className="text-center">
            <h2 className="text-xl font-semibold">Upload Plant Image</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Drag & drop or click to select (PNG/JPG)
            </p>
          </div>

          {/* Input hidden */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          {/* Dosya adı + remove */}
          {file && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-sm">
                {file.name}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* İpucu / small helper */}
      <p className="text-center text-xs text-gray-400 mt-3">
        High quality, well-lit leaf close-ups improve detection accuracy.
      </p>
    </div>
  );
}
