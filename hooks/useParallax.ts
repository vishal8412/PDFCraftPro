"use client";

import { useEffect, useState } from "react";

export function useParallax(strength: number = 30) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      setOffset((prev) => ({
        x: (scrollX % strength) - strength / 2 + prev.x * 0.5,
        y: (scrollY % strength) - strength / 2 + prev.y * 0.5,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const mouseX = (e.clientX / innerWidth - 0.5) * strength;
      const mouseY = (e.clientY / innerHeight - 0.5) * strength;

      setOffset({ x: mouseX, y: mouseY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [strength]);

  return offset;
}
