"use client";

import { useHeartbeat } from "./HeartbeatProvider";

export default function RhythmDebugOverlay() {
  const heartbeat = useHeartbeat();
  return (
    <div className="fixed bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
      Heartbeat: {heartbeat ? "❤️" : "—"}
    </div>
  );
}
