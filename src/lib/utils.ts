import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Use for img src when value may be string (Vite) or StaticImageData (Next.js). */
export function imgSrc(src: string | { src: string }): string {
  return typeof src === "string" ? src : src.src;
}
