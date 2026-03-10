"use client";

import DashboardGuard from "@/components/DashboardGuard";
import DashboardFavoritesPage from "@/pages/DashboardFavoritesPage";

export default function Page() {
  return (
    <DashboardGuard>
      <DashboardFavoritesPage />
    </DashboardGuard>
  );
}
