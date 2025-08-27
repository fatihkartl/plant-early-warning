// src/lib/api.js
// TR: Backend API çağrıları için basit yardımcı fonksiyon.
// EN: Simple helper functions for backend API calls.

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

/**
 * TR: Görseli /api/predict'e yükler ve JSON cevap döner.
 * EN: Uploads an image to /api/predict and returns JSON response.
 */
export async function uploadImageForPrediction(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/predict`, {
    method: "POST",
    body: form,
  });

  // TR: Hata durumunu düzgün yönet
  // EN: Handle non-200 cleanly
  if (!res.ok) {
    let errDetail = "Request failed";
    try {
      const e = await res.json();
      errDetail = e.detail || JSON.stringify(e);
    } catch (_) {}
    throw new Error(`${res.status} ${res.statusText} - ${errDetail}`);
  }

  return res.json();
}
