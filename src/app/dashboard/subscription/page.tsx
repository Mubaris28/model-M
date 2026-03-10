"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardSubscriptionPage from "@/pages/DashboardSubscriptionPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardSubscriptionPage />
    </DashboardGuard>
  );
}
