// src/components/PredictionCard.jsx
import React from "react";

/**
 * TR: Tahmin sonucunu gösteren basit kart bileşeni.
 * EN: Simple card component to display prediction result.
 */
export default function PredictionCard({ result }) {
  if (!result) return null;

  const { filename, predictions = [], mock_mode, created_at, _id } = result;

  return (
    <div className="mt-6 w-full max-w-xl mx-auto rounded-2xl border border-gray-100 dark:border-white/10 bg-white/80 dark:bg-[#0f1623]/80 shadow-soft p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Prediction Result</h3>
        {mock_mode && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            Mock Mode
          </span>
        )}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <div className="truncate">File: <span className="font-medium">{filename}</span></div>
        {_id && <div className="truncate">Record ID: <span className="font-mono">{_id}</span></div>}
        {created_at && <div>Created: <span className="font-mono">{created_at}</span></div>}
      </div>

      <div className="mt-4 space-y-2">
        {predictions.slice(0, 3).map((p, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="font-medium capitalize">{p.label.replaceAll("_"," ")}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {(p.score * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
