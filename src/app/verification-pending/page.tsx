"use client";

import RequireAuth from "@/components/RequireAuth";
import VerificationPendingGuard from "@/components/VerificationPendingGuard";
import VerificationPendingPage from "@/pages/VerificationPendingPage";

export default function Page() {
  return (
    <RequireAuth>
      <VerificationPendingGuard>
        <VerificationPendingPage />
      </VerificationPendingGuard>
    </RequireAuth>
  );
}
