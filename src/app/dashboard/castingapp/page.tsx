"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardCastingAppPage from "@/pages/DashboardCastingAppPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardCastingAppPage />
    </DashboardGuard>
  );
}
