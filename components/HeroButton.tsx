"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useHeartbeat } from "./HeartbeatProvider";

export default function HeroButton({ label, href }: { label: string; href: string; }) {
  const heartbeat = useHeartbeat();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const rotateX = useTransform(y, [0, size.height], [6, -6]);
  const rotateY = useTransform(x, [0, size.width], [-6, 6]);
  const glowX = useTransform(x, [0, size.width], ["0%", "100%"]);
  const glowY = useTransform(y, [0, size.height], ["0%", "100%"]);

  const resetTilt = () => {
    animate(x, size.width / 2, { type: "spring", stiffness: 200, damping: 20 });
    animate(y, size.height / 2, { type: "spring", stiffness: 200, damping: 20 });
  };

  useEffect(() => {
    if (size.width && size.height) {
      x.set(size.width / 2);
      y.set(size.height / 2);
    }
  }, [size, x, y]);

  return (
    <motion.a
      href={href}
      style={{ rotateX, rotateY }}
      className="relative px-6 py-3 rounded-lg font-bold text-white shadow-lg 
                 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                 bg-[length:200%_200%] animate-[gradientShift_6s_ease_infinite]
                 overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (size.width === 0 || size.height === 0) {
          setSize({ width: rect.width, height: rect.height });
        }
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onMouseLeave={resetTilt}
      whileHover={{ scale: 1.08, boxShadow: "0px 14px 32px rgba(59,130,246,0.6)" }}
    >
      {/* Gradient glow */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, rgba(59,130,246,0.5), rgba(139,92,246,0.5), transparent 70%)`,
        }}
      />

      {/* Heartbeat pulse overlay */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{
          opacity: heartbeat ? [0.15, 0.35, 0.15] : 0.15,
          scale: heartbeat ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 0.8, ease: "easeInOut", repeat: heartbeat ? Infinity : 0 }}
        style={{
          background: `radial-gradient(circle at center, rgba(59,130,246,0.3), rgba(139,92,246,0.3), transparent 80%)`,
        }}
      />

      <span className="relative z-10">{label}</span>
    </motion.a>
  );
}
