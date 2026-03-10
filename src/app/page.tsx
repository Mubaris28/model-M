"use client";

import GuestOnlyHome from "@/components/GuestOnlyHome";
import Index from "@/pages/Index";

export default function HomePage() {
  return (
    <GuestOnlyHome>
      <Index />
    </GuestOnlyHome>
  );
}
