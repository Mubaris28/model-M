"use client";

import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";

export default function PublicFloatingWidgets() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  if (isAdmin) return null;
  return (
    <>
      <Chatbot />
      <WhatsAppFAB />
      <FloatingSocialButtons />
    </>
  );
}
