"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardNotificationsPage from "@/pages/DashboardNotificationsPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardNotificationsPage />
    </DashboardGuard>
  );
}
