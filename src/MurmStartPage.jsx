// src/MurmStartPage.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

/* ==== 설정 ==== */
const DEMO_MODE = false; // ← 배포에서 AI 생성 사용. 로컬에서 테스트만 할 땐 true로.

const MOODS = {
  espresso: {
    title: "espresso",
    bgm: "/audio/espresso.mp3",
    gradient: "from-black via-neutral-900 to-amber-950",
    // 데모 백업 이미지(실패 시 폴백)
    demo: "https://images.unsplash.com/photo-1503481766315-7a586b20f66f?q=80&w=2000&auto=format&fit=crop",
  },
  americano: {
    title: "americano",
    bgm: "/audio/americano.mp3",
    gradient: "from-slate-900 via-black to-black",
    demo: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=2000&auto=format&fit=crop",
  },
  matcha: {
    title: "matcha latte",
    bgm: "/audio/matcha.mp3",
    gradient: "from-green-200 via-lime-100 to-emerald-200",
    demo: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop",
  },
  cappuccino: {
    title: "cappuccino",
    bgm: null,
    gradient: "from-stone-300 via-stone-100 to-stone-200",
    demo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop",
  },
  strawberry: {
    title: "strawberry latte",
    bgm: null, // 있으면 /audio/...로 바꿔
    gradient: "from-pink-200 via-rose-200 to-fuchsia-300",
    // ⬇︎ 로컬에 둔 영상 경로를 /media/... 로 참조 (public 하위니까 슬래시로 시작)
    demo: "/media/strawberry-latte.mp4",
  },
};

/* ==== 컴포넌트 ==== */
export default function MurmStartPage() {
  const [selected, setSelected] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  const currentAudio = useRef(null);
  const nextAudio = useRef(null);

  const fadeTo = (src) => {
    const FADE_MS = 900, STEP = 0.05;

    // 끄기
    if (!src) {
      if (!currentAudio.current) return;
      const id = setInterval(() => {
        if (!currentAudio.current) return clearInterval(id);
        currentAudio.current.volume = Math.max(0, currentAudio.current.volume - STEP);
        if (currentAudio.current.volume <= 0) {
          currentAudio.current.pause();
          currentAudio.current = null;
          clearInterval(id);
        }
      }, FADE_MS * STEP);
      return;
    }

    // 처음 켜기
    if (!currentAudio.current) {
      const a = new Audio(src);
      a.loop = true; a.volume = 0;
      a.play().catch(()=>{});
      currentAudio.current = a;
      const id = setInterval(() => {
        if (!currentAudio.current) return clearInterval(id);
        currentAudio.current.volume = Math.min(1, currentAudio.current.volume + STEP);
        if (currentAudio.current.volume >= 1) clearInterval(id);
      }, FADE_MS * STEP);
      return;
    }

    // 교차
    nextAudio.current = new Audio(src);
    nextAudio.current.loop = true; nextAudio.current.volume = 0;
    nextAudio.current.play().catch(()=>{});
    const id = setInterval(() => {
      if (!currentAudio.current || !nextAudio.current) return clearInterval(id);
      currentAudio.current.volume = Math.max(0, currentAudio.current.volume - STEP);
      nextAudio.current.volume = Math.min(1, nextAudio.current.volume + STEP);
      if (nextAudio.current.volume >= 1) {
        clearInterval(id);
        currentAudio.current.pause();
        currentAudio.current = nextAudio.current;
        nextAudio.current = null;
      }
    }, FADE_MS * STEP);
  };

  const handleSelect = async (key) => {
    setSelected(key);
    setGateOpen(false);
    setLoading(true);
    setMediaUrl(null);

    const track = MOODS[key].bgm;
    if (track) fadeTo(track);

    try {
      if (DEMO_MODE) {
        setMediaUrl(MOODS[key].demo);
      } else {
        const res = await fetch(`/api/generate?menu=${encodeURIComponent(key)}`);
        const data = await res.json();
        setMediaUrl(data.url || MOODS[key].demo);
      }
    } catch (e) {
      console.error(e);
      setMediaUrl(MOODS[key].demo);
    } finally {
      setLoading(false);
      setTimeout(() => setGateOpen(true), 80);
    }
  };

  const backToMenu = () => {
    setGateOpen(false);
    setTimeout(() => {
      setSelected(null);
      setMediaUrl(null);
      setLoading(false);
      fadeTo(null);
    }, 350);
  };

  const gateClip = gateOpen ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)";
  const isVideo = (u) => typeof u === "string" && u.toLowerCase().endsWith(".mp4");

  return (
    <div className="relative w-full h-screen overflow-hidden text-white flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="menu"
            className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-6 text-xl font-light"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <motion.div className="pointer-events-none absolute w-[200vw] h-[200vh] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-30"
              animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
            <motion.div className="pointer-events-none absolute w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
            <motion.h1 className="z-20 text-6xl font-light tracking-widest mb-10"
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.02, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              murm
            </motion.h1>
            <div className="relative z-30 pointer-events-auto flex flex-col items-center gap-6">
              {Object.keys(MOODS).map((key) => (
                <motion.button key={key} type="button" onClick={() => handleSelect(key)}
                  whileHover={{ scale: 1.14, letterSpacing: "0.2em", opacity: 1 }}
                  whileTap={{ scale: 0.94 }}
                  className="transition-all duration-500 opacity-80 cursor-pointer text-neutral-300 hover:text-white focus:outline-none">
                  {MOODS[key].title}
                </motion.button>
              ))}
            </div>
            <motion.div className="pointer-events-none absolute bottom-10 text-xs tracking-widest text-neutral-500"
              animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 6, repeat: Infinity }}>
              soft noises only
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key={selected} className={`absolute inset-0 bg-gradient-to-br ${MOODS[selected].gradient}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <motion.div className="absolute inset-0" style={{ clipPath: gateClip }}
              animate={{ clipPath: gateClip }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <div className="absolute inset-0">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-pulse text-neutral-100">generating…</div>
                  </div>
                ) : mediaUrl ? (
                  isVideo(mediaUrl) ? (
                    <video src={mediaUrl} className="w-full h-full object-cover opacity-75 mix-blend-overlay" autoPlay muted loop playsInline />
                  ) : (
                    <img src={mediaUrl} alt={selected} className="w-full h-full object-cover opacity-70 mix-blend-overlay" draggable={false} />
                  )
                ) : null}
              </div>
              <motion.div className="relative z-10 w-full h-full flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
                <div className="text-center px-6 max-w-xl">
                  <h2 className="text-3xl font-light tracking-wider mb-3">{MOODS[selected].title}</h2>
                  <p className="text-base md:text-lg font-extralight tracking-wider">
                    {/* 프롬프트는 서버에서 map으로 관리하지만, 프런트는 타이틀만 노출 */}
                    online gallery — generated for <span className="opacity-80">{MOODS[selected].title}</span>
                  </p>
                </div>
                <motion.button onClick={backToMenu}
                  className="mt-10 text-sm tracking-widest text-neutral-100 hover:text-white/90 border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  return to menu
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
