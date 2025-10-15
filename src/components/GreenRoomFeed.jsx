// src/components/GreenRoomFeed.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function GreenRoomFeed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleUpload = () => {
    if (!text && !image) return;
    const newPost = {
      id: Date.now(),
      text,
      image: image ? URL.createObjectURL(image) : null,
      likes: 0,
      date: new Date().toLocaleDateString(),
    };
    setPosts([newPost, ...posts]);
    setText("");
    setImage(null);
  };

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto px-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
    <div className="mt-8 w-full max-w-2xl mx-auto px-4">
      {/* 업로드 창 */}
      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm shadow-sm mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="write something green..."
          className="w-full bg-transparent text-white text-sm outline-none resize-none placeholder:text-neutral-400"
          rows={3}
        />
        <div className="flex items-center justify-between mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="text-xs text-neutral-300"
          />
          <motion.button
            onClick={handleUpload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="text-xs tracking-widest border border-white/30 rounded-full px-4 py-1 text-white/90 hover:text-white"
          >
            post
          </motion.button>
        </div>
      </div>

      {/* 피드 목록 */}
      <div className="space-y-6">
        {posts.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm shadow-md"
          >
            <p className="text-sm text-white/90 whitespace-pre-wrap">{p.text}</p>
            {p.image && (
              <img
                src={p.image}
                alt=""
                className="mt-3 w-full rounded-xl object-cover opacity-90"
              />
            )}
            <div className="text-xs text-neutral-300 mt-2 flex justify-between">
              <span>{p.date}</span>
              <span>🍃 {p.likes}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </div>);
}
