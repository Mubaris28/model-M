"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardBookingsPage from "@/pages/DashboardBookingsPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardBookingsPage />
    </DashboardGuard>
  );
}
