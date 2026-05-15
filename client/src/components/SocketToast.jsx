import { useState, useEffect, useRef } from "react";
import "../style/SocketToast.css";

export default function SocketToast({ isSocketOnline }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const isFirstRender = useRef(true);
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any existing dismiss timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setVisible(true);
    setExiting(false);

    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setVisible(false), 400); // match CSS transition
    }, 3000); // 3 seconds

    return () => clearTimeout(timerRef.current);
  }, [isSocketOnline]);

  if (!visible) return null;

  const connected = isSocketOnline;

  return (
    <>
      <div
        className={`socket-toast ${connected ? "connected" : "disconnected"} ${exiting ? "exiting" : ""}`}
        role="status"
        aria-live="polite"
      >
        <span className="dot" />
        {connected ? "Socket Connected" : "Socket Disconnected"}
      </div>
    </>
  );
}