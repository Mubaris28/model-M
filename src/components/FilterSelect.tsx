"use client";

import { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check } from "lucide-react";

export function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  optionLabels = {},
  minWidth = "120px",
  placeholder = "All",
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  optionLabels?: Record<string, string>;
  minWidth?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  /* Close when clicking outside */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const displayLabel = optionLabels[value] ?? value ?? placeholder;

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase select-none">
        {label}
      </span>

      <div className="relative" style={{ minWidth }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          className={`filter-select-trigger w-full flex items-center justify-between gap-2${open ? " is-open" : ""}`}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 opacity-50 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            className="filter-select-content absolute left-0 top-[calc(100%+4px)] w-full z-[999]"
          >
            {options.map((o) => {
              const selected = o === value;
              return (
                <li
                  key={o}
                  role="option"
                  aria-selected={selected}
                  className={`filter-select-item${selected ? " is-selected" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onValueChange(o);
                    setOpen(false);
                  }}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {selected && <Check className="w-3 h-3" />}
                  </span>
                  {optionLabels[o] ?? o}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
