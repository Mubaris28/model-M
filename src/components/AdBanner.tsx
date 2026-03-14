import { Megaphone, ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-next";

const AdBanner = ({ variant = "horizontal" }: { variant?: "horizontal" | "cosmetics" }) => {
  if (variant === "cosmetics") {
    return (
      <section className="w-full overflow-hidden">
        <img
          src="/images/ad/Bodyography-Mobile-ADS.png"
          alt="Bodyography Professional Cosmetics - 30% OFF for Model Management members"
          className="w-full h-auto object-contain block md:hidden"
        />
        <img
          src="/images/ad/Bodyography-Web-ADS.png"
          alt="Bodyography Professional Cosmetics - 30% OFF for Model Management members"
          className="w-full h-auto object-contain hidden md:block"
        />
      </section>
    );
  }

  return (
    <div className="ad-banner p-5 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-red flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase font-body mb-1">Sponsored</p>
            <h3 className="font-display text-xl text-foreground">Premium Casting Opportunities Available</h3>
            <p className="text-muted-foreground text-xs font-body mt-1">
              Top brands seeking fresh talent. Register and get discovered by leading agencies.
            </p>
          </div>
        </div>
        <Link to="/casting" className="bg-gradient-red text-primary-foreground px-6 py-2.5 text-xs font-body font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity whitespace-nowrap inline-flex items-center gap-2">
          Learn More <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default AdBanner;
