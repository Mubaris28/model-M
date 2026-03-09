import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewFacesComp from "@/components/NewFaces";
import AdBanner from "@/components/AdBanner";

const NewFacesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Discover</p>
          <h1 className="font-display text-6xl md:text-8xl line-accent">New Faces</h1>
          <p className="text-muted-foreground font-body text-sm mt-6 max-w-lg">
            Meet the freshest talent joining our agency. These rising stars are ready to make their mark in the industry.
          </p>
        </div>
      </div>
      <NewFacesComp />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <AdBanner />
      </div>
      <AdBanner variant="cosmetics" />
      <Footer />
    </div>
  );
};

export default NewFacesPage;
