"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && error?.message) {
      console.error("Route error:", error.message);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-2xl text-foreground mb-2">Something went wrong</h1>
        <p className="text-muted-foreground font-body text-sm mb-6">
          We couldn’t complete your request. Please try again.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border font-body text-sm uppercase tracking-wider hover:border-primary hover:text-primary"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
