"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 🧠 useSmartGlowButton
 * Adds adaptive gradient shimmer speed + breathing glow effect to a button.
 * - Slows down shimmer when idle
 * - Accelerates when hovered
 * - Smoothly eases back when hover ends
 * - Can optionally pause animation on click
 */
export function useSmartGlowButton({
  idleSpeed = 6,
  hoverSpeed = 2.5,
  easeFactor = 0.1,
  frameRate = 50,
}: {
  idleSpeed?: number;
  hoverSpeed?: number;
  easeFactor?: number;
  frameRate?: number;
}) {
  const [speed, setSpeed] = useState(idleSpeed);
  const targetSpeed = useRef(idleSpeed);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Smoothly interpolate shimmer speed
  const adjustSpeed = (newSpeed: number) => {
    targetSpeed.current = newSpeed;

    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSpeed((current) => {
        const diff = targetSpeed.current - current;
        if (Math.abs(diff) < 0.05) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return targetSpeed.current;
        }
        return current + diff * easeFactor;
      });
    }, frameRate);
  };

  const handleMouseEnter = () => adjustSpeed(hoverSpeed);
  const handleMouseLeave = () => adjustSpeed(idleSpeed);
  const handleMouseDown = () => setSpeed(() => idleSpeed * 2); // brief freeze illusion
  const handleMouseUp = () => adjustSpeed(hoverSpeed);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    shimmerSpeed: `${speed}s`,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  };
}
