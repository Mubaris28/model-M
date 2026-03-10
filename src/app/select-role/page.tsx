"use client";

import RequireAuth from "@/components/RequireAuth";
import SelectRolePage from "@/pages/SelectRolePage";

export default function Page() {
  return (
    <RequireAuth>
      <SelectRolePage />
    </RequireAuth>
  );
}
