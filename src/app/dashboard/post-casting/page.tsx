"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardPostCastingPage from "@/pages/DashboardPostCastingPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardPostCastingPage />
    </DashboardGuard>
  );
}
