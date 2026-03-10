"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardMyCastingsPage from "@/pages/DashboardMyCastingsPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardMyCastingsPage />
    </DashboardGuard>
  );
}
