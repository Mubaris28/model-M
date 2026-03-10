"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardPayoutsPage from "@/pages/DashboardPayoutsPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardPayoutsPage />
    </DashboardGuard>
  );
}
