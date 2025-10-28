"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";

export default function FloatingSponsorBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Link href="/sponsor">
        <motion.div
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 30px rgba(255,154,61,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -4, 0],
            transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full
                     bg-gradient-to-r from-[#FF6B6B] via-[#FF9A3D] to-[#FF6B6B]
                     text-white font-semibold text-sm
                     shadow-[0_0_15px_rgba(255,154,61,0.4)]
                     cursor-pointer backdrop-blur-sm"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex items-center justify-center text-white"
          >
            <FiHeart className="text-lg" />
          </motion.div>
          <span className="tracking-wide">Sponsor Us</span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
