// 🧩 useShimmerAnimation.ts
// A reusable hook that provides brand shimmer animations with color presets.
// Perfect for glowing buttons, toasts, borders, and UI highlights.

import { CSSProperties, useMemo } from "react";

type ShimmerPreset = "brand" | "success" | "warning" | "info";

interface ShimmerConfig {
  colors: string[];
  duration?: number;
}

/**
 * Provides a continuously looping shimmer background animation.
 * @param preset - Preset key to select color combination.
 * @returns A style object with animated gradient background.
 */
export default function useShimmerAnimation(
  preset: ShimmerPreset = "brand"
): CSSProperties {
  const config: Record<ShimmerPreset, ShimmerConfig> = {
    brand: { colors: ["#00D4B3", "#FF9A3D"], duration: 6 },
    success: { colors: ["#00D4B3", "#29ABE2"], duration: 6 },
    warning: { colors: ["#FF9A3D", "#FF6B6B"], duration: 6 },
    info: { colors: ["#29ABE2", "#6B5BFF"], duration: 6 },
  };

  const { colors, duration } = config[preset];

  // Use memo for consistent style reference
  return useMemo(() => {
    const backgroundImage = `linear-gradient(90deg, ${colors.join(", ")})`;

    return {
      backgroundImage,
      backgroundSize: "200% 200%",
      animation: `shimmer-${preset} ${duration}s ease-in-out infinite`,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
    } as CSSProperties;
  }, [colors, duration, preset]);
}

// 🧱 CSS Keyframes (add once globally, e.g. in globals.css)
/*
@keyframes shimmer-brand {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes shimmer-success {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes shimmer-warning {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes shimmer-info {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
*/
