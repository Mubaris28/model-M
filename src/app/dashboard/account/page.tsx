"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardAccountPage from "@/pages/DashboardAccountPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardAccountPage />
    </DashboardGuard>
  );
}
