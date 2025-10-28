"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function BrandedLoader({
  message = "Loading...",
  progress = 0,
  fullScreen = false,
  visible = true,
  startTime,
}: {
  message?: string;
  progress?: number;
  fullScreen?: boolean;
  visible?: boolean;
  startTime?: number;
}) {
  const [fadeDuration, setFadeDuration] = useState(0.5);
  const hasExited = useRef(false);

  // 🧠 Dynamically adjust fade-out duration based on load time
  useEffect(() => {
    if (!visible && !hasExited.current && startTime) {
      hasExited.current = true;
      const totalLoadTime = (Date.now() - startTime) / 1000; // seconds
      setFadeDuration(totalLoadTime < 2 ? 0.8 : 0.4);
    }
  }, [visible, startTime]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeDuration, ease: "easeInOut" }}
          className={`${
            fullScreen
              ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f141c]/95 backdrop-blur-md"
              : "absolute top-0 left-0 w-full z-40"
          }`}
        >
          {fullScreen ? (
            <div className="relative flex flex-col items-center space-y-6">
              {/* 🌌 Ambient glow pulse behind the logo */}
              <motion.div
                className="absolute w-64 h-64 rounded-full blur-3xl bg-gradient-to-r from-pink-500/20 via-orange-400/20 to-pink-500/20"
                animate={{
                  scale: [0.9, 1.05, 0.9],
                  opacity: [0.5, 0.75, 0.5],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* 🔆 Logo / Brand name */}
              <motion.div
                className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent tracking-wide relative z-10 drop-shadow-[0_0_12px_rgba(255,102,0,0.3)]"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                PDFCraft Pro
              </motion.div>

              {/* 🔸 Progress bar */}
              <div className="w-56 h-1.5 bg-gray-700/60 rounded-full overflow-hidden relative z-10">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-orange-400 rounded-full shadow-lg"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                />
                <motion.div
                  className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50"
                  animate={{ x: ["0%", "100%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* 🕓 Loading text */}
              <motion.div
                className="text-xs text-gray-400 mt-2 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {progress < 100 ? message : "Ready!"}
              </motion.div>
            </div>
          ) : (
            // 🧭 Thin Top Progress Bar (non-fullscreen)
            <motion.div
              className="h-1 bg-gradient-to-r from-pink-500 to-orange-400 shadow-md"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
