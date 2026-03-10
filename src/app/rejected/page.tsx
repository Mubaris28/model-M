"use client";

import RequireAuth from "@/components/RequireAuth";
import RejectedPage from "@/pages/RejectedPage";

export default function Page() {
  return (
    <RequireAuth>
      <RejectedPage />
    </RequireAuth>
  );
}
