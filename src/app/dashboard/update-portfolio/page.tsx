"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardUpdatePortfolioPage from "@/pages/DashboardUpdatePortfolioPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardUpdatePortfolioPage />
    </DashboardGuard>
  );
}
