"use client";

import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";
import FloatingSocialButtons from "@/components/FloatingSocialButtons";

/** Form pages where we hide floating widgets on mobile only (so they don't overlap inputs). */
const MOBILE_HIDDEN_FORM_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/register",
  "/become-model",
  "/contact",
];

export default function PublicFloatingWidgets() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const hideOnMobileOnly = pathname ? MOBILE_HIDDEN_FORM_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) : false;

  if (isAdmin) return null;

  const wrapperClass = hideOnMobileOnly ? "hidden md:block" : undefined;

  return (
    <>
      {wrapperClass ? (
        <>
          <div className={wrapperClass}><Chatbot /></div>
          <div className={wrapperClass}><FloatingSocialButtons /></div>
        </>
      ) : (
        <>
          <Chatbot />
          <FloatingSocialButtons />
        </>
      )}
    </>
  );
}
