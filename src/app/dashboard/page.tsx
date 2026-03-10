"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardPage from "@/pages/DashboardPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardPage />
    </DashboardGuard>
  );
}
