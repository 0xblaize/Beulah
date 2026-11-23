"use client";

import { useEffect, useRef } from "react";

const FPS = 24;
const pad = (v: number) => String(v).padStart(2, "0");

/** SMPTE-style HH:MM:SS:FF counter, written straight to the DOM to avoid 24 re-renders a second. */
export function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const f = Math.floor(((performance.now() - start) / 1000) * FPS);
      if (ref.current) {
        ref.current.textContent = `${pad(Math.floor(f / (FPS * 3600)))}:${pad(Math.floor(f / (FPS * 60)) % 60)}:${pad(Math.floor(f / FPS) % 60)}:${pad(f % FPS)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span ref={ref} className={className}>
      00:00:00:00
    </span>
  );
}
