import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import model1 from "@/assets/model-1.jpg";
import model2 from "@/assets/model-2.jpg";
import model3 from "@/assets/model-3.jpg";
import model4 from "@/assets/model-4.jpg";

const offers = [
  { id: "1", title: "Professional Headshots Package", image: model1, price: "$299" },
  { id: "2", title: "Portfolio Styling Session", image: model2, price: "$199" },
  { id: "3", title: "Runway Walk Coaching", image: model3, price: "$149" },
  { id: "4", title: "Social Media Branding", image: model4, price: "$249" },
  { id: "5", title: "Fitness Photography", image: model1, price: "$349" },
  { id: "6", title: "Editorial Makeup Artistry", image: model2, price: "$179" },
];

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Hero */}
        <div className="dark-section py-16 mb-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Curated Offers</p>
            <h1 className="font-display text-6xl md:text-8xl text-white mb-4">Marketplace</h1>
            <p className="text-white/50 font-body text-sm max-w-md mx-auto">
              Discover exclusive services and products from industry professionals.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group"
              >
                <div className="relative h-72 overflow-hidden magazine-border mb-4">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 cinematic-overlay" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-3 py-1">{offer.price}</span>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-primary-foreground transition-colors" />
                  </div>
                </div>
                <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">{offer.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketplacePage;
