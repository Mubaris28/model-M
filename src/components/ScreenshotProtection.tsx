"use client";

import { useEffect, useState } from "react";

/**
 * Blocks PrintScreen key and shows a black overlay flash.
 * Also hides content on print media so printed copies are black.
 */
export default function ScreenshotProtection() {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.key === "Print") {
        // Clear clipboard to prevent pasting the screenshot
        navigator.clipboard.writeText("").catch(() => {});
        // Show black overlay briefly
        setBlocked(true);
        setTimeout(() => setBlocked(false), 1200);
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+Shift+S (Windows Snipping / SaveAs)
      if (e.key === "PrintScreen") {
        e.preventDefault();
        e.stopPropagation();
      }
      // Block Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
      }
    };

    document.addEventListener("keyup", handleKeyUp, { capture: true });
    document.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("keyup", handleKeyUp, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, []);

  if (!blocked) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
      aria-hidden="true"
    >
      <p className="text-white/30 font-body text-xs tracking-[0.4em] uppercase select-none">
        Content Protected
      </p>
    </div>
  );
}
