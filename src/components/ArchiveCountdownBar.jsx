// src/components/ArchiveCountdownBar.jsx
import { useEffect, useState } from "react";

export default function ArchiveCountdownBar({ endDate = "2025-12-31" }) {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end - now;
      const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      setDaysLeft(days);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000 * 60 * 60 * 6); // 6시간마다 갱신
    return () => clearInterval(timer);
  }, [endDate]);

  // 남은 날에 따라 색/효과 변경
  const baseColor =
    daysLeft <= 7
      ? "text-lime-100 animate-pulse" // 7일 이하 soft blinking
      : daysLeft <= 30
      ? "text-lime-200"
      : "text-lime-300";

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs md:text-sm tracking-widest font-light bg-black/30 backdrop-blur-sm ${baseColor}`}
    >
      ☘︎ {daysLeft} days left until archive · every season ends quietly
    </div>
  );
}
