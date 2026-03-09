import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import GuestOnlyHome from "./components/GuestOnlyHome";
import DashboardGuard from "./components/DashboardGuard";
import RequireAuth from "./components/RequireAuth";
import VerificationPendingGuard from "./components/VerificationPendingGuard";
import Index from "./pages/Index";
import ModelsPage from "./pages/ModelsPage";
import ModelProfile from "./pages/ModelProfile";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetail from "./pages/CategoryDetail";
import CastingPage from "./pages/CastingPage";
import CastingDetail from "./pages/CastingDetail";
import NewFacesPage from "./pages/NewFacesPage";
import MarketplacePage from "./pages/MarketplacePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SelectRolePage from "./pages/SelectRolePage";
import BecomeModelPage from "./pages/BecomeModelPage";
import RegisterPage from "./pages/RegisterPage";
import VerificationPendingPage from "./pages/VerificationPendingPage";
import RejectedPage from "./pages/RejectedPage";
import ReviseApplicationPage from "./pages/ReviseApplicationPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardAccountPage from "./pages/DashboardAccountPage";
import DashboardFavoritesPage from "./pages/DashboardFavoritesPage";
import DashboardCastingAppPage from "./pages/DashboardCastingAppPage";
import DashboardPremiumPage from "./pages/DashboardPremiumPage";
import DashboardPayoutsPage from "./pages/DashboardPayoutsPage";
import DashboardNotificationsPage from "./pages/DashboardNotificationsPage";
import DashboardSubscriptionPage from "./pages/DashboardSubscriptionPage";
import DashboardMyCastingsPage from "./pages/DashboardMyCastingsPage";
import DashboardPostCastingPage from "./pages/DashboardPostCastingPage";
import DashboardBookingsPage from "./pages/DashboardBookingsPage";
import DashboardReviewsPage from "./pages/DashboardReviewsPage";
import DashboardMyMarketplacePage from "./pages/DashboardMyMarketplacePage";
import DashboardUpdatePortfolioPage from "./pages/DashboardUpdatePortfolioPage";
import MarketplaceDetailPage from "./pages/MarketplaceDetailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminSignupPage from "./pages/AdminSignupPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import AdminPremiumUsersPage from "./pages/AdminPremiumUsersPage";
import AdminBankTransfersPage from "./pages/AdminBankTransfersPage";
import NotFound from "./pages/NotFound";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import DiscoverPathPage from "./pages/DiscoverPathPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<GuestOnlyHome><Index /></GuestOnlyHome>} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/model/:id" element={<ModelProfile />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryDetail />} />
          <Route path="/casting" element={<CastingPage />} />
          <Route path="/casting/:id" element={<CastingDetail />} />
          <Route path="/new-faces" element={<NewFacesPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/:id" element={<MarketplaceDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="/discover-path/:slug" element={<DiscoverPathPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/select-role" element={<RequireAuth><SelectRolePage /></RequireAuth>} />
          <Route path="/become-model" element={<RequireAuth><BecomeModelPage /></RequireAuth>} />
          <Route path="/register" element={<RequireAuth><RegisterPage /></RequireAuth>} />
          <Route path="/verification-pending" element={<RequireAuth><VerificationPendingGuard><VerificationPendingPage /></VerificationPendingGuard></RequireAuth>} />
          <Route path="/revise-application" element={<RequireAuth><ReviseApplicationPage /></RequireAuth>} />
          <Route path="/rejected" element={<RequireAuth><RejectedPage /></RequireAuth>} />
          <Route path="/dashboard" element={<DashboardGuard><DashboardPage /></DashboardGuard>} />
          <Route path="/dashboard/account" element={<DashboardGuard><DashboardAccountPage /></DashboardGuard>} />
          <Route path="/dashboard/favorites" element={<DashboardGuard><DashboardFavoritesPage /></DashboardGuard>} />
          <Route path="/dashboard/castingapp" element={<DashboardGuard><DashboardCastingAppPage /></DashboardGuard>} />
          <Route path="/dashboard/premium" element={<DashboardGuard><DashboardPremiumPage /></DashboardGuard>} />
          <Route path="/dashboard/payouts" element={<DashboardGuard><DashboardPayoutsPage /></DashboardGuard>} />
          <Route path="/dashboard/notifications" element={<DashboardGuard><DashboardNotificationsPage /></DashboardGuard>} />
          <Route path="/dashboard/subscription" element={<DashboardGuard><DashboardSubscriptionPage /></DashboardGuard>} />
          <Route path="/dashboard/my-castings" element={<DashboardGuard><DashboardMyCastingsPage /></DashboardGuard>} />
          <Route path="/dashboard/post-casting" element={<DashboardGuard><DashboardPostCastingPage /></DashboardGuard>} />
          <Route path="/dashboard/bookings" element={<DashboardGuard><DashboardBookingsPage /></DashboardGuard>} />
          <Route path="/dashboard/reviews" element={<DashboardGuard><DashboardReviewsPage /></DashboardGuard>} />
          <Route path="/dashboard/mymarketplace" element={<DashboardGuard><DashboardMyMarketplacePage /></DashboardGuard>} />
          <Route path="/dashboard/update-portfolio" element={<DashboardGuard><DashboardUpdatePortfolioPage /></DashboardGuard>} />
          <Route path="/admin/signup" element={<AdminSignupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/premium-users" element={<AdminPremiumUsersPage />} />
          <Route path="/admin/bank-transfers" element={<AdminBankTransfersPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
