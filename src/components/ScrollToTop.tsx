"use client";

import { useEffect } from "react";
import { useLocation } from "@/lib/router-next";

/** Scrolls window to top on every route change so entered pages show from the top. */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
