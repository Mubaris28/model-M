"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardReviewsPage from "@/pages/DashboardReviewsPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardReviewsPage />
    </DashboardGuard>
  );
}
