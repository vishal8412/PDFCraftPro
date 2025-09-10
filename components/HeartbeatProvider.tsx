"use client";

import { createContext, useContext, useEffect, useState } from "react";

const HeartbeatContext = createContext(false);

export function HeartbeatProvider({ children }: { children: React.ReactNode }) {
  const [heartbeat, setHeartbeat] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeat((h) => !h);
    }, 1000); // 1 beat per second
    return () => clearInterval(interval);
  }, []);

  return (
    <HeartbeatContext.Provider value={heartbeat}>
      {children}
    </HeartbeatContext.Provider>
  );
}

export function useHeartbeat() {
  return useContext(HeartbeatContext);
}
