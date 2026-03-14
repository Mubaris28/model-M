import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import model1 from "@/assets/model-1.jpg";
import model2 from "@/assets/model-2.jpg";
import model3 from "@/assets/model-3.jpg";
import model4 from "@/assets/model-4.jpg";

const offers = [
  { id: "1", title: "Professional Headshots Package", image: model1, price: "$299", category: "Photography" },
  { id: "2", title: "Portfolio Styling Session", image: model2, price: "$199", category: "Styling" },
  { id: "3", title: "Runway Walk Coaching", image: model3, price: "$149", category: "Training" },
  { id: "4", title: "Social Media Branding", image: model4, price: "$249", category: "Digital" },
  { id: "5", title: "Fitness Photography", image: model1, price: "$349", category: "Photography" },
  { id: "6", title: "Editorial Makeup Artistry", image: model2, price: "$179", category: "Makeup" },
];

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — dark band */}
      <div className="dark-section py-20 mb-0">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex justify-start mb-4"><BackButton className="text-white/60 hover:text-white" /></div>
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">Curated Offers</p>
          <h1 className="font-display text-6xl md:text-8xl text-white mb-4">Marketplace</h1>
          <p className="text-white/50 font-body text-sm max-w-md mx-auto">
            Discover exclusive services and products from industry professionals.
          </p>
        </div>
      </div>

      <div className="pt-12 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mobile-slider gap-4 md:gap-6" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
            {offers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link to={`/marketplace/${offer.id}`} className="group block">
                  {/* Image — matches category card aspect ratio */}
                  <div className="relative aspect-[3/4] overflow-hidden magazine-border mb-0">
                    <img
                      src={imgSrc(offer.image)}
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 cinematic-overlay" />
                    {/* Category tag top-left */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-primary-foreground text-[9px] font-body tracking-[0.2em] uppercase px-2.5 py-1">
                        {offer.category}
                      </span>
                    </div>
                    {/* Price badge bottom-left */}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-background text-foreground text-xs font-body font-medium tracking-wider px-3 py-1">
                        {offer.price}
                      </span>
                    </div>
                    {/* Arrow top-right */}
                    <div className="absolute top-3 right-3 w-9 h-9 border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                      <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="pt-3">
                    <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                      {offer.title}
                    </h3>
                  </div>
                </Link>
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
