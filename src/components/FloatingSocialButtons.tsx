"use client";

import { Facebook, Instagram, MessageCircle } from "lucide-react";

const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/";
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`
  : "https://wa.me/";

const links = [
  { href: FACEBOOK_URL, label: "Facebook", icon: Facebook, color: "hover:bg-[#1877F2] hover:border-[#1877F2]" },
  { href: INSTAGRAM_URL, label: "Instagram", icon: Instagram, color: "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent" },
  { href: WHATSAPP_URL, label: "WhatsApp", icon: MessageCircle, color: "hover:bg-[#25D366] hover:border-[#25D366]" },
];

export default function FloatingSocialButtons() {
  return (
    <div
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 md:right-4"
      aria-label="Social links"
    >
      {links.map(({ href, label, icon: Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-12 h-12 rounded-full border-2 border-border bg-background text-foreground shadow-md transition-all ${color} hover:text-white hover:scale-110`}
          aria-label={label}
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}
