import Navbar from "@/components/Navbar";
import HeroSingle from "@/components/HeroSingle";
import CastingEventSection from "@/components/CastingEventSection";
import LatestModelsSlider from "@/components/LatestModelsSlider";
import MagazineGrid from "@/components/MagazineGrid";
import NewFaces from "@/components/NewFaces";
import FeaturedModels from "@/components/FeaturedModels";
import AdBanner from "@/components/AdBanner";
import AdSlider from "@/components/AdSlider";
import TrendingCastings from "@/components/TrendingCastings";
import CaseStudies from "@/components/CaseStudies";
import GetDiscovered from "@/components/GetDiscovered";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import QuickActions from "@/components/QuickActions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <h1 className="sr-only">Model Management Mauritius - Professional Modeling Platform for Models and Talent</h1>
      <Navbar />
      <HeroSingle />
      <CastingEventSection />

      <MagazineGrid />
      <NewFaces homePreview />

      <div className="container mx-auto px-4 md:px-6 py-4">
        <AdBanner />
      </div>

      <FeaturedModels />
      <LatestModelsSlider />

      <AdSlider />

      <QuickActions />

      <TrendingCastings />

      <CaseStudies />
      <GetDiscovered />

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
