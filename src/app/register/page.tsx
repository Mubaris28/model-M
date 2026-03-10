"use client";

import RequireAuth from "@/components/RequireAuth";
import RegisterPage from "@/pages/RegisterPage";

export default function Page() {
  return (
    <RequireAuth>
      <RegisterPage />
    </RequireAuth>
  );
}
