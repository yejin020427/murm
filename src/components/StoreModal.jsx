// src/components/StoreModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRODUCT_DB = {
  espresso: [
    { id: "e1", name: "Midnight Roast Beans", price: "₩18,000", desc: "dark, smoky, sleepless.", img: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1200&auto=format&fit=crop" },
    { id: "e2", name: "Smoke Ceramic Mug", price: "₩14,000", desc: "matte black, heavy base.", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1200&auto=format&fit=crop" },
    { id: "e3", name: "Night Dripper", price: "₩29,000", desc: "slow pour for dark hours.", img: "https://images.unsplash.com/photo-1461988168320-1f581029cd1c?q=80&w=1200&auto=format&fit=crop" },
  ],
  americano: [
    { id: "a1", name: "City Tumbler", price: "₩19,000", desc: "commute-friendly.", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop" },
    { id: "a2", name: "Black Sleeve", price: "₩9,000", desc: "minimal grip.", img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop" },
  ],
  matcha: [
    { id: "m1", name: "Green Room Matcha Powder", price: "₩22,000", desc: "calm, umami, bright.", img: "https://images.unsplash.com/photo-1546549039-3f5323f0b3ed?q=80&w=1200&auto=format&fit=crop" },
    { id: "m2", name: "Whisk + Bowl Set", price: "₩34,000", desc: "ritual-ready tools.", img: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=1200&auto=format&fit=crop" },
    { id: "m3", name: "Glass Matcha Cup", price: "₩12,000", desc: "minimal, airy.", img: "https://images.unsplash.com/photo-1615486364136-1fb4f2b05c46?q=80&w=1200&auto=format&fit=crop" },
  ],
  cappuccino: [
    { id: "c1", name: "Beige Linen Coaster", price: "₩8,000", desc: "warm, cozy.", img: "https://images.unsplash.com/photo-1520903304654-5e105e2cc2e1?q=80&w=1200&auto=format&fit=crop" },
    { id: "c2", name: "Soft Candle", price: "₩17,000", desc: "foam after-noise.", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop" },
  ],
  strawberry: [
    { id: "s1", name: "Pink Shaker", price: "₩15,000", desc: "bubblegum routine.", img: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=1200&auto=format&fit=crop" },
    { id: "s2", name: "Protein Mix (Strawberry)", price: "₩23,000", desc: "sweet discipline.", img: "https://images.unsplash.com/photo-1542444459-db63c56cfca8?q=80&w=1200&auto=format&fit=crop" },
  ],
};

const MENU_LABELS = {
  espresso: "Espresso",
  matcha: "Matcha Latte",
  strawberry: "Strawberry Latte",
  americano: "Americano",
  cappuccino: "Cappuccino",
};

export default function StoreModal({ open, onClose, mood = "espresso" }) {
  const [activeMood, setActiveMood] = useState(mood);
  const products = PRODUCT_DB[activeMood] || [];
  const MENUS = ["espresso", "americano", "cappuccino", "matcha", "strawberry"];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 배경 딤 */}
          <motion.div
            className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* 패널 */}
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
          >
            <div className="w-full max-w-5xl bg-[#161616]/90 text-white rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden">
              {/* 헤더 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="text-sm tracking-widest opacity-90">
                  murm store
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white text-sm px-3 py-1 rounded-full border border-white/30"
                >
                  ✕
                </button>
              </div>

              {/* ✅ 메뉴 탭 */}
              <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-white/10">
                {MENUS.map(menu => (
                  <button
                    key={menu}
                    onClick={() => setActiveMood(menu)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition
                      ${activeMood === menu ? "bg-white/15 border-white/40" : "border-white/20 hover:bg-white/10"}`}
                  >
                    {MENU_LABELS[menu]}
                  </button>
                ))}
              </div>

              {/* 상품 그리드 */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[65vh] overflow-y-auto">
                {products.map(item => (
                  <div key={item.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="text-sm font-light">{item.name}</div>
                      <div className="text-xs text-white/70">{item.desc}</div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm">{item.price}</span>
                        <a
                          href="#"
                          className="text-xs px-3 py-1 rounded-full border border-white/30 hover:bg-white/10"
                          onClick={(e)=>e.preventDefault()}
                        >
                          buy now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 푸터 */}
              <div className="px-5 py-3 border-t border-white/10 text-xs text-white/70 flex items-center justify-between">
                <span>curated objects for each mood</span>
                <span>more menus coming soon</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
