"use client";

import { useEffect, useState } from "react";

export function useSectionRhythm(section: string) {
  const [tempo, setTempo] = useState(6); // default mid tempo in seconds

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);

      // On fast scrolling → faster tempo
      setTempo((prev) => Math.max(4, prev - 0.2));

      // After scroll stops → ease back to slower tempo
      scrollTimeout = setTimeout(() => {
        setTempo((prev) => Math.min(10, prev + 0.2));
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [section]);

  return tempo;
}
