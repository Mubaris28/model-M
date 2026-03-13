import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import NewFacesComp from "@/components/NewFaces";
import AdBanner from "@/components/AdBanner";

const NewFacesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-2">
        <BackButton className="mb-4" />
      </div>
      <div className="pb-4">
        <NewFacesComp />
      </div>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <AdBanner />
      </div>
      <AdBanner variant="cosmetics" />
      <Footer />
    </div>
  );
};

export default NewFacesPage;
