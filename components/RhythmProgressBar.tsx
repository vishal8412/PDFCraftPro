"use client";

import { motion } from "framer-motion";
import { useHeartbeat } from "./HeartbeatProvider";

export default function RhythmProgressBar() {
  const heartbeat = useHeartbeat();
  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-blue-500 z-50"
      animate={{ width: heartbeat ? ["0%", "100%"] : "0%" }}
      transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
    />
  );
}
