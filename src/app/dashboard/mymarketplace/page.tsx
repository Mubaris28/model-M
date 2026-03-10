"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardMyMarketplacePage from "@/pages/DashboardMyMarketplacePage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardMyMarketplacePage />
    </DashboardGuard>
  );
}
