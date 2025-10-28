"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdItem {
  id: string;
  title: string;
  description: string;
  gradient: string;
  border: string;
  glow: string;
  link?: string;
  category: "self" | "partner";
}

interface RotatingAdPanelProps {
  ads?: AdItem[];
  interval?: number; // default 10s
  position?: "left" | "right";
}

export default function RotatingAdPanel({
  ads,
  interval = 10000,
  position = "left",
}: RotatingAdPanelProps) {
  const defaultAds: AdItem[] = [
    {
      id: "1",
      title: "✨ PDFCraft Pro Premium",
      description:
        "Unlock faster rendering, AI-text tools, and ad-free experience.",
      gradient: "from-[#00D4B3]/20 via-[#29ABE2]/10 to-transparent",
      border: "border-[#00D4B3]/60",
      glow: "shadow-[0_0_15px_rgba(0,212,179,0.3)]",
      link: "#",
      category: "self",
    },
    {
      id: "2",
      title: "🚀 Promote Your Brand Here",
      description: "Reach 100 K+ PDF creators directly in PDFCraft Pro.",
      gradient: "from-[#FF9A3D]/20 via-[#FF6B6B]/10 to-transparent",
      border: "border-[#FF9A3D]/60",
      glow: "shadow-[0_0_15px_rgba(255,154,61,0.3)]",
      link: "#contact-sponsor",
      category: "partner",
    },
    {
      id: "3",
      title: "🤝 Partner Spotlight: Cloudify",
      description: "Store & sync your PDFs securely with Cloudify Drive.",
      gradient: "from-[#6B5BFF]/20 via-[#9B59B6]/10 to-transparent",
      border: "border-[#6B5BFF]/60",
      glow: "shadow-[0_0_15px_rgba(107,91,255,0.3)]",
      link: "https://cloudify.io",
      category: "partner",
    },
  ];

  const adList = ads || defaultAds;
  const [index, setIndex] = useState(0);
  const [clicks, setClicks] = useState<Record<string, number>>({});

  // rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % adList.length);
    }, interval);
    return () => clearInterval(timer);
  }, [adList.length, interval]);

  const ad = adList[index];

  const handleClick = (id: string, title: string) => {
    setClicks((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    console.log(`🧭 Ad clicked: "${title}" (total: ${(clicks[id] || 0) + 1})`);
  };

  return (
    <div className="relative w-full p-3">
      <AnimatePresence mode="wait">
        <motion.a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick(ad.id, ad.title)}
          className={`relative block rounded-xl p-4 border ${ad.border} ${ad.glow} overflow-hidden bg-[#0f141c] transition-transform hover:scale-[1.02]`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${ad.gradient} animate-shimmerSlow`}
          />
          <div className="relative text-center select-none">
            <h4
              className={`text-sm font-semibold ${
                position === "left" ? "text-[#FF9A3D]" : "text-[#00D4B3]"
              }`}
            >
              {ad.title}
            </h4>
            <p className="text-gray-300 text-xs mt-1 leading-snug">
              {ad.description}
            </p>
          </div>
        </motion.a>
      </AnimatePresence>

      {/* Optional small tracker preview */}
      <div className="text-[10px] text-gray-500 text-center mt-1">
        Views {index + 1}/{adList.length} · Clicks 
        {Object.values(clicks).reduce((a, b) => a + b, 0)}
      </div>
    </div>
  );
}
