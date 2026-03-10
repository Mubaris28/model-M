"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardPremiumPage from "@/pages/DashboardPremiumPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardPremiumPage />
    </DashboardGuard>
  );
}
