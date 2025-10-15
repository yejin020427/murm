// src/components/Slideshow.jsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Slideshow({ images = [], interval = 3000, title }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const len = images.length || 0;

  useEffect(() => {
    if (!len) return;
    timer.current = setInterval(() => setIdx(i => (i + 1) % len), interval);
    return () => clearInterval(timer.current);
  }, [len, interval]);

  const go = (d) => setIdx(i => (i + d + len) % len);

  if (!len) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {title && <h3 className="text-lg mb-2">{title}</h3>}

      <div
        className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-black/20"
        onMouseEnter={() => { if (timer.current) clearInterval(timer.current); }}
        onMouseLeave={() => {
          timer.current = setInterval(() => setIdx(i => (i + 1) % len), interval);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={images[idx]}
            src={images[idx]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            draggable={false}
          />
        </AnimatePresence>

        {/* 좌우 버튼 */}
        <button
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white px-3 py-2 rounded-xl"
          aria-label="prev"
        >‹</button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white px-3 py-2 rounded-xl"
          aria-label="next"
        >›</button>

        {/* 점 네비게이션 */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 w-2 rounded-full ${i===idx ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`go to ${i+1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
