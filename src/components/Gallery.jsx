// src/components/Gallery.jsx
import { useState } from "react";

export default function Gallery({ images = [], title }) {
  const [i, setI] = useState(null);
  if (!images.length) return null;

  return (
    <div>
      {title && <h3 className="text-lg mb-2">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className="aspect-square overflow-hidden rounded-xl"
          >
            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {i !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setI(null)}
        >
          <img src={images[i]} alt="" className="max-w-[90vw] max-h-[85vh] rounded-2xl" />
        </div>
      )}
    </div>
  );
}
