"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useHeartbeat } from "./HeartbeatProvider";
import { sectionThemes } from "../config/themeConfig";

export default function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const heartbeat = useHeartbeat();
  const theme = sectionThemes.features;

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
    <motion.div
      style={{ rotateX, rotateY }}
      className="relative p-6 bg-white rounded-xl shadow cursor-pointer overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (size.width === 0 || size.height === 0) {
          setSize({ width: rect.width, height: rect.height });
        }
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onMouseLeave={resetTilt}
      whileHover={{ scale: 1.05, boxShadow: `0px 12px 24px ${theme.pulse}` }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, ${theme.pulse}40, transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600">{desc}</p>
      </div>
    </motion.div>
  );
}
