"use client";

import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";

export default function PublicFloatingWidgets() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  if (isAdmin) return null;
  return (
    <>
      <div className="hidden md:block"><Chatbot /></div>
      <div className="hidden md:block"><FloatingSocialButtons /></div>
    </>
  );
}
