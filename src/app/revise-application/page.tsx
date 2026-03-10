"use client";

import RequireAuth from "@/components/RequireAuth";
import ReviseApplicationPage from "@/pages/ReviseApplicationPage";

export default function Page() {
  return (
    <RequireAuth>
      <ReviseApplicationPage />
    </RequireAuth>
  );
}
