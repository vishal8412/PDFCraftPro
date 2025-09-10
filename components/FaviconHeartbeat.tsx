"use client";

import { useEffect } from "react";
import { useHeartbeat } from "./HeartbeatProvider";
import { useSectionRhythm } from "../hooks/useSectionRhythm";

function getColorTemperature(tempo: number) {
  const t = Math.max(4, Math.min(10, tempo));
  const factor = (t - 4) / (10 - 4);
  const r = Math.round(100 + factor * 155);
  const g = Math.round(160 + factor * 60);
  const b = Math.round(255 - factor * 120);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function FaviconHeartbeat() {
  const heartbeat = useHeartbeat();
  const tempo = useSectionRhythm("hero");

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = getColorTemperature(tempo);
      const glow = heartbeat ? 12 : 6;
      ctx.beginPath();
      ctx.arc(32, 32, glow, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(32, 32, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) link.href = canvas.toDataURL("image/png");
    };

    draw();
    const interval = setInterval(draw, 300);
    return () => clearInterval(interval);
  }, [heartbeat, tempo]);

  return null;
}
