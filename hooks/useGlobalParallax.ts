"use client";

import { useEffect, useState } from "react";

export function useGlobalParallax(strength: number = 5, resetDelay: number = 150) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  let timeoutId: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (e.clientX / innerWidth - 0.5) * strength;
      const offsetY = (e.clientY / innerHeight - 0.5) * strength;

      setTilt({ x: offsetX, y: offsetY });

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setTilt({ x: 0, y: 0 }), resetDelay);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [strength, resetDelay]);

  return tilt;
}
