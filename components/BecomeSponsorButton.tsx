"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function BecomeSponsorButton() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href="/sponsor"
        className={`group relative flex items-center gap-2 ${
          isMobile ? "px-3 py-3 rounded-full" : "px-5 py-2 rounded-full"
        } 
        bg-gradient-to-r from-[#FF6B6B] via-[#FF9A3D] to-[#FF6B6B]
        text-white font-semibold text-sm
        shadow-[0_0_20px_rgba(255,154,61,0.4)]
        hover:shadow-[0_0_30px_8px_rgba(255,154,61,0.4)]
        hover:scale-105 transition-all duration-300 select-none`}
      >
        <FiHeart className="text-white" size={isMobile ? 20 : 16} />
        {!isMobile && <span>Become a Sponsor</span>}

        {/* Tooltip for mobile */}
        {isMobile && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute -top-8 right-1/2 translate-x-1/2 px-2 py-1 text-xs rounded-md bg-[#1b2433] border border-[#FF9A3D]/40 text-gray-200"
          >
            Become a Sponsor
          </motion.span>
        )}

        {/* Glow Pulse */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#FF9A3D]/30 blur-md opacity-70"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
      </Link>
    </motion.div>
  );
}
