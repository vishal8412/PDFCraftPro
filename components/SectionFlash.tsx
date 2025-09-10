"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSectionInView } from "../hooks/useSectionInView";

export default function SectionFlash() {
  const activeSection = useSectionInView(["hero", "features", "cta", "footer"]);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    if (activeSection) {
      setFlashKey((prev) => prev + 1); // trigger new flash on section change
    }
  }, [activeSection]);

  return (
    <motion.div
      key={flashKey}
      className="fixed inset-0 pointer-events-none z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.4, 0] }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{
        background: `linear-gradient(270deg, rgba(59,130,246,0.6), rgba(139,92,246,0.6), rgba(236,72,153,0.6))`,
        backgroundSize: "200% 200%",
      }}
    />
  );
}
