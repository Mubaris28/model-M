"use client";

import RequireAuth from "@/components/RequireAuth";
import BecomeModelPage from "@/pages/BecomeModelPage";

export default function Page() {
  return (
    <RequireAuth>
      <BecomeModelPage />
    </RequireAuth>
  );
}
