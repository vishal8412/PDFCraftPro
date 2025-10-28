"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { useSmartGlowButton } from "../hooks/useSmartGlowButton";

interface SmartGlowButtonProps {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  active?: boolean; // e.g. fileLoaded
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

/**
 * ✨ SmartGlowButton
 * Reusable premium action button with adaptive shimmer + glow animation.
 */
export default function SmartGlowButton({
  label,
  icon,
  onClick,
  active = false,
  variant = "primary",
  className,
}: SmartGlowButtonProps) {
  const {
    shimmerSpeed,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  } = useSmartGlowButton({
    idleSpeed: 6,
    hoverSpeed: 2.5,
  });

  const variantStyles =
    variant === "primary"
      ? active
        ? "bg-gradient-to-r from-[#00D4B3] via-[#FF9A3D] to-[#00D4B3] animate-gradient-move animate-soft-glow"
        : "bg-gradient-to-r from-[#FF6B6B] to-[#FF9A3D] hover:opacity-90"
      : variant === "secondary"
      ? "bg-gradient-to-r from-[#3a3f51] to-[#1f2532] hover:opacity-90"
      : "bg-gradient-to-r from-[#FF4D4D] to-[#FF7A3D] hover:opacity-90";

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ animationDuration: shimmerSpeed }}
      className={clsx(
        "flex items-center gap-2 px-5 py-2 text-white font-semibold rounded-full shadow-lg transition-all duration-300 select-none hover:scale-[1.04] active:scale-[0.97]",
        variantStyles,
        className
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
