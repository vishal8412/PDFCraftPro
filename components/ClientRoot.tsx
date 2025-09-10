"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,   // animation speed
      easing: "ease-out-cubic",
      once: true,      // only animate once per scroll
    });
  }, []);

  return <>{children}</>;
}
