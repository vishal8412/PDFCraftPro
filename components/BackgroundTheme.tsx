"use client";

import { useEffect, useState } from "react";
import { useSectionInView } from "../hooks/useSectionInView";
import { useHeartbeat } from "./HeartbeatProvider";
import { sectionThemes } from "../config/themeConfig";

export default function BackgroundTheme() {
  const activeSection = useSectionInView(["hero", "features", "cta", "footer"]);
  const heartbeat = useHeartbeat();
  const [color, setColor] = useState("white");
  const [fade, setFade] = useState("0.8s");

  useEffect(() => {
    const theme = sectionThemes[activeSection || "hero"];
    setColor(heartbeat ? theme.pulse : theme.base);
    setFade(theme.fade);
  }, [activeSection, heartbeat]);

  useEffect(() => {
    const body = document.body;
    body.style.transition = `background-color ${fade} ease-in-out`;
    body.style.backgroundColor = color;
  }, [color, fade]);

  return null;
}
