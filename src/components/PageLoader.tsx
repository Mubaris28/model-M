"use client";

interface PageLoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  fullscreen?: boolean;
}

export default function PageLoader({ label, size = "md", fullscreen = true }: PageLoaderProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
  };

  const spinner = (
    <div className={`rounded-full border-border border-t-primary animate-spin ${sizeClasses[size]}`} />
  );

  if (!fullscreen) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        {spinner}
        {label && <p className="text-muted-foreground font-body text-xs tracking-[0.2em] uppercase">{label}</p>}
      </div>
    );
  }

  // Next.js may log "Skipping auto scroll behavior due to position: fixed" when this is mounted.
  // That's expected: the router skips scroll restoration for fixed overlays. Safe to ignore.
  return (
    <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-background" aria-busy="true" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        {spinner}
        {label && (
          <p className="text-muted-foreground font-body text-xs tracking-[0.3em] uppercase">{label}</p>
        )}
      </div>
    </div>
  );
}

/** Inline spinner for use inside buttons or small UI elements */
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block w-4 h-4 rounded-full border-2 border-border border-t-current animate-spin ${className}`}
      aria-hidden="true"
    />
  );
}
