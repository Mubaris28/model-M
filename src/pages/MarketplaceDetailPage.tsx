import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import BackButton from "@/components/BackButton";
import { motion } from "framer-motion";
import model1 from "@/assets/model-1.jpg";
import model2 from "@/assets/model-2.jpg";
import model3 from "@/assets/model-3.jpg";
import model4 from "@/assets/model-4.jpg";

const offersMap: Record<string, { title: string; image: string | { src: string }; price: string; description: string }> = {
  "1": { title: "Professional Headshots Package", image: model1, price: "$299", description: "A full professional headshot session with our experienced photographers. Includes 5 edited high-resolution images, perfect for your portfolio and LinkedIn. Session duration: 1–2 hours." },
  "2": { title: "Portfolio Styling Session", image: model2, price: "$199", description: "Curated styling and direction to elevate your portfolio. Work with our stylists to create a cohesive look and receive 3 fully edited images. Ideal for new faces building their book." },
  "3": { title: "Runway Walk Coaching", image: model3, price: "$149", description: "One-on-one runway and walk coaching with industry professionals. Learn posture, pacing, and presence. Session includes video review and tips for castings." },
  "4": { title: "Social Media Branding", image: model4, price: "$249", description: "Build your personal brand with a dedicated social media content shoot. Includes 10 edited images and short clips optimized for Instagram and TikTok." },
  "5": { title: "Fitness Photography", image: model1, price: "$349", description: "Athletic and fitness-focused shoot for sportswear and wellness brands. Includes 8 edited images showcasing strength and movement." },
  "6": { title: "Editorial Makeup Artistry", image: model2, price: "$179", description: "Collaboration with professional makeup artists for editorial-style looks. Includes test shoot with 4 edited images for your book." },
};

const MarketplaceDetailPage = () => {
  const { id } = useParams();
  const offer = id ? offersMap[id] : null;

  if (!offer) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-display text-4xl text-foreground mb-4">Offer not found</h1>
          <BackButton label="Back to Marketplace" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <BackButton label="Back to Marketplace" className="mb-8" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[4/5] overflow-hidden magazine-border">
              <img src={imgSrc(offer.image)} alt={offer.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-3 py-1">{offer.price}</span>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-6">{offer.title}</h1>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">{offer.description}</p>
              <button className="bg-primary text-primary-foreground px-8 py-3 font-body text-sm tracking-[0.15em] uppercase hover:opacity-90">
                Book This Offer
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketplaceDetailPage;
