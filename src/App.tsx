import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/model/:id" element={<ModelProfile />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryDetail />} />
          <Route path="/casting" element={<CastingPage />} />
          <Route path="/casting/:id" element={<CastingDetail />} />
          <Route path="/new-faces" element={<NewFacesPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="/discover-path/:slug" element={<DiscoverPathPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/select-role" element={<SelectRolePage />} />
          <Route path="/become-model" element={<BecomeModelPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verification-pending" element={<VerificationPendingPage />} />
          <Route path="/rejected" element={<RejectedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
