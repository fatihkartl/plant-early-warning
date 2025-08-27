// src/components/ImageUploader.jsx
import React, { useState, useRef, useCallback } from "react";
import { uploadImageForPrediction } from "../lib/api";
import PredictionCard from "./PredictionCard";

/* Modern drag&drop image uploader + backend integration
   TR: Yüklenen görseli backend'e gönderir, sonucu kartta gösterir.
   EN: Sends uploaded image to backend and displays the result in a card. */
export default function ImageUploader({ onImageSelected }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);        // TR: çağrı durumu / EN: request state
  const [error, setError] = useState(null);             // TR: hata mesajı / EN: error message
  const [result, setResult] = useState(null);           // TR: backend sonucu / EN: backend result
  const inputRef = useRef(null);

  const setFileAndPreview = useCallback((f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    onImageSelected && onImageSelected(f);
  }, [onImageSelected]);

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFileAndPreview(f);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) setFileAndPreview(f);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSend = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const json = await uploadImageForPrediction(file);
      setResult(json);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
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
        <div className="flex flex-col items-center gap-5">
          {!preview ? (
            <div className="h-24 w-24 rounded-2xl bg-brand-100 flex items-center justify-center">
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

          <div className="text-center">
            <h2 className="text-xl font-semibold">Upload Plant Image</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Drag & drop or click to select (PNG/JPG)
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition text-sm"
            >
              Choose Image
            </button>
            <button
              type="button"
              disabled={!file || loading}
              onClick={handleSend}
              className="px-4 py-2 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50 text-sm"
            >
              {loading ? "Predicting..." : "Send to Predict"}
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>

      <PredictionCard result={result} />
    </div>
  );
}
